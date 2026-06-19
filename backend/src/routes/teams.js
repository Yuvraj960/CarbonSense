const express = require('express');
const router = express.Router();
const { createTeam, joinTeam, getTeam, listTeams } = require('../controllers/teamsController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.get('/', listTeams);
router.post('/', createTeam);
router.post('/join/:inviteCode', joinTeam);
router.get('/:id', getTeam);

module.exports = router;
