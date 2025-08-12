#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🤖 OpenAI Agents Setup - Advanced AI System');
console.log('=============================================\n');

console.log('This script will help you configure your OpenAI Agents system securely.\n');

// Check if .env already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('⚠️  A .env file already exists. This will overwrite it.');
  rl.question('Continue? (y/N): ', (answer) => {
    if (answer.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
    promptForConfig();
  });
} else {
  promptForConfig();
}

function promptForConfig() {
  console.log('\n📝 Please provide the following information:');
  console.log('(Press Enter to use default values shown in brackets)\n');

  const config = {};

  rl.question('OpenAI API Key (required): ', (apiKey) => {
    if (!apiKey.trim()) {
      console.log('❌ OpenAI API Key is required!');
      console.log('Get your API key from: https://platform.openai.com/api-keys');
      rl.close();
      return;
    }

    config.OPENAI_API_KEY = apiKey.trim();

    rl.question('Port [3000]: ', (port) => {
      config.PORT = port.trim() || '3000';

      rl.question('OpenAI Model [gpt-4o-mini]: ', (model) => {
        config.OPENAI_MODEL = model.trim() || 'gpt-4o-mini';

        // Validate model choice
        const validModels = ['gpt-4o-mini', 'gpt-4o', 'gpt-4', 'gpt-3.5-turbo'];
        if (!validModels.includes(config.OPENAI_MODEL)) {
          console.log(`\n⚠️  Warning: "${config.OPENAI_MODEL}" is not a recognized model.`);
          console.log(`Valid models: ${validModels.join(', ')}`);
          console.log('Proceeding anyway...\n');
        }

        rl.question('Database Path [./data/sessions.db]: ', (dbPath) => {
          config.DATABASE_PATH = dbPath.trim() || './data/sessions.db';

          rl.question('Enable Debug Mode? (y/N): ', (debug) => {
            config.DEBUG_MODE = debug.toLowerCase() === 'y' ? 'true' : 'false';

            createEnvFile(config);
            rl.close();
          });
        });
      });
    });
  });
}

function createEnvFile(config) {
  const envContent = `# OpenAI Agents Configuration
OPENAI_API_KEY=${config.OPENAI_API_KEY}

# Server Configuration
PORT=${config.PORT}

# AI Model Configuration
OPENAI_MODEL=${config.OPENAI_MODEL}

# Database Configuration
DATABASE_PATH=${config.DATABASE_PATH}

# Debug and Development
DEBUG_MODE=${config.DEBUG_MODE}
NODE_ENV=development

# Agent Configuration (Advanced)
# CHAT_AGENT_TEMPERATURE=0.7
# IMAGE_AGENT_TEMPERATURE=0.3
# MAX_TOKENS=1000
# SESSION_CLEANUP_DAYS=30
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file created successfully!');
    
    // Create data directory
    const dataDir = path.dirname(config.DATABASE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log(`✅ Created data directory: ${dataDir}`);
    }

    console.log('\n🔐 Security reminder:');
    console.log('- Your API key is now stored securely in the .env file');
    console.log('- The .env file is excluded from version control');
    console.log('- Never share your .env file or commit it to git');
    console.log('- Session data will be stored in SQLite database');
    
    console.log('\n🤖 Agent System Features:');
    console.log('- ChatAgent: Specialized for conversations and text tasks');
    console.log('- ImageAgent: Advanced image analysis and vision tasks');
    console.log('- CoordinatorAgent: Intelligent routing and handoffs');
    console.log('- SessionManager: Persistent conversation storage');
    
    console.log('\n🚀 Next steps:');
    console.log('1. Run: npm install');
    console.log('2. Run: npm start');
    console.log('3. Open: http://localhost:' + config.PORT);
    console.log('4. Test: npm test (optional)');
    
    console.log('\n📚 Available endpoints:');
    console.log(`- Chat: http://localhost:${config.PORT}/chat`);
    console.log(`- Image Analysis: http://localhost:${config.PORT}/analyze-image`);
    console.log(`- Agent Health: http://localhost:${config.PORT}/agents/health`);
    console.log(`- Agent Stats: http://localhost:${config.PORT}/agents/stats`);
    console.log(`- Session Management: http://localhost:${config.PORT}/session/{sessionId}`);
    
    console.log('\n📖 For detailed documentation, see the README.md file');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }
}

// Handle Ctrl+C
rl.on('SIGINT', () => {
  console.log('\n\nSetup cancelled.');
  rl.close();
});

rl.on('close', () => {
  console.log('\nGoodbye! 👋');
  process.exit(0);
});
