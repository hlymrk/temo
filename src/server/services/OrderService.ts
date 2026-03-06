import { Order, IOrder, IOrderItem } from '../models/Order.js';
import * as dineroLib from 'dinero.js';
import * as currenciesLib from 'dinero.js/currencies';

// Extract functions from namespace
const dinero = (dineroLib as any).dinero || (dineroLib as any).default?.dinero;
const add = (dineroLib as any).add || (dineroLib as any).default?.add;
const multiply = (dineroLib as any).multiply || (dineroLib as any).default?.multiply;
const toSnapshot = (dineroLib as any).toSnapshot || (dineroLib as any).default?.toSnapshot;
const GBP = (currenciesLib as any).GBP || (currenciesLib as any).default?.GBP;

export class OrderService {
  static async getOrderByTableId(tableId: string): Promise<IOrder | null> {
    return Order.findOne({ tableId, status: { $ne: 'completed' } });
  }

  static async createOrder(
    tableId: string,
    restaurantId: string,
    items: IOrderItem[]
  ): Promise<IOrder> {
    const { totalInPence, vatInPence } = this.calculateTotals(items);
    
    const order = new Order({
      tableId,
      restaurantId,
      items,
      totalInPence,
      vatInPence,
      status: 'active'
    });

    return order.save();
  }

  static async claimItem(
    orderId: string,
    itemId: string,
    userId: string
  ): Promise<IOrder | null> {
    const order = await Order.findById(orderId);
    if (!order) return null;

    const item = order.items.find((i: IOrderItem) => i.id === itemId);
    if (!item || item.claimedBy) return null;

    item.claimedBy = userId;
    return order.save();
  }

  static async unclaimItem(
    orderId: string,
    itemId: string
  ): Promise<IOrder | null> {
    const order = await Order.findById(orderId);
    if (!order) return null;

    const item = order.items.find((i: IOrderItem) => i.id === itemId);
    if (!item) return null;

    item.claimedBy = undefined;
    return order.save();
  }

  private static calculateTotals(items: IOrderItem[]) {
    let total = dinero({ amount: 0, currency: GBP });
    
    for (const item of items) {
      const itemPrice = dinero({ amount: item.priceInPence, currency: GBP });
      const itemTotal = multiply(itemPrice, item.quantity);
      total = add(total, itemTotal);
    }

    const totalSnapshot = toSnapshot(total);
    const totalInPence = totalSnapshot.amount;
    
    // UK VAT is 20%
    const vatInPence = Math.round(totalInPence * 0.2);

    return { totalInPence, vatInPence };
  }
}
