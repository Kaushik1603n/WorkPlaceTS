import { INotificationRepo } from "../../domain/interfaces/INotificationRepo";
import { NotificationRepo } from "../../infrastructure/repositories/implementations/notificationRepo";
import { INotificationUseCase } from "../../useCase/Interface/INotificationUseCase";
import { NotificationUseCase } from "../../useCase/notificationUseCase";
import { NotificationController } from "../controllers/notificationController";

export const createNotificationDependencies = () => {
  const notificationRepo: INotificationRepo = new NotificationRepo();
  const notificationUseCase: INotificationUseCase =
    new NotificationUseCase(notificationRepo);
  const notificationCondroller = new NotificationController(notificationUseCase);
  return notificationCondroller;
};
