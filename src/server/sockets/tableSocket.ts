import { Server, Socket } from "socket.io";
import { OrderService } from "../services/OrderService.js";
import { authenticateSocket } from "../middleware/authMiddleware.js";

export const setupTableSockets = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    let user;
    try {
      user = authenticateSocket(socket.handshake);
    } catch (error) {
      console.log(`Authentication failed: ${error.message}`);
      socket.emit("error", { message: "Authentication failed" });
      socket.disconnect();
      return;
    }
    console.log(`✓ Client connected: ${socket.id} (${user?.role})`);
    // Join waiters room if staff/admin
    if (user?.role === "STAFF" || user?.role === "ADMIN") {
      socket.join("waiters");
      console.log(`Staff/Admin ${socket.id} joined waiters room`);
    }
    // Join a table room
    socket.on("join-table", async (tableId: string) => {
      socket.join(`table:${tableId}`);
      console.log(`Client ${socket.id} joined table:${tableId}`);

      // Send current order state
      const order = await OrderService.getOrderByTableId(tableId);

      socket.emit("order-state", order);
    });

    // Claim an item
    socket.on("claim-item", async ({ orderId, itemId }) => {
      const order = await OrderService.claimItem(
        orderId,
        itemId,
        user?.id as string,
      );
      if (order) {
        io.to(`table:${order.tableId}`).emit("order-updated", order);
        io.to("waiters").emit("order-updated", order);
      }
    });

    // Unclaim an item
    socket.on("unclaim-item", async ({ orderId, itemId }) => {
      const order = await OrderService.unclaimItem(orderId, itemId);
      if (order) {
        io.to(`table:${order.tableId}`).emit("order-updated", order);
        io.to("waiters").emit("order-updated", order);
      }
    });

    // Staff: Update item status
    socket.on("update-item-status", async ({ orderId, itemId, status }) => {
      if (user?.role !== "STAFF" && user?.role !== "ADMIN") {
        socket.emit("error", { message: "Unauthorized" });
        return;
      }

      const order = await OrderService.updateItemStatus(
        orderId,
        itemId,
        status,
      );
      if (order) {
        io.to(`table:${order.tableId}`).emit("order-updated", order);
        io.to("waiters").emit("order-updated", order);
      }
    });

    // Staff: Add items to order
    socket.on("add-items", async ({ orderId, items }) => {
      if (user?.role !== "STAFF" && user?.role !== "ADMIN") {
        console.log(user);
        socket.emit("error", { message: "Unauthorized" });
        return;
      }

      const order = await OrderService.addItems(orderId, items);
      if (order) {
        io.to(`table:${order.tableId}`).emit("order-updated", order);
        io.to("waiters").emit("order-updated", order);
      }
    });

    socket.on("disconnect", () => {
      console.log(`✗ Client disconnected: ${socket.id}`);
    });
  });
};
