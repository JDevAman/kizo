import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "../../components/Card/Card";
import { Button } from "../../components/Button/Button";
import { Home, Receipt, ArrowRight, ArrowLeft } from "lucide-react";
import { useAppNavigation } from "../../utils/useAppNavigation";
import { api } from "../../api/api";
import { MoneyFlow } from "../../utils/types";

export function TransactionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { goToDashboard, goToPayment, goToTransactions } = useAppNavigation();
  const [transaction, setTransaction] = useState<MoneyFlow | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await api.get(`/transactions/${id}`);
        setTransaction(res.data);
      } catch (err) {
        console.error("Error fetching transaction", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();

    const timer = setTimeout(() => setShowAnimation(true), 100);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-10 h-10 text-slate-600" />
          </div>
          <h2 className="text-2xl font-semibold text-white">
            Transaction Not Found
          </h2>
          <p className="text-slate-400 mb-6">
            The transaction you're looking for doesn't exist.
          </p>
          <Button variant="glow" onClick={goToDashboard}>
            <Home className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Convert amount from paise to rupees
  const amountInRupees = transaction.amount.toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full mb-6 transition-all duration-1000 ${
              showAnimation ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            <Receipt
              className={`w-10 h-10 text-cyan-400 transition-all duration-1000 delay-300 ${
                showAnimation
                  ? "scale-100 opacity-100 rotate-0"
                  : "scale-50 opacity-0 rotate-12"
              }`}
            />
          </div>

          <h1 className="text-3xl font-semibold text-white mb-2">
            Transaction Details
          </h1>
          <p className="text-slate-400 text-sm">{transaction.description}</p>
        </div>

        {/* Transaction Card */}
        <Card
          className={`bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-6 transition-all duration-1000 delay-500 ${
            showAnimation
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-slate-400 text-sm">Transaction ID</span>
              <span className="text-white font-mono text-xs bg-slate-800/50 px-2 py-1 rounded">
                {transaction.id}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400 text-sm">Recipient</span>
              <span className="text-white font-medium">
                {transaction.toEmail}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400 text-sm">Amount</span>
              <span className="text-white font-semibold text-lg">
                ₹{amountInRupees}
              </span>
            </div>
{/* 
            <div className="flex justify-between">
              <span className="text-slate-400 text-sm">Processing Fee</span>
              <span className="text-slate-300">₹{feeInRupees}</span>
            </div> */}

            <div className="flex justify-between">
              <span className="text-slate-400 text-sm">Date & Time</span>
              <span className="text-white text-sm">
                {new Date(transaction.finalizedAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>

            {/* <div className="border-t border-slate-700/50 pt-4 flex justify-between items-center">
              <span className="text-slate-300 font-medium">Total Amount</span>
              <span className="text-cyan-400 font-semibold text-2xl">
                ₹{totalInRupees}
              </span>
            </div> */}

            <div className="border-t border-slate-700/50 pt-4 flex justify-between items-center">
              <span className="text-slate-400 text-sm">Status</span>
              <span
                className={`font-medium px-3 py-1 rounded-full text-xs uppercase tracking-wide ${
                  transaction.status === "success"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : transaction.status === "pending"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : transaction.status === "failed"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                }`}
              >
                {transaction.status}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div
          className={`space-y-3 transition-all duration-1000 delay-700 ${
            showAnimation
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <Button
            variant="glow"
            className="w-full group"
            onClick={goToDashboard}
          >
            <Home className="w-4 h-4 mr-2" /> Back to Dashboard
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={goToPayment}
              className="hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400"
            >
              Send Again
            </Button>
            <Button
              variant="outline"
              onClick={goToTransactions}
              className="hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> All Transactions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
