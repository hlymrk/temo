import { Router } from "express";
import {
  createStripePaymentIntent,
  createTrueLayerPayment,
  verifyPayment,
  getPayments,
} from "../controllers/paymentController.js";

const router = Router();

router.post("/payments/stripe", createStripePaymentIntent);
router.post("/payments/truelayer", createTrueLayerPayment);
router.get("/payments/verify/:paymentIntentId", verifyPayment);
router.get("/payments", getPayments);

export default router;
