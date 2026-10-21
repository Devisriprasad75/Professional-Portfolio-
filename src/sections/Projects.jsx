import { Github, ExternalLink, ArrowUpRight, Code2 } from 'lucide-react'
import Section from '../components/ui/Section'
import { FadeIn, Card, Badge } from '../components/ui/Primitives'

export default function Projects({ projects = [] }) {
  if (!projects.length) return null
  return (
    <Section id="projects" eyebrow="Things I've built" title="Featured" titleAccent="Projects">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <FadeIn key={p.id} delay={i * 0.08}>
            <Card className="flex h-full flex-col overflow-hidden">
              <div className="flex aspect-video items-center justify-center bg-bg-raised">
                {p.thumbnail_url ? (
                  <img src={p.thumbnail_url} alt={p.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-accent-blue/15 via-bg-raised to-accent-violet/15 p-6 sm:p-8">
                    <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border border-accent-blue/15" />
                    <div className="pointer-events-none absolute -right-2 -top-10 h-44 w-44 rounded-full border border-accent-violet/20" />
                    <div className="relative flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">Project preview</span>
                      <span className="font-mono text-sm text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="relative flex flex-col items-center gap-5">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent-blue/20 bg-bg/40 text-accent-blue shadow-card">
                        <Code2 size={30} />
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {(p.technologies || []).slice(0, 4).map((technology) => (
                          <span key={technology} className="rounded-full border border-bg-border bg-bg/50 px-3 py-1 text-xs text-ink-muted">
                            {technology}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-sm font-medium ${
                      p.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <p className="text-sm text-ink-muted">{p.summary}</p>
                {p.description && <p className="mt-3 text-sm text-ink-faint">{p.description}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  {(p.technologies || []).map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
                {(p.github_url || p.live_url) && (
                  <div className="mt-auto flex gap-5 border-t border-bg-border pt-5">
                    {p.github_url && (
                      <a
                        href={p.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
                      >
                        <Github size={17} /> Source code <ArrowUpRight size={14} />
                      </a>
                    )}
                    {p.live_url && (
                      <a
                        href={p.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
                      >
                        <ExternalLink size={16} /> Live demo <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </FadeIn>
        ))}
      </div>
    </Section>
  )
}
