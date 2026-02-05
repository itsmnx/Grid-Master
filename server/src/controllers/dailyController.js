const DailyPuzzle = require('../models/DailyPuzzle');
const Game = require('../models/Game');
const sudokuGenerator = require('../utils/sudokuGenerator');

// @route   GET /api/daily/today
exports.getTodaysPuzzle = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let dailyPuzzle = await DailyPuzzle.findOne({ date: today });

        // Generate if doesn't exist
        if (!dailyPuzzle) {
            const difficulty = ['medium', 'hard'][Math.floor(Math.random() * 2)];
            const { puzzle, solution } = sudokuGenerator.generatePuzzle(difficulty);

            dailyPuzzle = await DailyPuzzle.create({
                date: today,
                puzzle,
                solution,
                difficulty
            });
        }

        // Check if user has already played today
        let userProgress = null;
        if (req.user) {
            userProgress = await Game.findOne({
                user: req.user.id,
                isDaily: true,
                dailyDate: today
            });
        }

        res.json({
            success: true,
            data: {
                puzzle: dailyPuzzle.puzzle,
                difficulty: dailyPuzzle.difficulty,
                completions: dailyPuzzle.completions,
                averageTime: dailyPuzzle.averageTime,
                userProgress: userProgress ? {
                    gameId: userProgress._id,
                    currentState: userProgress.currentState,
                    timeSpent: userProgress.timeSpent,
                    status: userProgress.status
                } : null
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @route   POST /api/daily/start
exports.startDailyChallenge = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dailyPuzzle = await DailyPuzzle.findOne({ date: today });
        if (!dailyPuzzle) {
            return res.status(404).json({
                success: false,
                message: 'Daily puzzle not found'
            });
        }

        // Check if already started
        const existing = await Game.findOne({
            user: req.user.id,
            isDaily: true,
            dailyDate: today
        });

        if (existing) {
            return res.json({
                success: true,
                data: existing
            });
        }

        // Create new daily game
        const game = await Game.create({
            user: req.user.id,
            difficulty: dailyPuzzle.difficulty,
            puzzle: dailyPuzzle.puzzle,
            solution: dailyPuzzle.solution,
            currentState: JSON.parse(JSON.stringify(dailyPuzzle.puzzle)),
            isDaily: true,
            dailyDate: today
        });

        res.json({
            success: true,
            data: game
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @route   GET /api/daily/streak
exports.getUserStreak = async (req, res) => {
    try {
        const user = await require('../models/User').findById(req.user.id);
        
        res.json({
            success: true,
            data: {
                currentStreak: user.stats.currentStreak,
                longestStreak: user.stats.longestStreak,
                lastPlayedDate: user.stats.lastPlayedDate
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
