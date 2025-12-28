export type Tab = "signin" | "signup";

export interface TabButtonProps {
  tab: Tab;
  activeTab: Tab;
  onClick: () => void;
  label: string;
  className?: string;
}

export function TabButton({
  tab,
  activeTab,
  onClick,
  label,
  className = "",
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`py-3 px-4 rounded-md text-sm font-medium transition-colors
        ${
          activeTab === tab
            ? "bg-cyan-500/20 text-cyan-400"
            : "text-slate-400 hover:text-white"
        }
        ${className}
      `}
    >
      {label}
    </button>
  );
}
