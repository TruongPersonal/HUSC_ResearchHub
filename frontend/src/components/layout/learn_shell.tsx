"use client";

import LearnNavbar from "./learn_navbar";
import LearnSidebar from "./learn_sidebar";
import { type NavItem } from "@/lib/nav";

/**
 * LearnShell
 * - Dùng cho teacher/student
 * - Desktop-only: navbar trên, sidebar trái rộng 220px
 */
export default function LearnShell({
  theme,
  brandHref,
  navItems,
  asideItems,
  children,
}: {
  theme: "student" | "teacher";
  brandHref: string;
  navItems: NavItem[];
  asideItems: NavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen min-w-[1280px] bg-neutral-50">
      <LearnNavbar theme={theme} items={navItems} brandHref={brandHref} />
      <div className="mx-auto flex">
        <LearnSidebar items={asideItems} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
