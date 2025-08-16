import express from "express";
import authenticate from "../../../middleware/authMiddleware";
import { createPaymentDependencies } from "../../dependencies/paymentDependencies";

const paymentRoutes= express.Router();
const payment =createPaymentDependencies()


paymentRoutes.post("/order",authenticate,payment.milestonePayment);
paymentRoutes.post("/verify",authenticate,payment.verifyPayment);

paymentRoutes.get("/get-payment",authenticate,payment.getPayments);

export default paymentRoutes

