import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Leaderboard.css';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            const res = await api.getLeaderboard();
            setLeaders(res.data.data);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading leaderboard...</div>;
    }

    return (
        <div className="leaderboard-page">
            <div className="leaderboard-container">
                <h2>🏆 Leaderboard</h2>
                <p className="leaderboard-subtitle">Top Sudoku Players</p>

                <div className="leaderboard-table">
                    <div className="table-header">
                        <span>Rank</span>
                        <span>Player</span>
                        <span>Games</span>
                        <span>Streak</span>
                    </div>
                    {leaders.map((user, index) => (
                        <div key={user._id} className={`table-row ${index < 3 ? 'top-three' : ''}`}>
                            <span className="rank">
                                {index === 0 && '🥇'}
                                {index === 1 && '🥈'}
                                {index === 2 && '🥉'}
                                {index > 2 && `#${index + 1}`}
                            </span>
                            <span className="username">{user.username}</span>
                            <span>{user.stats.gamesCompleted}</span>
                            <span>{user.stats.longestStreak} days</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
