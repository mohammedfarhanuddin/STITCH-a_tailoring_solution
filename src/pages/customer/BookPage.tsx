import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import type { BookingInput, GenderFlow, ServiceType } from '../../domain/types'
import { getApprovedTailors, type PublicTailorProfile } from '../../domain/tailors'
import { createOrder } from '../../domain/orders'

const DEFAULT_PHONES = '+91 9XXXXXXXXX'

function todayPlus(hours: number) {
  const d = new Date(Date.now() + hours * 60 * 60 * 1000)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day}T${hh}:${mm}`
}

export function BookPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const [tailors, setTailors] = useState<PublicTailorProfile[]>([])
  const initialTailorId = params.get('tailorId') || ''

  useEffect(() => {
    getApprovedTailors().then((data) => {
      setTailors(data)
      if (!initialTailorId && data.length > 0) {
        setTailorId(data[0].id)
      }
    })
  }, [initialTailorId])

  const [customerName, setCustomerName] = useState('Umar')
  const [customerPhone, setCustomerPhone] = useState(DEFAULT_PHONES)

  const [genderFlow, setGenderFlow] = useState<GenderFlow>('men')
  const [tailorId, setTailorId] = useState(initialTailorId)
  const [serviceType, setServiceType] = useState<ServiceType>('alteration')
  const [garmentType, setGarmentType] = useState('Shirt')
  const [quantity, setQuantity] = useState(1)
  const [pickupSlot, setPickupSlot] = useState(todayPlus(4))
  const [addressLine, setAddressLine] = useState('Hanamkonda, Telangana')
  const [notes, setNotes] = useState('')
  const [measurementNotes, setMeasurementNotes] = useState('')
  const [referencePhotos, setReferencePhotos] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const selectedTailor = useMemo(() => tailors.find((t) => t.id === tailorId), [tailors, tailorId])

  const input: BookingInput = {
    genderFlow,
    tailorId,
    serviceType,
    garmentType,
    quantity,
    pickupSlot,
    addressLine,
    notes,
    measurementNotes,
    referencePhotos,
  }

  return (
    <div className="stack">
      <section className="card">
        <h1>Book Pickup</h1>
        <p className="muted">
          Pay securely at booking. Funds stay in escrow until you accept delivery.
        </p>
      </section>

      <section className="grid two">
        <form
          className="card"
          onSubmit={async (e) => {
            e.preventDefault()
            setIsSubmitting(true)
            setSubmitError(null)
            try {
              const order = await createOrder({ customerName, customerPhone, input })
              navigate(`/track/${order.id}`)
            } catch {
              setSubmitError('Could not create order. Please try again.')
            } finally {
              setIsSubmitting(false)
            }
          }}
        >
          <h2 className="h3">Details</h2>

          <div className="fieldRow">
            <label>
              <div className="label">Customer name</div>
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </label>
            <label>
              <div className="label">Phone</div>
              <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
            </label>
          </div>

          <div className="fieldRow">
            <label>
              <div className="label">Men/Women</div>
              <select value={genderFlow} onChange={(e) => setGenderFlow(e.target.value as GenderFlow)}>
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </label>
            <label>
              <div className="label">Tailor</div>
              <select value={tailorId} onChange={(e) => setTailorId(e.target.value)}>
                {tailors.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.shopName || t.fullName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="fieldRow">
            <label>
              <div className="label">Service</div>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as ServiceType)}
              >
                <option value="alteration">Alteration</option>
                <option value="stitching">Stitching</option>
                <option value="repair">Repair</option>
              </select>
            </label>
            <label>
              <div className="label">Garment type</div>
              <input value={garmentType} onChange={(e) => setGarmentType(e.target.value)} />
            </label>
          </div>

          <label>
            <div className="label">Quantity</div>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
            />
          </label>

          <label>
            <div className="label">Pickup slot</div>
            <input
              type="datetime-local"
              value={pickupSlot}
              onChange={(e) => setPickupSlot(e.target.value)}
            />
          </label>

          <label>
            <div className="label">Pickup address</div>
            <input value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
          </label>

          <label>
            <div className="label">Notes (optional)</div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </label>

          <label>
            <div className="label">Measurements (optional)</div>
            <textarea
              value={measurementNotes}
              onChange={(e) => setMeasurementNotes(e.target.value)}
              rows={3}
              placeholder="Eg: Waist 32, inseam 30, sleeve shorten 1 inch..."
            />
          </label>

          <label>
            <div className="label">Reference photos (optional)</div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files ?? [])
                setReferencePhotos(files.map((f) => f.name))
              }}
            />
            {referencePhotos.length > 0 ? (
              <div className="muted">Selected: {referencePhotos.join(', ')}</div>
            ) : null}
          </label>

          <div className="btnRow">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Pay & Book (Escrow)'}
            </button>
            <Link className="linkBtn" to="/tailors">
              Choose Tailor
            </Link>
          </div>
          {submitError ? <p className="errorText">{submitError}</p> : null}
        </form>

        <aside className="card">
          <h2 className="h3">Summary</h2>
          <div className="summaryGrid">
            <div className="muted">Tailor</div>
            <div>{selectedTailor ? (selectedTailor.shopName || selectedTailor.fullName) : '—'}</div>
            <div className="muted">Service</div>
            <div>{serviceType}</div>
            <div className="muted">Garment</div>
            <div>{garmentType}</div>
            <div className="muted">Quantity</div>
            <div>{quantity}</div>
            <div className="muted">Pickup</div>
            <div>{pickupSlot.replace('T', ' ')}</div>
          </div>

          <div className="divider" />

          <h3 className="h4">Pricing (example)</h3>
          <p className="muted">
            Actual pricing will be based on garment and final confirmation by the tailor.
          </p>
          <ul className="muted">
            <li>TotalPaid = TailorPrice + DeliveryFee</li>
            <li>TailorShare = 50% of TailorPrice on acceptance</li>
            <li>PlatformPool = remaining 50% split between two owners</li>
          </ul>
        </aside>
      </section>
    </div>
  )
}

