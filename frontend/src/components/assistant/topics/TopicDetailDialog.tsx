import { useState, useEffect } from "react";
import { toast } from "sonner";
import { topicService } from "@/features/topics/api/topic.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { TopicRow } from "@/features/topics/types";

interface TopicDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: TopicRow | null;
  onSave: (updatedTopic: TopicRow) => void;
}

/**
 * Dialog hiển thị chi tiết Hồ sơ đề tài đăng ký.
 * Hỗ trợ chỉnh sửa thông tin đề tài (Tên, Mục tiêu, Nội dung, Kinh phí...).
 */
export function TopicDetailDialog({
  open,
  onOpenChange,
  topic,
  onSave,
}: TopicDetailDialogProps) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<TopicRow>>({});

  useEffect(() => {
    if (open && topic) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditMode(false);
      setFormData({
        title: topic.title,
        short: topic.short || "",
        objective: topic.objective || "",
        content: topic.content || "",
        budget: topic.budget || "",
        note: topic.note || "",
      });
    }
  }, [open, topic]);

  if (!topic) return null;

  const handleSave = async () => {
    try {
      await topicService.update(topic.id, formData);
      toast.success("Cập nhật đề tài thành công");
      onSave({
        ...topic,
        ...formData,
      } as TopicRow);
      setEditMode(false);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết đề tài</DialogTitle>
        </DialogHeader>

        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="text-lg font-semibold text-[#0b57a8]">
            {topic.title}
          </div>
          {!editMode &&
            topic.status !== "REJECTED" &&
            topic.status !== "CANCELLED" &&
            topic.status !== "CANCELED" &&
            topic.approvedStatus !== "CANCELED" &&
            topic.approvedStatus !== "CANCELLED" &&
            topic.approvedStatus !== "COMPLETED" &&
            topic.sessionStatus !== "COMPLETED" && (
              <Button
                size="sm"
                className="gap-1 shrink-0"
                onClick={() => setEditMode(true)}
              >
                <Pencil className="h-4 w-4" /> Chỉnh sửa
              </Button>
            )}
        </div>

        {!editMode ? (
          <div className="space-y-4">
            <DetailRow label="Mô tả ngắn">{topic.short || "—"}</DetailRow>
            <DetailRow label="Mục tiêu">{topic.objective || "—"}</DetailRow>
            <DetailRow label="Nội dung">{topic.content || "—"}</DetailRow>
            <DetailRow label="Kinh phí">{topic.budget || "—"}</DetailRow>
            <DetailRow label="Ghi chú">{topic.note || "—"}</DetailRow>

            {/* Conditionally show Students and Lecturers for REJECTED or APPROVED topics */}
            {(topic.status === "REJECTED" || topic.status === "APPROVED") && (
              <>
                {/* Students Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div className="font-medium text-gray-500">Sinh viên</div>
                  <div className="md:col-span-3 space-y-1">
                    {topic.approvedMembers &&
                      topic.approvedMembers.length > 0 ? (
                      topic.approvedMembers.map((student) => (
                        <div key={student.id} className="text-gray-900">
                          {student.name}
                          {student.id === topic.studentLeaderId && (
                            <span className="text-blue-600 font-medium ml-2">
                              (Chủ nhiệm)
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 italic">
                        Chưa có sinh viên thực hiện
                      </div>
                    )}
                  </div>
                </div>

                {/* Lecturers Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div className="font-medium text-gray-500">Giảng viên</div>
                  <div className="md:col-span-3 space-y-1">
                    {topic.advisors && topic.advisors.length > 0 ? (
                      topic.advisors.map((advisor) => (
                        <div key={advisor.id} className="text-gray-900">
                          {advisor.name}
                        </div>
                      ))
                    ) : // Fallback to advisorName if advisors list is empty
                      topic.advisor ? (
                        <div className="text-gray-900">{topic.advisor}</div>
                      ) : (
                        <div className="text-gray-500 italic">
                          Chưa có giảng viên hướng dẫn
                        </div>
                      )}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Field label="Tên đề tài">
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </Field>
            <Field label="Mô tả ngắn">
              <Textarea
                className="min-h-[80px]"
                value={formData.short}
                onChange={(e) =>
                  setFormData({ ...formData, short: e.target.value })
                }
              />
            </Field>
            <Field label="Mục tiêu">
              <Textarea
                className="min-h-[100px]"
                value={formData.objective}
                onChange={(e) =>
                  setFormData({ ...formData, objective: e.target.value })
                }
              />
            </Field>
            <Field label="Nội dung">
              <Textarea
                className="min-h-[120px]"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </Field>
            <Field label="Kinh phí">
              <Input
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
              />
            </Field>
            <Field label="Ghi chú">
              <Textarea
                className="min-h-[80px]"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
              />
            </Field>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setEditMode(false)}>
                Hủy
              </Button>
              <Button onClick={handleSave}>Lưu thay đổi</Button>
            </div>
          </div>
        )}
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
