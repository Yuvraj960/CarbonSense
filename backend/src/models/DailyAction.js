const mongoose = require('mongoose');

const dailyActionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action_key: { type: String, required: true },
  action_name: { type: String, required: true },
  category: { type: String, enum: ['transport', 'food', 'energy', 'shopping', 'general'], required: true },
  carbon_saved: { type: Number, required: true }, // kg CO2 saved
  xp_earned: { type: Number, required: true },
  eco_points_earned: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('DailyAction', dailyActionSchema);
