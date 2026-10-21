import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { session, loading, isSupabaseConfigured } = useAuth()

  if (!isSupabaseConfigured) return <Navigate to="/admin/login" replace />
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-ink-muted text-sm">
        Loading…
      </div>
    )
  }
  if (!session) return <Navigate to="/admin/login" replace />
  return children
}
