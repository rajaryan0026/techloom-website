@echo off
title Techloom Launcher
set NODE_PATH=C:\Users\rajar\AppData\Local\OpenAI\Codex\bin\5b9024f90663758b
set PATH=%NODE_PATH%;C:\Users\rajar\AppData\Roaming\npm;%PATH%

echo Stopping stale Techloom processes on ports 3000 and 4000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4000" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul

echo Starting Techloom API...
start "Techloom API" cmd /k "cd /d C:\Users\rajar\projects\techloom\backend && set PATH=%NODE_PATH%;C:\Users\rajar\AppData\Roaming\npm;%PATH% && npm run dev"

timeout /t 5 /nobreak >nul

echo Starting Techloom Frontend...
start "Techloom Web" cmd /k "cd /d C:\Users\rajar\projects\techloom\frontend && set PATH=%NODE_PATH%;C:\Users\rajar\AppData\Roaming\npm;%PATH% && npm run dev"

echo.
echo Techloom is starting...
echo   Frontend: http://localhost:3000
echo   API:      http://localhost:4000
echo   Admin:    admin@techloom.com / Admin@Techloom123
echo.
echo Keep both terminal windows open while using the site.
pause