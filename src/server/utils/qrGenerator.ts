import QRCode from 'qrcode';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export class QRGenerator {
  static async generateTableQR(tableId: string, restaurantId: string): Promise<string> {
    try {
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const tableUrl = `${baseUrl}?table=${tableId}`;

      // Ensure directory exists
      const outputDir = join(process.cwd(), 'public', 'qr-codes', restaurantId);
      await mkdir(outputDir, { recursive: true });

      const outputPath = join(outputDir, `table-${tableId}.png`);

      // Generate QR code with custom styling
      await QRCode.toFile(outputPath, tableUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#1A237E', // Midnight Navy
          light: '#FAF9F6', // Warm Linen
        },
        errorCorrectionLevel: 'H',
      });

      return `/qr-codes/${restaurantId}/table-${tableId}.png`;
    } catch (error) {
      console.error('QR generation error:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  static getTableUrl(tableId: string): string {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}?table=${tableId}`;
  }

  // Generate QR code as data URL (for immediate display)
  static async generateTableQRDataURL(tableId: string): Promise<string> {
    try {
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const tableUrl = `${baseUrl}?table=${tableId}`;

      const dataUrl = await QRCode.toDataURL(tableUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#1A237E',
          light: '#FAF9F6',
        },
        errorCorrectionLevel: 'H',
      });

      return dataUrl;
    } catch (error) {
      console.error('QR generation error:', error);
      throw new Error('Failed to generate QR code');
    }
  }
}
