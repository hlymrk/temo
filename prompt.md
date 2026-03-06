
### Updated Comprehensive Agent Prompt

**Copy and paste this into your agent to ensure a complete system build:**

> **Role:** Senior Full-Stack Engineer.
> **Project:** **tempo** (lowercase) - Unified Restaurant Velocity System.
> **Architecture Goal:** Build a **Role-Based Unified Ledger** using Vite-Express, TypeScript, and Socket.io. The system must support three distinct user flows: **Customer**, **Staff**, and **Admin**.
> **1. Core System & Database:**
> * **Schema:** Design a `TableSession` Mongoose schema. It must track `items` (name, price, status: 'ordered'|'cooking'|'served'|'paid'), `activeUsers`, and `paymentStatus`.
> * **Sync:** Every state change in a `TableSession` must trigger a Socket.io broadcast to the corresponding `tableId` room.
> 
> 
> **2. The Tri-Sided Frontend (Mobile-First):**
> * **Customer Flow:** Scan QR -> Claim items from the Live Ledger -> Pay via **TrueLayer** (Bank) or **Stripe** (Card). UI must show real-time "Item Claimed by [User]" status to prevent double-paying.
> * **Staff Flow (Waiter Tablet):** A "Service Mode" dashboard. Features: Select Table -> Tap to add items -> "Fire" order to kitchen -> Monitor table "stagnation" time.
> * **Admin Flow (Manager Desktop):** Real-time analytics dashboard. Show **Live Net Margin** (Total Sales minus Payment Fees and COGS) and "Table Turnover Velocity."
> 

> * **UX:** Use `framer-motion` for smooth list transitions when items are added or claimed. Ensure all buttons on the Waiter/Customer mobile views are at least **48px** for easy tapping.
> 
> 
> **4. Implementation Task #1:**
> Initialize the backend with **Role-Based Access Control (RBAC)**. Define a `authMiddleware.ts` that identifies if a socket connection is a `CUSTOMER` (via Table QR) or `STAFF` (via Login). Build the `GET /api/table/:id/ledger` endpoint as the first piece of shared state."

---

### Missing Dependencies (Add these now)

Since we are adding a Staff/Admin side, your agent will need these for the dashboards and security:

```bash
npm install framer-motion lucide-react react-hook-form zod @tanstack/react-query

```

* **`framer-motion`**: For that "premium" 2026 feel when items move across the screen.
* **`zod`**: To validate the complex "Table Session" data coming from your MongoDB.
* **`react-query`**: To handle the Admin Dashboard data fetching without making the app feel slow.
