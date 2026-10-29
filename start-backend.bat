@echo off
title Travel Itinerary Backend (FastAPI)
echo Starting FastAPI Backend on port 8000...
cd /d "%~dp0backend"
set PYTHONPATH=%cd%
call "venv\Scripts\python.exe" -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause

