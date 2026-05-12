import { apiClient } from '@/api/client'
import type { LoginResponse, RegisterResponse } from '@/types/api'

export async function loginRequest(email: string, password: string) {
  const { data } = await apiClient.post<LoginResponse>('/api/auth/login', {
    email,
    password,
  })
  return data
}

export async function registerRequest(name: string, email: string, password: string) {
  const { data } = await apiClient.post<RegisterResponse>('/api/auth/register', {
    name,
    email,
    password,
  })
  return data
}
