import Razorpay from "razorpay";
import { Request } from "express";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

interface OrderOptions {
  amount: number;
  currency: string;
  receipt: string;
  payment_capture: number;
}

export const createOrder = async (options: OrderOptions) => {
  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new Error(`Error creating Razorpay order: ${error}`);
  }
};

export const verifyPayment = (req: Request) => {
  const crypto = require("crypto");
  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  return digest === req.headers["x-razorpay-signature"];
};
