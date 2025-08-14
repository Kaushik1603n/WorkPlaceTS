import { IMessageRepo } from "../../domain/interfaces/IMessageRepo";
import { MessageRepo } from "../../infrastructure/repositories/implementations/messageRepo";
import { IMessageUseCase } from "../../useCase/Interface/IMessageUseCase";
import { MessageUseCase } from "../../useCase/messageUseCase";
import { MessageController } from "../controllers/messageController";

export const createMessageDependencies = () => {
    const messgeRepo: IMessageRepo = new MessageRepo();
      const messageUseCase: IMessageUseCase =
        new MessageUseCase(messgeRepo);
      const messageCondroller = new MessageController(messageUseCase);
      return messageCondroller;
}