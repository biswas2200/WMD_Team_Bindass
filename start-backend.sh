#!/bin/bash

# Backend startup script for Kodra project
# This script sets up the environment and starts the Spring Boot backend on port 8000

echo "🚀 Starting Kodra Backend on port 8000..."

# Navigate to backend directory
cd "$(dirname "$0")/backend/backend"

# Set environment variables
export SUPABASE_DB_URL=jdbc:postgresql://localhost:5432/kodra
export SUPABASE_DB_USER=postgres
export SUPABASE_DB_PASSWORD=postgres
export GEMINI_API_KEY=AIzaSyCGo2KpKAMGU7b52skjDvAiFd6CE-v7Ohs
export JWT_SECRET=kodraDevSecretKeyForJWTTokenGenerationAndValidation123456789
export GOOGLE_APPLICATION_CREDENTIALS=./credentials/serviceAccountKey.json
export SERVER_PORT=8000

echo "Environment variables set:"
echo "SUPABASE_DB_URL: $SUPABASE_DB_URL"
echo "SERVER_PORT: $SERVER_PORT"

# Try different methods to start the backend
if [ -f "./mvnw" ]; then
    echo "Using Maven wrapper..."
    chmod +x ./mvnw
    ./mvnw spring-boot:run -Dspring.profiles.active=dev -Dserver.port=8000
elif command -v mvn &> /dev/null; then
    echo "Using system Maven..."
    mvn spring-boot:run -Dspring.profiles.active=dev -Dserver.port=8000
elif [ -f "./run-dev.sh" ]; then
    echo "Using run-dev script..."
    chmod +x ./run-dev.sh
    PORT=8000 ./run-dev.sh
else
    echo "❌ No suitable method found to run the backend"
    echo "Please ensure Maven is installed and try again"
    exit 1
fi