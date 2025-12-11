# Kodra.ai Backend

## 🎯 **Autonomous Career Agent for Developers**

This is the backend for **Kodra.ai**, an autonomous career agent that analyzes a developer's GitHub repositories and generates personalized learning "Missions" to improve their coding skills. This project is a pivot from the original "CareerConnect" platform.

---

## 🏗️ **Architecture Overview**

```
Kodra.ai Backend
├── 🏛️ Presentation Layer
│   ├── AuthController - User authentication
│   ├── GitHubController - GitHub OAuth and data fetching
│   ├── MissionController - Mission management
│   ├── ChatController - AI-powered technical chat
│   └── HealthController - System monitoring & status
├── 🔧 Service Layer
│   ├── AuthService - Handles user registration and login.
│   ├── GitHubService - Manages GitHub API interactions.
│   ├── MissionService - Generates and manages learning missions.
│   ├── GeminiAIService - Integrates with Google Gemini for AI tasks.
│   └── PythonAIIntegrationService - Communicates with the Python AI service.
├── 🗄️ Data Layer
│   ├── PostgreSQL (Supabase) - Primary database
│   └── JPA Repositories for entities (User, Mission, etc.)
└── ⚙️ Configuration Layer
    ├── SecurityConfig - JWT & CORS
    └── GeminiConfig - AI service configuration
```

---

## 🚀 **Quick Start Guide**

### **Prerequisites**
- Java 21+
- Maven 3.8+
- Supabase Project (PostgreSQL)
- Google Gemini API Key
- GitHub OAuth App credentials

### **1. Environment Setup**

Create a `.env` file in the root of the `backend/backend` directory with the following content:

```
SUPABASE_DB_URL=jdbc:postgresql://your-supabase-host:5432/postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-supabase-password
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GEMINI_API_KEY=your-gemini-api-key
JWT_SECRET=your-super-secret-jwt-key
```

### **2. Run Application**

**Easy Development Mode (Recommended):**
```bash
# Linux/Mac
./run-dev.sh

# Windows
run-dev.bat
```

**Manual Commands:**
```bash
# Simple development run
./mvnw spring-boot:run -Dspring.profiles.active=dev
```

### **3. Verify Setup**
```bash
# Health check
curl http://localhost:8080/api/health

# API documentation
http://localhost:8080/api/swagger-ui.html
```

---

## 🌐 **API Endpoints**

### **Authentication**
```http
POST   /auth/register
POST   /auth/login
```

### **GitHub Integration**
```http
POST   /api/github/link
GET    /api/github/repos/{userId}
```

### **Missions**
```http
GET    /missions/{userId}
GET    /missions/{userId}/{missionId}
```

### **Chat**
```http
POST   /chat/message
GET    /chat/history
```

### **System Monitoring**
```http
GET    /api/health
GET    /api/ready
GET    /api/live
```
---
## 🧪 **Testing Strategy**

### **Unit Tests**
```bash
./mvnw test
```

### **Integration Tests**
```bash
./mvnw test -Dtest=*IntegrationTest
```
---

## 📄 **License**

This project is licensed under the MIT License.