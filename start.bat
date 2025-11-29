@echo off
REM Quick start script for Windows
REM This script helps you get Total Life Daily running quickly

echo ================================
echo Total Life Daily - Quick Start
echo ================================
echo.

REM Check if .env exists
if not exist .env (
    echo [1/3] Creating .env file from example...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Edit .env file and add your GOOGLE_API_KEY
    echo    Get your key at: https://aistudio.google.com/apikey
    echo.
    pause
) else (
    echo [1/3] .env file exists ✓
)

echo.
echo [2/3] Starting Docker containers...
echo This will take 2-3 minutes on first run
echo.

docker-compose up --build

REM If docker-compose fails, show helpful error
if errorlevel 1 (
    echo.
    echo ❌ Failed to start Docker containers
    echo.
    echo Make sure:
    echo 1. Docker Desktop is installed and running
    echo 2. You have edited .env with your GOOGLE_API_KEY
    echo.
    pause
)
