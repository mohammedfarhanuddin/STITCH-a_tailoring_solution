import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signInWithGoogle, signInWithPassword } from '../../domain/auth'
import { useAuth } from '../../auth/AuthContext'

export function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }
  const backTo = location.state?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!auth.loading && auth.user) {
      navigate(backTo, { replace: true })
    }
  }, [auth.loading, auth.user, backTo, navigate])

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please enter both email and password.')
      return
    }
    setError(null)
    setBusy(true)
    try {
      await signInWithPassword(email.trim(), password)
      // On success, AuthContext will catch the session and the useEffect above will redirect.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid login credentials')
      setBusy(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)
    setBusy(true)
    try {
      await signInWithGoogle(email.trim() || undefined)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Google Login failed')
      setBusy(false)
    }
  }

  return (
    <div className="stack" style={{ maxWidth: '440px', margin: '40px auto' }}>
      <section className="card loginCard">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1>Welcome Back</h1>
          <p className="muted" style={{ marginTop: '8px' }}>
            Login to your Smart Tailor account
          </p>
        </div>

        <form onSubmit={handlePasswordLogin} className="grid" style={{ gap: '16px' }}>
          <label>
            <div className="label">Email address</div>
            <input 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>
          <label>
            <div className="label">Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          {error ? <div className="errorCard">{error}</div> : null}

          <button disabled={busy} type="submit" className="luxuryBtn" style={{ width: '100%', padding: '12px' }}>
            {busy ? 'Logging in...' : 'Login securely'}
          </button>
        </form>

        <div className="dividerRow">
          <div className="dividerLine"></div>
          <span className="muted" style={{ fontSize: '13px' }}>OR</span>
          <div className="dividerLine"></div>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={handleGoogleLogin}
          className="googleBtn"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '16px', height: '16px' }} />
          Continue with Google
        </button>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
          <span className="muted">Don't have an account?</span>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '12px' }}>
            <Link className="linkBtn ghost" to="/signup/customer">
              Signup as Customer
            </Link>
            <Link className="linkBtn ghost" to="/signup/tailor">
              Signup as Tailor
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
