import express from "express";
import authenticate from "../middlewares/authMiddleware.js";
import { getDashboardData } from "../controllers/dashboard.controller.js";
import { cacheMiddleware } from "../middlewares/cache.Middleware.js";

const dashboardRouter = express.Router();
dashboardRouter.use(authenticate);

dashboardRouter.get("/", cacheMiddleware("user:dash", 600), getDashboardData);

export default dashboardRouter;
