import { JSX, ReactNode } from "react";

export interface FAQ {
  category: string;
  question: string;
  answer: string;
}

export interface Category {
  id: string;
  label: string;
  icon: JSX.ElementType;
}

export interface SupportOption {
  icon: JSX.ElementType;
  title: string;
  description: string;
  availability: string;
  action: string;
  color: string;
}

export interface MoneyFlow {
  id: string;
  type: "transfer" | "request" | "add" | "refund";
  amount: number; // in paise
  status: "pending" | "success" | "failed" | "rejected" | "cancelled";
  fromId?: string; // MongoDB _id of sender
  toId?: string; // MongoDB _id of recipient
  fromEmail?: string;
  toEmail?: string;
  description?: string;
  relatedTransactionId?: string | null; // for refunds or linked transactions
  initiatedById?: string | null; // who initiated (admin/refund)
  expiresAt?: string | null; // ISO string
  createdAt: string; // ISO string
  finalizedAt?: string | null; // ISO string
}

export interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}
