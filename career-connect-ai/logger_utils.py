# career-connect-ai/logger_utils.py
import json, time, os

LOG_DIR = "oumi_logs"
os.makedirs(LOG_DIR, exist_ok=True)
PRED_LOG = os.path.join(LOG_DIR, "predictions.jsonl")
REW_LOG = os.path.join(LOG_DIR, "rewards.jsonl")

def log_prediction(input_snippet, prediction, confidence, context=None):
    entry = {
        "timestamp": time.time(),
        "input": input_snippet,
        "prediction": prediction,
        "confidence": confidence,
        "context": context or {}
    }
    with open(PRED_LOG, "a") as f:
        f.write(json.dumps(entry) + "\n")

def log_reward(prediction_meta, feedback_type, reward):
    entry = {
        "timestamp": time.time(),
        "prediction_meta": prediction_meta,
        "feedback_type": feedback_type,
        "reward": reward
    }
    with open(REW_LOG, "a") as f:
        f.write(json.dumps(entry) + "\n")
