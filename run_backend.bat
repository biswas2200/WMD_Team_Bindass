@echo off
echo Starting CareerConnect Backend...

:: Load environment variables from .env if it exists
if exist .env (
    echo Loading variables from .env...
    for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
        if "%%A" neq "" set "%%A=%%B"
    )
) else (
    echo WARNING: .env file not found! Database connection may fail.
)

:: Ensure Port is 8081
set PORT=8081

:: Run with Dev profile and Force Port 8081 (Overriding application-dev.yml)
echo Running mvn spring-boot:run with dev profile...
cd backend\backend
call mvn spring-boot:run -Dspring-boot.run.profiles=dev -Dspring-boot.run.arguments="--server.port=8081"
pause
