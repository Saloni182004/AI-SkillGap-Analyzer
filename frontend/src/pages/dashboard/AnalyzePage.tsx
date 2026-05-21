import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getErrorMessage } from '@/api/client'
import { analyzeGap } from '@/api/roadmapApi'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'

export default function AnalyzePage() {
  const navigate = useNavigate()
  const [targetRole, setTargetRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsResume, setNeedsResume] = useState(false)
  
  // The roadmap state holds the complete gap analysis response
  const [roadmap, setRoadmap] = useState<{
    missingSkills: string[]
    targetRole: string
  } | null>(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetRole.trim()) return

    setLoading(true)
    setError(null)
    setNeedsResume(false)
    setRoadmap(null)

    try {
      const res = await analyzeGap(targetRole.trim())
      setRoadmap(res.roadmap)
    } catch (err: any) {
      const msg = getErrorMessage(err, 'Analysis failed')
      setError(msg)
      // Check if the error indicates a missing resume (404 from your backend controller)
      if (err.response?.status === 404 || msg.toLowerCase().includes('resume')) {
        setNeedsResume(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Step 2</p>
        <h2 className="font-display text-3xl font-semibold text-white">Market Gap Analysis</h2>
        <p className="mt-2 text-slate-400">
          Tell us the specific role you want. Our AI will compare your current profile against the top in-demand skills for that position to find your blind spots.
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <form onSubmit={handleAnalyze} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="Target Role"
              name="targetRole"
              placeholder="e.g., Senior Fullstack Developer, Data Engineer..."
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading || !targetRole.trim()}>
            {loading ? <Spinner label="Analyzing Market..." /> : 'Run Analysis'}
          </Button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 flex flex-col gap-3">
            <p>{error}</p>
            {needsResume && (
              <Button onClick={() => navigate('/app/resume')} variant="secondary" size="sm" className="w-fit">
                ← Go to Resume Upload
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Results Section */}
      {roadmap && (
        <Card className="border-violet-500/30 bg-surface-1/40">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-white">
                Analysis Complete
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Target Role: <span className="font-medium text-cyan-200">{roadmap.targetRole}</span>
              </p>
            </div>
            <Badge tone="accent">Action Required</Badge>
          </div>

          <div className="space-y-6">
            {/* Missing Skills Highlight */}
            <div className="bg-black/20 p-5 rounded-xl border border-rose-500/10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Identified Skill Gaps</h4>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                These are the critical technologies you are currently missing for this role. We will use these to generate your learning roadmap.
              </p>
              
              <div className="flex flex-wrap gap-2">
                {roadmap.missingSkills && roadmap.missingSkills.length > 0 ? (
                  roadmap.missingSkills.map((skill) => (
                    <Badge key={skill} tone="danger" className="bg-rose-500/10 border-rose-500/20 text-rose-200">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-slate-500 italic">No major skill gaps identified! You might already be ready.</span>
                )}
              </div>
            </div>
          </div>

          {/* THE "NEXT" CTA */}
          <div className="mt-8 flex justify-end pt-4 border-t border-white/5">
            <Button onClick={() => navigate('/app/roadmap')} className="bg-violet-500 hover:bg-violet-400 text-white font-semibold px-6 py-2 border-none">
              Proceed to Roadmap Generation →
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}