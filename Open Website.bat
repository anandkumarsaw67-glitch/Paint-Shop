@echo off
title Saw & Sons - Paint Shop
echo Starting Paint Shop website...
cd /d "%~dp0"
start "" "http://localhost:5173"
timeout /t 2 /nobreak >nul
start "" "http://localhost:5173"
npm run dev
