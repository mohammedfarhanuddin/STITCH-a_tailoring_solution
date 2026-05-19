import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { signOut } from '../../domain/auth'
import { useMemo } from 'react'
import { ROUTES } from '../../constants/routes'

export function Navbar() {
  const auth = useAuth()
  const navigate = useNavigate()

  const links = useMemo(() => {
    if (auth.loading) return []
    
    if (!auth.user) {
      return [
        { to: ROUTES.HOME, label: 'Home' },
        { to: ROUTES.CONTACT, label: 'Contact' },
      ]
    }

    if (auth.role === 'customer') {
      return [
        { to: ROUTES.TAILORS, label: 'Tailors' },
        { to: ROUTES.TRACK_ORDER, label: 'Orders' },
        { to: ROUTES.CUSTOMER_PROFILE, label: 'Profile' },
      ]
    }

    if (auth.role === 'tailor') {
      const isApproved = auth.profile?.approvalStatus === 'approved'
      return [
        ...(isApproved ? [{ to: ROUTES.TAILOR_DASHBOARD, label: 'Dashboard' }, { to: ROUTES.TAILOR_ORDERS, label: 'Orders' }] : []),
        { to: ROUTES.TAILOR_ACCOUNT_PROFILE, label: 'Profile' },
      ]
    }

    if (auth.role === 'admin') {
      return [
        { to: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard' },
        { to: ROUTES.ADMIN_PENDING_TAILORS, label: 'Pending Tailors' },
        { to: ROUTES.ADMIN_CUSTOMER_ISSUES, label: 'Customer Issues' },
      ]
    }

    return []
  }, [auth.loading, auth.user, auth.role, auth.profile?.approvalStatus])

  return (
    <header className="floatingNavbar">
      <div className="brand">
        <div className="logo">ST</div>
        <div className="brandTitle">Smart Tailor</div>
      </div>

      <nav className="navLinks">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === ROUTES.HOME}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="navActions">
        {!auth.loading && !auth.user && (
          <>
            <NavLink className="ghostBtn" to={ROUTES.LOGIN}>Login</NavLink>
            <NavLink className="luxuryBtn" to={ROUTES.CUSTOMER_SIGNUP}>Book Now</NavLink>
          </>
        )}
        {auth.user && (
          <button
            className="ghostBtn"
            onClick={async () => {
              await signOut()
              navigate(ROUTES.HOME, { replace: true })
            }}
          >
            Sign out
          </button>
        )}
      </div>
    </header>
  )
}
