const express = require('express');
const router = express.Router();
const {
    getUserStats,
    getLeaderboard,
    getUserHistory
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getUserStats);
router.get('/leaderboard', getLeaderboard);
router.get('/history', protect, getUserHistory);

module.exports = router;
