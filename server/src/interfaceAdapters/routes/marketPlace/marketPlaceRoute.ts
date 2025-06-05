import express from "express";
import { MarketPlaceProjectController } from "../../controllers/marketPlaceController/marketProjectController";
// import authenticate from "../../../middleware/authMiddleware";

const project =new MarketPlaceProjectController()
const marketPlaceRoute = express.Router();

marketPlaceRoute.get("/get-jobs", project.getAllMarketProjects);
marketPlaceRoute.get("/job-details/:jobId", project.getProjectDetails);


export default marketPlaceRoute;
