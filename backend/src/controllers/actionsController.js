const DailyAction = require('../models/DailyAction');
const User = require('../models/User');
const { ACTIONS_CATALOG } = require('../utils/actionsCatalog');
const { xpForLevel } = require('../utils/carbonEngine');

// GET /api/actions/catalog
const getCatalog = async (req, res) => {
  res.json({ success: true, actions: ACTIONS_CATALOG });
};

// POST /api/actions/log
const logAction = async (req, res) => {
  try {
    const { action_key } = req.body;
    const action = ACTIONS_CATALOG.find(a => a.key === action_key);
    if (!action) return res.status(400).json({ success: false, message: 'Invalid action key' });

    // Check if already logged today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existing = await DailyAction.findOne({ user_id: req.user.id, action_key, createdAt: { $gte: today } });
    if (existing) return res.status(409).json({ success: false, message: 'Action already logged today' });

    // Log the action
    const logged = await DailyAction.create({
      user_id: req.user.id,
      action_key,
      action_name: action.name,
      category: action.category,
      carbon_saved: action.carbon_saved,
      xp_earned: action.xp_earned,
      eco_points_earned: action.eco_points_earned,
    });

    // Update user XP, eco_points, streak, ecoworld_level
    const user = await User.findById(req.user.id);
    user.xp += action.xp_earned;
    user.eco_points += action.eco_points_earned;

    // Update streak
    const lastDate = user.last_action_date ? new Date(user.last_action_date) : null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    if (!lastDate || lastDate < yesterday) {
      user.streak_current = lastDate && lastDate >= yesterday ? user.streak_current + 1 : 1;
    }
    user.last_action_date = new Date();
    if (user.streak_current > user.streak_best) user.streak_best = user.streak_current;

    // Level up check
    while (user.xp >= xpForLevel(user.level)) {
      user.xp -= xpForLevel(user.level);
      user.level += 1;
    }

    // Ecoworld level (based on total eco_points)
    const ecoThresholds = [0, 50, 150, 350, 700, 1200];
    for (let i = ecoThresholds.length - 1; i >= 0; i--) {
      if (user.eco_points >= ecoThresholds[i]) { user.ecoworld_level = i; break; }
    }

    await user.save();

    res.json({ success: true, action: logged, user: user.toPublicJSON() });
  } catch (err) {
    console.error('Log action error:', err);
    res.status(500).json({ success: false, message: 'Error logging action' });
  }
};

// GET /api/actions/today
const getTodayActions = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const actions = await DailyAction.find({ user_id: req.user.id, createdAt: { $gte: today } });
    res.json({ success: true, actions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching today\'s actions' });
  }
};

// GET /api/actions/history
const getActionHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const actions = await DailyAction.find({ user_id: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ success: true, actions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching action history' });
  }
};

module.exports = { getCatalog, logAction, getTodayActions, getActionHistory };
