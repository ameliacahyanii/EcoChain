import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  bordered = true,
  glass = false,
  ...props
}) => {
  const borderStyle = bordered ? "border border-slate-200/80" : "";
  const glassStyle = glass
    ? "bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50"
    : "bg-white shadow-lg shadow-slate-200/40";

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl p-5 sm:p-7 transition-all duration-200 ${glassStyle} ${borderStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
