import Section from '../components/ui/Section'
import { FadeIn, Card } from '../components/ui/Primitives'
import { GraduationCap, MapPin, Mail } from 'lucide-react'

export default function About({ profile }) {
  return (
    <Section id="about" eyebrow="Get to know me" title="About" titleAccent="Me">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
        <FadeIn>
          <p className="text-lg leading-relaxed text-ink-muted">{profile?.about}</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <Card className="p-6">
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <GraduationCap size={18} className="mt-0.5 shrink-0 text-accent-blue" />
                <span className="text-ink-muted">B.Tech in Information Technology, expected 2027</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-accent-blue" />
                <span className="text-ink-muted">{profile?.location}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-accent-blue" />
                <a href={`mailto:${profile?.email}`} className="min-w-0 break-all text-ink-muted hover:text-ink">
                  {profile?.email}
                </a>
              </li>
            </ul>
          </Card>
        </FadeIn>
      </div>
    </Section>
  )
}
