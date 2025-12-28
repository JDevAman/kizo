import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Button, InputField, StatsCard } from "@kizo/ui";
import { Card, CardContent, } from "../../../../../packages/ui/src/components/Card";
import { TransactionRow } from "../../components/transactionRow";
import { Search, Filter, Download } from "lucide-react";
import { useAppNavigation } from "../../utils/useAppNavigation";
import { exportTransactionsAPI, fetchTransactionsAPI, } from "../../api/transactionService";
import { useDebounce } from "../../utils/useDebounce";
import saveAs from "file-saver";
import { setTransactions, setLoading, setError } from "@kizo/store";
import { PaiseToRupees } from "../../utils/utils";
const LIMIT = 20;
export function TransactionsPage() {
    const dispatch = useAppDispatch();
    const { goToPayment } = useAppNavigation();
    const { list: transactions, loading } = useAppSelector((state) => state.transaction);
    const userId = useAppSelector((state) => state.auth.user?.id);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const statusOptions = ["all", "sent", "received", "pending"];
    // ---------------- Fetch Transactions ----------------
    const fetchTransactions = useCallback(async (pageNumber = 1) => {
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
            const { transactions, total } = await fetchTransactionsAPI(params);
            dispatch(setTransactions(transactions.data));
            setTotal(total);
            setPage(pageNumber);
        }
        catch (err) {
            dispatch(setError(err?.message || "Failed to load transactions"));
        }
        finally {
            dispatch(setLoading(false));
        }
    }, [activeFilter, debouncedSearchTerm, fromDate, toDate, dispatch]);
    useEffect(() => {
        fetchTransactions(1);
    }, [activeFilter, debouncedSearchTerm, fromDate, toDate]);
    // ---------------- Derived Stats ----------------
    const successfulTx = useMemo(() => transactions.filter((t) => t.status === "SUCCESS"), [transactions]);
    const totalSent = useMemo(() => successfulTx
        .filter((t) => t.direction === "SENT")
        .reduce((sum, t) => sum + Number(t.amount), 0)
        .toString(), [successfulTx]);
    const totalReceived = useMemo(() => successfulTx
        .filter((t) => t.direction === "RECEIVED")
        .reduce((sum, t) => sum + Number(t.amount), 0)
        .toString(), [successfulTx]);
    const pendingAmount = useMemo(() => transactions
        .filter((t) => t.status === "PROCESSING")
        .reduce((sum, t) => sum + Number(t.amount), 0)
        .toString(), [transactions]);
    // ---------------- Export ----------------
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
        }
        catch (err) {
            console.error("Failed to export transactions:", err);
        }
    };
    const totalPages = Math.ceil(total / LIMIT);
    // ---------------- UI ----------------
    return (_jsx("div", { className: "min-h-screen px-4 py-8 md:px-8 md:py-10 lg:px-12", children: _jsxs("div", { className: "max-w-7xl mx-auto space-y-8", children: [_jsxs("header", { children: [_jsx("h1", { className: "text-3xl font-light text-white mb-2", children: "Transactions" }), _jsx("p", { className: "text-slate-400", children: "View and manage all your payment history." })] }), _jsxs("div", { className: "flex flex-col lg:flex-row gap-4 items-center", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" }), _jsx(InputField, { type: "text", placeholder: "Search transactions...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 h-10" })] }), _jsxs(Button, { variant: "outline", size: "sm", className: "h-10", onClick: () => setShowFilterPanel((prev) => !prev), children: [_jsx(Filter, { className: "w-4 h-4 mr-2" }), " Filter"] })] }), showFilterPanel && (_jsx(Card, { className: "bg-slate-900/20 border-slate-800 mt-2 p-4", children: _jsxs("div", { className: "flex flex-col lg:flex-row gap-4 items-center", children: [_jsx(InputField, { type: "date", value: fromDate ?? "", onChange: (e) => setFromDate(e.target.value || null), className: "w-36 h-10" }), _jsx(InputField, { type: "date", value: toDate ?? "", onChange: (e) => setToDate(e.target.value || null), className: "w-36 h-10" }), _jsx("select", { value: activeFilter, onChange: (e) => setActiveFilter(e.target.value), className: "bg-slate-800 text-white p-2 rounded border border-slate-700 h-10", children: statusOptions.map((status) => (_jsx("option", { value: status, children: status.charAt(0).toUpperCase() + status.slice(1) }, status))) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => fetchTransactions(1), className: "h-10", children: "Show Records" }), _jsxs(Button, { variant: "outline", size: "sm", onClick: handleExport, className: "h-10", children: [_jsx(Download, { className: "w-4 h-4 mr-1" }), " Export Records"] })] }) })), _jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(StatsCard, { title: "Total Sent", value: PaiseToRupees(totalSent), color: "text-red-400" }), _jsx(StatsCard, { title: "Total Received", value: PaiseToRupees(totalReceived), color: "text-green-400" }), _jsx(StatsCard, { title: "Pending", value: PaiseToRupees(pendingAmount), color: "text-yellow-400" }), _jsx(StatsCard, { title: "Net Flow", value: Math.abs(PaiseToRupees(totalReceived) - PaiseToRupees(totalSent)), color: PaiseToRupees(totalReceived) >= PaiseToRupees(totalSent)
                                ? "text-green-400"
                                : "text-red-400" })] }), _jsx("section", { className: "space-y-3 mt-4", children: loading ? (_jsx(Card, { className: "bg-slate-900/30 border-slate-800", children: _jsx(CardContent, { className: "p-12 text-center", children: _jsx("p", { className: "text-slate-400", children: "Loading transactions..." }) }) })) : transactions.length > 0 ? (_jsxs(_Fragment, { children: [transactions.map((t) => (_jsx(TransactionRow, { transaction: t }, t.id))), _jsxs("div", { className: "flex justify-center gap-2 mt-4", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => fetchTransactions(page - 1), disabled: page === 1, children: "Prev" }), _jsxs("span", { className: "text-white px-2 py-1", children: [page, " / ", totalPages] }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => fetchTransactions(page + 1), disabled: page === totalPages, children: "Next" })] })] })) : (_jsx(Card, { className: "bg-slate-900/30 border-slate-800", children: _jsxs(CardContent, { className: "p-12 text-center", children: [_jsx("h3", { className: "text-white font-medium mb-2", children: "No transactions found" }), _jsx("p", { className: "text-slate-400 mb-6", children: "Try adjusting your filters" }), _jsx(Button, { variant: "glow", onClick: goToPayment, children: "Make Your First Payment" })] }) })) })] }) }));
}
export default TransactionsPage;
