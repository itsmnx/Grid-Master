import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const Home = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const featureCards = [
        {
            icon: '🎯',
            title: 'Multiple Difficulties',
            description: 'From easy to expert - find your perfect challenge level',
            path: '/play'
        },
        {
            icon: '📅',
            title: 'Daily Challenges',
            description: 'New puzzle every day with streak tracking',
            path: '/daily'
        },
        {
            icon: '🏆',
            title: 'Leaderboard',
            description: 'Compete with players worldwide',
            path: '/leaderboard'
        },
        {
            icon: '⏱️',
            title: 'Timer & Stats',
            description: 'Track your progress and beat your best times',
            path: '/profile'
        },
        {
            icon: '💡',
            title: 'Hints & Undo',
            description: 'Get help when you\'re stuck',
            path: '/play'
        },
        {
            icon: '💾',
            title: 'Auto Save',
            description: 'Never lose your progress',
            path: '/profile'
        }
    ];

    return (
        <div className="home">
            <div className="hero">
                <h1 className="hero-title">Play Sudoku Every Day</h1>
                <p className="hero-subtitle">
                    Challenge yourself with daily puzzles, track your streaks, and compete on the leaderboard!
                </p>
                <div className="hero-buttons">
                    <Link to="/play" className="btn btn-primary btn-large">
                        Start Playing
                    </Link>
                    <Link to="/daily" className="btn btn-secondary btn-large">
                        Daily Challenge
                    </Link>
                </div>
            </div>

            <div className="features">
                {featureCards.map((feature, index) => (
                    <div 
                        key={index}
                        className="feature-card clickable"
                        onClick={() => navigate(feature.path)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && navigate(feature.path)}
                    >
                        <div className="feature-icon">{feature.icon}</div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>

            {!isAuthenticated && (
                <div className="cta-section">
                    <h2>Ready to get started?</h2>
                    <p>Create an account to track your progress and compete!</p>
                    <Link to="/register" className="btn btn-primary btn-large">
                        Sign Up Free
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Home;
