import Section from '../components/ui/Section'
import { FadeIn, Card } from '../components/ui/Primitives'
import { BadgeCheck, ExternalLink } from 'lucide-react'

function fmtDate(d) {
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date)) return d
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function Certifications({ certifications = [] }) {
  if (!certifications.length) return null
  return (
    <Section id="certifications" eyebrow="Verified learning" title="Certifications">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c, i) => (
          <FadeIn key={c.id} delay={i * 0.05}>
            <Card className="flex h-full flex-col p-6">
              {c.image_url && (
                <img src={c.image_url} alt={`${c.title} certificate`} className="mb-4 h-40 w-full rounded-xl border border-bg-border object-contain" loading="lazy" />
              )}
              <BadgeCheck size={20} className="mb-3 text-accent-blue" />
              <h3 className="font-display text-base font-semibold leading-snug">{c.title}</h3>
              <p className="mt-1 text-xs text-ink-faint">
                {c.issuer || 'Issuer not yet confirmed'} {c.issue_date && `· ${fmtDate(c.issue_date)}`}
              </p>
              {c.credential_url && (
                <a
                  href={c.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-accent-blue hover:underline"
                >
                  View credential <ExternalLink size={12} />
                </a>
              )}
            </Card>
          </FadeIn>
        ))}
      </div>
    </Section>
  )
}
