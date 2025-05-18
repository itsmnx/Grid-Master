// js/sudoku.js

async function fetchSudokuBoard() {
  const boardContainer = document.getElementById('sudoku-board');
  try {
    const response = await fetch('https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value}}}');
    const data = await response.json();

    const grids = data.data.newboard[0].grids;

    // Clear previous board and reset grid styles
    boardContainer.innerHTML = '';
    boardContainer.style.display = 'grid';
    boardContainer.style.gridTemplateColumns = 'repeat(9, 40px)';
    boardContainer.style.gridTemplateRows = 'repeat(9, 40px)';
    boardContainer.style.gap = '2px';

    // Create cells as input elements for interaction
    grids.forEach(cell => {
      const cellInput = document.createElement('input');
      cellInput.type = 'text';
      cellInput.maxLength = 1;
      cellInput.style.width = '40px';
      cellInput.style.height = '40px';
      cellInput.style.textAlign = 'center';
      cellInput.style.fontSize = '20px';
      cellInput.style.fontWeight = 'bold';
      cellInput.style.border = '1px solid #555';
      cellInput.style.outline = 'none';

      if (cell.value !== 0) {
        cellInput.value = cell.value;
        cellInput.disabled = true; // pre-filled clues are readonly
        cellInput.style.backgroundColor = '#ddd';
        cellInput.style.cursor = 'default';
      } else {
        cellInput.value = '';
        cellInput.style.backgroundColor = 'white';
        cellInput.style.cursor = 'text';
      }

      // Optional: Allow only numbers 1-9 in empty cells
      cellInput.addEventListener('input', () => {
        const val = cellInput.value;
        if (!/^[1-9]$/.test(val)) {
          cellInput.value = '';
        }
      });

      boardContainer.appendChild(cellInput);
    });

  } catch (error) {
    boardContainer.textContent = 'Failed to load Sudoku board.';
    console.error(error);
  }
}

// Load board on page load
window.addEventListener('load', fetchSudokuBoard);

// Reload board on "New Game" button click
document.getElementById('new-game').addEventListener('click', fetchSudokuBoard);
