import { motion } from 'framer-motion'

export default function Section({ id, eyebrow, title, titleAccent, children, className = '' }) {
  return (
    <section id={id} className={`relative scroll-mt-24 border-t border-bg-border/60 py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="mx-auto w-full px-[clamp(1.25rem,3.5vw,4rem)]">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-8 sm:mb-10"
          >
            {eyebrow && (
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent-blue">{eyebrow}</p>
            )}
            <h2 className="section-heading font-display text-3xl font-semibold sm:text-4xl">
              {title} {titleAccent && <span className="text-gradient">{titleAccent}</span>}
            </h2>
          </motion.div>
        )}
        {children}
      </div>
    </section>
  )
}
