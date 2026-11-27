@echo off
echo Starting Tricky King Frontend...
cd /d "%~dp0frontend"
npm install
npm run dev
pause
