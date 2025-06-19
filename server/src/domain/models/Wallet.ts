import mongoose, { Document, Schema, Types } from "mongoose";

// Interface for a wallet transaction
interface IWalletTransaction {
  type: "credit" | "debit"; // Credit (add funds) or debit (withdraw/spend)
  amount: number; // Amount in smallest currency unit (e.g., paise for INR)
  description: string; // e.g., "Payment for milestone XYZ", "Withdrawal to bank"
  paymentId?: Types.ObjectId; // Link to Payment document (if applicable)
  createdAt: Date;
}

// Interface for the Wallet document
export interface IWallet extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId | "admin"; // User ID or "admin" for platform wallet
  balance: number; // Current balance in smallest currency unit (e.g., paise for INR)
  currency: string; // e.g., "INR"
  transactions: IWalletTransaction[]; // Transaction history
  createdAt: Date;
  updatedAt: Date;
}

const WalletTransactionSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ["credit", "debit"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: "Payment",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const WalletSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.Mixed,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
      required: true,
    },
    transactions: [WalletTransactionSchema],
  },
  { timestamps: true }
);

// Create and export the model
const WalletModel = mongoose.model<IWallet>("Wallet", WalletSchema);
export default WalletModel;
