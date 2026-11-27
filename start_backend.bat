@echo off
echo.
echo  =========================================
echo   👑  TRICKY KING  — Starting server...
echo  =========================================
echo.
cd /d "%~dp0backend"
pip install -r requirements.txt --quiet
echo  Open your browser at:  http://localhost:5000
echo.
start "" "http://localhost:5000"
python app.py
pause
