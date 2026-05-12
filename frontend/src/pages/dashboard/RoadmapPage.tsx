import { startTransition, useEffect, useState, type FormEvent } from 'react'

import { getErrorMessage } from '@/api/client'
import { addCustomSkill, fetchMissingSkills, generateRoadmap } from '@/api/roadmapApi'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import type { RoadmapMilestone } from '@/types/api'

export default function RoadmapPage() {
  const [skills, setSkills] = useState<string[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [listError, setListError] = useState<string | null>(null)

  const [skillName, setSkillName] = useState('')
  const [adding, setAdding] = useState(false)
  const [addMessage, setAddMessage] = useState<string | null>(null)

  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)
  const [plan, setPlan] = useState<RoadmapMilestone[] | null>(null)

  const loadSkills = async () => {
    setLoadingList(true)
    setListError(null)
    try {
      const res = await fetchMissingSkills()
      if (!res.success) {
        setSkills([])
        setListError(res.message)
        return
      }
      setSkills(res.missingSkills ?? [])
    } catch (err) {
      setSkills([])
      setListError(getErrorMessage(err, 'Unable to load skills'))
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    startTransition(() => {
      void loadSkills()
    })
  }, [])

  const onAddSkill = async (e: FormEvent) => {
    e.preventDefault()
    if (!skillName.trim()) return
    setAdding(true)
    setAddMessage(null)
    try {
      const res = await addCustomSkill(skillName.trim())
      setSkills(res.allMissingSkills ?? [])
      setAddMessage(res.message)
      setSkillName('')
    } catch (err) {
      setAddMessage(getErrorMessage(err, 'Unable to add skill'))
    } finally {
      setAdding(false)
    }
  }

  const onGenerate = async () => {
    setGenerating(true)
    setGenError(null)
    try {
      const res = await generateRoadmap()
      setPlan(res.roadmap.weeklyPlan ?? [])
    } catch (err) {
      setGenError(getErrorMessage(err, 'Generation failed'))
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">AI roadmap</p>
        <h2 className="font-display text-3xl font-semibold text-white">Plan the work to close gaps</h2>
        <p className="mt-2 text-slate-400">
          Skills are sourced from{' '}
          <code className="rounded bg-black/40 px-1.5 py-0.5 text-xs text-cyan-200">
            GET /api/roadmap/missing-skills
          </code>
          . Generating the roadmap calls{' '}
          <code className="rounded bg-black/40 px-1.5 py-0.5 text-xs text-cyan-200">
            POST /api/roadmap/generate-roadmap
          </code>
          .
        </p>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-white">Tracked skills</h3>
          <Button type="button" variant="ghost" size="sm" onClick={() => void loadSkills()}>
            Refresh
          </Button>
        </div>
        {loadingList ? (
          <Spinner label="Loading skills" />
        ) : listError ? (
          <p className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
            {listError}
          </p>
        ) : skills.length === 0 ? (
          <p className="text-sm text-slate-400">No skills yet. Run gap analysis first.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {skills.map((skill) => (
              <li
                key={skill}
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
              >
                {skill}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h3 className="font-display text-lg font-semibold text-white">Add a focus skill</h3>
        <p className="mt-1 text-sm text-slate-400">
          Optional: enrich the roadmap with a skill you want to emphasize.
        </p>
        <form className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={onAddSkill}>
          <div className="flex-1">
            <Input label="Skill name" name="skillName" value={skillName} onChange={(e) => setSkillName(e.target.value)} />
          </div>
          <Button type="submit" disabled={adding}>
            {adding ? <Spinner label="Saving" /> : 'Add skill'}
          </Button>
        </form>
        {addMessage ? <p className="mt-3 text-sm text-slate-300">{addMessage}</p> : null}
      </Card>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Generate roadmap</h3>
            <p className="text-sm text-slate-400">This can take up to two minutes while the LLM plans milestones.</p>
          </div>
          <Button type="button" onClick={() => void onGenerate()} disabled={generating || skills.length === 0}>
            {generating ? <Spinner label="Generating" /> : 'Generate roadmap'}
          </Button>
        </div>
        {genError ? (
          <p className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
            {genError}
          </p>
        ) : null}
      </Card>

      {plan && plan.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-display text-2xl font-semibold text-white">Weekly milestones</h3>
          <div className="grid gap-4">
            {plan.map((m) => (
              <Card key={m.week} className="border-cyan-400/15">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge tone="accent">{m.week}</Badge>
                  <span className="font-medium text-white">{m.topic}</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Learning goals</p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-300">
                      {m.learning_goals.map((goal) => (
                        <li key={goal}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Resources</p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-300">
                      {m.recommended_resources.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
