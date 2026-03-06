# Tempo API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### Orders

#### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "tableId": "T42",
  "restaurantId": "restaurant-1",
  "items": [
    {
      "id": "1",
      "name": "Margherita Pizza",
      "priceInPence": 1200,
      "quantity": 1
    }
  ]
}
```

#### Get Order by Table ID
```http
GET /api/orders/table/:tableId
```

#### Seed Test Order
```http
POST /api/orders/seed
Content-Type: application/json

{
  "tableId": "T42"
}
```

### Payments

#### Create Stripe Payment Intent
```http
POST /api/payments/stripe
Content-Type: application/json

{
  "orderId": "table-id",
  "userId": "user-123",
  "itemIds": ["1", "2"]
}

Response:
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx",
  "amount": 2050,
  "recommended": "truelayer"
}
```

#### Create TrueLayer Payment
```http
POST /api/payments/truelayer
Content-Type: application/json

{
  "orderId": "table-id",
  "userId": "user-123",
  "itemIds": ["1", "2"]
}

Response:
{
  "paymentId": "tl_xxx",
  "authorizationUrl": "https://payment.truelayer.com/payments/xxx",
  "amount": 2050,
  "currency": "GBP",
  "status": "authorization_required"
}
```

#### Verify Payment
```http
GET /api/payments/verify/:paymentIntentId

Response:
{
  "status": "succeeded",
  "amount": 2050,
  "paid": true
}
```

### QR Codes

#### Generate QR Code
```http
POST /api/qr/generate
Content-Type: application/json

{
  "tableId": "T42",
  "restaurantId": "restaurant-1"
}

Response:
{
  "success": true,
  "qrCodeUrl": "/qr-codes/restaurant-1/table-T42.png",
  "tableUrl": "http://localhost:3000/table/T42",
  "tableId": "T42"
}
```

#### Get Table URL
```http
GET /api/qr/table/:tableId

Response:
{
  "tableUrl": "http://localhost:3000/table/T42",
  "tableId": "T42"
}
```

### Webhooks

#### Stripe Webhook
```http
POST /webhooks/stripe
Content-Type: application/json
Stripe-Signature: xxx

# Handled events:
- payment_intent.succeeded
- payment_intent.payment_failed
```

## Socket.io Events

### Client → Server

#### Join Table
```javascript
socket.emit('join-table', 'T42');
```

#### Claim Item
```javascript
socket.emit('claim-item', {
  orderId: '507f1f77bcf86cd799439011',
  itemId: '1',
  userId: 'user-123'
});
```

#### Unclaim Item
```javascript
socket.emit('unclaim-item', {
  orderId: '507f1f77bcf86cd799439011',
  itemId: '1'
});
```

### Server → Client

#### Order State
```javascript
socket.on('order-state', (order) => {
  // Sent when joining a table
  // Contains full order object
});
```

#### Order Updated
```javascript
socket.on('order-updated', (order) => {
  // Sent when any item is claimed/unclaimed
  // Contains updated order object
});
```

## Data Models

### Order
```typescript
{
  _id: string;
  tableId: string;
  restaurantId: string;
  items: OrderItem[];
  totalInPence: number;
  vatInPence: number;
  status: 'active' | 'partial' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}
```

### OrderItem
```typescript
{
  id: string;
  name: string;
  priceInPence: number;
  quantity: number;
  claimedBy?: string;
}
```

### Payment
```typescript
{
  _id: string;
  orderId: string;
  userId: string;
  tableId: string;
  amountInPence: number;
  provider: 'stripe' | 'truelayer';
  providerPaymentId: string;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
  itemIds: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400` - Bad Request (missing or invalid parameters)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error
