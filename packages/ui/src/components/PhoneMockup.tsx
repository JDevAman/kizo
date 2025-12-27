import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Coffee,
  ShoppingBag,
} from "lucide-react";

export function PhoneMockup() {
  return (
    <div className="hidden lg:flex justify-center items-center relative">
      <div className="absolute w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px]" />

      <div className="relative w-[300px] h-[600px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20" />

        <div className="h-full w-full bg-[#0a0a0c] p-6 pt-12 flex flex-col gap-6">
          <Header />
          <WalletList />
          <TransactionList />
          <TabBar />
        </div>
      </div>
    </div>
  );
}

/* ----- Internal helpers (keep here) ----- */

function Header() {
  return (
    <div className="flex justify-between items-center text-white">
      <span className="text-sm font-semibold">Wallets</span>
      <Wallet className="w-5 h-5 text-cyan-400" />
    </div>
  );
}

function WalletList() {
  return (
    <div className="space-y-3">
      <CardItem
        name="Personal Wallet"
        balance="$19,420.00"
        color="bg-cyan-500"
      />
      <CardItem name="Business" balance="$3,120.50" color="bg-blue-600" />
    </div>
  );
}

function TransactionList() {
  return (
    <div className="mt-4 flex flex-col flex-1">
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
        Recent Transactions
      </h3>
      <div className="space-y-5">
        <Transaction
          icon={<Coffee className="w-4 h-4" />}
          title="Coffee Shop"
          date="Today"
          amount="-$4.50"
        />
        <Transaction
          icon={<ArrowDownLeft className="w-4 h-4 text-emerald-400" />}
          title="Payment Received"
          date="Yesterday"
          amount="+$120.00"
          trend="up"
        />
        <Transaction
          icon={<ShoppingBag className="w-4 h-4" />}
          title="Online Store"
          date="Dec 24"
          amount="-$84.99"
        />
        <Transaction
          icon={<ArrowUpRight className="w-4 h-4 text-slate-400" />}
          title="Transfer"
          date="Dec 22"
          amount="-$10.00"
        />
      </div>
    </div>
  );
}

function TabBar() {
  return (
    <div className="mt-auto flex justify-around border-t border-white/5 pt-4">
      <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
        <div className="w-2 h-2 bg-cyan-400 rounded-full" />
      </div>
      <div className="w-2 h-2 bg-slate-700 rounded-full mt-3" />
      <div className="w-2 h-2 bg-slate-700 rounded-full mt-3" />
    </div>
  );
}

function CardItem({
  name,
  balance,
  color,
}: {
  name: string;
  balance: string;
  color: string;
}) {
  return (
    <div className="bg-slate-800/50 border border-white/5 p-4 rounded-2xl flex justify-between items-center">
      <div>
        <p className="text-[10px] text-slate-400">{name}</p>
        <p className="text-white font-medium">{balance}</p>
      </div>
      <div className={`w-10 h-6 ${color} rounded-md opacity-80`} />
    </div>
  );
}

function Transaction({
  icon,
  title,
  date,
  amount,
  trend = "down",
}: {
  icon: React.ReactNode;
  title: string;
  date: string;
  amount: string;
  trend?: "up" | "down";
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
          {icon}
        </div>
        <div>
          <p className="text-sm text-white font-light">{title}</p>
          <p className="text-[10px] text-slate-500">{date}</p>
        </div>
      </div>
      <span
        className={`text-sm ${trend === "up" ? "text-emerald-400" : "text-white"}`}
      >
        {amount}
      </span>
    </div>
  );
}
