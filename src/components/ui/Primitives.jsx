import { motion } from 'framer-motion'

export function Card({ children, className = '', hover = true }) {
  return (
    <div
      className={`rounded-2xl border border-bg-border bg-bg-surface shadow-card ${
        hover ? 'transition-all duration-300 hover:-translate-y-1 hover:border-accent-blue/40 hover:shadow-card' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-bg-border bg-bg-raised px-3 py-1 text-xs font-medium text-ink-muted ${className}`}
    >
      {children}
    </span>
  )
}

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none'

const variants = {
  primary: 'bg-gradient-to-r from-accent-blue to-accent-violet text-white shadow-glow hover:brightness-110 active:brightness-95',
  secondary: 'border border-bg-border bg-bg-raised text-ink hover:border-accent-blue/50 hover:bg-bg-raised/70',
  ghost: 'text-ink-muted hover:text-ink hover:bg-bg-raised',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20',
}

export function Button({ as: Comp = 'button', variant = 'primary', className = '', children, ...props }) {
  return (
    <Comp className={`${buttonBase} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Comp>
  )
}

export function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
