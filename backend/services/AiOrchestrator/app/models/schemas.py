from pydantic import BaseModel, Field
from typing import List

class GapAnalysisResponse(BaseModel):
    """The AI's response after comparing resume vs target role"""
    missing_skills: List[str] = Field(description="List of technical skills the user lacks")
    identified_strengths: List[str] = Field(description="Relevant skills the user already possesses")
    role_relevance_score: int = Field(description="A score from 0-100 on how well they fit the role currently")

class Milestone(BaseModel):
    """A single week in the learning roadmap"""
    week: str
    topic: str
    learning_goals: List[str]
    recommended_resources: List[str]

class PreparationRoadmap(BaseModel):
    """The final 8-week structured plan"""
    target_role: str
    milestones: List[Milestone]
    estimated_effort: str = Field(default="10-15 hours/week")