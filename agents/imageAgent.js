import OpenAI from 'openai';

/**
 * Specialized Image Analysis Agent for visual content processing
 * Handles image analysis, description, and vision-based tasks
 */
export class ImageAgent {
  constructor(openaiClient, options = {}) {
    this.client = openaiClient;
    this.name = "ImageAgent";
    this.model = 'gpt-4o-mini'; // Vision model
    this.instructions = `You are a specialized image analysis AI agent with advanced vision capabilities and expert knowledge in nutritional compliance for reversal dietary protocols.

    Your core roles are:
    - Analyze images with precision and detail
    - Describe visual content comprehensively
    - Identify objects, people, text, and scenes
    - Provide insights about composition, style, and context
    - Answer specific questions about image content
    - Suggest improvements or modifications if asked

    SPECIALIZED FOOD IMAGE ANALYSIS:
    When analyzing food images, ingredients, recipes, menus, or nutrition labels, apply strict reversal mode dietary evaluation:

    IDENTIFY & FLAG AS NON-COMPLIANT:
    - All animal products: meat, poultry, fish/seafood, dairy, eggs, cheese, milk, yogurt
    - All added fats/oils: olive oil, canola, avocado oil, coconut oil, MCT, butter, ghee, vegetable oils
    - Hidden fats: hydrogenated/partially hydrogenated oils, mono-/diglycerides, lecithin as emulsifiers
    - High-fat plant foods: nuts, nut butters, avocado, coconut, tahini, most seeds (except flax/chia allowance)
    - Smoothies & juices (blended/juiced fruits/vegetables) - flag with "chew calories, don't drink them"
    - Processed sugars & sweeteners: maple syrup, honey, molasses, agave, table sugar, artificial sweeteners
    - Caffeinated coffee products
    - Refined grains as main ingredients (white rice, white flour products)
    - Excessive soy products (>2 servings/week total)

    IDENTIFY & APPROVE AS COMPLIANT:
    - Starches: potatoes, sweet potatoes, 100% whole grains, quinoa
    - Legumes: beans, peas, lentils, chickpeas
    - Non-starchy vegetables (unlimited)
    - Fruits (note if >3 servings visible, mention 3/day limit)
    - Ground flaxseed/chia seeds (note 1-2 Tbsp/day limit)
    - High-nitrate greens: kale, spinach, Swiss chard, arugula, beet greens, bok choy, collards, mustard greens, broccoli, etc.
    - Water, decaf coffee, tea
    - Plant milks: ONLY if minimal ingredients (plant + water only), small quantities only
    - Whole-grain processed foods (IF ingredients check passes)
    - Unsweetened cocoa powder (note occasional use, ≤1 Tbsp)

    PLANT-BASED MILK LABEL ANALYSIS:
    For plant milks, check ingredients list carefully:
    COMPLIANT: Only plant source (oats, almonds, etc.) + water
    FLAG AS NON-COMPLIANT: salt, sugar, oils, gums (gellan, guar), emulsifiers, preservatives, natural flavors, vitamins (often oil-suspended), mono-/diglycerides, lecithin, anything with "palmitate"
    Usage note: Even compliant versions - small quantities only, never by the glass
    Soy milk: Count toward soy limit (≤2 servings/week total)

    NUTRITION LABEL ANALYSIS:
    Apply sodium rule: mg sodium per serving ≤ calories per serving
    Check ingredient list for hidden oils, sugars, animal products
    Flag non-compliant ingredients specifically

    SPECIALIZED IMAGE ANALYSIS SCENARIOS:

    1. FOOD LABELS (up-close):
    - Read ingredient list completely
    - Apply sodium rule if nutrition facts visible
    - Flag every non-compliant ingredient specifically
    - Provide clear verdict and suggested alternatives

    2. REFRIGERATOR/PANTRY OVERVIEW:
    - Scan all visible items systematically
    - Categorize: "Compliant," "Non-compliant," "Need closer look"
    - For items where ingredients aren't clear, ask for specific product details
    - Provide overall compliance assessment and priority items to replace
    - Give shopping guidance for compliant alternatives

    3. COUNTER/INGREDIENT SPREAD:
    - Analyze each visible ingredient/product
    - Group compliant vs non-compliant items
    - For packaged items with unclear labels, request closer photos or ingredient lists
    - Suggest recipe modifications using only compliant ingredients

    4. RESTAURANT MENUS:
    - Identify potentially compliant menu items
    - List required modifications for each option (e.g., "no oil," "no cheese," "steamed not sautéed")
    - Provide specific questions to ask servers about preparation methods
    - Suggest custom requests (e.g., "plain steamed vegetables," "baked potato with no toppings")
    - Warn about hidden oils, animal products, and high-sodium preparations
    - Give backup options if primary choices aren't available

    PROVIDE STRUCTURED FOOD ANALYSIS:
    When analyzing food images, always include:
    1. Image type identification (label/fridge/pantry/counter/menu)
    2. Compliance assessment for each visible item
    3. Specific non-compliant ingredients/preparations identified
    4. Required modifications or clarifications needed
    5. Questions to ask for unclear items
    6. Suggested alternatives and next steps
    7. Server questions for restaurant menus
    8. Priority items to replace (for pantry/fridge analysis)

    For non-food images, provide standard comprehensive visual analysis.
    Be specific about what you observe and avoid assumptions about non-visible elements.`;
    this.maxTokens = options.maxTokens || 1000;
    this.temperature = options.temperature || 0.3; // Lower temperature for more precise analysis
  }

  /**
   * Analyze an image with optional custom prompt
   */
  async analyzeImage(imageData, prompt = "What do you see in this image?", mimeType = "image/jpeg") {
    try {
      // First, validate if this is a food-related image
      const validationResult = await this.validateFoodImage(imageData, mimeType);
      
      if (!validationResult.isFoodRelated) {
        return {
          success: true,
          analysis: validationResult.politeResponse,
          agent: this.name,
          tokensUsed: validationResult.tokensUsed || 0,
          model: this.model,
          prompt: prompt,
          imageValidation: 'non-food-content'
        };
      }

      const messages = [
        {
          role: 'system',
          content: this.instructions
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${imageData}`
              }
            }
          ]
        }
      ];

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      });

      const analysis = response.choices[0].message.content;

      return {
        success: true,
        analysis: analysis,
        agent: this.name,
        tokensUsed: response.usage?.total_tokens || 0,
        model: this.model,
        prompt: prompt,
        imageValidation: 'food-related'
      };

    } catch (error) {
      console.error('ImageAgent Error:', error);
      return {
        success: false,
        error: error.message,
        agent: this.name
      };
    }
  }

  /**
   * Validate if an image contains food-related content
   */
  async validateFoodImage(imageData, mimeType = "image/jpeg") {
    try {
      const validationPrompt = `Look at this image and determine if it contains any food-related content. 

      FOOD-RELATED CONTENT includes:
      - Food items, ingredients, meals, snacks
      - Food packaging, labels, nutrition facts
      - Restaurant menus, cafe menus, food menus
      - Kitchen items with food visible (refrigerator contents, pantry items, counter ingredients)
      - Beverages and drinks
      - Food preparation scenes
      - Grocery store food sections

      NON-FOOD CONTENT includes:
      - People (unless they're eating or preparing food)
      - Landscapes, nature scenes
      - Buildings, architecture
      - Vehicles, transportation
      - Animals (unless food animals in food context)
      - Technology, electronics
      - Art, decorations
      - Random objects unrelated to food

      Respond with ONLY:
      "FOOD-RELATED" if the image contains any food, food packaging, menus, or food preparation content.
      "NON-FOOD" if the image does not contain food-related content.`;

      const messages = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: validationPrompt
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${imageData}`
              }
            }
          ]
        }
      ];

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages,
        max_tokens: 50,
        temperature: 0.1,
      });

      const result = response.choices[0].message.content.trim().toLowerCase();
      const isFoodRelated = result.includes('food-related');

      if (!isFoodRelated) {
        const politeResponses = [
          "I'm specialized in analyzing food-related content for dietary compliance. I can see this image contains non-food content. Please upload an image of:\n\n• Food labels or ingredient lists\n• Your refrigerator or pantry contents\n• Restaurant menus\n• Ingredients or food items\n• Meals or food preparations\n\nI'm here to help you navigate the reversal dietary protocol with food-related images!",
          
          "Thank you for the image! I'm designed specifically to help with food compliance analysis. This appears to be a non-food related image. I'd be happy to help you analyze:\n\n🏷️ Food product labels\n🥫 Pantry or refrigerator contents  \n🍽️ Restaurant menus\n🥕 Cooking ingredients\n🍽️ Meal preparations\n\nPlease upload a food-related image and I'll provide detailed compliance guidance!",
          
          "I specialize in food compliance analysis for the reversal dietary protocol. While I can see your image, it doesn't appear to contain food-related content. I'm most helpful when analyzing:\n\n• Food packaging and labels\n• Kitchen pantry or fridge contents\n• Restaurant or cafe menus\n• Ingredients and food items\n• Meal photos for compliance checking\n\nFeel free to upload any food-related image for detailed nutritional analysis!"
        ];

        // Rotate through polite responses
        const responseIndex = Math.floor(Math.random() * politeResponses.length);
        
        return {
          isFoodRelated: false,
          politeResponse: politeResponses[responseIndex],
          tokensUsed: response.usage?.total_tokens || 0
        };
      }

      return {
        isFoodRelated: true,
        tokensUsed: response.usage?.total_tokens || 0
      };

    } catch (error) {
      console.error('Image validation error:', error);
      // If validation fails, allow the image through but note the error
      return {
        isFoodRelated: true,
        validationError: error.message,
        tokensUsed: 0
      };
    }
  }

  /**
   * Analyze image with conversation context
   */
  async analyzeWithContext(imageData, prompt, conversationHistory = [], mimeType = "image/jpeg") {
    try {
      // First, validate if this is a food-related image
      const validationResult = await this.validateFoodImage(imageData, mimeType);
      
      if (!validationResult.isFoodRelated) {
        return {
          success: true,
          analysis: validationResult.politeResponse,
          agent: this.name,
          tokensUsed: validationResult.tokensUsed || 0,
          model: this.model,
          prompt: prompt,
          hasContext: true,
          imageValidation: 'non-food-content'
        };
      }

      // Build messages with conversation context
      const contextMessages = conversationHistory.slice(-5); // Keep last 5 messages for context
      
      const messages = [
        { role: 'system', content: this.instructions },
        ...contextMessages,
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${imageData}`
              }
            }
          ]
        }
      ];

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      });

      const analysis = response.choices[0].message.content;

      return {
        success: true,
        analysis: analysis,
        agent: this.name,
        tokensUsed: response.usage?.total_tokens || 0,
        model: this.model,
        prompt: prompt,
        hasContext: true,
        imageValidation: 'food-related'
      };

    } catch (error) {
      console.error('ImageAgent Error:', error);
      return {
        success: false,
        error: error.message,
        agent: this.name
      };
    }
  }

  /**
   * Get specialized analysis for different image types
   */
  async getSpecializedAnalysis(imageData, analysisType = "general", mimeType = "image/jpeg") {
    const prompts = {
      general: "Provide a comprehensive analysis of this image, describing what you see in detail.",
      objects: "Identify and list all objects visible in this image with their locations and descriptions.",
      text: "Extract and transcribe any text visible in this image, maintaining the original formatting where possible.",
      people: "Describe any people visible in this image, including their appearance, actions, and context.",
      technical: "Analyze this image from a technical perspective, including composition, lighting, quality, and any technical details.",
      artistic: "Analyze this image from an artistic perspective, discussing composition, style, color palette, and aesthetic elements.",
      marketing: "Analyze this image for marketing purposes, discussing its potential effectiveness, target audience, and messaging.",
      accessibility: "Describe this image in detail for accessibility purposes, providing a comprehensive description for visually impaired users.",
      food_label: "Analyze this food label for reversal diet compliance. Read all ingredients carefully and apply the sodium rule if nutrition facts are visible.",
      fridge_pantry: "Analyze this refrigerator or pantry image. Categorize all visible food items as compliant, non-compliant, or needing closer inspection for reversal diet compliance.",
      ingredients: "Analyze these ingredients/food items on the counter. Group them by compliance status and suggest recipe modifications using only compliant ingredients.",
      restaurant_menu: "Analyze this restaurant menu for reversal diet compliance. Identify potentially compliant items, required modifications, and specific questions to ask the server."
    };

    const prompt = prompts[analysisType] || prompts.general;
    return await this.analyzeImage(imageData, prompt, mimeType);
  }

  /**
   * Determine if this agent should handle the request
   */
  canHandle(input, hasImage = false) {
    if (hasImage) return true;
    
    const imageKeywords = ['image', 'picture', 'photo', 'analyze', 'vision', 'visual', 'see', 'look', 'describe'];
    return imageKeywords.some(keyword => 
      input.toLowerCase().includes(keyword)
    );
  }

  /**
   * Get agent capabilities description
   */
  getCapabilities() {
    return {
      name: this.name,
      description: "Specialized in image analysis and visual content processing",
      capabilities: [
        "Food-specific image validation",
        "Detailed food compliance analysis",
        "Nutrition label reading",
        "Restaurant menu analysis",
        "Pantry and fridge assessment",
        "Ingredient identification",
        "Food packaging evaluation",
        "Polite non-food content redirection"
      ],
      analysisTypes: [
        "general", "objects", "text", "people", 
        "technical", "artistic", "marketing", "accessibility",
        "food_label", "fridge_pantry", "ingredients", "restaurant_menu"
      ]
    };
  }
}
