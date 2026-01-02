import { ListTransaction } from "@kizo/shared";
interface TransactionRowProps {
  transaction: ListTransaction;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
}
export declare function TransactionRow({
  transaction,
}: TransactionRowProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=transactionRow.d.ts.map
