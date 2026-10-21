import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Card } from '../../components/ui/Primitives'
import { listAll } from '../../lib/adminQueries'

const CONTENT = [
  ['education', 'Education'],
  ['skill_categories', 'Skill categories'],
  ['projects', 'Projects'],
  ['experience', 'Experience & learning'],
  ['achievements', 'Achievements'],
  ['certifications', 'Certifications'],
]

export default function DashboardOverview({ onOpenSection }) {
  const [counts, setCounts] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all(CONTENT.map(async ([table, label]) => [label, (await listAll(table)).length]))
      .then((results) => {
        if (active) setCounts(results)
      })
      .catch((loadError) => setError(loadError.message))
    return () => { active = false }
  }, [])

  return (
    <div>
      <h2 className="mb-2 font-display text-2xl font-semibold">Dashboard overview</h2>
      <p className="mb-6 text-sm text-ink-muted">Manage your public portfolio content and check its current status.</p>
      {error && <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}
      {!counts && !error ? (
        <div className="flex items-center gap-2 text-sm text-ink-muted"><Loader2 className="animate-spin" size={16} /> Loading overview…</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(counts || []).map(([label, count]) => (
            <Card key={label} className="p-5" hover={false}>
              <p className="text-sm text-ink-muted">{label}</p>
              <p className="mt-2 font-display text-3xl font-semibold">{count}</p>
            </Card>
          ))}
        </div>
      )}
      <Card className="mt-6 flex flex-wrap items-center justify-between gap-4 p-5" hover={false}>
        <div>
          <h3 className="font-display font-semibold">Need to update your content?</h3>
          <p className="mt-1 text-sm text-ink-muted">Edit published entries or prepare changes in the content managers.</p>
        </div>
        <button onClick={() => onOpenSection('projects')} className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet px-4 py-2.5 text-sm font-medium text-white hover:brightness-110">
          Manage projects
        </button>
      </Card>
    </div>
  )
}
