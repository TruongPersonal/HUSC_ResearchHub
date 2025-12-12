import { Topic } from "@/features/topics/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  User,
  Calendar,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

interface TopicCardProps {
  topic: Topic;
  onViewDetails: (topic: Topic) => void;
  onRegister: (topic: Topic) => void;
  isSessionOpen: boolean;
  showAction?: boolean;
}

/**
 * Card hiển thị thông tin tóm tắt của đề tài.
 * Dùng trong danh sách đề tài đăng ký.
 */
export function TopicCard({
  topic,
  onViewDetails,
  onRegister,
  isSessionOpen,
  showAction = true,
}: TopicCardProps) {
  const canRegister = isSessionOpen;

  return (
    <Card className="group relative overflow-hidden border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 bg-white">
      {/* Decorative gradient bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Left Content */}
        <div className="flex-1 space-y-3">
          <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
            {topic.name}
          </h3>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-500 pt-1">
              <Calendar className="w-4 h-4" />
              <span>{topic.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
          <Button
            variant="ghost"
            className="flex-1 md:flex-none text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            onClick={() => onViewDetails(topic)}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Chi tiết
          </Button>
          {isSessionOpen && showAction && (
            <Button
              className={`flex-1 md:flex-none min-w-[140px] ${topic.isApproved
                  ? "bg-green-100 text-green-700 hover:bg-green-200 cursor-not-allowed" // Approved
                  : topic.isPending
                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 cursor-not-allowed" // Pending
                    : topic.isRejected
                      ? "bg-gray-100 text-gray-400 hover:bg-gray-200 cursor-not-allowed" // Rejected (Disabled)
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 shadow-md" // Default
                }`}
              onClick={() =>
                !topic.isApproved &&
                !topic.isPending &&
                !topic.isRejected &&
                onRegister(topic)
              }
              disabled={
                !!topic.isApproved || !!topic.isPending || !!topic.isRejected
              }
            >
              {topic.isApproved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Đã đăng ký
                </>
              ) : topic.isPending ? (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Đang chờ duyệt
                </>
              ) : topic.isRejected ? (
                <>
                  Đăng ký
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Đăng ký
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
