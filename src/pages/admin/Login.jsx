import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Primitives'

export default function Login() {
  const { session, signIn, isSupabaseConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (session) return <Navigate to="/admin" replace />

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-6 text-center">
        <div className="max-w-md rounded-2xl border border-bg-border bg-bg-surface p-8">
          <AlertCircle className="mx-auto mb-3 text-amber-400" size={28} />
          <h1 className="font-display text-lg font-semibold">Admin not configured yet</h1>
          <p className="mt-2 text-sm text-ink-muted">
            This dashboard needs a Supabase project connected. Set <code className="text-accent-blue">VITE_SUPABASE_URL</code> and{' '}
            <code className="text-accent-blue">VITE_SUPABASE_ANON_KEY</code> in your <code>.env.local</code>, run the migrations, and
            create your admin account. See the README's "First Admin Setup" section.
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signIn(email, password)
    setLoading(false)
    if (err) setError(err.message || 'Unable to sign in. Please try again.')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-bg-border bg-bg-surface p-8 shadow-card">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-violet/20 text-accent-blue">
            <Lock size={18} />
          </div>
          <div>
            <h1 className="font-display font-semibold">Admin Login</h1>
            <p className="text-xs text-ink-faint">Owner access only</p>
          </div>
        </div>

        <label className="mb-1.5 block text-sm font-medium text-ink-muted">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-xl border border-bg-border bg-bg-raised px-4 py-2.5 text-sm outline-none focus:border-accent-blue/60"
        />

        <label className="mb-1.5 block text-sm font-medium text-ink-muted">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-5 w-full rounded-xl border border-bg-border bg-bg-raised px-4 py-2.5 text-sm outline-none focus:border-accent-blue/60"
        />

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>
    </div>
  )
}
