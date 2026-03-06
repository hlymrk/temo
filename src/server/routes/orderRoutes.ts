import { Router } from "express";
import {
  createOrder,
  getOrder,
  getAllActiveOrders,
} from "../controllers/orderController.js";
import { seedTestOrder } from "../utils/seedTestOrder.js";
import { Server as SocketServer } from "socket.io";

const router = Router();

router.post("/orders", createOrder);
router.get("/orders/table/:tableId", getOrder);
router.get("/orders/active", getAllActiveOrders);

// Development helper endpoint
router.post("/orders/seed", async (req, res) => {
  try {
    const tableId = (req.body.tableId as string | undefined) || "T42";
    const order = await seedTestOrder(tableId);
    // Emit to waiters room for real-time updates
    const io = (global as any).io;
    if (io) {
      io.to("waiters").emit("order-created", order);
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: "Failed to seed order" });
  }
});

export default router;
