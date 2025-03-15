@echo off
setlocal enabledelayedexpansion

:: Start Ngrok in a new terminal window
start ngrok http http://localhost:3000

:: Wait a few seconds for ngrok to initialize
timeout /t 5 /nobreak >nul

@echo off
setlocal enabledelayedexpansion

:: Get the ngrok public URL
for /f "delims=" %%i in ('curl -s http://localhost:4040/api/tunnels ^| findstr /r /c:"https://[a-zA-Z0-9\-]*\.ngrok\-free\.app"') do (
    set "ngrok_url=%%i"
)

:: Extract only the exact URL using PowerShell
for /f %%a in ('powershell -Command "$url = '%ngrok_url%' -match 'https://[a-zA-Z0-9\-]*\.ngrok\-free\.app'; if ($matches) { Write-Output $matches[0] }"') do (
    set "new_ngrok_url=%%a"
)

:: Verify if the ngrok URL is retrieved
if "%new_ngrok_url%"=="" (
    echo ❌ Gagal mendapatkan URL ngrok.
    exit /b 1
)

echo ✅ Ngrok URL berhasil diperoleh: %new_ngrok_url%

:: Use PowerShell to correctly update the JavaScript file
powershell -Command "(Get-Content 3.js) -replace 'const NGROK_URL = .*;', 'const NGROK_URL = \"%new_ngrok_url%\";' | Set-Content 3.js"

echo ✅ File JavaScript telah diperbarui dengan URL baru!

endlocal