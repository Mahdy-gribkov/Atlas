@echo off
echo ========================================
echo    Travel AI Agent - One Click Start
echo ========================================
echo.

echo [1/3] Building Docker image with frontend and backend...
docker build -t travel-agent .

if %errorlevel% neq 0 (
    echo ERROR: Docker build failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Starting Travel AI Agent...
echo Frontend: http://localhost:80
echo API: http://localhost:8000
echo.

docker run -p 80:80 -p 8000:8000 travel-agent

echo.
echo Travel AI Agent stopped.
pause
