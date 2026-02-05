@echo off
echo ================================
echo GRID MASTER - Setup Script
echo DAA Project Setup
echo ================================
echo.

echo [1/4] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Please install from nodejs.org
    pause
    exit /b 1
)
node --version
echo.

echo [2/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo.

echo [3/4] Checking .env file...
if not exist .env (
    echo Creating .env file...
    (
        echo NODE_ENV=development
        echo PORT=5000
        echo MONGO_URI=mongodb://localhost:27017/grid-master
        echo JWT_SECRET=gridmaster_secret_key_change_in_production
        echo JWT_EXPIRE=7d
        echo CLIENT_URL=http://localhost:5000
    ) > .env
    echo .env file created!
) else (
    echo .env file already exists
)
echo.

echo [4/4] Setup complete!
echo.
echo ================================
echo Next Steps:
echo ================================
echo 1. Make sure MongoDB is running (mongod)
echo 2. Run: npm run dev
echo 3. Open: http://localhost:5000
echo.
echo For MongoDB Atlas (cloud):
echo - Update MONGO_URI in .env file
echo.
echo ================================
pause
