import React from "react";
import { cn } from "../../utils/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface AvatarImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {}
export interface AvatarFallbackProps
  extends React.HTMLAttributes<HTMLDivElement> {}

// Root container
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-800",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Avatar.displayName = "Avatar";

// Image
export const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, ...props }, ref) => (
    <img
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      {...props}
    />
  )
);
AvatarImage.displayName = "AvatarImage";

// Fallback
export const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  AvatarFallbackProps
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-slate-700 text-white font-semibold",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
AvatarFallback.displayName = "AvatarFallback";
