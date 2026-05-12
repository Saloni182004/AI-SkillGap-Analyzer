const TOKEN_KEY = 'skillgap_token'
const PROFILE_KEY = 'skillgap_profile_v1'

export type StoredProfile = {
  displayName: string
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getStoredProfile(): StoredProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredProfile
  } catch {
    return null
  }
}

export function setStoredProfile(profile: StoredProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}
