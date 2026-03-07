import Stripe from "stripe";
import * as dineroLib from "dinero.js";
import * as currenciesLib from "dinero.js/currencies";
import { Payment } from "../models/Payment.js";

const dinero = (dineroLib as any).dinero || (dineroLib as any).default?.dinero;
const toSnapshot =
  (dineroLib as any).toSnapshot || (dineroLib as any).default?.toSnapshot;
const GBP = (currenciesLib as any).GBP || (currenciesLib as any).default?.GBP;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-02-25.clover",
});

export class PaymentService {
  // Create Stripe Payment Intent for card/Apple Pay/Google Pay
  static async createStripePayment(
    amountInPence: number,
    metadata: Record<string, string>,
    itemIds: string[],
  ) {
    try {
      // Create a Checkout Session instead of just a PaymentIntent
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "gbp",
              product_data: {
                name: "Restaurant Order Payment",
                description: `Payment for items: ${itemIds.join(", ")}`,
              },
              unit_amount: amountInPence,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.BASE_URL || "http://localhost:3000"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL || "http://localhost:3000"}/payment-selection`,
        metadata,
      });

      // Save payment record
      await Payment.create({
        orderId: metadata.orderId,
        userId: metadata.userId,
        tableId: metadata.tableId,
        amountInPence,
        provider: "stripe",
        providerPaymentId: session.id,
        status: "pending",
        itemIds,
      });

      return {
        checkoutUrl: session.url,
        sessionId: session.id,
      };
    } catch (error) {
      console.error("Stripe payment creation failed:", error);
      throw new Error("Failed to create payment");
    }
  }

  // Create TrueLayer payment (PISP - Payment Initiation Service Provider)
  static async createTrueLayerPayment(
    amountInPence: number,
    userId: string,
    orderId: string,
  ) {
    // TrueLayer implementation
    // Note: This requires TrueLayer SDK setup and merchant account
    const amount = dinero({ amount: amountInPence, currency: GBP });
    const snapshot = toSnapshot(amount);

    // For now, return a mock response structure
    // In production, you'd use the TrueLayer SDK
    return {
      paymentId: `tl_${Date.now()}`,
      authorizationUrl: `https://payment.truelayer.com/payments/${Date.now()}`,
      amount: snapshot.amount,
      currency: snapshot.currency.code,
      status: "authorization_required",
    };
  }

  // Verify Stripe payment
  static async verifyStripePayment(sessionId: string) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return {
        status: session.payment_status === "paid" ? "succeeded" : "pending",
        amount: session.amount_total,
        paid: session.payment_status === "paid",
      };
    } catch (error) {
      console.error("Stripe payment verification failed:", error);
      throw new Error("Failed to verify payment");
    }
  }

  // Calculate recommended payment method based on amount
  static getRecommendedPaymentMethod(
    amountInPence: number,
  ): "truelayer" | "stripe" {
    // Recommend TrueLayer for amounts over £20 (lower fees)
    return amountInPence > 2000 ? "truelayer" : "stripe";
  }

  // Get payments with optional filters
  static async getPayments(filters: {
    tableId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const query: any = {};

    if (filters.tableId) {
      query.tableId = filters.tableId;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.createdAt.$lte = filters.endDate;
      }
    }

    const payments = await Payment.find(query).sort({ createdAt: -1 }).lean();
    return payments;
  }
}
