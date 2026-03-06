import { OrderService } from '../services/OrderService.js';

export const seedTestOrder = async (tableId: string = 'T42') => {
  const testItems = [
    { id: '1', name: 'Margherita Pizza', priceInPence: 1200, quantity: 1 },
    { id: '2', name: 'Caesar Salad', priceInPence: 850, quantity: 2 },
    { id: '3', name: 'Craft Beer', priceInPence: 550, quantity: 3 },
    { id: '4', name: 'Tiramisu', priceInPence: 650, quantity: 1 },
  ];

  try {
    const order = await OrderService.createOrder(tableId, 'restaurant-1', testItems);
    console.log(`✓ Test order created for table ${tableId}:`, order._id);
    return order;
  } catch (error) {
    console.error('Error seeding test order:', error);
  }
};
