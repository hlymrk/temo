# tempo

A real-time restaurant payment splitting system built for UK restaurants.

## Overview

Tempo allows restaurant customers to scan a QR code, view their bill in real-time, claim items, and pay their share instantly using bank transfer or card payment.

## Features

- ⚡ Real-time bill synchronization across all devices at a table
- 💡 Smart payment recommendations (bank transfer for amounts over £20)
- 💳 Support for Stripe (Card, Apple Pay, Google Pay) and TrueLayer (instant bank transfer)
- 📱 Mobile-first design with accessibility-compliant touch targets
- 🎯 Precise currency calculations to avoid VAT rounding errors
- 🔒 Secure payment processing with webhook verification
- 📊 Payment tracking and history

## Tech Stack

- **Frontend**: React 19, TypeScript, Material-UI, Zustand, Socket.io Client
- **Backend**: Node.js, Express 5, TypeScript, Socket.io
- **Database**: MongoDB Atlas
- **Payments**: Stripe, TrueLayer
- **Dev Tools**: Vite, tsx, nodemon

## Getting Started

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed setup instructions.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB Atlas URI and API keys

# Start development server
npm run dev
```

Open http://localhost:3000

## Project Structure

```
tempo/
├── src/
│   ├── client/              # React frontend
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom hooks (useSocket)
│   │   ├── store/           # Zustand state management
│   │   └── theme.ts         # MUI theme (Tempo colors)
│   └── server/              # Express backend
│       ├── models/          # Mongoose schemas
│       ├── services/        # Business logic
│       ├── controllers/     # Route handlers
│       ├── sockets/         # Socket.io events
│       ├── routes/          # API routes
│       └── utils/           # Utilities (QR generation)
├── public/                  # Static assets
└── DEVELOPMENT.md           # Development guide
```

## License

MIT
