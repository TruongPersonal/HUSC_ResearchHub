"use client";

import ManageNavbar from "./manage_navbar";
import ManageSidebar from "./manage_sidebar";

type Role = "admin" | "assistant";

/**
 * ManageShell
 * - Dùng cho admin/assistant
 * - Desktop-only: sidebar 200px (w-[200px])
 */
export default function ManageShell({
  role = "admin",
  items,               // REQUIRED
  children,
}: {
  role?: Role;
  items: { href: string; label: string }[];   // <-- bắt buộc
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen min-w-[1280px] bg-neutral-50">
      {/* Navbar vẫn dùng role để đổi title/ẩn/hiện YearSelect */}
      <ManageNavbar role={role} />

      <div className="flex">
        {/* Sidebar: không còn role, luôn nhận items bắt buộc */}
        <ManageSidebar items={items} />
        <main className="flex-1 min-w-0 p-8">{children}</main>
      </div>
    </div>
  );
}
