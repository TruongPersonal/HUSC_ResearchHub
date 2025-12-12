"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarRange,
  LogOut,
  BookOpen,
  FileText,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const adminItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Năm học",
    href: "/admin/academic-years",
    icon: CalendarRange,
  },
  {
    title: "Người dùng",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Khoa",
    href: "/admin/faculties",
    icon: GraduationCap,
  },

  {
    title: "Thông báo",
    href: "/admin/announcements",
    icon: Megaphone,
  },
];

const studentItems = [
  {
    title: "Trang chủ",
    href: "/student",
    icon: LayoutDashboard,
  },
  {
    title: "Thông báo",
    href: "/student/announcements",
    icon: Megaphone,
  },
  {
    title: "Thông tin cá nhân",
    href: "/student/profile",
    icon: Users,
  },
  {
    title: "Tin nhắn",
    href: "/student/messages",
    icon: FileText,
  },

  {
    title: "Đề tài của tôi",
    href: "/student/my-topics",
    icon: BookOpen,
  },
  {
    title: "Đề xuất đề tài",
    href: "/student/topic-propose",
    icon: FileText,
  },
  {
    title: "Danh sách đề tài",
    href: "/student/topics",
    icon: BookOpen,
  },
];

const teacherItems = [
  {
    title: "Trang chủ",
    href: "/teacher",
    icon: LayoutDashboard,
  },
  {
    title: "Thông báo",
    href: "/teacher/announcements",
    icon: Megaphone,
  },
  {
    title: "Thông tin cá nhân",
    href: "/teacher/profile",
    icon: Users,
  },
  {
    title: "Tin nhắn",
    href: "/teacher/messages",
    icon: FileText,
  },

  {
    title: "Đề tài của tôi",
    href: "/teacher/my-topics",
    icon: BookOpen,
  },
  {
    title: "Đề xuất đề tài",
    href: "/teacher/topic-registration",
    icon: FileText,
  },
  {
    title: "Danh sách đề tài",
    href: "/teacher/topics",
    icon: BookOpen,
  },
];

const assistantItems = [
  {
    title: "Overview",
    href: "/assistant",
    icon: LayoutDashboard,
  },
  {
    title: "Hồ sơ",
    href: "/assistant/topics-registration",
    icon: FileText,
  },
  {
    title: "Đề tài",
    href: "/assistant/topics",
    icon: BookOpen,
  },
  {
    title: "Phiên năm học",
    href: "/assistant/years-session",
    icon: CalendarRange,
  },

  {
    title: "Thông báo",
    href: "/assistant/announcements",
    icon: Megaphone,
  },
];

/**
 * Sidebar điều hướng chính.
 * Hiển thị menu dựa trên vai trò người dùng (Admin, Student, Teacher, Assistant).
 */
export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<{ role: string }>(token);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRole(decoded.role);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  let items: { title: string; href: string; icon: React.ElementType }[] = [];
  if (role === "ROLE_ADMIN") {
    items = adminItems;
  } else if (role === "ROLE_STUDENT") {
    items = studentItems;
  } else if (role === "ROLE_TEACHER") {
    items = teacherItems;
  } else if (role === "ROLE_ASSISTANT") {
    items = assistantItems;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/login");
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6 gap-3">
        <Image
          src="/images/icons/logo.png"
          alt="Logo"
          width={60}
          height={60}
          className="object-contain"
        />
        <span className="text-md font-bold tracking-tight text-blue-900">
          HUSC ResearchHub
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {items.map((item, index) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin" ||
                item.href === "/student" ||
                item.href === "/teacher" ||
                item.href === "/assistant"
                ? pathname === item.href
                : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}
