import type { BookingInput, MoneyBreakdown, Order, OrderStatus } from './types'
import { hasSupabaseConfig, supabase } from './supabase'

const STORAGE_KEY = 'smartTailor.orders.v1'

const STATUSES: OrderStatus[] = [
  'Order Placed',
  'In Progress',
  'Order Ready',
  'Out for Delivery',
  'Delivered',
]

function nowIso() {
  return new Date().toISOString()
}

function makeOrderId() {
  const rand = Math.floor(Math.random() * 9000) + 1000
  const date = new Date()
  const y = date.getFullYear().toString().slice(-2)
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `ST-${y}${m}${d}-${rand}`
}

function computeMoney(input: BookingInput): MoneyBreakdown {
  const base = 600
  const serviceMultiplier =
    input.serviceType === 'stitching' ? 1.4 : input.serviceType === 'repair' ? 0.8 : 1
  const tailorPrice = Math.round(base * serviceMultiplier)
  const deliveryFee = 60
  const totalPaid = tailorPrice + deliveryFee
  const tailorShare = Math.round(tailorPrice * 0.5)
  const platformPool = tailorPrice - tailorShare
  return { tailorPrice, deliveryFee, totalPaid, tailorShare, platformPool }
}

function readAll(): Order[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as Order[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export async function listOrders(): Promise<Order[]> {
  if (!hasSupabaseConfig || !supabase) {
    return readAll().sort((a, b) => (a.createdAtIso < b.createdAtIso ? 1 : -1))
  }

  const { data, error } = await supabase
    .from('orders')
    .select('payload')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to list orders from Supabase:', error.message)
    return readAll().sort((a, b) => (a.createdAtIso < b.createdAtIso ? 1 : -1))
  }

  return (data ?? [])
    .map((row) => row.payload as Order)
    .sort((a, b) => (a.createdAtIso < b.createdAtIso ? 1 : -1))
}

export async function listOrdersForTailor(tailorUserId: string): Promise<Order[]> {
  const all = await listOrders()
  return all.filter((order) => {
    return order.assignedTailorUserId === tailorUserId || order.input.tailorId === tailorUserId
  })
}

export async function getOrder(orderId: string): Promise<Order | undefined> {
  if (!hasSupabaseConfig || !supabase) {
    return readAll().find((o) => o.id === orderId)
  }

  const { data, error } = await supabase
    .from('orders')
    .select('payload')
    .eq('id', orderId)
    .maybeSingle()

  if (error) {
    console.error('Failed to get order from Supabase:', error.message)
    return readAll().find((o) => o.id === orderId)
  }

  return (data?.payload as Order | undefined) ?? undefined
}

export async function getLatestOrderId(): Promise<string | null> {
  const orders = await listOrders()
  return orders[0]?.id ?? null
}

export async function createOrder(params: {
  customerName: string
  customerPhone: string
  input: BookingInput
}): Promise<Order> {
  const session = (await supabase?.auth.getSession())?.data.session ?? null
  const assignedTailorUserId = await resolveAssignedTailorUserId(params.input.tailorId)
  const id = makeOrderId()
  const createdAtIso = nowIso()
  const money = computeMoney(params.input)
  const status: OrderStatus = 'Order Placed'
  const order: Order = {
    id,
    createdAtIso,
    customerUserId: session?.user.id ?? null,
    assignedTailorUserId,
    customerName: params.customerName,
    customerPhone: params.customerPhone,
    input: params.input,
    money,
    status,
    timeline: [{ atIso: createdAtIso, status, note: 'Order placed successfully' }],
  }

  if (hasSupabaseConfig && supabase) {
    const { error } = await supabase.from('orders').upsert({
      id: order.id,
      customer_user_id: order.customerUserId,
      assigned_tailor_user_id: order.assignedTailorUserId ?? null,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      status: order.status,
      payload: order,
      created_at: order.createdAtIso,
      updated_at: nowIso(),
    })
    if (error) {
      console.error('Failed to create order in Supabase, falling back:', error.message)
      const all = readAll()
      all.push(order)
      writeAll(all)
    }
  } else {
    const all = readAll()
    all.push(order)
    writeAll(all)
  }

  return order
}

export async function advanceOrder(orderId: string): Promise<Order | undefined> {
  const order = await getOrder(orderId)
  if (!order) return undefined
  const currentIndex = STATUSES.indexOf(order.status)
  const nextIndex = Math.min(currentIndex + 1, STATUSES.length - 1)
  const nextStatus = STATUSES[nextIndex]
  if (nextStatus === order.status) return order

  const updated: Order = {
    ...order,
    status: nextStatus,
    timeline: [
      ...order.timeline,
      { atIso: nowIso(), status: nextStatus, note: statusNote(nextStatus) },
    ],
  }

  await persistUpdatedOrder(updated)
  return updated
}

export async function setOrderStatus(orderId: string, newStatus: OrderStatus): Promise<Order | undefined> {
  const order = await getOrder(orderId)
  if (!order) return undefined
  if (order.status === newStatus) return order

  const updated: Order = {
    ...order,
    status: newStatus,
    timeline: [
      ...order.timeline,
      { atIso: nowIso(), status: newStatus, note: statusNote(newStatus) },
    ],
  }

  await persistUpdatedOrder(updated)
  return updated
}

export async function revertOrder(orderId: string): Promise<Order | undefined> {
  const order = await getOrder(orderId)
  if (!order) return undefined
  const currentIndex = STATUSES.indexOf(order.status)
  const prevIndex = Math.max(currentIndex - 1, 0)
  const prevStatus = STATUSES[prevIndex]
  if (prevStatus === order.status) return order

  const updated: Order = {
    ...order,
    status: prevStatus,
    timeline: [
      ...order.timeline,
      { atIso: nowIso(), status: prevStatus, note: 'Status corrected by ops' },
    ],
  }

  await persistUpdatedOrder(updated)
  return updated
}

async function persistUpdatedOrder(order: Order) {
  if (hasSupabaseConfig && supabase) {
    const { error } = await supabase.from('orders').upsert({
      id: order.id,
      customer_user_id: order.customerUserId ?? null,
      assigned_tailor_user_id: order.assignedTailorUserId ?? null,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      status: order.status,
      payload: order,
      created_at: order.createdAtIso,
      updated_at: nowIso(),
    })
    if (!error) return
    console.error('Failed to update order in Supabase, falling back:', error.message)
  }

  const all = readAll()
  const idx = all.findIndex((o) => o.id === order.id)
  if (idx === -1) {
    all.push(order)
  } else {
    all[idx] = order
  }
  writeAll(all)
}

async function resolveAssignedTailorUserId(tailorId: string): Promise<string | null> {
  return tailorId
}

function statusNote(status: OrderStatus): string {
  switch (status) {
    case 'Order Placed':
      return 'Order placed successfully'
    case 'In Progress':
      return 'Garment received by tailor'
    case 'Order Ready':
      return 'Tailor marked job ready'
    case 'Out for Delivery':
      return 'Rider started delivery'
    case 'Delivered':
      return 'Delivered to customer'
  }
}

