import { useState, type FormEvent } from 'react'

import { getErrorMessage } from '@/api/client'
import { analyzeGap } from '@/api/roadmapApi'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'

export default function AnalyzePage() {
  const [targetRole, setTargetRole] = useState('Senior Full-Stack Engineer')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [missing, setMissing] = useState<string[] | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMissing(null)
    setStatus(null)
    try {
      const res = await analyzeGap(targetRole.trim())
      setMissing(res.roadmap.missingSkills ?? [])
      setStatus(res.roadmap.status)
    } catch (err) {
      setError(getErrorMessage(err, 'Analysis failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Gap analysis</p>
        <h2 className="font-display text-3xl font-semibold text-white">Compare against a target role</h2>
        <p className="mt-2 text-slate-400">
          This calls{' '}
          <code className="rounded bg-black/40 px-1.5 py-0.5 text-xs text-cyan-200">
            POST /api/roadmap/analyze
          </code>{' '}
          which loads your latest structured resume profile and forwards it to the AI orchestrator.
        </p>
      </div>

      <Card>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            label="Target role"
            name="targetRole"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            required
            hint="Be specific — the model calibrates expectations from this string."
          />
          <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
            {loading ? <Spinner label="Analyzing" /> : 'Run gap analysis'}
          </Button>
        </form>
        {error ? (
          <p className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
            {error}
          </p>
        ) : null}
      </Card>

      {missing ? (
        <Card>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl font-semibold text-white">Missing skills</h3>
            {status ? <Badge tone="accent">{status}</Badge> : null}
          </div>
          {missing.length === 0 ? (
            <p className="text-sm text-slate-400">No gaps returned. Try a different role title.</p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {missing.map((skill) => (
                <li
                  key={skill}
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
                >
                  {skill}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-slate-500">
            Next step: refine the list on the roadmap page, then generate your multi-week plan.
          </p>
        </Card>
      ) : null}
    </div>
  )
}
