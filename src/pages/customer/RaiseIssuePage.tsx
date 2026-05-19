import { useState } from 'react'
import { createCustomerIssue } from '../../domain/admin'
import { useAuth } from '../../auth/AuthContext'

export function RaiseIssuePage() {
  const auth = useAuth()
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [info, setInfo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  return (
    <section className="card">
      <h1>Raise an Issue</h1>
      <p className="muted">Describe your issue in text format. Our support team will review it.</p>
      <label>
        <div className="label">Issue details</div>
        <textarea
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Explain your issue..."
        />
      </label>
      {error ? <p className="errorText">{error}</p> : null}
      {info ? <p className="infoText">{info}</p> : null}
      <div className="btnRow">
        <button
          disabled={busy || !auth.user || !message.trim()}
          onClick={async () => {
            if (!auth.user || !message.trim()) return
            setBusy(true)
            setError(null)
            setInfo(null)
            try {
              await createCustomerIssue({
                customerUserId: auth.user.id,
                customerName: auth.profile?.displayName || auth.user.email || 'Customer',
                message: message.trim(),
              })
              setMessage('')
              setInfo('Issue submitted successfully.')
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Failed to submit issue')
            } finally {
              setBusy(false)
            }
          }}
        >
          {busy ? 'Submitting...' : 'Submit Issue'}
        </button>
      </div>
    </section>
  )
}

