import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            const [statsRes, historyRes] = await Promise.all([
                api.getStats(),
                api.getHistory()
            ]);
            setStats(statsRes.data.data);
            setHistory(historyRes.data.data);
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading profile...</div>;
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <h2>{user?.username}</h2>
                    <p>{user?.email}</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-number">{stats?.gamesPlayed || 0}</div>
                        <div className="stat-label">Games Played</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats?.gamesCompleted || 0}</div>
                        <div className="stat-label">Games Completed</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats?.currentStreak || 0}</div>
                        <div className="stat-label">Current Streak</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats?.longestStreak || 0}</div>
                        <div className="stat-label">Best Streak</div>
                    </div>
                </div>

                <div className="best-times">
                    <h3>Best Times</h3>
                    <div className="times-grid">
                        <div className="time-card">
                            <span className="difficulty-label">Easy</span>
                            <span className="time-value">
                                {stats?.bestTimes?.easy ? `${Math.floor(stats.bestTimes.easy / 60)}:${(stats.bestTimes.easy % 60).toString().padStart(2, '0')}` : '--:--'}
                            </span>
                        </div>
                        <div className="time-card">
                            <span className="difficulty-label">Medium</span>
                            <span className="time-value">
                                {stats?.bestTimes?.medium ? `${Math.floor(stats.bestTimes.medium / 60)}:${(stats.bestTimes.medium % 60).toString().padStart(2, '0')}` : '--:--'}
                            </span>
                        </div>
                        <div className="time-card">
                            <span className="difficulty-label">Hard</span>
                            <span className="time-value">
                                {stats?.bestTimes?.hard ? `${Math.floor(stats.bestTimes.hard / 60)}:${(stats.bestTimes.hard % 60).toString().padStart(2, '0')}` : '--:--'}
                            </span>
                        </div>
                        <div className="time-card">
                            <span className="difficulty-label">Expert</span>
                            <span className="time-value">
                                {stats?.bestTimes?.expert ? `${Math.floor(stats.bestTimes.expert / 60)}:${(stats.bestTimes.expert % 60).toString().padStart(2, '0')}` : '--:--'}
                            </span>
                        </div>
                    </div>
                </div>

                {history.length > 0 && (
                    <div className="recent-games">
                        <h3>Recent Games</h3>
                        <div className="games-list">
                            {history.slice(0, 10).map(game => (
                                <div key={game._id} className="game-item">
                                    <span className="game-difficulty">{game.difficulty}</span>
                                    <span className="game-time">
                                        {Math.floor(game.timeSpent / 60)}:{(game.timeSpent % 60).toString().padStart(2, '0')}
                                    </span>
                                    <span className="game-score">{game.score} pts</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
