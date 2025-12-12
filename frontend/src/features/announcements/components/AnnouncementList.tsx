import { Noti } from "./AnnouncementDetailModal";
import { AnnouncementItem } from "./AnnouncementItem";
import { Card, CardContent } from "@/components/ui/card";
import { BellOff } from "lucide-react";

interface AnnouncementListProps {
  data: Noti[];
  onItemClick: (n: Noti) => void;
}

export function AnnouncementList({ data, onItemClick }: AnnouncementListProps) {
  if (data.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50 shadow-none">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
            <BellOff className="w-8 h-8 text-gray-300" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Chưa có thông báo nào
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Hiện tại chưa có thông báo mới.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {data.map((item) => (
        <AnnouncementItem
          key={item.id}
          notification={item}
          onClick={onItemClick}
        />
      ))}
    </div>
  );
}
