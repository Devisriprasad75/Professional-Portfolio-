import { useState } from 'react'
import { Mail, Github, Linkedin, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import Section from '../components/ui/Section'
import { FadeIn, Card, Button } from '../components/ui/Primitives'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (form.message.trim().length < 10) e.message = 'Message should be at least 10 characters.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setStatus('sending')
    if (!isSupabaseConfigured) {
      // No backend configured yet — be honest instead of pretending to send.
      setStatus('error')
      setErrors({ form: 'The contact form backend is not configured yet. Please email me directly in the meantime.' })
      return
    }
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    })
    if (error) {
      setStatus('error')
      setErrors({ form: 'Something went wrong sending your message. Please try emailing me directly.' })
      return
    }
    setStatus('sent')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <Section id="contact" eyebrow="Let's talk" title="Contact" titleAccent="Me">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <FadeIn>
          <Card className="h-full p-7">
            <h3 className="font-display font-semibold">Get in touch</h3>
            <p className="mt-2 text-sm text-ink-muted">
              I'm currently open to new opportunities. Feel free to reach out — I'll get back to you as soon as I can.
            </p>
            <div className="mt-6 space-y-4 text-sm">
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="flex min-w-0 items-center gap-3 break-all text-ink-muted hover:text-ink">
                  <Mail size={16} className="text-accent-blue" /> {profile.email}
                </a>
              )}
              {profile?.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-ink-muted hover:text-ink">
                  <Github size={16} className="text-accent-blue" /> GitHub
                </a>
              )}
              {profile?.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-ink-muted hover:text-ink">
                  <Linkedin size={16} className="text-accent-blue" /> LinkedIn
                </a>
              )}
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.08}>
          <Card className="p-7">
            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <CheckCircle2 className="text-emerald-400" size={36} />
                <p className="font-display font-semibold">Message sent — thank you!</p>
                <p className="text-sm text-ink-muted">I'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-muted">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-xl border border-bg-border bg-bg-raised px-4 py-2.5 text-sm outline-none focus:border-accent-blue/60"
                    placeholder="Your name"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-muted">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-xl border border-bg-border bg-bg-raised px-4 py-2.5 text-sm outline-none focus:border-accent-blue/60"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-muted">Message</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full rounded-xl border border-bg-border bg-bg-raised px-4 py-2.5 text-sm outline-none focus:border-accent-blue/60"
                    placeholder="Tell me a bit about the opportunity or project..."
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                </div>

                {errors.form && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" /> {errors.form}
                  </div>
                )}

                <Button type="submit" variant="primary" className="w-full" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : (<><Send size={15} /> Send Message</>)}
                </Button>
              </form>
            )}
          </Card>
        </FadeIn>
      </div>
    </Section>
  )
}
