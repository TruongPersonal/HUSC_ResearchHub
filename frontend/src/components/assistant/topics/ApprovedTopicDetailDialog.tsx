import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ApprovedTopicResponse,
  ApprovedTopicDocumentResponse,
  ApprovedTopicStatus,
} from "@/features/topics/types";
import { approvedTopicService } from "@/features/topics/api/approved-topic.service";
import { Loader2, Pencil, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApprovedTopicDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: ApprovedTopicResponse | null;
  onSave?: () => void;
}

/**
 * Dialog hiển thị chi tiết Đề tài đã duyệt.
 * Hiển thị thông tin chung, danh sách sinh viên/giảng viên.
 * Hỗ trợ chỉnh sửa Mã đề tài, Giải thưởng.
 * Hiển thị danh sách tài liệu báo cáo nếu đề tài đã hoàn thành/bị huỷ.
 */
export function ApprovedTopicDetailDialog({
  open,
  onOpenChange,
  topic,
  onSave,
}: ApprovedTopicDetailDialogProps) {
  // Editable state
  const [editMode, setEditMode] = useState(false);
  const [code, setCode] = useState("");
  const [prize, setPrize] = useState("");
  const [fieldResearch, setFieldResearch] = useState("");
  const [typeResearch, setTypeResearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Document state (only for COMPLETED topics)
  const [documents, setDocuments] = useState<ApprovedTopicDocumentResponse[]>(
    [],
  );
  const [loadingDocs, setLoadingDocs] = useState(false);

  const fetchDocuments = async (id: number) => {
    setLoadingDocs(true);
    try {
      const docs = await approvedTopicService.getDocuments(id);
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to fetch documents", error);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleSave = async () => {
    if (!topic) return;
    setIsSaving(true);
    try {
      await approvedTopicService.update(topic.id, {
        code: code,
        prize: prize,
        fieldResearch: fieldResearch,
        typeResearch: typeResearch,
        status: topic.status,
      });

      toast.success("Cập nhật thông tin thành công");
      onSave?.();
      setEditMode(false);
    } catch (error: any) {
      console.error("Failed to update topic", error);
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (open && topic) {
      setEditMode(false);
      setCode(topic.code || "");
      setPrize(topic.prize || "");
      setFieldResearch(topic.fieldResearch || "");
      setTypeResearch(topic.typeResearch || "");

      if (
        topic.status === ApprovedTopicStatus.COMPLETED ||
        topic.status === ApprovedTopicStatus.CANCELED
      ) {
        fetchDocuments(topic.id);
      } else {
        setDocuments([]);
      }
    } else {
      setCode("");
      setPrize("");
      setFieldResearch("");
      setTypeResearch("");
      setEditMode(false);
      setDocuments([]);
    }
  }, [open, topic]);

  if (!topic) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết đề tài</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-bold text-[#0b57a8] leading-tight">
              {topic.topic.title}
            </h2>
            {!editMode &&
              topic.status !== ApprovedTopicStatus.CANCELED &&
              topic.topic.sessionStatus !== "COMPLETED" && (
                <Button
                  size="sm"
                  className="gap-1 shrink-0"
                  onClick={() => setEditMode(true)}
                >
                  <Pencil className="h-4 w-4" /> Chỉnh sửa
                </Button>
              )}
          </div>

          {/* Code & Prize Section */}
          {!editMode ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <DetailRow label="Mã đề tài">{topic.code || "—"}</DetailRow>
                <DetailRow label="Giải thưởng">{topic.prize || "—"}</DetailRow>
                <DetailRow label="Lĩnh vực">
                  {topic.fieldResearch || "—"}
                </DetailRow>
                <DetailRow label="Loại hình">
                  {topic.typeResearch || "—"}
                </DetailRow>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Field label="Lĩnh vực nghiên cứu">
                <Select
                  value={fieldResearch}
                  onValueChange={setFieldResearch}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Chọn lĩnh vực" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tự nhiên">Tự nhiên</SelectItem>
                    <SelectItem value="Xã hội Nhân văn">Xã hội Nhân văn</SelectItem>
                    <SelectItem value="Giáo dục">Giáo dục</SelectItem>
                    <SelectItem value="Kỹ thuật">Kỹ thuật</SelectItem>
                    <SelectItem value="Nông Lâm-Ngư">Nông Lâm-Ngư</SelectItem>
                    <SelectItem value="Y dược">Y dược</SelectItem>
                    <SelectItem value="Môi trường">Môi trường</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Loại hình nghiên cứu">
                <Select
                  value={typeResearch}
                  onValueChange={setTypeResearch}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Chọn loại hình" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                    <SelectItem value="Ứng dụng">Ứng dụng</SelectItem>
                    <SelectItem value="Triển khai">Triển khai</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Giải thưởng">
                <Input
                  value={prize}
                  onChange={(e) => setPrize(e.target.value)}
                  placeholder="Nhập giải thưởng..."
                  className="bg-white"
                />
              </Field>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setEditMode(false)}
                  disabled={isSaving}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          )}

          {/* Documents Section - Only for COMPLETED/CANCELLED topics and not in edit mode */}
          {(topic.status === ApprovedTopicStatus.COMPLETED ||
            topic.status === ApprovedTopicStatus.CANCELED) &&
            !editMode && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div className="font-medium text-gray-500">Tài liệu</div>
                  <div className="md:col-span-3 flex flex-col justify-center">
                    {loadingDocs ? (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Loader2 className="h-3 w-3 animate-spin" /> Đang tải...
                      </div>
                    ) : documents.length === 0 ? (
                      <div className="text-sm text-gray-500 italic">
                        Chưa có tài liệu báo cáo nào.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {documents.map((doc) => {
                          let typeLabel: string = doc.documentType;
                          switch (doc.documentType) {
                            case "MIDTERM_REPORT":
                              typeLabel = "Báo cáo giữa kỳ";
                              break;
                            case "SUMMARY_REPORT":
                              typeLabel = "Báo cáo tổng kết";
                              break;
                            case "SCIENTIFIC_ARTICLE":
                              typeLabel = "Bài báo khoa học";
                              break;
                            case "SCIENTIFIC_PRESENTATION":
                              typeLabel = "Thuyết trình khoa học";
                              break;
                          }

                          return (
                            <div
                              key={doc.id}
                              className="flex flex-col p-3 rounded-md border border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all gap-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <div className="h-8 w-8 rounded bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {typeLabel}
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                      {format(
                                        new Date(doc.uploadedAt),
                                        "dd/MM/yyyy HH:mm",
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  onClick={() =>
                                    window.open(
                                      `http://localhost:8080${doc.fileUrl}`,
                                      "_blank",
                                    )
                                  }
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>

                              {doc.scientificArticleSummary && (
                                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 mt-1">
                                  <span className="font-semibold">
                                    Tóm tắt:{" "}
                                  </span>
                                  {doc.scientificArticleSummary}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
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

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
      <div className="font-medium text-gray-500">{label}</div>
      <div className="md:col-span-3 text-gray-900 whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
}
