import { ExternalLink, FileText } from 'lucide-react'
import Section from '../components/ui/Section'
import { FadeIn, Card, Button } from '../components/ui/Primitives'

export default function Resume({ profile }) {
  const resumeUrl = profile?.resumeUrl || '/resume.pdf'
  return (
    <Section id="resume" eyebrow="The full picture" title="My" titleAccent="Resume">
      <FadeIn>
        <Card className="flex flex-col items-center gap-5 p-10 text-center sm:flex-row sm:text-left">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-violet/20 text-accent-blue">
            <FileText size={26} />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-semibold">View my resume</h3>
            <p className="mt-1 text-sm text-ink-muted">
              Get a detailed look at my education, projects, skills, certifications, and achievements. You can download it from the document viewer.
            </p>
          </div>
          <Button as="a" href={resumeUrl} target="_blank" rel="noreferrer" variant="primary">
            <ExternalLink size={16} /> View Resume
          </Button>
        </Card>
      </FadeIn>
    </Section>
  )
}
