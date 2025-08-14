import { IMarketPlace } from "../../domain/interfaces/IMarketPlaceRepo";
import { MarketPlaceRepo } from "../../infrastructure/repositories/implementations/marketPlace/marketPlaceRepo";
import { MarketPlaceUseCase } from "../../useCase/MarketPlaceUseCase";
import { MarketPlaceProjectController } from "../controllers/marketPlaceController/marketProjectController";

export const createMrketPlaceDependencies = () => {
  const marketPlaceRepo: IMarketPlace = new MarketPlaceRepo();
  const marketPlaceUseCase = new MarketPlaceUseCase(marketPlaceRepo);
  const marketPlaceController = new MarketPlaceProjectController(
    marketPlaceUseCase
  );
  return marketPlaceController;
};
