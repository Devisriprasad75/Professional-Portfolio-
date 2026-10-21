import { useEffect, useState } from 'react'
import { Loader2, Trash2, Mail } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Card } from '../../components/ui/Primitives'

export default function MessagesViewer() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    const { data, error: err } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    if (err) setError(err.message)
    setMessages(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id) => {
    await supabase.from('contact_messages').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <h2 className="mb-5 font-display text-xl font-semibold">Messages</h2>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <Loader2 className="animate-spin" size={16} /> Loading…
        </div>
      ) : messages.length === 0 ? (
        <Card className="p-8 text-center text-sm text-ink-muted">
          <Mail className="mx-auto mb-2 text-ink-faint" size={22} /> No messages yet.
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <Card key={m.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <a href={`mailto:${m.email}`} className="text-xs text-accent-blue hover:underline">
                    {m.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-faint">{new Date(m.created_at).toLocaleString()}</span>
                  <button onClick={() => handleDelete(m.id)} className="text-ink-muted hover:text-red-400" aria-label="Delete message">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-ink-muted">{m.message}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
