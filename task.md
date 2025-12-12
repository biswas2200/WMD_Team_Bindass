# Kodra.ai Hackathon Implementation Task List

## Phase 1: Preparation & Cleanup
- [ ] Rename/Refactor remaining 'Ruvva' references to 'Kodra'
- [x] Remove irrelevant Ruvva features (Colleges, RIASEC, Booking)
- [ ] Setup Development Environment for all 3 services (Frontend, Backend, AI)

## Phase 2: Core Feature Implementation
- [ ] **Infrastructure**: Set up Supabase Project & Config (Env Variables)
- [x] **Backend**: Migrate DB Layer (Firestore -> JPA/PostgreSQL)
- [ ] **Frontend**: Implement GitHub OAuth Flow
- [x] **Backend**: Create new Entities (`Mission`, `CodeAnalysis`, `GitHubProfile`)
- [ ] **Backend**: Implement GitHub API Integration (Service Layer)
- [ ] **AI Service**: Build `code_analyzer.py` (Pattern detection engine)
- [ ] **Frontend**: Build Code Health Dashboard (Charts/Stats)
- [ ] **Backend**: Implement Mission Generation Logic
- [ ] **Frontend**: Build Mission Detail & Guidance UI

## Phase 3: Sponsor Integrations (The "Winning" Features)
- [x] **CodeRabbit**: Implement Webhook handler for PR reviews
- [x] **Kestra**: Create workflow for orchestrating code analysis
    - [x] Create `KestraIntegrationService` in the backend.
    - [x] Create `MissionGeneratorService` to use the Kestra service.
- [x] **Oumi**: Integrate RL fine-tuning dummy/prototype in Python service
    - [x] Implement `evaluateCodeFix` in `PythonAIIntegrationService`.
    - [x] Implement `evaluateMissionSubmission` in `MissionService`.
    - [x] Create `MissionController` with `submit` endpoint.
    - [x] Add logging for RL training data collection.
- [x] **Cline**: Implement Backend for AI Assistant
    - [x] **Cline**: Document and verify Cline usage for mentorship
- [ ] **Vercel**: Configure frontend for deployment

## Phase 4: Polish & Demo
- [ ] Create Demo Data (Mock GitHub scenarios)
- [ ] Verify End-to-End User Flow
- [ ] Record Demo Video
