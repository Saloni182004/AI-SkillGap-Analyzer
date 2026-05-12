import { useMemo, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'
import { decodeJwtPayload, type JwtClaims } from '@/lib/jwt'
import { getToken } from '@/lib/storage'

type User = NonNullable<ReturnType<typeof useAuth>['user']>

function SettingsPanels({
  user,
  setDisplayName,
  logout,
}: {
  user: User
  setDisplayName: (name: string) => void
  logout: () => void
}) {
  const [name, setName] = useState(user.displayName)
  const [saved, setSaved] = useState<string | null>(null)

  const token = getToken()
  const claims = useMemo(() => (token ? decodeJwtPayload<JwtClaims>(token) : null), [token])

  const onSave = (e: FormEvent) => {
    e.preventDefault()
    setDisplayName(name)
    setSaved('Preferences saved locally.')
    window.setTimeout(() => setSaved(null), 2500)
  }

  const apiBase = import.meta.env.VITE_API_BASE_URL || '(same-origin · Vite proxy to gateway)'

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Profile</p>
        <h2 className="font-display text-3xl font-semibold text-white">Settings</h2>
        <p className="mt-2 text-slate-400">
          The auth service issues JWTs without a dedicated profile endpoint, so display names are stored
          locally for UI polish. Email and identifiers come from the signed token.
        </p>
      </div>

      <Card>
        <form className="space-y-4" onSubmit={onSave}>
          <Input label="Display name" name="displayName" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email (read only)" name="email" value={user.email} readOnly className="opacity-70" />
          <Button type="submit">Save preferences</Button>
          {saved ? <p className="text-sm text-emerald-300">{saved}</p> : null}
        </form>
      </Card>

      <Card>
        <h3 className="font-display text-lg font-semibold text-white">Session diagnostics</h3>
        <dl className="mt-4 space-y-2 text-left text-sm text-slate-300">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <dt className="text-slate-500">User ID</dt>
            <dd className="font-mono text-xs text-cyan-200">{claims?.userId ?? '—'}</dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <dt className="text-slate-500">Token exp (unix)</dt>
            <dd className="font-mono text-xs text-cyan-200">{claims?.exp ? String(claims.exp) : '—'}</dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <dt className="text-slate-500">API base URL</dt>
            <dd className="max-w-xl break-all font-mono text-xs text-cyan-200">{apiBase}</dd>
          </div>
        </dl>
        <Button type="button" variant="danger" className="mt-6" onClick={logout}>
          Log out everywhere on this device
        </Button>
      </Card>
    </div>
  )
}

export default function SettingsPage() {
  const { user, setDisplayName, logout } = useAuth()
  if (!user) return null

  return (
    <SettingsPanels
      key={`${user.userId}-${user.displayName}`}
      user={user}
      setDisplayName={setDisplayName}
      logout={logout}
    />
  )
}
