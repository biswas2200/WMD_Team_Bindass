"""
Oumi Data Preparation Script for Kodra.ai

This script demonstrates how we prepare data for fine-tuning a model using Oumi.
Goal: Fine-tune a model to provide specific remediation advice for Java Spring Boot vulnerabilities.

Reference: https://github.com/oumi-ai/oumi
"""

import json
import random

def generate_training_data(output_file="oumi_kodra_finetune.jsonl"):
    print("Generating synthetic training data for Oumi fine-tuning...")
    
    vulnerabilities = [
        {
            "vuln": "SQL Injection",
            "code": "String query = \"SELECT * FROM users WHERE name = '\" + name + \"'\";",
            "fix": "String query = \"SELECT * FROM users WHERE name = ?\";",
            "explanation": "Use prepared statements to prevent SQL injection."
        },
        {
            "vuln": "XSS",
            "code": "return \"<div>\" + userInput + \"</div>\";",
            "fix": "return \"<div>\" + chtmlSpecialChars(userInput) + \"</div>\";",
            "explanation": "Sanitize user input before rendering to prevent Cross-Site Scripting (XSS)."
        },
        {
            "vuln": "Hardcoded Credentials",
            "code": "String password = \"superSecret123\";",
            "fix": "String password = System.getenv(\"DB_PASSWORD\");",
            "explanation": "Never hardcode credentials. Use environment variables."
        }
    ]
    
    data = []
    for _ in range(100): # Simulate 100 samples
        sample = random.choice(vulnerabilities)
        
        # Oumi / Chat format
        entry = {
            "messages": [
                {"role": "system", "content": "You are KodraAI, a security-focused coding assistant."},
                {"role": "user", "content": f"Fix this code: {sample['code']}"},
                {"role": "assistant", "content": f"Here is the fix:\n```java\n{sample['fix']}\n```\n\n**Reasoning**: {sample['explanation']}"}
            ]
        }
        data.append(entry)
        
    with open(output_file, 'w') as f:
        for entry in data:
            f.write(json.dumps(entry) + '\n')
            
    print(f"Successfully generated {len(data)} training samples in {output_file}")
    print("Next Step: Run 'oumi train -c config.yaml' to start fine-tuning (Mock).")

if __name__ == "__main__":
    generate_training_data()
