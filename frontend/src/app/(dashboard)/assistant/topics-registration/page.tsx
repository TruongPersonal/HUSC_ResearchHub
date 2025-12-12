"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchFilterBar } from "@/components/shared/SearchFilterBar";
import { TopicRow, TopicStatus } from "@/features/topics/types";
import { TopicDetailDialog } from "@/components/assistant/topics/TopicDetailDialog";
import { TopicActionDialog } from "@/components/assistant/topics/TopicActionDialog";
import { TopicMemberApprovalDialog } from "@/components/assistant/topics/TopicMemberApprovalDialog";
import { topicService } from "@/features/topics/api/topic.service";
import { toast } from "sonner";
import { TopicRegistrationList } from "@/components/assistant/topics/TopicRegistrationList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { useAcademicYear } from "@/contexts/AcademicYearContext";
import { authService } from "@/features/auth/api/auth.service";
import { yearSessionService } from "@/features/academic-year/api/year-session.service";

/**
 * Trang Quản lý Hồ sơ đăng ký đề tài (dành cho Trợ lý).
 * Hiển thị danh sách các hồ sơ đăng ký mới từ Giảng viên/Sinh viên.
 * Hỗ trợ quy trình xét duyệt: Duyệt hồ sơ, Yêu cầu chỉnh sửa, Từ chối, Duyệt thành viên.
 */
export default function TopicsRegistrationPage() {
  const { selectedYear } = useAcademicYear();
  const [topics, setTopics] = useState<TopicRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TopicStatus | "ALL">("ALL");
  const [canApprove, setCanApprove] = useState(true);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getProfile();
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        toast.error("Không thể tải thông tin người dùng");
      }
    };
    fetchUser();
  }, []);

  // Dialog states
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<TopicRow | null>(null);
  const [actionOpen, setActionOpen] = useState(false);
  const [memberApprovalOpen, setMemberApprovalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const status = statusFilter === "ALL" ? undefined : statusFilter;

      if (selectedYear && currentUser?.departmentId) {
        const res = await topicService.getAll(
          debouncedSearch,
          status,
          currentUser.departmentId,
          selectedYear.id,
          currentPage,
          10,
        );
        setTopics(res.content);
        setTotalPages(res.totalPages);

        // Check Session Status
        const sessions = await yearSessionService.getAll(
          undefined,
          0,
          100,
          currentUser.departmentId,
        );
        const currentSession = sessions.content.find(
          (s) => s.academicYearId === selectedYear.id,
        );
        // Can Approve ONLY if session status is NOT 'ON_REGISTRATION'
        setCanApprove(currentSession?.status !== "ON_REGISTRATION");
      } else {
        setTopics([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Failed to fetch topics", error);
      toast.error("Không thể tải danh sách đề tài");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentPage, debouncedSearch, statusFilter, selectedYear, currentUser]);

  const handleRefresh = () => {
    fetchData();
    // Close dialogs if open and refresh needed (optional, but good for UX)
    setDetailOpen(false);
    setActionOpen(false);
    setMemberApprovalOpen(false);
    setSelectedTopic(null);
  };

  const handleOpenDetail = (t: TopicRow) => {
    setSelectedTopic(t);
    setDetailOpen(true);
  };

  const handleOpenAction = (t: TopicRow) => {
    setSelectedTopic(t);
    setActionOpen(true);
  };

  const handleOpenMemberApproval = (t: TopicRow) => {
    setSelectedTopic(t);
    setMemberApprovalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Quản lý hồ sơ
          </h1>
          <p className="text-muted-foreground">Danh sách các hồ sơ Khoa.</p>
        </div>
      </div>

      {/* Search & Filter Container */}
      <SearchFilterBar
        searchPlaceholder="Tìm kiếm hồ sơ..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            key: "status",
            placeholder: "Trạng thái",
            value: statusFilter,
            onValueChange: (v) => setStatusFilter(v as TopicStatus | "ALL"),
            options: [
              { label: "Tất cả trạng thái", value: "ALL" },
              { label: "Đang duyệt", value: "PENDING" },
              { label: "Cần bổ sung", value: "NEEDS_UPDATE" },
              { label: "Đã duyệt", value: "APPROVED" },
              { label: "Từ chối", value: "REJECTED" },
            ],
            minWidth: "200px",
          },
        ]}
      />

      <TopicRegistrationList
        topics={topics}
        onOpenDetail={handleOpenDetail}
        onOpenAction={handleOpenAction}
        onOpenMemberApproval={handleOpenMemberApproval}
        canApprove={canApprove}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <TopicDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        topic={selectedTopic}
        onSave={handleRefresh}
      />

      <TopicActionDialog
        open={actionOpen}
        onOpenChange={setActionOpen}
        topic={selectedTopic}
        onSuccess={handleRefresh}
        departmentId={currentUser?.departmentId}
        canApprove={canApprove}
      />

      <TopicMemberApprovalDialog
        open={memberApprovalOpen}
        onOpenChange={setMemberApprovalOpen}
        topic={selectedTopic}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
