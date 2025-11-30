import { api } from "./api";

// Fetch overall stats (balance, total sent/received, monthly stats, etc.)
export const fetchDashboardStatsAPI = async () => {
  const res = await api.get("/dashboard");
  return res.data; 
};

// Fetch recent transactions
export const fetchRecentTransactionsAPI = async (limit = 5) => {
  const res = await api.get("/transactions", { params: { limit, skip: 0 } });
  return res.data.transactions;
};
