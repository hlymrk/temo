import Stripe from 'stripe';
import * as dineroLib from 'dinero.js';
import * as currenciesLib from 'dinero.js/currencies';
import { Payment } from '../models/Payment.js';

const dinero = (dineroLib as any).dinero || (dineroLib as any).default?.dinero;
const toSnapshot = (dineroLib as any).toSnapshot || (dineroLib as any).default?.toSnapshot;
const GBP = (currenciesLib as any).GBP || (currenciesLib as any).default?.GBP;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-02-25.clover',
});

export class PaymentService {
  // Create Stripe Payment Intent for card/Apple Pay/Google Pay
  static async createStripePayment(
    amountInPence: number,
    metadata: Record<string, string>,
    itemIds: string[]
  ) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInPence,
        currency: 'gbp',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata,
      });

      // Save payment record
      await Payment.create({
        orderId: metadata.orderId,
        userId: metadata.userId,
        tableId: metadata.tableId,
        amountInPence,
        provider: 'stripe',
        providerPaymentId: paymentIntent.id,
        status: 'pending',
        itemIds,
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Stripe payment creation failed:', error);
      throw new Error('Failed to create payment');
    }
  }

  // Create TrueLayer payment (PISP - Payment Initiation Service Provider)
  static async createTrueLayerPayment(
    amountInPence: number,
    userId: string,
    orderId: string
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
      status: 'authorization_required',
    };
  }

  // Verify Stripe payment
  static async verifyStripePayment(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        paid: paymentIntent.status === 'succeeded',
      };
    } catch (error) {
      console.error('Stripe payment verification failed:', error);
      throw new Error('Failed to verify payment');
    }
  }

  // Calculate recommended payment method based on amount
  static getRecommendedPaymentMethod(amountInPence: number): 'truelayer' | 'stripe' {
    // Recommend TrueLayer for amounts over £20 (lower fees)
    return amountInPence > 2000 ? 'truelayer' : 'stripe';
  }
}
