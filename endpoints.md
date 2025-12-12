# Kodra.ai API Endpoints

This document provides a comprehensive reference for all the backend API endpoints for Kodra.ai.

## Table of Contents
1. [Authentication Endpoints (`/auth`)](#auth)
2. [GitHub Integration Endpoints (`/api/github`)](#github)
3. [AI Assistant Endpoints (`/api/kodra/assist`)](#assist)
4. [Chat Endpoints (`/chat`)](#chat)
5. [Mission Endpoints (`/missions`)](#missions)
6. [Webhook Endpoints (`/api/webhooks`)](#webhooks)
7. [Health Check Endpoints (`/`)](#health)

---

## 1. Authentication Endpoints (`/auth`) <a name="auth"></a>
Handles user registration and login.

### `POST /auth/register`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "username": "testuser",
    "password": "password123",
    "name": "Test User",
    "email": "test@example.com"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "id": "1",
    "username": "testuser",
    "name": "Test User",
    "email": "test@example.com",
    "phone": null,
    "age": null,
    "location": null,
    "education": null,
    "interests": null,
    "createdAt": "2025-12-11T17:00:00.000000"
  }
  ```
- **Error Response (400 Bad Request):**
  ```json
  {
    "message": "Email already exists"
  }
  ```

### `POST /auth/login`
- **Description:** Authenticates a user and returns a JWT token.
- **Request Body:**
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "token": "ey...",
    "type": "Bearer",
    "user": {
      "id": "1",
      "username": "testuser",
      "name": "Test User",
      "email": "test@example.com",
      "phone": null,
      "age": null,
      "location": null,
      "education": null,
      "interests": null,
      "createdAt": "2025-12-11T17:00:00.000000"
    }
  }
  ```
- **Error Response (401 Unauthorized):**
  ```json
  {
    "message": "User not found or invalid credentials"
  }
  ```
---

## 2. GitHub Integration Endpoints (`/api/github`) <a name="github"></a>
Handles GitHub OAuth and repository operations.

### `POST /api/github/link`
- **Description:** Links a user's GitHub account using the OAuth code.
- **Request Parameters:**
  - `userId` (Long): The ID of the user.
  - `code` (String): The OAuth authorization code from GitHub.
- **Success Response (200 OK):**
  ```json
  {
    "id": 1,
    "user": {
      "id": 1,
      "username": "testuser",
      ...
    },
    "githubUsername": "testuser-github",
    "accessToken": "gho_...",
    "avatarUrl": "https://avatars.githubusercontent.com/u/...",
    "lastSyncedAt": "2025-12-11T17:05:00.000000"
  }
  ```
- **Error Response (400 Bad Request):**
  ```json
  {
    "message": "Failed to exchange code for token"
  }
  ```

### `GET /api/github/repos/{userId}`
- **Description:** Fetches the repositories for a given user.
- **URL Parameters:**
  - `userId` (Long): The ID of the user.
- **Success Response (200 OK):**
  ```json
  [
    {
      "name": "my-awesome-project",
      "fullName": "testuser-github/my-awesome-project",
      "url": "https://github.com/testuser-github/my-awesome-project",
      "language": "Java"
    }
  ]
  ```
- **Error Response (404 Not Found):**
  ```json
  {
    "message": "User not found"
  }
  ```
---

## 3. AI Assistant Endpoints (`/api/kodra/assist`) <a name="assist"></a>
Handles requests from the Cline CLI for AI-powered assistance.

### `POST /api/kodra/assist`
- **Description:** Provides contextual help to the user based on their current code and mission.
- **Request Body:**
  ```json
  {
    "userId": 1,
    "missionId": 101,
    "question": "teach me about environment variables",
    "context": {
      "currentFile": "config.js",
      "fileContent": "const API_KEY = 'sk-123...';",
      "cursorLine": 1,
      "programmingLanguage": "javascript",
      "selectedCode": "const API_KEY = 'sk-123...';"
    }
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "explanation": "This is a mock explanation for 'teach me about environment variables'. Environment variables are a way to store configuration outside of your code.",
    "codeExample": "require('dotenv').config();\nconst apiKey = process.env.API_KEY;",
    "practiceExercise": "Try adding a new environment variable called 'DB_HOST' and access it in your code.",
    "estimatedReadTime": 2,
    "relatedResources": [
      {
        "title": "Dotenv Documentation",
        "url": "https://www.npmjs.com/package/dotenv"
      }
    ]
  }
  ```
---

## 4. Chat Endpoints (`/chat`) <a name="chat"></a>
Handles the AI-powered technical chat.

### `POST /chat/message`
- **Description:** Sends a message to the AI chat assistant.
- **Request Body:**
  ```json
  {
    "message": "How do I use environment variables in Spring Boot?"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "text": "In Spring Boot, you can access environment variables using the `@Value` annotation. For example: `@Value(\"${DB_HOST}\")`"
  }
  ```

### `GET /chat/history`
- **Description:** Retrieves the chat history for the authenticated user.
- **Success Response (200 OK):**
  ```json
  [
    {
      "message": "How do I use environment variables in Spring Boot?",
      "response": "In Spring Boot, you can access environment variables using the `@Value` annotation. For example: `@Value(\"${DB_HOST}\")`",
      "isFromUser": true,
      "timestamp": "2025-12-11T17:10:00.000000"
    },
    {
      "message": "In Spring Boot, you can access environment variables using the `@Value` annotation. For example: `@Value(\"${DB_HOST}\")`",
      "response": "In Spring Boot, you can access environment variables using the `@Value` annotation. For example: `@Value(\"${DB_HOST}\")`",
      "isFromUser": false,
      "timestamp": "2025-12-11T17:10:05.000000"
  ]
  ```
---

## 5. Mission Endpoints (`/missions`) <a name="missions"></a>
Handles the management of learning missions.

### `GET /missions/{userId}`
- **Description:** Fetches all missions for a given user.
- **URL Parameters:**
  - `userId` (Long): The ID of the user.
- **Success Response (200 OK):**
  ```json
  [
    {
      "id": 101,
      "title": "Secure Your Authentication Service",
      "description": "Your auth-service repository has hardcoded API keys...",
      "severity": "CRITICAL",
      "status": "PENDING",
      "estimatedTime": 30,
      "skillsTaught": ["Environment Variables", "Security"],
      "repoName": "auth-service",
      "repoUrl": "https://github.com/testuser-github/auth-service",
      "isLocked": false
    },
    {
      "id": 102,
      "title": "Prevent SQL Injection Attacks",
      "description": "...",
      "severity": "CRITICAL",
      "status": "LOCKED",
      "estimatedTime": 45,
      "skillsTaught": ["SQL", "Security"],
      "repoName": "payment-gateway",
      "repoUrl": "https://github.com/testuser-github/payment-gateway",
      "isLocked": true
    }
  ]
  ```

### `GET /missions/{userId}/{missionId}`
- **Description:** Fetches the detailed information for a specific mission.
- **URL Parameters:**
  - `userId` (Long): The ID of the user.
  - `missionId` (Long): The ID of the mission.
- **Success Response (200 OK):**
  ```json
  {
    "id": 101,
    "title": "Secure Your Authentication Service",
    "description": "Your auth-service repository has hardcoded API keys in 3 locations...",
    "severity": "CRITICAL",
    "status": "PENDING",
    "estimatedTime": 30,
    "skillsTaught": ["Environment Variables", "Security"],
    "repoName": "auth-service",
    "repoUrl": "https://github.com/testuser-github/auth-service",
    "issuesAddressed": [
      {
        "type": "SECURITY",
        "description": "Hardcoded API key in line 42 of config.js",
        "filePath": "src/config.js",
        "lineNumber": 42
      }
    ],
    "stepByStepGuide": [
      {
        "stepNumber": 1,
        "title": "Create .env file",
        "instructions": "Create a new file in your project root: .env..."
      }
    ],
    "acceptanceCriteria": [
      "No hardcoded secrets in any committed files",
      ".env file added to .gitignore"
    ],
    "xpReward": 150,
    "isLocked": false
  }
  ```

### `POST /missions/{missionId}/start`
- **Description:** Marks a mission as "IN_PROGRESS".
- **URL Parameters:**
  - `missionId` (Long): The ID of the mission.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "startedAt": "2025-12-11T17:15:00.000000"
  }
  ```

### `POST /missions/{missionId}/submit`
- **Description:** Submits a mission for review with a Pull Request URL.
- **URL Parameters:**
  - `missionId` (Long): The ID of the mission.
- **Request Body:**
  ```json
  {
    "prUrl": "https://github.com/testuser-github/auth-service/pull/12"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "reviewStatus": "PENDING"
  }
  ```
---

## 6. Webhook Endpoints (`/api/webhooks`) <a name="webhooks"></a>
Receives webhooks from GitHub and CodeRabbit to update mission status and user scores.

### `POST /api/webhooks/github`
- **Description:** Handles GitHub webhook events (e.g., PR created, merged).
- **Request Headers:**
  - `X-GitHub-Event`: "pull_request", "push", etc.
- **Request Body (Example for `pull_request` event):**
  ```json
  {
    "action": "opened",
    "pull_request": {
      "id": 789,
      "title": "[Kodra Mission 1] Remove hardcoded API keys",
      "html_url": "https://github.com/alexchen/auth-service/pull/12",
      "user": { "login": "alexchen" },
      "head": { "ref": "fix/api-keys" },
      "base": { "ref": "main" }
    },
    "repository": {
      "name": "auth-service",
      "full_name": "alexchen/auth-service"
    }
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "received": true,
    "message": "Event Processed"
  }
  ```

### `POST /api/webhooks/coderabbit`
- **Description:** Handles CodeRabbit webhook events (e.g., review completed).
- **Request Body (Example for review completion):**
  ```json
  {
    "pr_url": "https://github.com/alex/auth-service/pull/12",
    "status": "completed",
    "summary": {
      "issues_found": 1,
      "issues_resolved": 3,
      "overall_rating": "good"
    },
    "comments": [
      {
        "file": "config.js",
        "line": 67,
        "severity": "medium",
        "message": "Database password still in Git history",
        "suggestion": "Use BFG Repo-Cleaner to remove from history"
      }
    ]
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "received": true,
  }
  ```
---

## 7. Health Check Endpoints (`/`) <a name="health"></a>
Provides system health status and API information.

### `GET /`
- **Description:** Returns basic API information.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Kodra.ai API is running successfully",
    "data": {
      "name": "Kodra.ai API",
      "description": "Autonomous Career Agent for Developers",
      "version": "1.0.0",
      "status": "running",
      "timestamp": "2025-12-11T17:30:00.000000",
      "documentation": "/swagger-ui.html",
      "endpoints": {
        "missions": "/missions/* - Mission management",
        "github": "/api/github/* - GitHub integration",
        "chat": "/chat/* - AI-powered technical chat",
        "health": "/health - System health checks"
      },
      "features": {
        "codeAnalysis": "Analyzes GitHub repos for logic, security, and performance.",
        "missionGeneration": "Creates personalized learning missions from code.",
        "aiMentorship": "Provides AI-powered assistance for missions."
      }
    }
  }
  ```

### `GET /health`
- **Description:** Returns detailed system health status including external services.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "System is healthy",
    "data": {
      "status": "UP",
      "timestamp": "2025-12-11T17:30:00.000000",
      "services": {
        "python-ai-service": {
          "status": "UP",
          "description": "Python AI Service for code analysis and chat."
        },
        "gemini": {
          "status": "CONFIGURED",
          "description": "Google Gemini AI service configuration"
        },
        "application": {
          "status": "UP",
          "description": "Main application services"
        }
      },
      "system": {
        "memory": 12345678,
        "totalMemory": 123456789,
        "maxMemory": 1234567890,
        "processors": 8
      }
    }
  }
  ```

### `GET /ready`
- **Description:** Checks if the API is ready to serve requests.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "API is ready",
    "data": {
      "ready": true,
      "timestamp": "2025-12-11T17:30:00.000000",
      "message": "API is ready to serve requests"
    }
  }
  ```

  }
  ```
---

## 8. User Profile Endpoints (`/profile`) <a name="profile"></a>
Manages user profile information.

### `GET /profile`
- **Description:** Retrieves the profile of the authenticated user.
- **Success Response (200 OK):**
  ```json
  {
    "name": "Test User",
    "studentClass": null,
    "location": "Srinagar, J&K",
    "aspirations": null
  }
  ```

### `POST /profile`
- **Description:** Updates the profile of the authenticated user.
- **Request Body:**
  ```json
  {
    "name": "Updated User Name",
    "location": "New Location"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "name": "Updated User Name",
    "studentClass": null,
    "location": "New Location",
    "aspirations": null
  }
  ```

---

## 9. User Endpoints (`/users`) <a name="users"></a>
Manages user-specific operations.

### `GET /users/profile`
- **Description:** Retrieves the full user details for the authenticated user.
- **Success Response (200 OK):**
  ```json
  {
    "id": "1",
    "username": "testuser",
    "name": "Test User",
    "email": "test@example.com",
    "phone": null,
    "age": null,
    "location": "Srinagar, J&K",
    "education": null,
    "interests": null,
    "createdAt": "2025-12-11T17:00:00.000000"
  }
  ```

### `PUT /users/profile`
- **Description:** Updates specific user details for the authenticated user.
- **Request Body:**
  ```json
  {
    "name": "Another Name",
    "phone": "9876543210"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "id": "1",
    "username": "testuser",
    "name": "Another Name",
    "email": "test@example.com",
    "phone": "9876543210",
    "age": null,
    "location": "Srinagar, J&K",
    "education": null,
    "interests": null,
    "createdAt": "2025-12-11T17:00:00.000000"
  }
  ```
---

