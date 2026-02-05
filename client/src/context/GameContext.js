import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const GameContext = createContext();

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within GameProvider');
    }
    return context;
};

export const GameProvider = ({ children }) => {
    const [currentGame, setCurrentGame] = useState(null);
    const [puzzle, setPuzzle] = useState(null);
    const [solution, setSolution] = useState(null);
    const [currentState, setCurrentState] = useState(null);
    const [timer, setTimer] = useState(0);
    const [selectedCell, setSelectedCell] = useState(null);
    const [mistakes, setMistakes] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [history, setHistory] = useState([]);

    const generatePuzzle = async (difficulty = 'medium') => {
        try {
            console.log('Generating puzzle with difficulty:', difficulty);
            const res = await axios.post('/api/puzzles/generate', { difficulty });
            console.log('Puzzle response:', res.data);
            const { puzzle: newPuzzle, solution: puzzleSolution, gameId } = res.data.data;
            
            setPuzzle(newPuzzle);
            setSolution(puzzleSolution);
            setCurrentState(JSON.parse(JSON.stringify(newPuzzle)));
            setCurrentGame(gameId || null);
            setTimer(0);
            setMistakes(0);
            setHintsUsed(0);
            setHistory([]);
            setSelectedCell(null);
            
            console.log('Puzzle generated successfully');
            return true;
        } catch (error) {
            console.error('Generate puzzle error:', error);
            console.error('Error details:', error.response?.data);
            return false;
        }
    };

    const updateCell = (row, col, value) => {
        if (!currentState) return;
        
        const newState = currentState.map(r => [...r]);
        const oldValue = newState[row][col];
        
        // Don't update if it's the same value
        if (oldValue === value) return;
        
        newState[row][col] = value;
        
        setHistory([...history, { row, col, oldValue, newValue: value }]);
        setCurrentState(newState);
    };

    const undoMove = () => {
        if (history.length === 0) return;
        
        const lastMove = history[history.length - 1];
        const newState = currentState.map(r => [...r]);
        newState[lastMove.row][lastMove.col] = lastMove.oldValue;
        
        setCurrentState(newState);
        setHistory(history.slice(0, -1));
    };

    const getHint = async () => {
        // For guest users (no game ID), use client-side solution
        if (!currentGame && solution) {
            const emptyCells = [];
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (currentState[row][col] === 0) {
                        emptyCells.push({ row, col });
                    }
                }
            }
            
            if (emptyCells.length === 0) return null;
            
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const hint = {
                row: randomCell.row,
                col: randomCell.col,
                value: solution[randomCell.row][randomCell.col]
            };
            
            updateCell(hint.row, hint.col, hint.value);
            setHintsUsed(hintsUsed + 1);
            return hint;
        }
        
        // For logged-in users, use backend API
        if (!currentGame) return null;
        
        try {
            const res = await axios.post('/api/puzzles/hint', { gameId: currentGame });
            const { hint, hintsUsed: newHintsUsed } = res.data.data;
            
            if (hint) {
                updateCell(hint.row, hint.col, hint.value);
                setHintsUsed(newHintsUsed);
            }
            
            return hint;
        } catch (error) {
            console.error('Get hint error:', error);
            return null;
        }
    };

    const validatePuzzle = async () => {
        try {
            const res = await axios.post('/api/puzzles/validate', { puzzle: currentState });
            return res.data.data.isValid;
        } catch (error) {
            console.error('Validate error:', error);
            return false;
        }
    };

    const saveGame = async (status = 'in-progress') => {
        if (!currentGame) return;
        
        try {
            await axios.put(`/api/puzzles/${currentGame}`, {
                currentState,
                timeSpent: timer,
                status,
                mistakesMade: mistakes
            });
        } catch (error) {
            console.error('Save game error:', error);
        }
    };

    const resetGame = () => {
        setCurrentGame(null);
        setPuzzle(null);
        setSolution(null);
        setCurrentState(null);
        setTimer(0);
        setSelectedCell(null);
        setMistakes(0);
        setHintsUsed(0);
        setHistory([]);
    };

    const value = {
        currentGame,
        puzzle,
        solution,
        currentState,
        timer,
        setTimer,
        selectedCell,
        setSelectedCell,
        mistakes,
        setMistakes,
        hintsUsed,
        history,
        generatePuzzle,
        updateCell,
        undoMove,
        getHint,
        validatePuzzle,
        saveGame,
        resetGame
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
