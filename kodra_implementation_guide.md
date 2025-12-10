# 🗺️ Kodra Implementation Blueprint: Complete File-by-File Transformation Guide

## 📖 Table of Contents
1. [User Story: The Alex Journey](#user-story)
2. [Files to Keep (No Changes)](#files-to-keep)
3. [Files to Modify](#files-to-modify)
4. [Files to Create (New)](#files-to-create)
5. [Files to Delete](#files-to-delete)
6. [Complete Data Flow](#complete-data-flow)
7. [Internal Workflow Deep Dive](#internal-workflow)
8. [Expected Inputs & Outputs](#inputs-outputs)

---

## 👤 User Story: The Complete Alex Journey {#user-story}

Let's follow **Alex Chen**, a full-stack developer, through every step of Kodra.

### **Day 1: Monday, 9:00 AM - The Discovery**

**Scene**: Alex is scrolling Twitter and sees a tweet:
> "Tired of tutorials that don't match your real code problems? Try @Kodra_ai - it learns from YOUR GitHub repos."

**Action**: Alex clicks the link → Lands on `kodra.vercel.app`

**What Alex Sees**:
- Landing page with bold headline: "The AI Career Architect That Turns Your Code Into a Curriculum"
- Video showing a developer connecting GitHub and instantly getting a code health report
- Big button: "Connect GitHub & Get Your Code Health Report"

---

### **Phase 1: The Diagnosis (Monday, 9:05 AM)**

**Action 1: Alex clicks "Connect GitHub"**

**Frontend Flow**:
- `LandingPage.jsx` → Shows loading animation
- Browser redirects to GitHub OAuth page
- Alex sees: "Kodra wants permission to: Read your repositories"
- Alex clicks "Authorize"

**What Happens Behind the Scenes**:
```
GitHub redirects back: https://kodra.vercel.app/callback?code=abc123xyz
↓
Frontend captures code → Sends to Backend
↓
Backend POST /api/kodra/auth/github
↓
Backend exchanges code for access_token with GitHub
↓
Backend stores: user_id=42, github_username=alexchen, access_token=gho_xxxxx
↓
Backend triggers async job: "Scan alexchen's repositories"
```

**Frontend Response**:
- Alex sees: "GitHub Connected ✓"
- Progress bar appears: "Analyzing your code... (This takes 1-2 minutes)"
- Status updates:
  - "Fetching repositories... ✓"
  - "Scanning auth-service... ✓"
  - "Analyzing payment-gateway... ✓"
  - "Detecting patterns... ✓"
  - "Generating health report... ✓"

---

**Action 2: Analysis Completes**

**What Backend Did (While Alex Waited)**:
```
1. GitHubService.getUserRepositories(access_token)
   → Returns: [auth-service, payment-gateway, user-dashboard, notification-service, analytics-engine]

2. For each repo:
   - Clone to temp directory
   - Send to Python AI Service: POST /python/analyze
   
3. Python AI Service analyzes:
   - Scans for hardcoded secrets (regex patterns)
   - Detects SQL injection risks (AST parsing)
   - Measures code complexity (cyclomatic complexity)
   - Checks error handling (try-catch patterns)
   
4. Python returns JSON:
   {
     "repo_name": "auth-service",
     "issues": [
       {
         "type": "SECURITY",
         "severity": "CRITICAL",
         "description": "Hardcoded API key in line 42 of config.js",
         "file_path": "src/config.js",
         "line_number": 42,
         "code_snippet": "const API_KEY = 'sk-proj-12345';"
       },
       {
         "type": "SECURITY",
         "severity": "HIGH",
         "description": "SQL injection vulnerability in user query",
         "file_path": "src/database/userRepo.js",
         "line_number": 78
       }
     ],
     "scores": {
       "logic": 85,
       "security": 15,
       "performance": 70
     }
   }

5. Backend aggregates results across all 5 repos:
   - Total issues: 23
   - Critical: 5 (all security)
   - High: 8
   - Medium: 10
   
6. Backend calculates overall scores:
   - Logic: 80% (good structure, few logic errors)
   - Security: 20% (many exposed secrets, SQL injection)
   - Performance: 65% (some N+1 queries detected)

7. Backend stores in database:
   - code_analysis table (all issue details)
   - skill_history table (historical scores)
```

---

**What Alex Sees (9:07 AM)**:

Screen transitions to **Code Health Dashboard**

**Top Section - Overall Scores**:
```
┌─────────────────────────────────────────────┐
│  YOUR CODE HEALTH REPORT                    │
│                                             │
│  Logic Score:       ████████░░  80%  ✅    │
│  Security Score:    ██░░░░░░░░  20%  ⚠️    │
│  Performance Score: ██████░░░░  65%  ⚙️    │
│                                             │
│  Overall Health: NEEDS ATTENTION            │
└─────────────────────────────────────────────┘
```

**Middle Section - Critical Issues**:
```
⚠️ CRITICAL ISSUES FOUND (5)

1. 🔴 Exposed API Keys (3 occurrences)
   └─ auth-service/src/config.js:42
   └─ payment-gateway/src/stripe.js:15
   └─ notification-service/src/email.js:8

2. 🔴 SQL Injection Risk (2 occurrences)
   └─ auth-service/src/database/userRepo.js:78
   └─ user-dashboard/src/queries.js:103
```

**Bottom Section - Personalized Message**:
```
💡 Alex, your code structure is solid (Logic: 80%), but 
your security practices need immediate attention.

You're exposing sensitive credentials in 3 repositories 
and have SQL injection vulnerabilities in 2 places.

Ready to fix this? I've created a personalized mission for you.
```

**Big Button**: "View My First Mission 🎯"

**Alex's Reaction**: "Whoa... I knew I had some hardcoded keys, but didn't realize it was this bad. Let's see this mission."

---

### **Phase 2: The Curriculum (Monday, 9:10 AM)**

**Action 3: Alex clicks "View My First Mission"**

**Frontend Flow**:
```
Dashboard → MissionsPage.jsx
↓
GET /api/kodra/missions/user/42
↓
Backend retrieves missions from database
```

**What Backend Did (Right After Analysis)**:
```
1. MissionGeneratorService.generateMissions(user_id=42, analysis_results)

2. Kestra Workflow Triggered: "kodra-mission-prioritizer"
   
   Workflow Steps:
   a) Kestra AI Agent receives all 23 issues
   b) Agent summarizes: "5 critical security issues across 3 repos"
   c) Agent decides priority:
      - Security issues > Performance > Logic
      - Within security: Exposed secrets > SQL injection > Others
   d) Agent generates mission descriptions:
      "Mission 1: Secure Your Authentication Service"
      "Mission 2: Prevent SQL Injection Attacks"
      "Mission 3: Optimize Database Queries"

3. Backend stores missions:
   mission table:
   - id: 101
   - user_id: 42
   - repo_name: "auth-service"
   - title: "Secure Your Authentication Service"
   - description: [detailed task]
   - severity: "CRITICAL"
   - status: "PENDING"
   - estimated_time: "30 minutes"
```

---

**What Alex Sees**:

**Missions Page**:
```
┌─────────────────────────────────────────────────────┐
│  YOUR LEARNING MISSIONS                              │
│                                                      │
│  🎯 Mission 1: Secure Your Authentication Service   │
│  ├─ Status: READY TO START                          │
│  ├─ Priority: 🔴 CRITICAL                            │
│  ├─ Estimated Time: 30 minutes                      │
│  ├─ Skills You'll Learn:                            │
│  │  • Environment Variable Management               │
│  │  • Secrets Management Best Practices             │
│  │  • Configuration Security                        │
│  └─ Repositories Affected:                          │
│     • auth-service (3 issues)                       │
│                                                      │
│  [Start Mission] [Learn More]                       │
├─────────────────────────────────────────────────────┤
│  Mission 2: Prevent SQL Injection Attacks           │
│  └─ Status: LOCKED (Complete Mission 1 first)       │
├─────────────────────────────────────────────────────┤
│  Mission 3: Optimize Database Queries               │
│  └─ Status: LOCKED                                  │
└─────────────────────────────────────────────────────┘
```

**Action 4: Alex clicks "Learn More"**

**Mission Detail View Opens**:
```
MISSION 1: SECURE YOUR AUTHENTICATION SERVICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 THE PROBLEM:
Your auth-service repository has hardcoded API keys in 3 locations.
This is a critical security vulnerability. Anyone with access to your
code (including in Git history) can steal these credentials.

🔍 WHAT WE FOUND:
1. config.js:42 → OpenAI API key hardcoded
2. config.js:67 → Database password exposed
3. config.js:91 → JWT secret in plaintext

🎯 YOUR MISSION:
Refactor your configuration to use environment variables and proper
secrets management.

📚 WHAT YOU'LL LEARN:
• How to use .env files securely
• Environment variable best practices
• How to add .env to .gitignore
• Using dotenv library (or Spring @Value)

🛠️ STEP-BY-STEP GUIDE:

Step 1: Create a .env file
  Create a new file in your project root: .env
  Move all secrets there

Step 2: Update .gitignore
  Add .env to your .gitignore file

Step 3: Update your code
  Replace hardcoded values with environment variables

Step 4: Create .env.example
  Provide a template for other developers

Step 5: Push your changes
  Create a Pull Request with title: "[Kodra] Fix exposed API keys"

✅ ACCEPTANCE CRITERIA:
- No hardcoded secrets in any committed files
- .env file added to .gitignore
- .env.example provided
- Code uses environment variables
- All tests still pass

💡 STUCK? Use @Kodra in your editor for help!

[Start Mission in GitHub] [Get AI Help Now]
```

**Alex's Reaction**: "Okay, this is super clear. Let me start fixing this."

---

### **Phase 3: The Mentorship (Monday, 9:20 AM)**

**Action 5: Alex opens VS Code**

**Setup (Alex Did This Once Before)**:
- Installed Cline CLI: `npm install -g @cline/cli`
- Configured Cline: `cline config set kodra-api https://api.kodra.ai`
- Authenticated: `cline auth login` (linked to Alex's Kodra account)

**Action 6: Alex opens auth-service/src/config.js**

```javascript
// auth-service/src/config.js (Alex's current code)
const config = {
  openaiKey: "sk-proj-12345abcdef", // Line 42 - EXPOSED!
  databaseUrl: "postgresql://admin:mypassword@localhost:5432/mydb", // Line 67
  jwtSecret: "supersecretkey123", // Line 91
};

module.exports = config;
```

**Alex starts editing but gets confused...**

**Action 7: Alex types in VS Code terminal**:
```bash
@Kodra teach me about environment variables
```

---

**What Happens Behind the Scenes**:

```
1. Cline CLI intercepts the command

2. Cline gathers context:
   - Current file: config.js
   - File content: [entire file]
   - Line cursor is on: 42
   - User's question: "teach me about environment variables"
   - User's mission ID: 101

3. Cline sends to Kodra Backend:
   POST /api/kodra/assist
   {
     "user_id": 42,
     "mission_id": 101,
     "question": "teach me about environment variables",
     "context": {
       "current_file": "config.js",
       "file_content": "[...full file...]",
       "cursor_line": 42,
       "programming_language": "javascript"
     }
   }

4. Backend → Python AI Service:
   POST /python/assist
   
5. Python AI Service:
   - Loads Oumi fine-tuned model
   - Constructs prompt:
     """
     You are a Senior Engineer mentoring a developer.
     
     Context:
     - Student: Alex (Skill Level: Intermediate)
     - Current Mission: Secure authentication service
     - Problem: Hardcoded API keys
     - Student's Code: [config.js content]
     - Question: "teach me about environment variables"
     
     Task:
     1. Explain environment variables in 2-3 sentences
     2. Show a code example specific to their situation
     3. Generate a mini practice exercise
     
     Keep it concise and actionable.
     """
   
   - Oumi LLM generates response
   - LLM-as-a-Judge validates: "Is this explanation clear and accurate?"
   
6. Python returns:
   {
     "explanation": "...",
     "code_example": "...",
     "practice_exercise": "...",
     "estimated_read_time": "2 minutes"
   }

7. Backend logs interaction (for RL training later)

8. Cline receives response → Displays in VS Code
```

---

**What Alex Sees in VS Code**:

```
┌─────────────────────────────────────────────────────┐
│  🤖 Kodra Assistant                                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ENVIRONMENT VARIABLES 101                          │
│                                                      │
│  Environment variables store sensitive configuration │
│  outside your code. They're set at runtime (not     │
│  compiled in), so secrets never touch your Git      │
│  history.                                           │
│                                                      │
│  HERE'S HOW TO FIX YOUR CODE:                       │
│                                                      │
│  1. Create a .env file:                             │
│     ```                                             │
│     OPENAI_API_KEY=sk-proj-12345abcdef             │
│     DATABASE_URL=postgresql://admin:pass@...        │
│     JWT_SECRET=supersecretkey123                    │
│     ```                                             │
│                                                      │
│  2. Install dotenv:                                 │
│     ```                                             │
│     npm install dotenv                              │
│     ```                                             │
│                                                      │
│  3. Update config.js:                               │
│     ```javascript                                   │
│     require('dotenv').config();                     │
│                                                      │
│     const config = {                                │
│       openaiKey: process.env.OPENAI_API_KEY,       │
│       databaseUrl: process.env.DATABASE_URL,        │
│       jwtSecret: process.env.JWT_SECRET             │
│     };                                              │
│     ```                                             │
│                                                      │
│  🧪 PRACTICE EXERCISE:                              │
│  Try this: Add a new environment variable called    │
│  REDIS_URL and access it in your code.              │
│                                                      │
│  ⏱️ Estimated time to complete: 5 minutes           │
│                                                      │
│  [Mark as Helpful] [Ask Follow-up] [Show More]     │
└─────────────────────────────────────────────────────┘
```

**Alex's Reaction**: "Oh! That makes sense. Let me implement this."

---

**Action 8: Alex implements the fix**

**20 minutes later...**

Alex has:
1. Created `.env` file
2. Added `.env` to `.gitignore`
3. Updated `config.js` to use `process.env`
4. Created `.env.example` for teammates
5. Tested locally (everything works!)

---

### **Phase 4: The Exam (Monday, 9:45 AM)**

**Action 9: Alex commits and pushes**

```bash
git checkout -b fix/remove-hardcoded-secrets
git add .
git commit -m "[Kodra Mission 1] Remove hardcoded API keys"
git push origin fix/remove-hardcoded-secrets
```

**Action 10: Alex creates Pull Request on GitHub**

**PR Title**: "[Kodra Mission 1] Remove hardcoded API keys"
**PR Description**:
```
## Changes Made
- Moved all secrets to environment variables
- Added .env.example for team reference
- Updated .gitignore to exclude .env

## Mission
Completing Kodra Mission 1: Secure Your Authentication Service

@coderabbitai please review for security issues
```

---

**What Happens Behind the Scenes**:

```
1. GitHub webhook triggers:
   → POST https://api.kodra.ai/webhook/github/pr-created
   
   Payload:
   {
     "action": "opened",
     "pull_request": {
       "id": 789,
       "title": "[Kodra Mission 1] Remove hardcoded API keys",
       "user": "alexchen",
       "html_url": "https://github.com/alexchen/auth-service/pull/12"
     },
     "repository": {
       "name": "auth-service"
     }
   }

2. Backend WebhookController receives event:
   - Extracts PR ID: 789
   - Identifies user: alexchen (user_id=42)
   - Identifies mission: Detects "[Kodra Mission 1]" in title
   - Updates mission status: "IN_REVIEW"

3. Backend triggers CodeRabbit review:
   POST https://api.coderabbit.ai/reviews
   {
     "pr_url": "https://github.com/alexchen/auth-service/pull/12",
     "review_type": "security_focused",
     "custom_rules": [
       "Check for any remaining hardcoded secrets",
       "Verify .env is in .gitignore",
       "Ensure environment variables are properly used"
     ]
   }

4. CodeRabbit analyzes PR:
   - Checks each file change
   - Scans for security issues
   - Validates against Kodra's mission criteria

5. CodeRabbit posts comments on GitHub:

   Comment 1 (config.js):
   "✅ Great job removing the hardcoded secrets! 
   
   However, I noticed you forgot to remove the database 
   password from line 67 in the Git history. Consider 
   using BFG Repo-Cleaner to purge it.
   
   Severity: Medium
   Impact: Historical exposure still exists"

   Comment 2 (.gitignore):
   "✅ .env is properly ignored"

   Comment 3 (.env.example):
   "✅ Good practice providing an example file!"

6. CodeRabbit webhook → Backend:
   POST https://api.kodra.ai/webhook/coderabbit/review-complete
   {
     "pr_id": 789,
     "status": "APPROVED_WITH_SUGGESTIONS",
     "issues_found": 1,
     "issues_resolved": 3,
     "comments": [...]
   }

7. Backend processes review results:
   - Calculates improvement: 3 issues fixed, 1 minor remaining
   - Recalculates security score:
     OLD: 20% (5 critical issues)
     NEW: 45% (2 critical issues remaining, 3 fixed)
   
   - Updates database:
     skill_history table:
     INSERT (user_id=42, metric_type='security', 
             score=45, recorded_date=NOW())
     
     mission table:
     UPDATE mission SET status='COMPLETED_WITH_FEEDBACK',
            completion_date=NOW() WHERE id=101

8. Backend sends real-time update to Frontend:
   WebSocket message to user 42:
   {
     "type": "SCORE_UPDATE",
     "metric": "security",
     "old_score": 20,
     "new_score": 45,
     "improvement": 25,
     "mission_id": 101,
     "feedback": "Great work! One minor issue remains."
   }
```

---

**What Alex Sees (9:50 AM)**:

**In GitHub PR**:
Alex sees CodeRabbit's comments appear one by one.

**In Kodra Dashboard (Tab was still open)**:

🎉 **Notification appears at top**:
```
┌─────────────────────────────────────────────────────┐
│  🎉 MISSION PROGRESS UPDATE!                        │
│                                                      │
│  Your PR for Mission 1 has been reviewed!           │
│  Security Score: 20% → 45% (+25%) 📈               │
│                                                      │
│  [View Details] [See Next Mission]                  │
└─────────────────────────────────────────────────────┘
```

**Dashboard Updates in Real-Time**:
```
┌─────────────────────────────────────────────────────┐
│  YOUR CODE HEALTH REPORT                            │
│                                                      │
│  Logic Score:       ████████░░  80%  ✅            │
│  Security Score:    ████░░░░░░  45%  🔄 +25%       │ ← ANIMATED!
│  Performance Score: ██████░░░░  65%  ⚙️            │
│                                                      │
│  Overall Health: IMPROVING 📈                       │
└─────────────────────────────────────────────────────┘

🎯 MISSION COMPLETED: Secure Your Authentication Service
   └─ ✅ 3 issues fixed
   └─ ⚠️ 1 minor issue remains (see GitHub PR)
   └─ Time taken: 30 minutes
   └─ XP Gained: +150 XP

🏆 ACHIEVEMENT UNLOCKED: First Security Fix!

📊 YOUR PROGRESS:
   Week 1: Security 20% → 45%
   [====>........] 25% improvement

💡 READY FOR YOUR NEXT CHALLENGE?
   Mission 2: Prevent SQL Injection Attacks
   Status: NOW UNLOCKED
   [Start Mission 2]
```

**Alex's Reaction**: "This is so cool! I can literally see myself getting better. Let me fix that last issue CodeRabbit mentioned, then tackle Mission 2!"

---

### **Continued Journey (Later That Week)**

**Tuesday**: Alex completes Mission 2 (SQL injection) → Security: 45% → 68%
**Wednesday**: Alex starts Mission 3 (performance) → Gets stuck, uses @Kodra 3 times
**Thursday**: Alex completes Mission 3 → Performance: 65% → 78%
**Friday**: Alex's dashboard shows:
```
Weekly Progress Report
━━━━━━━━━━━━━━━━━━━━
Missions Completed: 3
Security: 20% → 68% (+48%) 🚀
Performance: 65% → 78% (+13%) 📈
Overall Improvement: +30.5%

You're now in the top 25% of Kodra developers!
```

**Monday Next Week**: Kestra AI Agent sends Alex an email:
```
Subject: 🎯 New Mission Available: Advanced Authentication

Hi Alex,

Great progress last week! Your security practices have 
improved significantly.

Based on your recent work, I've identified your next 
learning opportunity: Implementing OAuth 2.0 in your 
auth-service.

This mission will challenge you to:
• Understand OAuth flows
• Implement secure token management
• Handle refresh tokens properly

Estimated time: 2 hours
Difficulty: Intermediate

Ready to level up?
[Start Mission]

- Kodra AI Agent (powered by Kestra)
```

---

## 📂 Files Structure: What to Change {#files-to-modify}

### **BACKEND (Java Spring Boot)**

#### **Files to Keep (Minimal Changes)**
These files just need renaming/rebranding:

1. **`src/main/java/com/ruvaa/backend/config/CorsConfig.java`**
   - ✏️ Change: Package name `com.ruvaa` → `com.kodra`
   - ✅ Keep: All CORS logic

2. **`src/main/java/com/ruvaa/backend/config/SecurityConfig.java`**
   - ✏️ Change: Package name
   - ✏️ Change: Add new endpoint permissions: `/api/kodra/github/**`, `/api/kodra/missions/**`
   - ✅ Keep: JWT filter chain

3. **`src/main/java/com/ruvaa/backend/security/JwtFilter.java`**
   - ✏️ Change: Package name only
   - ✅ Keep: All JWT validation logic

4. **`src/main/java/com/ruvaa/backend/entity/User.java`**
   - ✏️ Change: Package name
   - ➕ Add: New fields:
     ```
     @Column(name = "github_username")
     private String githubUsername;
     
     @Column(name = "github_access_token")
     private String githubAccessToken;
     
     @Column(name = "last_github_sync")
     private LocalDateTime lastGithubSync;
     ```
   - ✅ Keep: All existing user fields (email, password, etc.)

5. **`resources/application.yml`**
   - ✏️ Change: Application name to "kodra"
   - ➕ Add new properties:
     ```yaml
     kodra:
       github:
         client-id: ${GITHUB_CLIENT_ID}
         client-secret: ${GITHUB_CLIENT_SECRET}
         callback-url: ${FRONTEND_URL}/callback
       python-service:
         url: http://localhost:5000
       coderabbit:
         api-key: ${CODERABBIT_API_KEY}
       kestra:
         url: http://localhost:8081
     ```

---

#### **Files to Delete**
Remove these - they're career-focused, not code-focused:

1. ❌ **`controller/AssessmentController.java`** (RIASEC tests)
2. ❌ **`controller/CareerController.java`** (Career recommendations)
3. ❌ **`controller/CollegeController.java`** (College database)
4. ❌ **`controller/MentorController.java`** (Human mentor matching)
5. ❌ **`entity/Career.java`**
6. ❌ **`entity/College.java`**
7. ❌ **`entity/Assessment.java`**
8. ❌ **`entity/Mentor.java`**
9. ❌ **`service/CareerRecommendationService.java`**
10. ❌ **`service/RIASECService.java`**
11. ❌ **`repository/CareerRepository.java`**
12. ❌ **`repository/CollegeRepository.java`**

---

#### **Files to Create (NEW)**

1. **`entity/GitHubConnection.java`**
   - **Purpose**: Store GitHub OAuth tokens
   - **Fields**:
     - `id` (Long, Primary Key)
     - `userId` (Long, Foreign Key → User)
     - `githubUsername` (String)
     - `accessToken` (String, encrypted)
     - `tokenExpiry` (LocalDateTime)
     - `repoCount` (Integer)
     - `lastSyncDate` (LocalDateTime)

2. **`entity/CodeAnalysis.java`**
   - **Purpose**: Store analysis results for each repository
   - **Fields**:
     - `id` (Long)
     - `userId` (Long, FK)
     - `repoName` (String)
     - `repoUrl` (String)
     - `analyzedDate` (LocalDateTime)
     - `logicScore` (Integer, 0-100)
     - `securityScore` (Integer, 0-100)
     - `performanceScore` (Integer, 0-100)
     - `issuesFound` (String, JSON) ← Stores array of issues
     - `totalIssues` (Integer)
     - `criticalIssues` (Integer)

3. **`entity/Mission.java`**
   - **Purpose**: Store personalized learning missions
   - **Fields**:
     - `id` (Long)
     - `userId` (Long, FK)
     - `codeAnalysisId` (Long, FK → CodeAnalysis)
     - `repoName` (String)
     - `title` (String) e.g., "Secure Your Authentication Service"
     - `description` (Text) ← Full mission details
     - `severity` (Enum: CRITICAL, HIGH, MEDIUM, LOW)
     - `status` (Enum: PENDING, IN_PROGRESS, IN_REVIEW, COMPLETED, SKIPPED)
     - `estimatedTime` (Integer, minutes)
     - `skillsTaught` (String, JSON) ← ["Environment Variables", "Security"]
     - `prUrl` (String) ← GitHub PR link
     - `createdDate` (LocalDateTime)
     - `startedDate` (LocalDateTime)
     - `completedDate` (LocalDateTime)
     - `xpReward` (Integer)

4. **`entity/SkillHistory.java`**
   - **Purpose**: Track skill improvements over time (for charts)
   - **Fields**:
     - `id` (Long)
     - `userId` (Long, FK)
     - `metricType` (Enum: LOGIC, SECURITY, PERFORMANCE)
     - `score` (Integer, 0-100)
     - `recordedDate` (LocalDateTime)
     - `missionId` (Long, FK → Mission, nullable)

5. **`entity/CodePattern.java`**
   - **Purpose**: Library of known anti-patterns
   - **Fields**:
     - `id` (Long)
     - `patternName` (String) e.g., "Hardcoded API Key"
     - `category` (Enum: SECURITY, PERFORMANCE, LOGIC, BEST_PRACTICE)
     - `severity` (Enum)
     - `detectionRegex` (String) ← Regex pattern to find it
     - `description` (Text)
     - `recommendedFix` (Text)
     - `learningResources` (String, JSON) ← Links to docs

6. **`dto/GitHubAuthRequest.java`**
   - **Input**: Receives GitHub OAuth callback
   - **Fields**:
     ```
     - code: String (OAuth authorization code)
     - state: String (CSRF protection)
     ```

7. **`dto/GitHubAuthResponse.java`**
   - **Output**: Returns after successful connection
   - **Fields**:
     ```
     - success: boolean
     - githubUsername: String
     - repoCount: int
     - analysisJobId: String (for polling status)
     - message: String
     ```

8. **`dto/CodeHealthDashboard.java`**
   - **Output**: Main dashboard data
   - **Fields**:
     ```
     - overallScores:
       - logic: int (0-100)
       - security: int (0-100)
       - performance: int (0-100)
     - totalIssues: int
     - criticalIssues: int
     - repositories: List<RepositoryHealth>
       - repoName: String
       - lastAnalyzed: LocalDateTime
       - scores: {...}
       - issueCount: int
     - recentActivity: List<ActivityEvent>
       - type: String ("MISSION_COMPLETED", "SCORE_IMPROVED")
       - timestamp: LocalDateTime
       - description: String
     - weeklyProgress:
       - startDate: LocalDate
       - improvements: Map<String, Integer> (metric → score change)
     ```

9. **`dto/MissionResponse.java`**
   - **Output**: Mission details for frontend
   - **Fields**:
     ```
     - id: Long
     - title: String
     - description: String
     - severity: String
     - status: String
     - estimatedTime: int
     - skillsTaught: List<String>
     - repoName: String
     - repoUrl: String
     - issuesAddressed: List<IssueDetail>
       - type: String
       - description: String
       - filePath: String
       - lineNumber: int
     - stepByStepGuide: List<MissionStep>
       - stepNumber: int
       - title: String
       - instructions: String
     - acceptanceCriteria: List<String>
     - xpReward: int
     - isLocked: boolean
     ```

10. **`dto/AssistRequest.java`**
    - **Input**: When user asks @Kodra for help
    - **Fields**:
      ```
      - userId: Long
      - missionId: Long (optional)
      - question: String
      - context:
        - currentFile: String (file path)
        - fileContent: String (full file text)
        - cursorLine: int
        - programmingLanguage: String
        - selectedCode: String (optional, if user highlighted something)
      ```

11. **`dto/AssistResponse.java`**
    - **Output**: AI's helpful response
    - **Fields**:
      ```
      - explanation: String (2-3 sentence explanation)
      - codeExample: String (formatted code snippet)
      - practiceExercise: String
      - estimatedReadTime: int (minutes)
      - relatedTopics: List<String>
      - furtherReading: List<Resource>
        - title: String
        - url: String
      ```

12. **`controller/GitHubController.java`**
    - **Purpose**: Handle GitHub OAuth and repository operations
    - **Endpoints**:
      ```
      POST /api/kodra/github/auth
      - Input: GitHubAuthRequest
      - Output: GitHubAuthResponse
      - Process: Exchange code for token, store, trigger analysis
      
      GET /api/kodra/github/repos/{userId}
      - Input: userId (path param)
      - Output: List<RepositoryInfo>
      - Process: Fetch user's GitHub repositories
      
      POST /api/kodra/github/rescan/{userId}
      - Input: userId (path param)
      - Output: { jobId: String, status: "QUEUED" }
      - Process: Trigger new analysis of all repos
      
      GET /api/kodra/github/sync-status/{jobId}
      - Input: jobId (path param)
      - Output: { status: "IN_PROGRESS", progress: 60 }
      - Process: Check analysis job status (for polling)
      ```

13. **`controller/DashboardController.java`**
    - **Purpose**: Serve dashboard data
    - **Endpoints**:
      ```
      GET /api/kodra/dashboard/{userId}
      - Input: userId (path param)
      - Output: CodeHealthDashboard
      - Process: Aggregate all analysis data, calculate scores
      
      GET /api/kodra/dashboard/{userId}/history
      - Input: userId, timeRange (query param: "week", "month", "all")
      - Output: List<SkillHistory> (time-series data for charts)
      - Process: Query skill_history table, format for charts
      
      GET /api/kodra/dashboard/{userId}/achievements
      - Input: userId
      - Output: List<Achievement>
      - Process: Calculate unlocked achievements based on progress
      ```

14. **`controller/MissionController.java`**
    - **Purpose**: Manage missions
    - **Endpoints**:
      ```
      GET /api/kodra/missions/{userId}
      - Input: userId
      - Output: List<MissionResponse>
      - Process: Fetch all missions, determine locked status
      
      GET /api/kodra/missions/{userId}/{missionId}
      - Input: userId, missionId
      - Output: MissionResponse (full details)
      - Process: Fetch complete mission with step-by-step guide
      
      POST /api/kodra/missions/{missionId}/start
      - Input: missionId, userId (in JWT)
      - Output: { success: true, startedAt: timestamp }
      - Process: Update mission status to IN_PROGRESS
      
      POST /api/kodra/missions/{missionId}/submit
      - Input: missionId, prUrl (String)
      - Output: { success: true, reviewStatus: "PENDING" }
      - Process: Update mission with PR URL, trigger CodeRabbit
      ```

15. **`controller/AssistController.java`**
    - **Purpose**: Handle @Kodra AI assistance
    - **Endpoints**:
      ```
      POST /api/kodra/assist
      - Input: AssistRequest
      - Output: AssistResponse
      - Process: Send to Python AI service, log interaction
      
      POST /api/kodra/assist/feedback
      - Input: { responseId: String, helpful: boolean }
      - Output: { success: true }
      - Process: Store feedback for RL training
      ```

16. **`controller/WebhookController.java`**
    - **Purpose**: Receive webhooks from GitHub and CodeRabbit
    - **Endpoints**:
      ```
      POST /api/kodra/webhook/github/pr-created
      - Input: GitHub webhook payload (JSON)
      - Output: { received: true }
      - Process: Detect mission from PR title, trigger CodeRabbit
      
      POST /api/kodra/webhook/github/pr-merged
      - Input: GitHub webhook payload
      - Output: { received: true }
      - Process: Mark mission as completed if merged
      
      POST /api/kodra/webhook/coderabbit/review-complete
      - Input: CodeRabbit webhook payload
      - Output: { received: true }
      - Process: Parse review, update scores, notify user
      ```

17. **`service/GitHubService.java`**
    - **Purpose**: Interact with GitHub API
    - **Key Methods**:
      ```
      exchangeCodeForToken(code: String): String
      - Calls GitHub OAuth endpoint
      - Returns access token
      
      getUserRepositories(accessToken: String): List<Repository>
      - Calls GET /user/repos
      - Returns user's repositories
      
      getRepositoryContents(repoFullName: String, accessToken: String): Map<String, String>
      - Clones repo or uses GitHub API
      - Returns map of filePath → fileContent
      
      createWebhook(repoFullName: String, accessToken: String): void
      - Registers webhook for PR events
      - Points to /api/kodra/webhook/github/*
      ```

18. **`service/CodeHealthService.java`**
    - **Purpose**: Calculate and manage code health metrics
    - **Key Methods**:
      ```
      calculateOverallScores(userId: Long): Map<String, Integer>
      - Queries all CodeAnalysis for user
      - Aggregates scores across repos
      - Returns { logic: 80, security: 45, performance: 65 }
      
      generateDashboard(userId: Long): CodeHealthDashboard
      - Calls calculateOverallScores()
      - Fetches recent activity
      - Calculates weekly progress
      - Returns complete dashboard DTO
      
      updateScoreAfterMission(userId: Long, missionId: Long): void
      - Recalculates scores after mission completion
      - Inserts new row in skill_history
      - Triggers WebSocket notification to frontend
      ```

19. **`service/MissionGeneratorService.java`**
    - **Purpose**: Create personalized missions
    - **Key Methods**:
      ```
      generateMissionsForUser(userId: Long, analysisResults: List<CodeAnalysis>): List<Mission>
      - Calls Kestra workflow (via KafkaTemplate or REST)
      - Waits for Kestra AI Agent to prioritize issues
      - Creates Mission entities based on Kestra response
      - Saves to database
      
      createMissionDescription(issueType: String, severity: String, repoName: String): String
      - Uses template engine to generate human-readable mission
      - Includes: problem description, learning goals, steps, criteria
      
      unlockNextMission(userId: Long): void
      - Called when user completes a mission
      - Checks if prerequisites met for next mission
      - Updates mission status from LOCKED to PENDING
      ```

20. **`service/PythonAIIntegrationService.java`** (MODIFY EXISTING)
    - **Current Purpose**: Connects to Python for career recommendations
    - **New Purpose**: Connects to Python for code analysis
    - **Methods to Change**:
      ```
      OLD: getCareersRecommendations(assessmentData)
      NEW: analyzeRepository(repoUrl: String, accessToken: String): CodeAnalysisResult
           - POST /python/analyze
           - Input: { repo_url, access_token, user_id }
           - Output: { scores: {...}, issues: [...] }
      
      NEW: getAIAssistance(assistRequest: AssistRequest): AssistResponse
           - POST /python/assist
           - Forwards Cline's request to Python
           - Returns AI-generated explanation
      ```

21. **`service/CodeRabbitService.java`**
    - **Purpose**: Interact with CodeRabbit API
    - **Key Methods**:
      ```
      triggerReview(prUrl: String, missionId: Long): String
      - POST to CodeRabbit API
      - Input: PR URL, custom review rules
      - Returns: review_id
      
      parseReviewResults(reviewPayload: JSON): ReviewResult
      - Extracts: issuesFound, issuesFixed, comments
      - Returns structured data
      
      calculateScoreImprovement(oldAnalysis: CodeAnalysis, reviewResult: ReviewResult): Map<String, Integer>
      - Compares before/after
      - Returns score deltas
      ```

22. **`service/KestraIntegrationService.java`**
    - **Purpose**: Trigger and manage Kestra workflows
    - **Key Methods**:
      ```
      triggerMissionPrioritizer(userId: Long, issues: List<Issue>): String
      - POST /api/v1/executions/{namespace}/kodra-mission-prioritizer
      - Input: user_id, issues array
      - Returns: execution_id (for polling)
      
      triggerWeeklyRescan(userId: Long): void
      - Scheduled by Kestra itself
      - Backend just receives result via webhook
      
      getWorkflowResult(executionId: String): Map<String, Object>
      - GET /api/v1/executions/{executionId}
      - Returns: Kestra AI Agent's decisions
      ```

23. **`repository/CodeAnalysisRepository.java`**
    - **Purpose**: JPA repository for CodeAnalysis entity
    - **Methods**:
      ```
      findByUserId(userId: Long): List<CodeAnalysis>
      findByUserIdAndRepoName(userId: Long, repoName: String): CodeAnalysis
      findLatestByUserId(userId: Long): List<CodeAnalysis> (last 5 analyses)
      ```

24. **`repository/MissionRepository.java`**
    - **Purpose**: JPA repository for Mission entity
    - **Methods**:
      ```
      findByUserId(userId: Long): List<Mission>
      findByUserIdAndStatus(userId: Long, status: MissionStatus): List<Mission>
      findByUserIdOrderBySeverityDesc(userId: Long): List<Mission>
      countCompletedMissionsByUserId(userId: Long): int
      ```

25. **`repository/SkillHistoryRepository.java`**
    - **Purpose**: JPA repository for skill tracking
    - **Methods**:
      ```
      findByUserIdAndMetricType(userId: Long, metricType: String): List<SkillHistory>
      findByUserIdAndRecordedDateBetween(userId: Long, start: LocalDateTime, end: LocalDateTime): List<SkillHistory>
      ```

---

### **PYTHON AI SERVICE**

#### **Files to Delete**
1. ❌ **`core/career_recommender.py`**
2. ❌ **`core/riasec_analyzer.py`**
3. ❌ **`core/cosine_matcher.py`**
4. ❌ **`data/careers/` (entire directory)**
5. ❌ **`data/prompts/career_counselor_prompt.txt`**

#### **Files to Modify**

1. **`core/gemini_client.py`** (KEEP & MODIFY)
   - **Current**: Generic LLM wrapper
   - **Change**: Add method signatures for code analysis
   - **New Methods**:
     ```python
     def analyze_code_for_patterns(code: str, language: str) -> Dict
     def explain_concept(concept: str, context: str, user_level: str) -> str
     def generate_practice_exercise(topic: str) -> str
     def judge_solution(original_issue: str, user_fix: str) -> Dict
     ```

2. **`api/routes/` (MODIFY ALL ROUTE FILES)**
   - **OLD**: `/assessment`, `/career`, `/chat`
   - **NEW**: `/analyze`, `/assist`, `/missions`

3. **`services/chat_service.py`** (KEEP & MODIFY)
   - **Current**: Career counseling chatbot
   - **Change**: Technical mentorship chatbot
   - **Updates**:
     - System prompt: Change from career counselor to senior engineer
     - Context handling: Include code snippets instead of career interests
     - Memory: Store technical concepts discussed, not career preferences

#### **Files to Create (NEW)**

1. **`core/code_analyzer.py`**
   - **Purpose**: Main analysis engine
   - **Key Functions**:
     ```python
     def analyze_repository(repo_path: str, language: str) -> Dict:
         # Returns: {
         #   "scores": {"logic": 85, "security": 15, "performance": 70},
         #   "issues": [
         #     {"type": "SECURITY", "severity": "CRITICAL", 
         #      "description": "Hardcoded API key", 
         #      "file": "config.js", "line": 42, 
         #      "code_snippet": "..."},
         #     ...
         #   ]
         # }
     
     def scan_for_security_issues(code: str) -> List[Dict]:
         # Detect: hardcoded secrets, SQL injection, XSS, etc.
     
     def scan_for_logic_issues(code: str) -> List[Dict]:
         # Detect: unhandled exceptions, infinite loops, null checks
     
     def scan_for_performance_issues(code: str) -> List[Dict]:
         # Detect: N+1 queries, inefficient algorithms, memory leaks
     ```
   
   - **Internal Process**:
     ```
     1. Receive repo_path and language
     2. Walk directory tree, collect all code files
     3. For each file:
        a. Read content
        b. Run security scan (regex + AST parsing)
        c. Run logic scan (complexity analysis)
        d. Run performance scan (pattern matching)
     4. Aggregate all issues
     5. Calculate category scores:
        - Base score: 100
        - Subtract points per issue severity:
          CRITICAL: -20 points
          HIGH: -10 points
          MEDIUM: -5 points
          LOW: -2 points
        - Minimum score: 0
     6. Return structured results
     ```

2. **`core/pattern_detector.py`**
   - **Purpose**: Library of anti-pattern detection rules
   - **Structure**:
     ```python
     class PatternDetector:
         PATTERNS = {
             "hardcoded_api_key": {
                 "regex": r'(api[_-]?key|apikey|api[_-]?secret)\s*=\s*["\'][a-zA-Z0-9]{20,}["\']',
                 "severity": "CRITICAL",
                 "category": "SECURITY",
                 "description": "Hardcoded API key detected",
                 "fix_template": "Use environment variables: process.env.API_KEY"
             },
             "sql_injection": {
                 "regex": r'(SELECT|INSERT|UPDATE|DELETE).*\+.*[\"\']',
                 "severity": "CRITICAL",
                 "category": "SECURITY",
                 "description": "Potential SQL injection vulnerability",
                 "fix_template": "Use prepared statements with parameterized queries"
             },
             # ... 50+ more patterns
         }
         
         def detect_all(code: str, language: str) -> List[Issue]:
             # Run all applicable patterns
             # Return matched issues
     ```

3. **`core/skill_scorer.py`**
   - **Purpose**: Calculate skill scores from detected issues
   - **Function**:
     ```python
     def calculate_scores(issues: List[Dict]) -> Dict[str, int]:
         scores = {"logic": 100, "security": 100, "performance": 100}
         
         for issue in issues:
             category = issue["category"]  # "SECURITY", "LOGIC", "PERFORMANCE"
             severity = issue["severity"]  # "CRITICAL", "HIGH", "MEDIUM", "LOW"
             
             deduction = {
                 "CRITICAL": 20,
                 "HIGH": 10,
                 "MEDIUM": 5,
                 "LOW": 2
             }[severity]
             
             scores[category.lower()] = max(0, scores[category.lower()] - deduction)
         
         return scores
     ```

4. **`core/mission_generator.py`**
   - **Purpose**: Generate mission descriptions
   - **Function**:
     ```python
     def generate_mission(issues: List[Dict], repo_name: str) -> Dict:
         # Input: List of related issues (e.g., all hardcoded secrets)
         # Output: {
         #   "title": "Secure Your Authentication Service",
         #   "description": "...",  # Multi-paragraph description
         #   "steps": [
         #     {"number": 1, "title": "Create .env file", "instructions": "..."},
         #     ...
         #   ],
         #   "acceptance_criteria": [...],
         #   "estimated_time": 30
         # }
         
         # Uses Gemini to generate natural language from templates
         prompt = f"""
         Generate a learning mission for fixing these code issues:
         {json.dumps(issues)}
         
         Repository: {repo_name}
         
         Format:
         - Title: Short, action-oriented
         - Description: Explain the problem and why it matters
         - Steps: 4-6 clear, actionable steps
         - Criteria: What makes this mission complete
         """
         
         response = gemini_client.generate(prompt)
         return parse_mission_response(response)
     ```

5. **`integrations/github_client.py`**
   - **Purpose**: Interact with GitHub API
   - **Functions**:
     ```python
     def clone_repository(repo_url: str, access_token: str) -> str:
         # Clone to /tmp/kodra_{repo_name}_{uuid}
         # Return local path
     
     def get_file_contents(repo_full_name: str, file_path: str, access_token: str) -> str:
         # GET /repos/{owner}/{repo}/contents/{path}
         # Return decoded content
     
     def post_pr_comment(pr_url: str, comment: str, access_token: str):
         # POST comment to PR
     ```

6. **`integrations/coderabbit_client.py`**
   - **Purpose**: Trigger CodeRabbit reviews
   - **Functions**:
     ```python
     def trigger_review(pr_url: str, custom_rules: List[str] = None) -> str:
         # POST to CodeRabbit API
         payload = {
             "pr_url": pr_url,
             "review_type": "comprehensive",
             "custom_instructions": custom_rules or []
         }
         response = requests.post(CODERABBIT_API + "/reviews", json=payload)
         return response.json()["review_id"]
     
     def get_review_status(review_id: str) -> Dict:
         # GET review results
         return requests.get(f"{CODERABBIT_API}/reviews/{review_id}").json()
     ```

7. **`integrations/oumi_rl_trainer.py`**
   - **Purpose**: Reinforcement learning for code analysis
   - **Functions**:
     ```python
     from oumi import RLTrainer, LLMAsJudge
     
     class KodraRLTrainer:
         def __init__(self):
             self.trainer = RLTrainer(model="oumi/base-model")
             self.judge = LLMAsJudge()
         
         def train_on_feedback(self, prediction: Dict, actual_outcome: Dict):
             # prediction: { "issue_type": "security", "confidence": 0.85 }
             # actual_outcome: { "was_real_issue": True, "user_fixed": True }
             
             reward = 1.0 if actual_outcome["was_real_issue"] else -0.5
             self.trainer.update(prediction, reward)
         
         def judge_solution(self, original_code: str, fixed_code: str, issue_type: str) -> Dict:
             prompt = f"""
             Original issue: {issue_type}
             Before: {original_code}
             After: {fixed_code}
             
             Did the fix properly address the issue? Grade: A/B/C/D/F
             """
             judgment = self.judge.evaluate(prompt)
             return {
                 "grade": judgment["grade"],
                 "explanation": judgment["reasoning"],
                 "properly_fixed": judgment["grade"] in ["A", "B"]
             }
     ```

8. **`api/routes/analyze.py`**
   - **Purpose**: Handle code analysis requests
   - **Endpoints**:
     ```python
     @app.route('/python/analyze', methods=['POST'])
     def analyze_repository():
         # Input: { "repo_url": "...", "access_token": "...", "user_id": 42 }
         data = request.json
         
         # 1. Clone repo
         repo_path = github_client.clone_repository(data["repo_url"], data["access_token"])
         
         # 2. Detect language (by file extensions)
         language = detect_language(repo_path)
         
         # 3. Analyze
         analysis_result = code_analyzer.analyze_repository(repo_path, language)
         
         # 4. Clean up
         shutil.rmtree(repo_path)
         
         # 5. Return
         return jsonify(analysis_result), 200
     ```

9. **`api/routes/assist.py`**
   - **Purpose**: Handle @Kodra assistance requests
   - **Endpoints**:
     ```python
     @app.route('/python/assist', methods=['POST'])
     def provide_assistance():
         # Input: AssistRequest (from Java backend)
         data = request.json
         
         # 1. Load user context
         user_level = get_user_skill_level(data["user_id"])
         mission_context = get_mission_context(data.get("mission_id"))
         
         # 2. Build prompt
         prompt = f"""
         You are a Senior Engineer mentoring {user_level} developer.
         
         Mission Context: {mission_context}
         
         Student's Code:
         ```{data["context"]["programmingLanguage"]}
         {data["context"]["fileContent"]}
         ```
         
         Student's Question: {data["question"]}
         
         Provide:
         1. Concise explanation (2-3 sentences)
         2. Code example specific to their file
         3. A mini practice exercise
         
         Keep it friendly and encouraging.
         """
         
         # 3. Call Gemini
         response = gemini_client.generate(prompt)
         
         # 4. Parse and structure
         assist_response = parse_assist_response(response)
         
         # 5. Log for RL training
         log_interaction(data["user_id"], data["question"], assist_response)
         
         return jsonify(assist_response), 200
     ```

10. **`api/routes/missions.py`**
    - **Purpose**: Generate missions via Kestra integration
    - **Endpoints**:
      ```python
      @app.route('/python/generate-missions', methods=['POST'])
      def generate_missions():
          # Input: { "user_id": 42, "analysis_results": [...] }
          data = request.json
          
          # 1. Extract all issues
          all_issues = []
          for analysis in data["analysis_results"]:
              all_issues.extend(analysis["issues"])
          
          # 2. Group by type and severity
          grouped = group_issues_by_type(all_issues)
          
          # 3. Generate mission for each group
          missions = []
          for group in grouped:
              mission = mission_generator.generate_mission(
                  issues=group["issues"],
                  repo_name=group["repo_name"]
              )
              missions.append(mission)
          
          return jsonify({"missions": missions}), 200
      ```

11. **`data/prompts/` (NEW DIRECTORY)**
    - **Files**:
      - `senior_engineer_system_prompt.txt`: Base personality for @Kodra
      - `mission_template.txt`: Template for generating missions
      - `explanation_template.txt`: Template for code explanations

---

### **FRONTEND (React)**

#### **Files to Delete**
1. ❌ **`src/components/Assessment.js`** (RIASEC test UI)
2. ❌ **`src/components/CareerAnalysis.js`** (Career match results)
3. ❌ **`src/components/MentorBooking.js`** (Human mentor scheduling)
4. ❌ **`src/components/CollegeExplorer.js`**
5. ❌ **`src/services/careerService.js`**

#### **Files to Keep (Minimal Changes)**

1. **`src/components/Auth/Login.js`**
   - ✏️ Change: Update branding (Ruvva → Kodra)
   - ✅ Keep: All login logic

2. **`src/components/Auth/Register.js`**
   - ✏️ Change: Branding only
   - ✅ Keep: Registration flow

3. **`src/components/Navbar.js`**
   - ✏️ Change: Update menu items:
     - OLD: "Assessments", "Careers", "Mentors"
     - NEW: "Dashboard", "Missions", "Progress"
   - ✏️ Change: Logo/title to "Kodra"

4. **`src/services/api.js`**
   - ✏️ Change: Update base URL endpoints
   - ✅ Keep: Axios configuration, interceptors

#### **Files to Modify**

1. **`src/components/LandingPage.js`** (MAJOR OVERHAUL)
   - **Current**: Career guidance pitch
   - **New**: Code-based learning pitch
   - **Changes**:
     - Hero section: "Turn Your Code Into Your Curriculum"
     - Features: Show 4 phases (Diagnosis → Curriculum → Mentorship → Exam)
     - CTA: "Connect GitHub & Get Your Code Health Report"
     - Demo video: Embed 2-minute demo
     - Social proof: "Join 1,000+ developers improving their code"

2. **`src/components/Chat.js`** (MODERATE CHANGES)
   - **Current**: Career counseling chatbot
   - **New**: Technical Q&A chatbot
   - **Changes**:
     - System message: "Ask Kodra anything about your code"
     - Add syntax highlighting for code blocks (use `react-syntax-highlighter`)
     - Add "Code Example" button that pre-fills with user's recent code
     - Change avatar icon from career counselor to robot/code symbol

#### **Files to Create (NEW)**

1. **`src/components/GitHubConnect.js`**
   - **Purpose**: GitHub OAuth connection flow
   - **UI Elements**:
     - Big "Connect GitHub" button (with GitHub logo)
     - Privacy notice: "We only read your code, never write"
     - Loading state during OAuth
     - Success animation after connection
   - **Flow**:
     ```javascript
     const handleConnect = () => {
       // Redirect to GitHub OAuth
       const githubAuthUrl = `https://github.com/login/oauth/authorize?
         client_id=${GITHUB_CLIENT_ID}&
         redirect_uri=${FRONTEND_URL}/callback&
         scope=repo&
         state=${generateCSRFToken()}`;
       
       window.location.href = githubAuthUrl;
     };
     ```

2. **`src/components/GitHubCallback.js`**
   - **Purpose**: Handle OAuth redirect
   - **Flow**:
     ```javascript
     useEffect(() => {
       const urlParams = new URLSearchParams(window.location.search);
       const code = urlParams.get('code');
       
       if (code) {
         // Send to backend
         api.post('/kodra/github/auth', { code })
           .then(response => {
             // Store analysis job ID
             setJobId(response.data.analysisJobId);
             // Start polling for analysis completion
             startPolling(response.data.analysisJobId);
           });
       }
     }, []);
     
     const startPolling = (jobId) => {
       const interval = setInterval(() => {
         api.get(`/kodra/github/sync-status/${jobId}`)
           .then(response => {
             setProgress(response.data.progress);
             if (response.data.status === 'COMPLETED') {
               clearInterval(interval);
               navigate('/dashboard');
             }
           });
       }, 2000); // Poll every 2 seconds
     };
     ```

3. **`src/components/Dashboard/CodeHealthDashboard.js`**
   - **Purpose**: Main dashboard showing code health
   - **UI Sections**:
     ```
     ┌─────────────────────────────────────────┐
     │  OVERALL SCORES (Radial Chart)          │
     │    Logic: 80%                            │
     │    Security: 45%                         │
     │    Performance: 65%                      │
     └─────────────────────────────────────────┘
     

### **COMPLETION OF: Kodra Implementation Blueprint**

---

#### **3. `src/components/Dashboard/CodeHealthDashboard.js` (Continued)**

* **UI Sections (continued):**
    * **CRITICAL ISSUES LIST (Table/List)**
        * **Header:** "Immediate Attention Needed"
        * **Row:** Issue Type (e.g., "Hardcoded Secret") | Severity (Red Badge) | File Location (`src/config.js:42`)
        * **Action:** "Fix Now" button (Deep links to specific Mission).
    * **PERSONALIZED CTA (Banner)**
        * **Text:** Dynamic message based on lowest score (e.g., *"Alex, your Logic is strong (80%), but Security (20%) puts your app at risk. Let's fix that first."*).
        * **Button:** "Start Mission 1: Secure Authentication" (Links to `/missions/101`).

**4. `src/components/Missions/MissionsList.js` (NEW)**
* **Purpose:** Lists all generated missions, differentiating between unlocked and locked tasks.
* **Logic:**
    * Fetch missions from `/api/kodra/missions/{userId}`.
    * Sort by `status` (IN_PROGRESS > PENDING > LOCKED) and `severity`.
* **UI Elements:**
    * **Mission Card:**
        * Title: "Secure Your Authentication Service"
        * Tags: `CRITICAL`, `Security`, `30 mins`
        * Status Icon: 🔓 Unlocked or 🔒 Locked (greyed out).
        * Progress Bar: If `IN_PROGRESS`.

**5. `src/components/Missions/MissionDetail.js` (NEW)**
* **Purpose:** The core learning interface where Alex reads instructions and starts work.
* **Logic:**
    * Fetch details from `/api/kodra/missions/{userId}/{missionId}`.
    * Handle "Start Mission" (API POST).
    * Handle "Submit for Review" (API POST with PR URL).
* **UI Sections:**
    * **The "Why":** Explanation of the vulnerability found in Alex's specific code.
    * **The "How" (Step-by-Step):** Accordion list of steps (e.g., "1. Create .env", "2. Update config").
    * **Code Assistant:** Floating button "Ask Kodra" (opens `Chat.js` with mission context pre-loaded).
    * **Submission:** Input field for GitHub Pull Request URL.

**6. `src/components/Progress/SkillChart.js` (NEW)**
* **Purpose:** Visualizes improvement over time.
* **Library:** Recharts or Chart.js.
* **Data:** Fetches from `/dashboard/{userId}/history`.
* **Visualization:** Line chart showing Logic/Security/Performance scores trending upward as missions are completed.

---

### **6. Complete Data Flow**

This section outlines how data travels through the completed system architecture.

**A. The "Diagnosis" Flow (Ingestion)**
1.  **User (Frontend):** Clicks "Connect GitHub".
2.  **Backend (Java):** Exchanges OAuth code for Access Token.
3.  **Backend:** Fetches repository list and clones source code to a secure temp volume.
4.  **Backend → Python Service:** Sends path to cloned code.
5.  **Python Service:**
    * Runs regex/AST analysis scanners.
    * Calculates raw metrics (Cyclomatic complexity, OWASP vulnerabilities).
    * Returns JSON payload (`{ "issues": [...], "scores": {...} }`).
6.  **Backend:** Saves `CodeAnalysis` entity and triggers `Kestra`.

**B. The "Curriculum" Flow (Generation)**
1.  **Backend → Kestra:** Triggers `kodra-mission-prioritizer` workflow with analysis JSON.
2.  **Kestra (AI Agent):**
    * Aggregates issues by category.
    * Uses LLM to generate narrative titles and descriptions.
    * Orders missions by severity.
3.  **Kestra → Backend:** Webhook creates `Mission` entities.

**C. The "Mentorship" Flow (Interaction)**
1.  **User (IDE/Cline):** Asks "@Kodra help me with env vars".
2.  **Cline → Backend:** Sends code context + question.
3.  **Backend → Python Service:** Forwards request.
4.  **Python Service:**
    * Retrieves "Senior Engineer" system prompt.
    * Generates explanation + code snippet via Gemini.
5.  **Python → Backend → IDE:** User sees the answer in their editor.

**D. The "Exam" Flow (Validation)**
1.  **User (GitHub):** Opens a Pull Request.
2.  **GitHub → Backend:** Webhook (`pr.opened`).
3.  **Backend → CodeRabbit:** Triggers AI Code Review with mission-specific instructions.
4.  **CodeRabbit → GitHub:** Posts comments on the PR.
5.  **CodeRabbit → Backend:** Webhook (`review.completed`).
6.  **Backend:**
    * Parses review result (Fixed/Not Fixed).
    * Updates `SkillHistory` (+Score).
    * Unlocks next mission.
    * Sends WebSocket message to Frontend ("Score Updated!").

---

### **7. Internal Workflow Deep Dive (Kestra)**

**Workflow ID:** `kodra-mission-prioritizer`
**Trigger:** Webhook from Java Backend (Post-Analysis).

1.  **Task 1: `aggregate_issues` (Python Script)**
    * Input: Raw issue list (e.g., 50 instances of "Missing Docstring", 3 instances of "SQL Injection").
    * Logic: Groups by pattern. Discards low-priority noise if critical security flaws exist.
2.  **Task 2: `generate_mission_content` (LLM Task)**
    * Input: Grouped issues.
    * Prompt: "Create a gamified mission title and 5-step guide for a developer to fix [SQL Injection] in [Node.js]."
    * Output: Structured JSON (Title, Description, Steps).
3.  **Task 3: `persist_missions` (HTTP Request)**
    * Action: POST /api/kodra/internal/missions/batch
    * Payload: List of generated missions tied to the User ID.

---

### **8. Expected Inputs & Outputs**

| Component | Input | Output |
| :--- | :--- | :--- |
| **Java Backend** | GitHub OAuth Code | JWT, User Profile, Sync Status |
| **Python Analysis** | Local Repo Path | JSON: Scores (0-100), Issue List |
| **Mission Engine** | Issue List | List of Mission Objects (Title, Steps, XP) |
| **AI Assistant** | User Question + File Context | Markdown Explanation + Code Snippet |
| **CodeRabbit** | PR URL + Mission Rules | Review Status (Pass/Fail) + Comments |

---

### **Details Overview: What Was Added & Why**

To complete the blueprint, I focused on closing the loop between **User Action** and **System Feedback**, ensuring the "Gamified Career Architect" promise is technically viable.

1.  **Frontend Completion (`MissionsList`, `MissionDetail`):**
    * **Why:** The original file stopped at the Dashboard. The user needs screens to actually *do* the work.
    * **Key Detail:** Added the **"Submission"** logic (PR URL), which is the critical handover point to the automated grading system.

2.  **Integration of Kestra (Workflow Orchestration):**
    * **Why:** Generating high-quality, personalized curriculums is too complex for a synchronous API call.
    * **Additions:** Defined the `kodra-mission-prioritizer` workflow to asynchronously handle the heavy lifting of sorting thousands of code issues into a coherent learning path.

3.  **Feedback Loop (WebSockets & CodeRabbit):**
    * **Why:** To make the platform feel "alive" (like a real mentor), feedback must be instant.
    * **Additions:** Added WebSocket logic to the backend and `MissionProgress` frontend component. Added the `CodeRabbit` integration service to act as the "Exam Proctor," automatically verifying if the user actually learned the skill.

4.  **Database Entities (`CodeAnalysis`, `Mission`, `SkillHistory`):**
    * **Why:** The original schema was generic (Users/Careers).
    * **Additions:** Designed specific entities to track *technical debt* and *learning progress*, enabling the "Logic/Security/Performance" score visualization.

5.  **Python AI Service Pivot:**
    * **Why:** The previous Python service was for "Career Recommendations" (matching profiles to jobs).
    * [cite_start]**Additions:** Refactored it into a **"Code Analysis Engine"**, utilizing regex/AST parsing and LLMs for technical mentorship rather than just job matching. [cite: 57-62]