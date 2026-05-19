import { useEffect, useState } from 'react'
import { getCustomerProfile, upsertCustomerProfile } from '../../domain/auth'
import { useAuth } from '../../auth/AuthContext'
import type { CustomerProfileDetails } from '../../domain/types'

const EMPTY: CustomerProfileDetails = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  gender: '',
  fittingSizes: '',
}

export function ProfilePage() {
  const auth = useAuth()
  const [form, setForm] = useState<CustomerProfileDetails>(EMPTY)
  const [busy, setBusy] = useState(false)
  const [info, setInfo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function run() {
      if (!auth.user) return
      const data = await getCustomerProfile(auth.user.id)
      if (data) setForm(data)
      else {
        setForm((prev) => ({
          ...prev,
          email: auth.user?.email ?? '',
          fullName: auth.profile?.displayName ?? '',
        }))
      }
    }
    void run()
  }, [auth.user, auth.profile?.displayName])

  return (
    <section className="card">
      <h1>Customer Profile</h1>
      <p className="muted">Fill your details for faster bookings and better fitting support.</p>
      <div className="fieldRow">
        <label>
          <div className="label">Name</div>
          <input
            value={form.fullName}
            onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))}
          />
        </label>
        <label>
          <div className="label">Email</div>
          <input
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          />
        </label>
      </div>
      <div className="fieldRow">
        <label>
          <div className="label">Phone</div>
          <input
            value={form.phone}
            onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
          />
        </label>
        <label>
          <div className="label">Location</div>
          <input
            value={form.location}
            onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
          />
        </label>
      </div>
      <div className="fieldRow">
        <label>
          <div className="label">Gender</div>
          <input
            value={form.gender}
            onChange={(e) => setForm((s) => ({ ...s, gender: e.target.value }))}
          />
        </label>
        <label>
          <div className="label">Fitting sizes</div>
          <input
            value={form.fittingSizes}
            onChange={(e) => setForm((s) => ({ ...s, fittingSizes: e.target.value }))}
            placeholder="Eg: Chest 40, Waist 32, Sleeve 24"
          />
        </label>
      </div>
      {error ? <p className="errorText">{error}</p> : null}
      {info ? <p className="infoText">{info}</p> : null}
      <div className="btnRow">
        <button
          disabled={busy || !auth.user}
          onClick={async () => {
            if (!auth.user) return
            setBusy(true)
            setError(null)
            setInfo(null)
            try {
              await upsertCustomerProfile(auth.user.id, form)
              setInfo('Profile saved successfully.')
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Failed to save profile')
            } finally {
              setBusy(false)
            }
          }}
        >
          {busy ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </section>
  )
}

