import Link from "next/link";
import {
  ArrowRight,
  Users2,
  CalendarDays,
  Building2,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminStats } from "@/features/dashboard/types";

interface StatsGridProps {
  stats: AdminStats | null;
  loading: boolean;
}

/**
 * Grid hiển thị thống kê tổng quan cho Admin.
 * Bao gồm: Tài khoản, Năm học, Khoa ngành.
 */
export function StatsGrid({ stats, loading }: StatsGridProps) {
  const items = [
    {
      href: "/admin/users",
      label: "Tài khoản",
      value: stats?.users || 0,
      icon: <Users2 className="h-5 w-5 text-blue-600" />,
      sub: "Quản lý người dùng",
      color: "from-blue-50 to-blue-100",
    },
    {
      href: "/admin/academic-years",
      label: "Năm học",
      value: stats?.years || 0,
      icon: <CalendarDays className="h-5 w-5 text-amber-600" />,
      sub: `Hiện tại: ${stats?.currentYear || "..."}`,
      color: "from-amber-50 to-amber-100",
    },
    {
      href: "/admin/faculties",
      label: "Khoa ngành",
      value: stats?.faculties || 0,
      icon: <Building2 className="h-5 w-5 text-emerald-600" />,
      sub: "Quản lý khoa",
      color: "from-emerald-50 to-emerald-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => (
        <Link href={i.href} key={i.href}>
          <Card
            className={`group h-full transition-all border border-gray-200 hover:border-transparent hover:shadow-md hover:-translate-y-0.5 bg-gradient-to-b ${i.color}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-800 flex items-center gap-2">
                {i.icon}
                {i.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                ) : (
                  i.value
                )}
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
  );
}
