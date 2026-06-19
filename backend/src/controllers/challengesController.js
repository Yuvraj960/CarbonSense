const Challenge = require('../models/Challenge');
const UserChallenge = require('../models/UserChallenge');

// GET /api/challenges
const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ is_active: true });
    const joined = await UserChallenge.find({ user_id: req.user.id });
    const joinedIds = joined.map(j => j.challenge_id.toString());

    const result = challenges.map(c => ({
      ...c.toObject(),
      is_joined: joinedIds.includes(c._id.toString()),
      user_progress: joined.find(j => j.challenge_id.toString() === c._id.toString())?.progress || 0,
      user_completed: joined.find(j => j.challenge_id.toString() === c._id.toString())?.completed || false,
    }));

    res.json({ success: true, challenges: result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching challenges' });
  }
};

// POST /api/challenges/:id/join
const joinChallenge = async (req, res) => {
  try {
    const existing = await UserChallenge.findOne({ user_id: req.user.id, challenge_id: req.params.id });
    if (existing) return res.status(409).json({ success: false, message: 'Already joined this challenge' });

    const uc = await UserChallenge.create({ user_id: req.user.id, challenge_id: req.params.id });
    res.status(201).json({ success: true, userChallenge: uc });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error joining challenge' });
  }
};

// POST /api/challenges/:id/progress  — increment progress
const updateProgress = async (req, res) => {
  try {
    const uc = await UserChallenge.findOne({ user_id: req.user.id, challenge_id: req.params.id });
    if (!uc) return res.status(404).json({ success: false, message: 'Not joined this challenge' });

    const challenge = await Challenge.findById(req.params.id);
    uc.progress = Math.min(uc.progress + 1, challenge.target_actions);
    if (uc.progress >= challenge.target_actions && !uc.completed) {
      uc.completed = true;
      uc.completed_at = new Date();
    }
    await uc.save();
    res.json({ success: true, userChallenge: uc, justCompleted: uc.completed });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating challenge progress' });
  }
};

module.exports = { getChallenges, joinChallenge, updateProgress };
