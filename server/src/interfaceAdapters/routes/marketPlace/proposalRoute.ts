import express from "express";
import authenticate from "../../../middleware/authMiddleware";
import { ProposalController } from "../../controllers/marketPlaceController/proposalController";

const proposal =new ProposalController()
const proposalRout = express.Router();

proposalRout.put("/hire-request/:proposalId",authenticate, proposal.hireRequest);
proposalRout.get("/get-freelacer-proposal",authenticate, proposal.getAllFreelancerProposals);
// proposalRout.get("/get-contract-details/:id",authenticate, proposal.getContractDetails);

proposalRout.get("/get-contract-details/:id",authenticate, proposal.getContractDetails);
proposalRout.get("/accept-contract/:id",authenticate, proposal.acceptProposalcontract);
proposalRout.get("/reject-contract/:id",authenticate, proposal.rejectProposalcontract);

export default proposalRout;
