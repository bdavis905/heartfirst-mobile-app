import OpenAI from 'openai';
import { CoordinatorAgent } from '../agents/coordinatorAgent.js';
import { SessionManager } from '../utils/sessionManager.js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize agents
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
    sodiumLimit: 600
  }
});

const sessionManager = new SessionManager(':memory:');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      imageData, 
      analysisType = 'general',
      sessionId = 'default', 
      userId = 'anonymous' 
    } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Get or create session
    const session = await sessionManager.getOrCreateSession(sessionId, userId);

    // Process the image through coordinator
    const result = await coordinator.processRequest({
      imageData,
      analysisType,
      sessionId,
      userId
    });

    // Add interaction to session
    await sessionManager.addMessage(sessionId, 'user', `[Image uploaded for ${analysisType} analysis]`);
    await sessionManager.addMessage(sessionId, 'assistant', result.response);

    // Record agent interaction
    await sessionManager.recordAgentInteraction(
      sessionId,
      result.agentUsed,
      result.tokensUsed || 0
    );

    res.status(200).json({
      analysis: result.response,
      agentUsed: result.agentUsed,
      analysisType,
      sessionId,
      tokensUsed: result.tokensUsed
    });

  } catch (error) {
    console.error('Image analysis API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
