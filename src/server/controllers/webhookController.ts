import { Request, Response } from "express";
import Stripe from "stripe";
import { Payment } from "../models/Payment.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-02-25.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).send("Missing stripe-signature header");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res
      .status(400)
      .send(
        `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("✓ Checkout session completed:", session.id);

      // Update payment status
      await Payment.findOneAndUpdate(
        { providerPaymentId: session.id },
        { status: "succeeded" },
      );

      const orderId = session.metadata?.orderId;
      if (orderId) {
        console.log(`✓ Order ${orderId} payment confirmed`);
      }
      break;

    case "checkout.session.expired":
      const expiredSession = event.data.object as Stripe.Checkout.Session;
      console.log("✗ Checkout session expired:", expiredSession.id);

      await Payment.findOneAndUpdate(
        { providerPaymentId: expiredSession.id },
        { status: "expired" },
      );
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};
