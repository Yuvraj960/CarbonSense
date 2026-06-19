const User = require('../models/User');
const DailyAction = require('../models/DailyAction');
const UserChallenge = require('../models/UserChallenge');
const CarbonAssessment = require('../models/CarbonAssessment');
const Team = require('../models/Team');

// Ranking score formula: (reduction% * 0.5) + (actions * 2) + (challenges * 10)
async function computeRankingScore(userId) {
  const actions = await DailyAction.countDocuments({ user_id: userId });
  const challenges = await UserChallenge.countDocuments({ user_id: userId, completed: true });

  const assessments = await CarbonAssessment.find({ user_id: userId }).sort({ createdAt: 1 });
  let reductionPercent = 0;
  if (assessments.length >= 2) {
    const first = assessments[0].total_score;
    const latest = assessments[assessments.length - 1].total_score;
    reductionPercent = Math.max(0, ((first - latest) / first) * 100);
  }

  return parseFloat(((reductionPercent * 0.5) + (actions * 2) + (challenges * 10)).toFixed(2));
}

// GET /api/leaderboard/individual
const getIndividualLeaderboard = async (req, res) => {
  try {
    const users = await User.find().select('name email level eco_points streak_best badges').limit(100);
    const ranked = await Promise.all(
      users.map(async (u) => {
        const score = await computeRankingScore(u._id);
        const latest = await CarbonAssessment.findOne({ user_id: u._id }).sort({ createdAt: -1 });
        return {
          _id: u._id, name: u.name, level: u.level,
          eco_points: u.eco_points, streak_best: u.streak_best,
          badges: u.badges, ranking_score: score,
          latest_carbon: latest?.total_score || null,
        };
      })
    );
    ranked.sort((a, b) => b.ranking_score - a.ranking_score);
    res.json({ success: true, leaderboard: ranked.slice(0, 50) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching leaderboard' });
  }
};

// GET /api/leaderboard/team
const getTeamLeaderboard = async (req, res) => {
  try {
    const teams = await Team.find().populate('members', '_id');
    const ranked = await Promise.all(
      teams.map(async (team) => {
        const memberIds = team.members.map(m => m._id);
        const scores = await Promise.all(memberIds.map(id => computeRankingScore(id)));
        const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        return {
          _id: team._id, name: team.name, description: team.description,
          member_count: team.members.length, avg_ranking_score: parseFloat(avgScore.toFixed(2)),
        };
      })
    );
    ranked.sort((a, b) => b.avg_ranking_score - a.avg_ranking_score);
    res.json({ success: true, leaderboard: ranked });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching team leaderboard' });
  }
};

module.exports = { getIndividualLeaderboard, getTeamLeaderboard };
