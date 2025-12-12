# app/metrics.py
import re
import ast

class CodeQualityScore:
    def __init__(self):
        pass

    def compute(self, predictions, references=None):
        scores = []
        for pred in predictions:
            score = 0.0
            if self._contains_code_block(pred):
                score += 0.2
            if self._has_step_by_step(pred):
                score += 0.3
            if self._code_is_executable(pred):
                score += 0.3
            clarity_score = self._compute_clarity(pred)
            score += 0.2 * clarity_score
            scores.append(score)
        avg = sum(scores) / len(scores) if scores else 0.0
        return {"code_quality_score": avg, "individual_scores": scores}

    def _contains_code_block(self, text: str) -> bool:
        return bool(re.search(r'```[\s\S]*```', text))

    def _has_step_by_step(self, text: str) -> bool:
        patterns = [r'\d+\.', r'Step \d+', r'First|Second|Third|Finally']
        return any(re.search(pattern, text, re.IGNORECASE) for pattern in patterns)

    def _code_is_executable(self, text: str) -> bool:
        code_blocks = re.findall(r'```(?:python|java|javascript)\n([\s\S]*?)```', text)
        for code in code_blocks:
            try:
                ast.parse(code)
                return True
            except SyntaxError:
                continue
        return False

    def _compute_clarity(self, text: str) -> float:
        sentences = [s.strip() for s in text.split('.') if s.strip()]
        if not sentences:
            return 0.4
        avg_len = sum(len(s.split()) for s in sentences) / len(sentences)
        if 10 <= avg_len <= 25:
            return 1.0
        elif 5 <= avg_len <= 35:
            return 0.7
        else:
            return 0.4

def load_dataset_for_eval(path):
    # Simple stub loader — replace with real loader later
    return [
        {"prediction": "1. Do X\n2. Do Y\n```python\nprint('hi')\n```", "reference": "expected"},
        {"prediction": "Explain: function returns value", "reference": "expected2"},
    ]
