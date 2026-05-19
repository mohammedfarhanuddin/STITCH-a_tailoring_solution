import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { completeTailorProfile } from '../../domain/auth'
import { useAuth } from '../../auth/AuthContext'

export function TailorDetailsPage() {
  const auth = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [shopName, setShopName] = useState('')
  const [shopAddress, setShopAddress] = useState('')
  const [gstin, setGstin] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [aadhaarNumber, setAadhaarNumber] = useState('')
  const [panNumber, setPanNumber] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (auth.user?.email) {
      setEmail(auth.user.email)
    }
  }, [auth.user])

  return (
    <div className="stack">
      <section className="card">
        <h1>Tailor Details</h1>
        <p className="muted">Complete your profile to finish the registration process.</p>
      </section>
      <section className="card">
        <div className="fieldRow">
          <label>
            <div className="label">Name</div>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </label>
          <label>
            <div className="label">Shop Name</div>
            <input value={shopName} onChange={(e) => setShopName(e.target.value)} />
          </label>
        </div>
        <label>
          <div className="label">Shop Address</div>
          <input value={shopAddress} onChange={(e) => setShopAddress(e.target.value)} />
        </label>
        <div className="fieldRow">
          <label>
            <div className="label">GSTIN Number</div>
            <input value={gstin} onChange={(e) => setGstin(e.target.value)} />
          </label>
          <label>
            <div className="label">Email</div>
            <input value={email} readOnly disabled />
          </label>
        </div>
        <div className="fieldRow">
          <label>
            <div className="label">Phone Number</div>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label>
            <div className="label">Aadhaar Number</div>
            <input value={aadhaarNumber} onChange={(e) => setAadhaarNumber(e.target.value)} />
          </label>
        </div>
        <label>
          <div className="label">PAN Number</div>
          <input value={panNumber} onChange={(e) => setPanNumber(e.target.value)} />
        </label>
        {error ? <p className="errorText">{error}</p> : null}
        <div className="btnRow">
          <button
            disabled={busy}
            onClick={async () => {
              if (!auth.user) {
                setError('You must be logged in to complete registration.')
                return
              }
              setBusy(true)
              setError(null)
              try {
                await completeTailorProfile(auth.user.id, {
                  fullName,
                  shopName,
                  shopAddress,
                  gstin,
                  email,
                  phone,
                  aadhaarNumber,
                  panNumber,
                })
                await auth.refreshProfile()
                navigate('/tailor', { replace: true })
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Failed to complete profile')
              } finally {
                setBusy(false)
              }
            }}
          >
            {busy ? 'Please wait...' : 'Complete Profile'}
          </button>
        </div>
      </section>
    </div>
  )
}
