import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { TableSessionService } from '../services/TableSessionService.js';

export const getLedger = async (req: AuthRequest, res: Response) => {
  try {
    const { tableId } = req.params;

    if (!tableId) {
      return res.status(400).json({ error: 'Table ID required' });
    }

    const session = await TableSessionService.getActiveSession(tableId);

    if (!session) {
      return res.status(404).json({ error: 'No active session for this table' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching ledger:', error);
    res.status(500).json({ error: 'Failed to fetch ledger' });
  }
};

export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    const { tableId, items } = req.body;

    if (!tableId || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const restaurantId = req.user?.restaurantId || 'restaurant-1';
    const session = await TableSessionService.createSession(tableId, restaurantId, items);

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
};

export const addItemsToSession = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items array required' });
    }

    const session = await TableSessionService.addItems(sessionId, items);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error adding items:', error);
    res.status(500).json({ error: 'Failed to add items' });
  }
};

export const updateItemStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, itemId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }

    const session = await TableSessionService.updateItemStatus(sessionId, itemId, status);

    if (!session) {
      return res.status(404).json({ error: 'Session or item not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error updating item status:', error);
    res.status(500).json({ error: 'Failed to update item status' });
  }
};

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const restaurantId = req.user?.restaurantId || 'restaurant-1';
    const analytics = await TableSessionService.getAnalytics(restaurantId);

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
