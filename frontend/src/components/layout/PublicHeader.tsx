import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'

export function PublicHeader() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-surface-0/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="font-display text-lg font-semibold tracking-tight text-white">
          SkillGap<span className="text-cyan-400">.</span>AI
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#features"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
          >
            Product
          </a>
          <a
            href="#flow"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
          >
            How it works
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button to="/app" variant="primary" size="sm">
              Dashboard
            </Button>
          ) : (
            <>
              <Button to="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button to="/register" variant="primary" size="sm">
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
