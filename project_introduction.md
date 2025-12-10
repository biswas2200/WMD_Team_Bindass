# Kodra.ai - Project Introduction & Implementation Plan
**For WeMakeDevs AntiGravity Hackathon 2025**

---

## 📌 Executive Summary

**Kodra.ai** is an Autonomous Career Agent that transforms how developers learn by turning their existing code into personalized learning curriculum. Unlike passive learning platforms, Kodra actively connects to your GitHub, diagnoses your code weaknesses, and creates targeted missions to improve your skills through your own projects.

**One-Line Pitch:**  
*"Kodra is the first learning platform that builds your curriculum by reviewing the code you've already written."*

---

## 🎯 What We're Building

### The Core Product
A multi-agent AI system that:
1. **Diagnoses** your coding skills by analyzing your GitHub repositories
2. **Prescribes** personalized learning missions based on your actual code issues
3. **Mentors** you through fixes using AI pair programming
4. **Validates** your improvements through automated code review
5. **Tracks** your skill growth over time

### The User Experience (The "Alex" Story)

**Phase 1 - The Diagnosis (2 minutes):**
- Alex connects his GitHub account via OAuth
- Kodra autonomously scans his last 5 repositories
- Dashboard reveals: "Logic: 80% ✅ | Security: 20% ⚠️ | Performance: 65%"
- Personalized insight: "Alex, you're exposing API keys in 3 repos and have SQL injection risks"

**Phase 2 - The Curriculum (30 seconds):**
- Kodra generates prioritized missions
- Mission 1: "Secure Your Authentication Service"
- Clear task: "Refactor auth-service to use Environment Variables"

**Phase 3 - The Mentorship (5 minutes):**
- Alex opens VS Code to fix the code
- Gets stuck, types: `@Kodra teach me about environment variables`
- Kodra explains the concept + provides code example + mini-exercise

**Phase 4 - The Exam (2 minutes):**
- Alex pushes fix to GitHub via Pull Request
- CodeRabbit reviews automatically
- Dashboard updates in real-time: Security 20% → 45% (+25%)
- Achievement unlocked: "First Security Fix!" 🎉

---

## 🏗️ Technical Architecture

### Technology Stack

**Backend (Java Spring Boot):**
- User authentication & authorization (JWT)
- GitHub OAuth integration
- RESTful API endpoints
- Database management (PostgreSQL)
- Webhook handling (GitHub + CodeRabbit)

**AI Engine (Python + Flask):**
- Code analysis using pattern detection (regex + AST parsing)
- Gemini AI integration for explanations
- Oumi library for reinforcement learning
- Mission generation logic

**Frontend (React):**
- Landing page & authentication
- GitHub connection flow
- Code Health Dashboard (interactive charts)
- Missions management interface
- AI chat assistant

**Integrations:**
- **GitHub API** - Repository access & webhooks
- **Cline CLI** - Developer assistance in IDE
- **Kestra** - Workflow orchestration & AI agent
- **CodeRabbit** - Automated code review
- **Oumi** - RL fine-tuning for code analysis
- **Vercel** - Frontend deployment

---

## 🔧 What We're Transforming

### From Existing Project (Ruvva)
We're repurposing an existing career guidance platform:
- **Keep:** Authentication system, database layer, API structure
- **Transform:** Career assessments → Code analysis
- **Transform:** Career recommendations → Learning missions
- **Transform:** Mentor matching → AI pair programming
- **Delete:** Career/college databases, RIASEC tests

### New Components to Build

**Backend (9 new files):**
- `CodeAnalysis.java` - Entity for analysis results
- `Mission.java` - Entity for learning missions
- `SkillHistory.java` - Entity for progress tracking
- `DashboardController.java` - Serve dashboard data
- `MissionController.java` - Manage missions
- `WebhookController.java` - Handle GitHub/CodeRabbit events
- `GitHubService.java` - GitHub API integration
- `CodeHealthService.java` - Score calculations
- `CodeRabbitService.java` - CodeRabbit integration

**Python (3 new files):**
- `code_analyzer.py` - Main analysis engine (5 pattern types)
- `pattern_detector.py` - Anti-pattern detection rules
- `analyze.py` - API route for analysis requests

**Frontend (5 new files):**
- `GitHubConnect.js` - OAuth connection UI
- `GitHubCallback.js` - Handle OAuth redirect
- `CodeHealthDashboard.js` - Main dashboard with charts
- `MissionsList.js` - Display missions
- `MissionDetail.js` - Full mission view

---

## 📊 Data Flow Summary

```
User → GitHub OAuth → Backend stores token
                    ↓
Backend → Python: "Analyze repos"
                    ↓
Python: Clone repos → Detect patterns → Calculate scores
                    ↓
Backend: Save analysis → Generate missions → Return dashboard
                    ↓
User: See scores → Start mission → Fix code → Push PR
                    ↓
GitHub Webhook → Backend → CodeRabbit review
                    ↓
Backend: Recalculate scores → Update dashboard → Notify user
```

---

## 🎖️ Hackathon Prize Alignment

### Qualifying for All 5 Sponsor Prizes ($15,000 Total)

**1. Infinity Build Award ($5,000) - Cline CLI**
- Building @Kodra assistant using Cline
- Automates code explanation and exercise generation
- Complete working tool for developer mentorship

**2. Wakanda Data Award ($4,000) - Kestra**
- AI Agent summarizes code issues across repos
- Makes decisions: prioritizes missions by severity
- Orchestrates analysis workflows

**3. Iron Intelligence Award ($3,000) - Oumi**
- Uses RL fine-tuning to improve pattern detection
- LLM-as-a-Judge evaluates solution quality
- Learns from user feedback

**4. Stormbreaker Deployment Award ($2,000) - Vercel**
- Frontend deployed live at kodra.vercel.app
- Fully functional demo accessible to judges

**5. Captain Code Award ($1,000) - CodeRabbit**
- Integrated as automated code reviewer
- Validates all mission completions
- Activity visible in demo repository

### Theme Alignment: "Next Generation Intelligent Agents"
- ✅ Autonomous system (auto-scans, auto-generates missions)
- ✅ Reasoning (prioritizes issues, decides learning path)
- ✅ Learning (RL fine-tuning improves over time)
- ✅ Multi-agent coordination (GitHub + Cline + Kestra + CodeRabbit + Oumi)
- ✅ Real-time data (live PR reviews, instant score updates)

---

## 📅 3-Day Implementation Timeline

### Day 0: Core Functionality
**Day :** Backend setup (entities, controllers, GitHub OAuth)  
**Day :** Python analysis engine (pattern detection, scoring)  
**Day :** Frontend (GitHub connect, dashboard, mission views)  
**Day :** Integration testing & bug fixes

### Day 1: Demo & Polish
**Day :** Mission system (generation, detail views)  
**Day :** Demo preparation (test repos, demo video)  
**Day :** Sponsor integrations (Cline, Kestra, CodeRabbit, Oumi, Vercel)  
**Day :** Final testing, pitch practice, documentation

### Final Day: Pitch & Documentation
**Day :** Final pitch, documentation, and final testing
---

## 🎯 MVP Scope (What We're Actually Building)

### ✅ Must-Have Features
1. GitHub OAuth connection
2. Code analysis (5 pattern types: hardcoded secrets, SQL injection, exposed passwords, missing error handling, console.log)
3. Dashboard with 3 metrics (Logic, Security, Performance)
4. Mission generation (3 missions per user)
5. Mission detail view with step-by-step guide
6. Basic webhook handling for PR events

### ⭐ Simplified for MVP
1. Web chatbot instead of full Cline CLI integration
2. Manual CodeRabbit trigger (not fully automated)
3. Polling for updates (not WebSocket)
4. Hardcoded mission templates (not AI-generated)
5. JavaScript repositories only

### ❌ Post-MVP Features
1. Historical progress charts
2. Achievement badges
3. Full Oumi RL training
4. Multi-language support
5. Mobile responsive design

---

## 🎬 Demo Strategy

### 2-Minute Demo Script

**[0:00-0:30] The Hook**
- Show landing page
- "Most platforms ask: What do you want to learn?"
- "Kodra asks: Show me your code."
- Click "Connect GitHub"

**[0:30-1:00] The Diagnosis**
- Analysis animation
- Dashboard reveal: Security 20% ⚠️
- "You're exposing API keys in 3 repos"

**[1:00-1:30] The Curriculum & Mentorship**
- Mission appears: "Secure Your Authentication Service"
- Show @Kodra assistant explaining concept
- Show code fix

**[1:30-2:00] The Exam & Growth**
- PR created → CodeRabbit reviews
- Dashboard updates: Security 20% → 45%
- Confetti animation 🎉
- "Alex leveled up!"

### Success Metrics
- Zero crashes during demo
- At least one "wow" from judges
- Questions about business model
- Other teams asking about project
- All sponsor requirements visible

---

## 💡 Why This Wins

### Innovation
- **Novel Approach:** Learning from your own code (not generic tutorials)
- **Multi-Agent System:** 5 AI agents working together
- **Proactive Learning:** System intervenes when you're stuck

### Technical Complexity
- **Full-Stack:** Java backend + Python AI + React frontend
- **Multiple Integrations:** GitHub, Cline, Kestra, CodeRabbit, Oumi
- **Real-Time System:** Webhooks, analysis pipelines, live updates

### Real-World Impact
- **Solves Actual Problem:** Developers waste hours on irrelevant tutorials
- **Measurable Results:** Track skill improvement over time
- **Scalable:** Works for any developer with GitHub repos

### Memorable Demo
- **Emotional Story:** Follow "Alex" improving his security skills
- **Visual Impact:** Dashboard with dramatic score reveals
- **Relatable:** Every developer has written bad code

---

## 📝 Deliverables Checklist

### Required Submissions
- [x] GitHub Repository (public, clean commit history)
- [x] README.md (setup instructions, architecture, sponsor usage)
- [x] Demo Video (2 minutes, hosted on YouTube/Loom)
- [x] Live Deployment (kodra.vercel.app)

### Documentation
- [x] API documentation (key endpoints)
- [x] Architecture diagram (data flow)
- [x] Sponsor technology usage explanation
- [x] Setup guide for local development
- [x] Demo account credentials

### Sponsor Requirements
- [x] Cline CLI usage documented
- [x] Kestra workflow visible
- [x] Oumi library imported
- [x] Vercel deployment live
- [x] CodeRabbit activity in PRs

---

## 🎓 Key Differentiators

### vs. GitHub Copilot
"Copilot writes code FOR you. Kodra teaches you to write code BETTER."

### vs. Udemy/Coursera
"They offer generic courses. We analyze YOUR code and fix YOUR mistakes."

### vs. Code Review Tools
"They find bugs. We turn bugs into learning opportunities with guided missions."

### vs. ChatGPT for Coding
"ChatGPT waits for questions. Kodra proactively identifies what you need to learn."

---

## 🚀 What Happens Next

### Immediate Next Steps (Once Approved)
1. Set up development environment
2. Create demo GitHub account "Alex"
3. Build 5 test repositories with intentional issues
4. Start backend transformation (Day 1-2 tasks)
5. Set up sponsor accounts (GitHub OAuth, CodeRabbit, etc.)

### First Week Goals
- Working GitHub connection
- Code analysis returning scores
- Dashboard displaying results
- Basic mission system

### Second Week Goals
- Full demo flow working
- All sponsor integrations complete
- Demo video recorded
- Pitch perfected

---

## ✅ Go/No-Go Criteria

### We're Ready to Build When:
- [x] Clear understanding of MVP scope
- [x] All sponsor technologies researched
- [x] Demo flow scripted
- [x] Timeline is realistic
- [x] Team roles assigned

### We'll Win If:
- [x] Demo runs flawlessly (no crashes)
- [x] Judges understand concept in 30 seconds
- [x] All 5 sponsor requirements met
- [x] Technical depth is evident
- [x] Story is memorable

---

## 🎯 The Bottom Line

**We're building Kodra.ai:** An autonomous multi-agent system that turns your GitHub repositories into personalized coding bootcamps. By combining code analysis, AI mentorship, and automated validation, we're creating the first truly active learning platform for developers.

**Technical complexity + Clear value proposition + Memorable demo = Winning project.**

Ready to build? Let's turn code into curriculum. 🚀

---

*This document serves as the project brief for implementing Kodra.ai. It outlines what we're building, why it matters, and how we'll win the hackathon. All implementation details, file structures, and technical specifications are ready for execution.*