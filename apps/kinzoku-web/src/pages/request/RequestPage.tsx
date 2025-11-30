import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import {
  fetchRequestsAPI,
  acceptRequestAPI,
  rejectRequestAPI,
} from "../../api/requestService";
import {
  updateMoneyFlow,
  setMoneyFlows,
} from "../../store/slices/moneyFlowSlice";
import { TransactionRow } from "../../components/ui/transactionRow";

export function RequestsPage() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state: RootState) => state.auth.user.id);
  const balance = useAppSelector((state: RootState) => state.moneyFlow.balance);
  const moneyFlows = useAppSelector((state: RootState) => state.moneyFlow.list);

  const [filter, setFilter] = useState<"all" | "incoming" | "outgoing">("all");
  const [loading, setLoading] = useState(false);

  // --- Fetch requests from API
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchRequestsAPI();
        dispatch(
          setMoneyFlows(data.map((req) => ({ ...req, type: "request" })))
        );
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  // --- Filter requests
  const filteredRequests = useMemo(() => {
    const requests = moneyFlows.filter((t) => t.type === "request");
    if (filter === "all") return requests;
    return requests.filter((r) =>
      filter === "incoming" ? r.toId === userId : r.fromId === userId
    );
  }, [moneyFlows, filter, userId]);

  const pendingCount = filteredRequests.filter(
    (r) => r.status === "pending"
  ).length;
  const totalRequested = filteredRequests.reduce((sum, r) => sum + r.amount, 0);

  // --- Handlers
  const handleAccept = async (id: string) => {
    try {
      await acceptRequestAPI(id);
      dispatch(updateMoneyFlow({ id, status: "success" }));
    } catch (err) {
      console.error("Accept failed:", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectRequestAPI(id);
      dispatch(updateMoneyFlow({ id, status: "rejected" }));
    } catch (err) {
      console.error("Reject failed:", err);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await rejectRequestAPI(id); // reuse reject endpoint
      dispatch(updateMoneyFlow({ id, status: "cancelled" }));
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Requests</h1>
          <p className="text-slate-400">
            {pendingCount} pending · ₹{totalRequested.toFixed(2)} total
            requested
          </p>
        </div>
        <div className="text-slate-400">
          <span className="text-sm">Balance:</span>{" "}
          <span className="text-cyan-400 font-medium">
            ₹{balance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-800 pb-2">
        {["all", "incoming", "outgoing"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`capitalize text-sm px-3 py-1 rounded-md ${
              filter === tab
                ? "bg-cyan-500/20 text-cyan-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Request List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            Loading requests...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No {filter} requests found
          </div>
        ) : (
          filteredRequests.map((req) => (
            <TransactionRow
              key={req.id}
              transaction={req}
              onAccept={handleAccept}
              onReject={handleReject}
              onCancel={handleCancel}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default RequestsPage;
