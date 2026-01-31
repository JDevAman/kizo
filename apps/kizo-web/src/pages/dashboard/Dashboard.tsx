import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@kizo/ui";
import { TransactionRow } from "../../components/transactionRow";
import { DollarSign } from "lucide-react";
import { Button } from "@kizo/ui";
import { useAppNavigation } from "../../utils/useAppNavigation";
import { fetchDashboardStatsAPI } from "../../api/dashboardService";
import { RootState, setAccount } from "@kizo/store";
import { DashboardData } from "@kizo/shared";
import { StatItem } from "../../utils/types";
import { PaiseToRupees } from "../../utils/utils";

export function DashboardPage() {
  const { goToPayment, goToTransactions } = useAppNavigation();
  const dispatch = useAppDispatch();

  // Redux balance (single source of truth)
  const balance = useAppSelector((state: RootState) =>
    PaiseToRupees(state.account.balance),
  );

  // Local UI state
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data: DashboardData = await fetchDashboardStatsAPI();
        // Update Redux balance
        dispatch(
          setAccount({ balance: data.balance, locked: data.locked ?? "0" }),
        );

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
            value: Number(data.stats.totalCount),
            color: "neutral",
          },
        ]);

        setRecentTransactions(data.recentTransactions);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dispatch]);

  console.log(stats);
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-slate-400">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20 shadow-md">
        <CardContent className="p-8 flex justify-between items-center">
          <div>
            <p className="text-slate-400 mb-2">Available Balance</p>
            <p className="text-4xl font-thin text-white mb-3">₹{balance}</p>
            <p className="text-sm text-slate-400">Updated in real time</p>
          </div>

          <div className="text-right">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 mx-auto sm:mx-0">
              <DollarSign className="w-8 h-8 text-cyan-400" />
            </div>
            <Button variant="outline" size="sm" onClick={goToPayment}>
              Add / Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-slate-900/30 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-semibold ${
                  stat.color === "green"
                    ? "text-green-400"
                    : stat.color === "red"
                    ? "text-red-400"
                    : stat.color === "blue"
                    ? "text-blue-400"
                    : "text-white"
                }`}
              >
                {stat.title !== "Transactions" ? `₹${stat.value}` : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Recent Transactions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Recent Transactions
          </h2>
          <Button variant="outline" size="sm" onClick={goToTransactions}>
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} />
            ))
          ) : (
            <Card className="bg-slate-900/30 border-slate-800">
              <CardContent className="p-12 text-center text-slate-400">
                No recent transactions
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
