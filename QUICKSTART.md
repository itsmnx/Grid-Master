# 🚀 Quick Start Guide - Grid Master

## Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- npm

## 1-Minute Setup

### Step 1: Clone & Install
```bash
git clone https://github.com/itsmnx/Grid-Master.git
cd Grid-Master
npm install
```

### Step 2: Configure
Create `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/grid-master
JWT_SECRET=mySecretKey123
PORT=5000
```

### Step 3: Start MongoDB
```bash
mongod
# Or use MongoDB Atlas connection string
```

### Step 4: Run
```bash
npm run dev
```

### Step 5: Open Browser
```
http://localhost:5000
```

---

## Features to Test

1. **Landing Page**: Watch 3-second animated intro
2. **Play Sudoku**: Try different difficulty levels
3. **Register**: Create account, save progress
4. **Stats**: View your statistics
5. **Undo/Hint**: Use game features
6. **Friends**: Add friends, challenge them

---

## API Testing

### Generate Puzzle
```bash
curl -X POST http://localhost:5000/api/sudoku/generate \
-H "Content-Type: application/json" \
-d '{"difficulty":"medium","type":"classic-9x9"}'
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"username":"player1","email":"player1@test.com","password":"pass123"}'
```

---

## Troubleshooting

**MongoDB not connecting?**
- Check if `mongod` is running
- Verify `MONGO_URI` in `.env`

**Port already in use?**
- Change `PORT` in `.env`

**Dependencies error?**
- Run `npm install` again
- Clear `node_modules` and reinstall

---

## Project Structure

```
Grid-Master/
├── server/              # Backend APIs
├── Full project/        # Frontend files
├── index.html          # Landing page
└── package.json
```

---

## Next Steps

1. Explore algorithm in `server/algorithms/RecursiveSudoku.js`
2. Read full README for API docs
3. Try multiplayer features
4. Customize and extend!

---

**Happy Gaming! 🎮**
