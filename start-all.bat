@echo off
title WanderAI Full-Stack Launcher
echo ========================================================
echo   Launching Personalized Travel Itinerary Planner
echo ========================================================
echo.
echo 1. Launching FastAPI Backend on http://localhost:8000
start "WanderAI Backend" cmd /k "%~dp0start-backend.bat"

echo 2. Launching React Frontend on http://localhost:5173
start "WanderAI Frontend" cmd /k "%~dp0start-frontend.bat"

echo.
echo Waiting 4 seconds for servers to initialize...
timeout /t 4 /nobreak >nul

echo Opening WanderAI in your default browser...
start http://localhost:5173


