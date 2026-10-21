import { useEffect, useRef, useState } from 'react'
import { Loader2, Upload } from 'lucide-react'
import { getSingleton, upsertSingleton, uploadFile } from '../../lib/adminQueries'
import { Button, Card } from '../../components/ui/Primitives'

const FIELDS = [
  { key: 'name', label: 'Full name' },
  { key: 'headline', label: 'Headline' },
  { key: 'intro', label: 'Hero introduction', type: 'textarea' },
  { key: 'about', label: 'About Me paragraph', type: 'textarea' },
  { key: 'email', label: 'Email' },
  { key: 'location', label: 'Location' },
  { key: 'github', label: 'GitHub URL' },
  { key: 'linkedin', label: 'LinkedIn URL' },
]

export default function ProfileEditor() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    getSingleton('profile')
      .then(setProfile)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const { id, ...payload } = profile
      await upsertSingleton('profile', id, payload)
      setNotice('Profile saved.')
      setTimeout(() => setNotice(''), 2500)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setError('Resume must be a PDF file.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Resume file must be under 10MB.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const url = await uploadFile('resumes', `resume-${Date.now()}.pdf`, file)
      setProfile((p) => ({ ...p, resumeUrl: url }))
      setNotice('Resume uploaded — remember to click Save.')
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-ink-muted">
        <Loader2 className="animate-spin" size={16} /> Loading…
      </div>
    )
  }
  if (!profile) return <p className="text-sm text-red-400">{error || 'Profile not found.'}</p>

  return (
    <div>
      <h2 className="mb-5 font-display text-xl font-semibold">Profile</h2>

      {notice && (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">{notice}</div>
      )}
      {error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>}

      <Card className="space-y-4 p-6">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="mb-1.5 block text-sm font-medium text-ink-muted">{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea
                rows={4}
                value={profile[f.key] || ''}
                onChange={(e) => setProfile((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full rounded-xl border border-bg-border bg-bg-raised px-4 py-2.5 text-sm outline-none focus:border-accent-blue/60"
              />
            ) : (
              <input
                value={profile[f.key] || ''}
                onChange={(e) => setProfile((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full rounded-xl border border-bg-border bg-bg-raised px-4 py-2.5 text-sm outline-none focus:border-accent-blue/60"
              />
            )}
          </div>
        ))}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-muted">Resume PDF</label>
          <div className="flex items-center gap-3">
            <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload} />
            <Button variant="secondary" type="button" onClick={() => fileRef.current?.click()}>
              <Upload size={15} /> Upload new resume
            </Button>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-accent-blue hover:underline">
                View current
              </a>
            )}
          </div>
        </div>

        <label className="flex items-center justify-between rounded-xl border border-bg-border bg-bg-raised px-4 py-2.5">
          <span className="text-sm text-ink-muted">Show "Open to opportunities" badge</span>
          <input
            type="checkbox"
            checked={!!profile.seekingOpportunities}
            onChange={(e) => setProfile((p) => ({ ...p, seekingOpportunities: e.target.checked }))}
            className="h-4 w-4 accent-accent-blue"
          />
        </label>

        <Button variant="primary" onClick={handleSave} disabled={saving} className="w-full">
          {saving ? 'Saving…' : 'Save Profile'}
        </Button>
      </Card>
    </div>
  )
}
