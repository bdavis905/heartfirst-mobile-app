import express from 'express';
import multer from 'multer';
import cors from 'cors';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import our specialized agents
import { CoordinatorAgent } from './agents/coordinatorAgent.js';
import { SessionManager } from './utils/sessionManager.js';

// Load environment variables
dotenv.config();

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Coordinator Agent and Session Manager
const coordinator = new CoordinatorAgent(openai, {
  chat: {
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    maxTokens: 1000,
    temperature: 0.7
  },
  image: {
    maxTokens: 1000,
    temperature: 0.3
  },
  nutrition: {
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    maxTokens: 800,
    temperature: 0.1,
    mode: 'reversal',
    sodiumLimit: 1500
  }
});

const sessionManager = new SessionManager();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    agents: coordinator.getAllCapabilities(),
    database: sessionManager.getDatabaseStats()
  });
});

// Agent capabilities endpoint
app.get('/agents/capabilities', (req, res) => {
  res.json(coordinator.getAllCapabilities());
});

// Agent health check
app.get('/agents/health', async (req, res) => {
  try {
    const health = await coordinator.healthCheck();
    res.json(health);
  } catch (error) {
    res.status(500).json({ error: 'Health check failed', details: error.message });
  }
});

// Chat endpoint with agent routing
app.post('/chat', async (req, res) => {
  try {
    const { message, sessionId, userId = 'default' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get or create session
    const session = sessionManager.getOrCreateSession(sessionId, userId);
    
    // Get conversation history
    const conversationHistory = sessionManager.getOpenAIHistory(session.sessionId, 20);

    // Add user message to session
    sessionManager.addMessage(session.sessionId, 'user', message);

    // Route to appropriate agent
    const result = await coordinator.routeRequest(message, {
      conversationHistory,
      userId: session.userId,
      sessionId: session.sessionId
    });

    if (result.success) {
      // Add assistant response to session
      sessionManager.addMessage(
        session.sessionId, 
        'assistant', 
        result.response,
        result.agent,
        result.tokensUsed || 0
      );

      // Record agent interaction
      sessionManager.recordAgentInteraction(
        session.sessionId,
        result.agent,
        message,
        result.response,
        result.tokensUsed || 0,
        true,
        null,
        { handoff: result.handoff }
      );

      res.json({
        response: result.response,
        agent: result.agent,
        sessionId: session.sessionId,
        userId: session.userId,
        tokensUsed: result.tokensUsed,
        handoff: result.handoff,
        timestamp: new Date().toISOString()
      });

    } else {
      // Record failed interaction
      sessionManager.recordAgentInteraction(
        session.sessionId,
        result.agent || 'unknown',
        message,
        null,
        0,
        false,
        result.error
      );

      res.status(500).json({
        error: 'Failed to process message',
        details: result.error,
        agent: result.agent,
        sessionId: session.sessionId
      });
    }

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Image analysis endpoint with specialized agents
app.post('/analyze-image', upload.single('image'), async (req, res) => {
  try {
    const { prompt = 'What do you see in this image?', analysisType = 'general', sessionId, userId = 'default' } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Get or create session
    const session = sessionManager.getOrCreateSession(sessionId, userId);

    // Read and encode image
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    let result;

    if (analysisType === 'general') {
      // Get conversation history for context
      const conversationHistory = sessionManager.getOpenAIHistory(session.sessionId, 10);

      // Route through coordinator for context-aware analysis
      result = await coordinator.routeRequest(prompt, {
        hasImage: true,
        imageData: base64Image,
        mimeType: req.file.mimetype,
        conversationHistory,
        userId: session.userId,
        sessionId: session.sessionId
      });
    } else {
      // Use specialized analysis
      result = await coordinator.getSpecializedImageAnalysis(
        base64Image,
        analysisType,
        req.file.mimetype
      );
    }

    // Clean up uploaded file
    fs.unlinkSync(imagePath);

    if (result.success) {
      // Add user message and response to session
      sessionManager.addMessage(session.sessionId, 'user', `[Image uploaded] ${prompt}`);
      sessionManager.addMessage(
        session.sessionId,
        'assistant',
        result.analysis || result.response,
        result.agent,
        result.tokensUsed || 0
      );

      // Record agent interaction
      sessionManager.recordAgentInteraction(
        session.sessionId,
        result.agent,
        `[Image Analysis: ${analysisType}] ${prompt}`,
        result.analysis || result.response,
        result.tokensUsed || 0,
        true,
        null,
        { 
          analysisType,
          filename: req.file.originalname,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          handoff: result.handoff
        }
      );

      res.json({
        analysis: result.analysis || result.response,
        agent: result.agent,
        analysisType,
        filename: req.file.originalname,
        sessionId: session.sessionId,
        userId: session.userId,
        tokensUsed: result.tokensUsed,
        prompt: result.prompt || prompt,
        timestamp: new Date().toISOString()
      });

    } else {
      // Record failed interaction
      sessionManager.recordAgentInteraction(
        session.sessionId,
        result.agent || 'ImageAgent',
        `[Image Analysis Failed: ${analysisType}] ${prompt}`,
        null,
        0,
        false,
        result.error,
        { analysisType, filename: req.file.originalname }
      );

      res.status(500).json({
        error: 'Failed to analyze image',
        details: result.error,
        agent: result.agent,
        sessionId: session.sessionId
      });
    }

  } catch (error) {
    console.error('Image analysis error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      error: 'Failed to analyze image',
      details: error.message 
    });
  }
});

// Session management endpoints

// Get conversation history
app.get('/session/:sessionId/history', (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50 } = req.query;
    
    const history = sessionManager.getConversationHistory(sessionId, parseInt(limit));
    const stats = sessionManager.getSessionStats(sessionId);
    
    res.json({
      sessionId,
      history,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get history', details: error.message });
  }
});

// Get session statistics
app.get('/session/:sessionId/stats', (req, res) => {
  try {
    const { sessionId } = req.params;
    const stats = sessionManager.getSessionStats(sessionId);
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats', details: error.message });
  }
});

// Clear session conversation
app.delete('/session/:sessionId/messages', (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = sessionManager.clearSession(sessionId);
    
    res.json({
      message: 'Session conversation cleared',
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear session', details: error.message });
  }
});

// Delete entire session
app.delete('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = sessionManager.deleteSession(sessionId);
    
    res.json({
      message: 'Session deleted',
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete session', details: error.message });
  }
});

// Get user sessions
app.get('/user/:userId/sessions', (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;
    
    const sessions = sessionManager.getUserSessions(userId, parseInt(limit));
    
    res.json({
      userId,
      sessions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user sessions', details: error.message });
  }
});

// Agent statistics and handoff history
app.get('/agents/stats', (req, res) => {
  try {
    const stats = coordinator.getHandoffStats();
    const dbStats = sessionManager.getDatabaseStats();
    
    res.json({
      handoffs: stats,
      database: dbStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get agent stats', details: error.message });
  }
});

// Nutrition evaluation endpoint
app.post('/evaluate-nutrition', async (req, res) => {
  try {
    const { item, nutritionInfo, ingredientList, servingSize, sessionId, userId = 'default' } = req.body;

    if (!item) {
      return res.status(400).json({ error: 'Food item description is required' });
    }

    // Get or create session
    const session = sessionManager.getOrCreateSession(sessionId, userId);

    // Get nutrition agent for direct evaluation
    const nutritionAgent = coordinator.getNutritionAgent();
    
    const result = await nutritionAgent.evaluateFood(item, {
      nutritionInfo,
      ingredientList,
      servingSize
    });

    if (result.success) {
      // Add user query and response to session
      sessionManager.addMessage(session.sessionId, 'user', `[Nutrition Query] ${item}`);
      sessionManager.addMessage(
        session.sessionId,
        'assistant',
        JSON.stringify(result.evaluation),
        result.agent,
        result.tokensUsed || 0
      );

      // Record agent interaction
      sessionManager.recordAgentInteraction(
        session.sessionId,
        result.agent,
        `[Nutrition Evaluation] ${item}`,
        JSON.stringify(result.evaluation),
        result.tokensUsed || 0,
        true,
        null,
        { 
          mode: result.mode,
          verdict: result.evaluation.verdict,
          nutritionInfo: !!nutritionInfo,
          ingredientList: !!ingredientList
        }
      );

      res.json({
        evaluation: result.evaluation,
        agent: result.agent,
        mode: result.mode,
        sessionId: session.sessionId,
        userId: session.userId,
        tokensUsed: result.tokensUsed,
        timestamp: new Date().toISOString()
      });

    } else {
      // Record failed interaction
      sessionManager.recordAgentInteraction(
        session.sessionId,
        result.agent || 'NutritionAgent',
        `[Nutrition Evaluation Failed] ${item}`,
        null,
        0,
        false,
        result.error
      );

      res.status(500).json({
        error: 'Failed to evaluate nutrition',
        details: result.error,
        agent: result.agent,
        sessionId: session.sessionId
      });
    }

  } catch (error) {
    console.error('Nutrition evaluation error:', error);
    res.status(500).json({ 
      error: 'Failed to evaluate nutrition',
      details: error.message 
    });
  }
});

// Set nutrition agent mode
app.post('/agents/nutrition/mode', (req, res) => {
  try {
    const { mode } = req.body;
    
    if (!mode || !['reversal', 'prevention'].includes(mode)) {
      return res.status(400).json({ error: 'Mode must be "reversal" or "prevention"' });
    }

    const nutritionAgent = coordinator.getNutritionAgent();
    const result = nutritionAgent.setMode(mode);
    
    res.json({
      message: 'Nutrition agent mode updated',
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set nutrition mode', details: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Max size is 10MB.' });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error', details: error.message });
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  sessionManager.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...');
  sessionManager.close();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OpenAI Agents Server running on port ${PORT}`);
  console.log(`📱 Chat endpoint: http://localhost:${PORT}/chat`);
  console.log(`🖼️  Image analysis endpoint: http://localhost:${PORT}/analyze-image`);
  console.log(`🥗 Nutrition evaluation: http://localhost:${PORT}/evaluate-nutrition`);
  console.log(`📊 Agent capabilities: http://localhost:${PORT}/agents/capabilities`);
  console.log(`💾 Session management: http://localhost:${PORT}/session/{sessionId}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  
  // Check if API key is configured
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    console.warn('⚠️  WARNING: OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.');
  } else {
    console.log('✅ OpenAI API key configured');
    console.log(`🤖 Using model: ${process.env.OPENAI_MODEL || 'gpt-4o-mini'}`);
  }
});

export default app;
