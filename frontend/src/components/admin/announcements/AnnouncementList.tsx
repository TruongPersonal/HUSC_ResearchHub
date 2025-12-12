"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Announcement } from "@/features/announcements/types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";

interface AnnouncementListProps {
  data: Announcement[];
  onEdit?: (announcement: Announcement) => void;
  onDelete?: (announcement: Announcement) => void;
}

/**
 * Danh sách Thông báo dạng thẻ (Card List).
 * Thường dùng cho trang chủ sinh viên hoặc giảng viên.
 */
export function AnnouncementList({
  data,
  onEdit,
  onDelete,
}: AnnouncementListProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg bg-gray-50/50">
        <p>Chưa có thông báo nào.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((item) => (
        <Card
          key={item.id}
          className="group hover:shadow-md transition-all border-gray-200"
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                {item.title}
              </CardTitle>
              {(onEdit || onDelete) && (
                <div className="flex gap-1">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                      className="h-8 w-8 -mt-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item)}
                      className="h-8 w-8 -mt-1 text-gray-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
              <CalendarDays className="h-3 w-3" />
              {item.publishDatetime
                ? format(
                  new Date(item.publishDatetime),
                  "dd 'tháng' MM, yyyy 'lúc' HH:mm",
                  { locale: vi },
                )
                : "Chưa xuất bản"}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-3 leading-relaxed">
              {item.content}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
