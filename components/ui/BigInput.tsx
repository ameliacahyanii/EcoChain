import React from "react";

export interface BigInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const BigInput = React.forwardRef<HTMLInputElement, BigInputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = "", id, ...props }, ref) => {
    const inputId = id || `big-input-${label.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="flex flex-col gap-2 w-full">
        {/* Label di atas input */}
        <label htmlFor={inputId} className="text-sm font-bold text-slate-800 font-heading">
          {label}
        </label>

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-4 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={`w-full min-h-[50px] px-4.5 ${leftIcon ? "pl-12" : ""} ${
              rightIcon ? "pr-12" : ""
            } bg-slate-50/80 text-slate-900 text-base font-medium rounded-xl border ${
              error
                ? "border-red-400 focus:ring-red-500/15 focus:border-red-500 bg-red-50/20"
                : "border-slate-200 focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 focus:bg-white"
            } focus:outline-none transition-all duration-200 placeholder:text-slate-400 disabled:bg-slate-100 disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-4 flex items-center text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs font-semibold text-red-600 mt-0.5" role="alert">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>
        )}
      </div>
    );
  }
);

BigInput.displayName = "BigInput";

export default BigInput;
