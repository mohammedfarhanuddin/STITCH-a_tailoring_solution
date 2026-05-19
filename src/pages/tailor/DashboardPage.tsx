import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listOrdersForTailor, advanceOrder, setOrderStatus } from '../../domain/orders'
import type { Order, OrderStatus } from '../../domain/types'
import { useAuth } from '../../auth/AuthContext'

function getDueDate(order: Order): Date {
  const pickup = new Date(order.input.pickupSlot)
  const turnaround = 72
  return new Date(pickup.getTime() + turnaround * 60 * 60 * 1000)
}

export function DashboardPage() {
  const auth = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  async function refresh() {
    if (!auth.user) return
    setLoading(true)
    setOrders(await listOrdersForTailor(auth.user.id))
    setLoading(false)
  }

  useEffect(() => {
    void refresh()
  }, [auth.user])

  const incoming = orders.filter((o) => o.status === 'Order Placed').slice(0, 5)
  const inWork = orders.filter((o) => o.status === 'In Progress' || o.status === 'Order Ready').slice(0, 5)
  const totalOrders = orders.length
  const completed = orders.filter((o) => o.status === 'Delivered')
  const completedCount = completed.length
  const pendingCount = orders.filter((o) =>
    ['Order Placed', 'In Progress', 'Order Ready'].includes(o.status),
  ).length
  const shippedCount = orders.filter((o) => o.status === 'Out for Delivery').length
  const pastDueCount = orders.filter(
    (o) => o.status !== 'Delivered' && new Date() > getDueDate(o),
  ).length
  const earningsToDate = completed.reduce((sum, o) => sum + o.money.tailorShare, 0)

  return (
    <div className="stack">
      <section className="card">
        <h1>Tailor Dashboard</h1>
        <p className="muted">Accept orders, upload QC photos, and mark jobs ready.</p>
      </section>

      <section className="grid three">
        <article className="card tile">
          <h2 className="h3">Earnings Till Date</h2>
          <div className="kpi">₹{earningsToDate}</div>
        </article>
        <article className="card tile">
          <h2 className="h3">Orders</h2>
          <div className="kpi">{totalOrders}</div>
          <p className="muted">Completed: {completedCount}</p>
        </article>
        <article className="card tile">
          <h2 className="h3">Pending</h2>
          <div className="kpi">{pendingCount}</div>
          <p className="muted">Shipped: {shippedCount}</p>
          <p className="muted">Past due: {pastDueCount}</p>
        </article>
      </section>

      <section className="grid two">
        <article className="card">
          <h2 className="h3">Incoming</h2>
          {loading ? (
            <p className="muted">Loading orders...</p>
          ) : incoming.length === 0 ? (
            <p className="muted">No incoming orders right now.</p>
          ) : (
            <ul className="list">
              {incoming.map((o) => (
                <li key={o.id} className="listRow">
                  <div>
                    <b>{o.id}</b>
                    <div className="muted">
                      {o.input.serviceType} • {o.input.garmentType}
                    </div>
                  </div>
                  <div className="btnRow">
                    <button
                      className="ghost"
                      onClick={async () => {
                        await advanceOrder(o.id)
                        await refresh()
                      }}
                      disabled={loading}
                    >
                      Accept
                    </button>
                    <Link className="linkBtn" to={`/track/${o.id}`}>
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="card">
          <h2 className="h3">In progress</h2>
          {loading ? (
            <p className="muted">Loading orders...</p>
          ) : inWork.length === 0 ? (
            <p className="muted">No active jobs.</p>
          ) : (
            <ul className="list">
              {inWork.map((o) => (
                <li key={o.id} className="listRow">
                  <div>
                    <b>{o.id}</b>
                    <div className="muted">Next: upload finished photo → mark ready</div>
                  </div>
                  <div className="btnRow">
                    <select
                      className="statusDropdown"
                      value={o.status}
                      onChange={async (e) => {
                        await setOrderStatus(o.id, e.target.value as OrderStatus)
                        await refresh()
                      }}
                      disabled={loading}
                      style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Order Ready">Order Ready</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Completed (Delivered)</option>
                    </select>
                    <Link className="linkBtn" to={`/track/${o.id}`}>
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <section className="card">
        <h2 className="h3">QC Checklist (MVP)</h2>
        <ul className="muted">
          <li>Receipt photo (garment + tag)</li>
          <li>Progress photo (optional)</li>
          <li>Finished item photo (before return pickup)</li>
        </ul>
      </section>
    </div>
  )
}

