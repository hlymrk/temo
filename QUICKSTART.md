# Tempo Quick Start

## For Customers

1. **Scan QR code** at your table or visit http://localhost:3000
2. **Enter table ID** (e.g., T42)
3. **Claim items** you want to pay for
4. **Pay** with your preferred method

## For Waiters (Staff)

1. **Access waiter dashboard:** http://localhost:3000?waiter=true
2. **Create orders** for tables
3. **Generate QR codes** for tables
4. **Monitor** active tables and item status

## For Managers (Admin)

1. **Access admin dashboard:** http://localhost:3000?admin=true
2. **View real-time analytics:**
   - Active tables
   - Completed sessions today
   - Total revenue
   - Average session time
3. **Monitor table turnover velocity**
4. **Track live net margin**

## Presentation Mode

**View the pitch deck:** http://localhost:3000?presentation=true

9 slides covering:
- The problem & solution
- Key features
- How it works
- Business impact
- Technology stack
- Future roadmap

Perfect for demos, investor pitches, or team presentations!

## For Testing

### Create a test session:
```bash
curl -X POST http://localhost:3000/api/orders/seed \
  -H "Content-Type: application/json" \
  -d '{"tableId": "T42"}'
```

### Test the customer flow:
1. Open http://localhost:3000
2. Enter table: T42
3. Open multiple windows to see real-time sync

### Test payment:
Add to `.env.local`:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```
Test card: `4242 4242 4242 4242`

## New Features

### Role-Based Access Control (RBAC)
- **CUSTOMER**: Can view and claim items
- **STAFF**: Can create orders, update item status
- **ADMIN**: Can view analytics and reports

### Item Status Tracking
- **ordered** → **cooking** → **served** → **paid**
- Real-time updates across all connected clients

### Analytics Dashboard
- Live revenue tracking
- Table turnover velocity
- Payment method breakdown
- Session time analysis

### Presentation Mode
- Professional pitch deck
- Animated transitions with Framer Motion
- Keyboard navigation (arrow keys)
- Perfect for demos and pitches

## Documentation
- User flows: [USER_FLOWS.md](./USER_FLOWS.md)
- Full setup: [DEVELOPMENT.md](./DEVELOPMENT.md)
- API docs: [API.md](./API.md)
- Deploy: [DEPLOYMENT.md](./DEPLOYMENT.md)
