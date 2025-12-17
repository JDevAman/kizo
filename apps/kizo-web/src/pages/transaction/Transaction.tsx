import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Button } from "../../components/Button/Button";
import { InputField } from "../../components/Form/InputField";
import { Card, CardContent } from "../../components/Card/Card";
import { TransactionRow } from "../../components/ui/transactionRow";
import { Search, Filter, Download } from "lucide-react";
import { useAppNavigation } from "../../utils/useAppNavigation";
import {
  exportTransactionsAPI,
  fetchTransactionsAPI,
} from "../../api/transactionService";
import {
  setMoneyFlows,
  setLoading,
  setError,
} from "../../store/slices/moneyFlowSlice";
import { useDebounce } from "../../utils/useDebounce";
import saveAs from "file-saver";
import { StatsCard } from "../../components/Card/StatsCard";

const LIMIT = 20;

export function TransactionsPage() {
  const dispatch = useAppDispatch();
  const { goToPayment } = useAppNavigation();
  const { list: moneyFlows, loading } = useAppSelector(
    (state) => state.moneyFlow
  );
  const userId = useAppSelector((state) => state.auth.user.id);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "sent" | "received" | "pending"
  >("all");
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const statusOptions = ["all", "sent", "received", "pending"];

  // --- Fetch money flows
  const fetchMoneyFlows = useCallback(
    async (pageNumber = 1) => {
      try {
        dispatch(setLoading(true));

        const params = {
          filter: activeFilter,
          search: debouncedSearchTerm,
          limit: LIMIT,
          skip: (pageNumber - 1) * LIMIT,
          from: fromDate,
          to: toDate,
        };

        const { transactions: fetched, total } = await fetchTransactionsAPI(
          params
        );

        // --- Map backend response to MoneyFlow interface
        const formatted = fetched.map((t: any) => ({
          id: t._id || t.id,
          type: t.type, // transfer | request | add | refund
          amount: t.amount, // in paise
          status: t.status,
          fromId: t.from?._id || t.from,
          toId: t.to?._id || t.to,
          fromEmail: t.from?.email || t.fromEmail,
          toEmail: t.to?.email || t.toEmail,
          description: t.description || "",
          relatedTransactionId:
            t.relatedTransaction?._id || t.relatedTransactionId || null,
          initiatedById: t.initiatedBy?._id || t.initiatedById || null,
          expiresAt: t.expiresAt || null,
          createdAt: t.createdAt,
          finalizedAt: t.finalizedAt || null,
        }));

        dispatch(setMoneyFlows(formatted));
        setTotal(total);
        setPage(pageNumber);
      } catch (err: any) {
        dispatch(setError(err?.message || "Failed to load transactions"));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [activeFilter, debouncedSearchTerm, dispatch, fromDate, toDate]
  );

  useEffect(() => {
    fetchMoneyFlows(1);
  }, [activeFilter, debouncedSearchTerm, fromDate, toDate]);

  // --- Stats
  const successMoneyFlows = useMemo(
    () => moneyFlows.filter((t) => t.status === "success"),
    [moneyFlows]
  );

  const totalSent = useMemo(
    () =>
      successMoneyFlows
        .filter((t) => t.fromId === userId)
        .reduce((s, t) => s + t.amount, 0),
    [successMoneyFlows]
  );
  const totalReceived = useMemo(
    () =>
      successMoneyFlows
        .filter((t) => t.toId === userId)
        .reduce((s, t) => s + t.amount, 0),
    [successMoneyFlows]
  );
  const pendingAmount = useMemo(
    () =>
      moneyFlows
        .filter((t) => t.status === "pending")
        .reduce((s, t) => s + t.amount, 0),
    [moneyFlows]
  );

  const handleExport = async () => {
    try {
      const data = await exportTransactionsAPI({
        filter: activeFilter,
        search: debouncedSearchTerm,
        from: fromDate,
        to: toDate,
      });

      const blob = new Blob([data], { type: "text/csv;charset=utf-8" });
      saveAs(blob, "transactions.csv");
    } catch (err) {
      console.error("Failed to export transactions:", err);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 md:py-10 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-light text-white mb-2">Transactions</h1>
          <p className="text-slate-400">
            View and manage all your payment history.
          </p>
        </header>

        {/* Search + Filter */}
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            <InputField
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-10 flex items-center justify-center"
            onClick={() => setShowFilterPanel((prev) => !prev)}
          >
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>

        {showFilterPanel && (
          <Card className="bg-slate-900/20 border-slate-800 mt-2 p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <InputField
                type="date"
                value={fromDate ?? ""}
                onChange={(e) => setFromDate(e.target.value || null)}
                className="w-36 h-10"
              />
              <InputField
                type="date"
                value={toDate ?? ""}
                onChange={(e) => setToDate(e.target.value || null)}
                className="w-36 h-10"
              />
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value as any)}
                className="bg-slate-800 text-white p-2 rounded border border-slate-700 h-10"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchMoneyFlows(1)}
                className="h-10"
              >
                Show Records
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="h-10 flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-1" /> Export Records
              </Button>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Sent"
            value={totalSent}
            color="text-red-400"
          />
          <StatsCard
            title="Total Received"
            value={totalReceived}
            color="text-green-400"
          />
          <StatsCard
            title="Pending"
            value={pendingAmount}
            color="text-yellow-400"
          />
          <StatsCard
            title="Net Flow"
            value={Math.abs(totalReceived - totalSent)}
            color="text-green-400"
          />
        </div>

        {/* Transaction List */}
        <section className="space-y-3 mt-4">
          {loading ? (
            <Card className="bg-slate-900/30 border-slate-800">
              <CardContent className="p-12 text-center">
                <p className="text-slate-400">Loading transactions...</p>
              </CardContent>
            </Card>
          ) : moneyFlows.length > 0 ? (
            <>
              {moneyFlows.map((t) => (
                <TransactionRow key={t.id} transaction={t} />
              ))}

              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchMoneyFlows(page - 1)}
                  disabled={page === 1}
                >
                  Prev
                </Button>
                <span className="text-white px-2 py-1">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchMoneyFlows(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <Card className="bg-slate-900/30 border-slate-800">
              <CardContent className="p-12 text-center">
                <h3 className="text-white font-medium mb-2">
                  No transactions found
                </h3>
                <p className="text-slate-400 mb-6">
                  Try adjusting your filters
                </p>
                <Button variant="glow" onClick={goToPayment}>
                  Make Your First Payment
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}

export default TransactionsPage;
