import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  ApprovedTopicResponse,
  ApprovedTopicStatus,
} from "@/features/topics/types";
import { toast } from "sonner";
import { approvedTopicService } from "@/features/topics/api/approved-topic.service";
import { Input } from "@/components/ui/input";
import { X, Check } from "lucide-react";

interface ApprovedTopicActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: ApprovedTopicResponse | null;
  onSuccess: () => void;
}

/**
 * Dialog thao tác với Đề tài đã duyệt.
 * Hỗ trợ các hành động: Cập nhật thông tin (Lĩnh vực, Loại hình), Đánh dấu hoàn thành, Huỷ đề tài.
 */
export function ApprovedTopicActionDialog({
  open,
  onOpenChange,
  topic,
  onSuccess,
}: ApprovedTopicActionDialogProps) {
  const [formData, setFormData] = useState<{
    code: string;
    prize: string;
    fieldResearch: string;
    typeResearch: string;
    status: ApprovedTopicStatus;
  }>({
    code: "",
    prize: "",
    fieldResearch: "",
    typeResearch: "",
    status: ApprovedTopicStatus.IN_PROGRESS,
  });

  useEffect(() => {
    if (open && topic) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        code: topic.code || "",
        prize: topic.prize || "",
        fieldResearch: topic.fieldResearch || "",
        typeResearch: topic.typeResearch || "",
        status: topic.status,
      });
    }
  }, [open, topic]);

  if (!topic) return null;

  const handleSave = async () => {
    try {
      await approvedTopicService.update(topic.id, formData);
      toast.success("Cập nhật đề tài thành công");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật");
    }
  };

  const handleCancelTopic = async () => {
    try {
      await approvedTopicService.update(topic.id, {
        ...formData,
        status: ApprovedTopicStatus.CANCELED,
      });
      toast.success("Đã huỷ đề tài");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi huỷ đề tài");
    }
  };

  const handleCompleteTopic = async () => {
    // Validation
    if (!formData.code?.trim()) {
      toast.error("Vui lòng nhập Mã đề tài");
      return;
    }

    try {
      await approvedTopicService.update(topic.id, {
        ...formData,
        status: ApprovedTopicStatus.COMPLETED,
      });
      toast.success("Đã đánh dấu hoàn thành đề tài");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Thao tác đề tài</DialogTitle>
        </DialogHeader>

        <div className="mb-4 text-lg font-semibold text-[#0b57a8]">
          {topic.topic.title}
        </div>

        <div className="space-y-6 pb-4">
          <Field label="Mã đề tài *">
            <Input
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="Nhập mã đề tài..."
              autoFocus
            />
          </Field>

          <Field label="Trạng thái">
            <Select
              value={formData.status}
              onValueChange={(v) =>
                setFormData({ ...formData, status: v as ApprovedTopicStatus })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN_PROGRESS">Đang thực hiện</SelectItem>
                <SelectItem value="NOT_COMPLETED">Không hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="flex gap-2">
            {topic.topic.sessionStatus !== "UNDER_REVIEW" && (
              <>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                  onClick={handleCompleteTopic}
                >
                  <Check className="h-4 w-4" />
                  Xong
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelTopic}
                  className="gap-1"
                >
                  <X className="h-4 w-4" />
                  Bị huỷ
                </Button>
              </>
            )}
          </div>
          <Button onClick={handleSave}>Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-sm font-medium text-gray-700">{label}</div>
      {children}
    </div>
  );
}
