import { useState } from 'react'
import { Link } from 'react-router-dom'
import { initTailorSignup } from '../../domain/auth'

export function TailorSignupPage() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="stack">
      <section className="card">
        <h1>Tailor Signup</h1>
        <p className="muted">Register your tailoring shop. Sign in with Google to get started.</p>
      </section>
      <section className="card">
        {error ? <p className="errorText">{error}</p> : null}
        <div className="btnRow">
          <button
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              setError(null)
              try {
                await initTailorSignup()
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Signup failed')
              } finally {
                setBusy(false)
              }
            }}
          >
            {busy ? 'Please wait...' : 'Continue with Google'}
          </button>
          <Link className="linkBtn" to="/login">
            Already have account
          </Link>
        </div>
      </section>
    </div>
  )
}

