"""
app.py — Flask ML Service for Resume Parsing
Endpoints updated to match /api prefix for frontend proxy.
"""

import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS

from parser import (
    extract_text_from_pdf,
    extract_text_from_docx,
    parse_resume,
)
from evaluator import evaluate_candidate

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {'pdf', 'docx'}

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'service': 'Why Did You Reject Me? — ML Service',
    })

@app.route('/api/parse', methods=['POST'])
def parse():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided.'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400
    if not allowed_file(file.filename):
        return jsonify({'error': 'Unsupported file type.'}), 400
    
    file_bytes = file.read()
    filename = file.filename.lower()
    try:
        if filename.endswith('.pdf'):
            text = extract_text_from_pdf(file_bytes)
            file_type = 'PDF'
        elif filename.endswith('.docx'):
            text = extract_text_from_docx(file_bytes)
            file_type = 'DOCX'
        else:
            return jsonify({'error': 'Unsupported file type'}), 400
            
        if not text or len(text.strip()) < 20:
            return jsonify({'error': 'Could not extract text.'}), 422
            
        parsed = parse_resume(text)
        return jsonify({
            'success': True,
            'file_type': file_type,
            'filename': file.filename,
            'parsed': parsed,
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/evaluate', methods=['POST'])
def evaluate():
    data = request.get_json()
    if not data or 'parsed_data' not in data:
        return jsonify({'error': 'No data provided'}), 400
    try:
        evaluation = evaluate_candidate(data['parsed_data'], data.get('jd_text', ''))
        return jsonify(evaluation)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    query = data.get('query', '').lower()
    eval_data = data.get('evaluation_data', {})
    if not query or not eval_data:
        return jsonify({'answer': "I need your evaluation data and a question!"})
    
    if "why" in query and "reject" in query:
        reason = eval_data.get('reasoning', 'factors within the model.')
        answer = f"According to the AI, the primary reason was {reason}. Specifically, your {eval_data['factors'][0]['factor']} had the strongest impact."
    elif "improve" in query or "skill" in query:
        gaps = eval_data.get('missing_skills', [])
        answer = f"To improve, I recommend focusing on {', '.join(gaps[:3])}. Check the Roadmap tab!"
    elif "confidence" in query:
        answer = f"The model is {eval_data['confidence_score']}% confident in this decision."
    else:
        answer = "I'm your AI Rejection Assistant. Ask me why you were rejected or how to improve!"
    return jsonify({'answer': answer})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
