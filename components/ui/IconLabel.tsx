import React from "react";
import { LucideIcon } from "lucide-react";

export interface IconLabelProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badgeCount?: number;
  className?: string;
  disabled?: boolean;
}

export const IconLabel: React.FC<IconLabelProps> = ({
  icon: Icon,
  label,
  active = false,
  onClick,
  badgeCount,
  className = "",
  disabled = false,
}) => {
  const activeClass = active
    ? "text-[#16A34A] font-bold"
    : "text-[#4B5563] hover:text-[#16A34A]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`min-h-[48px] min-w-[48px] px-3 py-2 flex flex-col items-center justify-center gap-1 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed ${activeClass} ${className}`}
      aria-label={label}
    >
      <div className="relative flex items-center justify-center min-h-[24px] min-w-[24px]">
        <Icon className={`w-6 h-6 ${active ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
        {typeof badgeCount === "number" && badgeCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-[#DC2626] text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        )}
      </div>
      <span className="text-xs sm:text-sm font-semibold tracking-tight text-center leading-tight">
        {label}
      </span>
    </button>
  );
};

export default IconLabel;
