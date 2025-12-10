
import re
import os

class CodeAnalyzer:
    """
    Analyzes code for security vulnerabilities, logic errors, and performance issues.
    This is the core engine of Kodra.ai.
    """
    
    PATTERNS = {
        "SECURITY_HARDCODED_SECRET": {
            "regex": r"(api_key|password|secret|token)\s*=\s*['\"][A-Za-z0-9_\-]{10,}['\"]",
            "score_impact": -20,
            "category": "security",
            "message": "Hardcoded secret detected. Use environment variables."
        },
        "SECURITY_SQL_INJECTION": {
            "regex": r"execute\(\s*['\"]SELECT.*['\"]\s*\+\s*[a-zA-Z_]",
            "score_impact": -15,
            "category": "security",
            "message": "Potential SQL injection. Use parameterized queries."
        },
        "PERFORMANCE_N_PLUS_ONE": {
            "regex": r"for\s+.*\s+:\s*.*\s*\{.*repository\.findById",
            "score_impact": -10,
            "category": "performance",
            "message": "Potential N+1 query problem detected in loop."
        },
        "BEST_PRACTICE_CONSOLE_LOG": {
            "regex": r"console\.log\(",
            "score_impact": -2,
            "category": "best_practices",
            "message": "Avoid console.log in production code."
        }
    }

    def analyze_file(self, content, file_path):
        issues = []
        lines = content.split('\n')
        
        for i, line in enumerate(lines):
            for key, rule in self.PATTERNS.items():
                if re.search(rule['regex'], line, re.IGNORECASE):
                    issues.append({
                        "type": key,
                        "category": rule['category'],
                        "file": file_path,
                        "line": i + 1,
                        "message": rule['message'],
                        "snippet": line.strip()[:100]
                    })
        
        return issues

    def analyze_repo(self, repo_path_or_content_map):
        """
        repo_path_or_content_map: Dict of {filename: content} for now (Mock)
        """
        all_issues = []
        metrics = {"security": 100, "performance": 100, "best_practices": 100}
        
        for filename, content in repo_path_or_content_map.items():
            file_issues = self.analyze_file(content, filename)
            all_issues.extend(file_issues)
            
            # Deduct scores
            for issue in file_issues:
                cat = issue['category']
                if cat in metrics:
                    metrics[cat] = max(0, metrics[cat] - 5) # Simplified deduction

        return {
            "scores": metrics,
            "issues": all_issues,
            "total_issues": len(all_issues)
        }
