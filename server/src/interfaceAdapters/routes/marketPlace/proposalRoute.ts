import express from "express";
import authenticate from "../../../middleware/authMiddleware";
import { ProposalController } from "../../controllers/marketPlaceController/proposalController";

const proposal =new ProposalController()
const proposalRout = express.Router();

proposalRout.put("/hire-request/:proposalId",authenticate, proposal.hireRequest);


export default proposalRout;
