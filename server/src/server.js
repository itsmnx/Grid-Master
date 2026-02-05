const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const puzzleRoutes = require('./routes/puzzle');
const userRoutes = require('./routes/user');
const dailyRoutes = require('./routes/daily');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/puzzles', puzzleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/daily', dailyRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Sudoku API is running' });
});

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (err) {
        console.warn('⚠️  MongoDB Connection Failed:', err.message);
        console.warn('⚠️  Running in LIMITED mode - Guest play only!');
        console.warn('💡 Install MongoDB or use MongoDB Atlas for full features');
    }
};

connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Sudoku API Server Running`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌐 API endpoint: http://localhost:${PORT}/api`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}\n`);
});


module.exports = app;
