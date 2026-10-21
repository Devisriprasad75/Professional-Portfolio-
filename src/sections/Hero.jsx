import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/Primitives'

export default function Hero({ profile }) {
  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden pt-20 sm:pt-24 lg:pt-16">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" />
      <div className="relative mx-auto grid w-full grid-cols-1 items-center gap-8 px-5 py-8 sm:gap-10 sm:px-8 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-10 xl:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {profile?.seekingOpportunities && (
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-blue/30 bg-accent-blue/10 px-3 py-1 text-xs font-medium text-accent-blue">
              <Sparkles size={13} /> Open to new opportunities
            </span>
          )}
          <p className="mb-3 font-mono text-sm text-ink-muted">Hi, I'm</p>
          <h1 className="font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
            {profile?.name || 'Devi Sri Prasad Uddanti'}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink-muted sm:text-xl">
            {profile?.headline || 'Aspiring Software Developer | AI/ML Enthusiast | Full-Stack Development'}
          </p>
          <p className="mt-5 max-w-xl text-ink-muted">{profile?.intro}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button as="a" href="#projects" variant="primary">
              View Projects
            </Button>
            <Button as="a" href={profile?.resumeUrl || '/resume.pdf'} target="_blank" rel="noreferrer" variant="secondary">
              View Resume
            </Button>
            <Button as="a" href="#contact" variant="ghost">
              Contact Me
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-5">
            {profile?.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="text-ink-muted transition-colors hover:text-ink" aria-label="GitHub">
                <Github size={20} />
              </a>
            )}
            {profile?.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-ink-muted transition-colors hover:text-ink" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            )}
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="text-ink-muted transition-colors hover:text-ink" aria-label="Email">
                <Mail size={20} />
              </a>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto aspect-square w-56 sm:w-72 lg:w-full lg:max-w-[min(44vw,680px)]"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-accent-blue/25 to-accent-violet/25 blur-2xl" />
          <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-bg-border shadow-card">
            <img
              src="/assets/profile.png"
              alt={profile?.name || 'Profile photo'}
              className="h-full w-full object-cover"
              style={{ objectPosition: '50% 20%' }}
              loading="eager"
            />
          </div>
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-ink-faint hover:text-ink-muted sm:block"
        aria-label="Scroll down"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ArrowDown size={20} />
        </motion.div>
      </a>
    </section>
  )
}
