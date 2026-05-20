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
    learning_goals: List[str] = Field(description="3-4 specific actionable tasks or concepts")
    recommended_resources: List[str] = Field(description="2-3 specific links, docs, or project names")

class PreparationRoadmap(BaseModel):
    """The final 4-week high-intensity structured plan"""
    target_role: str
    milestones: List[Milestone] = Field(description="Exactly 4 weekly milestones covering all gaps")
    estimated_effort: str = Field(default="15-20 hours/week", description="Time required for this accelerated pace")


class InterviewQuestion(BaseModel):
    question: str = Field(description="The technical interview question")
    category: str = Field(description="MUST be one of: 'previous_skills', 'roadmap_skills', or 'general_role'")
    relatedSkill: str = Field(description="The specific skill being tested (e.g., 'React' or 'System Design')")
    expectedAnswerPoints: List[str] = Field(description="3-4 key technical concepts the candidate MUST mention to pass")

class InterviewGenerationResponse(BaseModel):
    """The generated list of interview questions"""
    questions: List[InterviewQuestion]

class AnswerEvaluation(BaseModel):
    """Evaluation of a single interview answer"""
    score: int = Field(description="Score from 0 to 10 based on accuracy and depth")
    feedback: str = Field(description="1-2 sentences of actionable feedback. What did they miss?")
    is_passing: bool = Field(description="True if score is 6 or higher")