const sudoku = require('sudoku'); // npm install sudoku

exports.generateSudoku = (req, res) => {
    const puzzle = sudoku.makepuzzle();
    const solution = sudoku.solvepuzzle(puzzle);
    res.json({
        puzzle: puzzle.map(cell => cell === null ? 0 : cell + 1),
        solution: solution.map(cell => cell === null ? 0 : cell + 1)
    });
};

exports.solveSudoku = (req, res) => {
    const { board } = req.body;
    const flat = board.map(row => row.map(cell => cell === 0 ? null : cell - 1)).flat();
    const solution = sudoku.solvepuzzle(flat);
    if (!solution) return res.status(400).json({ error: 'Unsolvable puzzle' });

    const solved = [];
    for (let i = 0; i < 9; i++) {
        solved.push(solution.slice(i * 9, i * 9 + 9).map(val => val + 1));
    }
    res.json({ solution: solved });
};
