const express = require('express');
const router = express.Router();
const { getCoachMessage, getWeeklyReport } = require('../controllers/aiController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.post('/coach', getCoachMessage);
router.get('/weekly-report', getWeeklyReport);

module.exports = router;
