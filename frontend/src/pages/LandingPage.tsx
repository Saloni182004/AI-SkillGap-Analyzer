import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { PublicHeader } from '@/components/layout/PublicHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.45, ease: 'easeOut' as const },
  }),
}

export default function LandingPage() {
  return (
    <div className="min-h-svh bg-surface-0">
      <PublicHeader />

      <main>
        <section className="relative overflow-hidden border-b border-white/5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(167,139,250,0.2),transparent_45%)]" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:py-24">
            <div className="flex-1 space-y-6 text-left">
              <motion.div custom={0} initial="hidden" animate="show" variants={fadeUp}>
                <Badge tone="accent">AI-native career intelligence</Badge>
              </motion.div>
              <motion.h1
                custom={1}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl"
              >
                Close the gap between your resume and your next role.
              </motion.h1>
              <motion.p
                custom={2}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                className="max-w-xl text-lg text-slate-400"
              >
                Upload a resume, let the orchestrator extract structured skills, run a targeted gap
                analysis, and receive an accelerated learning roadmap aligned with your goals.
              </motion.p>
              <motion.div
                custom={3}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                className="flex flex-wrap gap-3"
              >
                <Button to="/register" size="lg">
                  Create free account
                </Button>
                <Button to="/login" variant="secondary" size="lg">
                  I already have access
                </Button>
              </motion.div>
              <motion.p
                custom={4}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                className="text-xs text-slate-500"
              >
                JWT-secured gateway · microservice architecture · production-ready UI shell for your
                SkillGap Analyzer backend.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex-1"
            >
              <Card className="relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-surface-2 to-surface-1">
                <div className="absolute right-4 top-4 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-emerald-400/40">
                  Live pipeline
                </div>
                <div className="mt-8 space-y-4 text-left">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Resume ingestion</span>
                    <span className="text-cyan-300">FastAPI</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-2 w-[80%] rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Gap analysis</span>
                    <span className="text-violet-300">LLM orchestration</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-2 w-[60%] rounded-full bg-gradient-to-r from-violet-400 to-cyan-400" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Roadmap synthesis</span>
                    <span className="text-cyan-300">8-week plan</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-2 w-[66%] rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-xs text-slate-400">
                    <p className="font-mono text-[11px] text-cyan-200/90">
                      POST /api/resumes/upload → POST /api/roadmap/analyze → POST
                      /api/roadmap/generate-roadmap
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="mb-10 max-w-2xl text-left">
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              Everything you need to steer upskilling.
            </h2>
            <p className="mt-3 text-slate-400">
              Opinionated workflows map directly to your gateway routes so the UI stays thin and the
              backend remains the source of truth.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Structured profile extraction',
                body: 'Upload PDF or DOCX resumes and persist validated profiles keyed by your authenticated user.',
              },
              {
                title: 'Role-aware gap analysis',
                body: 'Compare extracted skills against a target role and surface missing capabilities in seconds.',
              },
              {
                title: 'Roadmap you can execute',
                body: 'Promote skills into a multi-week plan with milestones, goals, and curated resources.',
              },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: idx * 0.08, duration: 0.35 }}
              >
                <Card className="h-full border-white/5 bg-surface-1/60">
                  <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{item.body}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="flow"
          className="border-y border-white/5 bg-gradient-to-b from-surface-1/40 to-surface-0"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-4 text-left">
              <Badge tone="warning">Operational clarity</Badge>
              <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
                From raw resume to measurable weekly outcomes.
              </h2>
              <ol className="space-y-3 text-sm text-slate-300">
                <li>
                  <span className="font-semibold text-cyan-300">1.</span> Authenticate against{' '}
                  <code className="rounded bg-black/40 px-1.5 py-0.5 text-xs text-cyan-200">
                    /api/auth/*
                  </code>
                </li>
                <li>
                  <span className="font-semibold text-cyan-300">2.</span> Upload via{' '}
                  <code className="rounded bg-black/40 px-1.5 py-0.5 text-xs text-cyan-200">
                    /api/resumes/upload
                  </code>
                </li>
                <li>
                  <span className="font-semibold text-cyan-300">3.</span> Analyze with{' '}
                  <code className="rounded bg-black/40 px-1.5 py-0.5 text-xs text-cyan-200">
                    /api/roadmap/analyze
                  </code>
                </li>
                <li>
                  <span className="font-semibold text-cyan-300">4.</span> Generate roadmap via{' '}
                  <code className="rounded bg-black/40 px-1.5 py-0.5 text-xs text-cyan-200">
                    /api/roadmap/generate-roadmap
                  </code>
                </li>
              </ol>
            </div>
            <Card className="flex-1 border-dashed border-cyan-400/30 bg-surface-2/60">
              <p className="text-sm font-medium text-slate-200">Developer ergonomics</p>
              <p className="mt-2 text-sm text-slate-400">
                Axios client, JWT interceptors, centralized error parsing, and Vite proxy defaults keep
                local development aligned with your gateway on port{' '}
                <span className="font-mono text-cyan-200">5000</span>.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['React 19', 'Vite 8', 'Tailwind 4', 'Framer Motion', 'Recharts'].map((chip) => (
                  <Badge key={chip} tone="neutral">
                    {chip}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Ready to wire your production cluster?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Spin up the gateway, point <span className="font-mono text-cyan-200">VITE_API_BASE_URL</span>{' '}
            at your deployment, and ship this interface beside your existing services.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/register" size="lg">
              Start analyzing
            </Button>
            <Button to="/login" variant="secondary" size="lg">
              Sign in
            </Button>
            <Button to="/app" variant="ghost" size="lg" className="border border-white/10">
              View dashboard shell
            </Button>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Need an account first?{' '}
            <Link className="text-cyan-300 underline-offset-4 hover:underline" to="/register">
              Register
            </Link>{' '}
            — the backend issues JWTs on login.
          </p>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} SkillGap Analyzer · Frontend shell only.
      </footer>
    </div>
  )
}
