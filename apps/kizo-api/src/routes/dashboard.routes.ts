import express from "express";
import authenticate from "../middlewares/authMiddleware.js";
import { getDashboardData } from "../controllers/dashboard.controller.js";

const dashboardRouter = express.Router();
dashboardRouter.use(authenticate);

dashboardRouter.get("/", getDashboardData);

export default dashboardRouter;
