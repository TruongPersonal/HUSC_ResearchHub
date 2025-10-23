"use client";

import { usePathname } from "next/navigation";
import ManageShell from "./manage_shell";
import LearnShell from "./learn_shell";
import { type NavItem } from "@/lib/nav";

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    const items: NavItem[] = [
      { href: "/admin/overview", label: "Tổng quan" },
      { href: "/admin/users", label: "Tài khoản" },
      { href: "/admin/academicyears", label: "Năm học" },
      { href: "/admin/faculties", label: "Khoa/Ngành" },
    ];
    return (
      <ManageShell role="admin" items={items}>
        {children}
      </ManageShell>
    );
  }

  if (pathname.startsWith("/assistant")) {
    const items: NavItem[] = [
      { href: "/assistant/overview", label: "Tổng quan" },
      { href: "/assistant/registrations", label: "Hồ sơ đăng ký" },
      { href: "/assistant/sessions", label: "Phiên/Năm học" },
      { href: "/assistant/notifications", label: "Thông báo" },
    ];
    return (
      <ManageShell role="assistant" items={items}>
        {children}
      </ManageShell>
    );
  }

  if (pathname.startsWith("/teacher")) {
    const navItems: NavItem[] = [
      { href: "/teacher", label: "Trang chủ", exact: true }, // ← exact
      { href: "/teacher/mytopic", label: "Đề tài của tôi" },
      { href: "/teacher/topics", label: "Danh sách đề tài" },
    ];
    const asideItems: NavItem[] = [
      { href: "/teacher/infomations", label: "Thông tin cá nhân" },
      { href: "/teacher/announcements", label: "Thông báo" },
      { href: "/teacher/messages", label: "Tin nhắn" },
      { href: "/teacher/topicregistration", label: "Đăng ký đề tài" },
    ];
    return (
      <LearnShell
        theme="teacher"
        brandHref="/teacher"
        navItems={navItems}
        asideItems={asideItems}
      >
        {children}
      </LearnShell>
    );
  }

  // student mặc định
  const studentNavItems: NavItem[] = [
    { href: "/student", label: "Trang chủ", exact: true }, // ← exact để không active ở trang con
    { href: "/student/topics", label: "Danh sách đề tài" },
    { href: "/student/mytopic", label: "Đề tài của tôi" },
  ];
  const studentAsideItems: NavItem[] = [
    { href: "/student/infomations", label: "Thông tin cá nhân" },
    { href: "/student/announcements", label: "Thông báo" },
    { href: "/student/messages", label: "Tin nhắn" },
    { href: "/student/topicpropose", label: "Đề xuất đề tài" },
  ];

  return (
    <LearnShell
      theme="student"
      brandHref="/student"
      navItems={studentNavItems}
      asideItems={studentAsideItems}
    >
      {children}
    </LearnShell>
  );
}
