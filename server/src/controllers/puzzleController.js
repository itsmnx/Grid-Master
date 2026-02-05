const sudokuGenerator = require('../utils/sudokuGenerator');
const Game = require('../models/Game');

// @route   POST /api/puzzles/generate
exports.generatePuzzle = async (req, res) => {
    try {
        const { difficulty = 'medium' } = req.body;
        const { puzzle, solution } = sudokuGenerator.generatePuzzle(difficulty);

        // If user is logged in, save the game
        if (req.user) {
            const game = await Game.create({
                user: req.user.id,
                difficulty,
                puzzle,
                solution,
                currentState: JSON.parse(JSON.stringify(puzzle))
            });

            return res.json({
                success: true,
                data: {
                    gameId: game._id,
                    puzzle,
                    solution,
                    difficulty
                }
            });
        }

        res.json({
            success: true,
            data: { puzzle, solution, difficulty }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @route   POST /api/puzzles/validate
exports.validatePuzzle = async (req, res) => {
    try {
        const { puzzle } = req.body;
        const isValid = sudokuGenerator.validatePuzzle(puzzle);

        res.json({
            success: true,
            data: { isValid }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @route   POST /api/puzzles/hint
exports.getHint = async (req, res) => {
    try {
        const { gameId } = req.body;
        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found'
            });
        }

        const hint = sudokuGenerator.getHint(game.currentState, game.solution);
        game.hintsUsed += 1;
        await game.save();

        res.json({
            success: true,
            data: { hint, hintsUsed: game.hintsUsed }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @route   PUT /api/puzzles/:id
exports.updateGame = async (req, res) => {
    try {
        const { currentState, timeSpent, status, mistakesMade } = req.body;
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found'
            });
        }

        if (currentState) game.currentState = currentState;
        if (timeSpent) game.timeSpent = timeSpent;
        if (status) game.status = status;
        if (mistakesMade !== undefined) game.mistakesMade = mistakesMade;

        if (status === 'completed') {
            game.completedAt = new Date();
            game.calculateScore();

            // Update user stats
            const user = await require('../models/User').findById(game.user);
            user.stats.gamesCompleted += 1;
            user.updateStreak();

            const difficulty = game.difficulty;
            if (!user.stats.bestTimes[difficulty] || timeSpent < user.stats.bestTimes[difficulty]) {
                user.stats.bestTimes[difficulty] = timeSpent;
            }

            await user.save();
        }

        await game.save();

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

// @route   GET /api/puzzles/my-games
exports.getMyGames = async (req, res) => {
    try {
        const games = await Game.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);

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
