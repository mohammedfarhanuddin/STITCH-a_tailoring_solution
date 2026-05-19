# Smart Tailor (STITCH)

A premium, bespoke tailoring and repair service platform designed to bridge the gap between skilled local tailors and customers. Smart Tailor delivers a luxury experience with a promised 24-hour turnaround time right to the customer's doorstep.

## 🌟 Features

* **Role-Based Architecture**: Distinct, secure workflows for three user types:
  * **Customers**: Can browse tailors, book services, track orders, and raise issues.
  * **Tailors**: Have a dedicated dashboard to manage their profiles and orders (requires Admin approval to access).
  * **Admins**: Can oversee the platform, approve pending tailor accounts, and resolve customer issues.
* **Modern Luxury UI**: A custom-built, responsive dark-mode interface featuring glassmorphism elements, `Framer Motion` animations, and premium typography (`Playfair Display` & `Inter`).
* **Secure Authentication**: Powered by Supabase, featuring robust, race-condition-free session management and protected routing.
* **Scalable Routing**: Built with React Router utilizing lazy loading, nested layouts (`<Outlet />`), and Error Boundaries for a production-grade architecture.

## 🛠 Tech Stack

* **Frontend Framework:** React 18
* **Build Tool:** Vite
* **Language:** TypeScript
* **Routing:** React Router v7
* **State & Auth:** Supabase (Auth + PostgreSQL)
* **Styling:** Vanilla CSS (Custom Design System)
* **Animations:** Framer Motion

## 📂 Architecture Overview

The project is structured for scalability using domain-driven and feature-based boundaries:

```text
src/
├── auth/            # Authentication context and Route Guards
├── components/      # Reusable UI elements (AppShell, Navbar, Footer)
├── constants/       # Global constants (e.g., ROUTES)
├── domain/          # Business logic and Supabase database interactions
├── pages/           # Route-level components grouped by domain
│   ├── admin/       # Admin-specific pages
│   ├── auth/        # Login, Signup, and Callbacks
│   ├── customer/    # Customer profile and actions
│   ├── public/      # Landing pages (Home, 404, etc.)
│   └── tailor/      # Tailor dashboards and profiles
└── App.tsx          # Main application router with Suspense
```

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* npm or yarn
* A Supabase project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohammedfarhanuddin/STITCH-a_tailoring_solution.git
   cd STITCH-a_tailoring_solution
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 🌐 Deployment (Render)

This project includes a `render.yaml` Blueprint file, which makes deploying to [Render.com](https://render.com) almost automatic and ensures React Router handles page refreshes flawlessly.

1. Create a Render account and connect your GitHub repository.
2. In the Render Dashboard, click **New +** and select **Blueprint**.
3. Select your repository. Render will automatically read the `render.yaml` file and configure a Static Site.
4. During setup, Render will prompt you to enter the environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
5. Click **Apply** and wait for the deployment to finish!

## 🛡 Security & Authentication

The application implements a highly robust authentication flow to prevent UI freezing and race conditions:
- Global `loading` state is isolated strictly to the initial session boot.
- Token refreshes and background profile updates occur silently.
- Nested routing guards (`RequireAuth` ➡️ `RequireRole` ➡️ `RequireTailorApproved`) ensure users cannot access unauthorized layouts.

## 📜 License

This project is proprietary. All rights reserved.
