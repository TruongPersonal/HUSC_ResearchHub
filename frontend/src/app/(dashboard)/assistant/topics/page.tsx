"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useAcademicYear } from "@/contexts/AcademicYearContext";
import { approvedTopicService } from "@/features/topics/api/approved-topic.service";
import {
  ApprovedTopicResponse,
  ApprovedTopicStatus,
} from "@/features/topics/types";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ApprovedTopicActionDialog } from "@/components/assistant/topics/ApprovedTopicActionDialog";
import { ApprovedTopicList } from "@/components/assistant/topics/ApprovedTopicList";
import { Button } from "@/components/ui/button";
import { ApprovedTopicDetailDialog } from "@/components/assistant/topics/ApprovedTopicDetailDialog";
import { PageResponse } from "@/types/common";
import { SearchFilterBar } from "@/components/shared/SearchFilterBar";

import { ApprovedTopicReportDialog } from "@/components/assistant/topics/ApprovedTopicReportDialog";

/**
 * Trang Quản lý Đề tài đã duyệt (dành cho Trợ lý).
 * Hiển thị danh sách các đề tài đã được duyệt (Đang thực hiện, Hoàn thành...).
 * Cung cấp các chức năng: Xem chi tiết, Cập nhật tiến độ, Xem báo cáo.
 */
export default function ApprovedTopicsPage() {
  const { user } = useAuth();
  const { selectedYear } = useAcademicYear();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PageResponse<ApprovedTopicResponse> | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [selectedTopic, setSelectedTopic] =
    useState<ApprovedTopicResponse | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApprovedTopicStatus | "ALL">(
    "ALL",
  );
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchData = async () => {
    // if (!user || !selectedYear) return;
    setLoading(true);
    try {
      if (user && selectedYear) {
        const res = await approvedTopicService.getAll(
          currentPage,
          10,
          user.departmentId!,
          selectedYear.id,
          debouncedSearch,
          statusFilter,
        );
        setData(res);
      } else {
        setData(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách đề tài");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, user, selectedYear, debouncedSearch, statusFilter]);

  // if (!selectedYear) {
  //     return (
  //         <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
  //             Vui lòng chọn năm học để xem dữ liệu.
  //         </div>
  //     )
  // }

  const handleRefresh = () => {
    fetchData();
    setDetailDialogOpen(false);
    setActionDialogOpen(false);
    setSelectedTopic(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Quản lý đề tài
          </h1>
          <p className="text-muted-foreground">Danh sách các đề tài Khoa.</p>
        </div>
      </div>

      {/* Search & Filter Container */}
      <SearchFilterBar
        searchPlaceholder="Tìm kiếm danh sách đề tài..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            key: "status",
            placeholder: "Trạng thái",
            value: statusFilter,
            onValueChange: (v) => {
              setStatusFilter(v as ApprovedTopicStatus | "ALL");
              setCurrentPage(0);
            },
            options: [
              { label: "Tất cả trạng thái", value: "ALL" },
              { label: "Đang thực hiện", value: "IN_PROGRESS" },
              { label: "Hoàn thành", value: "COMPLETED" },
              { label: "Không hoàn thành", value: "NOT_COMPLETED" },
              { label: "Đã hủy", value: "CANCELED" },
            ],
            minWidth: "200px",
          },
        ]}
      />

      <ApprovedTopicList
        topics={data?.content || []}
        onOpenDetail={(t) => {
          setSelectedTopic(t);
          setDetailDialogOpen(true);
        }}
        onOpenAction={(t) => {
          setSelectedTopic(t);
          setActionDialogOpen(true);
        }}
        onOpenReport={(t) => {
          setSelectedTopic(t);
          setReportDialogOpen(true);
        }}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={data?.totalPages || 0}
        onPageChange={setCurrentPage}
      />

      <ApprovedTopicActionDialog
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        topic={selectedTopic}
        onSuccess={() => {
          fetchData();
          setActionDialogOpen(false);
        }}
      />

      <ApprovedTopicDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        topic={selectedTopic}
        onSave={handleRefresh}
      />

      <ApprovedTopicReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        topic={selectedTopic}
      />
    </div>
  );
}
