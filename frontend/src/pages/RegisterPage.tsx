import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { getErrorMessage } from '@/api/client'
import { registerRequest } from '@/api/authApi'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from '@/context/AuthContext'
import { setStoredProfile } from '@/lib/storage'

export default function RegisterPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/app" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await registerRequest(name, email, password)
      setStoredProfile({ displayName: name.trim() || email.split('@')[0] || 'User' })
      navigate('/login', { replace: true, state: { registered: true } })
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to register'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-surface-0 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="font-display text-2xl font-semibold text-white">
            SkillGap<span className="text-cyan-400">.</span>AI
          </Link>
          <p className="mt-2 text-sm text-slate-400">
            Create an account. The backend returns your profile; you will receive a JWT after login.
          </p>
        </div>

        <Card>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Full name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input
              label="Work email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              hint="Minimum practical length: 8+ characters."
            />
            {error ? (
              <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner label="Creating account" /> : 'Create account'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            Already registered?{' '}
            <Link className="text-cyan-300 hover:underline" to="/login">
              Log in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
