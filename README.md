# Grid Master - Modern Sudoku Application

A full-stack Sudoku web application built with React and Node.js, featuring daily challenges, streaks, leaderboards, and comprehensive game statistics.

## Features

### Game Play
- **Multiple Difficulty Levels**: Easy, Medium, Hard, and Expert
- **Interactive Sudoku Board**: Click to select cells, keyboard input (1-9, Backspace)
- **Smart Validation**: Real-time puzzle checking with instant feedback
- **Undo System**: Revert moves with move history tracking
- **Hint System**: Get intelligent hints when stuck
- **Auto-Save**: Automatically saves game progress for logged-in users
- **Timer**: Track your solving time for each puzzle

### Daily Challenges
- **Daily Puzzle**: New puzzle generated every day at midnight
- **Streak Tracking**: Maintain your current and longest solving streaks
- **Completion Stats**: See how many players completed today's puzzle
- **Average Time**: Compare your time with community averages

### User Features
- **User Authentication**: Secure JWT-based login and registration
- **Profile Dashboard**: View comprehensive statistics
  - Games played and completed
  - Current and longest streaks
  - Best times for each difficulty level
  - Recent game history
- **Leaderboard**: Top 100 players ranked by games completed and streaks
- **Game History**: Track all your completed games with scores

## Technology Stack

### Frontend
- **React 18.2.0** - Modern UI library
- **React Router DOM 6.20.0** - Client-side routing
- **Context API** - State management (Auth, Game)
- **Axios 1.6.2** - HTTP client
- **React Icons 4.12.0** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express 4.18.2** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 7.6.0** - MongoDB ODM
- **JWT (jsonwebtoken 9.0.2)** - Authentication
- **bcryptjs 2.4.3** - Password hashing

### Development
- **nodemon 3.0.1** - Backend auto-reload
- **react-scripts 5.0.1** - React development tools

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   cd c:\Users\jmana\Grid-Master
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure Environment Variables**
   
   Create `server/.env` file:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/sudoku-app
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

5. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```
   
   Or configure MongoDB Atlas connection string in `.env`

6. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   Server runs on http://localhost:5000

7. **Start the Frontend Development Server**
   ```bash
   cd client
   npm start
   ```
   React app opens on http://localhost:3000

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "username": "player123",
  "email": "player@example.com",
  "password": "securepassword"
}
```

#### POST /api/auth/login
Login existing user
```json
{
  "email": "player@example.com",
  "password": "securepassword"
}
```

#### GET /api/auth/me
Get current user (requires authentication)

### Puzzle Endpoints

#### POST /api/puzzles/generate
Generate a new puzzle
```json
{
  "difficulty": "medium"
}
```

#### POST /api/puzzles/validate
Validate current puzzle state
```json
{
  "gameId": "64f5a1b2c3d4e5f6a7b8c9d0",
  "currentState": [[5,3,0,0,7,0,0,0,0], ...]
}
```

#### POST /api/puzzles/hint
Get a hint for the current puzzle
```json
{
  "gameId": "64f5a1b2c3d4e5f6a7b8c9d0",
  "currentState": [[5,3,0,0,7,0,0,0,0], ...]
}
```

#### PUT /api/puzzles/:gameId
Update game state (auto-save)
```json
{
  "currentState": [[5,3,4,6,7,8,9,1,2], ...],
  "timeSpent": 420,
  "hintsUsed": 2,
  "mistakesMade": 1
}
```

#### GET /api/puzzles/my-games
Get user's saved games

### Daily Challenge Endpoints

#### GET /api/daily/today
Get today's daily puzzle

#### POST /api/daily/start
Start today's daily challenge

#### GET /api/daily/streak
Get user's streak information

### User Stats Endpoints

#### GET /api/users/stats
Get current user's statistics

#### GET /api/users/leaderboard
Get top 100 players leaderboard

#### GET /api/users/history
Get user's game history (last 50 completed games)

## Project Structure

```
Grid-Master/
├── client/                    # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Navbar.js
│   │   │   ├── PrivateRoute.js
│   │   │   └── SudokuBoard.js
│   │   ├── context/          # Context providers
│   │   │   ├── AuthContext.js
│   │   │   └── GameContext.js
│   │   ├── pages/            # Page components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Play.js
│   │   │   ├── DailyChallenge.js
│   │   │   ├── Leaderboard.js
│   │   │   └── Profile.js
│   │   ├── services/         # API services
│   │   │   └── api.js
│   │   ├── styles/           # CSS files
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── puzzleController.js
│   │   │   ├── dailyController.js
│   │   │   └── userController.js
│   │   ├── middleware/       # Express middleware
│   │   │   └── auth.js
│   │   ├── models/           # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Game.js
│   │   │   └── DailyPuzzle.js
│   │   ├── routes/           # API routes
│   │   │   ├── auth.js
│   │   │   ├── puzzle.js
│   │   │   ├── daily.js
│   │   │   └── user.js
│   │   ├── utils/            # Utility functions
│   │   │   └── sudokuGenerator.js
│   │   └── server.js         # Express app entry
│   ├── .env
│   └── package.json
│
└── README.md
```

## Core Algorithms

### Sudoku Generation
The application uses a **recursive backtracking algorithm** to generate valid Sudoku puzzles:

1. **Fill Grid**: Recursively fills empty cells with valid numbers (1-9)
2. **Validation**: Ensures no duplicates in rows, columns, or 3x3 boxes
3. **Remove Cells**: Strategically removes cells based on difficulty
   - Easy: 35 cells removed
   - Medium: 45 cells removed
   - Hard: 52 cells removed
   - Expert: 58 cells removed
4. **Unique Solution**: Verifies puzzle has exactly one solution

### Scoring System
```javascript
score = baseDifficulty × timeMultiplier - hintPenalty
```
- Base difficulty: Easy (100), Medium (200), Hard (300), Expert (500)
- Time multiplier: Bonus for fast completion
- Hint penalty: -50 points per hint used

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

The app will open at http://localhost:3000

### Production Build
```bash
cd client
npm run build
```

## Security Features
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **CORS Configuration**: Cross-origin resource sharing
- **Input Validation**: Server-side validation for all inputs
- **Protected Routes**: Authentication middleware for sensitive endpoints

## Future Enhancements
- [ ] Mobile app (React Native)
- [ ] Pencil marks / notes feature
- [ ] Multiplayer competitions
- [ ] Puzzle import/export
- [ ] Dark mode
- [ ] Sound effects and animations
- [ ] Social features (friends, challenges)
- [ ] PWA support for offline play
- [ ] Achievement system
- [ ] Customizable themes

## License
MIT License - feel free to use this project for learning or commercial purposes.

---

**Built with ❤️ using React and Node.js**


