import { startTransition, useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { getErrorMessage } from '@/api/client'
import { addCustomSkill, fetchMissingSkills, generateRoadmap, fetchActiveRoadmap, toggleMilestoneStatus } from '@/api/roadmapApi'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import type { RoadmapMilestone } from '@/types/api'

type PagePhase = 'loading' | 'build' | 'active'

export default function RoadmapPage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<PagePhase>('loading')
  
  // Build Phase State
  const [skills, setSkills] = useState<string[]>([])
  const [skillName, setSkillName] = useState('')
  const [adding, setAdding] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Active Phase State
  const [plan, setPlan] = useState<RoadmapMilestone[]>([])

  // 1. Initial Load: Check if they already have an active roadmap
  useEffect(() => {
    const initializePage = async () => {
      try {
        const roadmap = await fetchActiveRoadmap()
        if (roadmap?.weeklyPlan && roadmap.weeklyPlan.length > 0) {
          // They already have a generated plan! Show the tracker.
          setPlan(roadmap.weeklyPlan)
          setPhase('active')
        } else {
          // No active plan yet. Load skills for the builder.
          await loadSkillsForBuilder()
          setPhase('build')
        }
      } catch (err: any) {
        // 404 means no roadmap exists at all, switch to build mode
        if (err.response?.status === 404) {
          await loadSkillsForBuilder()
          setPhase('build')
        } else {
          setErrorMsg(getErrorMessage(err, 'Failed to load roadmap data.'))
          setPhase('build')
        }
      }
    }
    initializePage()
  }, [])

  const loadSkillsForBuilder = async () => {
    try {
      const res = await fetchMissingSkills()
      setSkills(res.missingSkills ?? [])
    } catch (err) {
      setErrorMsg('Unable to load skills. Have you run the Gap Analysis yet?')
    }
  }

  // The function to switch back to the builder from the active phase
  const handleRegenerate = async () => {
    setPhase('loading')
    await loadSkillsForBuilder()
    setPhase('build')
  }

  const onAddSkill = async (e: FormEvent) => {
    e.preventDefault()
    if (!skillName.trim()) return
    setAdding(true)
    try {
      const res = await addCustomSkill(skillName.trim())
      setSkills(res.allMissingSkills ?? [])
      setSkillName('')
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Unable to add custom skill'))
    } finally {
      setAdding(false)
    }
  }

  const onGenerate = async () => {
    setGenerating(true)
    setErrorMsg(null)
    try {
      const res = await generateRoadmap()
      setPlan(res.roadmap.weeklyPlan ?? [])
      setPhase('active') // Switch to active tracking mode!
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Roadmap generation failed. Please try again.'))
    } finally {
      setGenerating(false)
    }
  }

  const onToggleMilestone = async (week: string, currentStatus: boolean) => {
    try {
      // Optimistic UI update for snappy feel
      setPlan(prev => prev.map(m => m.week === week ? { ...m, completed: !currentStatus } : m))
      // Background API call
      await toggleMilestoneStatus(week, !currentStatus)
    } catch (err) {
      console.error("Failed to toggle milestone", err)
      // Revert if failed
      setPlan(prev => prev.map(m => m.week === week ? { ...m, completed: currentStatus } : m))
    }
  }

  if (phase === 'loading') {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label="Loading your roadmap..." />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Dynamic Header */}
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Step 3</p>
        <h2 className="font-display text-3xl font-semibold text-white">
          {phase === 'active' ? 'Active Learning Tracker' : 'Build Learning Roadmap'}
        </h2>
        <p className="mt-2 text-slate-400">
          {phase === 'active' 
            ? 'Track your progress week by week. Mark milestones complete as you finish them.' 
            : 'We will turn your missing skills into a structured execution plan. Add any specific goals before generating.'}
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 flex flex-col gap-3">
          <p>{errorMsg}</p>
          {phase === 'build' && skills.length === 0 && (
            <Button onClick={() => navigate('/app/analyze')} variant="secondary" size="sm" className="w-fit">
              ← Go to Gap Analysis
            </Button>
          )}
        </div>
      )}

      {/* ========================================================
          BUILD PHASE UI (Only shows if no roadmap is generated)
          ======================================================== */}
      {phase === 'build' && (
        <>
          <Card className="border-cyan-500/20">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-white">Target Skills for Upskilling</h3>
                <p className="text-sm text-slate-400 mt-1">Sourced from your Gap Analysis.</p>
              </div>
            </div>

            <div className="space-y-6">
              {skills.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No skills loaded. Please run the gap analysis first.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} tone="neutral" className="bg-surface-2 border-white/10 px-3 py-1.5 text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-white/5">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Have a specific tool you want to learn? Add it to the curriculum:
                </label>
                <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={onAddSkill}>
                  <div className="flex-1">
                    <Input placeholder="e.g., GraphQL, Kubernetes..." name="skillName" value={skillName} onChange={(e) => setSkillName(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={adding || !skillName.trim()} variant="secondary">
                    {adding ? <Spinner label="Adding" /> : 'Add to Curriculum'}
                  </Button>
                </form>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-950/40 to-surface-1 border-emerald-500/20">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-display text-xl font-semibold text-white">Synthesize Learning Plan</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-md">
                  Our AI will break down your target skills into actionable weekly milestones and recommend specific resources.
                </p>
              </div>
              <Button type="button" onClick={() => void onGenerate()} disabled={generating || skills.length === 0} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 border-none shrink-0">
                {generating ? <Spinner label="Synthesizing..." /> : 'Generate Roadmap'}
              </Button>
            </div>
          </Card>
        </>
      )}

      {/* ========================================================
          ACTIVE PHASE UI (Shows if a roadmap exists)
          ======================================================== */}
      {phase === 'active' && (
        <div className="space-y-6 pt-2">
          
          {/* REGENERATE BUTTON ADDED HERE */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-2xl font-semibold text-white">Your Weekly Milestones</h3>
              <Badge tone="success">Plan Ready</Badge>
            </div>
            <Button onClick={handleRegenerate} variant="secondary" size="sm" className="shrink-0 border-white/10 hover:bg-surface-2 text-slate-300">
              Edit / Regenerate Plan
            </Button>
          </div>
          
          <div className="relative border-l border-emerald-500/20 ml-3 pl-6 space-y-8 pb-4">
            {plan.map((m, index) => {
              const isCompleted = m.completed;
              return (
                <div key={m.week} className="relative transition-all duration-300">
                  {/* Timeline Node */}
                  <div className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full transition-colors ${isCompleted ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'bg-surface-3 border-2 border-emerald-500/50'}`} />
                  
                  <Card className={`border-white/5 transition-all duration-300 ${isCompleted ? 'bg-surface-0/40 border-emerald-500/20' : 'bg-surface-1/60 hover:bg-surface-2/40'}`}>
                    
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex flex-1 min-w-0 items-start gap-3">
                        <Badge tone={isCompleted ? "success" : "accent"} className={`mt-0.5 shrink-0 ${!isCompleted ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" : ""}`}>
                          Week {index + 1}
                        </Badge>
                        <span className={`font-display text-lg font-medium break-words transition-colors ${isCompleted ? 'text-emerald-500 line-through opacity-70' : 'text-white'}`}>
                          {m.topic}
                        </span>
                      </div>
                      
                      <Button 
                        type="button" 
                        size="sm" 
                        onClick={() => onToggleMilestone(m.week, !!isCompleted)}
                        className={`shrink-0 whitespace-nowrap transition-all duration-200 ${
                          isCompleted 
                            ? 'bg-transparent text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10' 
                            : 'bg-emerald-500 text-slate-900 hover:bg-emerald-400 border-none'
                        }`}
                      >
                        {isCompleted ? '✓ Completed' : 'Mark as Complete'}
                      </Button>
                    </div>
                    
                    <div className={`grid gap-6 md:grid-cols-2 transition-opacity duration-300 ${isCompleted ? 'opacity-40' : 'opacity-100'}`}>
                      <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                        <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-3">Action Items</p>
                        <ul className="list-disc space-y-2 pl-4 text-sm text-slate-300 marker:text-cyan-500 break-words">
                          {m.learning_goals.map((goal) => <li key={goal}>{goal}</li>)}
                        </ul>
                      </div>
                      <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                        <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-3">Recommended Resources</p>
                        <ul className="list-disc space-y-2 pl-4 text-sm text-slate-300 marker:text-violet-400 break-words">
                          {m.recommended_resources.map((r) => <li key={r}>{r}</li>)}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/5">
            <p className="text-sm text-slate-400">Ready to test your newly acquired skills?</p>
            <Button onClick={() => navigate('/app/interview')} className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-6 py-2 border-none">
              Start Mock Interview →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}