# app/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4
import asyncio
from typing import Optional
from .metrics import CodeQualityScore, load_dataset_for_eval

app = FastAPI(title="Kodra Oumi Python Service")

# in-memory job store (simple)
jobs = {}

class InferRequest(BaseModel):
    code: str
    language: Optional[str] = "python"
    context: Optional[str] = None
    max_tokens: Optional[int] = 500

class EvalRequest(BaseModel):
    model_path: str
    test_dataset: str

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/infer")
async def infer(req: InferRequest):
    # stubbed explanation — replace with Oumi client when available
    explanation = (
        f"Stub explanation for language={req.language}. "
        f"Code length={len(req.code)}. Context={req.context or 'none'}"
    )
    return {"explanation": explanation}

@app.post("/evaluate")
async def evaluate(req: EvalRequest):
    test_data = load_dataset_for_eval(req.test_dataset)
    predictions = [t["prediction"] for t in test_data]
    references = [t["reference"] for t in test_data]
    metric = CodeQualityScore()
    results = metric.compute(predictions, references)
    return {"results": results}

@app.post("/train")
async def train(dataset_path: str, model_name: Optional[str] = "ruvva/education-mentor-v1"):
    job_id = str(uuid4())
    jobs[job_id] = {"status": "queued", "progress": 0, "model_name": model_name}
    asyncio.create_task(_simulate_train(job_id, dataset_path, model_name))
    return {"job_id": job_id}

async def _simulate_train(job_id, dataset_path, model_name):
    jobs[job_id]["status"] = "running"
    jobs[job_id]["progress"] = 10
    await asyncio.sleep(1)
    jobs[job_id]["progress"] = 70
    await asyncio.sleep(1)
    jobs[job_id]["progress"] = 100
    jobs[job_id]["status"] = "completed"
    jobs[job_id]["model_path"] = f"/models/{model_name}-final"

@app.get("/train/{job_id}/status")
async def train_status(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    return job

@app.post("/kestra/notify")
async def kestra_notify(payload: dict):
    # Kestra can POST workflow outputs here — we just accept and log
    print("Kestra payload:", payload)
    return {"received": True}
