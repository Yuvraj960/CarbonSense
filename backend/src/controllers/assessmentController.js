const CarbonAssessment = require('../models/CarbonAssessment');
const { calculateCarbonScore, getCarbonComparisons, getCarbonRating } = require('../utils/carbonEngine');
const { getReductionSuggestions } = require('../services/geminiService');

// POST /api/assessment
const submitAssessment = async (req, res) => {
  try {
    const { transport_mode, transport_km_per_week, food_type, electricity_units, shopping_orders_per_month } = req.body;

    const scores = calculateCarbonScore({ transport_mode, transport_km_per_week, food_type, electricity_units, shopping_orders_per_month });

    const assessment = await CarbonAssessment.create({
      user_id: req.user.id,
      transport_mode,
      transport_km_per_week,
      food_type,
      electricity_units,
      shopping_orders_per_month,
      ...scores,
    });

    const comparisons = getCarbonComparisons(scores.total_score);
    const rating = getCarbonRating(scores.total_score);

    // Get AI suggestions
    let aiSuggestions = null;
    try {
      aiSuggestions = await getReductionSuggestions({ transportMode: transport_mode, foodType: food_type, electricityUnits: electricity_units, shoppingOrders: shopping_orders_per_month });
    } catch (e) {
      console.error('AI suggestions failed:', e.message);
    }

    res.status(201).json({
      success: true,
      assessment,
      comparisons,
      rating,
      aiSuggestions,
    });
  } catch (err) {
    console.error('Assessment error:', err);
    res.status(500).json({ success: false, message: 'Error submitting assessment' });
  }
};

// GET /api/assessment/history
const getHistory = async (req, res) => {
  try {
    const assessments = await CarbonAssessment.find({ user_id: req.user.id })
      .sort({ createdAt: -1 })
      .limit(12); // Last 12 months
    res.json({ success: true, assessments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching history' });
  }
};

// GET /api/assessment/latest
const getLatest = async (req, res) => {
  try {
    const assessment = await CarbonAssessment.findOne({ user_id: req.user.id }).sort({ createdAt: -1 });
    if (!assessment) return res.json({ success: true, assessment: null });
    const comparisons = getCarbonComparisons(assessment.total_score);
    const rating = getCarbonRating(assessment.total_score);
    res.json({ success: true, assessment, comparisons, rating });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching assessment' });
  }
};

module.exports = { submitAssessment, getHistory, getLatest };
