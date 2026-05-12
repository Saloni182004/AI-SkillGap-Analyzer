import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const tiles = [
  {
    title: 'Upload resume',
    body: 'Send a document through the gateway-proxied FastAPI parser.',
    to: '/app/resume',
    accent: 'from-cyan-500/30 to-transparent',
  },
  {
    title: 'Run gap analysis',
    body: 'Compare your structured profile with a target role.',
    to: '/app/analyze',
    accent: 'from-violet-500/30 to-transparent',
  },
  {
    title: 'Generate roadmap',
    body: 'Turn missing skills into a week-by-week execution plan.',
    to: '/app/roadmap',
    accent: 'from-emerald-500/25 to-transparent',
  },
] as const

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Control center</p>
        <h2 className="font-display text-3xl font-semibold text-white">Ship faster with guided flows</h2>
        <p className="mt-2 max-w-2xl text-slate-400">
          Each card maps to a gateway-backed workflow. Complete them in order for the best results —
          the roadmap service expects a resume profile before gap analysis.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {tiles.map((tile) => (
          <Card key={tile.title} className="relative overflow-hidden border-white/5">
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tile.accent}`} />
            <div className="relative space-y-3 text-left">
              <h3 className="font-display text-xl font-semibold text-white">{tile.title}</h3>
              <p className="text-sm text-slate-400">{tile.body}</p>
              <Button to={tile.to} variant="secondary" size="sm" className="mt-2">
                Open
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-cyan-400/20 bg-surface-2/40">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-left">
            <h3 className="font-display text-lg font-semibold text-white">Market awareness</h3>
            <p className="text-sm text-slate-400">
              Explore curated demand signals while you wait for a dedicated analytics service.
            </p>
          </div>
          <Button to="/app/trending" variant="primary" size="md">
            View trending skills
          </Button>
        </div>
      </Card>

      <p className="text-xs text-slate-500">
        Looking for raw responses? Open your browser devtools → Network while using the dashboard. All
        calls flow through{' '}
        <code className="rounded bg-black/40 px-1.5 py-0.5 text-[11px] text-cyan-200">apiClient</code>{' '}
        in <code className="rounded bg-black/40 px-1.5 py-0.5 text-[11px] text-cyan-200">src/api</code>.
      </p>

      <p className="text-xs text-slate-600">
        <Link className="text-cyan-400 hover:underline" to="/">
          ← Back to marketing site
        </Link>
      </p>
    </div>
  )
}
