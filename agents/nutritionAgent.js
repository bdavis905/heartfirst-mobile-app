import OpenAI from 'openai';

/**
 * Specialized Nutrition Agent for strict dietary compliance evaluation
 * Implements reversal mode dietary protocol with structured JSON responses
 */
export class NutritionAgent {
  constructor(openaiClient, options = {}) {
    this.client = openaiClient;
    this.name = "NutritionAgent";
    this.model = options.model || 'gpt-4o-mini';
    this.mode = options.mode || 'reversal'; // 'reversal' or 'prevention'
    this.defaultSodiumLimit = options.sodiumLimit || 1500; // mg per day
    
    this.instructions = `You are a specialized nutrition compliance agent that evaluates foods, recipes, and meals according to strict dietary protocols.

    CURRENT MODE: ${this.mode}

    REVERSAL MODE RULES (Absolute "No"):
    - All animal products: meat, poultry, fish/seafood, dairy, eggs
    - All added fats/oils: olive, canola, avocado, coconut, MCT, butter, ghee, etc.
    - Hidden fats: hydrogenated/partially hydrogenated oils, mono-/diglycerides, lecithin as emulsifiers
    - High-fat plant foods: nuts, nut butters, avocado, coconut, tahini, most seeds (see flax/chia exception)
    - Smoothies & juices (including fruit/veg juices) - "chew calories, don't drink them"
    - Processed sugars & sweeteners: maple syrup, honey, molasses, agave, table sugar, artificial sweeteners, minimize stevia
    - Caffeinated coffee (causes vasoconstriction)
    - Refined grains as staples (white rice/flour)
    - Excess soy: limit to ≤2 servings/week

    ALLOWED (with limits):
    - Base foods: starches (potatoes, sweet potatoes, 100% whole grains, quinoa), legumes, non-starchy vegetables
    - Fruit: ≤3 servings/day (whole, chewed) - avoid dates for serious CVD
    - Seeds exception: 1-2 Tbsp/day ground flaxseed and/or chia (max 2 Tbsp combined)
    - Greens protocol: 6x/day at least 1/3 cup cooked high-nitrate greens + vinegar drops
    - Drinks: water, decaf coffee, tea (black/green)
    - Plant milks: VERY LIMITED - only compliant versions (see detailed guidelines below)
    - Whole-grain processed foods IF no disallowed ingredients AND sodium rule met
    - Unsweetened cocoa powder: ≤1 Tbsp occasionally

    SODIUM RULE: mg sodium per serving ≤ calories per serving
    Daily sodium cap: ≤${this.defaultSodiumLimit} mg/day (default) or ≤2000 mg/day

    HIGH-NITRATE GREENS: kale, spinach, Swiss chard, arugula, beet greens, beets, bok choy, collards, mustard greens, turnip greens, Napa cabbage, Brussels sprouts, broccoli, cauliflower, cilantro, parsley, asparagus

    PLANT-BASED MILK DETAILED GUIDELINES:
    Compliant plant milks MUST contain ONLY the base ingredient (oats, almonds, etc.) and water.
    NO added: salt, sugar, oils, gums (gellan gum, guar gum), emulsifiers, preservatives, natural flavors, vitamins (often oil-suspended).
    Watch for hidden oils: mono-/diglycerides, lecithin, anything with "palmitate" are oil-derived and NON-COMPLIANT.
    Usage restrictions: Small quantities only (few drops in tea/coffee), NEVER drink by the glass, not a milk substitute.
    Best compliant options: Oat milk (unsweetened, no additives), almond milk (just almonds + water).
    Soy milk: Counts toward soy restrictions (≤2 servings/week total).
    Label reading: Even "unsweetened" versions often contain gums, natural flavors, sea salt - ALL NON-COMPLIANT.
    Goal: Find versions with absolute minimum ingredients (ideally just plant source + water).
    When in doubt about plant milk compliance, flag as NON-COMPLIANT rather than risk violation.

    EVALUATION PROCESS:
    1. Animal Check: any animal ingredient? → Non-compliant
    2. Oil/Fat Check: any added oils/fats or oil synonyms? → Non-compliant
    3. High-fat plant foods: nuts, nut butters, avocado, coconut/tahini, most seeds → Non-compliant
    4. Sugar/Sweetener Check: added sugars/syrups? → Non-compliant
    5. Smoothies/Juices: blended/juiced calories → Non-compliant
    6. Grain Quality: refined grain as staple → Non-compliant
    7. Sodium Rule: mg sodium/serving ≤ calories/serving
    8. Soy Frequency: >2 servings/week → Non-compliant
    9. Caffeine/Drinks: Caffeinated coffee → Non-compliant
    10. Greens Protocol: Encourage 6x/day cooked high-nitrate greens + vinegar

    ALWAYS respond in JSON format with this exact structure:
    {
      "mode": "reversal",
      "item_type": "product|ingredient|recipe|menu_item|meal|question",
      "verdict": "compliant|non_compliant|needs_info",
      "reasons": ["short bullet reason 1", "short bullet reason 2"],
      "fixes": ["simple substitution/fix 1", "simple substitution/fix 2"],
      "sodium_check": {
        "calories_per_serving": null,
        "sodium_mg_per_serving": null,
        "passes_rule": null
      },
      "flags": {
        "contains_oil_or_hidden_fats": false,
        "contains_animal_product": false,
        "high_fat_plant_food": false,
        "added_sugars_or_syrups": false,
        "refined_grain_as_staple": false,
        "smoothie_or_juice": false,
        "caffeinated_coffee": false,
        "soy_servings_this_week": null,
        "fruit_servings_today": null
      },
      "info_needed": ["only when verdict is needs_info"],
      "notes": "1-2 sentence plain-English explanation",
      "suggested_swaps": [
        {"swap_out": "item", "swap_in": "compliant alternative", "why": "brief reason"}
      ]
    }`;

    this.maxTokens = options.maxTokens || 800;
    this.temperature = options.temperature || 0.1; // Very low for consistent structured output
  }

  /**
   * Evaluate food item, recipe, or meal for compliance
   */
  async evaluateFood(input, context = {}) {
    try {
      const { nutritionInfo, servingSize, ingredientList } = context;

      let prompt = `Evaluate this food item for ${this.mode} mode compliance:\n\n${input}`;
      
      if (nutritionInfo) {
        prompt += `\n\nNutrition Information:\n${nutritionInfo}`;
      }
      
      if (ingredientList) {
        prompt += `\n\nIngredients:\n${ingredientList}`;
      }
      
      if (servingSize) {
        prompt += `\n\nServing Size: ${servingSize}`;
      }

      prompt += `\n\nProvide evaluation in the required JSON format.`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: this.instructions },
          { role: 'user', content: prompt }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      });

      const responseText = response.choices[0].message.content.trim();
      
      // Try to parse JSON response
      let evaluation;
      try {
        evaluation = JSON.parse(responseText);
      } catch (parseError) {
        // If JSON parsing fails, create structured response
        evaluation = {
          mode: this.mode,
          item_type: "unknown",
          verdict: "needs_info",
          reasons: ["Unable to parse response format"],
          fixes: [],
          sodium_check: { calories_per_serving: null, sodium_mg_per_serving: null, passes_rule: null },
          flags: {
            contains_oil_or_hidden_fats: false,
            contains_animal_product: false,
            high_fat_plant_food: false,
            added_sugars_or_syrups: false,
            refined_grain_as_staple: false,
            smoothie_or_juice: false,
            caffeinated_coffee: false,
            soy_servings_this_week: null,
            fruit_servings_today: null
          },
          info_needed: ["Response format error"],
          notes: "System error in response formatting",
          suggested_swaps: []
        };
      }

      return {
        success: true,
        evaluation,
        agent: this.name,
        tokensUsed: response.usage?.total_tokens || 0,
        model: this.model,
        mode: this.mode
      };

    } catch (error) {
      console.error('NutritionAgent Error:', error);
      return {
        success: false,
        error: error.message,
        agent: this.name
      };
    }
  }

  /**
   * Evaluate multiple food items in a meal
   */
  async evaluateMeal(mealDescription, items = []) {
    try {
      let prompt = `Evaluate this complete meal for ${this.mode} mode compliance:\n\n${mealDescription}`;
      
      if (items.length > 0) {
        prompt += `\n\nIndividual items:\n${items.map((item, i) => `${i + 1}. ${item}`).join('\n')}`;
      }

      prompt += `\n\nProvide overall meal evaluation in the required JSON format, considering the entire meal as one item.`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: this.instructions },
          { role: 'user', content: prompt }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      });

      const responseText = response.choices[0].message.content.trim();
      
      let evaluation;
      try {
        evaluation = JSON.parse(responseText);
        evaluation.item_type = "meal";
      } catch (parseError) {
        evaluation = {
          mode: this.mode,
          item_type: "meal",
          verdict: "needs_info",
          reasons: ["Unable to parse meal evaluation"],
          fixes: [],
          sodium_check: { calories_per_serving: null, sodium_mg_per_serving: null, passes_rule: null },
          flags: {
            contains_oil_or_hidden_fats: false,
            contains_animal_product: false,
            high_fat_plant_food: false,
            added_sugars_or_syrups: false,
            refined_grain_as_staple: false,
            smoothie_or_juice: false,
            caffeinated_coffee: false,
            soy_servings_this_week: null,
            fruit_servings_today: null
          },
          info_needed: ["Meal evaluation format error"],
          notes: "System error in meal evaluation formatting",
          suggested_swaps: []
        };
      }

      return {
        success: true,
        evaluation,
        agent: this.name,
        tokensUsed: response.usage?.total_tokens || 0,
        model: this.model,
        mode: this.mode
      };

    } catch (error) {
      console.error('NutritionAgent Meal Evaluation Error:', error);
      return {
        success: false,
        error: error.message,
        agent: this.name
      };
    }
  }

  /**
   * Get nutrition guidance for daily planning
   */
  async getDailyGuidance(currentIntake = {}) {
    try {
      const { fruits = 0, greens = 0, soy = 0, sodium = 0 } = currentIntake;

      const prompt = `Provide daily nutrition guidance for ${this.mode} mode.
      
      Current intake today:
      - Fruits: ${fruits} servings
      - Greens: ${greens} servings
      - Soy this week: ${soy} servings
      - Sodium: ${sodium} mg

      What should the person focus on for the rest of the day? Provide guidance in JSON format with specific recommendations.`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: this.instructions },
          { role: 'user', content: prompt }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      });

      return {
        success: true,
        guidance: response.choices[0].message.content,
        agent: this.name,
        tokensUsed: response.usage?.total_tokens || 0,
        mode: this.mode
      };

    } catch (error) {
      console.error('NutritionAgent Guidance Error:', error);
      return {
        success: false,
        error: error.message,
        agent: this.name
      };
    }
  }

  /**
   * Switch between reversal and prevention modes
   */
  setMode(mode) {
    if (mode === 'prevention' || mode === 'reversal') {
      this.mode = mode;
      // Update instructions with new mode
      this.instructions = this.instructions.replace(/CURRENT MODE: (reversal|prevention)/, `CURRENT MODE: ${mode}`);
      return { success: true, mode: this.mode };
    }
    return { success: false, error: 'Invalid mode. Use "reversal" or "prevention"' };
  }

  /**
   * Get agent capabilities
   */
  getCapabilities() {
    return {
      name: this.name,
      description: "Specialized nutrition compliance evaluation agent",
      mode: this.mode,
      capabilities: [
        "Food compliance evaluation",
        "Recipe analysis",
        "Meal planning guidance",
        "Ingredient screening",
        "Sodium rule checking",
        "Structured JSON responses",
        "Daily nutrition tracking",
        "Substitution recommendations"
      ],
      modes: ["reversal", "prevention"],
      sodiumLimit: this.defaultSodiumLimit
    };
  }
}
