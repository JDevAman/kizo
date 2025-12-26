import { ArrowUpRight, ArrowDownLeft, PlusCircle } from "lucide-react";
import { useAppNavigation } from "../utils/useAppNavigation.js";
import { useAppSelector } from "../store/hooks.js";

import { PaiseToRupees } from "../utils/utils.js";
import { ListTransaction } from "@kizo/shared";

interface TransactionRowProps {
  transaction: ListTransaction;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const { goToTransactionDetails } = useAppNavigation();
  const currentUserId = useAppSelector((state) => state.auth.user.id);

  // --- Amount & Status logic remains the same
  const getAmountColor = () => {
    if (transaction.type === "DEPOSIT") return "text-green-400";
    if (transaction.type === "TRANSFER") {
      return transaction.direction === "SENT"
        ? "text-red-400"
        : "text-green-400";
    }
    if (transaction.type === "WITHDRAWAL") return "text-red-400";
    return "text-slate-400";
  };

  const getAmountPrefix = () => {
    if (transaction.type === "DEPOSIT") return "+";
    if (transaction.type === "TRANSFER")
      return transaction.direction === "SENT" ? "-" : "+";
    if (transaction.type === "WITHDRAWAL") return "-";
    return "";
  };

  const getDescription = () => {
    if (transaction.description?.trim()) return transaction.description;
    if (transaction.type === "DEPOSIT") return "Credited Money";
    if (transaction.type === "TRANSFER")
      return transaction.fromId === currentUserId
        ? "Sent Money"
        : "Received Money";
    if (transaction.type === "WITHDRAWAL") return "Debited Money";
    return "Transaction";
  };

  const formattedDate = new Date(transaction.createdAt).toLocaleString();

  return (
    <div
      className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors border-b border-slate-800 last:border-b-0 cursor-pointer"
      onClick={() => goToTransactionDetails(transaction.id)}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center">
          {transaction.type === "DEPOSIT" && (
            <PlusCircle className="w-5 h-5 text-green-400" />
          )}
          {transaction.type === "TRANSFER" &&
            (transaction.direction === "SENT" ? (
              <ArrowUpRight className="w-5 h-5 text-red-400" />
            ) : (
              <ArrowDownLeft className="w-5 h-5 text-green-400" />
            ))}
          {transaction.type === "WITHDRAWAL" && (
            <ArrowUpRight className="w-5 h-5 text-red-400" />
          )}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <p className="text-white font-medium">{getDescription()}</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="text-right flex flex-col items-end">
        <p className={`font-semibold ${getAmountColor()}`}>
          {getAmountPrefix()}₹{PaiseToRupees(transaction.amount).toFixed(2)}
        </p>
        <p className="text-xs text-slate-500 capitalize">
          {transaction.status}
        </p>
      </div>
    </div>
  );
}
