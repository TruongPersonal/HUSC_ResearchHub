"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, Library, Menu, User, MessageSquare, Bell, FilePlus, LogOut } from "lucide-react";
import { UserMenu } from "@/components/dashboard/UserMenu";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AcademicYearSelector } from "@/components/shared/AcademicYearSelector";
import { useState, useEffect } from "react";
import { authService } from "@/features/auth/api/auth.service";
import { toast } from "sonner";

const navItems = [
  {
    title: "Trang chủ",
    href: "/teacher",
    icon: Home,
  },
  {
    title: "Danh sách đề tài",
    href: "/teacher/topics",
    icon: Library,
  },
  {
    title: "Đề tài của tôi",
    href: "/teacher/my-topics",
    icon: BookOpen,
  },
];

function MobileMenuContent({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    authService.getProfile().then(setProfile).catch(console.error);
  }, []);

  const handleLogout = () => {
    authService.logout();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
    onClose();
    toast.success("Đã đăng xuất");
  };

  const getAvatarUrl = (url?: string) => {
    if (!url) return "/images/avatars/teacher.png";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/uploads")) return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    return url;
  };

  return (
    <>
      {/* 1. Header: Profile Info */}
      {/* 1. Header: Profile Info (Visible < md) */}
      <div className="md:hidden p-6 bg-gradient-to-br from-blue-50 to-indigo-50/50">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 rounded-full border-2 border-white shadow-md overflow-hidden bg-white flex items-center justify-center">
            <Image
              src="/images/icons/logo.png"
              alt="ResearchHub Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate">
              {profile?.username || "Mã giảng viên"}
            </h3>
            <p className="text-sm text-blue-600 font-medium">
              Giảng viên
            </p>
          </div>
        </div>
      </div>

      {/* 1b. Header: Logo (Visible >= md) */}
      {/* 1b. Header: Logo (Visible >= md) */}
      <div className="hidden md:flex p-6 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50/50">
        <Image
          src="/images/icons/logo.png"
          alt="ResearchHub Logo"
          width={48}
          height={48}
          className="object-contain"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-6">
        {/* 2. Academic Year */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Năm học</label>
          <AcademicYearSelector triggerClassName="w-full bg-white border border-gray-200 shadow-sm" />
        </div>

        {/* 3. Main Menu */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">CHÍNH</label>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-600/10 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-gray-400")} />
                {item.title}
              </Link>
            );
          })}
        </div>

        {/* 4. Personal Menu */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Cá nhân</label>
          <Link href="/teacher/profile" onClick={onClose} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200", pathname === "/teacher/profile" ? "bg-blue-600/10 text-blue-700" : "text-gray-600 hover:bg-gray-50")}>
            <User className={cn("w-5 h-5", pathname === "/teacher/profile" ? "text-blue-600" : "text-gray-400")} /> Thông tin cá nhân
          </Link>
          <Link href="/teacher/messages" onClick={onClose} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200", pathname === "/teacher/messages" ? "bg-blue-600/10 text-blue-700" : "text-gray-600 hover:bg-gray-50")}>
            <MessageSquare className={cn("w-5 h-5", pathname === "/teacher/messages" ? "text-blue-600" : "text-gray-400")} /> Tin nhắn
          </Link>
          <Link href="/teacher/announcements" onClick={onClose} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200", pathname === "/teacher/announcements" ? "bg-blue-600/10 text-blue-700" : "text-gray-600 hover:bg-gray-50")}>
            <Bell className={cn("w-5 h-5", pathname === "/teacher/announcements" ? "text-blue-600" : "text-gray-400")} /> Thông báo
          </Link>
          <Link href="/teacher/topic-registration" onClick={onClose} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200", pathname === "/teacher/topic-registration" ? "bg-blue-600/10 text-blue-700" : "text-gray-600 hover:bg-gray-50")}>
            <FilePlus className={cn("w-5 h-5", pathname === "/teacher/topic-registration" ? "text-blue-600" : "text-gray-400")} /> Đăng ký đề tài
          </Link>
        </div>
      </div>

      {/* 5. Footer: Logout */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-rose-600 font-medium hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4" /> Đăng xuất
        </button>
      </div>
    </>
  );
}

/**
 * Navbar cho giảng viên.
 * Hiển thị Logo, Menu điều hướng (Trang chủ, Danh sách đề tài...), và UserMenu.
 */
export function TeacherNavbar() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl">
      <div className="bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-3xl backdrop-saturate-150 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-full px-6 py-3 flex items-center justify-between border border-white/40 ring-1 ring-white/40">
        {/* Mobile Menu Trigger */}
        <div className="xl:hidden flex items-center">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 text-slate-600">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0 flex flex-col h-full border-r-0 bg-white">
              <MobileMenuContent pathname={pathname || ""} onClose={() => setSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link
          href="/teacher"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <span className="xl:hidden font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">HUSC Research</span>
          <Image
            src="/images/icons/logo.png"
            alt="ResearchHub Logo"
            width={40}
            height={40}
            className="hidden xl:block object-contain drop-shadow-md"
          />
        </Link>

        {/* Navigation Links - Centered & Pill Shaped */}
        <nav className="hidden xl:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300",
                  isActive
                    ? "bg-white/80 text-blue-600 shadow-lg shadow-blue-500/20 backdrop-blur-md"
                    : "text-slate-600 hover:bg-white/40 hover:text-slate-900 hover:shadow-sm",
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4",
                    isActive ? "text-blue-600" : "text-slate-500",
                  )}
                />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
