"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type Role = "STUDENT" | "TEACHER";

export type InboxItem = {
  partnerId: string;
  partnerName: string;
  partnerRole: Role;     // luôn phải có
  lastMessage: string;
  lastAt: string;        // ISO datetime
  unread?: number;
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", { hour12: false });

const roleShort = (r: Role) => (r === "STUDENT" ? "SV" : "GV");

/**
 * Inbox chung cho SV & GV
 * - UI-only, không gọi API
 * - Dùng basePath để tạo link thread: `${basePath}/${partnerId}`
 * - Nếu không truyền items, sẽ dùng demo theo role
 */
export default function Inbox({
  role,                 // "STUDENT" | "TEACHER"
  basePath,             // ví dụ: "/student/messages" hoặc "/teacher/messages"
  items,
}: {
  role: Role;
  basePath: string;
  items?: InboxItem[];
}) {
  // Demo data theo role (fallback)
  const sample = useMemo<InboxItem[]>(() => {
    if (role === "STUDENT") {
      return [
        {
          partnerId: "nvtrung",
          partnerName: "TS. Nguyễn Văn Trung",
          partnerRole: "TEACHER",
          lastMessage: "Tuần sau, thứ Tư 10:00 em nhé.",
          lastAt: "2025-10-10T10:00:00+07:00",
          unread: 2,
        },
        {
          partnerId: "tthoa",
          partnerName: "ThS. Trần Thị Hoa",
          partnerRole: "TEACHER",
          lastMessage: "Em bổ sung mục kinh phí nhé.",
          lastAt: "2025-10-09T14:20:00+07:00",
        },
        {
          partnerId: "23t1020565",
          partnerName: "Lê Văn B",
          partnerRole: "STUDENT",
          lastMessage: "Đi cà phê bàn tiến độ nè.",
          lastAt: "2025-10-08T08:30:00+07:00",
        },
      ];
    }
    // TEACHER
    return [
      {
        partnerId: "23t1020573",
        partnerName: "Ngô Quang Trường",
        partnerRole: "STUDENT",
        lastMessage: "Em đã cập nhật thuyết minh ạ.",
        lastAt: "2025-10-10T08:05:00+07:00",
        unread: 1,
      },
      {
        partnerId: "23t1020565",
        partnerName: "Lê Văn B",
        partnerRole: "STUDENT",
        lastMessage: "Thầy xem giúp em outline.",
        lastAt: "2025-10-09T17:40:00+07:00",
      },
      {
        partnerId: "lhbinh",
        partnerName: "TS. Lê Hữu Bình",
        partnerRole: "TEACHER",
        lastMessage: "Họp nhóm GV chiều nay.",
        lastAt: "2025-10-08T09:10:00+07:00",
      },
    ];
  }, [role]);

  // Ưu tiên props, fallback demo, và sort mới → cũ
  const data = useMemo(() => {
    const arr = (items && items.length ? items : sample).slice();
    arr.sort(
      (a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime()
    );
    return arr;
  }, [items, sample]);

  return (
    <div className="max-w-5xl mx-auto mt-30 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tin nhắn</h1>
        <span className="text-xs md:text-sm rounded-full border px-3 py-1 bg-neutral-50">
          {data.length} hội thoại
        </span>
      </div>

      <Card className="border border-neutral-200">
        <CardContent className="p-0 divide-y">
          {data.map((c) => (
            <Link
              key={c.partnerId}
              href={`${basePath}/${c.partnerId}`}
              className="block px-4 py-3 hover:bg-neutral-50 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-medium truncate">
                      {c.partnerName}
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100">
                      {roleShort(c.partnerRole)}
                    </span>
                    {typeof c.unread === "number" && c.unread > 0 && (
                      <Badge className="bg-blue-600 text-white">
                        {c.unread}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-neutral-700 line-clamp-1">
                    {c.lastMessage}
                  </div>
                </div>

                <div className="shrink-0 text-xs text-muted-foreground">
                  {fmt(c.lastAt)}
                </div>
              </div>
            </Link>
          ))}

          {data.length === 0 && (
            <div className="px-4 py-10 text-center text-muted-foreground">
              Chưa có hội thoại nào.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
