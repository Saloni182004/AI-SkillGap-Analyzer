from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List

from app.services.llm_service import (
    extract_structured_profile, 
    extract_missing_skills, 
    generate_learning_roadmap,
    generate_interview_questions,  
    evaluate_interview_answer
)

from app.models.schemas import GapAnalysisResponse, PreparationRoadmap
from app.models.schemas import InterviewGenerationResponse, AnswerEvaluation

router = APIRouter()

class ExtractionRequest(BaseModel):
    raw_text: str
    expected_schema: Dict[str, Any]

@router.post("/extract-profile")
async def extract_profile(request: ExtractionRequest):
    try:
        return await extract_structured_profile(
            request.raw_text, 
            request.expected_schema
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.post("/find-gaps")
async def find_gaps_route(request: Dict[str, Any]):
    """
    Called by Node.js Gateway.
    Payload: { "profile": {...}, "targetRole": "..." }
    """
    try:
        profile = request.get("profile")
        target_role = request.get("targetRole")

        if not profile or not target_role:
            raise HTTPException(status_code=400, detail="Profile and targetRole are required")

        schema = GapAnalysisResponse.model_json_schema()

        return await extract_missing_skills(profile, target_role, schema)
    except Exception as e:
        print(f"Gap Analysis Route Error: {e}")
        raise HTTPException(status_code=502, detail=str(e))

@router.post("/generate-roadmap-plan")
async def generate_roadmap_route(request: Dict[str, Any]):
    """
    Called by Node.js Gateway.
    Payload: { "skills": [...], "targetRole": "..." }
    """
    try:
        skills = request.get("skills")
        target_role = request.get("targetRole")

        if not skills or not target_role:
            raise HTTPException(status_code=400, detail="Skills list and targetRole are required")
        schema = PreparationRoadmap.model_json_schema()

        return await generate_learning_roadmap(skills, target_role, schema)
    except Exception as e:
        print(f"Roadmap Generation Route Error: {e}")
        raise HTTPException(status_code=502, detail=str(e))
    
@router.post("/generate-interview")
async def generate_interview_route(request: Dict[str, Any]):
    """
    Called by Node.js Interview Service.
    Payload: { "targetRole": "...", "distribution": {...} }
    """
    try:
        if "targetRole" not in request or "distribution" not in request:
            raise HTTPException(status_code=400, detail="targetRole and distribution are required")
            
        schema = InterviewGenerationResponse.model_json_schema()
        return await generate_interview_questions(request, schema)
    except Exception as e:
        print(f"Interview Generation Route Error: {e}")
        raise HTTPException(status_code=502, detail=str(e))


@router.post("/evaluate-answer")
async def evaluate_answer_route(request: Dict[str, Any]):
    """
    Called by Node.js Interview Service.
    Payload: { "question": "...", "expected_points": [...], "user_answer": "..." }
    """
    try:
        question = request.get("question")
        expected_points = request.get("expected_points")
        user_answer = request.get("user_answer")

        if not all([question, expected_points, user_answer]):
            raise HTTPException(status_code=400, detail="question, expected_points, and user_answer are required")

        schema = AnswerEvaluation.model_json_schema()
        return await evaluate_interview_answer(question, expected_points, user_answer, schema)
    except Exception as e:
        print(f"Answer Evaluation Route Error: {e}")
        raise HTTPException(status_code=502, detail=str(e))