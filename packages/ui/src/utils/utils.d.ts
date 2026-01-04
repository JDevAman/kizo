import { clsx } from "clsx";
import { JSX } from "react";
export declare function cn(...inputs: Parameters<typeof clsx>): string;
export interface TypographyProps {
  className?: string;
  children: React.ReactNode;
}
export interface SupportOption {
  icon: JSX.ElementType;
  title: string;
  description: string;
  availability: string;
  action: string;
  color: string;
}
//# sourceMappingURL=utils.d.ts.map
