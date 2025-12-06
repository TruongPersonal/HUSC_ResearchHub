import { Badge } from "@/components/ui/badge"
import { AcademicYearStatus } from "@/features/academic-year/types"

interface StatusBadgeProps {
    status: AcademicYearStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const isStart = status === "START"
    return (
        <Badge
            variant={isStart ? "default" : "secondary"}
            className={isStart ? "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200" : "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200"}
        >
            {isStart ? "Bắt đầu" : "Kết thúc"}
        </Badge>
    )
}

export function ActiveBadge({ isActive }: { isActive: boolean }) {
    return (
        <Badge
            variant="outline"
            className={isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-neutral-100 text-neutral-500 border-neutral-200"}
        >
            {isActive ? "Đang bật" : "Đã tắt"}
        </Badge>
    )
}
