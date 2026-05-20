import axios, { type AxiosError } from 'axios'

import { clearToken, getToken } from '@/lib/storage'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? ''

const DEFAULT_TIMEOUT_MS = 180_000

export const apiClient = axios.create({
  baseURL,
  timeout: DEFAULT_TIMEOUT_MS,
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json'
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearToken()
      window.dispatchEvent(new CustomEvent('skillgap:unauthorized'))
    }
    return Promise.reject(error)
  },
)

function formatFastApiDetail(detail: unknown): string | undefined {
  if (detail == null) return undefined
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    const parts = detail.map((item) => {
      if (typeof item === 'string') return item
      if (item && typeof item === 'object' && 'msg' in item) {
        const msg = (item as { msg?: unknown }).msg
        return typeof msg === 'string' ? msg : undefined
      }
      return undefined
    })
    const joined = parts.filter(Boolean).join('; ')
    return joined || undefined
  }
  if (typeof detail === 'object') {
    try {
      return JSON.stringify(detail)
    } catch {
      return undefined
    }
  }
  return String(detail)
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; detail?: unknown }
      | undefined
    const fromDetail = formatFastApiDetail(data?.detail)
    return data?.message ?? fromDetail ?? error.message ?? fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}
