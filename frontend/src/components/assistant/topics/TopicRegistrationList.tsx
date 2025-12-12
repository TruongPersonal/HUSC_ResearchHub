import { Button } from "@/components/ui/button";
import {
  Settings2,
  Search,
  Calendar,
  User,
  GraduationCap,
  Clock,
  Users,
} from "lucide-react";
import { TopicRow } from "@/features/topics/types";
import { TopicStatusBadge, getTopicStatusConfig } from "./TopicStatusBadge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TopicRegistrationListProps {
  topics: TopicRow[];
  onOpenDetail: (topic: TopicRow) => void;
  onOpenAction: (topic: TopicRow) => void;
  onOpenMemberApproval?: (topic: TopicRow) => void;
  canApprove?: boolean;
}

/**
 * Danh sách Hồ sơ đề tài đăng ký (chưa được duyệt chính thức thành đề tài NCKH).
 * Hiển thị dạng thẻ (Card) với các trạng thái: Chờ duyệt, Cần bổ sung, Từ chối.
 */
export function TopicRegistrationList({
  topics,
  onOpenDetail,
  onOpenAction,
  onOpenMemberApproval,
  canApprove = true,
}: TopicRegistrationListProps) {
  if (topics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg bg-gray-50/50">
        <p>Chưa có hồ sơ nào.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {topics.map((t, index) => {
        const statusConfig = getTopicStatusConfig(t.status);
        return (
          <Card
            key={index}
            className={cn(
              "group relative overflow-hidden transition-all duration-200 hover:shadow-md border-gray-200 pl-1 cursor-pointer",
              statusConfig.borderColor.replace("border-l-", "border-l-[4px] "),
            )}
            onClick={() => onOpenDetail(t)}
          >
            <div className="px-4 flex flex-col gap-3">
              {/* Header: Title & Status */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-[#0b57a8] transition-colors">
                    {t.title}
                  </h3>
                  {t.short && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {t.short}
                    </p>
                  )}
                </div>
                <TopicStatusBadge status={t.status} />
              </div>

              {/* Info Rows */}
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                {/* Row 1: SV & GV */}
                {/* Row 1: Removed SV & GV as requested */}

                {/* Row 2: Dates & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-muted-foreground">
                    <div
                      className="flex items-center gap-2 min-w-[200px]"
                      title="Ngày đăng ký"
                    >
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>
                        {new Date(t.submittedAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>

                  {t.status !== "APPROVED" && t.status !== "REJECTED" && (
                    <div
                      className="flex justify-end gap-2 pt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 text-gray-600 hover:text-[#0b57a8] hover:bg-blue-50 border-dashed border-gray-300"
                        onClick={() =>
                          onOpenMemberApproval
                            ? onOpenMemberApproval(t)
                            : onOpenAction(t)
                        }
                      >
                        <Users className="h-4 w-4" />
                        Duyệt thành viên
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1.5 border-gray-300 shadow-sm hover:border-[#0b57a8] hover:text-[#0b57a8]"
                        onClick={() => onOpenAction(t)}
                        title="Thao tác"
                      >
                        <Settings2 className="h-4 w-4" />
                        Thao tác
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
