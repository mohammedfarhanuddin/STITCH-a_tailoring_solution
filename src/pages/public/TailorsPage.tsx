import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getApprovedTailors } from '../../domain/tailors'
import type { PublicTailorProfile } from '../../domain/tailors'

export function TailorsPage() {
  const [tailors, setTailors] = useState<PublicTailorProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getApprovedTailors()
      setTailors(data)
      setLoading(false)
    }
    void load()
  }, [])

  return (
    <div className="stack">
      <section className="card">
        <h1>Tailors in Hanamkonda</h1>
        <p className="muted">Browse vetted and approved tailor profiles.</p>
      </section>

      {loading ? (
        <p className="muted">Loading tailors...</p>
      ) : tailors.length === 0 ? (
        <p className="muted">No approved tailors found.</p>
      ) : (
        <section className="grid three">
          {tailors.map((t) => (
            <article key={t.id} className="card tile">
              <div className="tileHead">
                <div>
                  <h2 className="h3">{t.shopName || t.fullName}</h2>
                  <div className="muted">{t.shopAddress}</div>
                </div>
              </div>
              <div className="btnRow">
                <Link className="linkBtn" to={`/tailors/${t.id}`}>
                  View Profile
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}

