import Section from '../components/ui/Section'
import { FadeIn, Card } from '../components/ui/Primitives'
import { GraduationCap, MapPin } from 'lucide-react'

export default function Education({ education = [] }) {
  if (!education.length) return null
  return (
    <Section id="education" eyebrow="My journey" title="Education">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {education.map((item, i) => (
          <FadeIn key={item.id} delay={i * 0.08} className="h-full">
            <Card className="flex h-full flex-col p-6 sm:p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-accent-blue/20 bg-accent-blue/10 text-accent-blue">
                <GraduationCap size={21} />
              </div>
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-display text-xl font-semibold">{item.degree}</h3>
                <span className="rounded-full border border-accent-blue/20 bg-accent-blue/10 px-3 py-1 font-mono text-xs text-accent-blue">
                  {item.start_date && `${new Date(item.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – `}
                  {item.end_label || (item.end_date && new Date(item.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))}
                </span>
              </div>
              <p className="text-base font-medium text-ink-muted">{item.institution}</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-ink-faint">
                <MapPin size={15} className="shrink-0 text-accent-blue" /> {item.location}
              </p>
              {item.details && <p className="mt-4 border-t border-bg-border pt-4 text-sm text-ink-muted">{item.details}</p>}
            </Card>
          </FadeIn>
        ))}
      </div>
    </Section>
  )
}
