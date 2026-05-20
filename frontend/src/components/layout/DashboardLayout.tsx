import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/cn'

const items = [
  { to: '/app', end: true, label: 'Overview', icon: '◇' },
  { to: '/app/resume', label: 'Resume upload', icon: '▤' },
  { to: '/app/analyze', label: 'Gap analysis', icon: '◎' },
  { to: '/app/roadmap', label: 'AI roadmap', icon: '⎈' },
  { to: '/app/interview', label: 'Mock interview', icon: '💬' }, // <-- Added Mock Interview here!
  { to: '/app/trending', label: 'Trending skills', icon: '▲' },
  { to: '/app/settings', label: 'Profile & settings', icon: '⚙' },
] as const

function SidebarLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-1 px-3 py-4">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={'end' in item ? item.end : false}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
              isActive
                ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/10 text-white ring-1 ring-cyan-400/30'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-100',
            )
          }
        >
          <span className="text-base opacity-80" aria-hidden>
            {item.icon}
          </span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-svh bg-surface-0">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-surface-1/40 lg:flex">
        <div className="flex h-16 items-center border-b border-white/5 px-6">
          <NavLink to="/" className="font-display text-lg font-semibold text-white">
            SkillGap<span className="text-cyan-400">.</span>AI
          </NavLink>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarLinks />
        </div>
        <div className="border-t border-white/5 p-4">
          <p className="truncate text-xs text-slate-500">Signed in as</p>
          <p className="truncate text-sm font-medium text-slate-200">{user?.email}</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-white/5 bg-surface-0/90 px-4 backdrop-blur lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </Button>
          <span className="font-display text-base font-semibold text-white">Dashboard</span>
          <Button type="button" variant="ghost" size="sm" className="px-2" onClick={handleLogout}>
            Log out
          </Button>
        </header>

        <header className="hidden h-16 items-center justify-between border-b border-white/5 bg-surface-0/80 px-8 backdrop-blur lg:flex">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Workspace</p>
            <h1 className="font-display text-lg font-semibold text-white">
              Welcome back, {user?.displayName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button to="/" variant="ghost" size="sm">
              Marketing site
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            key="mobile-drawer"
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/60"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="absolute left-0 top-0 flex h-full w-72 flex-col bg-surface-1 shadow-2xl"
              initial={{ x: -40 }}
              animate={{ x: 0 }}
              exit={{ x: -40 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">
                <span className="font-display text-lg font-semibold text-white">Menu</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => setMobileOpen(false)}>
                  Close
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarLinks onNavigate={() => setMobileOpen(false)} />
              </div>
              <div className="mt-auto border-t border-white/5 p-4">
                <Button type="button" variant="danger" size="sm" className="w-full" onClick={handleLogout}>
                  Log out
                </Button>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}