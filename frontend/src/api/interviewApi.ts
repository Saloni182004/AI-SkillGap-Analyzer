import { apiClient } from './client'
import type { GenerateInterviewResponse, EvaluateInterviewResponse } from '@/types/api'

export async function generateMockInterview(targetRole: string, totalQuestions = 5) {
  const res = await apiClient.post<GenerateInterviewResponse>('/api/interview/generate-interview', { 
    targetRole, 
    totalQuestions 
  })
  return res.data
}

export async function evaluateMockInterview(interviewId: string, userAnswers: { questionId: string; answer: string }[]) {
  const res = await apiClient.post<EvaluateInterviewResponse>('/api/interview/evaluate-answer', { 
    interviewId, 
    userAnswers 
  })
  return res.data
}