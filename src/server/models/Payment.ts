import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  orderId: string;
  userId: string;
  tableId: string;
  amountInPence: number;
  provider: 'stripe' | 'truelayer';
  providerPaymentId: string;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
  itemIds: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    tableId: { type: String, required: true, index: true },
    amountInPence: { type: Number, required: true },
    provider: { type: String, enum: ['stripe', 'truelayer'], required: true },
    providerPaymentId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'cancelled'],
      default: 'pending',
    },
    itemIds: [{ type: String }],
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
