import { IpamentRepo } from "../../domain/interfaces/IpamentRepo";
import { PaymentRepo } from "../../infrastructure/repositories/implementations/marketPlace/paymentRepo";
import { IPaymentUseCase } from "../../useCase/Interface/IPaymentUseCase";
import { PaymentUseCase } from "../../useCase/paymentUseCase";
import { PaymentController } from "../controllers/marketPlaceController/paymentController";

export const createPaymentDependencies = () => {
  const paymentRepo: IpamentRepo = new PaymentRepo();
  const paymentUseCase: IPaymentUseCase =
    new PaymentUseCase(paymentRepo);
  const paymentCondroller = new PaymentController(paymentUseCase);
  return paymentCondroller;
};
