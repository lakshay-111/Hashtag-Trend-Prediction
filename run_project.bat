@echo off
echo =======================================================================
echo   TrendPulse AI - Hashtag Trend Prediction ^& Social Media Analytics
echo   Course: Data Visualization and Social Media Analytics (DVSMA)
echo =======================================================================
echo.

echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "TrendPulse Backend (FastAPI)" cmd /k "cd backend && python app.py"

echo [2/2] Starting Vite Frontend on http://localhost:5173 ...
start "TrendPulse Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo All services launched!
echo Open your browser at: http://localhost:5173
echo Backend API Docs at: http://127.0.0.1:8000/docs
echo =======================================================================
pause
