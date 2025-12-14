# API Endpoint Verification Log - Alex Journey

This document captures the actual verified requests and responses from the implementation of the "Alex Journey" user story.

## 1. Authentication
### Register User (Alex Chen)
- **Endpoint**: `POST /api/auth/register`
- **Payload**:
```json
{
  "name": "Alex Chen",
  "email": "alex.chen@kodra.ai",
  "username": "alexchen",
  "password": "password123"
}
```
- **Response**: `200 OK` (Returns User DTO with ID)

## 2. GitHub Integration
### Link GitHub Account
- **Endpoint**: `POST /api/github/link` (Query params: `userId=...&code=...`)
- **Note**: Triggers Mission Generation asynchronously.
- **Response**: `200 OK` (Returns GitHub Profile)

## 3. Mission Discovery
### Get Missions
- **Endpoint**: `GET /api/kodra/missions/{userId}`
- **Response**: `200 OK` (List of Missions)
```json
[
  {
    "id": 1,
    "title": "Secure Your Authentication Service",
    "status": "PENDING",
    ...
  }
]
```

## 4. Mission Execution
### Start Mission
- **Endpoint**: `POST /api/kodra/missions/{missionId}/start`
- **Response**: `200 OK` (Status update)

### Ask AI Assistant
- **Endpoint**: `POST /api/kodra/assist`
- **Payload**:
```json
{
  "userId": "{userId}",
  "question": "teach me about environment variables",
  "context": "Context from config.js..."
}
```
- **Response**: `200 OK` (Explanation and code examples)

## 5. Webhook Simulation
### GitHub Webhook
- **Endpoint**: `POST /api/webhooks/github`
- **Payload**: Standard GitHub Webhook JSON
- **Response**: `200 OK`
