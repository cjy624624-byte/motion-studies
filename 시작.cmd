@echo off
cd /d "%~dp0"
node node_modules\vite\bin\vite.js --configLoader native --host 127.0.0.1
pause
