import React, { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../utils/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "glow" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "md", disabled, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200";

    const sizeStyles =
      size === "sm"
        ? "px-3 py-1.5 text-sm"
        : size === "lg"
        ? "px-6 py-3 text-base"
        : "px-4 py-2 text-sm";

    const variantStyles = (() => {
      if (disabled) {
        switch (variant) {
          case "glow":
            return "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-50";
          case "outline":
            return "border border-slate-700 text-slate-500 cursor-not-allowed opacity-50";
          case "ghost":
            return "text-slate-500 cursor-not-allowed opacity-50";
          default:
            return "bg-slate-700 text-slate-400 cursor-not-allowed opacity-50";
        }
      }

      // Normal active variants
      switch (variant) {
        case "glow":
          return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25";
        case "outline":
          return "border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white";
        case "ghost":
          return "text-slate-400 hover:text-white hover:bg-slate-800";
        default:
          return "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700";
      }
    })();

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, sizeStyles, variantStyles, className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
