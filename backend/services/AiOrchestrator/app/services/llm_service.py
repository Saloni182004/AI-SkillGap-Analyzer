import os
import json
import httpx
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
COLAB_AI_URL = os.getenv("COLAB_AI_URL")

async def call_llm_service(prompt: str) -> dict:
    """
    Core helper to communicate with the Colab/Ollama instance.
    """
    if not COLAB_AI_URL:
        raise ValueError("CRITICAL: COLAB_AI_URL is missing from .env")

    payload = {
        "model": "qwen2.5:7b",
        "prompt": prompt,
        "stream": False,
        "format": "json"
    }
    
    headers = {
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient(timeout=150.0) as client:
        try:
            response = await client.post(
                f"{COLAB_AI_URL}/api/generate", 
                json=payload, 
                headers=headers
            )
            response.raise_for_status()
            
            data = response.json()
            ai_text = data.get("response", "{}")
            
            return json.loads(ai_text)
            
        except httpx.HTTPStatusError as e:
            print(f"❌ LLM Service Error: {e.response.text}")
            raise
        except json.JSONDecodeError:
            print("❌ LLM returned invalid JSON")
            raise ValueError("AI failed to return valid structured data.")


from app.services.prompts import AIPrompts

async def extract_structured_profile(raw_text: str, schema: dict) -> dict:
    """Parses raw resume text into JSON."""
    prompt = AIPrompts.get_resume_extraction_prompt(raw_text, schema)
    return await call_llm_service(prompt)

async def extract_missing_skills(profile: dict, target_role: str, schema: dict) -> dict:
    """Identifies the gap between profile and target role."""
    prompt = AIPrompts.get_gap_analysis_prompt(profile, target_role, schema)
    return await call_llm_service(prompt)

async def generate_learning_roadmap(skills: list, target_role: str, schema: dict) -> dict:
    """Generates the 8-week structured schedule."""
    prompt = AIPrompts.get_roadmap_generator_prompt(skills, target_role, schema)
    return await call_llm_service(prompt)