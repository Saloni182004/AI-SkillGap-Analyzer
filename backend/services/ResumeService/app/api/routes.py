import os
from fastapi import APIRouter, UploadFile, File, Header, HTTPException
from datetime import datetime
import httpx
from dotenv import load_dotenv, find_dotenv

from app.services.extractor import extract_clean_text
from app.db.mongodb import resume_collection
from app.model.schema import ExtractedProfileSchema


load_dotenv(find_dotenv(), override=True)

router = APIRouter()


AI_ORCHESTRATOR_URL_EXTRACT_PROFILE = os.getenv("AI_ORCHESTRATOR_URL_EXTRACT_PROFILE")

if not AI_ORCHESTRATOR_URL_EXTRACT_PROFILE:
    raise ValueError("CRITICAL: AI_ORCHESTRATOR_URL_EXTRACT_PROFILE is missing from your .env file!")

@router.post("/upload")
async def upload_and_parse_resume(
    file: UploadFile = File(...),
    authorization: str = Header(None),
    x_user_id: str = Header(..., description="Injected by Node.js API Gateway")
):
    try:
        file_bytes = await file.read()
        try:
            raw_text = await extract_clean_text(file_bytes, file.content_type)
        except ValueError as e:
            raise HTTPException(status_code=415, detail=str(e))

        payload = {
            "raw_text": raw_text,
            "expected_schema": ExtractedProfileSchema.model_json_schema()
        }
        internal_headers = {
            "Authorization": authorization,  
            "x-user-id": x_user_id,
            "Content-Type": "application/json"
        }
     

        async with httpx.AsyncClient(timeout=120.0) as client:
            ai_response = await client.post(AI_ORCHESTRATOR_URL_EXTRACT_PROFILE, json=payload, headers=internal_headers)
            
            if ai_response.status_code != 200:
                print(f"AI Service Failed: {ai_response.text}")
                raise HTTPException(status_code=502, detail="AI Service failed to structure resume")
                
            ai_data = ai_response.json()

        try:
            validated_profile = ExtractedProfileSchema.model_validate(ai_data)
        except Exception as e:
            print(f"Pydantic Validation Error: {str(e)}")
            raise HTTPException(status_code=500, detail="AI returned improperly formatted data")

        mongo_document = {
            "user_id": x_user_id,
            "filename": file.filename,
            "profile": validated_profile.model_dump(), 
            "updated_at": datetime.utcnow(),
            "status": "processed"
        }
        
        resume_collection.update_one(
            {"user_id": x_user_id}, 
            {"$set": mongo_document}, 
            upsert=True
        )

        return {
            "message": "Resume successfully uploaded, structured, and validated!",
            "filename": file.filename,
            "profile": validated_profile.model_dump()
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Internal Processing Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process document")