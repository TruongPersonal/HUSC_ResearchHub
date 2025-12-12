import { Badge } from "@/components/ui/badge";
import { ProposalStatus, TopicStatus } from "@/features/topics/types";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  PlayCircle,
  StopCircle,
  AlertTriangle,
} from "lucide-react";

interface StatusBadgeProps {
  status: ProposalStatus | TopicStatus;
  className?: string; // Add optional className
}

/**
 * Badge hiển thị trạng thái của đề tài hoặc đề xuất.
 * Tự động chọn màu sắc và icon phù hợp với trạng thái.
 */
export function StatusBadge({
  status,
  className: externalClassName,
}: StatusBadgeProps) {
  const config: Record<
    string,
    { label: string; className: string; icon: any }
  > = {
    // ... (existing config - no changes needed inside)
    // Check if config needs to be redeclared to avoid overwrite or just keep it simple
    // Actually, just changing the props and the return relies on the existing config constant logic.
    // Wait, I cannot use '...' to skip lines in replace_file_content clearly without context.
    // I will replace the start (interface) and the end (return) separately or just rewrite the component signature and return if short enough.
    // The file is short enough, but let's target specific blocks.
    // Proposal Statuses
    PENDING: {
      label: "Chờ duyệt",
      className:
        "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200",
      icon: Clock,
    },
    NEEDS_UPDATE: {
      label: "Cần bổ sung",
      className: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
      icon: AlertCircle,
    },
    REJECTED: {
      label: "Từ chối",
      className: "bg-red-50 text-red-700 hover:bg-red-100 border-red-200",
      icon: XCircle,
    },
    APPROVED: {
      label: "Đã duyệt",
      className:
        "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
      icon: CheckCircle2,
    },

    // Topic Statuses
    IN_PROGRESS: {
      label: "Đang thực hiện",
      className: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
      icon: PlayCircle,
    },
    COMPLETED: {
      label: "Hoàn thành",
      className:
        "bg-green-50 text-green-700 hover:bg-green-100 border-green-200",
      icon: CheckCircle2,
    },
    NOT_COMPLETED: {
      label: "Không hoàn thành",
      className:
        "bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200",
      icon: AlertTriangle,
    },
    CANCELLED: {
      label: "Đã huỷ",
      className: "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200",
      icon: StopCircle,
    },
    CANCELED: {
      label: "Đã huỷ",
      className: "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200",
      icon: StopCircle,
    },
  };

  const {
    label,
    className,
    icon: Icon,
  } = config[status] || {
    label: status,
    className: "bg-gray-100 text-gray-700",
    icon: Clock,
  };

  return (
    <Badge
      variant="outline"
      className={`${className} ${externalClassName || ""} gap-1.5 py-1 px-2.5`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </Badge>
  );
}
