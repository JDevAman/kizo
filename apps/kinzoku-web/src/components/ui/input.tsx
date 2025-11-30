import React, { forwardRef } from "react";
import { cn } from "../../utils/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            "w-full px-3 py-2 rounded-md border border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
