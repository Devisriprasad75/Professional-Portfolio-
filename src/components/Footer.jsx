import { Github, Linkedin, Mail } from 'lucide-react'

const FOOTER_LINKS = [
  ['About', '#about'],
  ['Education', '#education'],
  ['Experience', '#experience'],
  ['Skills', '#skills'],
  ['Projects', '#projects'],
  ['Achievements', '#achievements'],
  ['Certifications', '#certifications'],
  ['Resume', '#resume'],
  ['Contact', '#contact'],
]

export default function Footer({ profile, sections }) {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-bg-border py-10" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="mx-auto flex w-full flex-col items-center gap-6 px-5 text-center sm:px-8 lg:flex-row lg:justify-between lg:text-left lg:px-10">
        <div>
          <a href="/" className="font-display text-lg font-semibold">
            DSP<span className="text-accent-blue">.</span>
          </a>
          <p className="mt-1 text-sm text-ink-faint">Built by {profile?.name || 'Devi Sri Prasad Uddanti'}.</p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-5 gap-y-2 lg:max-w-xl">
          {FOOTER_LINKS.filter(([, href]) => sections?.[href.slice(1)] !== false).map(([label, href]) => (
            <a key={href} href={href} className="text-sm text-ink-muted transition-colors hover:text-ink">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {profile?.github && (
            <a href={profile.github} target="_blank" rel="noreferrer" className="text-ink-muted hover:text-ink" aria-label="GitHub">
              <Github size={18} />
            </a>
          )}
          {profile?.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-ink-muted hover:text-ink" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
          )}
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="text-ink-muted hover:text-ink" aria-label="Email">
              <Mail size={18} />
            </a>
          )}
        </div>
        <p className="text-xs text-ink-faint">© {year} {profile?.name || 'Devi Sri Prasad Uddanti'}. All rights reserved.</p>
      </div>
    </footer>
  )
}
