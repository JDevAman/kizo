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
export type StatItem = {
    title: string;
    value: number;
    color: "red" | "green" | "blue" | "neutral";
};
export interface AuthenticatedLayoutProps {
    children: ReactNode;
}
export interface SidebarProps {
    mobileOpen?: boolean;
    setMobileOpen?: (open: boolean) => void;
}
//# sourceMappingURL=types.d.ts.map