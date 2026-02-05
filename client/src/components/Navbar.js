import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import '../styles/Navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    🎯 Sudoku Master
                </Link>
                
                <div className="nav-menu">
                    <Link to="/play" className="nav-link">Play</Link>
                    <Link to="/daily" className="nav-link">Daily Challenge</Link>
                    <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
                    
                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" className="nav-link">
                                <FiUser /> {user?.username}
                            </Link>
                            <button onClick={logout} className="nav-btn">
                                <FiLogOut /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-btn">Login</Link>
                            <Link to="/register" className="nav-btn primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
