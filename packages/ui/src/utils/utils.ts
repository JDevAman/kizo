import { clsx } from "clsx";

export function cn(...inputs: Parameters<typeof clsx>) {
  return clsx(...inputs);
}

export interface TypographyProps {
  className?: string;
  children: React.ReactNode;
}

type Tab = "signin" | "signup";

export interface TabButtonProps {
  tab: Tab;
  activeTab: Tab;
  onClick: (tab: Tab) => void;
  label: string;
}
