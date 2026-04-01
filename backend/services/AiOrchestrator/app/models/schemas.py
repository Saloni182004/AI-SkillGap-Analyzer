from pydantic import BaseModel, Field
from typing import List

class GapAnalysisResponse(BaseModel):
    """The AI's response after comparing resume vs target role"""
    missing_skills: List[str] = Field(description="Strict list of 5-8 technical skills the user lacks")
    identified_strengths: List[str] = Field(description="Relevant skills found in the user's profile")
    role_relevance_score: int = Field(description="Readiness score from 0-100")

class Milestone(BaseModel):
    """A single week in the accelerated 4-week roadmap"""
    week: str = Field(description="e.g., 'Week 1'")
    topic: str = Field(description="The main technical theme for this week")
    # Using these names to match your Mongoose model updates
    learning_goals: List[str] = Field(description="3-4 specific actionable tasks or concepts")
    recommended_resources: List[str] = Field(description="2-3 specific links, docs, or project names")

class PreparationRoadmap(BaseModel):
    """The final 4-week high-intensity structured plan"""
    target_role: str
    milestones: List[Milestone] = Field(description="Exactly 4 weekly milestones covering all gaps")
    estimated_effort: str = Field(default="15-20 hours/week", description="Time required for this accelerated pace")