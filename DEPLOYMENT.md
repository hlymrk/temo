# Tempo Deployment Guide

## Prerequisites

- Node.js 20+
- MongoDB Atlas account
- Stripe account
- TrueLayer merchant account (optional)
- Domain name (for production)

## Environment Variables

### Production Environment

Create a `.env` file with the following variables:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tempo?retryWrites=true&w=majority

# Server
NODE_ENV=production
PORT=3000
BASE_URL=https://yourdomain.com

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# TrueLayer
TRUELAYER_CLIENT_ID=your_client_id
TRUELAYER_CLIENT_SECRET=your_client_secret
```

### Client Environment

Create `.env.local` for Vite:

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Build for Production

```bash
# Install dependencies
npm install

# Build the client
npm run build

# Start production server
npm start
```

## Deployment Options

### Option 1: Traditional VPS (DigitalOcean, Linode, etc.)

1. Set up a Ubuntu 22.04 server
2. Install Node.js 20+
3. Clone the repository
4. Set up environment variables
5. Install PM2 for process management:

```bash
npm install -g pm2
pm2 start npm --name "tempo" -- start
pm2 save
pm2 startup
```

6. Set up Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. Set up SSL with Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Option 2: Heroku

1. Create a new Heroku app
2. Add MongoDB Atlas add-on or use external MongoDB
3. Set environment variables in Heroku dashboard
4. Add `Procfile`:

```
web: npm start
```

5. Deploy:

```bash
git push heroku main
```

### Option 3: Vercel/Railway

1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push

## Post-Deployment

### 1. Configure Stripe Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 2. Test Payment Flow

1. Create a test order
2. Join table from mobile device
3. Claim items
4. Test Stripe payment with test card: `4242 4242 4242 4242`
5. Verify webhook receives payment confirmation

### 3. Generate QR Codes

```bash
curl -X POST https://yourdomain.com/api/qr/generate \
  -H "Content-Type: application/json" \
  -d '{"tableId": "T1", "restaurantId": "restaurant-1"}'
```

Download QR codes from `/qr-codes/restaurant-1/table-T1.png`

### 4. Monitor

- Set up error tracking (Sentry, LogRocket)
- Monitor MongoDB Atlas metrics
- Set up uptime monitoring
- Monitor Stripe dashboard for payment issues

## Security Checklist

- [ ] All API keys in environment variables (not committed)
- [ ] HTTPS enabled with valid SSL certificate
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Stripe webhook signature verification enabled
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled (consider express-rate-limit)
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose sensitive info

## Scaling Considerations

### Horizontal Scaling

For Socket.io to work across multiple instances:

1. Use Redis adapter:

```bash
npm install @socket.io/redis-adapter redis
```

2. Update Socket.io configuration:

```typescript
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));
```

### Database Optimization

- Add indexes on frequently queried fields
- Use MongoDB Atlas auto-scaling
- Consider read replicas for high traffic

### CDN

- Serve static assets (QR codes) from CDN
- Use Cloudflare or AWS CloudFront

## Monitoring & Maintenance

### Health Check

```bash
curl https://yourdomain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "tempo",
  "mongodb": "connected",
  "socketio": "active"
}
```

### Logs

```bash
# PM2 logs
pm2 logs tempo

# View last 100 lines
pm2 logs tempo --lines 100
```

### Backup

- MongoDB Atlas automatic backups enabled
- Export payment records regularly
- Backup QR code images

## Troubleshooting

### Socket.io Connection Issues

- Check CORS configuration
- Verify WebSocket support on hosting platform
- Check firewall rules

### Payment Failures

- Verify Stripe API keys
- Check webhook endpoint is accessible
- Review Stripe dashboard logs

### Database Connection Issues

- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user has correct permissions
