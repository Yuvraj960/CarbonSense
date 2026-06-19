const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  xp: { type: Number, default: 0 },
  eco_points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak_current: { type: Number, default: 0 },
  streak_best: { type: Number, default: 0 },
  last_action_date: { type: Date, default: null },
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  badges: [{ type: String }],
  ecoworld_level: { type: Number, default: 0, min: 0, max: 5 },
  avatar: { type: String, default: 'leaf' },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
