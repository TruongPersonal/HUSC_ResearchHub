import { Badge } from "@/components/ui/badge";
import { TopicStatus } from "@/features/topics/types";

export const getTopicStatusConfig = (s: TopicStatus) => {
  switch (s) {
    case "PENDING":
      return {
        label: "Chờ duyệt",
        className:
          "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50",
        borderColor: "border-l-amber-500",
      };
    case "NEEDS_UPDATE":
      return {
        label: "Cần bổ sung",
        className: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50",
        borderColor: "border-l-blue-500",
      };
    case "REJECTED":
      return {
        label: "Từ chối",
        className: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-50",
        borderColor: "border-l-rose-500",
      };
    case "APPROVED":
      return {
        label: "Đã duyệt",
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
        borderColor: "border-l-emerald-500",
      };
    default:
      return {
        label: "Không xác định",
        className: "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-50",
        borderColor: "border-l-gray-300",
      };
  }
};

interface TopicStatusBadgeProps {
  status: TopicStatus;
}

/**
 * Badge hiển thị trạng thái của Hồ sơ đề tài (Chờ duyệt, Cần bổ sung, Từ chối, Đã duyệt).
 */
export function TopicStatusBadge({ status }: TopicStatusBadgeProps) {
  const config = getTopicStatusConfig(status);

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
