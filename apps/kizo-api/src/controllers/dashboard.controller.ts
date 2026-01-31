import { NextFunction, Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service.js";
import { DashboardData } from "@kizo/shared";
import { logger } from "../server.js";

export const getDashboardData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = Date.now();
  try {
    const userId = req.user.id;

    const data = await dashboardService.getStats(userId);

    const response: DashboardData = {
      balance: data.balance,
      locked: data.locked,
      stats: data.stats,
      recentTransactions: data.recentTransactions,
    };

    req.log.info(
      {
        userId,
        duration: `${Date.now() - startTime}ms`,
      },
      "Dashboard data fetched",
    );
    res.json(response);
  } catch (err) {
    next(err);
  }
};
