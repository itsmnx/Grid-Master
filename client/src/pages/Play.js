import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import SudokuBoard from '../components/SudokuBoard';
import { FiRotateCcw, FiZap, FiCheck, FiRefreshCw, FiPause, FiPlay } from 'react-icons/fi';
import '../styles/Play.css';

const Play = () => {
    const {
        currentState,
        solution,
        timer,
        setTimer,
        mistakes,
        setMistakes,
        hintsUsed,
        generatePuzzle,
        undoMove,
        getHint,
        validatePuzzle,
        saveGame,
        history
    } = useGame();

    const [difficulty, setDifficulty] = useState('easy');
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [message, setMessage] = useState('');

    const handleNewGame = useCallback(async () => {
        console.log('handleNewGame called with difficulty:', difficulty);
        const success = await generatePuzzle(difficulty);
        console.log('Generate puzzle result:', success);
        if (success) {
            setIsRunning(true);
            setIsPaused(false);
            setMessage('New game started! Good luck! 🎮');
            setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage('❌ Failed to generate puzzle. Please try again.');
            setTimeout(() => setMessage(''), 3000);
        }
    }, [difficulty, generatePuzzle]);

    // Auto-generate puzzle on component mount
    useEffect(() => {
        console.log('Play component mounted, currentState:', currentState);
        if (!currentState) {
            console.log('No current state, generating puzzle...');
            handleNewGame();
        }
    }, [currentState, handleNewGame]);

    // Auto-generate new puzzle when difficulty changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (currentState) {
            console.log('Difficulty changed to:', difficulty);
            handleNewGame();
        }
    }, [difficulty]);

    useEffect(() => {
        let interval;
        if (isRunning && !isPaused && currentState) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, isPaused, currentState, setTimer]);

    // Auto-save every 30 seconds
    useEffect(() => {
        if (!currentState || !isRunning || isPaused) return;
        
        const autoSaveInterval = setInterval(() => {
            saveGame('in-progress');
        }, 30000);
        
        return () => clearInterval(autoSaveInterval);
    }, [currentState, isRunning, isPaused, saveGame]);

    const handlePauseResume = () => {
        setIsPaused(!isPaused);
        if (!isPaused) {
            setMessage('⏸️ Game paused');
            setTimeout(() => setMessage(''), 2000);
        } else {
            setMessage('▶️ Game resumed');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleUndo = () => {
        if (history.length > 0) {
            undoMove();
            setMessage('Move undone');
            setTimeout(() => setMessage(''), 2000);
        } else {
            setMessage('No moves to undo');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleHint = async () => {
        const hint = await getHint();
        if (hint) {
            setMessage(`Hint given! Cell filled at row ${hint.row + 1}, col ${hint.col + 1}`);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleCheck = async () => {
        // First check if puzzle is complete (no empty cells)
        const hasEmptyCells = currentState.some(row => row.some(cell => cell === 0));
        
        if (hasEmptyCells) {
            setMessage('⚠️ Please fill all cells before checking!');
            setTimeout(() => setMessage(''), 3000);
            return;
        }
        
        // Count mistakes by comparing with solution
        if (solution) {
            let errorCount = 0;
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (currentState[row][col] !== solution[row][col]) {
                        errorCount++;
                    }
                }
            }
            
            if (errorCount === 0) {
                setMessage('🎉 Perfect! Puzzle solved correctly!');
                setIsRunning(false);
                setIsPaused(false);
                await saveGame('completed');
            } else {
                setMistakes(errorCount);
                setMessage(`❌ ${errorCount} mistake${errorCount > 1 ? 's' : ''} found. Keep trying!`);
            }
            setTimeout(() => setMessage(''), 3000);
            return;
        }
        
        // Fallback to backend validation
        const isValid = await validatePuzzle();
        if (isValid) {
            setMessage('🎉 Perfect! Puzzle solved correctly!');
            setIsRunning(false);
            setIsPaused(false);
            await saveGame('completed');
        } else {
            setMessage('❌ Some mistakes found. Keep trying!');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="play-page">
            <div className="play-container">
                <div className="play-header">
                    <h2>Play Sudoku</h2>
                    <div className="difficulty-selector">
                        <button
                            className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
                            onClick={() => setDifficulty('easy')}
                        >
                            Easy
                        </button>
                        <button
                            className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
                            onClick={() => setDifficulty('medium')}
                        >
                            Medium
                        </button>
                        <button
                            className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
                            onClick={() => setDifficulty('hard')}
                        >
                            Hard
                        </button>
                        <button
                            className={`difficulty-btn ${difficulty === 'expert' ? 'active' : ''}`}
                            onClick={() => setDifficulty('expert')}
                        >
                            Expert
                        </button>
                    </div>
                </div>

                {message && <div className="game-message">{message}</div>}

                <div className="game-content">
                    {isPaused && (
                        <div className="pause-overlay">
                            <div className="pause-message">
                                <h2>⏸️ Game Paused</h2>
                                <p>Click Resume to continue</p>
                            </div>
                        </div>
                    )}
                    
                    <div className="game-stats">
                        <div className="stat">
                            <span className="stat-label">Time</span>
                            <span className="stat-value">{formatTime(timer)}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Mistakes</span>
                            <span className="stat-value">{mistakes}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Hints</span>
                            <span className="stat-value">{hintsUsed}</span>
                        </div>
                    </div>

                    {!isPaused && <SudokuBoard />}

                    <div className="game-controls">
                        <button onClick={handleNewGame} className="btn btn-primary">
                            <FiRefreshCw /> New Game
                        </button>
                        <button 
                            onClick={handlePauseResume} 
                            className="btn btn-warning" 
                            disabled={!currentState}
                        >
                            {isPaused ? <><FiPlay /> Resume</> : <><FiPause /> Pause</>}
                        </button>
                        <button onClick={handleUndo} className="btn" disabled={!currentState || isPaused}>
                            <FiRotateCcw /> Undo
                        </button>
                        <button onClick={handleHint} className="btn" disabled={!currentState || isPaused}>
                            <FiZap /> Hint
                        </button>
                        <button onClick={handleCheck} className="btn btn-success" disabled={!currentState || isPaused}>
                            <FiCheck /> Check
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Play;
