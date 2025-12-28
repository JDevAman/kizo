import { api } from "./api";
// Fetch overall stats (balance, total sent/received, monthly stats, etc.)
export const fetchDashboardStatsAPI = async () => {
    const res = await api.get("/dashboard");
    return res.data;
};
