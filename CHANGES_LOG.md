# Project Change Log

## Phase 1: Cleanup & Setup (Completed)
- Deleted legacy Ruvva backend controllers/repositories: `College`, `Booking`, `Mentor`, `Career`, `Assessment`.
- Deleted legacy Frontend components: `CollegeFinder`, `MentorBooking`, `MentorSessionDetail`.
- Removed Firestore/Redis dependencies from `pom.xml`.
- Added PostgreSQL and Spring Data JPA dependencies to `pom.xml`.
- Updated `application.yml` and `start-backend.sh` with Supabase configuration.
- Cleaned up `CareerConnectApplication.java` and `App.js`.

## Phase 2: Core Feature Implementation
### Backend Migration
- [x] Convert `User.java` to JPA Entity.
- [x] Create `Mission.java` Entity.
- [x] Create `CodeAnalysis.java` Entity.
- [x] Create `GitHubProfile.java` Entity.
- [x] Migrate Repositories to `JpaRepository`.
- [x] Implement `GitHubService` (OAuth, repo fetching).
### Service Layer
- [x] Implement `GitHubService` (OAuth).
- [x] Create `WebhookController`.
- [x] Refactor `AuthService` (Remove Firebase).
- [x] Refactor `UserDetailsServiceImpl` and `ProfileService`.
- [x] Implement `MissionService`.
- [x] Pivot `GeminiAIService` to use Code Analysis prompts (Dropped RIASEC).
- [x] Refactor `ChatController` to use PythonAIIntegrationService.
- [x] Refactor `HealthController` to remove Firebase and add AI service checks.
- [x] Removed placeholder services.
- [x] **New**: Refactored `career-connect-ai` (Python Service):
    - Implemented `code_analyzer.py` engine.
    - Updated `app.py` to expose `/analyze` endpoint.
    - Removed legacy RIASEC/Career models.
### Frontend Layer
- [x] Create `GitHubConnect.js` component.
- [x] Integrate OAuth flow in `App.js` and `Profile.js`.
- [x] Implement `GitHubController` for token exchange.
- [x] **New**: Added mock feedback logic for reliable demos.
- [x] **New**: Integrated **Dashboard** and **Missions** UI components.
- [x] **New**: Completely rewrote `LandingPage.js` for "Kodra Developer" branding.
- [x] **New**: Replaced legacy Navbar with Mission/Dashboard links.

## Phase 3: Sponsor Integrations (In Progress)
- [x] **Cline**: Added `.clinerules` for "Kodra Mentor" persona.
- [x] **Cline**: Implemented backend endpoint (`/api/kodra/assist`) for AI assistant and connected it to the `PythonAIIntegrationService`.
- [x] **Kestra**: Created `backend/kestra/analysis-flow.yaml` workflow definition.
- [x] **Kestra**: Implemented `KestraIntegrationService` and `MissionGeneratorService` with mock data.
- [x] **CodeRabbit**: Created `coderabbit.yaml` for AI PR reviews.
- [x] **CodeRabbit**: Implemented `CodeRabbitService` and integrated it into `WebhookController`.
- [x] **Oumi**: Implemented `evaluateCodeFix` in `PythonAIIntegrationService` and `evaluateMissionSubmission` in `MissionService`.
- [x] **Oumi**: Created `MissionController` with `/submit` and `/skip` endpoints.
- [x] **Oumi**: Added logging for RL training data collection.

### Realizing Integrations (Completed)
- [x] Created `backend/backend/serviceAccountKey.json` to centralize external API keys and secrets.
- [x] Updated `backend/backend/.gitignore` to include `serviceAccountKey.json`, ensuring it's not committed.
- [x] Refactored `KestraIntegrationService.java`: Replaced mock logic with real `RestTemplate` calls for Kestra API communication.
- [x] Created `backend/backend/src/main/java/com/ruvaa/backend/config/AppConfig.java`: Added a central configuration class for common beans like `RestTemplate` and `ObjectMapper`.
- [x] Refactored `CodeRabbitService.java`: Replaced mock logic with real `RestTemplate` calls for CodeRabbit API communication.
- [x] Refactored `PythonAIIntegrationService.java`: Removed legacy career-focused methods and all mock fallback logic, streamlining the service.
- [x] Refactored `MissionService.java`: Removed mock data in `evaluateMissionSubmission` method, laying the groundwork for real GitHub integration.
- [x] Refactored `GitHubService.java`: Updated to use constructor injection for `RestTemplate` and added placeholder methods (`getPullRequestDiff`, `getFileContent`) required by `MissionService` for future GitHub API interactions.