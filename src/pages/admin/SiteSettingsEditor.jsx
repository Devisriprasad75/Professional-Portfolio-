import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { getSingleton, upsertSingleton } from '../../lib/adminQueries'
import { Button, Card } from '../../components/ui/Primitives'
import { siteSettings as fallbackSettings } from '../../data/fallbackContent'

const SECTIONS = [
  ['home', 'Home'],
  ['about', 'About'],
  ['education', 'Education'],
  ['experience', 'Experience & Learning'],
  ['skills', 'Skills'],
  ['projects', 'Projects'],
  ['achievements', 'Achievements'],
  ['certifications', 'Certifications'],
  ['resume', 'Resume'],
  ['contact', 'Contact'],
]

export default function SiteSettingsEditor() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    getSingleton('site_settings')
      .then((row) => setSettings({ ...row, sections: { ...fallbackSettings.sections, ...row.sections } }))
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setNotice('')
    try {
      await upsertSingleton('site_settings', settings.id, { sections: settings.sections })
      setNotice('Section visibility saved.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex items-center gap-2 text-sm text-ink-muted"><Loader2 className="animate-spin" size={16} /> Loading…</div>
  }
  if (!settings) return <p className="text-sm text-red-400">{error || 'Site settings not found.'}</p>

  return (
    <div className="max-w-3xl">
      <h2 className="mb-2 font-display text-xl font-semibold">Public sections</h2>
      <p className="mb-5 text-sm text-ink-muted">Choose which sections appear on your public portfolio.</p>
      {notice && <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">{notice}</div>}
      {error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>}
      <Card className="space-y-2 p-5">
        {SECTIONS.map(([key, label]) => (
          <label key={key} className="flex items-center justify-between gap-4 rounded-xl border border-bg-border bg-bg-raised px-4 py-3">
            <span className="text-sm font-medium">{label}</span>
            <input
              type="checkbox"
              checked={settings.sections[key] !== false}
              onChange={(event) => setSettings((current) => ({
                ...current,
                sections: { ...current.sections, [key]: event.target.checked },
              }))}
              className="h-4 w-4 accent-accent-blue"
            />
          </label>
        ))}
        <Button variant="primary" onClick={handleSave} disabled={saving} className="w-full">
          {saving ? 'Saving…' : 'Save visibility'}
        </Button>
      </Card>
    </div>
  )
}
