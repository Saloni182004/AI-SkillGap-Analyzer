from fastapi import FastAPI
from app.api.routes import router as ai_router

app = FastAPI(title="SkillGap Analyzer - AI Orchestrator")

app.include_router(ai_router, prefix="/api/ai", tags=["AI Processing"])

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Python AI Orchestrator"}