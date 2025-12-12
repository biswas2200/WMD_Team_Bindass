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

    return jsonify({"grade": grade, "reasons": reasons}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
