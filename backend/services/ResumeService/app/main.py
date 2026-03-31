from fastapi import FastAPI
from app.api.routes import router as resume_router

app = FastAPI(title="SkillGap Analyzer - Resume Service")
app.include_router(resume_router, prefix="/api/resumes", tags=["Resumes"])

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Python Resume Parser"}