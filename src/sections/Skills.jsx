import * as Icons from 'lucide-react'
import Section from '../components/ui/Section'
import { FadeIn, Card, Badge } from '../components/ui/Primitives'

export default function Skills({ categories = [] }) {
  if (!categories.length) return null
  return (
    <Section id="skills" eyebrow="What I work with" title="My" titleAccent="Skills">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => {
          const Icon = Icons[cat.icon] || Icons.Code2
          return (
            <FadeIn key={cat.id} delay={i * 0.06}>
              <Card className="h-full p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-violet/20 text-accent-blue">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{cat.name}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(cat.skills || []).map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                </div>
              </Card>
            </FadeIn>
          )
        })}
      </div>
    </Section>
  )
}
