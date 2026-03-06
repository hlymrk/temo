import { Router } from 'express';
import { generateQRCode, getTableUrl } from '../controllers/qrController.js';

const router = Router();

router.post('/qr/generate', generateQRCode);
router.get('/qr/table/:tableId', getTableUrl);

export default router;
