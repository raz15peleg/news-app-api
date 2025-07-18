# NewsSwipe - Tinder-like News App

A modern news application with a Tinder-like swipe interface built with React/TypeScript frontend and FastAPI/Python backend.

## Features

- 🔥 **Tinder-like Interface**: Swipe right to like, left to dislike, tap to read
- 📰 **Real-time News**: Automatically fetches news every hour using RapidAPI
- 💾 **SQLite Database**: Stores articles locally with user interaction tracking
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 📱 **Mobile-friendly**: Optimized for both desktop and mobile devices
- ⚡ **Fast API**: High-performance backend with automatic documentation
- 🔄 **Background Jobs**: Automated news fetching and cleanup

## Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for Python
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **APScheduler** - Advanced Python Scheduler for background jobs
- **Requests** - HTTP library for API calls
- **Pydantic** - Data validation using Python type annotations

### Frontend
- **React 18** - JavaScript library for building user interfaces
- **TypeScript** - Static type checking
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **React Spring** - Spring-physics animations
- **React Use Gesture** - Gesture recognition
- **Axios** - Promise-based HTTP client
- **React Hot Toast** - Notification system

## Project Structure

```
news-app-api/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── database/     # Database models and connection
│   │   ├── schemas/      # Pydantic schemas
│   │   └── services/     # Business logic and external services
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API communication
│   │   └── types/        # TypeScript type definitions
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Quick Start (Recommended)

The easiest way to start both services is using the provided startup scripts:

**For Linux/macOS:**
```bash
chmod +x start.sh
./start.sh
```

**For Windows:**
```cmd
start.bat
```

These scripts will:
- ✅ Create Python virtual environment if needed
- ✅ Install all dependencies automatically
- ✅ Start both backend and frontend servers
- ✅ Provide clear status updates and error handling
- ✅ Handle graceful shutdown with Ctrl+C

### Manual Setup (Alternative)

If you prefer to start services manually:

#### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Run the backend server**
```bash
python start.py
# or
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

#### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### News Articles
- `GET /api/v1/articles` - Get paginated list of articles
- `GET /api/v1/articles/{id}` - Get specific article
- `GET /api/v1/articles/random/{count}` - Get random articles for swiping
- `POST /api/v1/articles/{id}/action` - Record user action (like/dislike/view)

### System
- `GET /api/v1/health` - Health check
- `POST /api/v1/fetch-news` - Manually trigger news fetch
- `GET /api/v1/scheduler-status` - Get background job status

## Usage

1. **Start both servers** (backend on :8000, frontend on :3000)
2. **Open your browser** to `http://localhost:3000`
3. **Swipe through articles**:
   - **Swipe right** or click ❤️ to like
   - **Swipe left** or click ✕ to dislike  
   - **Tap card** or click 👁️ to read full article
4. **Refresh** to load new articles

## Features in Detail

### Automated News Fetching
- Runs every hour automatically
- Fetches from RapidAPI news service
- Stores articles in SQLite database
- Avoids duplicates

### User Interactions
- Tracks views, likes, and dislikes
- Provides analytics for popular articles
- Smooth animations and feedback

### Background Jobs
- **Hourly news fetch**: Gets latest articles
- **Daily cleanup**: Removes old articles (7+ days)
- **Health monitoring**: Tracks job status

### Mobile Experience
- Touch gestures for swiping
- Responsive design
- Optimized for mobile browsers

## Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=newsnow.p.rapidapi.com
DATABASE_URL=sqlite:///./news_app.db
```

### Customization
- **News sources**: Modify the API parameters in `news_service.py`
- **Refresh frequency**: Update cron schedule in `cron_service.py`
- **UI styling**: Modify Tailwind classes and custom CSS
- **Database**: Switch to PostgreSQL/MySQL by updating connection string

## Development

### Backend Development
```bash
# Run with auto-reload
uvicorn app.main:app --reload

# Run tests (if added)
pytest

# Check code style
black app/
flake8 app/
```

### Frontend Development
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Deployment

### Backend Deployment
```bash
# Install production dependencies
pip install -r requirements.txt

# Run with Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend Deployment

#### Environment Configuration
For production deployment, you need to configure the API URL. Create a `.env` file in the frontend directory:

```env
# Set this to your backend API URL
VITE_API_URL=https://your-backend-domain.com/api/v1

# For development (optional)
VITE_DEBUG=true
```

#### Build and Deploy
```bash
# Build for production
npm run build

# Deploy the dist/ folder to your hosting service
```

#### Platform-Specific Deployment

**For Choreo:**
1. Set the environment variable `VITE_API_URL` to your backend API URL
2. Build the project: `npm run build`
3. Deploy the `dist/` folder

**For Vercel:**
1. Add environment variable in Vercel dashboard: `VITE_API_URL=https://your-backend-url.com/api/v1`
2. Deploy using Vercel CLI or GitHub integration

**For Netlify:**
1. Add environment variable in Netlify dashboard: `VITE_API_URL=https://your-backend-url.com/api/v1`
2. Deploy using Netlify CLI or drag-and-drop

#### Important Notes
- The frontend will use the proxy configuration (`/api/v1`) only in development when `VITE_API_URL` is not set
- In production, always set `VITE_API_URL` to point to your actual backend API
- Make sure your backend API is accessible from your frontend's domain (CORS configuration)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Troubleshooting

### Common Issues

**Backend won't start**
- Check Python version (3.8+)
- Ensure virtual environment is activated
- Verify all dependencies are installed

**Frontend build fails**
- Check Node.js version (16+)
- Delete `node_modules` and run `npm install` again
- Check for TypeScript errors

**API calls failing**
- Ensure backend is running on port 8000
- Check CORS settings
- Verify RapidAPI key is valid

**No news articles loading**
- Check RapidAPI key and quota
- Manually trigger news fetch via `/api/v1/fetch-news`
- Check backend logs for errors

## Support

For issues and questions:
1. Check the troubleshooting section
2. Look at the API documentation at `/docs`
3. Create an issue on GitHub 