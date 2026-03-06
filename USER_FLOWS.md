# Tempo User Flows

## Overview

Tempo is designed for three user types: Restaurant Owners, Waiters, and Customers. Here's how each interacts with the system.

---

## 🍽️ Customer Flow (Currently Implemented)

### 1. Arriving at Table
- Customer sits at table with QR code displayed
- Scans QR code with phone camera
- Opens Tempo app automatically with table ID

### 2. Viewing the Bill
- Sees live bill with all ordered items
- Items show: name, price, quantity
- Can see which items are already claimed by others
- Total updates in real-time

### 3. Claiming Items
- Taps "Claim" on items they want to pay for
- Items turn green and show "Claimed"
- Can unclaim if they change their mind
- Sees their running total at bottom

### 4. Payment
- Clicks "Proceed to Payment"
- Sees two options:
  - **Bank Transfer** (recommended for £20+, lower fees)
  - **Card Payment** (Apple Pay, Google Pay, or card)
- Completes payment
- Sees success confirmation

### 5. Real-Time Sync
- All customers at table see updates instantly
- When someone claims an item, it's marked for everyone
- No conflicts or double-payments

---

## 👔 Waiter Flow (Needs Implementation)

### Current State: Manual API Calls
Currently, waiters would need to use API endpoints directly. Here's what needs to be built:

### Proposed Waiter Dashboard

#### 1. Taking Orders
```
Waiter App/Tablet Interface:
- Select table number
- Add items from menu
- Send order to kitchen
- Create bill in Tempo system
```

#### 2. Managing Tables
```
Table Overview:
- See all active tables
- View order status (ordering, eating, paying, completed)
- See payment progress (who paid, who hasn't)
- Generate/regenerate QR codes
```

#### 3. Monitoring Payments
```
Payment Dashboard:
- Real-time view of payment status per table
- See which customers have paid
- See remaining balance
- Mark table as complete when all paid
```

#### 4. Handling Issues
```
Support Actions:
- Manually mark items as paid
- Void items if needed
- Split items differently if requested
- Generate receipts
```

---

## 👨‍💼 Restaurant Owner Flow (Needs Implementation)

### Proposed Owner Dashboard

#### 1. Setup & Configuration
```
Initial Setup:
- Register restaurant
- Set up payment accounts (Stripe, TrueLayer)
- Configure menu items and prices
- Set up tables and QR codes
- Train staff
```

#### 2. Daily Operations
```
Operations Dashboard:
- View all active tables
- Monitor payment flow
- See daily revenue
- Track payment methods used
- View average transaction time
```

#### 3. Analytics & Reports
```
Business Intelligence:
- Daily/weekly/monthly revenue
- Payment method breakdown
- Peak hours analysis
- Average bill per table
- Popular items
- Payment success rate
- Customer wait times
```

#### 4. Management
```
Admin Functions:
- Manage staff accounts
- Update menu and prices
- Configure payment settings
- View transaction history
- Export financial reports
- Manage refunds
```

---

## 🔄 Complete End-to-End Flow

### Scenario: Group of 4 Friends at Dinner

**1. Restaurant Setup (Owner - One Time)**
- Owner generates QR code for Table 5
- Prints and places QR code on table
- Configures menu in system

**2. Order Placement (Waiter)**
- Waiter takes order from table
- Enters order in POS/Tempo system:
  - 2x Margherita Pizza (£12 each)
  - 1x Caesar Salad (£8.50)
  - 4x Craft Beer (£5.50 each)
  - 1x Tiramisu (£6.50)
- Order sent to kitchen
- Bill created in Tempo (Total: £59.50)

**3. During Meal (Automatic)**
- Customers can scan QR anytime to view bill
- Bill updates if waiter adds items
- Real-time sync across all phones

**4. Payment Time (Customers)**

**Customer A (Alice):**
- Scans QR code
- Sees full bill
- Claims: 1x Pizza (£12), 1x Beer (£5.50)
- Total: £17.50
- Pays with Apple Pay

**Customer B (Bob):**
- Scans QR code
- Sees Alice already claimed her items
- Claims: 1x Pizza (£12), 1x Beer (£5.50)
- Total: £17.50
- Pays with bank transfer

**Customer C (Charlie):**
- Claims: 1x Salad (£8.50), 1x Beer (£5.50)
- Total: £14.00
- Pays with card

**Customer D (Diana):**
- Claims: 1x Tiramisu (£6.50), 1x Beer (£5.50)
- Total: £12.00
- Pays with Google Pay

**5. Completion (Waiter)**
- Waiter sees all payments completed
- Marks table as complete
- Table ready for next customers

---

## 🚀 What's Built vs. What's Needed

### ✅ Currently Implemented (MVP)

**Customer Experience:**
- QR code scanning (manual table ID entry)
- Live bill viewing
- Real-time item claiming
- Payment method selection
- Stripe payment integration
- TrueLayer structure (needs merchant account)
- Socket.io real-time sync
- Mobile-responsive UI

**Backend Infrastructure:**
- Order management API
- Payment processing
- Webhook handling
- QR code generation
- Real-time WebSocket events
- Payment tracking

### 🔨 Needs Implementation

**Waiter Interface:**
- Tablet/mobile app for waiters
- Order entry system
- Table management dashboard
- Payment monitoring
- Manual overrides

**Owner Dashboard:**
- Web admin panel
- Analytics and reporting
- Menu management
- Staff management
- Financial reports
- Settings configuration

**Integration:**
- POS system integration
- Kitchen display system
- Receipt printer integration
- Accounting software export

---

## 📱 Recommended Implementation Priority

### Phase 1: Waiter Tools (Critical)
1. Simple web interface for creating orders
2. Table status dashboard
3. Payment monitoring
4. Basic manual overrides

### Phase 2: Owner Dashboard (Important)
1. Analytics dashboard
2. Menu management
3. Basic reporting
4. Settings management

### Phase 3: Advanced Features (Nice to Have)
1. POS integration
2. Advanced analytics
3. Multi-location support
4. Staff scheduling
5. Inventory management

---

## 🎯 Quick Start for Testing Current System

### As a "Waiter" (via API):
```bash
# Create an order for table T5
curl -X POST http://localhost:3000/api/orders/seed \
  -H "Content-Type: application/json" \
  -d '{"tableId": "T5"}'

# Generate QR code
curl -X POST http://localhost:3000/api/qr/generate \
  -H "Content-Type: application/json" \
  -d '{"tableId": "T5", "restaurantId": "restaurant-1"}'
```

### As a Customer:
1. Open http://localhost:3000
2. Enter table ID: T5
3. Claim items
4. Pay

### As an "Owner" (via MongoDB):
- View orders in MongoDB Atlas
- Check payment records
- Monitor real-time connections

---

## 💡 Business Model Implications

### Revenue Streams
1. **Transaction Fee**: Small % per payment (1-2%)
2. **Subscription**: Monthly fee per restaurant
3. **Premium Features**: Advanced analytics, integrations

### Value Proposition
- **For Customers**: Fast, easy bill splitting, no awkward math
- **For Waiters**: Less time handling payments, faster table turnover
- **For Owners**: Faster payments, better analytics, reduced payment errors

### Competitive Advantages
- Real-time synchronization (no conflicts)
- UK-optimized (TrueLayer integration)
- Mobile-first design
- Lower fees than traditional payment terminals
