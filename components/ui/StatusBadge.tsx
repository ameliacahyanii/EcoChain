import React from "react";
import { Clock, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

export type TransactionStatus = "Menunggu" | "Diproses" | "Selesai" | "Dibatalkan" | string;

export interface StatusBadgeProps {
  status: TransactionStatus;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
  showIcon = true,
}) => {
  const getBadgeConfig = (statusStr: string) => {
    switch (statusStr.toLowerCase()) {
      case "menunggu":
      case "pending":
        return {
          bg: "bg-[#FEF3C7]",
          text: "text-[#92400E]",
          border: "border-[#FCD34D]",
          icon: Clock,
          label: "Menunggu",
        };
      case "diproses":
      case "processing":
      case "in_progress":
        return {
          bg: "bg-[#CCFBF1]",
          text: "text-[#115E59]",
          border: "border-[#99F6E4]",
          icon: RefreshCw,
          label: "Diproses",
        };
      case "selesai":
      case "completed":
        return {
          bg: "bg-[#DCFCE7]",
          text: "text-[#166534]",
          border: "border-[#86EFAC]",
          icon: CheckCircle2,
          label: "Selesai",
        };
      case "dibatalkan":
      case "cancelled":
      case "canceled":
        return {
          bg: "bg-[#FEE2E2]",
          text: "text-[#991B1B]",
          border: "border-[#FCA5A5]",
          icon: XCircle,
          label: "Dibatalkan",
        };
      default:
        return {
          bg: "bg-[#F3F4F6]",
          text: "text-[#374151]",
          border: "border-[#E5E7EB]",
          icon: Clock,
          label: statusStr,
        };
    }
  };

  const config = getBadgeConfig(status);
  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {showIcon && <IconComponent className="w-4 h-4 shrink-0 stroke-[2.5px]" />}
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
