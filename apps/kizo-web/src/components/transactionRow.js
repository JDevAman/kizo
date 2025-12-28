import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowUpRight, ArrowDownLeft, PlusCircle } from "lucide-react";
import { useAppNavigation } from "../utils/useAppNavigation.js";
import { useAppSelector } from "../store/hooks.js";
import { PaiseToRupees } from "../utils/utils.js";
export function TransactionRow({ transaction }) {
    const { goToTransactionDetails } = useAppNavigation();
    const currentUserId = useAppSelector((state) => state.auth.user?.id);
    if (!currentUserId)
        return null;
    // --- Amount & Status logic remains the same
    const getAmountColor = () => {
        if (transaction.type === "DEPOSIT")
            return "text-green-400";
        if (transaction.type === "TRANSFER") {
            return transaction.direction === "SENT"
                ? "text-red-400"
                : "text-green-400";
        }
        if (transaction.type === "WITHDRAWAL")
            return "text-red-400";
        return "text-slate-400";
    };
    const getAmountPrefix = () => {
        if (transaction.type === "DEPOSIT")
            return "+";
        if (transaction.type === "TRANSFER")
            return transaction.direction === "SENT" ? "-" : "+";
        if (transaction.type === "WITHDRAWAL")
            return "-";
        return "";
    };
    const getDescription = () => {
        if (transaction.description?.trim())
            return transaction.description;
        if (transaction.type === "DEPOSIT")
            return "Credited Money";
        if (transaction.type === "TRANSFER")
            return transaction.direction === "SENT"
                ? "Sent Money"
                : "Received Money";
        if (transaction.type === "WITHDRAWAL")
            return "Debited Money";
        return "Transaction";
    };
    const formattedDate = new Date(transaction.createdAt).toLocaleString();
    return (_jsxs("div", { className: "flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors border-b border-slate-800 last:border-b-0 cursor-pointer", onClick: () => goToTransactionDetails(transaction.id), children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center", children: [transaction.type === "DEPOSIT" && (_jsx(PlusCircle, { className: "w-5 h-5 text-green-400" })), transaction.type === "TRANSFER" &&
                                (transaction.direction === "SENT" ? (_jsx(ArrowUpRight, { className: "w-5 h-5 text-red-400" })) : (_jsx(ArrowDownLeft, { className: "w-5 h-5 text-green-400" }))), transaction.type === "WITHDRAWAL" && (_jsx(ArrowUpRight, { className: "w-5 h-5 text-red-400" }))] }), _jsxs("div", { children: [_jsx("div", { className: "flex items-center space-x-2", children: _jsx("p", { className: "text-white font-medium", children: getDescription() }) }), _jsx("div", { className: "flex items-center space-x-2 text-sm text-slate-400", children: _jsx("span", { children: formattedDate }) })] })] }), _jsxs("div", { className: "text-right flex flex-col items-end", children: [_jsxs("p", { className: `font-semibold ${getAmountColor()}`, children: [getAmountPrefix(), "\u20B9", PaiseToRupees(transaction.amount).toFixed(2)] }), _jsx("p", { className: "text-xs text-slate-500 capitalize", children: transaction.status })] })] }));
}
