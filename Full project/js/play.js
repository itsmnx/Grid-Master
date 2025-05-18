document.addEventListener('DOMContentLoaded', () => {
    // Game state variables
    let currentPuzzle = null;
    let solution = null;
    let selectedCell = null;
    let difficulty = 'easy';
    let isNotesMode = false;
    let timer = null;
    let seconds = 0;
    let fixedCells = []; // Array to track original puzzle cells that shouldn't be modified
    
    // DOM elements
    const sudokuGrid = document.getElementById('sudoku-grid');
    const timerDisplay = document.getElementById('timer-display');
    const statusMessage = document.getElementById('status-message');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const checkBtn = document.getElementById('check-btn');
    const solveBtn = document.getElementById('solve-btn');
    const notesToggle = document.getElementById('notes-toggle');
    const numberButtons = document.querySelectorAll('.number-btn');
    
    // Initialize the game
    initGame();
    
    /**
     * Initialize the game interface and event listeners
     */
    function initGame() {
        // Set up difficulty buttons
        difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                difficultyButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                difficulty = button.id.replace('-btn', '');
                startNewGame();
            });
        });
        
        // Set up control buttons
        newGameBtn.addEventListener('click', startNewGame);
        checkBtn.addEventListener('click', checkSolution);
        solveBtn.addEventListener('click', showSolution);
        
        // Set up notes toggle
        notesToggle.addEventListener('click', () => {
            isNotesMode = !isNotesMode;
            notesToggle.classList.toggle('active', isNotesMode);
            
            if (isNotesMode) {
                statusMessage.textContent = 'Notes mode: ON. Click on numbers to add notes.';
            } else {
                statusMessage.textContent = 'Notes mode: OFF. Click on numbers to fill cells.';
            }
        });
        
        // Set up number buttons
        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                const value = parseInt(button.dataset.value, 10);
                
                if (selectedCell) {
                    handleNumberInput(value);
                }
            });
        });
        
        // Start a new game
        startNewGame();
    }
    
    /**
     * Start a new Sudoku game
     */
    function startNewGame() {
        // Reset game state
        stopTimer();
        seconds = 0;
        updateTimerDisplay();
        
        // Generate new puzzle
        const result = sudokuGenerator.generatePuzzle(difficulty);
        currentPuzzle = result.puzzle;
        solution = result.solution;
        
        // Remember fixed cells (original puzzle cells)
        fixedCells = [];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (currentPuzzle[row][col] !== 0) {
                    fixedCells.push(`${row}-${col}`);
                }
            }
        }
        
        // Create the grid
        createGrid();
        
        // Start the timer
        startTimer();
        
        // Update status
        statusMessage.textContent = `New ${difficulty} game started. Good luck!`;
    }
    
    /**
     * Create the Sudoku grid in the DOM
     */
    function createGrid() {
        // Clear the grid
        sudokuGrid.innerHTML = '';
        
        // Create 9x9 grid
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'sudoku-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Add value if not empty
                const value = currentPuzzle[row][col];
                if (value !== 0) {
                    cell.textContent = value;
                    cell.classList.add('fixed');
                }
                
                // Add cell click event
                cell.addEventListener('click', () => {
                    // Deselect previous cell
                    if (selectedCell) {
                        selectedCell.classList.remove('selected');
                    }
                    
                    // Select this cell
                    cell.classList.add('selected');
                    selectedCell = cell;
                    
                    // Highlight related cells (same row, column, or box)
                    highlightRelatedCells(row, col);
                });
                
                // Add keyboard support for the whole grid
                cell.tabIndex = 0;
                cell.addEventListener('keydown', (e) => {
                    if (e.key >= '1' && e.key <= '9') {
                        handleNumberInput(parseInt(e.key, 10));
                    } else if (e.key === '0' || e.key === 'Backspace' || e.key === 'Delete') {
                        handleNumberInput(0);
                    }
                });
                
                sudokuGrid.appendChild(cell);
            }
        }
    }
    
    /**
     * Handle number input from keyboard or number pad
     * @param {number} value - Number value (0 for erasing)
     */
    function handleNumberInput(value) {
        if (!selectedCell) return;
        
        const row = parseInt(selectedCell.dataset.row, 10);
        const col = parseInt(selectedCell.dataset.col, 10);
        
        // Don't modify fixed cells
        if (fixedCells.includes(`${row}-${col}`)) {
            statusMessage.textContent = 'Cannot modify original puzzle cells!';
            return;
        }
        
        if (isNotesMode && value !== 0) {
            // Handle notes mode
            handleNoteInput(row, col, value);
        } else {
            // Handle regular number input
            
            // Update the display
            if (value === 0) {
                selectedCell.textContent = '';
                selectedCell.classList.remove('error');
                // Remove any notes if present
                if (selectedCell.querySelector('.notes-grid')) {
                    selectedCell.innerHTML = '';
                }
            } else {
                // Remove any notes if present
                if (selectedCell.querySelector('.notes-grid')) {
                    selectedCell.innerHTML = '';
                }
                
                selectedCell.textContent = value;
                
                // Check if placement is valid
                if (!sudokuSolver.validateCell(getCurrentGridState(), row, col, value)) {
                    selectedCell.classList.add('error');
                } else {
                    selectedCell.classList.remove('error');
                }
            }
            
            // Update puzzle state
            currentPuzzle[row][col] = value;
            
            // Check if puzzle is complete
            if (isPuzzleComplete()) {
                handlePuzzleComplete();
            }
        }
    }
    
    /**
     * Handle note input in notes mode
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {number} value - Note value (1-9)
     */
    function handleNoteInput(row, col, value) {
        // Create notes grid if it doesn't exist
        let notesGrid = selectedCell.querySelector('.notes-grid');
        
        if (!notesGrid) {
            // Clear any existing content
            selectedCell.textContent = '';
            selectedCell.classList.remove('error');
            
            // Create notes grid
            notesGrid = document.createElement('div');
            notesGrid.className = 'notes-grid';
            
            // Create 9 note cells
            for (let i = 1; i <= 9; i++) {
                const noteCell = document.createElement('div');
                noteCell.className = 'note';
                noteCell.dataset.value = i;
                notesGrid.appendChild(noteCell);
            }
            
            selectedCell.appendChild(notesGrid);
        }
        
        // Find the note cell for this value
        const noteCell = notesGrid.querySelector(`.note[data-value="${value}"]`);
        
        // Toggle note
        if (noteCell.textContent === String(value)) {
            noteCell.textContent = '';
        } else {
            noteCell.textContent = value;
        }
        
        // Remove cell from puzzle state (notes are visual only)
        currentPuzzle[row][col] = 0;
    }
    
    /**
     * Highlight related cells (same row, column, or box)
     * @param {number} row - Row index
     * @param {number} col - Column index
     */
    function highlightRelatedCells(row, col) {
        // Remove previous highlights
        const cells = document.querySelectorAll('.sudoku-cell');
        cells.forEach(cell => cell.classList.remove('highlight'));
        
        // Highlight same row and column
        for (let i = 0; i < 9; i++) {
            // Highlight row
            const rowCell = document.querySelector(`.sudoku-cell[data-row="${row}"][data-col="${i}"]`);
            if (rowCell) rowCell.classList.add('highlight');
            
            // Highlight column
            const colCell = document.querySelector(`.sudoku-cell[data-row="${i}"][data-col="${col}"]`);
            if (colCell) colCell.classList.add('highlight');
        }
        
        // Highlight same box
        const boxStartRow = Math.floor(row / 3) * 3;
        const boxStartCol = Math.floor(col / 3) * 3;
        
        for (let r = boxStartRow; r < boxStartRow + 3; r++) {
            for (let c = boxStartCol; c < boxStartCol + 3; c++) {
                const boxCell = document.querySelector(`.sudoku-cell[data-row="${r}"][data-col="${c}"]`);
                if (boxCell) boxCell.classList.add('highlight');
            }
        }
    }
    
    /**
     * Get the current state of the grid
     * @returns {Array} 2D array representing the current grid state
     */
    function getCurrentGridState() {
        return JSON.parse(JSON.stringify(currentPuzzle));
    }
    
    /**
     * Check if the puzzle is complete (all cells filled)
     * @returns {boolean} true if puzzle is complete
     */
    function isPuzzleComplete() {
        // Check if all cells are filled
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (currentPuzzle[row][col] === 0) {
                    return false;
                }
            }
        }
        
        // Check if solution is valid
        return sudokuSolver.isComplete(currentPuzzle);
    }
    
    /**
     * Handle puzzle completion
     */
    function handlePuzzleComplete() {
        stopTimer();
        
        const formattedTime = formatTime(seconds);
        statusMessage.textContent = `Congratulations! You solved the ${difficulty} puzzle in ${formattedTime}!`;
        
        // Disable number buttons
        numberButtons.forEach(button => {
            button.disabled = true;
        });
        
        // Add completion animation
        sudokuGrid.classList.add('completed');
        setTimeout(() => {
            sudokuGrid.classList.remove('completed');
        }, 2000);
    }
    
    /**
     * Check the current solution
     */
    function checkSolution() {
        const errors = sudokuSolver.findErrors(currentPuzzle);
        
        // Clear previous error markers
        const cells = document.querySelectorAll('.sudoku-cell');
        cells.forEach(cell => cell.classList.remove('error'));
        
        if (errors.length === 0) {
            // No errors found
            statusMessage.textContent = 'Looking good so far!';
            
            // Check if the puzzle is complete
            if (isPuzzleComplete()) {
                handlePuzzleComplete();
            } else {
                statusMessage.textContent += ' Keep going!';
            }
        } else {
            // Mark errors
            errors.forEach(([r, c]) => {
                const cell = document.querySelector(`.sudoku-cell[data-row="${r}"][data-col="${c}"]`);
                if (cell) cell.classList.add('error');
            });
            
            statusMessage.textContent = `Found ${errors.length} error${errors.length > 1 ? 's' : ''}. Try again!`;
        }
    }
    
    /**
     * Show the solution
     */
    function showSolution() {
        // Confirm from user
        if (!confirm('Are you sure you want to see the solution? This will end the current game.')) {
            return;
        }
        
        // Stop the timer
        stopTimer();
        
        // Fill in the solution
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                currentPuzzle[row][col] = solution[row][col];
                
                // Update cell display
                const cell = document.querySelector(`.sudoku-cell[data-row="${row}"][data-col="${col}"]`);
                if (cell) {
                    cell.textContent = solution[row][col];
                    
                    // Highlight cells that were filled by the solver
                    if (!fixedCells.includes(`${row}-${col}`)) {
                        cell.classList.add('highlight');
                    }
                }
            }
        }
        
        statusMessage.textContent = 'Solution revealed. Start a new game to play again.';
        
        // Disable number buttons
        numberButtons.forEach(button => {
            button.disabled = true;
        });
    }
    
    /**
     * Start the timer
     */
    function startTimer() {
        stopTimer(); // Clear any existing timer
        
        timer = setInterval(() => {
            seconds++;
            updateTimerDisplay();
        }, 1000);
    }
    
    /**
     * Stop the timer
     */
    function stopTimer() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }
    
    /**
     * Update the timer display
     */
    function updateTimerDisplay() {
        timerDisplay.textContent = formatTime(seconds);
    }
    
    /**
     * Format time as MM:SS
     * @param {number} totalSeconds - Total seconds to format
     * @returns {string} Formatted time string
     */
    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
});
