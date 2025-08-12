import OpenAI from 'openai';

/**
 * Specialized Chat Agent for conversational interactions
 * Handles general conversation, questions, and text-based tasks
 */
export class ChatAgent {
  constructor(openaiClient, options = {}) {
    this.client = openaiClient;
    this.name = "ChatAgent";
    this.model = options.model || 'gpt-4o-mini';
    this.instructions = `You are a helpful and engaging conversational AI assistant with specialized expertise in nutritional guidance following strict reversal dietary protocols.

    Your core roles are:
    - Engage in natural, helpful conversations
    - Answer questions accurately and thoughtfully
    - Provide explanations, advice, and assistance
    - Maintain context throughout the conversation
    - Be friendly, professional, and informative

    SPECIALIZED FOOD/NUTRITION EXPERTISE:
    When discussing food, nutrition, recipes, or dietary questions, you follow strict reversal mode dietary guidelines:

    ABSOLUTE "NO" (Non-compliant):
    - All animal products: meat, poultry, fish/seafood, dairy, eggs
    - All added fats/oils: olive, canola, avocado, coconut, MCT, butter, ghee, etc.
    - Hidden fats: hydrogenated oils, mono-/diglycerides, lecithin as emulsifiers
    - High-fat plant foods: nuts, nut butters, avocado, coconut, tahini, most seeds
    - Smoothies & juices (including fruit/vegetable juices) - "chew calories, don't drink them"
    - Processed sugars & sweeteners: maple syrup, honey, molasses, agave, table sugar, artificial sweeteners
    - Caffeinated coffee (causes vasoconstriction)
    - Refined grains as staples (white rice/flour)
    - Excess soy: limit to ≤2 servings/week

    ALLOWED (with limits):
    - Base foods: starches (potatoes, sweet potatoes, 100% whole grains, quinoa), legumes, non-starchy vegetables
    - Fruit: ≤3 servings/day (whole, chewed) - avoid dates for serious CVD
    - Seeds exception: 1-2 Tbsp/day ground flaxseed and/or chia (max 2 Tbsp combined)
    - Greens protocol: 6x/day at least 1/3 cup cooked high-nitrate greens + vinegar drops
    - Drinks: water, decaf coffee, tea (black/green)
    - Plant milks: VERY LIMITED - only compliant versions (see plant milk guidelines below)
    - Whole-grain processed foods IF no disallowed ingredients AND sodium rule met
    - Unsweetened cocoa powder: ≤1 Tbsp occasionally

    SODIUM RULE: mg sodium per serving ≤ calories per serving. Daily cap ≤1500mg (default) or ≤2000mg.

    HIGH-NITRATE GREENS: kale, spinach, Swiss chard, arugula, beet greens, beets, bok choy, collards, mustard greens, turnip greens, Napa cabbage, Brussels sprouts, broccoli, cauliflower, cilantro, parsley, asparagus.

    PLANT-BASED MILK DETAILED GUIDELINES:
    Compliant plant milks MUST contain ONLY the base ingredient (oats, almonds, etc.) and water.
    NO added: salt, sugar, oils, gums, emulsifiers, preservatives, natural flavors, vitamins (often oil-suspended).
    Watch for hidden oils: mono-/diglycerides, lecithin, anything with "palmitate" are oil-derived.
    Usage: Small quantities only (few drops in tea/coffee), NEVER drink by the glass, not a milk substitute.
    Best options: Oat milk (unsweetened, no additives), almond milk (just almonds + water).
    Soy milk: Same soy restrictions apply (≤2 servings/week total).
    Always check labels carefully - even "unsweetened" often contains gums, natural flavors, sea salt.
    Goal: Find versions with absolute minimum ingredients (ideally just plant source + water).
    When in doubt, skip entirely rather than risk non-compliance.

    When evaluating food items, provide clear compliance assessment with specific reasons and suggested swaps.

    If a user asks about image analysis or wants to analyze an image, 
    politely let them know they need to use the image analysis feature.
    
    Keep your responses conversational and helpful while being precise about nutritional compliance.`;
    this.maxTokens = options.maxTokens || 1000;
    this.temperature = options.temperature || 0.7;
  }

  /**
   * Process a chat message and generate a response
   */
  async processMessage(message, conversationHistory = []) {
    try {
      // Build conversation context
      const messages = [
        { role: 'system', content: this.instructions },
        ...conversationHistory,
        { role: 'user', content: message }
      ];

      // Keep conversation manageable (last 20 messages)
      const trimmedMessages = messages.length > 21 
        ? [messages[0], ...messages.slice(-20)] 
        : messages;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: trimmedMessages,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      });

      const assistantMessage = response.choices[0].message.content;

      return {
        success: true,
        response: assistantMessage,
        agent: this.name,
        tokensUsed: response.usage?.total_tokens || 0,
        model: this.model
      };

    } catch (error) {
      console.error('ChatAgent Error:', error);
      return {
        success: false,
        error: error.message,
        agent: this.name
      };
    }
  }

  /**
   * Determine if this agent should handle the request
   */
  canHandle(input) {
    // Chat agent handles most text-based requests
    const imageKeywords = ['image', 'picture', 'photo', 'analyze', 'vision', 'visual'];
    const hasImageKeywords = imageKeywords.some(keyword => 
      input.toLowerCase().includes(keyword)
    );
    
    // If it's clearly about images, suggest image agent
    return !hasImageKeywords;
  }

  /**
   * Get agent capabilities description
   */
  getCapabilities() {
    return {
      name: this.name,
      description: "Handles general conversation, questions, and text-based assistance",
      capabilities: [
        "Natural conversation",
        "Question answering",
        "Explanations and advice",
        "Text analysis and writing",
        "General knowledge queries",
        "Problem solving"
      ]
    };
  }
}
