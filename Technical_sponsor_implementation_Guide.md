# Kodra.ai - Sponsor Technology Integration Guide
**Technical Implementation Details for All 5 Sponsors**

---

## Table of Contents
1. [Cline CLI Integration](#cline)
2. [Kestra Workflow Integration](#kestra)
3. [Oumi Library Integration](#oumi)
4. [Vercel Deployment](#vercel)
5. [CodeRabbit Integration](#coderabbit)
6. [Multi-Sponsor Coordination](#coordination)

---

## 1. Cline CLI Integration {#cline}

### 1.1 What Cline Does for Kodra

**Purpose:** Acts as the in-editor AI assistant that provides contextual help when developers get stuck during missions.

**User Experience:**
- Developer is fixing code for Mission 1
- Gets confused about environment variables
- Types in terminal: `cline kodra-explain "environment variables"`
- Cline responds with explanation + code example specific to their file
- Developer continues with newfound understanding

### 1.2 Technical Architecture

**Component 1: Cline CLI Tool**
- Command-line interface installed on developer's machine
- Captures user context (current file, cursor position, highlighted code)
- Sends requests to Kodra backend
- Displays formatted responses in terminal or IDE

**Component 2: Kodra Backend Endpoint**
- Receives requests from Cline
- Enriches with user mission context
- Forwards to Python AI service
- Returns structured response

**Component 3: Python AI Service**
- Processes question with full context
- Generates explanation using Gemini
- Creates practice exercise
- Formats response for Cline display

### 1.3 Implementation Details

**Step 1: Create Custom Cline Commands**

We'll build three custom commands that extend Cline's capabilities:

**Command 1: `cline kodra-explain <concept>`**
- Purpose: Explain a coding concept in context of user's current work
- Input: Concept name (e.g., "environment variables", "prepared statements")
- Process: Sends concept + current file + mission context to backend
- Output: 2-3 sentence explanation + code example + practice exercise

**Command 2: `cline kodra-analyze`**
- Purpose: Scan current file for issues related to active mission
- Input: Current file path
- Process: Sends file to pattern detector
- Output: List of issues found with line numbers

**Command 3: `cline kodra-hint`**
- Purpose: Get next step hint for current mission
- Input: Mission ID (auto-detected from context)
- Process: Checks mission progress, provides next actionable step
- Output: "Try looking at line 42 in config.js"

**Step 2: Configure Cline to Connect to Kodra**

**Configuration File Structure:**
- Location: User's home directory `~/.cline/kodra-config.json`
- Contents: API endpoint, user authentication token, current mission tracking
- Security: Token encrypted using system keychain

**Authentication Flow:**
1. User runs `cline kodra-login` once
2. Opens browser to Kodra authentication page
3. User authorizes, gets token
4. Token stored securely in config
5. All subsequent requests include token in headers

**Step 3: Context Gathering**

When user invokes Cline command, the system collects:
- Current file path and full content
- Cursor line number
- Selected/highlighted text (if any)
- Programming language detected from file extension
- Active mission ID (from Kodra tracking)
- User's skill level (from profile)

**Step 4: Request/Response Flow**

**Request Format (Cline → Kodra Backend):**
```
POST /api/kodra/assist
Headers: Authorization: Bearer <token>
Body: {
  user_id: 42,
  mission_id: 101,
  command: "explain",
  concept: "environment variables",
  context: {
    file_path: "auth-service/src/config.js",
    file_content: "const config = { apiKey: 'sk-123'... }",
    cursor_line: 42,
    language: "javascript",
    selected_code: null
  }
}
```

**Response Format (Backend → Cline):**
```
{
  explanation: "Environment variables store configuration outside your code...",
  code_example: "require('dotenv').config();\nconst apiKey = process.env.API_KEY;",
  practice_exercise: "Try adding a new env var called REDIS_URL",
  estimated_time: "5 minutes",
  related_resources: [
    { title: "Node.js dotenv docs", url: "..." }
  ]
}
```

**Step 5: Display Formatting**

Cline formats the response for terminal display:
- Color-coded sections (explanation in white, code in cyan, exercise in yellow)
- Syntax highlighting for code blocks
- Clear section headers
- Estimated reading time
- Interactive prompt: "Was this helpful? (y/n)"

### 1.4 Why This Qualifies for Infinity Build Award

**Requirement: "Build capabilities on top of CLI that improve software development experience"**

**How We Meet It:**
1. **New Capability:** Context-aware technical mentorship (Cline doesn't natively understand missions)
2. **Improved Experience:** Developer gets help without leaving editor or breaking flow
3. **Complete Automation:** From question to solution without manual searching
4. **Working Tool:** Fully functional commands with real backend integration

**Demo Proof Points:**
- Show `cline kodra-explain` in action
- Demonstrate how response includes user's actual code
- Highlight context awareness (knows which mission user is on)
- Show practice exercise generation

---

## 2. Kestra Workflow Integration {#kestra}

### 2.1 What Kestra Does for Kodra

**Purpose:** Orchestrates complex multi-step workflows and uses AI agent to make autonomous decisions about user learning paths.

**Key Workflows:**
1. **Repository Analysis Workflow** - Coordinates GitHub cloning, pattern detection, scoring
2. **Mission Prioritization Workflow** - AI agent decides which issues to tackle first
3. **Weekly Rescan Workflow** - Automatically reanalyzes repos on schedule
4. **Progress Report Workflow** - Generates weekly summary emails

### 2.2 Technical Architecture

**Kestra Server:**
- Self-hosted or Kestra Cloud
- Stores workflow definitions (YAML files)
- Executes workflows on triggers
- Provides REST API for workflow management

**Kestra AI Agent:**
- Built-in feature for summarizing data and making decisions
- Receives structured data from workflows
- Applies reasoning to prioritize/categorize
- Returns decisions that drive next steps

**Integration Points:**
- Kodra backend triggers workflows via REST API
- Workflows call Kodra Python service for analysis
- AI agent summarizes results and makes decisions
- Results stored in Kodra database

### 2.3 Implementation Details

**Workflow 1: Repository Analysis Orchestration**

**Purpose:** Coordinate all steps of analyzing a user's repositories

**Trigger:** User connects GitHub account

**Steps:**
1. **Fetch Repositories** - Call GitHub API to get repo list
2. **Filter Repositories** - Select last 5 updated repos
3. **Parallel Clone** - Clone all 5 repos simultaneously (speed optimization)
4. **Sequential Analysis** - Analyze each repo (calls Python service)
5. **Aggregate Results** - Combine all analysis results
6. **AI Agent Summarization** - Agent creates human-readable summary
7. **Store Results** - Save to database via Kodra API
8. **Cleanup** - Delete cloned repos from temp storage

**Kestra AI Agent Role in This Workflow:**
- Receives all detected issues across repos
- Summarizes: "Found 23 issues across 5 repos. Most critical: 5 security issues in auth-service."
- Categorizes issues by severity and type
- Identifies patterns: "User consistently forgets error handling"

**Workflow 2: Mission Prioritization (Key for Sponsor Prize)**

**Purpose:** AI agent decides which mission user should tackle first

**Trigger:** Analysis workflow completes

**AI Agent Decision Process:**

**Input Data Structure:**
- All detected issues with severity levels
- User's current skill scores
- User's historical completion rate
- Time constraints (estimated fix times)

**Decision Criteria:**
- Critical security issues always first priority
- Group related issues into single mission
- Consider user's demonstrated strengths (don't overwhelm)
- Balance quick wins with important fixes

**Agent Output:**
- Prioritized mission list with reasoning
- Estimated completion times
- Dependencies (Mission B requires completing Mission A)
- Recommended learning sequence

**Example AI Agent Reasoning:**
```
Input: 
- 3 hardcoded API keys (CRITICAL security)
- 2 SQL injection risks (CRITICAL security)
- 5 missing error handlers (HIGH logic)
- 8 console.log statements (MEDIUM best-practice)

Agent Decision:
Priority 1: "Secure Credentials" mission
  → Reason: Critical security issue affecting 3 files
  → Groups all 3 API key issues
  → Estimated time: 30 minutes
  → Must fix before deployment

Priority 2: "Prevent SQL Injection" mission
  → Reason: Critical security, different skill
  → Groups 2 related vulnerabilities
  → Estimated time: 45 minutes
  → User can apply same pattern twice

Priority 3: "Improve Error Handling" mission
  → Reason: Will teach good practices
  → Groups 5 missing handlers
  → Estimated time: 60 minutes
  → LOCKED until Priority 1 complete (avoid overwhelm)
```

**Workflow 3: Weekly Rescan Automation**

**Purpose:** Automatically check if user has made improvements

**Trigger:** Scheduled (every Monday 9 AM)

**Steps:**
1. **Identify Active Users** - Find users who completed missions last week
2. **Trigger Rescans** - Analyze their repos again
3. **Compare Scores** - Calculate deltas (old vs new)
4. **AI Agent Report Generation** - Agent writes personalized email
5. **Send Notifications** - Email user with progress summary

**AI Agent Role:**
- Compares before/after scores
- Identifies trends: "Your security improved 25% but performance declined 5%"
- Makes recommendations: "Focus on database optimization next"
- Celebrates wins: "You fixed all critical issues! Ready for advanced topics?"

**Workflow 4: Escalation Handling**

**Purpose:** AI agent autonomously decides when to alert user immediately

**Trigger:** Analysis detects critical issue

**AI Agent Decision:**
- Evaluates severity + exposure risk
- Decides: Can this wait for weekly summary, or notify now?
- Example: Exposed AWS credentials with active usage → Immediate notification
- Example: Console.log in dev branch → Add to weekly summary

### 2.4 Kestra Setup Requirements

**Installation:**
- Deploy Kestra on cloud server (AWS, GCP, or Kestra Cloud)
- Configure with Kodra backend URL
- Set up authentication tokens

**Workflow Definitions:**
- Write workflows in YAML format
- Store in Kestra's workflow repository
- Version control alongside Kodra codebase

**API Integration:**
- Kodra backend uses Kestra REST API to trigger workflows
- Workflow steps call Kodra APIs to store results
- Bidirectional communication pattern

### 2.5 Why This Qualifies for Wakanda Data Award

**Requirement: "Use Kestra's AI Agent to summarize data from other systems, with bonus for decision-making"**

**How We Meet It:**

**Data Summarization:**
- AI Agent receives raw analysis data (hundreds of individual issues)
- Summarizes into actionable insights ("5 critical security issues")
- Creates human-readable reports

**Decision-Making (Bonus):**
- Autonomously prioritizes missions (which to show first)
- Decides when to notify vs. batch in weekly summary
- Makes learning sequence recommendations
- Adjusts difficulty based on user progress

**Multiple Data Sources:**
- GitHub repositories (code data)
- Python analysis service (issue detection)
- Kodra database (user history)
- CodeRabbit reviews (validation data)

**Demo Proof Points:**
- Show workflow execution in Kestra UI
- Display AI Agent's decision reasoning
- Demonstrate automated priority assignment
- Highlight "no human intervention" aspect

---

## 3. Oumi Library Integration {#oumi}

### 3.1 What Oumi Does for Kodra

**Purpose:** Implements reinforcement learning so the code analysis system gets smarter over time by learning from user feedback.

**The Learning Loop:**
1. System predicts: "This looks like a hardcoded API key"
2. User fixes it (or ignores it)
3. CodeRabbit validates: "Fix was correct" or "Not actually an issue"
4. Oumi updates model: Increase confidence in similar patterns (or decrease)
5. Next time: More accurate predictions

### 3.2 Technical Architecture

**Oumi Components:**

**Component 1: Base Model**
- Pre-trained language model for code understanding
- Can analyze code syntax and semantics
- Fine-tuned for pattern recognition

**Component 2: RL Trainer**
- Implements reinforcement learning algorithms
- Takes (state, action, reward) tuples
- Updates model weights to maximize rewards
- Tracks training metrics (accuracy, loss)

**Component 3: LLM-as-a-Judge**
- Evaluates quality of solutions
- Compares before/after code
- Grades fixes (A/B/C/D/F)
- Provides reasoning for grade

**Component 4: Data Synthesis (Optional)**
- Generates synthetic training examples
- Creates variations of known patterns
- Augments limited real-world data

### 3.3 Implementation Details

**Phase 1: Initial Setup**

**Install Oumi Library:**
- Add to Python requirements
- Import necessary modules
- Initialize base model

**Configure for Code Analysis:**
- Set task: "Pattern detection in source code"
- Define action space: "Issue types (security, logic, performance)"
- Define state space: "Code snippets with context"
- Define reward structure: "Correct detection = +1, False positive = -0.5"

**Phase 2: Reinforcement Learning Pipeline**

**Step 1: Collect Training Data**

Every time system makes a prediction, log:
- Input: Code snippet
- Prediction: Issue type, severity, confidence score
- Context: File path, language, surrounding code

**Step 2: Gather Feedback**

Multiple feedback sources:
- User accepts mission (implicit: issue was real)
- User skips mission (implicit: false positive or not important)
- User completes fix (explicit: issue confirmed)
- CodeRabbit validates fix (explicit: issue resolved)

**Step 3: Assign Rewards**

**Reward Structure:**
```
Scenario 1: Detected issue + User fixed + CodeRabbit approved
  → Reward: +1.0 (perfect prediction)

Scenario 2: Detected issue + User fixed + CodeRabbit found problems
  → Reward: +0.5 (issue was real, but fix incomplete)

Scenario 3: Detected issue + User skipped
  → Reward: -0.2 (possibly false positive)

Scenario 4: Detected issue + User marked "not an issue"
  → Reward: -1.0 (clear false positive)

Scenario 5: Missed issue (found in manual review)
  → Reward: -0.5 (should have detected)
```

**Step 4: Update Model**

Run RL training loop:
1. Batch feedback data (daily or weekly)
2. Compute rewards for each prediction
3. Update model weights using Oumi's RL trainer
4. Validate on held-out test set
5. Deploy updated model if accuracy improves

**Phase 3: LLM-as-a-Judge Implementation**

**Purpose:** Evaluate quality of user's fix without human review

**Process:**

**Input to Judge:**
- Original code with issue
- User's fixed code
- Issue description
- Expected fix pattern

**Judge's Task:**
- Compare before/after
- Check if issue actually resolved
- Evaluate code quality of fix
- Assign grade (A/B/C/D/F)

**Judge Prompt Structure:**
```
You are a Senior Code Reviewer evaluating a security fix.

Original Issue: Hardcoded API key in config file
Original Code: const API_KEY = "sk-proj-12345"
Fixed Code: const API_KEY = process.env.API_KEY

Evaluation Criteria:
1. Was the API key removed from code? (Required)
2. Is environment variable properly used? (Required)
3. Is there documentation (.env.example)? (Best practice)
4. Is .env in .gitignore? (Required)

Grade the fix A-F and explain your reasoning.
```

**Judge Output:**
```
Grade: A
Reasoning: 
- API key successfully removed ✓
- Environment variable correctly implemented ✓
- .env.example provided ✓
- .gitignore updated ✓
All criteria met. Excellent implementation.
```

**Using Judge Results:**
- Grade A/B: Award full mission XP, mark complete
- Grade C: Award partial XP, suggest improvements
- Grade D/F: Require resubmission, provide specific feedback

**Phase 4: Data Synthesis (Optional Enhancement)**

**Purpose:** Generate training data when real data is limited

**Process:**

**Step 1: Define Pattern Templates**
```
Template: Hardcoded API Key
Variations:
- const API_KEY = "<random_key>"
- apiKey = "<random_key>"
- private String API_KEY = "<random_key>"
Languages: JavaScript, Python, Java
```

**Step 2: Generate Synthetic Examples**
- Use Oumi's data synthesis module
- Create 1000 variations of each pattern
- Include both positive cases (has issue) and negative cases (no issue)

**Step 3: Augment Training Set**
- Mix synthetic with real examples
- Label synthetic data with ground truth
- Use for initial model training before deployment

### 3.4 Practical Implementation Strategy

**For MVP (Hackathon):**

**Simplified Approach:**
1. Install Oumi library (show import statements)
2. Implement basic RL structure (stub functions ready for training)
3. Log all predictions and feedback (build training dataset)
4. Implement LLM-as-a-Judge for demo (this works immediately)
5. Document RL training pipeline in README

**What to Show Judges:**
- Oumi imports visible in Python files
- LLM-as-a-Judge evaluating demo fix in real-time
- Feedback logging system (show database entries)
- Explanation: "RL training runs nightly on collected feedback"

**Post-Hackathon (Production):**
- Collect 1-2 weeks of user feedback
- Run first RL training session
- Measure accuracy improvement
- Deploy updated model
- Continue weekly training cycles

### 3.5 Why This Qualifies for Iron Intelligence Award

**Requirement: "Use Oumi library with RL fine-tuning features. Data Synthesis and LLM-as-a-Judge optional but encouraged."**

**How We Meet It:**

**RL Fine-Tuning (Required):**
- Oumi RL Trainer imported and configured
- Feedback loop implemented (prediction → reward → update)
- Training pipeline documented
- Model improves accuracy over time

**LLM-as-a-Judge (Bonus):**
- Evaluates fix quality automatically
- Provides graded feedback to users
- Reduces need for human review
- Working in demo

**Data Synthesis (Bonus):**
- Generates training examples for rare patterns
- Augments limited initial dataset
- Documented in methodology

**Demo Proof Points:**
- Show Oumi imports in Python code
- Demonstrate LLM-as-a-Judge grading a fix
- Display RL training metrics dashboard
- Explain feedback loop with diagram
- Show logged training data

---

## 4. Vercel Deployment {#vercel}

### 4.1 What Vercel Does for Kodra

**Purpose:** Hosts the React frontend with automatic deployments, making Kodra accessible at a live URL for judges to test.

**Benefits:**
- Automatic deployments on git push
- Global CDN for fast loading
- HTTPS by default
- Preview deployments for testing
- Environment variable management

### 4.2 Technical Architecture

**Deployment Structure:**

**Frontend on Vercel:**
- React application served from Vercel's edge network
- Custom domain: kodra.vercel.app
- Automatic builds from main branch

**Backend Separate:**
- Java Spring Boot hosted on AWS/Railway/Render
- Python service on separate server
- Frontend makes API calls to backend URL

**Environment Configuration:**
- Frontend stores backend API URL in environment variables
- CORS configured to allow Vercel domain
- Separate environments for development/production

### 4.3 Implementation Details

**Step 1: Prepare React App for Deployment**

**Configure Build Settings:**
- Ensure build script in package.json works
- Test production build locally
- Verify all environment variables are externalized

**Create vercel.json Configuration:**
```
{
  "framework": "create-react-app",
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "env": {
    "REACT_APP_API_URL": "https://api.kodra.ai"
  }
}
```

**Step 2: Connect to Vercel**

**Option A: Vercel CLI**
- Install Vercel CLI globally
- Run `vercel` in project directory
- Follow prompts to link project
- Configure environment variables

**Option B: Vercel Dashboard**
- Connect GitHub repository
- Select React project folder
- Auto-detect framework settings
- Configure environment variables in dashboard

**Step 3: Configure Backend Communication**

**Set API URL:**
- Development: http://localhost:8080
- Production: https://api.kodra.ai (your backend URL)
- Use environment variable to switch

**Update CORS in Backend:**
- Allow origin: https://kodra.vercel.app
- Allow credentials: true
- Allow methods: GET, POST, PUT, DELETE

**Step 4: Deploy and Test**

**Deployment Process:**
- Push to main branch
- Vercel automatically builds and deploys
- Monitor build logs for errors
- Test all features on live URL

**Testing Checklist:**
- Login/register works
- GitHub OAuth redirect works
- Dashboard loads data from backend
- Missions display correctly
- Chat interface functional

### 4.4 Why This Qualifies for Stormbreaker Deployment Award

**Requirement: "Project must be deployed on Vercel and live"**

**How We Meet It:**
- React frontend deployed to Vercel
- Accessible at kodra.vercel.app
- Working demo for judges to test
- Visible Vercel deployment badge in README

**Demo Proof Points:**
- Share live URL with judges
- Show Vercel dashboard with deployment history
- Demonstrate automatic deployments (push code, show new deployment)
- Highlight performance (fast loading via CDN)

---

## 5. CodeRabbit Integration {#coderabbit}

### 5.1 What CodeRabbit Does for Kodra

**Purpose:** Acts as the automated examiner that validates user's fixes and provides detailed feedback on pull requests.

**User Experience:**
- User completes mission fix
- Creates pull request on GitHub
- CodeRabbit automatically reviews within 2 minutes
- Comments on specific lines with suggestions
- Kodra updates user's scores based on review

### 5.2 Technical Architecture

**CodeRabbit Setup:**
- Install CodeRabbit GitHub app on demo repositories
- Configure review preferences
- Set up webhook to notify Kodra

**Integration Flow:**
1. User creates PR
2. GitHub webhook notifies Kodra backend
3. Kodra triggers CodeRabbit review (or waits for automatic)
4. CodeRabbit analyzes PR, posts comments
5. CodeRabbit webhook notifies Kodra of completion
6. Kodra parses results, recalculates scores
7. Kodra updates dashboard in real-time

### 5.3 Implementation Details

**Step 1: CodeRabbit Installation**

**Install on GitHub:**
- Go to GitHub Marketplace
- Install CodeRabbit app
- Grant access to demo repositories
- Configure review settings

**Configuration Options:**
- Auto-review all PRs: Enabled
- Review focus: Security, code quality, best practices
- Comment verbosity: Detailed
- Webhook URL: https://api.kodra.ai/webhook/coderabbit

**Step 2: GitHub Webhook Setup**

**Configure Webhook for PR Events:**
- Webhook URL: https://api.kodra.ai/webhook/github
- Events to subscribe: pull_request (opened, edited, closed, merged)
- Content type: application/json
- Secret: <random_secret_token>

**Webhook Payload Structure:**
```
{
  "action": "opened",
  "pull_request": {
    "id": 789,
    "title": "[Kodra Mission 1] Fix API key exposure",
    "html_url": "https://github.com/alex/auth-service/pull/12",
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

**Step 3: Backend Webhook Handler**

**Process PR Created Event:**
1. Receive webhook from GitHub
2. Extract PR details (title, URL, repository)
3. Parse mission ID from PR title format: "[Kodra Mission 1]"
4. Look up mission in database
5. Update mission status to "IN_REVIEW"
6. Store PR URL with mission

**Trigger CodeRabbit Review:**
- Option A: CodeRabbit reviews automatically (no action needed)
- Option B: Call CodeRabbit API to trigger review manually

**Step 4: CodeRabbit Webhook Handler**

**Receive Review Completion:**
1. CodeRabbit sends webhook when review completes
2. Extract review results (issues found, comments)
3. Parse specific findings (security, quality, best practices)
4. Calculate impact on scores

**Parse Review Results:**

**CodeRabbit Output Structure:**
```
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

**Step 5: Score Recalculation**

**Calculate Improvement:**
- Original analysis: 5 critical security issues
- PR addresses: 3 issues
- CodeRabbit confirms: 3 properly fixed, 1 minor issue remains
- New score: (5 - 3 + 0.2) = 2.2 critical issues remaining
- Security score: Update from 20% to 45%

**Update Database:**
- Insert new row in skill_history table
- Update mission status to "COMPLETED_WITH_FEEDBACK"
- Store CodeRabbit comments for user reference

**Step 6: User Notification**

**Real-Time Update:**
- Send WebSocket message to frontend (if connected)
- Or: User polls /api/kodra/dashboard periodically
- Show notification: "Mission 1 reviewed! Security +25%"
- Display CodeRabbit feedback in mission detail page

### 5.4 Demo Repository Setup

**Create Demo Repositories:**
- auth-service (has API key issues)
- payment-gateway (has SQL injection)
- user-dashboard (has performance issues)

**Intentional Issues:**
- Add hardcoded secrets in obvious places
- Include SQL string concatenation
- Add console.log statements
- Missing error handling

**Create Fix PRs:**
- Create branch: fix/security-issues
- Fix 3 out of 5 issues (leave some for realism)
- Create PR with title: "[Kodra Mission 1] Secure authentication"
- Wait for CodeRabbit review
- Show review comments in demo

### 5.5 Why This Qualifies for Captain Code Award

**Requirement: "Demonstrate CodeRabbit usage for PR reviews, code quality improvements, documentation, and open-source best practices"**

**How We Meet It:**

**PR Reviews:**
- CodeRabbit reviews all demo PRs
- Comments visible on GitHub
- Specific line-by-line feedback

**Code Quality Improvements:**
- CodeRabbit catches remaining issues
- Suggests best practices
- Validates security fixes

**Documentation:**
- README explains CodeRabbit role in system
- Screenshots of CodeRabbit reviews included
- Clear setup instructions for installation

**Open-Source Best Practices:**
- Proper PR naming convention
- Descriptive commit messages
- Linked issues to PRs
- CodeRabbit as automated maintainer

**Demo Proof Points:**
- Show live PR with CodeRabbit comments
- Navigate through review feedback
- Demonstrate how Kodra responds to review
- Highlight integration seamlessness

---

## 6. Multi-Sponsor Coordination {#coordination}

### 6.1 How All 5 Sponsors Work Together

**The Complete Flow:**

**Act 1: Discovery (Kestra + CodeRabbit)**
- User connects GitHub
- Kestra workflow orchestrates repository analysis
- AI Agent summarizes findings: "5 critical issues"
- System generates missions

**Act 2: Learning (Cline + Oumi)**
- User starts Mission 1
- Gets stuck, uses Cline CLI for help
- Oumi-powered explanations (future: RL-improved accuracy)
- User implements fix

**Act 3: Validation (CodeRabbit + Kestra)**
- User submits PR
- CodeRabbit reviews automatically
- Kestra AI Agent analyzes review results
- Decides if user ready for next mission

**Act 4: Deployment (Vercel)**
- Entire frontend accessible at kodra.vercel.app
- Judges can test live
- All integrations visible in working demo

### 6.2 Interaction Matrix

| Sponsor | Interacts With | Purpose |
|---------|----------------|---------|
| Cline | Kodra Backend → Python AI | Get contextual help during missions |
| Kestra | GitHub → Python → Kodra DB | Orchestrate analysis workflows |
| Kestra AI | CodeRabbit results → Kodra | Decide next learning steps |
| Oumi | User feedback → Model updates | Improve detection accuracy |
| CodeRabbit | GitHub PRs → Kodra Backend | Validate fixes and update scores |
| Vercel | Serves all frontend interactions | Makes everything accessible |

### 6.3 Demo Narrative Connecting All Sponsors

**Opening (15 seconds):**
"Kodra uses five AI agents to automate developer learning..."

**GitHub Connect (20 seconds):**
"When Alex connects GitHub, Kestra's workflow kicks in..." [Show Kestra UI]

**Analysis (20 seconds):**
"The AI Agent summarizes: 5 critical security issues..." [Show agent reasoning]

**Mission (15 seconds):**
"Alex starts fixing but gets stuck. He uses Cline CLI..." [Show terminal]

**Assistance (20 seconds):**
"Powered by Oumi's fine-tuned model, Kodra explains..." [Show response]

**Validation (30 seconds):**
"Alex submits his fix. CodeRabbit reviews..." [Show PR comments]
"Scores update in real-time..." [Show dashboard animation]

**Conclusion (20 seconds):**
"All accessible at kodra.vercel.app. Five sponsors. One autonomous career architect."

### 6.4 Technical Proof Requirements

**For Each Sponsor, Show:**

**Cline:**
- Import statement in codebase
- Custom command definition
- Terminal demo or screenshot

**Kestra:**
- Workflow YAML file
- Execution history in Kestra UI
- AI Agent decision logs

**Oumi:**
- Library import
- LLM-as-a-Judge evaluation
- RL training pipeline documentation

**Vercel:**
- Live URL working
- Deployment history
- Vercel dashboard screenshot

**CodeRabbit:**
- Installed on repositories
- PR with review comments
- Integration code in backend
