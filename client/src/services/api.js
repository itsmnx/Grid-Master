import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

axios.defaults.baseURL = API_URL;

const api = {
    // Auth
    login: (email, password) => axios.post('/auth/login', { email, password }),
    register: (username, email, password) => axios.post('/auth/register', { username, email, password }),
    getMe: () => axios.get('/auth/me'),

    // Puzzles
    generatePuzzle: (difficulty) => axios.post('/puzzles/generate', { difficulty }),
    validatePuzzle: (puzzle) => axios.post('/puzzles/validate', { puzzle }),
    getHint: (gameId) => axios.post('/puzzles/hint', { gameId }),
    updateGame: (gameId, data) => axios.put(`/puzzles/${gameId}`, data),
    getMyGames: () => axios.get('/puzzles/my-games'),

    // Daily Challenge
    getTodaysPuzzle: () => axios.get('/daily/today'),
    startDaily: () => axios.post('/daily/start'),
    getStreak: () => axios.get('/daily/streak'),

    // User
    getStats: () => axios.get('/users/stats'),
    getLeaderboard: () => axios.get('/users/leaderboard'),
    getHistory: () => axios.get('/users/history')
};

export default api;
