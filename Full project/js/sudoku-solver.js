class SudokuSolver {
    constructor() {
        this.SIZE = 9;
        this.BOX_SIZE = 3;
        this.EMPTY_CELL = 0;
    }

    /**
     * Solve a Sudoku puzzle
     * @param {Array} puzzle - 2D array representing the puzzle
     * @returns {Array|null} Solved puzzle or null if unsolvable
     */
    solve(puzzle) {
        // Create a deep copy of the puzzle to avoid modifying original
        const grid = JSON.parse(JSON.stringify(puzzle));
        
        // Try to solve the puzzle
        if (this.solveGrid(grid)) {
            return grid;
        }
        
        // No solution found
        return null;
    }

    /**
     * Recursive backtracking algorithm to solve the Sudoku puzzle
     * @param {Array} grid - 2D array representing the Sudoku grid
     * @returns {boolean} true if the grid was solved successfully
     */
    solveGrid(grid) {
        // Find an empty cell
        const emptyCell = this.findEmptyCell(grid);
        
        // If no empty cells found, grid is solved
        if (!emptyCell) {
            return true;
        }
        
        const [row, col] = emptyCell;
        
        // Try numbers 1-9
        for (let num = 1; num <= this.SIZE; num++) {
            // Check if number can be placed at this position
            if (this.isValidPlacement(grid, row, col, num)) {
                // Place the number
                grid[row][col] = num;
                
                // Recursively try to solve the rest of the grid
                if (this.solveGrid(grid)) {
                    return true;
                }
                
                // If we can't solve the grid with this number, backtrack
                grid[row][col] = this.EMPTY_CELL;
            }
        }
        
        // No solution found with current configuration
        return false;
    }

    /**
     * Find the first empty cell in the grid
     * @param {Array} grid - 2D array representing the Sudoku grid
     * @returns {Array|null} [row, col] of empty cell or null if no empty cells
     */
    findEmptyCell(grid) {
        for (let row = 0; row < this.SIZE; row++) {
            for (let col = 0; col < this.SIZE; col++) {
                if (grid[row][col] === this.EMPTY_CELL) {
                    return [row, col];
                }
            }
        }
        return null;
    }

    /**
     * Check if a number can be placed at a specific position
     * @param {Array} grid - 2D array representing the Sudoku grid
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {number} num - Number to check
     * @returns {boolean} true if placement is valid
     */
    isValidPlacement(grid, row, col, num) {
        // Check row
        for (let c = 0; c < this.SIZE; c++) {
            if (grid[row][c] === num) {
                return false;
            }
        }
        
        // Check column
        for (let r = 0; r < this.SIZE; r++) {
            if (grid[r][col] === num) {
                return false;
            }
        }
        
        // Check 3x3 box
        const boxStartRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE;
        const boxStartCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE;
        
        for (let r = boxStartRow; r < boxStartRow + this.BOX_SIZE; r++) {
            for (let c = boxStartCol; c < boxStartCol + this.BOX_SIZE; c++) {
                if (grid[r][c] === num) {
                    return false;
                }
            }
        }
        
        return true;
    }

    /**
     * Validate a cell placement
     * @param {Array} grid - 2D array representing the Sudoku grid
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {number} num - Number to validate
     * @returns {boolean} true if placement is valid
     */
    validateCell(grid, row, col, num) {
        // Temporarily remove the number from the grid to avoid self-conflict
        const originalValue = grid[row][col];
        grid[row][col] = this.EMPTY_CELL;
        
        const result = this.isValidPlacement(grid, row, col, num);
        
        // Restore the original value
        grid[row][col] = originalValue;
        
        return result;
    }

    /**
     * Check if a puzzle is complete and valid
     * @param {Array} grid - 2D array representing the Sudoku grid
     * @returns {boolean} true if the puzzle is complete and valid
     */
    isComplete(grid) {
        // Check for empty cells
        for (let row = 0; row < this.SIZE; row++) {
            for (let col = 0; col < this.SIZE; col++) {
                if (grid[row][col] === this.EMPTY_CELL) {
                    return false;
                }
                
                // Check if the current value is valid
                const num = grid[row][col];
                
                // Temporarily remove the number from the grid to check if it's valid
                grid[row][col] = this.EMPTY_CELL;
                const isValid = this.isValidPlacement(grid, row, col, num);
                grid[row][col] = num;
                
                if (!isValid) {
                    return false;
                }
            }
        }
        
        return true;
    }

    /**
     * Find and return all errors in a Sudoku grid
     * @param {Array} grid - 2D array representing the Sudoku grid
     * @returns {Array} Array of [row, col] pairs indicating error positions
     */
    findErrors(grid) {
        const errors = [];
        
        for (let row = 0; row < this.SIZE; row++) {
            for (let col = 0; col < this.SIZE; col++) {
                const num = grid[row][col];
                
                // Skip empty cells
                if (num === this.EMPTY_CELL) {
                    continue;
                }
                
                // Check if the current value is valid
                grid[row][col] = this.EMPTY_CELL;
                const isValid = this.isValidPlacement(grid, row, col, num);
                grid[row][col] = num;
                
                if (!isValid) {
                    errors.push([row, col]);
                }
            }
        }
        
        return errors;
    }

    /**
     * Get a hint for the next move
     * @param {Array} puzzle - 2D array representing the current puzzle state
     * @returns {Object|null} Hint object {row, col, value} or null if puzzle is unsolvable
     */
    getHint(puzzle) {
        // Create a deep copy of the puzzle
        const grid = JSON.parse(JSON.stringify(puzzle));
        
        // Try to solve the puzzle
        const solution = this.solve(grid);
        
        if (!solution) {
            return null; // Puzzle is unsolvable
        }
        
        // Find the first empty cell or incorrect cell
        for (let row = 0; row < this.SIZE; row++) {
            for (let col = 0; col < this.SIZE; col++) {
                if (grid[row][col] === this.EMPTY_CELL || grid[row][col] !== solution[row][col]) {
                    return {
                        row: row,
                        col: col,
                        value: solution[row][col]
                    };
                }
            }
        }
        
        return null; // Puzzle is already solved correctly
    }
}

// Export the solver
const sudokuSolver = new SudokuSolver();
