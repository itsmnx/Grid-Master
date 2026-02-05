const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    stats: {
        gamesPlayed: { type: Number, default: 0 },
        gamesCompleted: { type: Number, default: 0 },
        currentStreak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        lastPlayedDate: { type: Date },
        totalTime: { type: Number, default: 0 },
        bestTimes: {
            easy: { type: Number, default: null },
            medium: { type: Number, default: null },
            hard: { type: Number, default: null },
            expert: { type: Number, default: null }
        }
    },
    dailyProgress: [{
        date: { type: Date, required: true },
        completed: { type: Boolean, default: false },
        time: { type: Number }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Update streak
userSchema.methods.updateStreak = function() {
    const today = new Date().setHours(0, 0, 0, 0);
    const lastPlayed = this.stats.lastPlayedDate ? 
        new Date(this.stats.lastPlayedDate).setHours(0, 0, 0, 0) : null;
    
    if (!lastPlayed) {
        this.stats.currentStreak = 1;
    } else {
        const daysDiff = (today - lastPlayed) / (1000 * 60 * 60 * 24);
        if (daysDiff === 1) {
            this.stats.currentStreak += 1;
        } else if (daysDiff > 1) {
            this.stats.currentStreak = 1;
        }
    }
    
    if (this.stats.currentStreak > this.stats.longestStreak) {
        this.stats.longestStreak = this.stats.currentStreak;
    }
    
    this.stats.lastPlayedDate = new Date();
};

module.exports = mongoose.model('User', userSchema);
