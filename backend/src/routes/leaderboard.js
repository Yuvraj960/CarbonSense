const express = require('express');
const router = express.Router();
const { getIndividualLeaderboard, getTeamLeaderboard } = require('../controllers/leaderboardController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.get('/individual', getIndividualLeaderboard);
router.get('/team', getTeamLeaderboard);

module.exports = router;
