class SudokuGame {
    constructor(difficulty = 'easy') {
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.difficulty = difficulty;
        this.startTime = null;
        this.elapsedTime = 0;
        this.timer = null;
        this.cellSelected = null;
        this.mistakes = 0;
        this.maxMistakes = 3;
        this.isGameOver = false;
    }

    init() {
        this.generateSudoku();
        this.renderGrid();
        this.attachEventListeners();
        this.startTimer();
        document.getElementById('difficulty-level').textContent = this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
    }

    generateSudoku() {
        this.generateSolvedGrid();
        this.createPuzzle();
    }

    generateSolvedGrid() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.solution[i][j] = 0;
            }
        }
        
        this.fillDiagonalBoxes();
        
        if (this.solveSudoku()) {
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    this.grid[i][j] = this.solution[i][j];
                }
            }
        } else {
            console.error("Failed to generate a valid Sudoku solution");
            this.generateSolvedGrid();
        }
    }

    fillDiagonalBoxes() {
        for (let box = 0; box < 9; box += 3) {
            this.fillBox(box, box);
        }
    }
    fillBox(row, col) {
        let num;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                do {
                    num = Math.floor(Math.random() * 9) + 1;
                } while (!this.isValidInBox(row, col, num));
                
                this.solution[row + i][col + j] = num;
            }
        }
    }

    isValidInBox(row, col, num) {
        let boxStartRow = row - (row % 3);
        let boxStartCol = col - (col % 3);
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.solution[boxStartRow + i][boxStartCol + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    solveSudoku() {
        let emptyCell = this.findEmptyCell();
        if (!emptyCell) {
            return true; 
        }
        const [row, col] = emptyCell;
        const nums = this.getRandomOrderNumbers();
        
        for (let num of nums) {
            if (this.isValidPlacement(row, col, num)) {
                this.solution[row][col] = num;
                if (this.solveSudoku()) {
                    return true;
                }
                this.solution[row][col] = 0;
            }
        }
        
        return false; 
    }
    
    getRandomOrderNumbers() {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = nums.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nums[i], nums[j]] = [nums[j], nums[i]]; // Swap
        }
        return nums;
    }

    // Find an empty cell in the grid
    findEmptyCell() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.solution[i][j] === 0) {
                    return [i, j];
                }
            }
        }
        return null; // No empty cell found
    }

    // Check if a number can be placed at position (row, col)
    isValidPlacement(row, col, num) {
        // Check row
        for (let j = 0; j < 9; j++) {
            if (this.solution[row][j] === num) {
                return false;
            }
        }
        
        // Check column
        for (let i = 0; i < 9; i++) {
            if (this.solution[i][col] === num) {
                return false;
            }
        }
        
        // Check 3x3 box
        return this.isValidInBox(row, col, num);
    }

    // Create puzzle by removing numbers from the solved grid
    createPuzzle() {
        const cellsToRemove = this.getDifficultyRemovalCount();
        let count = 0;
        
        while (count < cellsToRemove) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            
            if (this.grid[row][col] !== 0) {
                // Remember the value in case we need to put it back
                const backup = this.grid[row][col];
                this.grid[row][col] = 0;
                
                // Make sure the puzzle still has a unique solution
                if (this.hasUniqueSolution()) {
                    count++;
                } else {
                    // Restore the value if removing it creates multiple solutions
                    this.grid[row][col] = backup;
                }
            }
        }
    }

    // Get the number of cells to remove based on difficulty
    getDifficultyRemovalCount() {
        switch (this.difficulty) {
            case 'easy':
                return 35; // Leave ~46 clues
            case 'medium':
                return 45; // Leave ~36 clues
            case 'hard':
                return 55; // Leave ~26 clues
            default:
                return 35;
        }
    }

    // Check if the puzzle has a unique solution (simplified check)
    hasUniqueSolution() {
        // In a real implementation, we would check uniqueness more thoroughly
        // For now, assume unique to avoid complexity
        return true;
    }

    // Render the Sudoku grid
    renderGrid() {
        const sudokuBoard = document.getElementById('sudoku-board');
        sudokuBoard.innerHTML = '';

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.className = 'sudoku-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                // Add styling for borders
                if (i % 3 === 0) cell.classList.add('border-top');
                if (i === 8) cell.classList.add('border-bottom');
                if (j % 3 === 0) cell.classList.add('border-left');
                if (j === 8) cell.classList.add('border-right');
                
                // Add number if exists in grid
                if (this.grid[i][j] !== 0) {
                    cell.textContent = this.grid[i][j];
                    cell.classList.add('fixed');
                } else {
                    cell.classList.add('editable');
                }
                
                sudokuBoard.appendChild(cell);
            }
        }
    }

    // Attach event listeners for user interaction
    attachEventListeners() {
        // Cell selection
        document.querySelectorAll('.sudoku-cell').forEach(cell => {
            cell.addEventListener('click', (event) => {
                if (this.isGameOver) return;
                
                // Remove selection from previously selected cell
                if (this.cellSelected) {
                    this.cellSelected.classList.remove('selected');
                }
                
                // Select new cell if it's editable
                if (cell.classList.contains('editable')) {
                    cell.classList.add('selected');
                    this.cellSelected = cell;
                } else {
                    this.cellSelected = null;
                }
            });
        });
        
        // Number input
        document.addEventListener('keydown', (event) => {
            if (this.isGameOver || !this.cellSelected) return;
            
            const key = event.key;
            
            if (/^[1-9]$/.test(key)) {
                this.enterNumber(parseInt(key));
            } else if (key === 'Backspace' || key === 'Delete') {
                this.clearCell();
            }
        });
        
        // Number pad
        document.querySelectorAll('.number-pad button').forEach(button => {
            button.addEventListener('click', () => {
                if (this.isGameOver || !this.cellSelected) return;
                
                const num = parseInt(button.textContent);
                this.enterNumber(num);
            });
        });
        
        // Clear button
        document.getElementById('clear-button').addEventListener('click', () => {
            if (this.isGameOver || !this.cellSelected) return;
            this.clearCell();
        });
        
        // New game button
        document.getElementById('new-game-button').addEventListener('click', () => {
            this.newGame();
        });
        
        // Hint button (if exists)
        const hintButton = document.getElementById('hint-button');
        if (hintButton) {
            hintButton.addEventListener('click', () => {
                if (this.isGameOver || !this.cellSelected) return;
                this.giveHint();
            });
        }
    }

    // Enter a number in the selected cell
    enterNumber(num) {
        if (!this.cellSelected || this.cellSelected.classList.contains('fixed')) return;
        
        const row = parseInt(this.cellSelected.dataset.row);
        const col = parseInt(this.cellSelected.dataset.col);
        
        // Check if the number is correct
        const isCorrect = (num === this.solution[row][col]);
        
        this.cellSelected.textContent = num;
        this.grid[row][col] = num;
        
        if (isCorrect) {
            this.cellSelected.classList.add('correct');
            this.cellSelected.classList.remove('incorrect');
            
            // Check if the puzzle is completed
            if (this.isPuzzleComplete()) {
                this.gameWon();
            }
        } else {
            this.cellSelected.classList.add('incorrect');
            this.cellSelected.classList.remove('correct');
            this.mistakes++;
            this.updateMistakesCounter();
            
            // Check if max mistakes reached
            if (this.mistakes >= this.maxMistakes) {
                this.gameLost();
            }
        }
    }

    // Clear the selected cell
    clearCell() {
        if (!this.cellSelected || this.cellSelected.classList.contains('fixed')) return;
        
        const row = parseInt(this.cellSelected.dataset.row);
        const col = parseInt(this.cellSelected.dataset.col);
        
        this.cellSelected.textContent = '';
        this.grid[row][col] = 0;
        
        this.cellSelected.classList.remove('correct');
        this.cellSelected.classList.remove('incorrect');
    }

    // Give a hint by filling in the correct number
    giveHint() {
        if (!this.cellSelected || this.cellSelected.classList.contains('fixed')) return;
        
        const row = parseInt(this.cellSelected.dataset.row);
        const col = parseInt(this.cellSelected.dataset.col);
        
        this.cellSelected.textContent = this.solution[row][col];
        this.grid[row][col] = this.solution[row][col];
        
        this.cellSelected.classList.add('hint');
        this.cellSelected.classList.add('correct');
        this.cellSelected.classList.remove('incorrect');
        
        // Check if the puzzle is completed
        if (this.isPuzzleComplete()) {
            this.gameWon();
        }
    }

    // Check if the puzzle is complete and correct
    isPuzzleComplete() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.grid[i][j] === 0 || this.grid[i][j] !== this.solution[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    // Start the game timer
    startTimer() {
        this.startTime = new Date();
        this.timer = setInterval(() => {
            const currentTime = new Date();
            this.elapsedTime = Math.floor((currentTime - this.startTime) / 1000);
            this.updateTimerDisplay();
        }, 1000);
    }

    // Update the timer display
    updateTimerDisplay() {
        const minutes = Math.floor(this.elapsedTime / 60);
        const seconds = this.elapsedTime % 60;
        
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timer').textContent = formattedTime;
    }

    // Update the mistakes counter
    updateMistakesCounter() {
        document.getElementById('mistakes').textContent = `${this.mistakes}/${this.maxMistakes}`;
    }

    // Game won
    gameWon() {
        clearInterval(this.timer);
        this.isGameOver = true;
        
        // Calculate score based on difficulty and time
        const difficultyMultiplier = this.getDifficultyMultiplier();
        const timeBonus = Math.max(0, 1000 - this.elapsedTime);
        const score = Math.floor((1000 + timeBonus) * difficultyMultiplier);
        
        // Show win message
        const gameResult = document.getElementById('game-result');
        gameResult.innerHTML = `
            <div class="result-popup">
                <h2>Congratulations!</h2>
                <p>You've completed the ${this.difficulty} puzzle.</p>
                <p>Time: ${Math.floor(this.elapsedTime / 60)}m ${this.elapsedTime % 60}s</p>
                <p>Score: ${score}</p>
                <button id="play-again">Play Again</button>
            </div>
        `;
        gameResult.style.display = 'flex';
        
        // Add event listener to play again button
        document.getElementById('play-again').addEventListener('click', () => {
            gameResult.style.display = 'none';
            this.newGame();
        });
        
        this.saveScore(score);
    }

    gameLost() {
        clearInterval(this.timer);
        this.isGameOver = true;
        const gameResult = document.getElementById('game-result');
        gameResult.innerHTML = `
            <div class="result-popup">
                <h2>Game Over</h2>
                <p>You've made too many mistakes.</p>
                <p>Time: ${Math.floor(this.elapsedTime / 60)}m ${this.elapsedTime % 60}s</p>
                <button id="play-again">Try Again</button>
                <button id="show-solution">Show Solution</button>
            </div>
        `;
        gameResult.style.display = 'flex';
        
        document.getElementById('play-again').addEventListener('click', () => {
            gameResult.style.display = 'none';
            this.newGame();
        });
        
        document.getElementById('show-solution').addEventListener('click', () => {
            gameResult.style.display = 'none';
            this.showSolution();
        });
    }

    showSolution() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.querySelector(`.sudoku-cell[data-row="${i}"][data-col="${j}"]`);
                
                if (this.grid[i][j] !== this.solution[i][j]) {
                    cell.textContent = this.solution[i][j];
                    cell.classList.add('solution');
                }
            }
        }
    }

    newGame() {
        clearInterval(this.timer);
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.startTime = null;
        this.elapsedTime = 0;
        this.cellSelected = null;
        this.mistakes = 0;
        this.isGameOver = false;
        
        this.init();
        this.updateMistakesCounter();
    }

    getDifficultyMultiplier() {
        switch (this.difficulty) {
            case 'easy': return 1;
            case 'medium': return 1.5;
            case 'hard': return 2;
            default: return 1;
        }
    }

    saveScore(score) {
        const token = localStorage.getItem('sudoku_auth_token');
        if (!token) return;
        
        fetch('/api/saveScore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                difficulty: this.difficulty,
                time: this.elapsedTime,
                score: score,
                mistakes: this.mistakes
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Score saved:', data);
        })
        .catch(error => {
            console.error('Error saving score:', error);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const difficulty = urlParams.get('difficulty') || 'easy';
    const game = new SudokuGame(difficulty);
    game.init();
    const difficultySelect = document.getElementById('difficulty-select');
    if (difficultySelect) {
        difficultySelect.value = difficulty;
        difficultySelect.addEventListener('change', (event) => {
            window.location.href = `play.html?difficulty=${event.target.value}`;
        });
    }
});