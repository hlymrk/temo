import { Router } from 'express';
import { createOrder, getOrder } from '../controllers/orderController.js';
import { seedTestOrder } from '../utils/seedTestOrder.js';

const router = Router();

router.post('/orders', createOrder);
router.get('/orders/table/:tableId', getOrder);

// Development helper endpoint
router.post('/orders/seed', async (req, res) => {
  try {
    const tableId = (req.body.tableId as string | undefined) || 'T42';
    const order = await seedTestOrder(tableId);
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed order' });
  }
});

export default router;
