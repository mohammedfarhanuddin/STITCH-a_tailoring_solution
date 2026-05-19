import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getOrder, listOrders } from '../../domain/orders'
import { useAuth } from '../../auth/AuthContext'

export function TrackOrderPage() {
  const auth = useAuth()
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [manualId, setManualId] = useState(orderId ?? '')
  const [order, setOrder] = useState<Awaited<ReturnType<typeof getOrder>>>(undefined)
  const [recentOrders, setRecentOrders] = useState<Awaited<ReturnType<typeof listOrders>>>([])
  const [loading, setLoading] = useState(false)

  async function refresh() {
    setLoading(true)
    if (orderId) {
      setOrder(await getOrder(orderId))
    } else {
      setRecentOrders((await listOrders()).slice(0, 5))
    }
    setLoading(false)
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  if (!orderId) {
    return (
      <div className="stack">
        <section className="card">
          <h1>Track Order</h1>
          <p className="muted">Enter your Order ID (example: ST-260427-1234).</p>
          <div className="fieldRow">
            <input value={manualId} onChange={(e) => setManualId(e.target.value)} />
            <button
              onClick={() => {
                if (!manualId.trim()) return
                navigate(`/track/${manualId.trim()}`)
              }}
            >
              Track
            </button>
          </div>
        </section>

        <section className="card">
          <h2 className="h3">Recent orders</h2>
          {loading ? (
            <p className="muted">Loading orders...</p>
          ) : recentOrders.length === 0 ? (
            <p className="muted">
              No orders yet. <Link to="/book">Create a booking</Link>.
            </p>
          ) : (
            <ul className="list">
              {recentOrders.map((o) => (
                <li key={o.id}>
                  <Link to={`/track/${o.id}`}>{o.id}</Link> • {o.status}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    )
  }

  if (!order) {
    return (
      <section className="card">
        <h1>Order not found</h1>
        <p className="muted">
          Could not find <b>{orderId}</b>.
        </p>
        <div className="btnRow">
          <Link className="linkBtn" to="/book">
            Book Pickup
          </Link>
          <Link className="linkBtn" to="/track">
            Search again
          </Link>
        </div>
      </section>
    )
  }

  return (
    <div className="stack">
      <section className="card">
        <div className="tileHead">
          <div>
            <h1>Order {order.id}</h1>
            <p className="muted">
              Status: <b>{order.status}</b>
            </p>
          </div>
          <div className="pricePill">Total ₹{order.money.totalPaid}</div>
        </div>

        <div className="grid two">
          <div className="summaryGrid">
            <div className="muted">Customer</div>
            <div>{order.customerName}</div>
            <div className="muted">Phone</div>
            <div>{order.customerPhone}</div>
            <div className="muted">Pickup slot</div>
            <div>{order.input.pickupSlot.replace('T', ' ')}</div>
            <div className="muted">Address</div>
            <div>{order.input.addressLine}</div>
          </div>
          <div className="summaryGrid">
            <div className="muted">Service</div>
            <div>{order.input.serviceType}</div>
            <div className="muted">Garment</div>
            <div>{order.input.garmentType}</div>
            <div className="muted">Tailor price</div>
            <div>₹{order.money.tailorPrice}</div>
            <div className="muted">Delivery fee</div>
            <div>₹{order.money.deliveryFee}</div>
          </div>
        </div>


      </section>

      {auth.role !== 'tailor' && (
        <section className="card">
          <h2 className="h3">Timeline</h2>
          <ul className="timeline">
            {order.timeline
              .slice()
              .reverse()
              .map((ev) => (
                <li key={`${ev.atIso}-${ev.status}`}>
                  <div className="timelineTitle">{ev.status}</div>
                  <div className="muted">
                    {new Date(ev.atIso).toLocaleString()} {ev.note ? `• ${ev.note}` : ''}
                  </div>
                </li>
              ))}
          </ul>
        </section>
      )}
    </div>
  )
}

