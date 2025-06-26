import express from "express";
import { MarketPlaceProjectController } from "../../controllers/marketPlaceController/marketProjectController";
import authenticate from "../../../middleware/authMiddleware";

const project =new MarketPlaceProjectController()
const marketPlaceRoute = express.Router();

marketPlaceRoute.get("/get-jobs", project.getAllMarketProjects);
marketPlaceRoute.get("/active-jobs",authenticate, project.activeClientProject);
marketPlaceRoute.get("/pending-jobs",authenticate, project.pendingClientProject);
marketPlaceRoute.get("/completed-jobs",authenticate, project.completedClientProject);
marketPlaceRoute.get("/job-details/:jobId", project.getProjectDetails);
marketPlaceRoute.post("/apply-job-proposal",authenticate, project.jobProposal);
marketPlaceRoute.get("/get-proposal-details/:proposalId",authenticate, project.getProposalDetails);

marketPlaceRoute.get("/get-all-freelancer-jobs",authenticate, project.getAllFreelacerJobs);
marketPlaceRoute.get("/project-details/:jobId",authenticate, project.getProjectAllInformation);

marketPlaceRoute.post("/submit-milestone/:jobId",authenticate, project.submitMilestone);

marketPlaceRoute.post("/feedback",authenticate, project.submitFeedback);
marketPlaceRoute.post("/freelancer/report",authenticate, project.freelacerReport);

export default marketPlaceRoute;
