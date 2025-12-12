import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, BookOpen } from "lucide-react";
import { Noti } from "./AnnouncementDetailModal";

interface AnnouncementItemProps {
  notification: Noti;
  onClick: (n: Noti) => void;
}

const formatDate = (d: string | Date) => {
  const date = new Date(d);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function AnnouncementItem({
  notification,
  onClick,
}: AnnouncementItemProps) {
  return (
    <Card className="group relative overflow-hidden border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 bg-white">
      {/* Decorative gradient bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Left Content */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`
                                ${
                                  notification.category === "Cấp trường"
                                    ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                    : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                                }
                            `}
            >
              {notification.category}
            </Badge>
          </div>

          <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
            {notification.title}
          </h3>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto mt-1 md:mt-0">
          <Button
            variant="ghost"
            className="flex-1 md:flex-none text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            onClick={() => onClick(notification)}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Chi tiết
          </Button>
        </div>
      </div>
    </Card>
  );
}
