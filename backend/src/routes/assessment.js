const express = require('express');
const router = express.Router();
const { submitAssessment, getHistory, getLatest } = require('../controllers/assessmentController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.post('/', submitAssessment);
router.get('/history', getHistory);
router.get('/latest', getLatest);

module.exports = router;
