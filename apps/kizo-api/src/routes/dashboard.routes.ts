import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getDashboardData } from "../controllers/dashboard.controller.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";

const dashboardRouter = express.Router();
dashboardRouter.use(authenticate);

dashboardRouter.get("/", cacheMiddleware("user:dash", 300), getDashboardData);

export default dashboardRouter;
