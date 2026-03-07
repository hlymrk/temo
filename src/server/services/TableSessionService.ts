import {
  TableSession,
  ITableSession,
  ISessionItem,
  ItemStatus,
} from "../models/TableSession.js";
import { Payment } from "../models/Payment.js";
import * as dineroLib from "dinero.js";
import * as currenciesLib from "dinero.js/currencies";

const dinero = (dineroLib as any).dinero || (dineroLib as any).default?.dinero;
const add = (dineroLib as any).add || (dineroLib as any).default?.add;
const multiply =
  (dineroLib as any).multiply || (dineroLib as any).default?.multiply;
const toSnapshot =
  (dineroLib as any).toSnapshot || (dineroLib as any).default?.toSnapshot;
const GBP = (currenciesLib as any).GBP || (currenciesLib as any).default?.GBP;

export class TableSessionService {
  // Get active session for a table
  static async getActiveSession(
    tableId: string,
  ): Promise<ITableSession | null> {
    return TableSession.findOne({
      tableId,
      status: { $in: ["active", "paying"] },
    }).sort({ startedAt: -1 });
  }

  // Create new table session
  static async createSession(
    tableId: string,
    restaurantId: string,
    items: Omit<ISessionItem, "orderedAt" | "status">[],
  ): Promise<ITableSession> {
    const sessionItems: ISessionItem[] = items.map((item) => ({
      ...item,
      status: "ordered" as ItemStatus,
      orderedAt: new Date(),
    }));

    const totalInPence = this.calculateTotal(sessionItems);

    const session = new TableSession({
      tableId,
      restaurantId,
      items: sessionItems,
      totalInPence,
      paidInPence: 0,
      status: "active",
      activeUsers: [],
    });

    return session.save();
  }

  // Add items to existing session
  static async addItems(
    sessionId: string,
    items: Omit<ISessionItem, "orderedAt" | "status">[],
  ): Promise<ITableSession | null> {
    const session = await TableSession.findById(sessionId);
    if (!session) return null;

    const newItems: ISessionItem[] = items.map((item) => ({
      ...item,
      status: "ordered" as ItemStatus,
      orderedAt: new Date(),
    }));

    session.items.push(...newItems);
    session.totalInPence = this.calculateTotal(session.items);

    return session.save();
  }

  // Update item status (ordered -> cooking -> served -> paid)
  static async updateItemStatus(
    sessionId: string,
    itemId: string,
    status: ItemStatus,
  ): Promise<ITableSession | null> {
    const session = await TableSession.findById(sessionId);
    if (!session) return null;

    const item = session.items.find((i) => i.id === itemId);
    if (!item) return null;

    item.status = status;
    if (status === "served") item.servedAt = new Date();
    if (status === "paid") item.paidAt = new Date();

    // Update paid total
    session.paidInPence = session.items
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.priceInPence * i.quantity, 0);

    // Update session status
    if (session.paidInPence >= session.totalInPence) {
      session.status = "completed";
      session.completedAt = new Date();
    } else if (session.paidInPence > 0) {
      session.status = "paying";
    }

    return session.save();
  }

  // Claim item
  static async claimItem(
    sessionId: string,
    itemId: string,
    userId: string,
  ): Promise<ITableSession | null> {
    const session = await TableSession.findById(sessionId);
    if (!session) return null;

    const item = session.items.find((i) => i.id === itemId);
    if (!item || item.claimedBy) return null;

    item.claimedBy = userId;
    return session.save();
  }

  // Unclaim item
  static async unclaimItem(
    sessionId: string,
    itemId: string,
  ): Promise<ITableSession | null> {
    const session = await TableSession.findById(sessionId);
    if (!session) return null;

    const item = session.items.find((i) => i.id === itemId);
    if (!item) return null;

    item.claimedBy = undefined;
    return session.save();
  }

  // Add/update active user
  static async updateActiveUser(
    sessionId: string,
    userId: string,
    userName?: string,
  ): Promise<ITableSession | null> {
    const session = await TableSession.findById(sessionId);
    if (!session) return null;

    const existingUser = session.activeUsers.find((u) => u.userId === userId);
    if (existingUser) {
      existingUser.lastSeen = new Date();
      if (userName) existingUser.userName = userName;
    } else {
      session.activeUsers.push({
        userId,
        userName,
        joinedAt: new Date(),
        lastSeen: new Date(),
      });
    }

    return session.save();
  }

  // Calculate total using dinero.js
  private static calculateTotal(items: ISessionItem[]): number {
    let total = dinero({ amount: 0, currency: GBP });

    for (const item of items) {
      const itemPrice = dinero({ amount: item.priceInPence, currency: GBP });
      const itemTotal = multiply(itemPrice, item.quantity);
      total = add(total, itemTotal);
    }

    const snapshot = toSnapshot(total);
    return snapshot.amount;
  }

  // Get analytics for admin dashboard
  static async getAnalytics(restaurantId: string) {
    const today = new Date(new Date().setHours(0, 0, 0, 0));

    const activeSessions = await TableSession.find({
      restaurantId,
      status: { $in: ["active", "paying"] },
    });

    const completedToday = await TableSession.find({
      restaurantId,
      status: "completed",
      completedAt: { $gte: today },
    });

    // Get all payments from today (regardless of status)
    const allPaymentsToday = await Payment.find({
      createdAt: { $gte: today },
    });

    // Get breakdowns by status
    const succeededPayments = allPaymentsToday.filter(
      (p) => p.status === "succeeded",
    );
    const failedPayments = allPaymentsToday.filter(
      (p) => p.status === "failed",
    );
    const pendingPayments = allPaymentsToday.filter(
      (p) => p.status === "pending",
    );
    const expiredPayments = allPaymentsToday.filter(
      (p) => p.status === "expired",
    );

    // Get breakdowns by provider
    const stripePayments = allPaymentsToday.filter(
      (p) => p.provider === "stripe",
    );
    const truelayerPayments = allPaymentsToday.filter(
      (p) => p.provider === "truelayer",
    );

    const totalRevenueFromPayments = succeededPayments.reduce(
      (sum, p) => sum + p.amountInPence,
      0,
    );

    const totalFailedAmount = failedPayments.reduce(
      (sum, p) => sum + p.amountInPence,
      0,
    );

    const totalPendingAmount = pendingPayments.reduce(
      (sum, p) => sum + p.amountInPence,
      0,
    );

    const averageSessionTime = this.calculateAverageSessionTime(completedToday);

    return {
      // Session metrics
      activeTables: activeSessions.length,
      completedToday: completedToday.length,
      averageSessionTimeMinutes: averageSessionTime,

      // Revenue metrics
      totalRevenueToday: totalRevenueFromPayments,
      totalFailedAmount,
      totalPendingAmount,

      // Payment counts
      totalPayments: allPaymentsToday.length,
      paymentsByStatus: {
        succeeded: succeededPayments.length,
        failed: failedPayments.length,
        pending: pendingPayments.length,
        expired: expiredPayments.length,
      },

      // Payment breakdown by provider
      paymentsByProvider: {
        stripe: stripePayments.length,
        truelayer: truelayerPayments.length,
      },

      // Success rate
      successRate:
        allPaymentsToday.length > 0
          ? Math.round(
              (succeededPayments.length / allPaymentsToday.length) * 100,
            )
          : 0,
    };
  }

  private static calculateAverageSessionTime(
    sessions: ITableSession[],
  ): number {
    if (sessions.length === 0) return 0;

    const totalMinutes = sessions.reduce((sum, session) => {
      if (!session.completedAt) return sum;
      const duration =
        session.completedAt.getTime() - session.startedAt.getTime();
      return sum + duration / 1000 / 60; // Convert to minutes
    }, 0);

    return Math.round(totalMinutes / sessions.length);
  }
}
