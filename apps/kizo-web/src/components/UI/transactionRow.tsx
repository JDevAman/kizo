import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
} from "lucide-react";
import { useAppNavigation } from "../../utils/useAppNavigation";
import { MoneyFlow } from "../../utils/types";
import { useAppSelector } from "../../store/hooks";
import { Button } from "../Button/Button";

interface TransactionRowProps {
  transaction: MoneyFlow;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export function TransactionRow({
  transaction,
  onAccept,
  onReject,
  onCancel,
}: TransactionRowProps) {
  const { goToTransactionDetails } = useAppNavigation();
  console.log(transaction)
  const currentUserId = useAppSelector((state) => state.auth.user.id);

  const isIncomingRequest =
    transaction.type === "request" && transaction.toId === currentUserId;
  const isOutgoingRequest =
    transaction.type === "request" && transaction.fromId === currentUserId;

  // --- Amount & Status logic remains the same
  const getAmountColor = () => {
    if (transaction.type === "add") return "text-green-400";
    if (transaction.type === "transfer") {
      return transaction.from === currentUserId
        ? "text-red-400"
        : "text-green-400";
    }
    if (transaction.type === "request") {
      if (transaction.status === "pending") return "text-yellow-400";
      if (transaction.status === "success") return "text-green-400";
      return "text-red-400";
    }
    return "text-slate-400";
  };

  const getAmountPrefix = () => {
    if (transaction.type === "add") return "+";
    if (transaction.type === "transfer")
      return transaction.fromId === currentUserId ? "-" : "+";
    return "";
  };

  const getDescription = () => {
    if (transaction.description?.trim()) return transaction.description;
    if (transaction.type === "add") return "Added Money";
    if (transaction.type === "transfer")
      return transaction.fromId === currentUserId
        ? "Sent Money"
        : "Received Money";
    if (transaction.type === "request") return "Money Request";
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
          {transaction.type === "add" && (
            <PlusCircle className="w-5 h-5 text-green-400" />
          )}
          {transaction.type === "transfer" &&
            (transaction.fromId === currentUserId ? (
              <ArrowUpRight className="w-5 h-5 text-red-400" />
            ) : (
              <ArrowDownLeft className="w-5 h-5 text-green-400" />
            ))}
          {transaction.type === "request" && (
            <Clock className="w-5 h-5 text-yellow-400" />
          )}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <p className="text-white font-medium">{getDescription()}</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span>{formattedDate}</span>
            {transaction.fromEmail && (
              <span>• from {transaction.fromEmail}</span>
            )}
            {transaction.toEmail && <span>• to {transaction.toEmail}</span>}
          </div>
        </div>
      </div>

      <div className="text-right flex flex-col items-end">
        <p className={`font-semibold ${getAmountColor()}`}>
          {getAmountPrefix()}₹{transaction.amount.toFixed(2)}
        </p>
        <p className="text-xs text-slate-500 capitalize">
          {transaction.status}
        </p>

        {/* --- Request Actions --- */}
        {transaction.type === "request" && transaction.status === "pending" && (
          <div className="flex gap-2 mt-1">
            {isIncomingRequest && (
              <>
                {onAccept && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-400 border-green-400"
                    onClick={() => onAccept(transaction.id)}
                  >
                    Accept
                  </Button>
                )}
                {onReject && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-400 border-red-400"
                    onClick={() => onReject(transaction.id)}
                  >
                    Reject
                  </Button>
                )}
              </>
            )}
            {isOutgoingRequest && onCancel && (
              <Button
                size="sm"
                variant="outline"
                className="text-red-400 border-red-400"
                onClick={() => onCancel(transaction.id)}
              >
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
