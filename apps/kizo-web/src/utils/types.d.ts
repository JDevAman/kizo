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
    amount: number;
    status: "pending" | "success" | "failed" | "rejected" | "cancelled";
    fromId?: string;
    toId?: string;
    fromEmail?: string;
    toEmail?: string;
    description?: string;
    relatedTransactionId?: string | null;
    initiatedById?: string | null;
    expiresAt?: string | null;
    createdAt: string;
    finalizedAt?: string | null;
}
export interface AuthenticatedLayoutProps {
    children: ReactNode;
}
export interface SidebarProps {
    mobileOpen?: boolean;
    setMobileOpen?: (open: boolean) => void;
}
//# sourceMappingURL=types.d.ts.map