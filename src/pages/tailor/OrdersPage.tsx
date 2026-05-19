import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listOrdersForTailor, setOrderStatus } from '../../domain/orders'
import type { Order, OrderStatus } from '../../domain/types'
import { useAuth } from '../../auth/AuthContext'

type SortBy = 'price' | 'earliest' | 'quantity'

function getDueDate(order: Order): Date {
  const pickup = new Date(order.input.pickupSlot)
  const turnaround = 72
  return new Date(pickup.getTime() + turnaround * 60 * 60 * 1000)
}

export function OrdersPage() {
  const auth = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortBy>('earliest')

  const refresh = async () => {
    if (!auth.user) return
    setLoading(true)
    setOrders(await listOrdersForTailor(auth.user.id))
    setLoading(false)
  }

  useEffect(() => {
    void refresh()
  }, [auth.user])

  const sortedOrders = useMemo(() => {
    const list = [...orders]
    if (sortBy === 'price') {
      return list.sort((a, b) => b.money.tailorPrice - a.money.tailorPrice)
    }
    if (sortBy === 'quantity') {
      return list.sort((a, b) => (b.input.quantity ?? 1) - (a.input.quantity ?? 1))
    }
    return list.sort(
      (a, b) => new Date(a.input.pickupSlot).getTime() - new Date(b.input.pickupSlot).getTime(),
    )
  }, [orders, sortBy])

  return (
    <div className="stack">
      <section className="card">
        <h1>Orders</h1>
        <p className="muted">View all assigned orders and sort by the key business filters.</p>
        <div className="btnRow">
          <label>
            <span className="label">Sort by</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}>
              <option value="price">Price (high to low)</option>
              <option value="earliest">Earliest date</option>
              <option value="quantity">Quantity (high to low)</option>
            </select>
          </label>
        </div>
      </section>

      <section className="card">
        {loading ? (
          <p className="muted">Loading orders...</p>
        ) : sortedOrders.length === 0 ? (
          <p className="muted">No orders found.</p>
        ) : (
          <ul className="list">
            {sortedOrders.map((order) => {
              const due = getDueDate(order)
              return (
                <li key={order.id} className="listRow">
                  <div>
                    <b>{order.id}</b>
                    <div className="muted">
                      {order.input.garmentType} • Qty {order.input.quantity ?? 1} • ₹
                      {order.money.tailorPrice}
                    </div>
                    <div className="muted">
                      Pickup: {new Date(order.input.pickupSlot).toLocaleString()} • Due:{' '}
                      {due.toLocaleString()}
                    </div>
                  </div>
                  <div className="btnRow">
                    <select
                      className="statusDropdown"
                      value={order.status}
                      onChange={async (e) => {
                        await setOrderStatus(order.id, e.target.value as OrderStatus)
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
                    <Link className="linkBtn" to={`/track/${order.id}`}>
                      View
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

