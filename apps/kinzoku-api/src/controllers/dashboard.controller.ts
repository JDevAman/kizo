import { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service";
import { DashboardData } from "@kinzoku/shared"; // <--- Import the Type

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    
    // The service returns data matching the shape
    const data = await dashboardService.getStats(userId);

    // Type Assertion ensures we match the contract
    const response: DashboardData = {
      balance: data.balance,
      stats: data.stats,
      recentTransactions: data.recentTransactions
      // If you miss a field here, TypeScript will error instantly!
    };

    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: "Internal Error" });
  }
};