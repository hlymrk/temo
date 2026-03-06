import { Router } from 'express';
import {
  getLedger,
  createSession,
  addItemsToSession,
  updateItemStatus,
  getAnalytics,
} from '../controllers/tableSessionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Public endpoint - customers can view ledger
router.get('/table/:tableId/ledger', getLedger);

// Staff endpoints - require STAFF role
router.post('/sessions', authMiddleware(['STAFF', 'ADMIN']), createSession);
router.post('/sessions/:sessionId/items', authMiddleware(['STAFF']), addItemsToSession);
router.patch(
  '/sessions/:sessionId/items/:itemId/status',
  authMiddleware(['STAFF']),
  updateItemStatus
);

// Admin endpoints
router.get('/analytics', authMiddleware(['ADMIN']), getAnalytics);

export default router;
