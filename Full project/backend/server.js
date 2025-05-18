const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sudoku_master', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define schemas and models
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date }
});

const scoreSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    time: { type: Number, required: true }, // in seconds
    score: { type: Number, required: true },
    mistakes: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Score = mongoose.model('Score', scoreSchema);

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'sudoku-master-secret-key';

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        
        req.user = user;
        next();
    });
}

// Routes

// Register new user
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, dob, gender } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            dob: new Date(dob),
            gender
        });
        
        await user.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login user
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        // Update last login time
        user.lastLogin = new Date();
        await user.save();
        
        // Send response without password
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            dob: user.dob,
            gender: user.gender
        };
        
        res.status(200).json({
            message: 'Login successful',
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Validate token
app.get('/api/validateToken', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({ user });
    } catch (error) {
        console.error('Token validation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Save score
app.post('/api/saveScore', authenticateToken, async (req, res) => {
    try {
        const { difficulty, time, score, mistakes } = req.body;
        
        const newScore = new Score({
            userId: req.user.id,
            difficulty,
            time,
            score,
            mistakes
        });
        
        await newScore.save();
        
        res.status(201).json({
            message: 'Score saved successfully',
            score: newScore
        });
    } catch (error) {
        console.error('Save score error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user scores
app.get('/api/scores', authenticateToken, async (req, res) => {
    try {
        const scores = await Score.find({ userId: req.user.id })
            .sort({ completedAt: -1 })
            .limit(parseInt(req.query.limit) || 10);
        
        res.status(200).json({ scores });
    } catch (error) {
        console.error('Get scores error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const difficulty = req.query.difficulty || 'easy';
        
        // Aggregate scores by user and get the highest score for each user
        const leaderboard = await Score.aggregate([
            { $match: { difficulty } },
            { $sort: { score: -1 } },
            { $group: {
                _id: '$userId',
                highestScore: { $max: '$score' },
                bestTime: { $min: '$time' },
                completedAt: { $first: '$completedAt' }
            }},
            { $sort: { highestScore: -1, bestTime: 1 } },
            { $limit: 10 },
            { $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }},
            { $unwind: '$user' },
            { $project: {
                _id: 0,
                userId: '$_id',
                name: '$user.name',
                score: '$highestScore',
                time: '$bestTime',
                completedAt: 1
            }}
        ]);
        
        res.status(200).json({ leaderboard });
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Get stats
        const stats = {
            gamesPlayed: await Score.countDocuments({ userId: req.user.id }),
            highestScore: 0,
            avgTime: 0,
            puzzlesSolved: 0
        };
        
        // Get highest score
        const highestScore = await Score.findOne({ userId: req.user.id })
            .sort({ score: -1 })
            .limit(1);
            
        if (highestScore) {
            stats.highestScore = highestScore.score;
        }
        
        // Get average time
        const timeAgg = await Score.aggregate([
            { $match: { userId: mongoose.Types.ObjectId(req.user.id) } },
            { $group: { _id: null, avgTime: { $avg: '$time' } } }
        ]);
        
        if (timeAgg.length > 0) {
            stats.avgTime = Math.round(timeAgg[0].avgTime);
        }
        
        // Get puzzles solved by difficulty
        const difficultyCounts = await Score.aggregate([
            { $match: { userId: mongoose.Types.ObjectId(req.user.id) } },
            { $group: { _id: '$difficulty', count: { $sum: 1 } } }
        ]);
        
        stats.puzzlesSolved = {
            easy: 0,
            medium: 0,
            hard: 0
        };
        
        difficultyCounts.forEach(diff => {
            stats.puzzlesSolved[diff._id] = diff.count;
        });
        
        res.status(200).json({
            user,
            stats
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        const { name, dob, gender, currentPassword, newPassword } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Update basic info
        if (name) user.name = name;
        if (dob) user.dob = new Date(dob);
        if (gender) user.gender = gender;
        
        // Update password if provided
        if (currentPassword && newPassword) {
            // Validate current password
            const validPassword = await bcrypt.compare(currentPassword, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            
            // Hash new password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }
        
        await user.save();
        
        // Send response without password
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            dob: user.dob,
            gender: user.gender
        };
        
        res.status(200).json({
            message: 'Profile updated successfully',
            user: userResponse
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Serve the frontend for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});