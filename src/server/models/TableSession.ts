import mongoose, { Schema, Document } from 'mongoose';

export type ItemStatus = 'ordered' | 'cooking' | 'served' | 'paid';

export interface ISessionItem {
  id: string;
  name: string;
  priceInPence: number;
  quantity: number;
  status: ItemStatus;
  claimedBy?: string;
  orderedAt: Date;
  servedAt?: Date;
  paidAt?: Date;
}

export interface IActiveUser {
  userId: string;
  userName?: string;
  joinedAt: Date;
  lastSeen: Date;
}

export interface ITableSession extends Document {
  tableId: string;
  restaurantId: string;
  items: ISessionItem[];
  activeUsers: IActiveUser[];
  totalInPence: number;
  paidInPence: number;
  status: 'active' | 'paying' | 'completed';
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionItemSchema = new Schema<ISessionItem>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  priceInPence: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  status: {
    type: String,
    enum: ['ordered', 'cooking', 'served', 'paid'],
    default: 'ordered',
  },
  claimedBy: { type: String, default: null },
  orderedAt: { type: Date, default: Date.now },
  servedAt: { type: Date },
  paidAt: { type: Date },
});

const ActiveUserSchema = new Schema<IActiveUser>({
  userId: { type: String, required: true },
  userName: { type: String },
  joinedAt: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
});

const TableSessionSchema = new Schema<ITableSession>(
  {
    tableId: { type: String, required: true, index: true },
    restaurantId: { type: String, required: true, index: true },
    items: [SessionItemSchema],
    activeUsers: [ActiveUserSchema],
    totalInPence: { type: Number, required: true, default: 0 },
    paidInPence: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'paying', 'completed'],
      default: 'active',
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

// Index for finding active sessions
TableSessionSchema.index({ tableId: 1, status: 1 });

export const TableSession = mongoose.model<ITableSession>('TableSession', TableSessionSchema);
