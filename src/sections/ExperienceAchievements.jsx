import Section from '../components/ui/Section'
import { FadeIn, Card } from '../components/ui/Primitives'
import { BookOpen, Trophy } from 'lucide-react'

export function Experience({ experience = [] }) {
  if (!experience.length) return null
  return (
    <Section id="experience" eyebrow="Still growing" title="Experience" titleAccent="& Learning">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {experience.map((e, i) => (
          <FadeIn key={e.id} delay={i * 0.06}>
            <Card className="p-6">
              <div className="mb-2 flex items-center gap-3">
                <BookOpen size={18} className="text-accent-blue" />
                <span className="rounded-full bg-bg-raised px-2.5 py-0.5 text-sm font-medium text-ink-muted">{e.type}</span>
              </div>
              <h3 className="font-display text-lg font-semibold">{e.title}</h3>
              <p className="text-sm text-ink-muted">{e.organization}</p>
              {(e.start_date || e.end_date) && (
                <p className="mt-1 text-sm text-ink-faint">
                  {[e.start_date, e.end_date].filter(Boolean).map((date) =>
                    new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  ).join(' – ')}
                </p>
              )}
              {e.description && <p className="mt-2 text-sm text-ink-faint">{e.description}</p>}
            </Card>
          </FadeIn>
        ))}
      </div>
    </Section>
  )
}

export function Achievements({ achievements = [] }) {
  if (!achievements.length) return null
  return (
    <Section id="achievements" eyebrow="Recognition" title="Achievements">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {achievements.map((a, i) => (
          <FadeIn key={a.id} delay={i * 0.06}>
            <Card className="flex gap-4 p-6">
              <Trophy size={20} className="mt-0.5 shrink-0 text-accent-violet" />
              <div>
                <h3 className="font-display text-lg font-semibold">{a.title}</h3>
                {a.issuer && <p className="text-sm text-ink-muted">{a.issuer}</p>}
                {a.date && <p className="mt-1 text-sm text-ink-faint">{new Date(a.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>}
                {a.description && <p className="mt-2 text-sm text-ink-faint">{a.description}</p>}
              </div>
            </Card>
          </FadeIn>
        ))}
      </div>
    </Section>
  )
}
