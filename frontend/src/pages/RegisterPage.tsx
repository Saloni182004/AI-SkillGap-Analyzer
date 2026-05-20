import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { getErrorMessage } from '@/api/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !displayName) return

    setLoading(true)
    setError(null)
    try {
      await register(displayName, email, password)
      navigate('/app', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-surface-0 px-4 py-12">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(167,139,250,0.12),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(34,211,238,0.1),transparent_40%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block font-display text-2xl font-bold text-white transition-opacity hover:opacity-80">
            SkillGap<span className="text-violet-400">.</span>AI
          </Link>
          <h1 className="mt-6 font-display text-3xl font-semibold text-white">Create an account</h1>
          <p className="mt-2 text-sm text-slate-400">Start discovering your skill gaps in seconds.</p>
        </div>

        <Card className="border-white/5 bg-surface-1/60 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Full Name"
              type="text"
              name="displayName"
              autoComplete="name"
              placeholder="Vivek Kumar"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            
            <Input
              label="Email address"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading || !email || !password || !displayName} className="mt-2 w-full justify-center">
              {loading ? <Spinner label="Creating account..." /> : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-violet-400 hover:text-violet-300 hover:underline underline-offset-4 transition-colors">
              Sign in instead.
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  )
}