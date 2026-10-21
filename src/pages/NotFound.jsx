import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Primitives'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-6 text-center">
      <p className="font-display text-6xl font-bold text-gradient">404</p>
      <p className="text-ink-muted">That page doesn't exist.</p>
      <Button as={Link} to="/" variant="primary">
        Back to Home
      </Button>
    </div>
  )
}
