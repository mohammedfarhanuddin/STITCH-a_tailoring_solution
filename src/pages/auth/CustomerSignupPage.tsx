import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUpCustomer, signUpCustomerWithPassword } from '../../domain/auth'

export function CustomerSignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="stack">
      <section className="card">
        <h1>Customer Signup</h1>
        <p className="muted">Create a customer account.</p>
      </section>
      <section className="card">
        <label>
          <div className="label">Email</div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <div className="label">Password</div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error ? <p className="errorText">{error}</p> : null}
        <div className="btnRow" style={{ marginTop: '1rem' }}>
          <button
            disabled={busy || !email || !password}
            onClick={async () => {
              setBusy(true)
              setError(null)
              try {
                await signUpCustomerWithPassword(email, password)
                navigate('/', { replace: true })
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Signup failed')
              } finally {
                setBusy(false)
              }
            }}
          >
            {busy ? 'Please wait...' : 'Sign up'}
          </button>
          <div style={{ margin: '0 1rem', alignSelf: 'center' }} className="muted">
            OR
          </div>
          <button
            className="ghost"
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              setError(null)
              try {
                await signUpCustomer({ fullName: '', email: '' })
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Google Signup failed')
              } finally {
                setBusy(false)
              }
            }}
          >
            Verify with Google
          </button>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Link className="linkBtn" to="/login">
            Already have an account? Log in
          </Link>
        </div>
      </section>
    </div>
  )
}

