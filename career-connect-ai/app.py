from flask import Flask, request, jsonify
from flask_cors import CORS
from services.code_analyzer import CodeAnalyzer
import os

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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
