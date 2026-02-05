const User = require('../models/User');
const Game = require('../models/Game');

// @route   GET /api/users/stats
exports.getUserStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        res.json({
            success: true,
            data: user.stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @route   GET /api/users/leaderboard
exports.getLeaderboard = async (req, res) => {
    try {
        const users = await User.find()
            .select('username stats')
            .sort({ 'stats.gamesCompleted': -1, 'stats.longestStreak': -1 })
            .limit(100);

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @route   GET /api/users/history
exports.getUserHistory = async (req, res) => {
    try {
        const games = await Game.find({ 
            user: req.user.id,
            status: 'completed'
        })
        .sort({ completedAt: -1 })
        .limit(50);

        res.json({
            success: true,
            data: games
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
