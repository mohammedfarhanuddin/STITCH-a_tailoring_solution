import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ErrorBoundary } from './components/layout/ErrorBoundary'
import { RequireAuth, RequireRole, RequireTailorApproved } from './auth/RouteGuards'
import { ROUTES } from './constants/routes'


// Lazy loaded pages
const HomePage = lazy(() => import('./pages/public/HomePage').then(m => ({ default: m.HomePage })))
const TailorsPage = lazy(() => import('./pages/public/TailorsPage').then(m => ({ default: m.TailorsPage })))
const ContactPage = lazy(() => import('./pages/public/ContactPage').then(m => ({ default: m.ContactPage })))
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage').then(m => ({ default: m.NotFoundPage })))

const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const CustomerSignupPage = lazy(() => import('./pages/auth/CustomerSignupPage').then(m => ({ default: m.CustomerSignupPage })))
const TailorSignupPage = lazy(() => import('./pages/auth/TailorSignupPage').then(m => ({ default: m.TailorSignupPage })))
const AuthCallbackPage = lazy(() => import('./pages/auth/AuthCallbackPage').then(m => ({ default: m.AuthCallbackPage })))
const TailorDetailsPage = lazy(() => import('./pages/auth/TailorDetailsPage').then(m => ({ default: m.TailorDetailsPage })))

const BookPage = lazy(() => import('./pages/customer/BookPage').then(m => ({ default: m.BookPage })))
const TrackOrderPage = lazy(() => import('./pages/customer/TrackOrderPage').then(m => ({ default: m.TrackOrderPage })))
const CustomerProfilePage = lazy(() => import('./pages/customer/ProfilePage').then(m => ({ default: m.ProfilePage })))
const RaiseIssuePage = lazy(() => import('./pages/customer/RaiseIssuePage').then(m => ({ default: m.RaiseIssuePage })))

const TailorDashboardPage = lazy(() => import('./pages/tailor/DashboardPage').then(m => ({ default: m.DashboardPage })))
const TailorOrdersPage = lazy(() => import('./pages/tailor/OrdersPage').then(m => ({ default: m.OrdersPage })))
const AccountProfilePage = lazy(() => import('./pages/tailor/TailorAccountPage').then(m => ({ default: m.TailorAccountPage })))
const ListingProfilePage = lazy(() => import('./pages/tailor/TailorPublicProfilePage').then(m => ({ default: m.TailorPublicProfilePage })))

const AdminDashboardPage = lazy(() => import('./pages/admin/DashboardPage').then(m => ({ default: m.DashboardPage })))
const AdminPendingTailorsPage = lazy(() => import('./pages/admin/PendingTailorsPage').then(m => ({ default: m.PendingTailorsPage })))
const AdminCustomerIssuesPage = lazy(() => import('./pages/admin/CustomerIssuesPage').then(m => ({ default: m.CustomerIssuesPage })))

const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--accent)' }}>
    <div style={{ animation: 'spin 1s linear infinite', border: '3px solid rgba(200,169,126,0.2)', borderTopColor: 'var(--accent)', borderRadius: '50%', width: '32px', height: '32px' }}></div>
    <style>
      {`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}
    </style>
  </div>
)

export default function App() {
  return (
    <AppShell>
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.CONTACT} element={<ContactPage />} />
            <Route path={ROUTES.TAILORS} element={<TailorsPage />} />
            <Route path={ROUTES.TAILOR_LISTING_PROFILE} element={<ListingProfilePage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallbackPage />} />
            <Route path={ROUTES.CUSTOMER_SIGNUP} element={<CustomerSignupPage />} />
            <Route path={ROUTES.TAILOR_SIGNUP} element={<TailorSignupPage />} />

            {/* Protected Core Routes */}
            <Route element={<RequireAuth />}>
              <Route path={ROUTES.TAILOR_SIGNUP_DETAILS} element={<TailorDetailsPage />} />
              <Route path={ROUTES.TRACK_ORDER} element={<TrackOrderPage />} />
              <Route path={ROUTES.TRACK_ORDER_PARAM} element={<TrackOrderPage />} />

              {/* Customer Layout */}
              <Route element={<RequireRole allow={['customer', 'admin']} />}>
                <Route path={ROUTES.BOOK} element={<BookPage />} />
                <Route path={ROUTES.CUSTOMER_PROFILE} element={<CustomerProfilePage />} />
                <Route path={ROUTES.RAISE_ISSUE} element={<RaiseIssuePage />} />
              </Route>

              {/* Tailor Layout */}
              <Route element={<RequireRole allow={['tailor', 'admin']} />}>
                <Route path={ROUTES.TAILOR_ACCOUNT_PROFILE} element={<AccountProfilePage />} />
                <Route element={<RequireTailorApproved />}>
                  <Route path={ROUTES.TAILOR_DASHBOARD} element={<TailorDashboardPage />} />
                  <Route path={ROUTES.TAILOR_ORDERS} element={<TailorOrdersPage />} />
                </Route>
              </Route>

              {/* Admin Layout */}
              <Route element={<RequireRole allow={['admin']} />}>
                <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
                <Route path={ROUTES.ADMIN_PENDING_TAILORS} element={<AdminPendingTailorsPage />} />
                <Route path={ROUTES.ADMIN_CUSTOMER_ISSUES} element={<AdminCustomerIssuesPage />} />
              </Route>
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </AppShell>
  )
}
