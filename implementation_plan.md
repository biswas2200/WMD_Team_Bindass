# Kodra.ai Implementation Plan

## Goal Description
Transform the existing "CareerConnect" (Ruvva) microservices project into **Kodra.ai**, an Autonomous Career Agent for the WeMakeDevs Hackathon. The goal is to build a platform that analyzes a user's GitHub code and generates personalized learning "Missions" to improve their skills.

**Key Pivot:**
- **From:** Generic Career Counseling (Assessment -> Career Path)
- **To:** Coding Mentorship (Code Analysis -> Learning Mission)

## User Review Required
> [!IMPORTANT]
> **Data Loss Warning**: This plan involves **deleting** existing career-specific features (College database, RIASEC assessments, Mentor bookings) to focus on the Code Analysis features.
> **Sponsor Requirements**: We must strictly adhere to the technical requirements for Cline, Kestra, Oumi, Vercel, and CodeRabbit as detailed in `we make dev.md`.

## Proposed Changes

### 1. Cleanup & Refactoring
We will first slim down the existing application to remove noise.
#### [DELETE] / Modify
- Remove `College`, `Career`, `Booking`, `Mentor` entities and controllers.
- Rename generic `Assessment` entity to `CodeAnalysis` or similar, or adapt it.

### 2. Microservices Architecture Updates

#### [MODIFY] Backend (Spring Boot)
- **Database Management**:
    - **Switch to Supabase (PostgreSQL)**.
    - Remove Firestore dependencies.
    - Create Tables: `users`, `missions`, `code_analysis`, `skill_history`.
- **GitHub Integration**:
    - Add `GitHubService` to handle OAuth and API calls.
    - Add `WebhookController` to listen for GitHub and CodeRabbit events.
- **New Entities**:
    - `Mission` (Title, Description, Status, RelatedRepo, ExpectedFix).
    - `CodeAnalysis` (Stores logic/security/performance scores).
    - `SkillHistory` (Tracks progress over time).
- **Logic**:
    - Implement `MissionService` to generate tasks based on low scores from the AI service.

#### [MODIFY] AI Service (Python/Flask)
- **Code Analysis Engine**:
    - Implement `code_analyzer.py` using AST/Regex to detect:
        - Exposed Secrets (Security)
        - `console.log` overuse (Best Practices)
        - SQL Injection patterns (Security)
        - Missing Error Handling (Logic)
- **Integration**:
    - **Oumi**: Use Oumi logic (mock or real) to refine pattern detection scoring.
    - **Kestra**: Expose endpoints for Kestra to trigger batch analysis.

#### [MODIFY] Frontend (React/Kodra)
- **New Pages**:
    - `GitHubConnect.js`: OAuth entry point.
    - `Dashboard.js`: Replacement for the old Home page. Shows Code Health graphs.
    - `MissionList.js` & `MissionDetail.js`: The core learning UI.
- **Chat**:
    - Update the AI Chat interface to offer "Pair Programming" context (inject file context into prompt).

### 3. Sponsor Integrations Plan

#### **Cline ($5k)**
- **Plan**: We will use Cline to generate the `MissionService` logic and Frontend Components. We will document this usage.
- **Feature**: Build a "Teacher Mode" assistance prompt that Cline can use.

#### **Kestra ($4k)**
- **Plan**: Define a Kestra Flow (YAML) that orchestrates the "Diagnosis" phase.
    1. Trigger: User Connects GitHub.
    2. Step 1: Clone Repo (Python).
    3. Step 2: Run Analysis (Python).
    4. Step 3: Summarize Findings (AI Agent).
    5. Step 4: Post results to Backend.

#### **Oumi ($3k)**
- **Plan**: Integrate Oumi in the Python service.
- **Feature**: "Feedback Loop". When a user marks a Mission as "Too Hard", use Oumi optimized model to adjust the difficulty of future mission pattern matching.

#### **CodeRabbit ($1k)**
- **Plan**: Setup a repo-level webhook.
- **Flow**: User pushes Mission fix -> CodeRabbit reviews PR -> Webhook hits Backend -> Update Mission Status to "Verified" if review is clean.

#### **Vercel ($2k)**
- **Plan**: Deploy `kodra` (frontend) directory to Vercel. Ensure `proxy` settings in `package.json` are handled via Environment Variables for production.

---

## Verification Plan

### Automated Tests
- **Backend**: Unit tests for `GitHubService` and `MissionGenerator`.
- **AI Service**: Test `code_analyzer.py` against a known "Vulnerable Repo" to ensure it catches all 5 patterns.

### Manual Verification (The Demo Flow)
1. **Login**: Sign in with Firebase (reuse existing) - *Correction: Will migrate to Supabase Auth if possible, or keep Firebase Auth and sync to Supabase. Plan implies full switch, but Auth might stick to Firebase for ease if just DB is needed. Let's assume full switch or Supabase for DB.*
2. **Connect**: Click "Link GitHub".
3. **Analyze**: Verify Dashboard updates with "Real" data from the linked repo.
4. **Mission**: Click a mission, see the details.
5. **Fix**: Push a fix to the repo.
6. **Verify**: Check if CodeRabbit webhook updates the dashboard score.
