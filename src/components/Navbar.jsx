import { useEffect, useState } from 'react'
import { Menu, X, Sun, Moon, Github, Linkedin } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#education', label: 'Education' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#achievements', label: 'Achievements' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#resume', label: 'Resume' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar({ profile, sections }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-bg-border bg-bg/80 backdrop-blur-lg' : 'bg-transparent'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <nav className="mx-auto flex w-full items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        <a href={sections?.home === false ? '#' : '#home'} className="font-display text-lg font-semibold tracking-tight">
          DSP<span className="text-accent-blue">.</span>
        </a>

        <div className="ml-auto mr-4 hidden items-center gap-3 xl:flex 2xl:gap-5">
          {LINKS.filter((link) => sections?.[link.href.slice(1)] !== false).map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-ink-muted transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 xl:flex">
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
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="rounded-lg border border-bg-border p-2 text-ink-muted hover:border-accent-blue/40 hover:text-ink"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <button className="xl:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-bg-border bg-bg px-5 pb-6 sm:px-8 xl:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {LINKS.filter((link) => sections?.[link.href.slice(1)] !== false).map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-ink-muted hover:text-ink">
                {l.label}
              </a>
            ))}
            <div className="flex items-center gap-4 pt-2">
              {profile?.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="text-ink-muted hover:text-ink">
                  <Github size={18} />
                </a>
              )}
              {profile?.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-ink-muted hover:text-ink">
                  <Linkedin size={18} />
                </a>
              )}
              <button onClick={toggle} className="rounded-lg border border-bg-border p-2 text-ink-muted">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
