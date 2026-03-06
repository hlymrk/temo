import { Server, Socket } from 'socket.io';
import { TableSessionService } from '../services/TableSessionService.js';
import { authenticateSocket } from '../middleware/authMiddleware.js';

export const setupTableSockets = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    const user = authenticateSocket(socket.handshake);
    console.log(`✓ Client connected: ${socket.id} (${user?.role})`);

    // Join a table room
    socket.on('join-table', async (tableId: string) => {
      socket.join(`table:${tableId}`);
      console.log(`Client ${socket.id} joined table:${tableId}`);

      // Send current session state
      const session = await TableSessionService.getActiveSession(tableId);
      
      if (session && user?.role === 'CUSTOMER') {
        // Update active users
        await TableSessionService.updateActiveUser(
          session._id.toString(),
          user.id,
          socket.handshake.auth?.userName
        );
      }

      socket.emit('session-state', session);
    });

    // Claim an item
    socket.on('claim-item', async ({ sessionId, itemId }) => {
      const session = await TableSessionService.claimItem(sessionId, itemId, user?.id);
      if (session) {
        io.to(`table:${session.tableId}`).emit('session-updated', session);
      }
    });

    // Unclaim an item
    socket.on('unclaim-item', async ({ sessionId, itemId }) => {
      const session = await TableSessionService.unclaimItem(sessionId, itemId);
      if (session) {
        io.to(`table:${session.tableId}`).emit('session-updated', session);
      }
    });

    // Staff: Update item status
    socket.on('update-item-status', async ({ sessionId, itemId, status }) => {
      if (user?.role !== 'STAFF' && user?.role !== 'ADMIN') {
        socket.emit('error', { message: 'Unauthorized' });
        return;
      }

      const session = await TableSessionService.updateItemStatus(sessionId, itemId, status);
      if (session) {
        io.to(`table:${session.tableId}`).emit('session-updated', session);
      }
    });

    // Staff: Add items to session
    socket.on('add-items', async ({ sessionId, items }) => {
      if (user?.role !== 'STAFF' && user?.role !== 'ADMIN') {
        socket.emit('error', { message: 'Unauthorized' });
        return;
      }

      const session = await TableSessionService.addItems(sessionId, items);
      if (session) {
        io.to(`table:${session.tableId}`).emit('session-updated', session);
      }
    });

    socket.on('disconnect', () => {
      console.log(`✗ Client disconnected: ${socket.id}`);
    });
  });
};
