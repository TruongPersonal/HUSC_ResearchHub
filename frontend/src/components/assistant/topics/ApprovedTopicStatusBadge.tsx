import { Badge } from "@/components/ui/badge";
import { ApprovedTopicStatus } from "@/features/topics/types";

interface ApprovedTopicStatusBadgeProps {
    status: ApprovedTopicStatus;
}

export const getApprovedTopicStatusConfig = (status: ApprovedTopicStatus) => {
    switch (status) {
        case ApprovedTopicStatus.IN_PROGRESS:
            return {
                label: "Đang thực hiện",
                className: "bg-blue-50 text-blue-700 border-blue-200",
                borderColor: "border-l-blue-500"
            };
        case ApprovedTopicStatus.COMPLETED:
            return {
                label: "Hoàn thành",
                className: "bg-emerald-50 text-emerald-700 border-emerald-200",
                borderColor: "border-l-emerald-500"
            };
        case ApprovedTopicStatus.NOT_COMPLETED:
            return {
                label: "Không hoàn thành",
                className: "bg-orange-50 text-orange-700 border-orange-200",
                borderColor: "border-l-orange-500"
            };
        case ApprovedTopicStatus.CANCELED:
            return {
                label: "Đã hủy",
                className: "bg-red-50 text-red-700 border-red-200",
                borderColor: "border-l-red-500"
            };
        default:
            return {
                label: "Không xác định",
                className: "bg-gray-100 text-gray-700 border-gray-200",
                borderColor: "border-l-gray-500"
            };
    }
};

export function ApprovedTopicStatusBadge({ status }: ApprovedTopicStatusBadgeProps) {
    const config = getApprovedTopicStatusConfig(status);

    return (
        <Badge variant="outline" className={`py-1 px-2.5 ${config.className}`}>
            <span className="font-medium">{config.label}</span>
        </Badge>
    );
}
