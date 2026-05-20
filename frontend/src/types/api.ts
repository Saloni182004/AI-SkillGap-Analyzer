export type LoginResponse = {
  status: string
  message: string
  token: string
}

export type RegisterResponse = {
  id: string
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
}

export type Basics = {
  name: string
  current_job_title: string
  total_years_experience: number
}

export type ExtractedProfile = {
  basics: Basics
  core_skills: string[]
  tools_and_software: string[]
  experience: Array<{
    title: string
    company: string
    duration: string
    applied_skills: string[]
  }>
  projects: Array<{
    name: string
    description: string
    tech_stack: string[]
    link?: string | null
  }>
  education: Array<{
    degree: string
    institution: string
    year: string
  }>
  certifications: string[]
}

export type ResumeUploadResponse = {
  message: string
  filename: string
  profile: ExtractedProfile
}

export type RoadmapMilestone = {
  week: string
  topic: string
  learning_goals: string[]
  recommended_resources: string[]
}

export type RoadmapDoc = {
  userId: string
  targetRole: string
  missingSkills: string[]
  userAddedSkills: string[]
  weeklyPlan?: RoadmapMilestone[]
  status: 'analyzing' | 'customizing' | 'generated'
  updatedAt?: string
}

export type GapAnalyzeResponse = {
  message: string
  roadmap: RoadmapDoc
}

export type MissingSkillsResponse = {
  success: boolean
  message: string
  missingSkills: string[]
}

export type AddSkillResponse = {
  success: boolean
  message: string
  allMissingSkills: string[]
}

export type GenerateRoadmapResponse = {
  message: string
  roadmap: RoadmapDoc
}

export type ApiErrorBody = {
  message?: string
  detail?: string
}

// frontend/src/types/api.ts

export interface InterviewQuestion {
  _id: string;
  question: string;
  category: 'previous_skills' | 'roadmap_skills' | 'general_role';
  relatedSkill?: string;
  expectedAnswerPoints: string[];
  userAnswer?: string;
  score?: number;
  feedback?: string;
}

export interface GenerateInterviewResponse {
  message: string;
  interviewId: string;
  questions: InterviewQuestion[];
}

export interface EvaluateInterviewResponse {
  message: string;
  overallScore: number;
  questions: InterviewQuestion[];
}
