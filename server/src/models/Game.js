const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard', 'expert'],
        required: true
    },
    puzzle: {
        type: [[Number]],
        required: true
    },
    solution: {
        type: [[Number]],
        required: true
    },
    currentState: {
        type: [[Number]],
        required: true
    },
    isDaily: {
        type: Boolean,
        default: false
    },
    dailyDate: {
        type: Date
    },
    timeSpent: {
        type: Number,
        default: 0
    },
    hintsUsed: {
        type: Number,
        default: 0
    },
    mistakesMade: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'abandoned'],
        default: 'in-progress'
    },
    completedAt: {
        type: Date
    },
    score: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate score based on time, hints, and mistakes
gameSchema.methods.calculateScore = function() {
    const baseScore = 1000;
    const difficultyMultiplier = {
        easy: 1,
        medium: 1.5,
        hard: 2,
        expert: 3
    };
    
    const timePenalty = Math.floor(this.timeSpent / 60);
    const hintPenalty = this.hintsUsed * 50;
    const mistakePenalty = this.mistakesMade * 25;
    
    this.score = Math.max(0, 
        (baseScore * difficultyMultiplier[this.difficulty]) - 
        timePenalty - hintPenalty - mistakePenalty
    );
    
    return this.score;
};

module.exports = mongoose.model('Game', gameSchema);
