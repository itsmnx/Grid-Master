# 🧠 Sudoku Master

Sudoku Master is a full-stack web application that lets users play Sudoku online with various difficulty levels, learn solving techniques, and participate in championships. It features a clean UI, user authentication, random Sudoku puzzle generation, solving functionality, and a learning section.

---

## 🚀 Features

- 🎮 Play Sudoku with Easy, Medium, and Hard levels
- ⏱️ Timer, Hints, and Auto-Solver
- 🧠 Learn how to solve Sudoku step-by-step
- 🏆 Championship Mode for competitive play
- 🔐 User Authentication (Sign In / Sign Up)
- 📊 Score tracking (planned)
- 🎨 Fully responsive and modern UI

---

## 📁 Project Structure

sudoku-master/
│
├── frontend/
│   ├── index.html                # Home page
│   ├── play.html                 # Play Sudoku page
│   ├── learning.html             # Learning Sudoku page
│   ├── championship.html         # Championship page
│   ├── signin.html               # Sign in page
│   ├── signup.html               # Sign up page
│   ├── css/
│   │   ├── style.css             # Main stylesheet
│   │   ├── sudoku.css            # Sudoku grid styles
│   │   └── auth.css              # Authentication styles
│   │
│   ├── js/
│   │   ├── main.js               # Main JavaScript file
│   │   ├── sudoku.js             # Sudoku game logic
│   │   ├── auth.js               # Authentication functions
│   │   └── learning.js           # Learning page interactions
│   │
│   └── assets/
│       └── images/               # Image assets
│
├── backend/
│   ├── server.js                 # Express server setup
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── sudoku.js             # Sudoku game routes
│   │   └── championship.js       # Championship routes
│   │
│   ├── controllers/
│   │   ├── authController.js     # Auth controller
│   │   ├── sudokuController.js   # Sudoku game controller
│   │   └── championshipController.js # Championship controller
│   │
│   ├── models/
│   │   ├── user.js               # User model
│   │   ├── sudoku.js             # Sudoku model
│   │   └── championship.js       # Championship model
│   │
│   ├── utils/
│   │   ├── sudokuGenerator.js    # Sudoku puzzle generator
│   │   └── sudokuSolver.js       # Sudoku solver algorithm
│   │
│   └── middleware/
│       └── auth.js               # Authentication middleware
│
└── package.json                  # Project dependencies
