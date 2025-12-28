import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@kizo/ui";
import { TransactionRow } from "../../components/transactionRow";
import { DollarSign } from "lucide-react";
import { Button } from "@kizo/ui";
import { useAppNavigation } from "../../utils/useAppNavigation";
import { fetchDashboardStatsAPI } from "../../api/dashboardService";
import { setAccount } from "@kizo/store";
import { PaiseToRupees } from "../../utils/utils";
export function DashboardPage() {
    const { goToPayment, goToTransactions } = useAppNavigation();
    const dispatch = useAppDispatch();
    // Redux balance (single source of truth)
    const balance = useAppSelector((state) => PaiseToRupees(state.account.balance));
    // Local UI state
    const [stats, setStats] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await fetchDashboardStatsAPI();
                // Update Redux balance
                dispatch(setAccount({ balance: data.balance, locked: data.locked ?? "0" }));
                // Map backend stats → UI cards
                setStats([
                    {
                        title: "This Month",
                        value: PaiseToRupees(data.stats.thisMonth),
                        color: "blue",
                    },
                    {
                        title: "Sent",
                        value: PaiseToRupees(data.stats.sent),
                        color: "red",
                    },
                    {
                        title: "Received",
                        value: PaiseToRupees(data.stats.received),
                        color: "green",
                    },
                    {
                        title: "Transactions",
                        value: PaiseToRupees(data.stats.totalCount),
                        color: "neutral",
                    },
                ]);
                setRecentTransactions(data.recentTransactions);
            }
            catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            }
            finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [dispatch]);
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-black flex items-center justify-center text-slate-400", children: "Loading dashboard\u2026" }));
    }
    return (_jsxs("div", { className: "min-h-screen w-full bg-black px-4 sm:px-6 lg:px-8 py-8 space-y-10", children: [_jsx(Card, { className: "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20 shadow-md", children: _jsxs(CardContent, { className: "p-8 flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("p", { className: "text-slate-400 mb-2", children: "Available Balance" }), _jsxs("p", { className: "text-4xl font-thin text-white mb-3", children: ["\u20B9", balance] }), _jsx("p", { className: "text-sm text-slate-400", children: "Updated in real time" })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 mx-auto sm:mx-0", children: _jsx(DollarSign, { className: "w-8 h-8 text-cyan-400" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: goToPayment, children: "Add / Withdraw" })] })] }) }), _jsx("section", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: stats.map((stat, i) => (_jsxs(Card, { className: "bg-slate-900/30 border-slate-800", children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm font-medium text-slate-400", children: stat.title }) }), _jsx(CardContent, { children: _jsx("div", { className: `text-2xl font-semibold ${stat.color === "green"
                                    ? "text-green-400"
                                    : stat.color === "red"
                                        ? "text-red-400"
                                        : stat.color === "blue"
                                            ? "text-blue-400"
                                            : "text-white"}`, children: stat.title !== "Transactions" ? `₹${stat.value}` : stat.value }) })] }, i))) }), _jsxs("section", { children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-xl font-semibold text-white", children: "Recent Transactions" }), _jsx(Button, { variant: "outline", size: "sm", onClick: goToTransactions, children: "View All" })] }), _jsx("div", { className: "space-y-4", children: recentTransactions.length > 0 ? (recentTransactions.map((tx) => (_jsx(TransactionRow, { transaction: tx }, tx.id)))) : (_jsx(Card, { className: "bg-slate-900/30 border-slate-800", children: _jsx(CardContent, { className: "p-12 text-center text-slate-400", children: "No recent transactions" }) })) })] })] }));
}
