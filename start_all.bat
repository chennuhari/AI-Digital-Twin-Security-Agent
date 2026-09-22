@echo off
echo =========================================================
echo    AI Digital Twin Security Agent - Startup Script
echo =========================================================
echo.
echo [1/2] Starting Python FastAPI Backend on port 8001...
start "Digital Twin FastAPI Backend" cmd /k "cd fastapi-backend && python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload"

echo [2/2] Starting React + Three.js 3D Frontend on port 5173...
start "Digital Twin 3D Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo =========================================================
echo Both services launched!
echo - Frontend: http://localhost:5173
echo - FastAPI Docs: http://localhost:8001/docs
echo - Login: testuser3 / Test@123
echo =========================================================
pause
