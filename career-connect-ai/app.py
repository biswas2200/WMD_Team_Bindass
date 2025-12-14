# career-connect-ai/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from services.code_analyzer import CodeAnalyzer
import os

# NEW imports (local files we added)
from oumi_integration import OU_MI
from logger_utils import log_prediction, log_reward

app = Flask(__name__)
CORS(app)

analyzer = CodeAnalyzer()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "Kodra AI Analysis Engine"})

@app.route('/analyze', methods=['POST'])
def analyze_code():
    """
    Analyzes provided code snippets or mock repo.
    Input: { "files": { "filename.java": "content..." } }
    Output: JSON with scores and issues.
    """
    data = request.json
    files = data.get('files', {})
    
    if not files:
        return jsonify({"error": "No files provided"}), 400
        
    results = analyzer.analyze_repo(files)
    return jsonify(results)

# ---------- NEW: Predict endpoint (logs prediction) ----------
@app.route('/predict', methods=['POST'])
def predict():
    """
    Accepts: { "code": "<code snippet>", "file": "path" }
    Returns: detected issue(s) and confidence and logs prediction for Oumi pipeline.
    """
    data = request.json or {}
    code = data.get("code", "")
    file_path = data.get("file", "unknown")

    # Use existing analyzer to get issues (adapt as needed)
    try:
        # prefer an analyze_snippet method if available
        if hasattr(analyzer, "analyze_snippet"):
            issues = analyzer.analyze_snippet(code)
        else:
            issues = analyzer.analyze_repo({file_path: code})
    except Exception as e:
        # fallback safe structure
        issues = {"issues": [], "confidence": 0.5}
        print("Analyzer error in /predict:", e)

    # Standardize prediction structure for logs
    if isinstance(issues, dict):
        prediction_struct = {
            "issues": issues.get("issues", []),
            "confidence": issues.get("confidence", 0.5),
            "file": file_path
        }
    else:
        prediction_struct = {
            "issues": issues,
            "confidence": 0.5,
            "file": file_path
        }

    # Log prediction for Oumi RL pipeline
    log_prediction(code, prediction_struct, prediction_struct["confidence"], {"file": file_path})

    return jsonify({"prediction": prediction_struct}), 200

# ---------- NEW: Feedback endpoint (captures user feedback and computes reward) ----------
@app.route('/feedback', methods=['POST'])
def feedback():
    """
    Accepts feedback about a prediction:
    {
      "prediction_meta": { ... },  # optional small metadata or prediction id
      "feedback_type": "fixed_and_approved" | "fixed_with_problems" | "skipped" | "marked_not_issue" | "missed_issue"
    }
    """
    data = request.json or {}
    feedback_type = data.get("feedback_type", "")
    prediction_meta = data.get("prediction_meta", {})

    mapping = {
        "fixed_and_approved": 1.0,
        "fixed_with_problems": 0.5,
        "skipped": -0.2,
        "marked_not_issue": -1.0,
        "missed_issue": -0.5
    }
    reward = mapping.get(feedback_type, 0.0)

    # Log reward for training pipeline
    log_reward(prediction_meta, feedback_type, reward)

    # Optionally: trigger OU_MI.trainer.update(...) if OU_MI enabled (stub)
    if isinstance(OU_MI, dict) and OU_MI.get("enabled"):
        try:
            trainer = OU_MI.get("trainer")
            # Pseudocode: replace with real Oumi API if available
            # trainer.add_feedback(prediction_meta, reward)
        except Exception as e:
            print("Oumi trainer call failed (stub):", e)

    return jsonify({"status": "ok", "reward": reward}), 200

# ---------- NEW: Judge endpoint (LLM-as-a-Judge demo) ----------
@app.route('/judge', methods=['POST'])
def judge():
    """
    Input:
    {
      "original_code": "<original>",
      "fixed_code": "<fixed>",
      "issue_description": "hardcoded_api_key"
    }
    Output: { "grade": "A|B|C|D|F", "reasons": [...] }
    """
    data = request.json or {}
    original = data.get("original_code", "")
    fixed = data.get("fixed_code", "")
    issue = data.get("issue_description", "")

    reasons = []
    score = 0

    # Simple heuristic checks (demo)
    if "API_KEY" in original and "API_KEY" not in fixed:
        score += 1
        reasons.append("API key removed from code")
    else:
        reasons.append("API key not removed or not applicable")

    if "process.env" in fixed or "os.environ" in fixed or ".env" in fixed:
        score += 1
        reasons.append("Environment variable used for secret")
    else:
        reasons.append("No environment variable usage detected")

    # grade mapping
    if score >= 2:
        grade = "A"
    elif score == 1:
        grade = "C"
    else:
        grade = "F"

# ---------- API V1 Endpoints for Backend Integration ----------
from services.chat_service import ChatService
from core.gemini_client import GeminiClient
import asyncio

chat_service = ChatService()
gemini_client = GeminiClient()

@app.route('/api/v1/assist', methods=['POST'])
def api_v1_assist():
    """
    Endpoint for specific code assistance/Q&A.
    Input: { "question": "...", "codeContext": "...", "language": "..." }
    """
    data = request.json or {}
    question = data.get("question", "")
    
    # Handle Java AssistRequest DTO structure (nested context)
    context = data.get("context", {})
    if isinstance(context, dict):
        code_context = context.get("fileContent", "") or context.get("selectedCode", "")
        language = context.get("programmingLanguage", "java")
    else:
        # Fallback for flat structure if used elsewhere
        code_context = data.get("codeContext", "")
        language = data.get("language", "java")
    
    # Construct a prompt for Gemini
    prompt = f"""
    You are an expert coding assistant for {language}.
    
    User Question: {question}
    
    Code Context:
    ```{language}
    {code_context}
    ```
    
    Please provide:
    1. A clear explanation.
    2. A code example fixing or improving the code.
    3. A brief practice exercise if applicable.
    """
    
    try:
        # Use GeminiClient to get response
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        response_text = loop.run_until_complete(
            gemini_client.generate_content(prompt)
        )
        
        # Parse or format response
        # We'll just return the text description and code logic
        # For a structured AssistResponse, ideally we'd ask for JSON or parse it.
        # For now, we wrap the text.
        
        return jsonify({
            "explanation": response_text,
            "codeExample": "", # Extracted code could go here
            "practiceExercise": "Try implementing valid error handling based on the explanation.",
            "estimatedReadTime": 5,
            "relatedResources": []
        })
    except Exception as e:
        print(f"Error in /api/v1/assist: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/chat', methods=['POST'])
def api_v1_chat():
    """
    Endpoint for conversational chat.
    Input: { "message": "...", "profile": { ... }, "session_id": "..." }
    """
    data = request.json or {}
    message = data.get("message", "")
    profile = data.get("profile", {})
    session_id = data.get("session_id", str(profile.get("id", "default")))
    
    try:
        response_data = chat_service.process_chat_message(
            message=message,
            session_id=session_id,
            student_profile=profile
        )
        # Backend expects simple { "response": "..." } wrapper or similar?
        # PythonAIIntegrationService expects { "response": "..." }
        return jsonify({
            "response": response_data.get("ai_response", ""),
            "context": response_data
        })
    except Exception as e:
        print(f"Error in /api/v1/chat: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/judge', methods=['POST'])
def api_v1_judge():
    """
    Wrapper for existing judge logic to match /api/v1 path.
    """
    return judge()


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
