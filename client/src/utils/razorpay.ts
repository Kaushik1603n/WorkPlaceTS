// src/utils/razorpay.ts

import { toast } from "react-toastify";
import axiosClient from "./axiosClient";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface razorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const verifyPayment = async (response: razorpayResponse) => {
  await axiosClient.post("/payments/verify", {
    razorpay_order_id: response.razorpay_order_id,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature,
  });
};

export const loadRazorpay = async (
  orderId: string,
  amount: number,
  key: string,
  onSuccess: () => void
) => {
  if (!window.Razorpay) {
    toast.error("Razorpay SDK not loaded. Please try again.");
    return;
  }
  const options = {
    key,
    amount: amount,
    currency: "INR",
    name: "WorkFlow",
    description: "Test Transaction",
    order_id: orderId,
    handler: function (response: razorpayResponse) {
      verifyPayment(response).then(() => onSuccess());
    },
    prefill: {
      name: "Kaushik",
      email: "kaushin1603@gmail.com",
      contact: "8943548236",
    },
    notes: {
      address: "Kaushik's Home",
    },
    theme: {
      color: "#3399cc",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.on("payment.failed", () => {
    toast.error("Payment failed. Please try again.");
  });
  paymentObject.open();
};
