const Team = require('../models/Team');
const User = require('../models/User');
const CarbonAssessment = require('../models/CarbonAssessment');

// POST /api/teams — create team
const createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Team name is required' });

    const existing = await Team.findOne({ name });
    if (existing) return res.status(409).json({ success: false, message: 'Team name already taken' });

    const team = await Team.create({ name, description, created_by: req.user.id, members: [req.user.id] });
    await User.findByIdAndUpdate(req.user.id, { team_id: team._id });

    res.status(201).json({ success: true, team });
  } catch (err) {
    console.error('Create team error:', err);
    res.status(500).json({ success: false, message: 'Error creating team' });
  }
};

// POST /api/teams/join/:inviteCode — join by invite code
const joinTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ invite_code: req.params.inviteCode.toUpperCase() });
    if (!team) return res.status(404).json({ success: false, message: 'Invalid invite code' });

    if (team.members.length >= team.max_members) {
      return res.status(400).json({ success: false, message: 'Team is full' });
    }
    if (team.members.map(m => m.toString()).includes(req.user.id)) {
      return res.status(409).json({ success: false, message: 'Already a member of this team' });
    }

    team.members.push(req.user.id);
    await team.save();
    await User.findByIdAndUpdate(req.user.id, { team_id: team._id });

    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error joining team' });
  }
};

// GET /api/teams/:id — get team details with carbon score
const getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('members', 'name email level xp eco_points');
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    // Calculate team avg carbon score
    const memberIds = team.members.map(m => m._id);
    const latestAssessments = await Promise.all(
      memberIds.map(id => CarbonAssessment.findOne({ user_id: id }).sort({ createdAt: -1 }))
    );

    const scores = latestAssessments.filter(Boolean).map(a => a.total_score);
    const teamCarbonScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length) : null;

    res.json({ success: true, team, teamCarbonScore });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching team' });
  }
};

// GET /api/teams — list all teams
const listTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate('members', 'name').limit(50);
    res.json({ success: true, teams });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error listing teams' });
  }
};

module.exports = { createTeam, joinTeam, getTeam, listTeams };
