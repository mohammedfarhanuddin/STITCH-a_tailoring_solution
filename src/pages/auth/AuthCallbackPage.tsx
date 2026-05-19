import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { finalizeGoogleSignup } from '../../domain/auth'
import { useAuth } from '../../auth/AuthContext'
import { supabase } from '../../domain/supabase'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const auth = useAuth()
  const [params] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [debug, setDebug] = useState<string[]>([])
  const mode = params.get('mode') ?? 'login'

  useEffect(() => {
    async function complete() {
      try {
        setDebug((d) => [...d, `mode=${mode}`])
        const authCode = params.get('code')
        const oauthError = params.get('error_description') ?? params.get('error')
        if (oauthError) {
          throw new Error(oauthError)
        }
        setDebug((d) => [...d, `has_code=${Boolean(authCode)}`])

        if (authCode && supabase) {
          setDebug((d) => [...d, 'exchanging code for session...'])
          const { error } = await supabase.auth.exchangeCodeForSession(authCode)
          if (error) {
            throw error
          }
          setDebug((d) => [...d, 'code exchange success'])
        }

        if (mode === 'signup_customer') {
          setDebug((d) => [...d, 'finalizing signup...'])
          await finalizeGoogleSignup(mode)
          await auth.refreshProfile()
          setDebug((d) => [...d, 'signup finalized'])
        }
        const session = await supabase?.auth.getSession()
        setDebug((d) => [
          ...d,
          `session_after_exchange=${Boolean(session?.data.session)}`,
          `user_after_exchange=${Boolean(session?.data.session?.user)}`,
        ])
        setDebug((d) => [...d, 'redirecting'])
        if (mode === 'signup_tailor_init') {
          navigate('/signup/tailor/details', { replace: true })
        } else {
          navigate('/', { replace: true })
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to complete sign-in.')
        setDebug((d) => [...d, `error=${e instanceof Error ? e.message : 'unknown'}`])
      }
    }
    void complete()
  }, [auth, mode, navigate, params])

  return (
    <section className="card">
      <h1>Finishing sign in...</h1>
      {error ? <p className="errorText">{error}</p> : <p className="muted">Please wait.</p>}
      {debug.length > 0 ? (
        <div className="card">
          <h2 className="h3">Debug</h2>
          <ul className="list">
            {debug.map((line, i) => (
              <li key={`${line}-${i}`} className="muted">
                {line}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}

