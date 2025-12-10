import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/Card/Card";
import { TransactionRow } from "../../components/ui/transactionRow";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "../../components/Button/Button";
import { useAppNavigation } from "../../utils/useAppNavigation";
import { fetchDashboardStatsAPI } from "../../api/dashboardService";
import { setBalance } from "../../store/slices/moneyFlowSlice";
import { RootState } from "../../store/store";

export function DashboardPage() {
  const { goToPayment, goToTransactions } = useAppNavigation();
  const dispatch = useAppDispatch();

  // --- Redux balance
  const balance = useAppSelector((state: RootState) => state.moneyFlow.balance);

  // --- Local state for dashboard stats and transactions
  const [previousBalance, setPreviousBalance] = useState(0);
  const [stats, setStats] = useState([
    { title: "This Month", value: 0, positive: true, change: "0%" },
    { title: "Sent", value: 0, positive: true, change: "0%" },
    { title: "Received", value: 0, positive: true, change: "0%" },
    {
      title: "Transactions",
      value: 0,
      positive: true,
      change: "0%",
    },
  ]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchDashboardStatsAPI();
        // Update Redux balance
        dispatch(setBalance(data.balance ?? 0));

        // Keep previous balance for percentage calculation
        setPreviousBalance(data.previousBalance ?? 0);

        setStats([
          {
            title: "This Month",
            value: data.thisMonth ?? 0,
            positive: data.thisMonthChange >= 0,
            change: `${data.thisMonthChange ?? 0}%`,
          },
          {
            title: "Sent",
            value: data.sent ?? 0,
            positive: data.sentChange >= 0,
            change: `${data.sentChange ?? 0}%`,
          },
          {
            title: "Received",
            value: data.received ?? 0,
            positive: data.receivedChange >= 0,
            change: `${data.receivedChange ?? 0}%`,
          },
          {
            title: "Transactions",
            value: data.transactions ?? 0,
            positive: data.transactionsChange >= 0,
            change: `${data.transactionsChange ?? 0}%`,
          },
        ]);

        setRecentTransactions(data.recentTransactions ?? []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    }

    fetchData();
  }, [dispatch]);

  const balanceChange = previousBalance
    ? ((balance - previousBalance) / previousBalance) * 100
    : 0;

  return (
    <div className="min-h-screen w-full bg-black px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20 shadow-md">
        <CardContent className="p-8 flex justify-between items-center">
          <div>
            <p className="text-slate-400 mb-2">Available Balance</p>
            <p className="text-4xl font-thin text-white mb-3">
              ₹{balance.toFixed(2)}
            </p>
            <div
              className={`flex items-center text-sm ${
                balanceChange >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {balanceChange >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span>{balanceChange.toFixed(1)}% from last month</span>
            </div>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 mx-auto sm:mx-0">
              <DollarSign className="w-8 h-8 text-cyan-400" />
            </div>
            <Button variant="outline" size="sm" onClick={goToPayment}>
              View Details
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
              <div className="text-2xl font-semibold text-white mb-1">
                {stat.title !== "Transactions" ? `₹${stat.value}` : stat.value}
              </div>
              <div
                className={`flex items-center text-sm ${
                  stat.positive ? "text-green-400" : "text-red-400"
                }`}
              >
                {stat.positive ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                <span>{stat.change}</span>
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
