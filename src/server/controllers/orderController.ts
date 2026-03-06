import { Request, Response } from "express";
import { OrderService } from "../services/OrderService.js";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { tableId, restaurantId, items } = req.body;

    if (!tableId || !restaurantId || !items) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const order = await OrderService.createOrder(tableId, restaurantId, items);
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};
export const getOrder = async (req: Request, res: Response) => {
  try {
    const { tableId } = req.params;

    if (typeof tableId !== "string") {
      return res.status(400).json({ error: "Invalid table ID" });
    }

    const order = await OrderService.getOrderByTableId(tableId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};
export const getAllActiveOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.getAllActiveOrders();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching active orders:", error);
    res.status(500).json({ error: "Failed to fetch active orders" });
  }
};
