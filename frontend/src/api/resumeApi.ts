import { apiClient } from '@/api/client'
import type { ResumeUploadResponse } from '@/types/api'

export async function uploadResume(file: File) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await apiClient.post<ResumeUploadResponse>('/api/resumes/upload', form)
  return data
}
