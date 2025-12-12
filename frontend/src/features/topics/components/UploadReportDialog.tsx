import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { approvedTopicService } from "@/features/topics/api/approved-topic.service";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

interface UploadReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicId: number;
  reportType: { id: string; label: string } | null;
  initialSummary?: string;
  onSuccess: () => void;
}

/**
 * Dialog upload báo cáo tiến độ hoặc bài báo khoa học.
 * Hỗ trợ chọn file và nhập tóm tắt (đối với bài báo).
 */
export function UploadReportDialog({
  open,
  onOpenChange,
  topicId,
  reportType,
  initialSummary,
  onSuccess,
}: UploadReportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setSummary(initialSummary || "");
      setFile(null); // Reset file on open
    }
  }, [open, initialSummary]);

  if (!reportType) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !reportType) {
      toast.error("Vui lòng chọn file báo cáo");
      return;
    }

    if (reportType.id === "SCIENTIFIC_ARTICLE" && !summary.trim()) {
      toast.error("Vui lòng nhập tóm tắt bài báo");
      return;
    }

    setUploading(true);
    try {
      await approvedTopicService.uploadDocument(
        topicId,
        file,
        reportType.id,
        summary,
      );
      toast.success("Upload thành công!");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      const msg = (error as any)?.response?.data?.message || "Upload thất bại";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const isScientificArticle = reportType.id === "SCIENTIFIC_ARTICLE";
  const isPresentation = reportType.id === "SCIENTIFIC_PRESENTATION";

  // File accepts
  // Presentation: pptx, ppt
  // Others: docx, doc
  const accept = isPresentation
    ? ".pptx, .ppt, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-powerpoint"
    : ".docx, .doc, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nộp {reportType.label}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Chọn file ({isPresentation ? "PowerPoint" : "Word"})
            </label>
            <div className="flex items-center gap-3 mt-1.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0"
              >
                <Upload className="w-4 h-4 mr-2" />
                Chọn file
              </Button>
              <span className="text-sm text-gray-500 truncate max-w-[200px]">
                {file ? file.name : "Chưa có tệp nào được chọn"}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-2">
              Định dạng cho phép:{" "}
              {isPresentation ? ".pptx, .ppt" : ".docx, .doc"}
            </p>
          </div>

          {isScientificArticle && (
            <div className="space-y-2">
              <Label>
                Tóm tắt bài báo <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Nhập tóm tắt nội dung bài báo..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleUpload} disabled={uploading || !file}>
            {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {uploading ? "Đang tải lên..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
