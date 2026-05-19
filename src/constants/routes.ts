export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  AUTH_CALLBACK: '/auth/callback',
  CONTACT: '/contact',
  
  // Public Tailor flows
  TAILORS: '/tailors',
  TAILOR_LISTING_PROFILE: '/tailors/:tailorId',

  // Customer flows
  CUSTOMER_SIGNUP: '/signup/customer',
  BOOK: '/book',
  CUSTOMER_PROFILE: '/customer/profile',
  RAISE_ISSUE: '/customer/issues/new',
  TRACK_ORDER: '/track',
  TRACK_ORDER_PARAM: '/track/:orderId',

  // Tailor flows
  TAILOR_SIGNUP: '/signup/tailor',
  TAILOR_SIGNUP_DETAILS: '/signup/tailor/details',
  TAILOR_DASHBOARD: '/dashboard/tailor',
  TAILOR_ORDERS: '/dashboard/tailor/orders',
  TAILOR_ACCOUNT_PROFILE: '/dashboard/tailor/profile',

  // Admin flows
  ADMIN_DASHBOARD: '/dashboard/admin',
  ADMIN_PENDING_TAILORS: '/dashboard/admin/pending-tailors',
  ADMIN_CUSTOMER_ISSUES: '/dashboard/admin/customer-issues',
} as const
