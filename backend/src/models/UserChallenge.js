const mongoose = require('mongoose');

const userChallengeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challenge_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  progress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  completed_at: { type: Date, default: null },
  joined_at: { type: Date, default: Date.now },
}, { timestamps: true });

userChallengeSchema.index({ user_id: 1, challenge_id: 1 }, { unique: true });

module.exports = mongoose.model('UserChallenge', userChallengeSchema);
