@echo off
echo 🚀 Starting Travel AI Agent with React UI
echo.

echo 📦 Installing Python dependencies...
pip install -r requirements-ui.txt

echo.
echo 🌐 Starting FastAPI backend...
start "FastAPI Backend" cmd /k "python api.py"

echo.
echo ⏳ Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo 🎨 Starting React frontend...
cd frontend
echo 📦 Installing Node.js dependencies...
call npm install

echo.
echo 🚀 Starting React development server...
call npm start

pause

