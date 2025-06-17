import express from "express";
import authenticate from "../../../middleware/authMiddleware";
import { PaymentController } from "../../controllers/marketPlaceController/paymentController";

const paymentRoutes= express.Router();
const payment =new PaymentController()


paymentRoutes.post("/order",authenticate,payment.milestonePayment);
paymentRoutes.post("/verify",authenticate,payment.verifyPayment);


export default paymentRoutes

