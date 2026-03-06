import { Router } from 'express';
import {
  createStripePaymentIntent,
  createTrueLayerPayment,
  verifyPayment,
} from '../controllers/paymentController.js';

const router = Router();

router.post('/payments/stripe', createStripePaymentIntent);
router.post('/payments/truelayer', createTrueLayerPayment);
router.get('/payments/verify/:paymentIntentId', verifyPayment);

export default router;
