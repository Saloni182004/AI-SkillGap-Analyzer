import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { decodeJwtPayload, type JwtClaims } from '@/lib/jwt'
import { clearToken, getStoredProfile, getToken, setStoredProfile, setToken } from '@/lib/storage'
import { loginRequest, registerRequest } from '@/api/authApi' // <-- Added registerRequest here

/* eslint-disable react-refresh/only-export-components -- AuthProvider and useAuth belong together */

type AuthUser = {
  email: string
  userId: string
  displayName: string
}

type AuthContextValue = {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void> // <-- Added to Type
  logout: () => void
  setDisplayName: (name: string) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function buildUser(token: string): AuthUser | null {
  const claims = decodeJwtPayload<JwtClaims>(token)
  if (!claims?.email || !claims.userId) return null
  const profile = getStoredProfile()
  const displayName =
    profile?.displayName?.trim() ||
    claims.email.split('@')[0] ||
    'User'
  return {
    email: claims.email,
    userId: claims.userId,
    displayName,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken())
  const [profileVersion, setProfileVersion] = useState(0)

  // profileVersion bumps when display name changes without a new JWT
  // eslint-disable-next-line react-hooks/exhaustive-deps -- profileVersion intentionally invalidates user snapshot
  const user = useMemo(() => (token ? buildUser(token) : null), [token, profileVersion])

  useEffect(() => {
    const onUnauthorized = () => {
      setTokenState(null)
    }
    window.addEventListener('skillgap:unauthorized', onUnauthorized)
    return () => window.removeEventListener('skillgap:unauthorized', onUnauthorized)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await loginRequest(email, password)
    setToken(res.token)
    setTokenState(res.token)
  }, [])

  // <-- ADDED LOGIC FOR REGISTER -->
// <-- UPDATED LOGIC FOR REGISTER -->
  const register = useCallback(async (name: string, email: string, password: string) => {
    await registerRequest(name, email, password)
    await login(email, password)
    setStoredProfile({ displayName: name.trim() }) 
    setProfileVersion((v) => v + 1)
  }, [login]) 
  const logout = useCallback(() => {
    clearToken()
    setTokenState(null)
  }, [])

  const setDisplayName = useCallback((name: string) => {
    setStoredProfile({ displayName: name.trim() || 'User' })
    setProfileVersion((v) => v + 1)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login,
      register, // <-- Exported to Context
      logout,
      setDisplayName,
    }),
    [token, user, login, register, logout, setDisplayName],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}