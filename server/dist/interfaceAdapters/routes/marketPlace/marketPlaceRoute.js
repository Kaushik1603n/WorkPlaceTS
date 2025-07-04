"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const marketProjectController_1 = require("../../controllers/marketPlaceController/marketProjectController");
const authMiddleware_1 = __importDefault(require("../../../middleware/authMiddleware"));
const project = new marketProjectController_1.MarketPlaceProjectController();
const marketPlaceRoute = express_1.default.Router();
marketPlaceRoute.get("/get-jobs", project.getAllMarketProjects);
marketPlaceRoute.get("/active-jobs", authMiddleware_1.default, project.activeClientProject);
marketPlaceRoute.get("/pending-jobs", authMiddleware_1.default, project.pendingClientProject);
marketPlaceRoute.get("/completed-jobs", authMiddleware_1.default, project.completedClientProject);
marketPlaceRoute.get("/job-details/:jobId", project.getProjectDetails);
marketPlaceRoute.post("/apply-job-proposal", authMiddleware_1.default, project.jobProposal);
marketPlaceRoute.get("/get-proposal-details/:proposalId", authMiddleware_1.default, project.getProposalDetails);
marketPlaceRoute.get("/get-all-freelancer-jobs", authMiddleware_1.default, project.getAllFreelacerJobs);
marketPlaceRoute.get("/project-details/:jobId", authMiddleware_1.default, project.getProjectAllInformation);
marketPlaceRoute.post("/submit-milestone/:jobId", authMiddleware_1.default, project.submitMilestone);
marketPlaceRoute.post("/feedback", authMiddleware_1.default, project.submitFeedback);
marketPlaceRoute.post("/freelancer/report", authMiddleware_1.default, project.freelacerReport);
exports.default = marketPlaceRoute;
//# sourceMappingURL=marketPlaceRoute.js.map