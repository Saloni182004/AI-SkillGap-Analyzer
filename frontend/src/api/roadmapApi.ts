import { apiClient } from '@/api/client'
import type {
  AddSkillResponse,
  GapAnalyzeResponse,
  GenerateRoadmapResponse,
  MissingSkillsResponse,
} from '@/types/api'

export async function analyzeGap(targetRole: string) {
  const { data } = await apiClient.post<GapAnalyzeResponse>('/api/roadmap/analyze', {
    targetRole,
  })
  return data
}

export async function fetchMissingSkills() {
  const { data } = await apiClient.get<MissingSkillsResponse>('/api/roadmap/missing-skills')
  return data
}

export async function addCustomSkill(skillName: string) {
  const { data } = await apiClient.post<AddSkillResponse>('/api/roadmap/add-missingskills', {
    skillName,
  })
  return data
}

export async function generateRoadmap() {
  const { data } = await apiClient.post<GenerateRoadmapResponse>(
    '/api/roadmap/generate-roadmap',
  )
  return data
}
export async function fetchActiveRoadmap() {
  const { data } = await apiClient.get<any>('/api/roadmap/getRoadmap')
  return data
}

export async function toggleMilestoneStatus(week: string, completed: boolean) {
  const { data } = await apiClient.put<GenerateRoadmapResponse>('/api/roadmap/toggle-milestone', {
    week,
    completed
  })
  return data
}