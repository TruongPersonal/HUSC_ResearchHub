import Link from "next/link";
import {
  ArrowRight,
  FileText,
  CheckCircle2,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssistantStats } from "@/features/dashboard/types";

interface AssistantStatsGridProps {
  stats: AssistantStats | null;
  loading: boolean;
}

/**
 * Grid hiển thị thống kê cho Trợ lý khoa.
 * Bao gồm: Hồ sơ đăng ký, Đề tài đã duyệt, Phiên năm học hiện tại.
 */
export function AssistantStatsGrid({
  stats,
  loading,
}: AssistantStatsGridProps) {
  const items = [
    {
      href: "/assistant/topics-registration",
      label: "Hồ sơ đăng ký",
      value: stats?.registrationCount || 0,
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      sub: "Quản lý hồ sơ",
      color: "from-blue-50 to-blue-100",
    },
    {
      href: "/assistant/topics",
      label: "Danh sách đề tài",
      value: stats?.approvedTopicCount || 0,
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      sub: "Quản lý đề tài",
      color: "from-emerald-50 to-emerald-100",
    },
    {
      href: "/assistant/years-session",
      label: "Phiên năm học",
      value: stats?.currentYear || "...",
      icon: <CalendarDays className="h-5 w-5 text-amber-600" />,
      sub: stats?.academicYearStatus || "...",
      color: "from-amber-50 to-amber-100",
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
