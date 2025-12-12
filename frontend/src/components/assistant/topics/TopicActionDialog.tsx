import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { TopicRow, TopicStatus } from "@/features/topics/types";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { topicService } from "@/features/topics/api/topic.service";
import { useAcademicYear } from "@/contexts/AcademicYearContext";
import { userService } from "@/features/users/api/user.service";

interface TopicActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: TopicRow | null;
  onSuccess: () => void;
  departmentId?: number;
  canApprove?: boolean;
}

/**
 * Dialog xét duyệt/thao tác với Hồ sơ đề tài mới đăng ký.
 * Hỗ trợ các hành động: Duyệt (Assign GVHD & Leader), Yêu cầu bổ sung, Từ chối.
 */
export function TopicActionDialog({
  open,
  onOpenChange,
  topic,
  onSuccess,
  departmentId,
  canApprove = true,
}: TopicActionDialogProps) {
  const [formData, setFormData] = useState<{
    advisorId?: number;
    studentLeaderId?: number;
    status: TopicStatus;
    feedback?: string;
  }>({ status: "PENDING" });

  const { selectedYear } = useAcademicYear();
  const [eligibleSupervisors, setEligibleSupervisors] = useState<
    { id: number; fullName: string }[]
  >([]);

  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (open && topic) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        advisorId: topic.advisorId,
        studentLeaderId: topic.studentLeaderId,
        status: topic.status,
      });

      const fetchSupervisors = async () => {
        if (!departmentId) {
          console.log("Missing departmentId");
          return;
        }

        if (selectedYear) {
          try {
            const users = await userService.getEligibleSupervisors(
              departmentId,
              selectedYear.id,
            );
            const supervisors = users.map((u) => ({
              id: u.id,
              fullName: u.fullName,
            }));

            // Ensure current advisor is in the list (even if they are now full)
            if (topic.advisorId && topic.advisor) {
              const exists = supervisors.some((s) => s.id === topic.advisorId);
              if (!exists) {
                supervisors.push({
                  id: topic.advisorId,
                  fullName: topic.advisor,
                });
              }
            }

            setEligibleSupervisors(supervisors);
          } catch (error) {
            console.error("Failed to fetch supervisors", error);
            toast.error("Không thể tải danh sách giảng viên");
          }
        }
      };
      fetchSupervisors();
    }
  }, [open, topic, selectedYear, departmentId]);

  if (!topic) return null;

  const handleSave = async () => {
    try {
      // Validation: Require feedback for NEEDS_UPDATE only if it's a new status change
      if (
        formData.status === "NEEDS_UPDATE" &&
        topic.status !== "NEEDS_UPDATE" &&
        !formData.feedback?.trim()
      ) {
        toast.error("Vui lòng nhập nội dung cần bổ sung");
        return;
      }

      // Update status if changed
      if (formData.status !== topic.status) {
        await topicService.updateStatus(
          topic.id,
          formData.status,
          formData.feedback,
        );
      }

      // Assign advisor if changed
      if (formData.advisorId !== topic.advisorId) {
        if (formData.advisorId) {
          await topicService.assignAdvisor(topic.id, formData.advisorId);
        }
      }

      // Assign leader if changed
      if (formData.studentLeaderId !== topic.studentLeaderId) {
        if (formData.studentLeaderId) {
          await topicService.assignLeader(topic.id, formData.studentLeaderId);
        }
      }

      toast.success("Cập nhật đề tài thành công");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật");
    }
  };

  const handleApproveTopic = async () => {
    try {
      await topicService.updateStatus(topic.id, "APPROVED");
      toast.success("Đã duyệt đề tài thành công");
      onSuccess();
    } catch (error: any) {
      console.error(error);
      const msg = error?.response?.data?.message || "Có lỗi xảy ra khi duyệt đề tài";
      toast.error(msg);
    }
  };

  const handleRejectTopic = async () => {
    if (!showRejectReason) {
      setShowRejectReason(true);
      return;
    }

    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      // Use updateStatus with REJECTED status and the reason as feedback
      await topicService.updateStatus(topic.id, "REJECTED", rejectReason);
      toast.error("Đã từ chối đề tài");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi từ chối đề tài");
    }
  };

  const isLocked = topic.status === "APPROVED" || topic.status === "REJECTED";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thao tác đề tài</DialogTitle>
        </DialogHeader>

        <div className="mb-4 text-lg font-semibold text-[#0b57a8]">
          {topic.title}
        </div>

        <div className="space-y-6 pb-4">
          {!showRejectReason ? (
            <div className="space-y-4">
              <Field label="Giảng viên hướng dẫn *">
                <Select
                  value={formData.advisorId?.toString()}
                  onValueChange={(v) =>
                    setFormData({ ...formData, advisorId: parseInt(v) })
                  }
                  disabled={isLocked}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn giảng viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleSupervisors.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Sinh viên chủ nhiệm *">
                <Select
                  value={formData.studentLeaderId?.toString()}
                  onValueChange={(v) =>
                    setFormData({ ...formData, studentLeaderId: parseInt(v) })
                  }
                  disabled={isLocked}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn sinh viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {topic.approvedMembers?.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Trạng thái">
                <Select
                  value={formData.status}
                  onValueChange={(v) =>
                    setFormData({ ...formData, status: v as TopicStatus })
                  }
                  disabled={isLocked}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                    <SelectItem value="NEEDS_UPDATE">Cần bổ sung</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {formData.status === "NEEDS_UPDATE" &&
                topic.status !== "NEEDS_UPDATE" && (
                  <Field label="Lý do">
                    <Textarea
                      placeholder="Nhập nội dung cần bổ sung..."
                      value={formData.feedback || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, feedback: e.target.value })
                      }
                      className="min-h-[100px]"
                    />
                  </Field>
                )}
            </div>
          ) : (
            <div className="space-y-4">
              <Field label="Lý do">
                <Textarea
                  placeholder="Nhập lý do từ chối..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="min-h-[100px]"
                  autoFocus
                />
              </Field>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {!isLocked && !showRejectReason && canApprove && (
            <div className="flex gap-2 mr-auto">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleApproveTopic}
              >
                <Check className="mr-2 h-4 w-4" />
                Duyệt
              </Button>
              <Button variant="destructive" onClick={handleRejectTopic}>
                <X className="mr-2 h-4 w-4" />
                Từ chối
              </Button>
            </div>
          )}

          {showRejectReason ? (
            <div className="flex gap-2 w-full justify-end">
              <Button
                variant="outline"
                onClick={() => setShowRejectReason(false)}
              >
                Hủy bỏ
              </Button>
              <Button variant="destructive" onClick={handleRejectTopic}>
                Xác nhận từ chối
              </Button>
            </div>
          ) : (
            <Button onClick={handleSave} disabled={isLocked}>
              Lưu thay đổi
            </Button>
          )}
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
