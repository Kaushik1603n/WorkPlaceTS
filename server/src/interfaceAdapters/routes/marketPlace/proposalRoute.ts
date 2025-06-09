import express from "express";
import authenticate from "../../../middleware/authMiddleware";
import { ProposalController } from "../../controllers/marketPlaceController/proposalController";

const proposal =new ProposalController()
const proposalRout = express.Router();

proposalRout.put("/hire-request/:proposalId",authenticate, proposal.hireRequest);
proposalRout.get("/get-freelacer-proposal",authenticate, proposal.getAllFreelancerProposals);
proposalRout.get("/get-contract-details/:id",authenticate, proposal.getContractDetails);


export default proposalRout;
