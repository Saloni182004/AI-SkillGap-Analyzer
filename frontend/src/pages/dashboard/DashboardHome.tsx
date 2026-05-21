import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const tiles = [
  {
    step: 'Step 1',
    title: 'Upload Resume',
    body: 'Securely upload your PDF or DOCX to let our AI build your baseline skill profile.',
    to: '/app/resume',
    accent: 'from-cyan-500/30 to-transparent',
    buttonText: 'Start Here',
  },
  {
    step: 'Step 2',
    title: 'Gap Analysis',
    body: 'Compare your extracted skills against your target role to discover your blind spots.',
    to: '/app/analyze',
    accent: 'from-violet-500/30 to-transparent',
    buttonText: 'Run Analysis',
  },
  {
    step: 'Step 3',
    title: 'Learning Roadmap',
    body: 'Transform your missing skills into a personalized, week-by-week upskilling plan.',
    to: '/app/roadmap',
    accent: 'from-emerald-500/25 to-transparent',
    buttonText: 'View Plan',
  },
  {
    step: 'Step 4',
    title: 'Mock Interview',
    body: 'Test your readiness. Answer dynamic technical questions graded by our strict AI rubric.',
    to: '/app/interview',
    accent: 'from-amber-500/25 to-transparent',
    buttonText: 'Practice Now',
  }
] as const

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
        <h2 className="font-display text-3xl font-semibold text-white">Your Career Command Center</h2>
        <p className="mt-2 max-w-2xl text-slate-400">
          Follow the steps below to identify your skill gaps and prepare for your next big role. 
          For the most accurate AI generation, please complete these steps in order.
        </p>
      </div>

      {/* 4-Step Pipeline Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Card key={tile.title} className="relative overflow-hidden border-white/5 hover:border-white/10 transition-colors">
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tile.accent} opacity-50`} />
            <div className="relative space-y-3 text-left flex flex-col h-full">
              <div>
                <Badge tone="neutral" className="mb-2 bg-black/40 border-white/10 text-xs">
                  {tile.step}
                </Badge>
                <h3 className="font-display text-xl font-semibold text-white">{tile.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{tile.body}</p>
              </div>
              
              {/* Push button to bottom so cards align nicely */}
              <div className="mt-auto pt-4">
                <Button to={tile.to} variant="secondary" size="sm" className="w-full justify-center">
                  {tile.buttonText}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Market Awareness Callout */}
      <Card className="border-cyan-400/20 bg-surface-2/40 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative">
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-semibold text-white">Market Intelligence</h3>
              <Badge tone="accent">Beta</Badge>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Not sure what target role to search for? Explore curated, real-time demand signals and trending tech stacks in the current job market.
            </p>
          </div>
          <Button to="/app/trending" variant="primary" size="md" className="shrink-0">
            Explore Trends
          </Button>
        </div>
      </Card>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-500">
        <p>Ensure your profile is up to date before interviewing.</p>
        <Link className="text-cyan-400 hover:underline transition-colors" to="/">
          ← Back to homepage
        </Link>
      </div>
    </div>
  )
}