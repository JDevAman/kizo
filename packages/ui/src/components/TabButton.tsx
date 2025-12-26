import { TabButtonProps } from "../utils/utils.js";

export function TabButton({ tab, activeTab, onClick, label }: TabButtonProps) {
  return (
    <button
      onClick={() => onClick(tab)}
      className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
        activeTab === tab
          ? "bg-cyan-500/20 text-cyan-400"
          : "text-slate-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
