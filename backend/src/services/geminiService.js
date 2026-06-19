const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

function getGenAI() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Get personalized sustainability coaching from Gemini
 */
async function getCoachingAdvice({ userName, totalEmissions, topSource, recentActions, goals }) {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are a friendly, non-judgmental sustainability coach named EcoSage for an app called CarbonSense.

User profile:
- Name: ${userName}
- Monthly carbon footprint: ${totalEmissions} kg CO₂
- Top emission source: ${topSource}
- Recent green actions: ${recentActions.join(', ') || 'None yet'}
- Goals: ${goals || 'Reduce carbon footprint'}

Give a short, warm, encouraging sustainability tip (max 100 words). 
- Be specific and realistic
- Never shame or use fear-based language
- Mention one concrete action they can take this week
- Reference their data naturally
- Use a positive, motivating tone`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Generate weekly sustainability report
 */
async function generateWeeklyReport({ userName, weeklyEmissions, previousWeekEmissions, bestAction, topSource, actionsCount }) {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-2.0-flash' });

  const change = previousWeekEmissions > 0
    ? ((previousWeekEmissions - weeklyEmissions) / previousWeekEmissions * 100).toFixed(1)
    : 0;

  const prompt = `You are EcoSage, a sustainability coach for CarbonSense.

Write a brief, uplifting weekly sustainability report for ${userName} (max 150 words total):
- Weekly emissions: ${weeklyEmissions} kg CO₂ (${change}% ${change >= 0 ? 'reduction' : 'increase'} from last week)
- Best green action this week: ${bestAction || 'None logged'}
- Biggest emission source: ${topSource}
- Total green actions logged: ${actionsCount}

Format as:
**Progress**: [1 sentence on their week]
**Best Achievement**: [highlight their best action]
**Focus Area**: [biggest emission source + one tip]
**This Week's Goal**: [one specific, achievable action for next week]

Keep it warm, motivating, and personal. Never shame. Max 150 words.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * AI-powered carbon reduction suggestions
 */
async function getReductionSuggestions({ transportMode, foodType, electricityUnits, shoppingOrders }) {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are EcoSage for CarbonSense. Based on this user's lifestyle:
- Primary transport: ${transportMode}
- Diet: ${foodType}  
- Monthly electricity: ${electricityUnits} units
- Online orders/month: ${shoppingOrders}

Give 3 specific, realistic emission reduction tips (max 120 words total). 
Format as a numbered list. Each tip should mention estimated CO₂ savings.
Never use guilt or fear. Be encouraging and practical.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { getCoachingAdvice, generateWeeklyReport, getReductionSuggestions };
