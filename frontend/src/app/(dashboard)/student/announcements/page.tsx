"use client";

import { useEffect, useState } from "react";
import { AnnouncementList } from "@/features/announcements/components/AnnouncementList";
import {
  AnnouncementDetailModal,
  Noti,
} from "@/features/announcements/components/AnnouncementDetailModal";
import { Pagination } from "@/components/ui/pagination";
import { Bell } from "lucide-react";
import { announcementService } from "@/features/announcements/api/announcement.service";
import { Announcement } from "@/features/announcements/types";
import { useAcademicYear } from "@/contexts/AcademicYearContext";

/**
 * Trang Thông báo Sinh viên.
 * Hiển thị danh sách thông báo từ Khoa và Nhà trường.
 */
export default function StudentAnnouncementsPage() {
  const [data, setData] = useState<Noti[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const { selectedYear } = useAcademicYear();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Noti | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Pass selectedYear?.id to getAll
        const response = await announcementService.getAll(
          undefined,
          currentPage,
          ITEMS_PER_PAGE,
          selectedYear?.id,
        );

        // Map API response to UI model
        const mappedData: Noti[] = response.content.map(
          (item: Announcement) => ({
            id: item.id,
            title: item.title,
            content: item.content,
            publishDatetime: item.publishDatetime,
            category: item.departmentName ? "Cấp khoa" : "Cấp trường",
          }),
        );

        setData(mappedData);
        setTotalItems(response.totalElements);
      } catch (error) {
        console.error("Failed to fetch announcements", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedYear) {
      fetchData();
    }
  }, [currentPage, selectedYear]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const openDetail = (n: Noti) => {
    setSelected(n);
    setOpen(true);
  };

  return (
    <div className="max-w-[1080px] mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
          <p className="text-gray-500 mt-1">
            Danh sách các thông báo từ Khoa và hệ thống.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
          <Bell className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-blue-600">{totalItems}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <>
          <AnnouncementList data={data} onItemClick={openDetail} />

          {data.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      </div>

      {/* Modal */}
      <AnnouncementDetailModal
        open={open}
        onOpenChange={setOpen}
        notification={selected}
      />
    </div>
  );
}
