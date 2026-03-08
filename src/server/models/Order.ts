import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  id: string;
  name: string;
  priceInPence: number;
  quantity: number;
  claimedBy?: string; // User ID or session ID
  status: "ordered" | "preparing" | "ready" | "served";
}

export interface IOrder extends Document {
  tableId: string;
  restaurantId: string;
  items: IOrderItem[];
  totalInPence: number;
  vatInPence: number;
  status: "active" | "partial" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  priceInPence: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  claimedBy: { type: String, default: null },
  status: {
    type: String,
    enum: ["ordered", "preparing", "ready", "served"],
    default: "ordered",
  },
});

const OrderSchema = new Schema<IOrder>(
  {
    tableId: { type: String, required: true, index: true },
    restaurantId: { type: String, required: true, index: true },
    items: [OrderItemSchema],
    totalInPence: { type: Number, required: true },
    vatInPence: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "partial", "completed"],
      default: "active",
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
