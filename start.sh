#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to cleanup background processes
cleanup() {
    print_status "Shutting down services..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        print_status "Stopping backend server (PID: $BACKEND_PID)"
        kill $BACKEND_PID 2>/dev/null
        wait $BACKEND_PID 2>/dev/null
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        print_status "Stopping frontend server (PID: $FRONTEND_PID)"
        kill $FRONTEND_PID 2>/dev/null
        wait $FRONTEND_PID 2>/dev/null
    fi
    
    print_success "All services stopped. Goodbye! 👋"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Stop any existing processes on the ports we need
print_status "Cleaning up any existing processes..."
pkill -f "uvicorn.*app.main:app" 2>/dev/null || true
pkill -f "vite.*--port 8080" 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
sleep 2

# Print banner
echo "================================================================"
echo "🚀 NewsSwipe - Starting Development Environment"
echo "================================================================"
echo ""

# Check if backend directory exists
if [ ! -d "backend" ]; then
    print_error "Backend directory not found!"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    print_error "Frontend directory not found!"
    exit 1
fi

# Start Backend
print_status "Starting backend server..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    print_warning "Virtual environment not found. Creating one..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        print_error "Failed to create virtual environment"
        exit 1
    fi
fi

# Activate virtual environment
source venv/bin/activate
if [ $? -ne 0 ]; then
    print_error "Failed to activate virtual environment"
    exit 1
fi

# Install dependencies if requirements.txt is newer than last install
if [ ! -f ".last_install" ] || [ requirements.txt -nt .last_install ]; then
    print_status "Installing/updating Python dependencies..."
    pip install -r requirements.txt
    if [ $? -eq 0 ]; then
        touch .last_install
        print_success "Python dependencies installed"
    else
        print_error "Failed to install Python dependencies"
        exit 1
    fi
fi

# Start backend server in background
print_status "Launching FastAPI server on http://localhost:8000"
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    print_error "Backend server failed to start. Check backend.log for details."
    cat ../backend.log
    exit 1
fi

print_success "Backend server started (PID: $BACKEND_PID)"

# Move to frontend directory
cd ../frontend

# Load nvm and use Node.js 18
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 > /dev/null 2>&1
if [ $? -ne 0 ]; then
    print_error "Node.js 18 not found. Installing it now..."
    nvm install 18
    nvm use 18
fi

print_status "Using Node.js version: $(node --version)"

# Check if node_modules exists and package.json is newer
if [ ! -d "node_modules" ] || [ package.json -nt node_modules ]; then
    print_status "Installing/updating Node.js dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install Node.js dependencies"
        cleanup
        exit 1
    fi
    print_success "Node.js dependencies installed"
fi

# Start frontend server
print_status "Starting frontend development server..."
print_status "Frontend will be available at http://localhost:8080"

# Start frontend in background initially to get PID, then bring to foreground
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait a bit for frontend to start
sleep 3

# Check if frontend is running
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    print_error "Frontend server failed to start. Check frontend.log for details."
    cat ../frontend.log
    cleanup
    exit 1
fi

print_success "Frontend server started (PID: $FRONTEND_PID)"

# Print final status
echo ""
echo "================================================================"
print_success "🎉 All services are running!"
echo "----------------------------------------------------------------"
echo "📱 Frontend:     http://localhost:8080"
echo "🔧 Backend API:  http://localhost:8000"
echo "📚 API Docs:     http://localhost:8000/docs"
echo "📋 Logs:         backend.log, frontend.log"
echo "----------------------------------------------------------------"
print_status "Press Ctrl+C to stop all services"
echo "================================================================"
echo ""

# Keep script running and show live logs
echo "📊 Live Backend Logs:"
echo "================================================================"

# Follow backend logs
tail -f backend.log &
LOG_PID=$!

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID

# Cleanup when processes end
kill $LOG_PID 2>/dev/null
cleanup 