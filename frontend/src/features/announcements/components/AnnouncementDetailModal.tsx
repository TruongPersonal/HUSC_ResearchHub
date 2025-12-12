import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

export type Noti = {
  id: number;
  title: string;
  content: string;
  publishDatetime: string | Date;
  category?: string;
};

interface AnnouncementDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification: Noti | null;
}

const formatVN = (d: string | Date) =>
  new Date(d).toLocaleString("vi-VN", {
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export function AnnouncementDetailModal({
  open,
  onOpenChange,
  notification,
}: AnnouncementDetailModalProps) {
  if (!notification) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl [&>button]:hidden">
        {/* Decorative Header Background */}
        <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600 relative">
          <div className="absolute -bottom-8 left-8">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl">
              📢
            </div>
          </div>
        </div>

        <div className="px-8 pt-12 pb-8">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatVN(notification.publishDatetime).split(" ")[1]}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatVN(notification.publishDatetime).split(" ")[0]}
              </span>
            </div>

            <DialogTitle className="text-2xl font-bold leading-tight text-gray-900">
              {notification.title}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
              {notification.content}
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2 bg-gray-50/50 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-200"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
