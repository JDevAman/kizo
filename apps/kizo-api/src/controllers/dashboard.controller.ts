import { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service.js";
import { DashboardData } from "@kizo/shared";

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const data = await dashboardService.getStats(userId);

    const response: DashboardData = {
      balance: data.balance,
      locked: data.locked,
      stats: data.stats,
      recentTransactions: data.recentTransactions,
    };

    res.json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Error" });
  }
};
