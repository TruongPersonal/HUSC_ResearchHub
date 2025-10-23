"use client";

import Link from "next/link";
import {
  ClipboardList,
  Bell,
  CalendarDays,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

/* =====================================
   Assistant Overview — Dashboard
   File: app/assistant/overview/page.tsx
   - Tối giản, đồng bộ phong cách admin
   - 3 thẻ số liệu + 1 khu tác vụ nhanh
   ===================================== */

type AssistantStats = {
  registrations: number;
  notifications: number;
  currentSession?: string;
};

// TODO: thay bằng fetch API thật
const MOCK_STATS: AssistantStats = {
  registrations: 42,
  notifications: 5,
  currentSession: "2025–2026",
};

export default function AssistantOverviewPage() {
  const s = MOCK_STATS;

  const cards = [
    {
      href: "/assistant/registrations",
      label: "Hồ sơ đăng ký",
      value: s.registrations,
      sub: "Đang xử lý và duyệt",
      icon: <ClipboardList className="h-5 w-5 text-blue-600" />,
      color: "from-blue-50 to-blue-100",
    },
    {
      href: "/assistant/sessions",
      label: "Phiên / Năm học",
      value: s.currentSession,
      sub: `Đang thực hiện`,
      icon: <CalendarDays className="h-5 w-5 text-amber-600" />,
      color: "from-amber-50 to-amber-100",
    },
    {
      href: "/assistant/notifications",
      label: "Thông báo",
      value: s.notifications,
      sub: "Cập nhật gần đây nhất",
      icon: <Bell className="h-5 w-5 text-emerald-600" />,
      color: "from-emerald-50 to-emerald-100",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Bảng điều khiển
          </h1>
          <p className="text-sm text-gray-600">
            Tổng quan về hồ sơ đăng ký, năm học hiện tại và phiên, thông báo mới gần đây.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <Card
              className={`group transition-all border border-gray-200 hover:border-transparent hover:shadow-md hover:-translate-y-0.5 bg-gradient-to-b ${c.color}`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-800 flex items-center gap-2">
                  {c.icon}
                  {c.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {c.value}
                </div>
                <div className="mt-1 text-xs text-gray-600 flex items-center">
                  {c.sub}
                  <ArrowRight className="ml-1 h-3 w-3 opacity-60 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}