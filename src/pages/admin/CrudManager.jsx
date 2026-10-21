import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, Eye, EyeOff, Star, Loader2 } from 'lucide-react'
import { listAll, createRow, updateRow, deleteRow, uploadFile } from '../../lib/adminQueries'
import { Button, Card, Badge } from '../../components/ui/Primitives'

/**
 * fields: [{ key, label, type: 'text'|'textarea'|'array'|'boolean'|'select'|'date'|'number', options? }]
 */
export default function CrudManager({ table, title, fields, emptyRow, orderKey = 'order' }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // row object or null
  const [previewing, setPreviewing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listAll(table, orderKey)
      setRows(data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [table])

  const openNew = () => setEditing({ ...emptyRow, [orderKey]: rows.length + 1 })
  const openEdit = (row) => setEditing({ ...row })

  const handleChange = (key, value) => setEditing((e) => ({ ...e, [key]: value }))

  const handleImageUpload = async (field, file) => {
    if (!file) return
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Choose a JPG, PNG, WebP, or GIF image.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file must be under 5MB.')
      return
    }

    setSaving(true)
    setError('')
    try {
      const fileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
      const url = await uploadFile('project-images', `portfolio/${Date.now()}-${fileName}`, file)
      handleChange(field.key, url)
      setNotice('Image uploaded — save the entry to publish the URL.')
    } catch (uploadError) {
      setError(uploadError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const payload = { ...editing }
      const isNew = !payload.id
      delete payload.created_at
      if (isNew) {
        delete payload.id
        await createRow(table, payload)
        setNotice('Created successfully.')
      } else {
        const id = payload.id
        delete payload.id
        await updateRow(table, id, payload)
        setNotice('Saved successfully.')
      }
      setEditing(null)
      await load()
      setTimeout(() => setNotice(''), 2500)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setSaving(true)
    try {
      await deleteRow(table, id)
      setConfirmDelete(null)
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        <Button variant="primary" onClick={openNew}>
          <Plus size={15} /> Add New
        </Button>
      </div>

      {notice && (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
          {notice}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <Loader2 className="animate-spin" size={16} /> Loading…
        </div>
      ) : rows.length === 0 ? (
        <Card className="p-8 text-center text-sm text-ink-muted">No entries yet. Click "Add New" to create one.</Card>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <Card key={row.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium">{row[fields[0].key]}</p>
                  {row.featured && (
                    <Badge className="border-accent-violet/40 text-accent-violet">
                      <Star size={11} className="mr-1 inline" /> Featured
                    </Badge>
                  )}
                  {'published' in row && (
                    <Badge className={row.published ? 'text-emerald-400' : 'text-ink-faint'}>
                      {row.published ? <Eye size={11} className="mr-1 inline" /> : <EyeOff size={11} className="mr-1 inline" />}
                      {row.published ? 'Published' : 'Hidden'}
                    </Badge>
                  )}
                </div>
                {fields[1] && <p className="mt-0.5 truncate text-xs text-ink-faint">{String(row[fields[1].key] ?? '')}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button onClick={() => setPreviewing(row)} className="rounded-lg border border-bg-border p-2 text-ink-muted hover:text-ink" aria-label="Preview">
                  <Eye size={15} />
                </button>
                <button onClick={() => openEdit(row)} className="rounded-lg border border-bg-border p-2 text-ink-muted hover:text-ink" aria-label="Edit">
                  <Pencil size={15} />
                </button>
                {confirmDelete === row.id ? (
                  <>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="rounded-lg border border-red-500/40 bg-red-500/10 p-2 text-red-400"
                      aria-label="Confirm delete"
                      disabled={saving}
                    >
                      <Check size={15} />
                    </button>
                    <button onClick={() => setConfirmDelete(null)} className="rounded-lg border border-bg-border p-2 text-ink-muted" aria-label="Cancel delete">
                      <X size={15} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(row.id)}
                    className="rounded-lg border border-bg-border p-2 text-ink-muted hover:border-red-500/40 hover:text-red-400"
                    aria-label="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-bg-border bg-bg-surface p-6 sm:rounded-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display font-semibold">{editing.id ? 'Edit' : 'New'} {title.replace(/s$/, '')}</h3>
              <button onClick={() => setEditing(null)} className="text-ink-muted hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {notice && <p className="text-sm text-emerald-400">{notice}</p>}
              {fields.map((f) => (
                <FieldInput
                  key={f.key}
                  field={f}
                  value={editing[f.key]}
                  onChange={(v) => handleChange(f.key, v)}
                  onUpload={(file) => handleImageUpload(f, file)}
                />
              ))}
            </div>

            {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

            <div className="mt-6 flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setPreviewing(editing)}>
                <Eye size={15} /> Preview
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {previewing && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center" onClick={() => setPreviewing(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="entry-preview-title"
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-bg-border bg-bg-surface p-6 sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-accent-blue">Content preview</p>
                <h3 id="entry-preview-title" className="mt-1 font-display text-xl font-semibold">
                  {previewing[fields[0].key] || `New ${title.replace(/s$/, '')}`}
                </h3>
              </div>
              <button onClick={() => setPreviewing(null)} className="rounded-lg p-2 text-ink-muted hover:text-ink" aria-label="Close preview">
                <X size={18} />
              </button>
            </div>
            {fields.filter((field) => field.type === 'image' && previewing[field.key]).map((field) => (
              <img key={field.key} src={previewing[field.key]} alt={`${field.label} preview`} className="mb-5 max-h-72 w-full rounded-xl border border-bg-border object-cover" />
            ))}
            <div className="space-y-4">
              {fields.filter((field) => field.type !== 'boolean' && field.type !== 'image' && field.key !== orderKey).map((field) => {
                const value = previewing[field.key]
                if (!value || (Array.isArray(value) && value.length === 0)) return null
                const displayValue = Array.isArray(value) ? value.join(', ') : String(value)
                return (
                  <div key={field.key}>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-faint">{field.label}</p>
                    {field.key.endsWith('_url') && /^https?:\/\//i.test(displayValue) ? (
                      <a href={displayValue} target="_blank" rel="noreferrer" className="break-all text-sm text-accent-blue hover:underline">{displayValue}</a>
                    ) : (
                      <p className="whitespace-pre-wrap break-words text-sm text-ink-muted">{displayValue}</p>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {'published' in previewing && <Badge>{previewing.published ? 'Published' : 'Draft / hidden'}</Badge>}
              {previewing.featured && <Badge className="text-accent-violet">Featured</Badge>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FieldInput({ field, value, onChange, onUpload }) {
  const base = 'w-full rounded-xl border border-bg-border bg-bg-raised px-4 py-2.5 text-sm outline-none focus:border-accent-blue/60'

  if (field.type === 'boolean') {
    return (
      <label className="flex items-center justify-between rounded-xl border border-bg-border bg-bg-raised px-4 py-2.5">
        <span className="text-sm text-ink-muted">{field.label}</span>
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-accent-blue" />
      </label>
    )
  }

  if (field.type === 'select') {
    return (
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-muted">{field.label}</label>
        <select value={value || ''} onChange={(e) => onChange(e.target.value)} className={base}>
          {field.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-muted">{field.label}</label>
        <textarea rows={4} value={value || ''} onChange={(e) => onChange(e.target.value)} className={base} />
      </div>
    )
  }

  if (field.type === 'array') {
    return (
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-muted">{field.label} (comma-separated)</label>
        <input
          value={Array.isArray(value) ? value.join(', ') : value || ''}
          onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          className={base}
        />
      </div>
    )
  }

  if (field.type === 'image') {
    return (
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-muted">{field.label}</label>
        {value && (
          <img src={value} alt="Selected upload preview" className="mb-3 h-32 w-full rounded-xl border border-bg-border object-cover" />
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(event) => {
            onUpload(event.target.files?.[0])
            event.target.value = ''
          }}
          className={`${base} file:mr-3 file:rounded-lg file:border-0 file:bg-bg-surface file:px-3 file:py-1.5 file:text-sm`}
        />
        <input
          type="url"
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Or paste an image URL"
          className={`${base} mt-2`}
        />
        <p className="mt-1 text-xs text-ink-faint">JPG, PNG, WebP, or GIF · up to 5MB</p>
      </div>
    )
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-muted">{field.label}</label>
      <input
        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
        value={value ?? ''}
        onChange={(e) => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)}
        className={base}
      />
    </div>
  )
}
