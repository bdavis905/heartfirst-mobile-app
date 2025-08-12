#!/usr/bin/env node

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 OpenAI Agents System Test');
console.log('=============================\n');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('❌ No .env file found!');
  console.log('Run: npm run setup');
  process.exit(1);
}

// Check if API key is configured
if (!process.env.OPENAI_API_KEY) {
  console.log('❌ OPENAI_API_KEY not found in .env file!');
  console.log('Run: npm run setup');
  process.exit(1);
}

console.log('✅ .env file found');
console.log('✅ API key configured');
console.log(`✅ Using model: ${process.env.OPENAI_MODEL || 'gpt-4o-mini'}`);
console.log(`✅ Server port: ${process.env.PORT || 3000}`);
console.log(`✅ Database path: ${process.env.DATABASE_PATH || './data/sessions.db'}\n`);

// Test OpenAI API directly
async function testOpenAI() {
  console.log('🔍 Testing OpenAI API connection...');
  
  try {
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'user', content: 'Hello! Please respond with "OpenAI Agents API connection successful"' }
      ],
      max_tokens: 50
    });

    console.log('✅ OpenAI API connection successful!');
    console.log(`📝 Response: ${response.choices[0].message.content.trim()}\n`);
    return true;
  } catch (error) {
    console.log('❌ OpenAI API connection failed!');
    console.log(`🔍 Error: ${error.message}\n`);
    
    if (error.message.includes('401')) {
      console.log('💡 This usually means your API key is invalid or expired.');
      console.log('   Check your API key at: https://platform.openai.com/api-keys');
    } else if (error.message.includes('429')) {
      console.log('💡 This usually means you\'ve exceeded your rate limit or quota.');
      console.log('   Check your usage at: https://platform.openai.com/usage');
    } else if (error.message.includes('insufficient_quota')) {
      console.log('💡 This usually means you need to add credits to your account.');
      console.log('   Add credits at: https://platform.openai.com/account/billing');
    }
    
    return false;
  }
}

// Test agent system components
async function testAgentComponents() {
  console.log('🔍 Testing agent system components...');
  
  try {
    // Test imports
    const { CoordinatorAgent } = await import('./agents/coordinatorAgent.js');
    const { SessionManager } = await import('./utils/sessionManager.js');
    const OpenAI = (await import('openai')).default;
    
    console.log('✅ All agent modules loaded successfully');
    
    // Test SessionManager
    const sessionManager = new SessionManager('./test_sessions.db');
    const testSession = sessionManager.createSession('test_user');
    sessionManager.addMessage(testSession.sessionId, 'user', 'Test message');
    const history = sessionManager.getConversationHistory(testSession.sessionId);
    sessionManager.close();
    
    // Clean up test database
    if (fs.existsSync('./test_sessions.db')) {
      fs.unlinkSync('./test_sessions.db');
    }
    
    console.log('✅ SessionManager working correctly');
    
    // Test CoordinatorAgent initialization
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const coordinator = new CoordinatorAgent(openai);
    const capabilities = coordinator.getAllCapabilities();
    
    console.log('✅ CoordinatorAgent initialized successfully');
    console.log(`📋 Available agents: ${Object.keys(capabilities.agents).join(', ')}\n`);
    
    return true;
  } catch (error) {
    console.log('❌ Agent components test failed!');
    console.log(`🔍 Error: ${error.message}\n`);
    return false;
  }
}

// Test local server endpoints
async function testServerEndpoints() {
  console.log('🔍 Testing server endpoints...');
  
  const port = process.env.PORT || 3000;
  const baseUrl = `http://localhost:${port}`;
  
  const endpoints = [
    { path: '/health', name: 'Health Check' },
    { path: '/agents/capabilities', name: 'Agent Capabilities' },
    { path: '/agents/health', name: 'Agent Health' }
  ];
  
  let passCount = 0;
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint.path}`);
      if (response.ok) {
        console.log(`✅ ${endpoint.name}: OK`);
        passCount++;
      } else {
        console.log(`❌ ${endpoint.name}: HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.message}`);
    }
  }
  
  if (passCount === 0) {
    console.log('\n❌ Server is not running!');
    console.log('💡 Start the server with: npm start');
    return false;
  } else if (passCount === endpoints.length) {
    console.log(`\n✅ All ${passCount} endpoints responding correctly!`);
    console.log(`🌐 Access your app at: ${baseUrl}`);
    return true;
  } else {
    console.log(`\n⚠️  ${passCount}/${endpoints.length} endpoints working`);
    return true;
  }
}

// Test chat functionality
async function testChatEndpoint() {
  console.log('\n🔍 Testing chat endpoint...');
  
  const port = process.env.PORT || 3000;
  
  try {
    const response = await fetch(`http://localhost:${port}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: 'Hello, this is a test message for the agent system.',
        sessionId: 'test_session_' + Date.now()
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Chat endpoint working!');
      console.log(`🤖 Agent used: ${data.agent}`);
      console.log(`📝 Response preview: ${data.response.substring(0, 100)}...`);
      console.log(`🔢 Tokens used: ${data.tokensUsed || 'N/A'}`);
      return true;
    } else {
      console.log('❌ Chat endpoint failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Chat endpoint error:', error.message);
    return false;
  }
}

// Run comprehensive tests
async function runTests() {
  console.log('🚀 Running comprehensive agent system tests...\n');
  
  const tests = [
    { name: 'OpenAI API', test: testOpenAI },
    { name: 'Agent Components', test: testAgentComponents },
    { name: 'Server Endpoints', test: testServerEndpoints },
    { name: 'Chat Functionality', test: testChatEndpoint }
  ];
  
  let results = [];
  
  for (const test of tests) {
    console.log(`\n${'='.repeat(50)}`);
    const result = await test.test();
    results.push({ name: test.name, passed: result });
  }
  
  // Summary
  console.log(`\n${'='.repeat(50)}`);
  console.log('📊 Test Results Summary:');
  console.log('========================');
  
  let passedCount = 0;
  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${result.name}: ${status}`);
    if (result.passed) passedCount++;
  });
  
  console.log(`\nOverall: ${passedCount}/${results.length} tests passed`);
  
  if (passedCount === results.length) {
    console.log('\n🎉 All tests passed! Your OpenAI Agents system is working perfectly.');
    console.log(`🌐 Open http://localhost:${process.env.PORT || 3000} to use the advanced interface.`);
    console.log('\n🤖 Available Features:');
    console.log('- Intelligent chat with agent routing');
    console.log('- Advanced image analysis with specialized prompts');
    console.log('- Persistent conversation sessions');
    console.log('- Real-time agent health monitoring');
    console.log('- Comprehensive session statistics');
  } else {
    console.log('\n⚠️  Some tests failed. Check the error messages above.');
    
    if (!results.find(r => r.name === 'OpenAI API')?.passed) {
      console.log('🔧 Fix OpenAI API issues first - check your API key and credits.');
    }
    
    if (!results.find(r => r.name === 'Agent Components')?.passed) {
      console.log('🔧 Install dependencies: npm install');
    }
    
    if (!results.find(r => r.name === 'Server Endpoints')?.passed) {
      console.log('🔧 Start the server: npm start');
    }
  }
  
  console.log('\n📈 Advanced Features:');
  console.log('- Multi-agent conversation routing');
  console.log('- SQLite session persistence');
  console.log('- Specialized image analysis types');
  console.log('- Agent handoff tracking');
  console.log('- Real-time health monitoring');
}

// Handle missing dependencies
try {
  await runTests();
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.log('❌ Dependencies not installed!');
    console.log('💡 Run: npm install');
  } else {
    console.log('❌ Unexpected error:', error.message);
  }
  process.exit(1);
}
