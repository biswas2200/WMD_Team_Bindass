@echo off
:: Change to the directory where this script resides
cd /d "%~dp0"

echo Starting CareerConnect Backend on Port 8081...

:: Load environment variables from .env
if exist .env (
    echo Loading .env variables...
    for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
        if "%%A" neq "" set "%%A=%%B"
    )
) else (
    echo WARNING: .env file not found in %CD%
)

:: Force Port 8081
set PORT=8081

:: Run with Dev profile
echo Running Spring Boot...
call mvn spring-boot:run -Dspring-boot.run.profiles=dev -Dspring-boot.run.arguments="--server.port=8081"
pause
