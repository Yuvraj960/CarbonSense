const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String, default: '' },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  invite_code: { type: String, unique: true },
  max_members: { type: Number, default: 20 },
}, { timestamps: true });

teamSchema.pre('save', function (next) {
  if (!this.invite_code) {
    this.invite_code = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Team', teamSchema);
