import * as React from "react";
import { cn } from "@/lib/utils";

export interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg";
}

const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "relative inline-flex items-center justify-center px-4 py-2 font-mono text-sm font-medium transition-colors",
          "before:absolute before:inset-0 before:border before:border-current before:transition-all",
          "hover:before:-inset-1 hover:before:border-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          {
            "text-cyan-400 hover:text-cyan-300 before:border-cyan-400":
              variant === "primary",
            "text-purple-400 hover:text-purple-300 before:border-purple-400":
              variant === "secondary",
            "text-red-400 hover:text-red-300 before:border-red-400":
              variant === "destructive",
            "text-sm px-3 py-1": size === "sm",
            "text-lg px-6 py-3": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
CyberButton.displayName = "CyberButton";

export { CyberButton };
