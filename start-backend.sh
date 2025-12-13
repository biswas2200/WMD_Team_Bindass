#!/bin/bash

# Backend startup script for Kodra project
# This script sets up the environment and starts the Spring Boot backend on port 8000

echo "🚀 Starting Kodra Backend on port 8000..."

# Navigate to backend directory
cd "$(dirname "$0")/backend/backend"

# Source environment variables from .env file
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# Ensure GEMINI_API_KEY is set in your environment
if [ -z "$GEMINI_API_KEY" ]; then
    echo "Warning: GEMINI_API_KEY is not set."
fi
# Ensure JWT_SECRET is set in your environment
if [ -z "$JWT_SECRET" ]; then
    echo "Warning: JWT_SECRET is not set."
fi

echo "Environment variables set:"
echo "SERVER_PORT: $SERVER_PORT"

# Try different methods to start the backend
if [ -f "./mvnw" ]; then
    echo "Using Maven wrapper..."
    chmod +x ./mvnw
    ./mvnw spring-boot:run -Dspring.profiles.active=dev -Dserver.port=${SERVER_PORT:-8000}
elif command -v mvn &> /dev/null; then
    echo "Using system Maven..."
    mvn spring-boot:run -Dspring.profiles.active=dev -Dserver.port=${SERVER_PORT:-8000}
elif [ -f "./run-dev.sh" ]; then
    echo "Using run-dev script..."
    chmod +x ./run-dev.sh
    PORT=${SERVER_PORT:-8000} ./run-dev.sh
else
    echo "❌ No suitable method found to run the backend"
    echo "Please ensure Maven is installed and try again"
    exit 1
fi
