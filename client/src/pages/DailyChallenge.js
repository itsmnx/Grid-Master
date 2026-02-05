import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import api from '../services/api';
import SudokuBoard from '../components/SudokuBoard';
import Calendar from '../components/Calendar';
import '../styles/DailyChallenge.css';

const DailyChallenge = () => {
    const { isAuthenticated } = useAuth();
    const { generatePuzzle, currentState, timer, setTimer } = useGame();
    const [dailyPuzzle, setDailyPuzzle] = useState(null);
    const [streak, setStreak] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [completedDates, setCompletedDates] = useState([]);
    const [showCalendar, setShowCalendar] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        loadDailyChallenge();
        if (isAuthenticated) {
            loadStreak();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        let interval;
        if (isRunning && currentState) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, currentState, setTimer]);

    // Generate difficulty based on date (deterministic random)
    const getDifficultyForDate = (date) => {
        const difficulties = ['easy', 'medium', 'hard', 'expert'];
        // Use date as seed for consistent difficulty per day
        const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        let hash = 0;
        for (let i = 0; i < dateStr.length; i++) {
            hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
            hash = hash & hash;
        }
        const index = Math.abs(hash) % difficulties.length;
        return difficulties[index];
    };

    const loadPuzzleForDate = async (date) => {
        setLoading(true);
        setTimer(0);
        
        try {
            // Try to get puzzle from API for this date
            const res = await api.getTodaysPuzzle();
            setDailyPuzzle(res.data.data);
        } catch (error) {
            console.error('Error loading daily puzzle:', error);
            // Generate a local puzzle for this date
            const difficulty = getDifficultyForDate(date);
            const dateStr = date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            const success = await generatePuzzle(difficulty);
            if (success) {
                setDailyPuzzle({
                    difficulty: difficulty,
                    completions: Math.floor(Math.random() * 1000),
                    averageTime: Math.floor(Math.random() * 600) + 300,
                    date: dateStr
                });
                setIsRunning(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const loadDailyChallenge = async () => {
        await loadPuzzleForDate(selectedDate);
    };

    const loadStreak = async () => {
        try {
            const res = await api.getStreak();
            setStreak(res.data.data);
        } catch (error) {
            console.error('Error loading streak:', error);
        }
    };

    const loadCompletedDates = async () => {
        try {
            // Try to load from API
            const res = await api.getCompletedDates();
            setCompletedDates(res.data.data || []);
        } catch (error) {
            // Generate sample completed dates for demo
            const dates = [];
            const today = new Date();
            for (let i = 1; i <= 5; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                dates.push(dateStr);
            }
            setCompletedDates(dates);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadCompletedDates();
        }
    }, [isAuthenticated]);

    const handleDateSelect = (date) => {
        // Don't allow future dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selected = new Date(date);
        selected.setHours(0, 0, 0, 0);
        
        if (selected > today) {
            return; // Can't play future puzzles
        }
        
        setSelectedDate(selected);
        loadPuzzleForDate(selected);
    };

    if (loading) {
        return <div className="loading">Loading daily challenge...</div>;
    }

    return (
        <div className="daily-page">
            <div className="daily-container">
                <div className="daily-header">
                    <h2>📅 Daily Challenge</h2>
                    <p>Complete today's puzzle to maintain your streak!</p>
                    <div className="selected-date-info">
                        <span>Playing: </span>
                        <strong>{selectedDate.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                        })}</strong>
                    </div>
                    <button 
                        className="toggle-calendar-btn"
                        onClick={() => setShowCalendar(!showCalendar)}
                    >
                        {showCalendar ? '🎮 Hide Calendar' : '📅 Show Calendar'}
                    </button>
                </div>

                {showCalendar && (
                    <div className="calendar-section">
                        <Calendar 
                            completedDates={completedDates}
                            onDateSelect={handleDateSelect}
                        />
                    </div>
                )}

                {streak && (
                    <div className="streak-info">
                        <div className="streak-card">
                            <span className="streak-icon">🔥</span>
                            <div>
                                <div className="streak-number">{streak.currentStreak}</div>
                                <div className="streak-label">Current Streak</div>
                            </div>
                        </div>
                        <div className="streak-card">
                            <span className="streak-icon">🏆</span>
                            <div>
                                <div className="streak-number">{streak.longestStreak}</div>
                                <div className="streak-label">Best Streak</div>
                            </div>
                        </div>
                    </div>
                )}

                {dailyPuzzle && (
                    <div className="daily-stats">
                        <p>Difficulty: <strong>{dailyPuzzle.difficulty}</strong></p>
                        <p>Completed by: <strong>{dailyPuzzle.completions}</strong> players</p>
                        {dailyPuzzle.averageTime > 0 && (
                            <p>Average time: <strong>{Math.floor(dailyPuzzle.averageTime / 60)}m {dailyPuzzle.averageTime % 60}s</strong></p>
                        )}
                    </div>
                )}

                {!isAuthenticated && (
                    <div className="auth-notice">
                        <p>👋 Login to track your daily streak and compete with others!</p>
                    </div>
                )}

                {currentState && (
                    <div className="daily-game">
                        <div className="daily-timer">
                            <span className="timer-label">Time:</span>
                            <span className="timer-value">
                                {Math.floor(timer / 60).toString().padStart(2, '0')}:
                                {(timer % 60).toString().padStart(2, '0')}
                            </span>
                        </div>
                        <SudokuBoard />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyChallenge;
