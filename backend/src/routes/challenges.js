const express = require('express');
const router = express.Router();
const { getChallenges, joinChallenge, updateProgress } = require('../controllers/challengesController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.get('/', getChallenges);
router.post('/:id/join', joinChallenge);
router.post('/:id/progress', updateProgress);

module.exports = router;
