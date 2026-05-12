import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { TRENDING_SKILLS } from '@/data/trendingSkills'

const chartData = TRENDING_SKILLS.map((row) => ({
  name: row.skill.length > 22 ? `${row.skill.slice(0, 21)}…` : row.skill,
  demand: row.demandIndex,
  growth: row.growth,
}))

export default function TrendingSkillsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Market signals</p>
        <h2 className="font-display text-3xl font-semibold text-white">Trending skills</h2>
        <p className="mt-2 max-w-3xl text-slate-400">
          Your backend does not yet expose a labor-market endpoint, so this view ships with curated
          placeholder data wired through Recharts. Swap <code className="text-xs text-cyan-200">TRENDING_SKILLS</code>{' '}
          for a fetcher when analytics lands.
        </p>
      </div>

      <Card className="border-amber-400/20 bg-amber-500/5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="warning">Static dataset</Badge>
          <p className="text-sm text-amber-100">
            Values are illustrative composite scores, not live job postings.
          </p>
        </div>
      </Card>

      <Card className="h-[420px]">
        <h3 className="mb-4 font-display text-lg font-semibold text-white">Relative demand index</h3>
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={150}
                stroke="#94a3b8"
                tick={{ fill: '#cbd5f5', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid rgba(148,163,184,0.35)',
                  borderRadius: 12,
                  color: '#e2e8f0',
                }}
                formatter={(value, name) => {
                  const v = typeof value === 'number' ? value : Number(value)
                  const label = name === 'demand' ? 'Demand index' : 'YoY growth %'
                  return [Number.isFinite(v) ? String(v) : '—', label]
                }}
              />
              <Bar dataKey="demand" fill="#22d3ee" radius={[0, 8, 8, 0]} name="demand" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {TRENDING_SKILLS.slice(0, 4).map((row) => (
          <Card key={row.skill} className="border-white/5">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-medium text-white">{row.skill}</h4>
              <Badge tone="neutral">{row.category}</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Demand {row.demandIndex}/100 · Growth {row.growth}% YoY (illustrative)
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
