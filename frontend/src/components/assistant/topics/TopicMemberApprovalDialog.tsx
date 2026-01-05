import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TopicRow } from "@/features/topics/types";
import { Check, X, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { topicService } from "@/features/topics/api/topic.service";

interface TopicMemberApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: TopicRow | null;
  onSuccess: () => void;
}

/**
 * Dialog duyệt thành viên tham gia vào đề tài.
 * Hiển thị danh sách sinh viên yêu cầu tham gia và nút Duyệt/Từ chối.
 */
export function TopicMemberApprovalDialog({
  open,
  onOpenChange,
  topic,
  onSuccess,
}: TopicMemberApprovalDialogProps) {
  if (!topic) return null;

  const pendingMembers = topic.pendingMembers || [];

  const handleApprove = async (memberId: number) => {
    try {
      await topicService.approveMember(topic.id, memberId);
      toast.success("Đã duyệt thành viên");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleReject = async (memberId: number) => {
    try {
      await topicService.rejectMember(topic.id, memberId);
      toast.success("Đã từ chối thành viên");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Duyệt thành viên</DialogTitle>
        </DialogHeader>

        <div className="mb-2 text-lg font-semibold text-[#0b57a8]">
          {topic.title}
        </div>

        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Yêu cầu tham gia ({pendingMembers.length})
          </div>

          {pendingMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
              Không có yêu cầu nào
            </div>
          ) : (
            <div className="space-y-3">
              {pendingMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm"
                >
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-xs text-gray-500">
                      {member.username}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleApprove(member.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={() => handleReject(member.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
