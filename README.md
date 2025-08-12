# 🤖 OpenAI Agents - Advanced Chat & Image Analysis System

A sophisticated multi-agent AI system built with specialized OpenAI agents for intelligent conversation routing, advanced image analysis, and persistent session management. This application demonstrates modern AI agent architecture with automatic handoffs, specialized capabilities, and comprehensive session tracking.

## 🌟 Features

### **Multi-Agent Architecture**
- 🤖 **ChatAgent**: Specialized for conversations, Q&A, and text-based tasks
- 🖼️ **ImageAgent**: Advanced image analysis with vision capabilities
- 🎯 **CoordinatorAgent**: Intelligent routing and handoff management
- 💾 **SessionManager**: Persistent conversation storage with SQLite

### **Advanced Capabilities**
- 🔄 **Intelligent Agent Routing**: Automatically routes requests to appropriate agents
- 📊 **Real-time Health Monitoring**: Live agent status and performance tracking
- 🗄️ **Persistent Sessions**: SQLite-based conversation history and statistics
- 🎨 **Specialized Image Analysis**: 8 different analysis types for various use cases
- 📈 **Comprehensive Analytics**: Token usage, handoff tracking, and session statistics
- 🔒 **Enterprise Security**: Secure API key handling and data protection

### **Professional Interface**
- 🌐 **Modern Web UI**: Responsive design with real-time updates
- 📱 **Mobile Optimized**: Works seamlessly on all devices
- 🎛️ **Agent Dashboard**: Live status indicators and performance metrics
- 📋 **Session Management**: Full conversation history and statistics
- 🔍 **Advanced Controls**: Multiple analysis types and custom prompts

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Web Interface                        │
│  (Real-time Agent Status • Session Management)         │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                CoordinatorAgent                         │
│  • Intelligent Request Routing                         │
│  • Agent Handoff Management                           │
│  • Context Preservation                               │
└─────────────────┬───────────────┬───────────────────────┘
                  │               │
┌─────────────────▼─┐           ┌─▼─────────────────────────┐
│   ChatAgent       │           │      ImageAgent          │
│ • Conversations   │           │ • Vision Analysis        │
│ • Q&A            │           │ • Object Detection       │
│ • Text Tasks     │           │ • Text Extraction        │
└───────────────────┘           └───────────────────────────┘
                  │               │
                  └───────┬───────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                  SessionManager                             │
│  • SQLite Database • Conversation History                  │
│  • User Sessions • Agent Interactions • Statistics         │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Your System
```bash
npm run setup
```
This interactive setup will guide you through:
- OpenAI API key configuration
- Model selection (gpt-4o-mini, gpt-4o, etc.)
- Database and server settings
- Advanced agent configuration

### 3. Start the Agent System
```bash
npm start
```

### 4. Test Everything
```bash
npm test
```

### 5. Access Your Advanced Interface
Open `http://localhost:3000` to access the full-featured web interface.

## 📡 API Endpoints

### **Core Agent Endpoints**
```http
POST /chat
Content-Type: application/json

{
  "message": "Your message here",
  "sessionId": "optional_session_id",
  "userId": "optional_user_id"
}
```

```http
POST /analyze-image
Content-Type: multipart/form-data

Fields:
- image: Image file (required)
- prompt: Analysis prompt (optional)
- analysisType: Analysis type (optional)
- sessionId: Session ID (optional)
```

### **Agent Management**
- `GET /agents/capabilities` - Get all agent capabilities
- `GET /agents/health` - Check agent system health
- `GET /agents/stats` - Get agent usage statistics

### **Session Management**
- `GET /session/{sessionId}/history` - Get conversation history
- `GET /session/{sessionId}/stats` - Get session statistics
- `DELETE /session/{sessionId}/messages` - Clear conversation
- `DELETE /session/{sessionId}` - Delete entire session
- `GET /user/{userId}/sessions` - Get user's sessions

### **System Health**
- `GET /health` - System health check with database stats

## 🎯 Image Analysis Types

The ImageAgent supports 8 specialized analysis types:

| Type | Description | Use Cases |
|------|-------------|-----------|
| **general** | Comprehensive image description | General purpose analysis |
| **objects** | Object detection and identification | Inventory, cataloging |
| **text** | Text extraction (OCR) | Document processing |
| **people** | People and face analysis | Social media, events |
| **technical** | Technical image assessment | Photography, quality control |
| **artistic** | Artistic and aesthetic analysis | Art, design feedback |
| **marketing** | Marketing-focused analysis | Advertising, branding |
| **accessibility** | Accessibility descriptions | Screen readers, inclusion |

## 🔧 Configuration

### Environment Variables

```bash
# Core Configuration
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
OPENAI_MODEL=gpt-4o-mini

# Database Configuration
DATABASE_PATH=./data/sessions.db

# Agent Configuration (Advanced)
CHAT_AGENT_TEMPERATURE=0.7
IMAGE_AGENT_TEMPERATURE=0.3
MAX_TOKENS=1000
SESSION_CLEANUP_DAYS=30

# Development
DEBUG_MODE=false
NODE_ENV=development
```

### Supported Models

| Model | Best For | Speed | Cost |
|-------|----------|-------|------|
| `gpt-4o-mini` | General use, fast responses | ⚡⚡⚡ | 💰 |
| `gpt-4o` | Complex tasks, high quality | ⚡⚡ | 💰💰💰 |
| `gpt-4` | Premium quality responses | ⚡ | 💰💰💰💰 |
| `gpt-3.5-turbo` | Cost-effective, good quality | ⚡⚡⚡ | 💰 |

## 💾 Database Schema

The system uses SQLite with the following tables:

- **sessions**: User session management
- **messages**: Conversation history with agent metadata
- **agent_interactions**: Detailed agent usage tracking

## 🔍 Usage Examples

### **JavaScript/Fetch API**

**Chat with Agent Routing:**
```javascript
const response = await fetch('/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Explain quantum computing in simple terms',
    sessionId: 'user_session_123'
  })
});

const data = await response.json();
console.log(`Agent: ${data.agent}`);
console.log(`Response: ${data.response}`);
console.log(`Handoff: ${data.handoff?.reason}`);
```

**Advanced Image Analysis:**
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('analysisType', 'marketing');
formData.append('prompt', 'Analyze this image for social media marketing');

const response = await fetch('/analyze-image', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(`Analysis: ${data.analysis}`);
console.log(`Agent: ${data.agent}`);
```

### **cURL Examples**

**Chat Request:**
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the benefits of renewable energy?"}'
```

**Image Analysis:**
```bash
curl -X POST http://localhost:3000/analyze-image \
  -F "image=@/path/to/image.jpg" \
  -F "analysisType=technical" \
  -F "prompt=Analyze the technical quality of this photograph"
```

**Agent Health Check:**
```bash
curl http://localhost:3000/agents/health | jq
```

## 📊 Monitoring & Analytics

### **Real-time Metrics**
- Agent response times and success rates
- Token usage tracking per agent
- Session activity and user engagement
- Handoff frequency and patterns

### **Session Analytics**
- Conversation length and complexity
- Agent utilization patterns
- User interaction preferences
- Error rates and recovery

### **System Health**
- Database performance metrics
- API rate limit monitoring
- Memory and storage usage
- Agent availability status

## 🛡️ Security Features

- **API Key Protection**: Environment variable storage with .gitignore
- **Input Validation**: Comprehensive request validation and sanitization
- **File Security**: Automatic cleanup of uploaded files
- **Session Isolation**: User session data separation
- **Error Handling**: Graceful error handling without data exposure
- **Rate Limiting**: Built-in protection against abuse (configurable)

## 🎛️ Advanced Configuration

### **Agent Customization**
```javascript
// Custom agent configuration
const coordinator = new CoordinatorAgent(openai, {
  chat: {
    model: 'gpt-4o',
    maxTokens: 1500,
    temperature: 0.8
  },
  image: {
    maxTokens: 1200,
    temperature: 0.2
  }
});
```

### **Session Management**
```javascript
// Advanced session configuration
const sessionManager = new SessionManager('./custom/path/sessions.db');

// Cleanup old sessions (30+ days)
sessionManager.cleanupOldSessions(30);

// Get comprehensive statistics
const stats = sessionManager.getDatabaseStats();
```

## 🔧 Development

### **Project Structure**
```
├── agents/
│   ├── chatAgent.js          # Conversation specialist
│   ├── imageAgent.js         # Vision and analysis
│   └── coordinatorAgent.js   # Routing and handoffs
├── utils/
│   └── sessionManager.js     # Database and sessions
├── public/
│   └── index.html           # Advanced web interface
├── server.js                # Main application server
├── setup.js                 # Interactive configuration
├── test-agents.js          # Comprehensive testing
└── README.md               # This documentation
```

### **Adding Custom Agents**
1. Create new agent class extending base functionality
2. Implement `canHandle()` and `process()` methods
3. Register with CoordinatorAgent
4. Update routing logic and capabilities

### **Extending Analysis Types**
1. Add new analysis type to ImageAgent
2. Create specialized prompt template
3. Update web interface options
4. Add documentation and examples

## 🧪 Testing

### **Comprehensive Test Suite**
```bash
npm test
```

Tests include:
- OpenAI API connectivity
- Agent system components
- Server endpoint functionality
- Database operations
- Session management
- Error handling scenarios

### **Manual Testing Scenarios**
1. **Chat Flow**: Test conversation routing and context preservation
2. **Image Analysis**: Upload various image types and analysis modes
3. **Session Persistence**: Verify conversation history across sessions
4. **Agent Handoffs**: Monitor intelligent routing decisions
5. **Error Recovery**: Test system behavior under error conditions

## 🚨 Troubleshooting

### **Common Issues**

**Agent Health Check Failures:**
```bash
# Check agent status
curl http://localhost:3000/agents/health

# Verify API key and credits
npm test
```

**Database Connection Issues:**
```bash
# Check database path and permissions
ls -la data/
# Recreate database if corrupted
rm data/sessions.db && npm start
```

**Image Upload Problems:**
- Verify file size < 10MB
- Check image format compatibility
- Ensure uploads/ directory exists and is writable

**Session Management:**
```bash
# Clear all sessions
curl -X DELETE http://localhost:3000/session/SESSION_ID
# Check session statistics
curl http://localhost:3000/session/SESSION_ID/stats
```

### **Performance Optimization**

1. **Token Management**: Monitor token usage and implement limits
2. **Database Optimization**: Regular cleanup of old sessions
3. **Image Processing**: Implement image compression for large files
4. **Caching**: Add response caching for frequently requested analyses
5. **Rate Limiting**: Configure appropriate limits for your use case

## 📈 Production Deployment

### **Environment Setup**
- Use production-grade database (PostgreSQL recommended)
- Configure proper logging and monitoring
- Set up SSL/TLS certificates
- Implement proper authentication
- Configure backup strategies

### **Scaling Considerations**
- Load balancing for multiple instances
- Database connection pooling
- Redis for session storage
- CDN for static assets
- Container orchestration (Docker/Kubernetes)

## 📝 License

MIT License - Feel free to use this project for your applications.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## 📞 Support

- **OpenAI Issues**: [OpenAI Documentation](https://platform.openai.com/docs)
- **System Issues**: Check logs and health endpoints
- **Feature Requests**: Submit via GitHub issues
- **Performance**: Monitor agent statistics and session metrics

---

**🚀 Built with advanced AI agent architecture for production-ready applications!**
