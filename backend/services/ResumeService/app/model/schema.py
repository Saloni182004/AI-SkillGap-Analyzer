from pydantic import BaseModel, Field
from typing import List, Optional

class BasicsSchema(BaseModel):
    name: str = Field(default="Unknown")
    current_job_title: str = Field(default="Aspiring Professional")
    total_years_experience: float = Field(default=0.0)

class ExperienceSchema(BaseModel):
    title: str
    company: str
    duration: str
    applied_skills: List[str] = Field(default_factory=list)

class ProjectSchema(BaseModel):
    name: str
    description: str
    tech_stack: List[str] = Field(default_factory=list)
    link: Optional[str] = None

class EducationSchema(BaseModel):
    degree: str
    institution: str
    year: str

class ExtractedProfileSchema(BaseModel):
    basics: BasicsSchema
    core_skills: List[str] = Field(default_factory=list)
    tools_and_software: List[str] = Field(default_factory=list)
    experience: List[ExperienceSchema] = Field(default_factory=list)
    projects: List[ProjectSchema] = Field(default_factory=list)
    education: List[EducationSchema] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)