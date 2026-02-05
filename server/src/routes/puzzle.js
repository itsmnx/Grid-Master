const express = require('express');
const router = express.Router();
const {
    generatePuzzle,
    validatePuzzle,
    getHint,
    updateGame,
    getMyGames
} = require('../controllers/puzzleController');
const { protect } = require('../middleware/auth');

router.post('/generate', (req, res, next) => {
    if (req.headers.authorization) {
        return protect(req, res, next);
    }
    next();
}, generatePuzzle);

router.post('/validate', validatePuzzle);
router.post('/hint', protect, getHint);
router.put('/:id', protect, updateGame);
router.get('/my-games', protect, getMyGames);

module.exports = router;
