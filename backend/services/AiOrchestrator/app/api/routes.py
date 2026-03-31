from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List

from app.services.llm_service import (
    extract_structured_profile, 
    extract_missing_skills, 
    generate_learning_roadmap
)

from app.models.schemas import GapAnalysisResponse, PreparationRoadmap

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