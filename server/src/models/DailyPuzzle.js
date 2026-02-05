const mongoose = require('mongoose');

const dailyPuzzleSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    puzzle: {
        type: [[Number]],
        required: true
    },
    solution: {
        type: [[Number]],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard', 'expert'],
        required: true
    },
    completions: {
        type: Number,
        default: 0
    },
    averageTime: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DailyPuzzle', dailyPuzzleSchema);
