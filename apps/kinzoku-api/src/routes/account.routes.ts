import express from "express";
import authenticate from "../middlewares/authMiddleware";
import {
  getBalance,
  addMoney,
  transferMoney,
  createRequest,
  getRequests,
  acceptRequest,
  rejectRequest
} from "../controllers/account.controller";

const accountRouter = express.Router();

accountRouter.use(authenticate); // Protect all routes

// Core
accountRouter.get("/balance", getBalance);
accountRouter.post("/add-money", addMoney);
accountRouter.post("/transfer", transferMoney);

// Requests
accountRouter.get("/requests", getRequests);
accountRouter.post("/request/create", createRequest);
accountRouter.post("/request/accept/:id", acceptRequest);
accountRouter.post("/request/reject/:id", rejectRequest);

export default accountRouter;