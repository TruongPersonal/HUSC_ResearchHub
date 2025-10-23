"use client";

import Link from "next/link";
import { ArrowRight, Users2, CalendarDays, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Counts = {
  users: number;
  years: number;
  faculties: number;
  currentYear?: string;
};

// Mock data — thay bằng API thực tế
const MOCK_COUNTS: Counts = {
  users: 124,
  years: 3,
  faculties: 3,
  currentYear: "2024–2025",
};

export default function AdminOverviewPage() {
  const c = MOCK_COUNTS;

  const items = [
    {
      href: "/admin/users",
      label: "Tài khoản",
      value: c.users,
      icon: <Users2 className="h-5 w-5 text-blue-600" />,
      sub: "Thêm, sửa người dùng",
      color: "from-blue-50 to-blue-100",
    },
    {
      href: "/admin/academicyears",
      label: "Năm học",
      value: c.years,
      icon: <CalendarDays className="h-5 w-5 text-amber-600" />,
      sub: `Hiện tại: ${c.currentYear ?? "—"}`,
      color: "from-amber-50 to-amber-100",
    },
    {
      href: "/admin/faculties",
      label: "Khoa / Ngành",
      value: c.faculties,
      icon: <Building2 className="h-5 w-5 text-emerald-600" />,
      sub: "Thêm, sửa qua và ngành",
      color: "from-emerald-50 to-emerald-100",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Bảng điều khiển
          </h1>
          <p className="text-sm text-gray-600">
            Tổng quan nhanh về người dùng, năm học và khoa/ ngành.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <Link href={i.href} key={i.href}>
            <Card
              className={`group transition-all border border-gray-200 hover:border-transparent hover:shadow-md hover:-translate-y-0.5 bg-gradient-to-b ${i.color}`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-800 flex items-center gap-2">
                  {i.icon}
                  {i.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {i.value}
                </div>
                <div className="mt-1 text-xs text-gray-600 flex items-center">
                  {i.sub}
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