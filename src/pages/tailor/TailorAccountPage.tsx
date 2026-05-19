import { useEffect, useState } from 'react'
import { getTailorProfile } from '../../domain/auth'
import { useAuth } from '../../auth/AuthContext'
import type { TailorProfileDetails } from '../../domain/types'

const EMPTY: TailorProfileDetails = {
  fullName: '',
  shopName: '',
  shopAddress: '',
  gstin: '',
  email: '',
  phone: '',
  aadhaarNumber: '',
  panNumber: '',
}

export function TailorAccountPage() {
  const auth = useAuth()
  const [profile, setProfile] = useState<TailorProfileDetails>(EMPTY)

  useEffect(() => {
    async function run() {
      if (!auth.user) return
      const data = await getTailorProfile(auth.user.id)
      if (data) setProfile(data)
    }
    void run()
  }, [auth.user])

  return (
    <section className="card">
      <h1>Tailor Profile</h1>
      <p className="muted">All registered tailor details are shown below.</p>
      <p className="muted">
        Approval status: <b>{profile.approvalStatus ?? 'pending'}</b>
      </p>
      <div className="summaryGrid">
        <div className="muted">Name</div>
        <div>{profile.fullName || '—'}</div>
        <div className="muted">Shop Name</div>
        <div>{profile.shopName || '—'}</div>
        <div className="muted">Shop Address</div>
        <div>{profile.shopAddress || '—'}</div>
        <div className="muted">GSTIN</div>
        <div>{profile.gstin || '—'}</div>
        <div className="muted">Email</div>
        <div>{profile.email || '—'}</div>
        <div className="muted">Phone</div>
        <div>{profile.phone || '—'}</div>
        <div className="muted">Aadhaar Number</div>
        <div>{profile.aadhaarNumber || '—'}</div>
        <div className="muted">PAN Number</div>
        <div>{profile.panNumber || '—'}</div>
      </div>
    </section>
  )
}
