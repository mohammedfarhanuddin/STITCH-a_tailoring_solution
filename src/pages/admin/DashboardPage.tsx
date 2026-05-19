import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listOrders, advanceOrder, revertOrder } from '../../domain/orders'
import { listCustomerProfiles, listTailorProfiles } from '../../domain/admin'
import type { CustomerProfileRecord, TailorProfileRecord } from '../../domain/types'

function sum(nums: number[]) {
  return nums.reduce((a, b) => a + b, 0)
}

export function DashboardPage() {
  const [orders, setOrders] = useState<Awaited<ReturnType<typeof listOrders>>>([])
  const [tailors, setTailors] = useState<TailorProfileRecord[]>([])
  const [customers, setCustomers] = useState<CustomerProfileRecord[]>([])
  const [loading, setLoading] = useState(true)

  async function refresh() {
    setLoading(true)
    const [orderRows, tailorRows, customerRows] = await Promise.all([
      listOrders(),
      listTailorProfiles(),
      listCustomerProfiles(),
    ])
    setOrders(orderRows)
    setTailors(tailorRows)
    setCustomers(customerRows)
    setLoading(false)
  }

  useEffect(() => {
    void refresh()
  }, [])

  const byStatus = (s: string) => orders.filter((o) => o.status === s)

  const pickup = byStatus('Order Placed')
  const inTailor = byStatus('In Progress')
  const ready = byStatus('Order Ready')
  const out = byStatus('Out for Delivery')
  const delivered = byStatus('Delivered')

  const pendingPayout = useMemo(
    () => delivered.slice(0, 10).map((o) => o.money.tailorShare),
    [delivered],
  )
  const pendingPayoutTotal = sum(pendingPayout)
  const moneyByTailor = useMemo(() => {
    const map = new Map<string, number>()
    for (const o of orders) {
      const t = tailors.find((t) => t.id === o.input.tailorId)
      const name = t ? (t.shopName || t.fullName) : o.input.tailorId
      map.set(name, (map.get(name) ?? 0) + o.money.tailorShare)
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [orders, tailors])

  return (
    <div className="stack">
      <section className="card">
        <h1>Admin Operations</h1>
        <p className="muted">Monitor statuses, resolve disputes, and release payouts.</p>
      </section>

      <section className="grid three">
        <article className="card tile">
          <h2 className="h3">Live Orders</h2>
          <div className="kpiRow">
            <div>
              <div className="kpi">{pickup.length}</div>
              <div className="muted">Order Placed</div>
            </div>
            <div>
              <div className="kpi">{inTailor.length}</div>
              <div className="muted">In Progress</div>
            </div>
            <div>
              <div className="kpi">{out.length}</div>
              <div className="muted">Out for Delivery</div>
            </div>
          </div>
        </article>

        <article className="card tile">
          <h2 className="h3">People</h2>
          <p className="muted">All tailors: {tailors.length}</p>
          <p className="muted">All customers: {customers.length}</p>
          <div className="btnRow">
            <Link className="linkBtn" to="/admin/pending-tailors">Pending Tailors</Link>
            <Link className="linkBtn" to="/admin/customer-issues">Customer Issues</Link>
          </div>
        </article>

        <article className="card tile">
          <h2 className="h3">Payouts</h2>
          <p className="muted">Ready to release today (demo):</p>
          <div className="kpi">₹{pendingPayoutTotal}</div>
          <button className="ghost" disabled>
            Release Batch (next)
          </button>
        </article>
      </section>

      <section className="card">
        <h2 className="h3">Tailor Earnings</h2>
        {moneyByTailor.length === 0 ? (
          <p className="muted">No earnings data yet.</p>
        ) : (
          <ul className="list">
            {moneyByTailor.map(([name, amount]) => (
              <li key={name} className="listRow">
                <div><b>{name}</b></div>
                <div className="pricePill">₹{amount}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2 className="h3">Orders</h2>
        {loading ? (
          <p className="muted">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="muted">
            No orders yet. <Link to="/book">Create a booking</Link>.
          </p>
        ) : (
          <ul className="list">
            {orders.slice(0, 20).map((o) => (
              <li key={o.id} className="listRow">
                <div>
                  <Link to={`/track/${o.id}`}>{o.id}</Link>
                  <div className="muted">
                    {o.status} • ₹{o.money.totalPaid} • {o.input.serviceType} / {o.input.garmentType}
                  </div>
                </div>
                <div className="btnRow">
                  <button
                    className="ghost"
                    onClick={async () => {
                      await revertOrder(o.id)
                      await refresh()
                    }}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    onClick={async () => {
                      await advanceOrder(o.id)
                      await refresh()
                    }}
                    disabled={loading}
                  >
                    Next
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="divider" />
        <p className="muted">
          Counts: Ready {ready.length} • Delivered {delivered.length}
        </p>
      </section>
    </div>
  )
}

