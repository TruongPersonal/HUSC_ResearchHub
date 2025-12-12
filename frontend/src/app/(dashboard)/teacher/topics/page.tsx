"use client";

import { useEffect, useState } from "react";
import { Topic } from "@/features/topics/types";
import { TopicList } from "@/features/topics/components/TopicList";
import { TopicDetailModal } from "@/features/topics/components/TopicDetailModal";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";
import { topicService } from "@/features/topics/api/topic.service";
import { TopicRow } from "@/features/topics/types";
import { useAcademicYear } from "@/contexts/AcademicYearContext";
import { authService } from "@/features/auth/api/auth.service";

import { toast } from "sonner";

/**
 * Trang Danh sách đề tài nghiên cứu (Giảng viên).
 * Hiển thị toàn bộ danh sách đề tài của Khoa để Giảng viên tham khảo.
 */
export default function TeacherTopicsPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { selectedYear } = useAcademicYear();
  const [departmentId, setDepartmentId] = useState<number | undefined>(
    undefined,
  );

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 10;

  // Session Status State
  // Session Status State
  // Removed as per request (Teachers don't need to see open/close status here)

  const [currentUserUsername, setCurrentUserUsername] = useState<string>("");

  // Fetch user profile to get departmentId and username
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await authService.getProfile();
        if (user) {
          if (user.departmentId) setDepartmentId(user.departmentId);
          if (user.username) setCurrentUserUsername(user.username);
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
        // 1. Fetch ALL topics
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

        setTopics(mappedTopics);
        setTotalItems(response.totalElements);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, selectedYear, departmentId, currentUserUsername]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // State for Confirmation Dialog
  const handleViewDetails = (topic: Topic) => {
    setSelectedTopic(topic);
    setIsDetailOpen(true);
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
          onRegister={() => { }}
          isSessionOpen={false}
          showAction={false}
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
        onRegister={() => { }}
        isSessionOpen={false}
      />
    </div>
  );
}
