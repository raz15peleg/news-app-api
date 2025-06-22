@echo off
setlocal enabledelayedexpansion

:: Colors for Windows (limited support)
set "RED=[31m"
set "GREEN=[32m"
set "BLUE=[34m"
set "YELLOW=[33m"
set "NC=[0m"

:: Print banner
echo ================================================================
echo 🚀 NewsSwipe - Starting Development Environment
echo ================================================================
echo.

:: Check if backend directory exists
if not exist "backend" (
    echo %RED%[ERROR]%NC% Backend directory not found!
    pause
    exit /b 1
)

:: Check if frontend directory exists
if not exist "frontend" (
    echo %RED%[ERROR]%NC% Frontend directory not found!
    pause
    exit /b 1
)

:: Start Backend
echo %BLUE%[INFO]%NC% Starting backend server...
cd backend

:: Check if virtual environment exists
if not exist "venv" (
    echo %YELLOW%[WARNING]%NC% Virtual environment not found. Creating one...
    python -m venv venv
    if errorlevel 1 (
        echo %RED%[ERROR]%NC% Failed to create virtual environment
        pause
        exit /b 1
    )
)

:: Activate virtual environment
call venv\Scripts\activate
if errorlevel 1 (
    echo %RED%[ERROR]%NC% Failed to activate virtual environment
    pause
    exit /b 1
)

:: Install dependencies
echo %BLUE%[INFO]%NC% Installing/updating Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo %RED%[ERROR]%NC% Failed to install Python dependencies
    pause
    exit /b 1
)

echo %GREEN%[SUCCESS]%NC% Python dependencies installed

:: Start backend server in background
echo %BLUE%[INFO]%NC% Launching FastAPI server on http://localhost:8000
start "Backend Server" cmd /c "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > ..\backend.log 2>&1"

:: Wait for backend to start
timeout /t 5 /nobreak > nul

echo %GREEN%[SUCCESS]%NC% Backend server started

:: Move to frontend directory
cd ..\frontend

:: Install Node.js dependencies
echo %BLUE%[INFO]%NC% Installing/updating Node.js dependencies...
call npm install
if errorlevel 1 (
    echo %RED%[ERROR]%NC% Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo %GREEN%[SUCCESS]%NC% Node.js dependencies installed

:: Start frontend server
echo %BLUE%[INFO]%NC% Starting frontend development server...
echo %BLUE%[INFO]%NC% Frontend will be available at http://localhost:3000

:: Print final status
echo.
echo ================================================================
echo %GREEN%[SUCCESS]%NC% 🎉 Starting services...
echo ----------------------------------------------------------------
echo 📱 Frontend:     http://localhost:3000
echo 🔧 Backend API:  http://localhost:8000
echo 📚 API Docs:     http://localhost:8000/docs
echo 📋 Logs:         backend.log, frontend.log
echo ----------------------------------------------------------------
echo %BLUE%[INFO]%NC% Close this window to stop all services
echo ================================================================
echo.

:: Start frontend (this will keep the window open)
call npm run dev

:: If we get here, npm run dev has stopped
echo.
echo %BLUE%[INFO]%NC% Frontend server stopped
pause 