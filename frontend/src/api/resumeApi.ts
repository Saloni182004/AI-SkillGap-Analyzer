// frontend/src/api/resumeApi.ts
import { apiClient } from '@/api/client'
import type { ResumeUploadResponse, ExtractedProfile } from '@/types/api'

export async function uploadResume(file: File) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await apiClient.post<ResumeUploadResponse>('/api/resumes/upload', form)
  return data
}

export async function fetchCurrentProfile() {
  const { data } = await apiClient.get<{ profile: ExtractedProfile }>('/api/roadmap/getProfile')
  return data
}