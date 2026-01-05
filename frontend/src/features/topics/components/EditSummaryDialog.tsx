import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { approvedTopicService } from "@/features/topics/api/approved-topic.service";

interface EditSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: number;
  initialSummary: string;
  onSuccess: () => void;
}

/**
 * Dialog chỉnh sửa tóm tắt bài báo khoa học.
 */
export function EditSummaryDialog({
  open,
  onOpenChange,
  documentId,
  initialSummary,
  onSuccess,
}: EditSummaryDialogProps) {
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setSummary(initialSummary || "");
    }
  }, [open, initialSummary]);

  const handleSave = async () => {
    if (!summary.trim()) {
      toast.error("Vui lòng nhập tóm tắt nội dung");
      return;
    }

    setLoading(true);
    try {
      await approvedTopicService.updateDocumentSummary(documentId, summary);
      toast.success("Cập nhật tóm tắt thành công");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa tóm tắt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <span className="text-sm font-medium">
              Tóm tắt bài báo <span className="text-red-500">*</span>
            </span>
            <Textarea
              placeholder="Nhập tóm tắt nội dung bài báo..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={6}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
