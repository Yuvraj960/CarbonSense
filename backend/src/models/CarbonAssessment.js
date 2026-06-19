const mongoose = require('mongoose');

const carbonAssessmentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transport_mode: { type: String, enum: ['car', 'bike', 'metro', 'bus', 'train', 'flight', 'walk'], required: true },
  transport_km_per_week: { type: Number, required: true, min: 0 },
  food_type: { type: String, enum: ['vegetarian', 'eggetarian', 'mixed', 'meat-heavy'], required: true },
  electricity_units: { type: Number, required: true, min: 0 },
  shopping_orders_per_month: { type: Number, required: true, min: 0 },
  transport_score: { type: Number, required: true }, // kg CO2/month
  food_score: { type: Number, required: true },
  electricity_score: { type: Number, required: true },
  shopping_score: { type: Number, required: true },
  total_score: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CarbonAssessment', carbonAssessmentSchema);
