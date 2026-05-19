# Smart Tailor (TailorTwo) - Project Summary

## 1. Project Overview
Smart Tailor is a platform designed to connect customers with local tailors for alteration, stitching, and repair services. It serves as an end-to-end marketplace managing everything from tailor discovery and order booking to tracking and administration.

## 2. Technology Stack
- **Frontend Framework**: React 18, Vite, TypeScript
- **Routing**: React Router (`react-router-dom`)
- **Backend & Database**: Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- **Styling**: Vanilla CSS (`index.css`)

---

## 3. User Roles & Authentication
The application relies on Supabase Auth and supports three distinct roles. Role management is driven by user metadata passed during the signup phase.

1. **Customers**: 
   - **Signup**: Can sign up via standard Email/Password or Google OAuth.
   - **Permissions**: Can view approved tailors, create bookings, and track their own orders.
2. **Tailors**:
   - **Signup**: Initiated via Google OAuth. Once authenticated, they are redirected to a details page (`TailorDetailsPage`) to complete their shop profile (GSTIN, PAN, Address).
   - **Permissions**: Start in a `pending` state. Once `approved` by an admin, they appear on the public marketplace. Can view and update the status of orders assigned to them.
3. **Admin**:
   - **Permissions**: Can view all orders, approve pending tailors, view customer issues, and manage payouts.

> [!NOTE] 
> **Database Trigger Workflow**: When a user signs up, Supabase Auth creates a user record. A PostgreSQL trigger (`handle_new_user`) automatically detects the `role` from the user's metadata and inserts a corresponding record into the public `profiles` table, as well as the specialized `customer_profiles` or `tailor_profiles` tables.

---

## 4. Database Architecture (Supabase)

The database utilizes PostgreSQL with strict Row Level Security (RLS) to ensure data privacy. 

- **`profiles` (Base Table)**: Stores shared data for all users (`id`, `role`, `display_name`).
- **`customer_profiles`**: Stores customer-specific data (fitting sizes, locations). RLS ensures customers can only read/update their own profile.
- **`tailor_profiles`**: Stores shop details and compliance data. 
  - *Security*: Tailors can edit their own profile. Admins can read all profiles. A public policy allows anyone to read profiles where `approval_status = 'approved'`.
- **`orders`**: Stores the complete lifecycle of a booking. Includes JSON payloads for extensibility, tracking the assigned tailor, customer, pricing, and a timestamped timeline of events.

---

## 5. Core Workflows & Data Flow

### A. Tailor Discovery & Booking Flow
1. **Fetching Tailors**: When a customer visits the "Tailors Near Me" page (`TailorsPage.tsx`), `getApprovedTailors()` queries the `tailor_profiles` table for rows where `approval_status = 'approved'`.
2. **Booking (`BookPage.tsx`)**: The customer selects a tailor from the dynamic dropdown, inputs garment details, and selects a pickup slot.
3. **Order Creation**: Calling `createOrder()` generates a unique `ST-YYYYMMDD-XXXX` ID. Pricing is computed locally (in this MVP) based on service multipliers. The order is pushed to the `orders` table in Supabase.

### B. Order Lifecycle Management
The application follows a strict state-machine flow for orders. The status is stored as a string enum (`OrderStatus`):

`Order Placed` ➔ `In Progress` ➔ `Order Ready` ➔ `Out for Delivery` ➔ `Delivered`

1. **Order Placed**: Customer creates the booking.
2. **In Progress (Tailor Accepted)**: The tailor sees the incoming order on their `TailorDashboardPage` and clicks "Accept".
3. **Order Ready**: The tailor completes the work. Using the dropdown on their Dashboard or Orders page, they change the status to "Order Ready".
4. **Completion**: Subsequent statuses (`Out for Delivery`, `Delivered`) can be triggered by delivery riders (or admins in the MVP).

> [!TIP]
> Every time the status changes using `setOrderStatus()` or `advanceOrder()`, an entry is appended to the `order.timeline` array. This timeline is rendered on the `TrackOrderPage.tsx` exclusively for customers and admins (hidden from tailors).

---

## 6. Codebase Structure (`src/`)

- **`/domain`**: Contains the core business logic, API calls, and types.
  - `auth.ts`: Signup, login, and profile fetching functions.
  - `orders.ts`: Order creation, listing, status updates, and pricing logic.
  - `tailors.ts`: Fetching approved tailors for the marketplace.
  - `admin.ts`: Admin queries (fetching pending tailors, customer issues).
  - `types.ts`: TypeScript interfaces (`Order`, `OrderStatus`, `TailorProfileDetails`).
- **`/auth`**: 
  - `AuthContext.tsx`: A global React Context provider that listens to Supabase session changes and exposes `user`, `profile`, and `role` to the rest of the application.
- **`/pages`**: The UI layer.
  - **Public/Customer**: `HomePage`, `BookPage`, `TailorsPage`, `TrackOrderPage`
  - **Tailor**: `TailorDashboardPage`, `TailorOrdersPage`, `TailorDetailsPage`
  - **Admin**: `AdminDashboardPage`, `AdminPendingTailorsPage`
