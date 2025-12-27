import { clsx } from "clsx";
import { JSX } from "react";

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

export interface SupportOption {
  icon: JSX.ElementType;
  title: string;
  description: string;
  availability: string;
  action: string;
  color: string;
}

