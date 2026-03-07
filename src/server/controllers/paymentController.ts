import { Request, Response } from "express";
import { PaymentService } from "../services/PaymentService.js";
import { OrderService } from "../services/OrderService.js";

export const createStripePaymentIntent = async (
  req: Request,
  res: Response,
) => {
  try {
    const { orderId, userId, itemIds } = req.body;

    if (!orderId || !userId || !itemIds || !Array.isArray(itemIds)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get order and calculate user's total
    const order = await OrderService.getOrderByTableId(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const userItems = order.items.filter(
      (item) => itemIds.includes(item.id) && item.claimedBy === userId,
    );

    const totalInPence = userItems.reduce(
      (sum, item) => sum + item.priceInPence * item.quantity,
      0,
    );

    if (totalInPence === 0) {
      return res.status(400).json({ error: "No items to pay for" });
    }

    const payment = await PaymentService.createStripePayment(
      totalInPence,
      {
        orderId: order._id.toString(),
        userId,
        tableId: order.tableId,
      },
      itemIds,
    );

    res.json({
      ...payment,
      amount: totalInPence,
      recommended: PaymentService.getRecommendedPaymentMethod(totalInPence),
    });
  } catch (error) {
    console.error("Error creating Stripe payment:", error);
    res.status(500).json({ error: "Failed to create payment" });
  }
};

export const createTrueLayerPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, userId, itemIds } = req.body;

    if (!orderId || !userId || !itemIds || !Array.isArray(itemIds)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const order = await OrderService.getOrderByTableId(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const userItems = order.items.filter(
      (item) => itemIds.includes(item.id) && item.claimedBy === userId,
    );

    const totalInPence = userItems.reduce(
      (sum, item) => sum + item.priceInPence * item.quantity,
      0,
    );

    if (totalInPence === 0) {
      return res.status(400).json({ error: "No items to pay for" });
    }

    const payment = await PaymentService.createTrueLayerPayment(
      totalInPence,
      userId,
      order._id.toString(),
    );

    res.json(payment);
  } catch (error) {
    console.error("Error creating TrueLayer payment:", error);
    res.status(500).json({ error: "Failed to create payment" });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.paymentIntentId; // Note: keeping param name for backward compatibility

    if (!sessionId || typeof sessionId !== "string") {
      return res.status(400).json({ error: "Session ID required" });
    }

    const verification = await PaymentService.verifyStripePayment(sessionId);
    res.json(verification);
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};
