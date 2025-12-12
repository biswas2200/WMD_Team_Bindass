# Kodra.ai: GitHub Code Analysis and Learning Platform 🚀

Welcome to **Kodra.ai**, a fully integrated, production-ready GitHub code analysis and learning platform. This application leverages a microservices architecture to provide users with AI-driven code assessments, personalized learning missions, and robust user profile management.

## 🖥 Platform Demo

[![Watch the Kodra.ai demo](https://img.youtube.com/vi/SRnXmLy0TYM/maxresdefault.jpg)](https://www.youtube.com/watch?v=SRnXmLy0TYM)

## ✨ Features

-   🔐 **Secure Authentication**: User sign-up and login handled via JWT tokens.
-   👤 **User Profile Management**: Full CRUD operations for user profiles.
-   🤖 **AI-Powered Code Analysis**: Analyze GitHub repositories for code quality, security, and performance issues.
-   📝 **Personalized Learning Missions**: Receive tailored missions to fix code issues and improve skills.
-   🌐 **Resilient Architecture**: Built with fault-tolerant microservices that degrade gracefully.
-   🩺 **Health Monitoring**: Real-time service availability tracking to ensure a seamless user experience.

---

## 🛠️ Tech Stack & Architecture

Kodra.ai is built on a distributed microservices architecture, ensuring scalability, fault tolerance, and independent service management.

<img width="511" height="452" alt="image" src="https://github.com/user-attachments/assets/af0b3330-50b1-42c1-9423-a086f2d50fc2" />



-   **Frontend**: React
-   **Backend**: Spring Boot (Java)
-   **AI Service**: Flask (Python)
-   **Database**: PostgreSQL (Supabase)

---

## 🔥 Getting Started

Follow these instructions to get the Kodra.ai platform running on your local machine for development and testing.

### Prerequisites

Make sure you have the following software installed:

-   [Java 17+](https://www.oracle.com/java/technologies/downloads/) & [Maven](https://maven.apache.org/download.cgi)
-   [Python 3.8+](https://www.python.org/downloads/) & [pip](https://pip.pypa.io/en/stable/installation/)
-   [Node.js](https://nodejs.org/) & [npm](https://www.npmjs.com/get-npm)
-   A **PostgreSQL database** (e.g., via Supabase or local installation).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/meenakshiiyer2531/ruvva.git
    cd WMD_Team_Bindass
    ```

2.  **Configure Environment Variables for Backend:**
    -   Create a `.env` file in `backend/backend/` and populate it with:
        ```
        JWT_SECRET=your_jwt_secret_key
        GITHUB_CLIENT_ID=your_github_oauth_client_id
        GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
        SUPABASE_DB_URL=jdbc:postgresql://<YOUR_SUPABASE_HOST>:5432/postgres
        SUPABASE_DB_USER=postgres
        SUPABASE_DB_PASSWORD=your_supabase_password
        GEMINI_API_KEY=your_gemini_api_key
        ```
    -   For local development, the `start-backend.sh` script will use an in-memory H2 database.

3.  **Start the Spring Boot Backend:**
    ```bash
    ./start-backend.sh
    # Backend will be running on http://localhost:8000
    ```

4.  **Start the Python AI Service:**
    ```bash
    cd career-connect-ai
    pip install -r requirements.txt # Or create and activate a virtual environment
    python app.py
    # AI Service will be running on http://localhost:5000
    ```

5.  **Start the React Frontend:**
    ```bash
    cd kodra
    npm install
    npm start
    # Frontend will be accessible at http://localhost:3000
    ```

6.  You should now have the full platform running locally! 🎉

---

## 🗃️ Database Schema

User data is organized in a PostgreSQL database, with tables for users, missions, code analyses, and chat history.

---

## 🔒 Security

-   **Authentication Flow**: The frontend communicates with the Spring Boot backend, which validates JWT tokens. The Python AI service also integrates with the backend to access user data securely.
-   **CORS**: Cross-Origin Resource Sharing is properly configured across all services to ensure secure communication between the frontend, backend, and AI service.

---

## 🧪 Testing the Integration

To ensure the platform is functioning correctly, perform the following tests:

1.  **Full Stack Test**: Run all services and complete a full user journey: sign up, log in, analyze code, receive and complete a mission, and use the AI chat.
2.  **Resilience Test**: Stop the Python AI Service or the Backend and verify that the frontend handles the failure gracefully by showing appropriate messages or using fallback data.
3.  **Database Test**: Verify that user data (profiles, missions, code analyses, chat history) is correctly persisted in the PostgreSQL database.
4.  **Authentication Test**: Test login with valid/invalid credentials and ensure that protected routes are inaccessible without a valid JWT token.

---

## 🎯 Production Readiness

The platform is architected for production deployment and is ready for:

-   Deployment to cloud providers like AWS, Google Cloud, or Azure.
-   Horizontal scaling of individual services to handle increased load.
-   Integration with CI/CD pipelines for automated builds and deployments.
-   Integration with monitoring and analytics tools for performance tracking.
