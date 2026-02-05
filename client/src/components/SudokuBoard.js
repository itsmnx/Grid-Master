import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import '../styles/SudokuBoard.css';

const SudokuBoard = () => {
    const {
        puzzle,
        solution,
        currentState,
        selectedCell,
        setSelectedCell,
        updateCell
    } = useGame();

    const [fixedCells, setFixedCells] = useState(new Set());
    const [notesMode, setNotesMode] = useState(false);
    const [notes, setNotes] = useState({});
    const [conflictCells, setConflictCells] = useState(new Set());

    useEffect(() => {
        if (puzzle) {
            const fixed = new Set();
            puzzle.forEach((row, r) => {
                row.forEach((cell, c) => {
                    if (cell !== 0) fixed.add(`${r}-${c}`);
                });
            });
            setFixedCells(fixed);
            setNotes({});
        }
    }, [puzzle]);

    // Check for conflicts whenever the board changes
    useEffect(() => {
        if (!currentState) return;
        
        const conflicts = new Set();
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const value = currentState[row][col];
                if (value === 0) continue;
                
                // Check for duplicates in row
                for (let c = 0; c < 9; c++) {
                    if (c !== col && currentState[row][c] === value) {
                        conflicts.add(`${row}-${col}`);
                        conflicts.add(`${row}-${c}`);
                    }
                }
                
                // Check for duplicates in column
                for (let r = 0; r < 9; r++) {
                    if (r !== row && currentState[r][col] === value) {
                        conflicts.add(`${row}-${col}`);
                        conflicts.add(`${r}-${col}`);
                    }
                }
                
                // Check for duplicates in 3x3 box
                const boxRow = Math.floor(row / 3) * 3;
                const boxCol = Math.floor(col / 3) * 3;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        const r = boxRow + i;
                        const c = boxCol + j;
                        if ((r !== row || c !== col) && currentState[r][c] === value) {
                            conflicts.add(`${row}-${col}`);
                            conflicts.add(`${r}-${c}`);
                        }
                    }
                }
            }
        }
        
        setConflictCells(conflicts);
    }, [currentState]);

    const handleCellClick = (row, col) => {
        if (!fixedCells.has(`${row}-${col}`)) {
            setSelectedCell({ row, col });
        }
    };

    const handleKeyPress = (e) => {
        if (!selectedCell) return;
        
        const num = parseInt(e.key);
        const cellKey = `${selectedCell.row}-${selectedCell.col}`;
        
        if (num >= 1 && num <= 9) {
            if (notesMode) {
                // Toggle note
                const currentNotes = notes[cellKey] || [];
                const newNotes = currentNotes.includes(num)
                    ? currentNotes.filter(n => n !== num)
                    : [...currentNotes, num].sort();
                
                setNotes({
                    ...notes,
                    [cellKey]: newNotes
                });
            } else {
                updateCell(selectedCell.row, selectedCell.col, num);
                // Clear notes for this cell when a value is entered
                if (notes[cellKey]) {
                    const newNotes = { ...notes };
                    delete newNotes[cellKey];
                    setNotes(newNotes);
                }
            }
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            updateCell(selectedCell.row, selectedCell.col, 0);
        } else if (e.key === 'n' || e.key === 'N') {
            setNotesMode(!notesMode);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCell, updateCell, notesMode, notes]);

    if (!currentState) {
        return <div className="no-puzzle">No puzzle loaded</div>;
    }

    const handleNumberClick = (num) => {
        if (!selectedCell || fixedCells.has(`${selectedCell.row}-${selectedCell.col}`)) {
            return;
        }
        
        const cellKey = `${selectedCell.row}-${selectedCell.col}`;
        
        if (notesMode) {
            // Toggle note
            const currentNotes = notes[cellKey] || [];
            const newNotes = currentNotes.includes(num)
                ? currentNotes.filter(n => n !== num)
                : [...currentNotes, num].sort();
            
            setNotes({
                ...notes,
                [cellKey]: newNotes
            });
        } else {
            updateCell(selectedCell.row, selectedCell.col, num);
            // Clear notes for this cell when a value is entered
            if (notes[cellKey]) {
                const newNotes = { ...notes };
                delete newNotes[cellKey];
                setNotes(newNotes);
            }
        }
    };

    const handleClear = () => {
        if (!selectedCell || fixedCells.has(`${selectedCell.row}-${selectedCell.col}`)) {
            return;
        }
        
        const cellKey = `${selectedCell.row}-${selectedCell.col}`;
        updateCell(selectedCell.row, selectedCell.col, 0);
        
        // Also clear notes
        if (notes[cellKey]) {
            const newNotes = { ...notes };
            delete newNotes[cellKey];
            setNotes(newNotes);
        }
    };

    return (
        <div className="sudoku-container">
            <div className="controls-top">
                <button 
                    className={`mode-toggle ${notesMode ? 'active' : ''}`}
                    onClick={() => setNotesMode(!notesMode)}
                >
                    {notesMode ? '📝 Notes Mode' : '✏️ Number Mode'}
                </button>
                <span className="hint-text">Press 'N' to toggle notes</span>
            </div>
            
            <div className="sudoku-board">
                {currentState.map((row, rowIndex) => (
                    <div key={rowIndex} className="sudoku-row">
                        {row.map((cell, colIndex) => {
                            const cellKey = `${rowIndex}-${colIndex}`;
                            const isFixed = fixedCells.has(cellKey);
                            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                            const isHighlighted = selectedCell && (
                                selectedCell.row === rowIndex ||
                                selectedCell.col === colIndex ||
                                (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
                                 Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3))
                            );
                            const hasConflict = conflictCells.has(cellKey);
                            const cellNotes = notes[cellKey] || [];
                            const isIncorrect = solution && !isFixed && cell !== 0 && cell !== solution[rowIndex][colIndex];
                            const isSameNumber = selectedCell && currentState[selectedCell.row][selectedCell.col] !== 0 && 
                                               cell === currentState[selectedCell.row][selectedCell.col];

                            return (
                                <div
                                    key={cellKey}
                                    className={`sudoku-cell 
                                        ${isFixed ? 'fixed' : ''} 
                                        ${isSelected ? 'selected' : ''}
                                        ${isHighlighted ? 'highlighted' : ''}
                                        ${hasConflict ? 'conflict' : ''}
                                        ${isIncorrect ? 'incorrect' : ''}
                                        ${isSameNumber ? 'same-number' : ''}
                                        ${(colIndex + 1) % 3 === 0 && colIndex < 8 ? 'right-border' : ''}
                                        ${(rowIndex + 1) % 3 === 0 && rowIndex < 8 ? 'bottom-border' : ''}
                                    `}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                >
                                    {cell !== 0 ? (
                                        <span className="cell-value">{cell}</span>
                                    ) : cellNotes.length > 0 ? (
                                        <div className="cell-notes">
                                            {[1,2,3,4,5,6,7,8,9].map(n => (
                                                <span key={n} className="note">
                                                    {cellNotes.includes(n) ? n : ''}
                                                </span>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            
            <div className="number-pad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                        key={num}
                        className={`number-btn ${notesMode ? 'notes-mode' : ''}`}
                        onClick={() => handleNumberClick(num)}
                        disabled={!selectedCell}
                    >
                        {num}
                    </button>
                ))}
                <button
                    className="number-btn clear-btn"
                    onClick={handleClear}
                    disabled={!selectedCell}
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default SudokuBoard;
