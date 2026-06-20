@echo off
title Techloom Launcher
color 0D

set NODE_DIR=C:\Users\rajar\AppData\Local\OpenAI\Codex\bin\5b9024f90663758b
set PATH=%NODE_DIR%;C:\Users\rajar\AppData\Roaming\npm;%PATH%
set ROOT=%~dp0

echo.
echo  ========================================
echo   TECHLOOM - Starting Servers
echo  ========================================
echo.

:: Kill stale processes on ports 3000 and 4000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4000" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul

echo  [1/2] Starting API on port 4000...
start "Techloom API - DO NOT CLOSE" cmd /k "cd /d %ROOT%backend && npm run dev"

timeout /t 6 /nobreak >nul

echo  [2/2] Starting Website on port 3000...
start "Techloom Web - DO NOT CLOSE" cmd /k "cd /d %ROOT%frontend && npm run dev"

echo.
echo  ========================================
echo   Servers are starting!
echo  ========================================
echo.
echo   Website:  http://localhost:3000
echo   Login:    http://localhost:3000/auth/login
echo.
echo   Admin Email:    admin@techloom.com
echo   Admin Password: Admin@Techloom123
echo.
echo   KEEP BOTH CMD WINDOWS OPEN!
echo.
echo   Contact form email not working?
echo   Run:  setup-email.ps1  (needs Gmail App Password)
echo  ========================================
echo.
pause