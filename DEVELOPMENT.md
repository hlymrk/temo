# Tempo

A real-time restaurant payment splitting system optimized for UK mobile and desktop users. Built with Vite-Express, TypeScript, React (MUI), MongoDB, Socket.io, Stripe, and TrueLayer.

## Features

✅ Real-time bill splitting with Socket.io table rooms
✅ Mobile-first UI with 44px touch targets
✅ Stripe integration (Card, Apple Pay, Google Pay)
✅ TrueLayer bank transfer support (lower fees for £20+)
✅ Precise currency calculations with dinero.js v2
✅ QR code generation for table access
✅ Payment webhooks and tracking
✅ Error boundaries and connection monitoring

## Tech Stack

- **Frontend**: React 19, TypeScript, MUI, Zustand, Socket.io Client
- **Backend**: Node.js, Express 5, TypeScript, Socket.io
- **Database**: MongoDB Atlas
- **Payments**: Stripe, TrueLayer
- **Dev Tools**: Vite, tsx, nodemon

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB Atlas connection string:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/tempo?retryWrites=true&w=majority
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

You should see:
- ✓ MongoDB connected successfully
- ✓ Socket.io initialized
- ✓ Server ready on http://localhost:3000

## Testing the Live Ledger

1. Create a test order:
```bash
curl -X POST http://localhost:3000/api/orders/seed \
  -H "Content-Type: application/json" \
  -d '{"tableId": "T42"}'
```

2. Open the app in multiple browser windows/tabs

3. Enter table ID: `T42`

4. Watch real-time updates as you claim/unclaim items across different windows

## Architecture

```
src/
├── client/
│   ├── components/     # UI components
│   ├── hooks/          # useSocket hook
│   ├── store/          # Zustand state management
│   └── theme.ts        # MUI theme (Tempo colors)
├── server/
│   ├── models/         # Mongoose schemas
│   ├── services/       # Business logic (OrderService)
│   ├── controllers/    # Route handlers
│   ├── sockets/        # Socket.io event handlers
│   └── routes/         # Express routes
```

## Next Steps

### Phase 3: Payment Integration ✅ (In Progress)
- [x] Stripe Payment Intent API
- [x] TrueLayer payment structure
- [x] Payment recommendation logic (>£20 = TrueLayer)
- [x] Client-side payment UI with loading states
- [ ] Complete TrueLayer SDK integration
- [ ] Payment webhook handlers
- [ ] Payment confirmation flow

### Phase 4: Polish
- [ ] Add QR code generation utility
- [ ] Add error boundaries
- [ ] Add loading states
- [ ] Mobile responsive testing
- [ ] Payment receipt generation

## Payment Testing

To test payments, you'll need:

1. Stripe test keys in `.env`:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

2. Client-side Stripe key in `.env.local`:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date and CVC
