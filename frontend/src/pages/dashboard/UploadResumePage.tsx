import { useRef, useState } from 'react'

import { getErrorMessage } from '@/api/client'
import { uploadResume } from '@/api/resumeApi'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import type { ExtractedProfile } from '@/types/api'

export default function UploadResumePage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [profile, setProfile] = useState<ExtractedProfile | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onChoose = () => inputRef.current?.click()

  const onFile = (f: File | null) => {
    setFile(f)
    setProfile(null)
    setMessage(null)
    setError(null)
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const res = await uploadResume(file)
      setProfile(res.profile)
      setMessage(res.message)
    } catch (err) {
      setError(getErrorMessage(err, 'Upload failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Resume ingestion</p>
        <h2 className="font-display text-3xl font-semibold text-white">Upload your resume</h2>
        <p className="mt-2 text-slate-400">
          Files are posted to{' '}
          <code className="rounded bg-black/40 px-1.5 py-0.5 text-xs text-cyan-200">
            POST /api/resumes/upload
          </code>{' '}
          with your JWT. Supported types follow the Python extractor (PDF, DOCX, etc.).
        </p>
      </div>

      <Card>
        <div
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-surface-0/60 px-6 py-12 text-center transition hover:border-cyan-400/40"
          onClick={onChoose}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onChoose()
          }}
          role="button"
          tabIndex={0}
        >
          <p className="text-sm font-medium text-slate-200">Drop or select a file</p>
          <p className="text-xs text-slate-500">We never store the file in the browser after upload.</p>
          <Button type="button" variant="secondary" size="sm" onClick={(e) => e.stopPropagation()}>
            Browse files
          </Button>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {file ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-slate-200">
            <span className="truncate">{file.name}</span>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => onFile(null)}>
                Clear
              </Button>
              <Button type="button" size="sm" onClick={handleUpload} disabled={loading}>
                {loading ? <Spinner label="Uploading" /> : 'Upload & parse'}
              </Button>
            </div>
          </div>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
            {message}
          </p>
        ) : null}
      </Card>

      {profile ? (
        <Card>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl font-semibold text-white">Structured profile</h3>
            <Badge tone="success">Validated</Badge>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 text-left text-sm text-slate-300">
              <p>
                <span className="text-slate-500">Name:</span> {profile.basics.name}
              </p>
              <p>
                <span className="text-slate-500">Title:</span> {profile.basics.current_job_title}
              </p>
              <p>
                <span className="text-slate-500">Experience:</span> {profile.basics.total_years_experience}{' '}
                yrs
              </p>
            </div>
            <div className="text-left text-sm text-slate-300">
              <p className="text-slate-500">Core skills</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.core_skills.slice(0, 12).map((skill) => (
                  <Badge key={skill} tone="neutral">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
