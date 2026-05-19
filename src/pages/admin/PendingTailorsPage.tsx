import { useEffect, useState } from 'react'
import { listTailorProfiles, updateTailorApprovalStatus } from '../../domain/admin'
import type { TailorProfileRecord } from '../../domain/types'

export function PendingTailorsPage() {
  const [tailors, setTailors] = useState<TailorProfileRecord[]>([])
  const [loading, setLoading] = useState(true)

  async function refresh() {
    setLoading(true)
    const all = await listTailorProfiles()
    setTailors(all.filter((t) => t.approvalStatus === 'pending'))
    setLoading(false)
  }

  useEffect(() => {
    void refresh()
  }, [])

  return (
    <section className="card">
      <h1>Pending Tailor Approvals</h1>
      {loading ? (
        <p className="muted">Loading pending list...</p>
      ) : tailors.length === 0 ? (
        <p className="muted">No pending tailor approvals.</p>
      ) : (
        <ul className="list">
          {tailors.map((t) => (
            <li key={t.id} className="listRow">
              <div>
                <b>{t.fullName}</b>
                <div className="muted">
                  {t.shopName} • {t.phone} • {t.email}
                </div>
                <div className="muted">
                  GSTIN: {t.gstin} • PAN: {t.panNumber}
                </div>
              </div>
              <div className="btnRow">
                <button
                  onClick={async () => {
                    await updateTailorApprovalStatus(t.id, 'approved')
                    await refresh()
                  }}
                >
                  Approve
                </button>
                <button
                  className="ghost"
                  onClick={async () => {
                    await updateTailorApprovalStatus(t.id, 'rejected')
                    await refresh()
                  }}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

