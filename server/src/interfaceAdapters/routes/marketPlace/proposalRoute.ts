import express from "express";
import authenticate from "../../../middleware/authMiddleware";
import { ProposalController } from "../../controllers/marketPlaceController/proposalController";

const proposal =new ProposalController()
const proposalRout = express.Router();

proposalRout.put("/hire-request/:proposalId",authenticate, proposal.hireRequest);
proposalRout.get("/get-freelacer-proposal",authenticate, proposal.getAllFreelancerProposals);
proposalRout.get("/all-proposal/:id",authenticate, proposal.getAllPropjectProposals);

proposalRout.get("/get-contract-details/:id",authenticate, proposal.getContractDetails);
proposalRout.get("/accept-contract/:id",authenticate, proposal.acceptProposalcontract);
proposalRout.get("/reject-contract/:id",authenticate, proposal.rejectProposalcontract);

proposalRout.get("/:jobId/milestones",authenticate, proposal.proposalMilestones);
proposalRout.patch("/milestones/:milestoneId/approve",authenticate, proposal.proposalMilestonesApprove);
proposalRout.patch("/milestones/:milestoneId/rejected",authenticate, proposal.proposalMilestonesReject);

export default proposalRout;
