"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export type Noti = {
  id: number;
  title: string;
  content: string;
  publishDatetime: string | Date;
};

const formatVN = (d: string | Date) =>
  new Date(d).toLocaleString("vi-VN", { hour12: false });

/**
 * Announcements (UI-only)
 * - Danh sách + xem chi tiết trong 1 ô (modal)
 */
export default function Announcements({
  items,
}: {
  items?: Noti[];
}) {
  // Data mẫu
  const sample = useMemo<Noti[]>(
    () => [
      {
        id: 101,
        title: "Thông báo mở đăng ký đề tài NCKH năm học 2025–2026",
        content:
          "Khoa CNTT thông báo mở cổng đăng ký đề tài nghiên cứu khoa học dành cho sinh viên năm học 2025–2026. Sinh viên chuẩn bị hồ sơ theo hướng dẫn, thời hạn nộp trước 23:59 ngày 30/10/2025. Mọi thắc mắc liên hệ phòng KHCN.",
        publishDatetime: "2025-01-15T09:30:00+07:00",
      },
      {
        id: 102,
        title: "Thông báo nộp hợp đồng thực hiện đề tài NCKH",
        content:
          "Sinh viên đã được duyệt đề tài cần hoàn thiện và nộp hợp đồng thực hiện đề tài nghiên cứu khoa học. Hạn cuối nộp bản cứng tại văn phòng khoa trước 17:00 ngày 05/11/2025. Mẫu hợp đồng được đăng tải trên trang KHCN&HTQT.",
        publishDatetime: "2025-01-20T09:00:00+07:00",
      },
      {
        id: 103,
        title: "Thông báo nộp bài báo khoa học",
        content:
          "Nhằm phục vụ công tác đánh giá giữa kỳ, sinh viên thực hiện đề tài cần nộp bản thảo bài báo khoa học qua email. Hạn nộp trước 23:59 ngày 25/11/2025. Bài báo cần tuân thủ định dạng IEEE hoặc tương đương.",
        publishDatetime: "2025-09-10T08:30:00+07:00",
      },
      {
        id: 104,
        title: "Thông báo nộp bản thuyết trình báo cáo đề tài",
        content:
          "Các nhóm nghiên cứu hoàn thiện slide thuyết trình để phục vụ buổi báo cáo nghiệm thu. File trình chiếu nộp qua email trước 23:59 ngày 10/12/2025. Mỗi nhóm cần chuẩn bị phần trình bày tối đa 10 phút.",
        publishDatetime: "2025-10-25T10:15:00+07:00",
      },
      {
        id: 105,
        title: "Thông báo nộp báo cáo tổng kết đề tài NCKH",
        content:
          "Sinh viên hoàn thiện báo cáo tổng kết và toàn bộ hồ sơ minh chứng theo mẫu quy định. Hạn cuối nộp bản in và file điện tử trước 17:00 ngày 20/12/2025. Hồ sơ đầy đủ là điều kiện để xét công nhận hoàn thành đề tài.",
        publishDatetime: "2025-12-10T09:45:00+07:00",
      },
    ],
    []
  );

  const data = items && items.length ? items : sample;

  // Modal state
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Noti | null>(null);

  const openDetail = (n: Noti) => {
    setSelected(n);
    setOpen(true);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto mt-30 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Thông báo</h1>
            <p className="text-sm text-muted-foreground">
              Thông báo, tin tức từ khoa về việc thực hiện NCKH.
            </p>
          </div>
          <span className="text-xs md:text-sm rounded-full border px-3 py-1 bg-neutral-50">
            {data.length} thông báo
          </span>
        </div>

        {/* Empty state */}
        {data.length === 0 ? (
          <Card>
            <CardContent className="text-center text-muted-foreground">
              Hiện chưa có thông báo nào.
            </CardContent>
          </Card>
        ) : null}

        {/* List */}
        <div className="space-y-6">
          {data.map((n) => (
            <Card key={n.id} className="hover:border-neutral-300 transition">
              <CardContent className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base md:text-lg font-medium leading-snug">
                    <button
                      type="button"
                      onClick={() => openDetail(n)}
                      className="text-left hover:underline decoration-2 underline-offset-4"
                    >
                      {n.title}
                    </button>
                  </h2>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatVN(n.publishDatetime)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="leading-snug">
              {selected?.title}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {selected ? formatVN(selected.publishDatetime) : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2">
            <div className="text-sm leading-relaxed whitespace-pre-line">
              {selected?.content}
            </div>
          </div>

          {/* (tuỳ chọn) liên kết tới trang chi tiết riêng, nếu sau này bạn cần */}
          {/* <div className="pt-2">
            {selected && (
              <Link
                href={`/announcements/${selected.id}`}
                className="text-sm text-blue-700 hover:text-blue-900"
              >
                Mở trang chi tiết →
              </Link>
            )}
          </div> */}
        </DialogContent>
      </Dialog>
    </>
  );
}
