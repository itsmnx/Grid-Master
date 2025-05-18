
class SudokuGenerator {
    constructor() {
        this.SIZE = 9;
        this.BOX_SIZE = 3;
        this.EMPTY_CELL = 0;
    }

    /**
     * Generate a new Sudoku puzzle with the specified difficulty
     * @param {string} difficulty - 'easy', 'medium', or 'hard'
     * @returns {Array} 2D array representing the puzzle (0 for empty cells)
     */
    generatePuzzle(difficulty) {
        // Create a solved puzzle first
        const solvedPuzzle = this.generateSolvedGrid();
        
        // Make a copy to remove numbers from
        const puzzle = JSON.parse(JSON.stringify(solvedPuzzle));
        
        // Remove numbers based on difficulty
        this.removeNumbers(puzzle, difficulty);
        
        return {
            puzzle: puzzle,
            solution: solvedPuzzle
        };
    }

    /**
     * Generate a fully solved Sudoku grid
     * @returns {Array} 2D array with a valid Sudoku solution
     */
    generateSolvedGrid() {
        // Create empty 9x9 grid
        const grid = Array(this.SIZE).fill().map(() => Array(this.SIZE).fill(this.EMPTY_CELL));
        
        // Fill the grid using backtracking
        this.fillGrid(grid);
        
        return grid;
    }

    /**
     * Fill the grid with valid numbers using backtracking algorithm
     * @param {Array} grid - 2D array representing the Sudoku grid
     * @returns {boolean} true if the grid was filled successfully
     */
    fillGrid(grid) {
        // Find an empty cell
        const emptyCell = this.findEmptyCell(grid);
        
        // If no empty cells found, grid is filled
        if (!emptyCell) {
            return true;
        }
        
        const [row, col] = emptyCell;
        
        // Try numbers 1-9 in random order for more variety
        const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        
        for (const num of numbers) {
            // Check if number can be placed at this position
            if (this.isValidPlacement(grid, row, col, num)) {
                // Place the number
                grid[row][col] = num;
                
                // Recursively try to fill the rest of the grid
                if (this.fillGrid(grid)) {
                    return true;
                }
                
                // If we can't fill the grid with this number, backtrack
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
     * Shuffle array using Fisher-Yates algorithm
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    /**
     * Remove numbers from the puzzle based on difficulty
     * @param {Array} puzzle - 2D array representing a solved puzzle
     * @param {string} difficulty - 'easy', 'medium', or 'hard'
     */
    removeNumbers(puzzle, difficulty) {
        let cellsToRemove;
        
        // Set number of cells to remove based on difficulty
        switch (difficulty.toLowerCase()) {
            case 'easy':
                cellsToRemove = 35; // 46 numbers remain (out of 81)
                break;
            case 'medium':
                cellsToRemove = 45; // 36 numbers remain
                break;
            case 'hard':
                cellsToRemove = 55; // 26 numbers remain
                break;
            default:
                cellsToRemove = 35; // Default to easy
        }
        
        // Create array of all positions
        const positions = [];
        for (let row = 0; row < this.SIZE; row++) {
            for (let col = 0; col < this.SIZE; col++) {
                positions.push([row, col]);
            }
        }
        
        // Shuffle the positions
        const shuffledPositions = this.shuffleArray(positions);
        
        // Remove numbers from the puzzle
        for (let i = 0; i < cellsToRemove; i++) {
            const [row, col] = shuffledPositions[i];
            puzzle[row][col] = this.EMPTY_CELL;
        }
    }
}

// Export the generator
const sudokuGenerator = new SudokuGenerator();
