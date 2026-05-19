import { useLocation, Navigate, Outlet } from 'react-router-dom'
import type { Role } from '../domain/types'
import { useAuth } from './AuthContext'

export function RequireAuth() {
  const auth = useAuth()
  const loc = useLocation()

  if (!auth.hasSupabase) {
    return (
      <section className="card">
        <h1>Supabase not configured</h1>
        <p className="muted">
          Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in
          <code>.env</code> then restart.
        </p>
      </section>
    )
  }

  if (auth.loading) return <p className="muted">Checking session...</p>
  if (!auth.user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return <Outlet />
}

export function RequireRole(props: { allow: Role[] }) {
  const auth = useAuth()

  if (auth.loading) return <p className="muted">Checking access...</p>
  if (!auth.user) return <Navigate to="/login" replace />

  const role = auth.role
  if (!role || !props.allow.includes(role)) {
    return (
      <section className="card">
        <h1>Access denied</h1>
        <p className="muted">
          Your role is <b>{role ?? 'unknown'}</b>. Allowed: {props.allow.join(', ')}.
        </p>
      </section>
    )
  }

  return <Outlet />
}

export function RequireTailorApproved() {
  const auth = useAuth()

  if (auth.loading) return <p className="muted">Checking approval status...</p>
  
  const approvalStatus = auth.profile?.approvalStatus ?? 'pending'
  
  if (approvalStatus !== 'approved') {
    return (
      <section className="card">
        <h1>Approval Pending</h1>
        <p className="muted">
          Your tailor account is currently <b>{approvalStatus}</b>. Dashboard access will be
          available once approved by admin.
        </p>
      </section>
    )
  }
  return <Outlet />
}

