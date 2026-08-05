import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "accent";
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  isLoading = false,
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold text-base rounded-[14px] transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px] px-6 py-3 select-none active:scale-[0.98] hover:scale-[1.01]";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 focus:ring-emerald-500/20 shadow-md shadow-emerald-500/20",
    secondary:
      "bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-700 hover:to-teal-600 focus:ring-teal-500/20 shadow-md shadow-teal-500/20",
    outline:
      "bg-white/90 text-slate-800 border-2 border-slate-200 hover:bg-slate-50 hover:border-emerald-500 hover:text-emerald-600 focus:ring-emerald-500/10 shadow-xs",
    danger:
      "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 focus:ring-red-500/20 shadow-md shadow-red-500/20",
    accent:
      "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 hover:from-amber-600 hover:to-amber-500 focus:ring-amber-500/20 shadow-md shadow-amber-500/25 font-extrabold",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-current" />
          <span>Memuat...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
