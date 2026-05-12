import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import { getErrorMessage } from '@/api/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/app'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to sign in'))
    } finally {
      setLoading(false)
    }
  }

  const flash = (location.state as { registered?: boolean } | null)?.registered

  return (
    <div className="flex min-h-svh items-center justify-center bg-surface-0 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="font-display text-2xl font-semibold text-white">
            SkillGap<span className="text-cyan-400">.</span>AI
          </Link>
          <p className="mt-2 text-sm text-slate-400">Sign in with the email tied to your account.</p>
        </div>

        <Card>
          {flash ? (
            <p className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
              Account created. Use your new credentials to sign in.
            </p>
          ) : null}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Email"
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error ? (
              <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner label="Signing in" /> : 'Continue'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            No account yet?{' '}
            <Link className="text-cyan-300 hover:underline" to="/register">
              Register
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
