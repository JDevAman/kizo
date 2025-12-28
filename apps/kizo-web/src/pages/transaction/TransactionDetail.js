import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@kizo/ui";
import { Button } from "@kizo/ui";
import { Home, Receipt, ArrowRight, ArrowLeft } from "lucide-react";
import { useAppNavigation } from "../../utils/useAppNavigation";
import { api } from "../../api/api";
import { PaiseToRupees } from "../../utils/utils";
export function TransactionDetailsPage() {
    const { id } = useParams();
    const { goToDashboard, goToPayment, goToTransactions } = useAppNavigation();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAnimation, setShowAnimation] = useState(false);
    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const res = await api.get(`/transaction/${id}`);
                setTransaction(res.data);
            }
            catch (err) {
                console.error("Error fetching transaction", err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchTransaction();
        const timer = setTimeout(() => setShowAnimation(true), 100);
        return () => clearTimeout(timer);
    }, [id]);
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center px-4", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" }), _jsx("p", { className: "text-slate-400", children: "Loading transaction details..." })] }) }));
    }
    if (!transaction) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center px-4", children: _jsxs("div", { className: "text-center space-y-4", children: [_jsx("div", { className: "w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Receipt, { className: "w-10 h-10 text-slate-600" }) }), _jsx("h2", { className: "text-2xl font-semibold text-white", children: "Transaction Not Found" }), _jsx("p", { className: "text-slate-400 mb-6", children: "The transaction you're looking for doesn't exist." }), _jsxs(Button, { variant: "glow", onClick: goToDashboard, children: [_jsx(Home, { className: "w-4 h-4 mr-2" }), " Back to Dashboard"] })] }) }));
    }
    // Convert amount from paise to rupees
    const amountInRupees = PaiseToRupees(transaction.amount).toFixed(2);
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center px-4 py-12", children: _jsxs("div", { className: "w-full max-w-lg mx-auto", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: `inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full mb-6 transition-all duration-1000 ${showAnimation ? "scale-100 opacity-100" : "scale-50 opacity-0"}`, children: _jsx(Receipt, { className: `w-10 h-10 text-cyan-400 transition-all duration-1000 delay-300 ${showAnimation
                                    ? "scale-100 opacity-100 rotate-0"
                                    : "scale-50 opacity-0 rotate-12"}` }) }), _jsx("h1", { className: "text-3xl font-semibold text-white mb-2", children: "Transaction Details" }), _jsx("p", { className: "text-slate-400 text-sm", children: transaction.description })] }), _jsx(Card, { className: `bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-6 transition-all duration-1000 delay-500 ${showAnimation
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"}`, children: _jsxs(CardContent, { className: "p-6 space-y-4", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Transaction ID" }), _jsx("span", { className: "text-white font-mono text-xs bg-slate-800/50 px-2 py-1 rounded", children: transaction.id })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Recipient" }), _jsx("span", { className: "text-white font-medium", children: transaction.to?.email })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Amount" }), _jsxs("span", { className: "text-white font-semibold text-lg", children: ["\u20B9", amountInRupees] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Date & Time" }), _jsx("span", { className: "text-white text-sm", children: transaction.processedAt &&
                                            new Date(transaction.processedAt).toLocaleString("en-IN", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            }) })] }), _jsxs("div", { className: "border-t border-slate-700/50 pt-4 flex justify-between items-center", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Status" }), _jsx("span", { className: `font-medium px-3 py-1 rounded-full text-xs uppercase tracking-wide ${transaction.status === "SUCCESS"
                                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                            : transaction.status === "PROCESSING"
                                                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                                : transaction.status === "FAILED"
                                                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                                    : "bg-slate-500/20 text-slate-300 border border-slate-500/30"}`, children: transaction.status })] })] }) }), _jsxs("div", { className: `space-y-3 transition-all duration-1000 delay-700 ${showAnimation
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"}`, children: [_jsxs(Button, { variant: "glow", className: "w-full group", onClick: goToDashboard, children: [_jsx(Home, { className: "w-4 h-4 mr-2" }), " Back to Dashboard", _jsx(ArrowRight, { className: "w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(Button, { variant: "outline", onClick: goToPayment, className: "hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400", children: "Send Again" }), _jsxs(Button, { variant: "outline", onClick: goToTransactions, className: "hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), " All Transactions"] })] })] })] }) }));
}
