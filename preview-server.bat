@echo off
setlocal

set "PORT=4173"
set "ROOT=%~dp0"

echo Starting preview server on http://127.0.0.1:%PORT%/
start "" /b powershell -NoProfile -WindowStyle Hidden -Command "Set-Location '%ROOT%'; python -m http.server %PORT% --bind 127.0.0.1"

timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/"

endlocal
