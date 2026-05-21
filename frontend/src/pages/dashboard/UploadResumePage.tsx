import { useEffect, useRef, useState } from 'react'

import { getErrorMessage } from '@/api/client'
import { fetchCurrentProfile, uploadResume } from '@/api/resumeApi'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import type { ExtractedProfile } from '@/types/api'

export default function UploadResumePage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [profile, setProfile] = useState<ExtractedProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [isExistingProfile, setIsExistingProfile] = useState(false)

  // Fetch the user's existing profile when the page loads
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetchCurrentProfile()
        if (res.profile) {
          setProfile(res.profile)
          setIsExistingProfile(true)
        }
      } catch (err: any) {
        // A 404 just means they haven't uploaded a resume yet, which is perfectly fine.
        if (err.response?.status !== 404) {
          console.error("Failed to load existing profile", err)
        }
      } finally {
        setLoadingInitial(false)
      }
    }
    loadProfile()
  }, [])

  const onChoose = () => inputRef.current?.click()

  const onFile = (f: File | null) => {
    setFile(f)
    // We do NOT clear the existing profile here so they can still see it while choosing a new file
    setError(null)
  }

  const handleUpload = async () => {
    if (!file) return
    setLoadingUpload(true)
    setError(null)
    try {
      const res = await uploadResume(file)
      setProfile(res.profile)
      setIsExistingProfile(false) // It is now a freshly extracted profile
    } catch (err) {
      setError(getErrorMessage(err, 'Upload failed'))
    } finally {
      setLoadingUpload(false)
    }
  }

  if (loadingInitial) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label="Loading your profile..." />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Dynamic Header */}
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Step 1</p>
        <h2 className="font-display text-3xl font-semibold text-white">
          {isExistingProfile ? 'Update Your Resume' : 'Upload Your Resume'}
        </h2>
        <p className="mt-2 text-slate-400">
          {isExistingProfile 
            ? 'We already have your skills on file! Upload a new resume below if you want to overwrite your current baseline.' 
            : 'We use this to extract your core skills and build your baseline profile. We never store your actual file permanently.'}
        </p>
      </div>

      {/* Upload Zone */}
      <Card>
        <div
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-surface-0/60 px-6 py-12 text-center transition hover:border-cyan-400/40 hover:bg-surface-1/40"
          onClick={onChoose}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onChoose()
          }}
          role="button"
          tabIndex={0}
        >
          <div className="rounded-full bg-cyan-500/10 p-4 mb-2">
            <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-200">Drop your PDF or DOCX here</p>
          <p className="text-xs text-slate-500">Or click to browse your files</p>
          <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={(e) => e.stopPropagation()}>
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

        {file && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-slate-200">
            <span className="truncate font-medium text-cyan-100">{file.name}</span>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => onFile(null)}>
                Clear
              </Button>
              <Button type="button" size="sm" onClick={handleUpload} disabled={loadingUpload}>
                {loadingUpload ? <Spinner label="Analyzing..." /> : (isExistingProfile ? 'Overwrite Profile' : 'Extract Skills')}
              </Button>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
            {error}
          </p>
        )}
      </Card>

      {/* Dynamic Success State & Extracted Profile */}
      {profile && (
        <Card className="border-emerald-500/30 bg-surface-1/40">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-white flex items-center gap-2">
                {isExistingProfile ? 'Current Active Profile' : 'Profile Extracted Successfully'}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {isExistingProfile ? 'These are the skills currently powering your gap analysis.' : 'Here is what the AI found in your new resume.'}
              </p>
            </div>
            <Badge tone="success">{isExistingProfile ? 'Active Baseline' : 'Verified Baseline'}</Badge>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3 text-left text-sm text-slate-300">
              <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Name</p>
                <p className="font-medium text-slate-200">{profile.basics.name}</p>
              </div>
              <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Title</p>
                <p className="font-medium text-slate-200">{profile.basics.current_job_title}</p>
              </div>
              <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Experience</p>
                <p className="font-medium text-slate-200">{profile.basics.total_years_experience} years</p>
              </div>
            </div>
            
            <div className="text-left text-sm text-slate-300 bg-black/20 p-4 rounded-lg border border-white/5">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Extracted Core Skills</p>
              <div className="flex flex-wrap gap-2">
                {profile.core_skills.length > 0 ? (
                  profile.core_skills.slice(0, 15).map((skill) => (
                    <Badge key={skill} tone="neutral" className="bg-surface-2 border-white/10">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-slate-500 italic">No technical skills detected.</span>
                )}
              </div>
            </div>
          </div>

          {/* THE "NEXT" CTA */}
          <div className="mt-8 flex justify-end pt-4 border-t border-white/5">
            <Button to="/app/analyze" className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-6 py-2">
              Continue to Gap Analysis →
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}