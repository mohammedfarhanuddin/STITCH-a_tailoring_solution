import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTailorById, type PublicTailorProfile } from '../../domain/tailors'
import { ROUTES } from '../../constants/routes'

export function TailorPublicProfilePage() {
  const { tailorId } = useParams()
  const [tailor, setTailor] = useState<PublicTailorProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!tailorId) {
        setLoading(false)
        return
      }
      const data = await getTailorById(tailorId)
      setTailor(data)
      setLoading(false)
    }
    void load()
  }, [tailorId])

  if (loading) {
    return <p className="muted">Loading tailor profile...</p>
  }

  if (!tailor) {
    return (
      <section className="card">
        <h1>Tailor not found</h1>
        <Link className="ghostBtn" to={ROUTES.TAILORS}>
          Back to Tailors
        </Link>
      </section>
    )
  }

  return (
    <div className="stack">
      <section className="card">
        <div className="tileHead">
          <div>
            <h1>{tailor.shopName || tailor.fullName}</h1>
            <p className="muted">
              {tailor.shopAddress} • Contact: {tailor.phone}
            </p>
          </div>
        </div>
        <div className="btnRow">
          <Link className="ghostBtn" to={ROUTES.TAILORS}>
            Back
          </Link>
          <Link className="luxuryBtn" to={`${ROUTES.BOOK}?tailorId=${tailor.id}`}>
            Book with {tailor.shopName || tailor.fullName}
          </Link>
        </div>
      </section>
    </div>
  )
}
