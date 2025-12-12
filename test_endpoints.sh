#!/bin/bash

echo "🚀 Starting Endpoint Tests..."

EMAIL="test@example.com"
PASSWORD="password123"
USERNAME="testuser"
NAME="Test User"
TOKEN=""

# Test 2: Login
echo "Testing: POST /api/auth/login"
LOGIN_RESPONSE=$(curl -s -w "
%{http_code}" -X POST http://localhost:8000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "'$EMAIL'", "password": "'$PASSWORD'"}')

LOGIN_HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')

if [ "$LOGIN_HTTP_CODE" -eq 200 ]; then
  echo "✅ Login PASSED (HTTP $LOGIN_HTTP_CODE)"
  TOKEN=$(echo "$LOGIN_BODY" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
else
  echo "ℹ️ Login failed (HTTP $LOGIN_HTTP_CODE). User might not exist. Attempting to register..."
  
  # Test 1: Register a new user
  echo "Testing: POST /api/auth/register"
  REGISTER_RESPONSE=$(curl -s -w "
%{http_code}" -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "'$USERNAME'", "password": "'$PASSWORD'", "name": "'$NAME'", "email": "'$EMAIL'"}')

  REGISTER_HTTP_CODE=$(echo "$REGISTER_RESPONSE" | tail -n1)
  REGISTER_BODY=$(echo "$REGISTER_RESPONSE" | sed '$d')

  if [ "$REGISTER_HTTP_CODE" -eq 200 ]; then
    echo "✅ Registration PASSED (HTTP $REGISTER_HTTP_CODE)"
    echo "Retrying login..."
    
    # Retry Login
    LOGIN_RESPONSE=$(curl -s -w "
%{http_code}" -X POST http://localhost:8000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "'$EMAIL'", "password": "'$PASSWORD'"}')

    LOGIN_HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
    LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')

    if [ "$LOGIN_HTTP_CODE" -eq 200 ]; then
      echo "✅ Login PASSED (HTTP $LOGIN_HTTP_CODE)"
      TOKEN=$(echo "$LOGIN_BODY" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
    else
      echo "❌ Login FAILED after registration (HTTP $LOGIN_HTTP_CODE)"
      echo "$LOGIN_BODY"
      exit 1
    fi
  else
    echo "❌ Registration FAILED (HTTP $REGISTER_HTTP_CODE)"
    echo "$REGISTER_BODY"
    exit 1
  fi
fi

if [ -z "$TOKEN" ]; then
  echo "❌ Could not retrieve JWT token. Exiting."
  exit 1
fi

echo "🔐 JWT Token Acquired."

# Test 3: GET /
echo "Testing: GET /"
RESPONSE=$(curl -s -w "
%{http_code}" -X GET http://localhost:8000/api/ \
-H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ PASSED (HTTP $HTTP_CODE)"
  echo "$BODY"
else
  echo "❌ FAILED (HTTP $HTTP_CODE)"
  echo "$BODY"
  exit 1
fi

echo "🎉 All tests passed so far!"
