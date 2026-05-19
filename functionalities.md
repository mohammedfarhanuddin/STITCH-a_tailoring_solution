# Smart Tailor - Platform Functionalities

This document outlines the complete set of features and functionalities available in the Smart Tailor platform, categorized by the three main user types.

## 1. Customer Functionalities

The platform provides a seamless experience for customers to find tailors, book services, and track their garments.

- **Authentication & Onboarding**
  - Sign up and log in using Email/Password or Google OAuth.
  - Maintain a personal profile including fitting sizes, location, and contact information.

- **Tailor Discovery**
  - Browse a curated list of approved local tailors.
  - View tailor details, including their specialty, pricing range, rating, and turnaround time.

- **Service Booking**
  - Choose a specific service flow (Men's or Women's).
  - Select the type of service required (Stitching, Alteration, or Repair).
  - Specify garment types and quantities.
  - Provide detailed measurement notes and attach reference photos for the tailor.
  - Schedule a convenient pickup date and time slot.
  - Enter pickup and delivery address details.

- **Order Tracking & Management**
  - View a list of recent orders directly from the tracking dashboard.
  - Track an order using a unique Order ID (e.g., `ST-260427-1234`).
  - View a detailed timestamped timeline of the order's journey from pickup to delivery.
  - See full pricing breakdowns, including service costs and delivery fees.

- **Customer Support**
  - Raise issues directly to the platform administrators if there is a problem with an order or tailor.

---

## 2. Tailor Functionalities

The platform equips tailors with the tools to manage their incoming digital workflow, update statuses, and track their earnings without needing complex software.

- **Registration & Compliance**
  - Fast onboarding using Google Authentication.
  - Dedicated onboarding flow to submit business details (Shop Name, Address) and regulatory documents (GSTIN, PAN, Aadhaar).

- **Dashboard Operations**
  - View high-level KPIs including total earnings to date, completed orders, and past-due orders.
  - View incoming job requests with garment details and service types.

- **Order Fulfillment**
  - **Accept Orders**: Move incoming jobs into their active queue.
  - **Status Management**: Instantly update the status of active jobs using a dropdown menu (e.g., marking a job as "In Progress" or "Order Ready"). These updates sync in real-time to the customer's tracking page.
  - **View Order Details**: Access the customer's measurement notes, requested garment details, and pickup/due dates.
  - Sort and filter the master orders list by "Price", "Earliest date", or "Quantity".

- **Quality Control (MVP)**
  - Access a built-in QC checklist to ensure standard practices (e.g., taking receipt photos, progress photos, and finished item photos).

---

## 3. Admin Functionalities

The platform provides administrators with centralized control over marketplace quality, logistics, and financial payouts.

- **Marketplace Moderation**
  - Review newly registered tailors in the "Pending Tailors" queue.
  - Approve or reject tailors based on their submitted documentation. (Only approved tailors are visible to customers).

- **Logistics Oversight**
  - View a live dashboard of all active orders categorized by current status (Pickup Scheduled, In Progress, Out for Delivery).
  - Intervene in any order's lifecycle using override buttons ("Next" / "Back" status) to resolve edge cases or logistic errors.

- **Financial Management**
  - Track the platform's monetary pool.
  - Monitor individual tailor earnings based on the platform's revenue-sharing split.
  - View calculated "Pending Payouts" representing funds that are ready to be released to tailors for completed jobs.

- **Support Resolution**
  - Access a dedicated "Customer Issues" inbox to view and manage complaints raised by customers.
