"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../../../middleware/authMiddleware"));
const proposalController_1 = require("../../controllers/marketPlaceController/proposalController");
const proposal = new proposalController_1.ProposalController();
const proposalRout = express_1.default.Router();
proposalRout.put("/hire-request/:proposalId", authMiddleware_1.default, proposal.hireRequest);
proposalRout.get("/get-freelacer-proposal", authMiddleware_1.default, proposal.getAllFreelancerProposals);
proposalRout.get("/all-proposal/:id", authMiddleware_1.default, proposal.getAllPropjectProposals);
proposalRout.get("/get-contract-details/:id", authMiddleware_1.default, proposal.getContractDetails);
proposalRout.get("/accept-contract/:id", authMiddleware_1.default, proposal.acceptProposalcontract);
proposalRout.get("/reject-contract/:id", authMiddleware_1.default, proposal.rejectProposalcontract);
proposalRout.get("/:jobId/milestones", authMiddleware_1.default, proposal.proposalMilestones);
proposalRout.patch("/milestones/:milestoneId/approve", authMiddleware_1.default, proposal.proposalMilestonesApprove);
proposalRout.patch("/milestones/:milestoneId/rejected", authMiddleware_1.default, proposal.proposalMilestonesReject);
proposalRout.get("/pending-paments", authMiddleware_1.default, proposal.pendingPaments);
exports.default = proposalRout;
//# sourceMappingURL=proposalRoute.js.map