# Test Suite - Updated According to AI Service Flow

## Overview
Tests have been updated to follow the complete AI service flow:
**API Route → Service Layer → Core AI (GeminiClient) → Response**

## Test Structure

### 1. **test_0_health_auth.py**
- Health check endpoints
- Authentication token generation
- **Flow**: Basic app initialization and auth setup

### 2. **test_1_profile.py**
- Profile creation, retrieval, update
- Profile analysis
- **Flow**: `POST /api/v1/profile/*` → ProfileAnalyzer → Analysis

### 3. **test_2_assessment.py** ✅ UPDATED
- RIASEC assessment questions retrieval
- RIASEC assessment submission
- **Flow**: 
  - `GET /api/v1/assessment/riasec/questions` → Returns questions
  - `POST /api/v1/assessment/riasec/submit` → RIASECAnalyzer → Top 2 careers
- **Key Assertions**:
  - Validates complete 36-question responses
  - Checks for max 2 career matches (after tuning)
  - Validates RIASEC score structure

### 4. **test_3_career.py** ✅ UPDATED
- Career analysis (no auth for MVP)
- Career discovery (authenticated)
- Career search, details, trending
- **Flow**:
  - `POST /api/v1/careers/analyze` → CareerDiscoveryService → Multi-factor matching
  - Tests the complete discovery flow
- **Key Assertions**:
  - Validates RIASEC score formatting
  - Checks top careers list
  - Validates response structure

### 5. **test_5_chat.py** ✅ UPDATED
- Simple chat (no auth for MVP)
- Chat session creation
- Message sending
- **Flow**: 
  - `POST /api/v1/chat` → ChatService → ConversationManager → GeminiClient → Response
  - Tests complete chat flow with AI integration
- **Key Assertions**:
  - Validates concise responses (≤ 500 chars after tuning)
  - Checks session management
  - Validates response structure

### 6. **test_flow_integration.py** ✅ NEW
- Complete end-to-end flow tests
- Service layer integration tests
- **Purpose**: Tests full flow without mocking

## Test Execution

### Run All Tests
```bash
python -m pytest tests/ -v
```

### Run Specific Test Suite
```bash
# Chat flow tests
python -m pytest tests/test_5_chat.py -v

# Career analysis tests
python -m pytest tests/test_3_career.py -v

# Assessment tests
python -m pytest tests/test_2_assessment.py -v

# Integration tests
python -m pytest tests/test_flow_integration.py -v
```

### Run Tests by Flow
```bash
# Test complete chat flow
python -m pytest tests/test_5_chat.py::test_simple_chat_endpoint -v

# Test career analysis flow
python -m pytest tests/test_3_career.py::test_analyze_career_profile -v

# Test RIASEC assessment flow
python -m pytest tests/test_2_assessment.py::test_submit_riasec_assessment -v
```

## Key Updates After Prompt Tuning

1. **Response Length**: Tests now check for concise responses (max 300 tokens/500 chars)
2. **Career Limits**: RIASEC tests validate max 2 career matches
3. **Confidence Levels**: Updated to match new labels (High/Good/Fair/Low)
4. **Flow Testing**: Tests now follow actual service flow paths

## Testing Without API Key

Some tests may fail if Gemini API key is not configured, but they will:
- Still validate the flow structure
- Check response format
- Validate error handling

To test with full AI integration, set `GEMINI_API_KEY` in your environment.

## Test Coverage

- ✅ API Route Layer (routes)
- ✅ Service Layer (ChatService, CareerDiscoveryService)
- ✅ Core AI Layer (GeminiClient integration)
- ✅ Response Format Validation
- ✅ Error Handling
- ✅ Authentication Flow
- ✅ CORS Handling

## Notes

- Tests use `test-api-key` for GeminiClient initialization
- Redis caching is disabled in tests
- Async operations are handled gracefully
- Tests validate the actual flow, not just unit functionality

