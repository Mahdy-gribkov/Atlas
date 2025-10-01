@echo off
REM Travel AI Agent Setup Script for Windows
REM This script sets up the complete development environment

echo 🌍 Setting up Travel AI Agent...

REM Check Python version
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.9+ from https://python.org
    pause
    exit /b 1
)

echo ✅ Python is installed

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo ⬆️ Upgrading pip...
python -m pip install --upgrade pip

REM Install dependencies
echo 📚 Installing dependencies...
pip install -r requirements.txt

REM Create necessary directories
echo 📁 Creating directories...
if not exist data mkdir data
if not exist logs mkdir logs
if not exist cache mkdir cache
if not exist temp mkdir temp

REM Create .env file if it doesn't exist
if not exist .env (
    echo ⚙️ Creating .env file...
    copy env.example .env
    echo 📝 Please edit .env file with your API keys
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Edit .env file with your API keys
echo 2. Activate virtual environment: venv\Scripts\activate.bat
echo 3. Run the agent: python main.py
echo.
echo For help: python main.py --help
echo For API testing: python main.py --test-apis
echo.
pause
