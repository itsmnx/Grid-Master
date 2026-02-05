/**
 * Sudoku Puzzle Generator and Solver
 * Uses Recursive Backtracking Algorithm
 * Time Complexity: O(9^m) where m is number of empty cells
 * Space Complexity: O(m) for recursion stack
 */

class SudokuGenerator {
    constructor() {
        this.SIZE = 9;
        this.BOX_SIZE = 3;
    }

    /**
     * Generate a new Sudoku puzzle
     * @param {string} difficulty - easy, medium, hard, or expert
     * @returns {object} - {puzzle, solution}
     */
    generatePuzzle(difficulty = 'medium') {
        const solution = this.generateCompletedGrid();
        const puzzle = JSON.parse(JSON.stringify(solution));
        
        const cellsToRemove = this.getDifficultyCells(difficulty);
        this.removeNumbers(puzzle, cellsToRemove);
        
        return { puzzle, solution };
    }

    /**
     * Generate a completed 9x9 Sudoku grid
     */
    generateCompletedGrid() {
        const grid = Array(this.SIZE).fill(null).map(() => 
            Array(this.SIZE).fill(0)
        );
        
        this.fillGrid(grid);
        return grid;
    }

    /**
     * Recursive backtracking to fill the grid
     */
    fillGrid(grid) {
        const emptyCell = this.findEmptyCell(grid);
        if (!emptyCell) return true; // Grid is complete
        
        const [row, col] = emptyCell;
        const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        
        for (const num of numbers) {
            if (this.isValid(grid, row, col, num)) {
                grid[row][col] = num;
                
                if (this.fillGrid(grid)) {
                    return true;
                }
                
                grid[row][col] = 0; // Backtrack
            }
        }
        
        return false;
    }

    /**
     * Solve a Sudoku puzzle
     */
    solve(grid) {
        const gridCopy = JSON.parse(JSON.stringify(grid));
        if (this.fillGrid(gridCopy)) {
            return gridCopy;
        }
        return null;
    }

    /**
     * Check if a number is valid at position
     */
    isValid(grid, row, col, num) {
        // Check row
        for (let x = 0; x < this.SIZE; x++) {
            if (grid[row][x] === num) return false;
        }
        
        // Check column
        for (let x = 0; x < this.SIZE; x++) {
            if (grid[x][col] === num) return false;
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE;
        const boxCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE;
        
        for (let i = 0; i < this.BOX_SIZE; i++) {
            for (let j = 0; j < this.BOX_SIZE; j++) {
                if (grid[boxRow + i][boxCol + j] === num) return false;
            }
        }
        
        return true;
    }

    /**
     * Validate a completed puzzle
     */
    validatePuzzle(grid) {
        for (let row = 0; row < this.SIZE; row++) {
            for (let col = 0; col < this.SIZE; col++) {
                const num = grid[row][col];
                if (num === 0) return false;
                
                grid[row][col] = 0;
                if (!this.isValid(grid, row, col, num)) {
                    grid[row][col] = num;
                    return false;
                }
                grid[row][col] = num;
            }
        }
        return true;
    }

    /**
     * Get a hint for the puzzle
     */
    getHint(puzzle, solution) {
        const emptyCells = [];
        for (let row = 0; row < this.SIZE; row++) {
            for (let col = 0; col < this.SIZE; col++) {
                if (puzzle[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length === 0) return null;
        
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        return {
            row: randomCell.row,
            col: randomCell.col,
            value: solution[randomCell.row][randomCell.col]
        };
    }

    /**
     * Find the next empty cell
     */
    findEmptyCell(grid) {
        for (let row = 0; row < this.SIZE; row++) {
            for (let col = 0; col < this.SIZE; col++) {
                if (grid[row][col] === 0) {
                    return [row, col];
                }
            }
        }
        return null;
    }

    /**
     * Remove numbers from grid based on difficulty
     */
    removeNumbers(grid, count) {
        let removed = 0;
        const cells = [];
        
        for (let i = 0; i < this.SIZE; i++) {
            for (let j = 0; j < this.SIZE; j++) {
                cells.push([i, j]);
            }
        }
        
        this.shuffleArray(cells);
        
        for (const [row, col] of cells) {
            if (removed >= count) break;
            grid[row][col] = 0;
            removed++;
        }
    }

    /**
     * Get number of cells to remove based on difficulty
     */
    getDifficultyCells(difficulty) {
        const difficulties = {
            easy: 35,      // 35 cells removed (46 given)
            medium: 45,    // 45 cells removed (36 given)
            hard: 52,      // 52 cells removed (29 given)
            expert: 58     // 58 cells removed (23 given)
        };
        return difficulties[difficulty] || difficulties.medium;
    }

    /**
     * Shuffle an array (Fisher-Yates)
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

module.exports = new SudokuGenerator();
