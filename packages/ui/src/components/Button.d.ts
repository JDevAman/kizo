import { type ButtonHTMLAttributes } from "react";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "glow" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}
export declare const Button: import("react").ForwardRefExoticComponent<
  ButtonProps & import("react").RefAttributes<HTMLButtonElement>
>;
export {};
//# sourceMappingURL=Button.d.ts.map
