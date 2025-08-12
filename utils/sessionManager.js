import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

/**
 * Session Manager for persistent conversation storage using SQLite
 * Handles conversation history, user sessions, and agent interactions
 */
export class SessionManager {
  constructor(dbPath = './data/sessions.db') {
    // Ensure data directory exists
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Initialize SQLite database
    this.db = new Database(dbPath);
    this.initializeTables();
  }

  /**
   * Initialize database tables
   */
  initializeTables() {
    // Sessions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        metadata TEXT DEFAULT '{}'
      )
    `);

    // Messages table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        agent_name TEXT,
        tokens_used INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        metadata TEXT DEFAULT '{}',
        FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
      )
    `);

    // Agent interactions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS agent_interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        agent_name TEXT NOT NULL,
        input_text TEXT,
        output_text TEXT,
        tokens_used INTEGER DEFAULT 0,
        success BOOLEAN DEFAULT 1,
        error_message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        metadata TEXT DEFAULT '{}',
        FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
      )
    `);

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
      CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
      CREATE INDEX IF NOT EXISTS idx_agent_interactions_session_id ON agent_interactions(session_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    `);
  }

  /**
   * Create a new session
   */
  createSession(userId = 'default', metadata = {}) {
    const sessionId = uuidv4();
    
    const stmt = this.db.prepare(`
      INSERT INTO sessions (id, user_id, metadata)
      VALUES (?, ?, ?)
    `);

    stmt.run(sessionId, userId, JSON.stringify(metadata));
    
    return {
      sessionId,
      userId,
      created: true,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get or create session
   */
  getOrCreateSession(sessionId, userId = 'default') {
    if (!sessionId) {
      return this.createSession(userId);
    }

    const session = this.getSession(sessionId);
    if (session) {
      return { sessionId, userId: session.user_id, created: false };
    }

    // Session doesn't exist, create new one with provided ID
    const stmt = this.db.prepare(`
      INSERT INTO sessions (id, user_id, metadata)
      VALUES (?, ?, ?)
    `);

    stmt.run(sessionId, userId, JSON.stringify({}));
    
    return { sessionId, userId, created: true };
  }

  /**
   * Get session details
   */
  getSession(sessionId) {
    const stmt = this.db.prepare(`
      SELECT * FROM sessions WHERE id = ?
    `);
    
    const session = stmt.get(sessionId);
    if (session) {
      session.metadata = JSON.parse(session.metadata || '{}');
    }
    
    return session;
  }

  /**
   * Add message to session
   */
  addMessage(sessionId, role, content, agentName = null, tokensUsed = 0, metadata = {}) {
    // Update session timestamp
    this.updateSessionTimestamp(sessionId);

    const stmt = this.db.prepare(`
      INSERT INTO messages (session_id, role, content, agent_name, tokens_used, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      sessionId,
      role,
      content,
      agentName,
      tokensUsed,
      JSON.stringify(metadata)
    );

    return {
      messageId: result.lastInsertRowid,
      sessionId,
      role,
      content,
      agentName,
      tokensUsed,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get conversation history for a session
   */
  getConversationHistory(sessionId, limit = 50) {
    const stmt = this.db.prepare(`
      SELECT role, content, agent_name, tokens_used, created_at, metadata
      FROM messages
      WHERE session_id = ?
      ORDER BY created_at ASC
      LIMIT ?
    `);

    const messages = stmt.all(sessionId, limit);
    
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      agent_name: msg.agent_name,
      tokens_used: msg.tokens_used,
      created_at: msg.created_at,
      metadata: JSON.parse(msg.metadata || '{}')
    }));
  }

  /**
   * Get conversation history in OpenAI format
   */
  getOpenAIHistory(sessionId, limit = 20) {
    const messages = this.getConversationHistory(sessionId, limit);
    
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  /**
   * Record agent interaction
   */
  recordAgentInteraction(sessionId, agentName, inputText, outputText, tokensUsed = 0, success = true, errorMessage = null, metadata = {}) {
    const stmt = this.db.prepare(`
      INSERT INTO agent_interactions (session_id, agent_name, input_text, output_text, tokens_used, success, error_message, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      sessionId,
      agentName,
      inputText,
      outputText,
      tokensUsed,
      success ? 1 : 0,
      errorMessage,
      JSON.stringify(metadata)
    );

    return {
      interactionId: result.lastInsertRowid,
      sessionId,
      agentName,
      success,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Update session timestamp
   */
  updateSessionTimestamp(sessionId) {
    const stmt = this.db.prepare(`
      UPDATE sessions 
      SET updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    stmt.run(sessionId);
  }

  /**
   * Clear session conversation
   */
  clearSession(sessionId) {
    const deleteMessages = this.db.prepare(`DELETE FROM messages WHERE session_id = ?`);
    const deleteInteractions = this.db.prepare(`DELETE FROM agent_interactions WHERE session_id = ?`);
    
    const messagesDeleted = deleteMessages.run(sessionId).changes;
    const interactionsDeleted = deleteInteractions.run(sessionId).changes;
    
    this.updateSessionTimestamp(sessionId);
    
    return {
      sessionId,
      messagesDeleted,
      interactionsDeleted,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Delete session completely
   */
  deleteSession(sessionId) {
    const stmt = this.db.prepare(`DELETE FROM sessions WHERE id = ?`);
    const result = stmt.run(sessionId);
    
    return {
      sessionId,
      deleted: result.changes > 0,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get session statistics
   */
  getSessionStats(sessionId) {
    const messageCount = this.db.prepare(`
      SELECT COUNT(*) as count FROM messages WHERE session_id = ?
    `).get(sessionId);

    const tokenUsage = this.db.prepare(`
      SELECT SUM(tokens_used) as total FROM messages WHERE session_id = ?
    `).get(sessionId);

    const agentUsage = this.db.prepare(`
      SELECT agent_name, COUNT(*) as interactions, SUM(tokens_used) as tokens
      FROM agent_interactions 
      WHERE session_id = ? 
      GROUP BY agent_name
    `).all(sessionId);

    const session = this.getSession(sessionId);

    return {
      sessionId,
      messageCount: messageCount.count,
      totalTokens: tokenUsage.total || 0,
      agentUsage,
      created: session?.created_at,
      lastUpdated: session?.updated_at
    };
  }

  /**
   * Get all user sessions
   */
  getUserSessions(userId, limit = 20) {
    const stmt = this.db.prepare(`
      SELECT id, created_at, updated_at, metadata,
             (SELECT COUNT(*) FROM messages WHERE session_id = sessions.id) as message_count
      FROM sessions 
      WHERE user_id = ?
      ORDER BY updated_at DESC
      LIMIT ?
    `);

    const sessions = stmt.all(userId, limit);
    
    return sessions.map(session => ({
      ...session,
      metadata: JSON.parse(session.metadata || '{}')
    }));
  }

  /**
   * Cleanup old sessions (older than specified days)
   */
  cleanupOldSessions(daysOld = 30) {
    const stmt = this.db.prepare(`
      DELETE FROM sessions 
      WHERE updated_at < datetime('now', '-' || ? || ' days')
    `);
    
    const result = stmt.run(daysOld);
    
    return {
      deletedSessions: result.changes,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Close database connection
   */
  close() {
    this.db.close();
  }

  /**
   * Get database statistics
   */
  getDatabaseStats() {
    const sessionCount = this.db.prepare(`SELECT COUNT(*) as count FROM sessions`).get();
    const messageCount = this.db.prepare(`SELECT COUNT(*) as count FROM messages`).get();
    const interactionCount = this.db.prepare(`SELECT COUNT(*) as count FROM agent_interactions`).get();
    
    return {
      sessions: sessionCount.count,
      messages: messageCount.count,
      interactions: interactionCount.count,
      timestamp: new Date().toISOString()
    };
  }
}
