import { ChatAgent } from './chatAgent.js';
import { ImageAgent } from './imageAgent.js';
import { NutritionAgent } from './nutritionAgent.js';

/**
 * Coordinator Agent that manages handoffs between specialized agents
 * Determines which agent should handle each request and manages the workflow
 */
export class CoordinatorAgent {
  constructor(openaiClient, options = {}) {
    this.client = openaiClient;
    this.name = "CoordinatorAgent";
    
    // Initialize specialized agents
    this.chatAgent = new ChatAgent(openaiClient, options.chat || {});
    this.imageAgent = new ImageAgent(openaiClient, options.image || {});
    this.nutritionAgent = new NutritionAgent(openaiClient, options.nutrition || {});
    
    this.agents = {
      chat: this.chatAgent,
      image: this.imageAgent,
      nutrition: this.nutritionAgent
    };
    
    this.handoffHistory = [];
  }

  /**
   * Route request to appropriate agent based on content and context
   */
  async routeRequest(input, context = {}) {
    const { hasImage, imageData, mimeType, conversationHistory = [], userId } = context;

    try {
      // Log the handoff decision
      const handoff = {
        timestamp: new Date().toISOString(),
        userId,
        hasImage,
        inputLength: input.length,
        agent: null,
        reason: null
      };

      let result;

      if (hasImage && imageData) {
        // Route to Image Agent for image analysis
        handoff.agent = 'image';
        handoff.reason = 'Image data provided';
        
        result = await this.imageAgent.analyzeWithContext(
          imageData, 
          input, 
          conversationHistory, 
          mimeType
        );
        
        result.handoff = handoff;
        
      } else if (this.isNutritionQuery(input)) {
        // Route to specialized nutrition agent for food compliance
        handoff.agent = 'nutrition';
        handoff.reason = 'Food/nutrition compliance query';
        
        result = await this.nutritionAgent.evaluateFood(input, {});
        
        if (result.success) {
          result.response = this.formatNutritionResponse(result.evaluation);
        }
        result.handoff = handoff;
        
      } else if (this.imageAgent.canHandle(input)) {
        // User is asking about images but no image provided
        handoff.agent = 'image';
        handoff.reason = 'Image-related query without image';
        
        result = {
          success: true,
          response: "I'd be happy to help analyze an image! Please upload an image file and I'll provide a detailed analysis. You can ask me to:\n\n• Describe what's in the image\n• Identify specific objects or people\n• Extract text from the image\n• Analyze it for marketing or artistic purposes\n• Provide technical details about the image\n• **Food compliance analysis** - I can evaluate foods for dietary protocol compliance\n\nJust upload an image and let me know what you'd like to know about it!",
          agent: this.imageAgent.name,
          suggestion: "Please upload an image to analyze"
        };
        
      } else {
        // Route to Chat Agent for general conversation
        handoff.agent = 'chat';
        handoff.reason = 'General conversation';
        
        result = await this.chatAgent.processMessage(input, conversationHistory);
        result.handoff = handoff;
      }

      // Store handoff history
      this.handoffHistory.push(handoff);
      
      // Keep handoff history manageable
      if (this.handoffHistory.length > 100) {
        this.handoffHistory = this.handoffHistory.slice(-50);
      }

      return result;

    } catch (error) {
      console.error('CoordinatorAgent Error:', error);
      return {
        success: false,
        error: error.message,
        agent: this.name
      };
    }
  }

  /**
   * Get specialized image analysis with specific type
   */
  async getSpecializedImageAnalysis(imageData, analysisType, mimeType) {
    try {
      return await this.imageAgent.getSpecializedAnalysis(imageData, analysisType, mimeType);
    } catch (error) {
      console.error('Specialized Analysis Error:', error);
      return {
        success: false,
        error: error.message,
        agent: this.imageAgent.name
      };
    }
  }

  /**
   * Get capabilities of all agents
   */
  getAllCapabilities() {
    return {
      coordinator: {
        name: this.name,
        description: "Manages routing and handoffs between specialized agents",
        capabilities: [
          "Intelligent request routing",
          "Agent handoff management",
          "Context preservation",
          "Multi-modal processing"
        ]
      },
      agents: {
        chat: this.chatAgent.getCapabilities(),
        image: this.imageAgent.getCapabilities(),
        nutrition: this.nutritionAgent.getCapabilities()
      }
    };
  }

  /**
   * Get handoff statistics and history
   */
  getHandoffStats() {
    const stats = {
      totalHandoffs: this.handoffHistory.length,
      agentUsage: {},
      recentHandoffs: this.handoffHistory.slice(-10)
    };

    // Calculate agent usage statistics
    this.handoffHistory.forEach(handoff => {
      if (!stats.agentUsage[handoff.agent]) {
        stats.agentUsage[handoff.agent] = 0;
      }
      stats.agentUsage[handoff.agent]++;
    });

    return stats;
  }

  /**
   * Reset handoff history (useful for testing or cleanup)
   */
  resetHandoffHistory() {
    this.handoffHistory = [];
    return { message: "Handoff history cleared", timestamp: new Date().toISOString() };
  }

  /**
   * Health check for all agents
   */
  async healthCheck() {
    const health = {
      coordinator: { status: 'healthy', timestamp: new Date().toISOString() },
      agents: {}
    };

    // Test each agent
    try {
      // Test chat agent
      const chatTest = await this.chatAgent.processMessage("Hello", []);
      health.agents.chat = {
        status: chatTest.success ? 'healthy' : 'error',
        model: this.chatAgent.model,
        lastError: chatTest.error || null
      };
    } catch (error) {
      health.agents.chat = { status: 'error', error: error.message };
    }

    // Image agent health is checked when actually processing images
    health.agents.image = {
      status: 'ready',
      model: this.imageAgent.model,
      note: 'Health checked on image processing'
    };

    // Nutrition agent health
    health.agents.nutrition = {
      status: 'ready',
      mode: this.nutritionAgent.mode,
      note: 'Specialized nutrition compliance agent ready'
    };

    return health;
  }

  /**
   * Determine if input is a nutrition/food compliance query
   */
  isNutritionQuery(input) {
    const nutritionKeywords = [
      'food', 'eat', 'recipe', 'ingredient', 'nutrition', 'diet', 'meal',
      'compliant', 'allowed', 'forbidden', 'sodium', 'oil', 'fat', 'sugar',
      'animal product', 'dairy', 'meat', 'fish', 'egg', 'nuts', 'avocado',
      'smoothie', 'juice', 'whole grain', 'refined', 'soy', 'coffee',
      'greens', 'vegetable', 'fruit', 'legume', 'bean', 'lentil',
      'calories', 'serving', 'label', 'package', 'brand', 'restaurant',
      'plant milk', 'oat milk', 'almond milk', 'soy milk', 'rice milk',
      'gums', 'emulsifier', 'natural flavor', 'palmitate', 'lecithin'
    ];
    
    const lowercaseInput = input.toLowerCase();
    return nutritionKeywords.some(keyword => lowercaseInput.includes(keyword));
  }

  /**
   * Format nutrition agent response for user-friendly display
   */
  formatNutritionResponse(evaluation) {
    if (!evaluation) return "Unable to evaluate food compliance.";

    const { verdict, reasons, fixes, notes, suggested_swaps, flags } = evaluation;
    
    let response = `**${verdict.toUpperCase()} for Reversal Protocol**\n\n`;
    
    if (verdict === 'compliant') {
      response += `✅ This item appears to be compliant with the reversal dietary protocol.\n\n`;
    } else {
      response += `❌ This item is NOT compliant with the reversal dietary protocol.\n\n`;
      
      if (reasons && reasons.length > 0) {
        response += `**Issues identified:**\n${reasons.map(r => `• ${r}`).join('\n')}\n\n`;
      }
    }
    
    if (notes) {
      response += `**Details:** ${notes}\n\n`;
    }
    
    if (fixes && fixes.length > 0) {
      response += `**Suggested fixes:**\n${fixes.map(f => `• ${f}`).join('\n')}\n\n`;
    }
    
    if (suggested_swaps && suggested_swaps.length > 0) {
      response += `**Better alternatives:**\n`;
      suggested_swaps.forEach(swap => {
        response += `• Replace "${swap.swap_out}" with "${swap.swap_in}" (${swap.why})\n`;
      });
      response += '\n';
    }
    
    // Add key flags information
    const flagMessages = [];
    if (flags.contains_animal_product) flagMessages.push("Contains animal products");
    if (flags.contains_oil_or_hidden_fats) flagMessages.push("Contains oils or hidden fats");
    if (flags.high_fat_plant_food) flagMessages.push("High-fat plant food");
    if (flags.added_sugars_or_syrups) flagMessages.push("Contains added sugars");
    if (flags.smoothie_or_juice) flagMessages.push("Liquid calories (should be chewed)");
    if (flags.caffeinated_coffee) flagMessages.push("Contains caffeine");
    
    if (flagMessages.length > 0) {
      response += `**Key concerns:** ${flagMessages.join(', ')}\n\n`;
    }
    
    response += `*This evaluation follows strict reversal mode dietary guidelines for cardiovascular health.*`;
    
    return response;
  }

  /**
   * Get nutrition agent for direct access
   */
  getNutritionAgent() {
    return this.nutritionAgent;
  }
}
