const express = require('express');
const router = express.Router();
const {
    getTodaysPuzzle,
    startDailyChallenge,
    getUserStreak
} = require('../controllers/dailyController');
const { protect } = require('../middleware/auth');

router.get('/today', (req, res, next) => {
    if (req.headers.authorization) {
        return protect(req, res, next);
    }
    next();
}, getTodaysPuzzle);

router.post('/start', protect, startDailyChallenge);
router.get('/streak', protect, getUserStreak);

module.exports = router;
