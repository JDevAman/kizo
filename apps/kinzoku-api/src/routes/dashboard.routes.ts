import express from "express";
import authenticate from "../middlewares/authMiddleware";
import { getDashboardData } from "../controllers/dashboard.controller";

const dashboardRouter = express.Router();
dashboardRouter.use(authenticate);

dashboardRouter.get("/", getDashboardData);

export default dashboardRouter;
