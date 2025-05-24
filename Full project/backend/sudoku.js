const express = require('express');
const { generateSudoku, solveSudoku } = require('../controllers/sudokuController');
const router = express.Router();

router.get('/generate', generateSudoku);
router.post('/solve', solveSudoku);

module.exports = router;
