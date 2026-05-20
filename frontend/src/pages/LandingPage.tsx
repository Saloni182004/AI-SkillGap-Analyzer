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
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-white/5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(167,139,250,0.2),transparent_45%)]" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:py-24">
            <div className="flex-1 space-y-6 text-left">
              <motion.div custom={0} initial="hidden" animate="show" variants={fadeUp}>
                <Badge tone="accent">AI-Powered Career Intelligence</Badge>
              </motion.div>
              <motion.h1
                custom={1}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl"
              >
                Close the gap between your resume and your dream role.
              </motion.h1>
              <motion.p
                custom={2}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                className="max-w-xl text-lg text-slate-400"
              >
                Upload your resume, discover the exact market skills you are missing, generate a personalized weekly learning roadmap, and ace your next technical interview with our AI grader.
              </motion.p>
              <motion.div
                custom={3}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                className="flex flex-wrap gap-3"
              >
                <Button to="/register" size="lg">
                  Start your journey
                </Button>
                <Button to="/login" variant="secondary" size="lg">
                  Sign in
                </Button>
              </motion.div>
              <motion.p
                custom={4}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                className="text-xs text-slate-500"
              >
              </motion.p>
            </div>
            
            {/* PIPELINE CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex-1"
            >
              <Card className="relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-surface-2 to-surface-1">
                <div className="absolute right-4 top-4 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-emerald-400/40">
                  Live System Activity
                </div>
                <div className="mt-8 space-y-4 text-left">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>1. Resume Ingestion</span>
                    <span className="text-cyan-300">FastAPI Parsing</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-2 w-[100%] rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>2. Market Gap Analysis</span>
                    <span className="text-violet-300">LLM Evaluation</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-2 w-[80%] rounded-full bg-gradient-to-r from-violet-400 to-emerald-400" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>3. Roadmap Synthesis</span>
                    <span className="text-emerald-300">Milestone Generation</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-2 w-[60%] rounded-full bg-gradient-to-r from-emerald-400 to-amber-400" />
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>4. Mock Interview</span>
                    <span className="text-amber-300">Real-time AI Grading</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-2 w-[40%] rounded-full bg-gradient-to-r from-amber-400 to-rose-400" />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="mb-10 max-w-2xl text-left">
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              Everything you need to level up.
            </h2>
            <p className="mt-3 text-slate-400">
              Stop guessing what skills you need. Our AI-driven pipeline gives you actionable insights mapped directly to the modern job market.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: 'Structured Resume Parsing',
                body: 'Instantly extract and categorize your core skills and tools from PDF or DOCX files using our dedicated FastAPI service.',
              },
              {
                title: 'Ruthless Gap Analysis',
                body: 'We compare your current profile against the top in-demand skills for your target role to surface your blind spots.',
              },
              {
                title: 'Actionable Roadmaps',
                body: 'Turn your missing skills into an accelerated, multi-week execution plan complete with curated learning goals.',
              },
              {
                title: 'AI Mock Interviews',
                body: 'Test your readiness before the real thing. Answer dynamically generated questions and get graded against a strict technical rubric.',
              },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: idx * 0.08, duration: 0.35 }}
              >
                <Card className="h-full border-white/5 bg-surface-1/60 hover:bg-surface-2/40 transition-colors">
                  <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{item.body}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section
          id="flow"
          className="border-y border-white/5 bg-gradient-to-b from-surface-1/40 to-surface-0"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-4 text-left">
              <Badge tone="warning">How It Works</Badge>
              <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
                From raw resume to interview ready.
              </h2>
              <ol className="space-y-4 mt-6 text-sm text-slate-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold text-xs border border-cyan-500/30">1</span>
                  <span><strong>Upload</strong> your resume to let our AI build your baseline profile.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 font-semibold text-xs border border-violet-500/30">2</span>
                  <span><strong>Analyze</strong> your profile against a target role to find critical skill gaps.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-500/30">3</span>
                  <span><strong>Generate</strong> a week-by-week learning roadmap to close those gaps.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-semibold text-xs border border-amber-500/30">4</span>
                  <span><strong>Practice</strong> with tailored AI mock interviews based on your new roadmap.</span>
                </li>
              </ol>
            </div>
            <Card className="flex-1 border-dashed border-cyan-400/30 bg-surface-2/60">
              <p className="text-sm font-medium text-slate-200">Built for Scale & Performance</p>
              <p className="mt-2 text-sm text-slate-400">
                Under the hood, this platform is powered by an advanced microservices architecture. Our custom API Gateway routes traffic securely via JWT interceptors to specialized Node.js and Python (FastAPI) clusters.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['React 19', 'Vite 8', 'Tailwind 4', 'Node.js', 'FastAPI', 'Qwen 2.5 LLM', 'MongoDB', 'API Gateway'].map((chip) => (
                  <Badge key={chip} tone="neutral">
                    {chip}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Ready to transform your career?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Stop guessing what recruiters are looking for. Get data-driven insights and start upskilling today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/register" size="lg">
              Create free account
            </Button>
            <Button to="/login" variant="secondary" size="lg">
              Sign in
            </Button>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Already have an account?{' '}
            <Link className="text-cyan-300 underline-offset-4 hover:underline" to="/login">
              Log in here.
            </Link>
          </p>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} SkillGap Analyzer · Built by Vivek Kumar, Saloni, Soni Sharma, Sohini Sandhu.
      </footer>
    </div>
  )
}