import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

export function NotFoundPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '72px', color: 'var(--accent)', marginBottom: '16px' }}>404</h1>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Page Not Found</h2>
      <p className="muted" style={{ marginBottom: '32px', maxWidth: '400px' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to={ROUTES.HOME} className="luxuryBtn">
        Return Home
      </Link>
    </div>
  )
}
