"use client";

import { useEffect, useState } from "react";
import { Topic } from "@/features/topics/types";
import { TopicList } from "@/features/topics/components/TopicList";
import { TopicDetailModal } from "@/features/topics/components/TopicDetailModal";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { topicService } from "@/features/topics/api/topic.service";
import { TopicRow } from "@/features/topics/types";
import { useAcademicYear } from "@/contexts/AcademicYearContext";
import { authService } from "@/features/auth/api/auth.service";
import { yearSessionService } from "@/features/academic-year/api/year-session.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

/**
 * Trang Danh sách đề tài nghiên cứu (Sinh viên).
 * Hiển thị danh sách tất cả đề tài của Khoa.
 * Cho phép sinh viên đăng ký tham gia đề tài nếu đang trong thời gian đăng ký.
 */
export default function StudentTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { selectedYear } = useAcademicYear();
  const [departmentId, setDepartmentId] = useState<number | undefined>(
    undefined,
  );

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 10;

  // Session Status State
  const [isSessionOpen, setIsSessionOpen] = useState(false);

  const [currentUserUsername, setCurrentUserUsername] = useState<string>("");
  const [fullName, setFullName] = useState<string>(""); // Added fullName state

  // Fetch user profile to get departmentId and username
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await authService.getProfile();
        if (user) {
          if (user.departmentId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDepartmentId(user.departmentId);
          }
          if (user.username) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentUserUsername(user.username);
          }
          if (user?.fullName) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFullName(user.fullName);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };
    fetchProfile();
  }, []);

  // Fetch session status and topics
  useEffect(() => {
    const fetchData = async () => {
      if (!departmentId || !selectedYear) return;

      setLoading(true);
      try {
        // 1. Check Session Status
        const sessionsResponse = await yearSessionService.getAll(
          undefined,
          0,
          100,
          departmentId,
        );
        const currentSession = sessionsResponse.content.find(
          (s) => s.academicYearId === selectedYear.id,
        );
        const isOpen = currentSession?.status === "ON_REGISTRATION";
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsSessionOpen(isOpen);

        // 2. Fetch ALL topics
        const response = await topicService.getAll(
          undefined,
          undefined,
          departmentId,
          selectedYear.id,
          currentPage,
          ITEMS_PER_PAGE,
        );

        // Map API response to UI model
        const mappedTopics: Topic[] = response.content.map((item: TopicRow) => {
          const isApproved = item.approvedMembers?.some(
            (m) => m.username === currentUserUsername,
          );
          const isPending = item.pendingMembers?.some(
            (m) => m.username === currentUserUsername,
          );
          const isRejected = item.rejectedMembers?.some(
            (m) => m.username === currentUserUsername,
          );

          return {
            id: item.id,
            code: undefined,
            name: item.title,
            description: item.short,
            lecturer: {
              id: item.advisorId || 0,
              name: item.advisorName || "Chưa có giảng viên hướng dẫn",
              username: item.advisorUsername,
            },
            status: item.status,
            createdAt: new Date(item.submittedAt).toLocaleDateString("vi-VN"),
            students: item.approvedMembers?.map((m) => ({
              id: m.id.toString(),
              code: m.username || "",
              name: m.name,
              isLeader: item.studentLeaderId === m.id,
            })),
            isApproved: !!isApproved,
            isPending: !!isPending,
            isRejected: !!isRejected,
          };
        });

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTopics(mappedTopics);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTotalItems(response.totalElements);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, selectedYear, departmentId, currentUserUsername, refreshKey]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // State for Confirmation Dialog
  const [confirmTopic, setConfirmTopic] = useState<Topic | null>(null);

  // Handlers
  const handleViewDetails = (topic: Topic) => {
    setSelectedTopic(topic);
    setIsDetailOpen(true);
  };

  const confirmRegistration = (topic: Topic) => {
    setConfirmTopic(topic);
  };

  const handleRegister = async () => {
    if (!confirmTopic) return;

    setIsRegistering(true);
    try {
      await topicService.register(confirmTopic.id);
      toast.success(`Đăng ký thành công đề tài: ${confirmTopic.name}`);

      // Close modals
      setConfirmTopic(null);
      setIsDetailOpen(false); // Close detail modal if open
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Registration failed", error);
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="max-w-[1080px] mx-auto pb-12">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Danh sách đề tài
            </h1>
            <p className="text-gray-500 mt-1">
              Danh sách các đề tài nghiên cứu.
            </p>
          </div>

          {!loading &&
            departmentId &&
            (isSessionOpen ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-100 text-sm font-bold shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
                Mở
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full border border-red-100 text-sm font-bold shadow-sm">
                <XCircle className="w-4 h-4" />
                Đóng
              </div>
            ))}
        </div>

        {!loading && !departmentId && (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span>
              Tài khoản của bạn chưa được cập nhật thông tin Khoa. Vui lòng liên
              hệ quản trị viên để cập nhật.
            </span>
          </div>
        )}
      </div>

      <div className="space-y-8">
        <TopicList
          topics={topics}
          onViewDetails={handleViewDetails}
          onRegister={confirmRegistration}
          isSessionOpen={isSessionOpen}
        />

        {topics.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Detail Modal */}
      <TopicDetailModal
        topic={selectedTopic}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onRegister={confirmRegistration}
        isSessionOpen={isSessionOpen}
      />

      {/* Confirmation Alert Dialog */}
      <AlertDialog
        open={!!confirmTopic}
        onOpenChange={(open) => !open && setConfirmTopic(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đăng ký đề tài</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đăng ký đề tài{" "}
              <span className="font-semibold text-gray-900">
                &quot;{confirmTopic?.name}&quot;
              </span>{" "}
              không?
              <br />
              Hành động này sẽ gửi yêu cầu đăng ký đến trợ lý khoa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRegistering}>
              Hủy bỏ
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // Prevent auto-close to handle async
                handleRegister();
              }}
              disabled={isRegistering}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRegistering ? "Đang xử lý..." : "Xác nhận đăng ký"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
