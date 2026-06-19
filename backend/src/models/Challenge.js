const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: '🌱' },
  category: { type: String, enum: ['transport', 'food', 'energy', 'shopping', 'general'], required: true },
  duration_days: { type: Number, required: true },
  target_actions: { type: Number, required: true },
  xp_reward: { type: Number, required: true },
  eco_points_reward: { type: Number, required: true },
  badge_id: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  start_date: { type: Date },
  end_date: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);
