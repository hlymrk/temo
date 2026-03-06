import { Router } from 'express';
import express from 'express';
import { handleStripeWebhook } from '../controllers/webhookController.js';

const router = Router();

// Stripe requires raw body for webhook signature verification
router.post(
  '/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

export default router;
