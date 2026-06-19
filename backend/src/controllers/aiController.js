const { getCoachingAdvice, generateWeeklyReport } = require('../services/geminiService');
const CarbonAssessment = require('../models/CarbonAssessment');
const DailyAction = require('../models/DailyAction');
const User = require('../models/User');

// POST /api/ai/coach
const getCoachMessage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const latest = await CarbonAssessment.findOne({ user_id: req.user.id }).sort({ createdAt: -1 });
    const recentActions = await DailyAction.find({ user_id: req.user.id })
      .sort({ createdAt: -1 }).limit(5).select('action_name');

    const topSource = latest ? ['transport', 'food', 'electricity', 'shopping']
      .reduce((max, cat) => latest[`${cat}_score`] > (latest[`${max}_score`] || 0) ? cat : max, 'food')
      : 'transport';

    const advice = await getCoachingAdvice({
      userName: user.name,
      totalEmissions: latest?.total_score || 0,
      topSource,
      recentActions: recentActions.map(a => a.action_name),
      goals: req.body.goals || 'Reduce carbon footprint',
    });

    res.json({ success: true, advice });
  } catch (err) {
    console.error('AI Coach error:', err);
    res.status(500).json({ success: false, message: 'AI service temporarily unavailable' });
  }
};

// GET /api/ai/weekly-report
const getWeeklyReport = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

    const thisWeekActions = await DailyAction.find({ user_id: req.user.id, createdAt: { $gte: weekAgo } });
    const prevWeekActions = await DailyAction.find({ user_id: req.user.id, createdAt: { $gte: twoWeeksAgo, $lt: weekAgo } });

    const weeklyEmissions = thisWeekActions.reduce((sum, a) => sum - a.carbon_saved, 100); // base 100kg/week
    const previousWeekEmissions = prevWeekActions.reduce((sum, a) => sum - a.carbon_saved, 100);

    const bestAction = thisWeekActions.sort((a, b) => b.carbon_saved - a.carbon_saved)[0]?.action_name || null;
    const latest = await CarbonAssessment.findOne({ user_id: req.user.id }).sort({ createdAt: -1 });
    const topSource = latest ? ['transport', 'food', 'electricity', 'shopping']
      .reduce((max, cat) => latest[`${cat}_score`] > (latest[`${max}_score`] || 0) ? cat : max, 'food')
      : 'transport';

    const report = await generateWeeklyReport({
      userName: user.name,
      weeklyEmissions: Math.max(0, weeklyEmissions),
      previousWeekEmissions: Math.max(0, previousWeekEmissions),
      bestAction,
      topSource,
      actionsCount: thisWeekActions.length,
    });

    res.json({ success: true, report, stats: { actionsCount: thisWeekActions.length, carbonSaved: thisWeekActions.reduce((s, a) => s + a.carbon_saved, 0) } });
  } catch (err) {
    console.error('Weekly report error:', err);
    res.status(500).json({ success: false, message: 'Could not generate weekly report' });
  }
};

module.exports = { getCoachMessage, getWeeklyReport };
