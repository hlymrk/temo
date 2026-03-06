import { Request, Response } from 'express';
import { QRGenerator } from '../utils/qrGenerator.js';

export const generateQRCode = async (req: Request, res: Response) => {
  try {
    const { tableId, restaurantId } = req.body;

    if (!tableId || !restaurantId) {
      return res.status(400).json({ error: 'tableId and restaurantId required' });
    }

    // Generate both file and data URL
    const [qrPath, dataUrl] = await Promise.all([
      QRGenerator.generateTableQR(tableId, restaurantId),
      QRGenerator.generateTableQRDataURL(tableId),
    ]);

    const tableUrl = QRGenerator.getTableUrl(tableId);

    res.json({
      success: true,
      qrCodeUrl: qrPath,
      qrCodeDataUrl: dataUrl,
      tableUrl,
      tableId,
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};

export const getTableUrl = async (req: Request, res: Response) => {
  try {
    const tableId = req.params.tableId;

    if (!tableId || typeof tableId !== 'string') {
      return res.status(400).json({ error: 'tableId required' });
    }

    const tableUrl = QRGenerator.getTableUrl(tableId);
    res.json({ tableUrl, tableId });
  } catch (error) {
    console.error('Error getting table URL:', error);
    res.status(500).json({ error: 'Failed to get table URL' });
  }
};
