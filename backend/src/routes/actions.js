const express = require('express');
const router = express.Router();
const { getCatalog, logAction, getTodayActions, getActionHistory } = require('../controllers/actionsController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.get('/catalog', getCatalog);
router.post('/log', logAction);
router.get('/today', getTodayActions);
router.get('/history', getActionHistory);

module.exports = router;
