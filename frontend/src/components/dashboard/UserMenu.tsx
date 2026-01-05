"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut, UserCog } from "lucide-react";
import { UserRole } from "@/features/users/types";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { UserProfileDialog } from "./UserProfileDialog";

const ROLE_META: Record<UserRole, { label: string; defaultAvatar: string }> = {
  ADMIN: {
    label: "Quản trị viên",
    defaultAvatar: "/images/avatars/admin.png",
  },
  STUDENT: {
    label: "Sinh viên",
    defaultAvatar: "/images/avatars/student.png",
  },
  TEACHER: {
    label: "Giảng viên",
    defaultAvatar: "/images/avatars/teacher.png",
  },
  ASSISTANT: {
    label: "Trợ lý viên",
    defaultAvatar: "/images/avatars/assistant.png",
  },
};

import { authService } from "@/features/auth/api/auth.service";

// ... (imports)

/**
 * Menu người dùng (Avatar & Dropdown).
 * Cho phép xem profile, đổi mật khẩu, đăng xuất.
 */
export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<{
    username: string;
    role: UserRole;
    fullName?: string;
    avatarUrl?: string;
  } | null>(null);
  const [open, setOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const profile = await authService.getProfile();
      // Map role from API or token. Assuming API returns role.
      // If API doesn't return role in the same format, we might need to keep token decoding for role.
      // Let's mix both: decode token for initial role/username, then fetch profile for avatar/fullname.
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode<{ sub: string; role: string }>(token);
        const role = decoded.role.replace("ROLE_", "") as UserRole;

        let avatarUrl = profile.avatarUrl;
        if (avatarUrl) {
          if (avatarUrl.startsWith("/uploads")) {
            avatarUrl = `${process.env.NEXT_PUBLIC_API_URL}${avatarUrl}`;
          }
          // if starts with http, leave as is
        }

        setUser({
          username: decoded.sub,
          role: role,
          fullName: profile.fullName,
          avatarUrl: avatarUrl,
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile for UserMenu", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();


    // Listen for custom event to refresh avatar
    const handleProfileUpdate = () => {
      fetchProfile();
    };
    window.addEventListener("profile-updated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdate);
    };
  }, []);

  const meta = user ? ROLE_META[user.role] : ROLE_META.ADMIN;

  // Determine avatar source
  const avatar = user?.avatarUrl || meta.defaultAvatar;

  // ... (rest of the component)

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
    toast.success("Đã đăng xuất thành công");
  };

  const handleUserUpdated = (newFullName: string) => {
    if (user) {
      setUser({ ...user, fullName: newFullName });
    }
  };

  if (!user) return null; // Or a loading skeleton

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Mở menu người dùng"
            className="flex items-center gap-3 rounded-full p-1 hover:bg-gray-50 transition-colors outline-none focus:ring-2 focus:ring-primary/20"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-gray-200">
              <Image
                src={avatar}
                alt={`${meta.label} avatar`}
                width={40}
                height={40}
                className="object-cover"
                priority
                unoptimized
              />
            </div>
            <div className="hidden md:flex flex-col items-start text-left mr-2">
              <span className="text-sm font-semibold text-gray-700">
                {user.username}
              </span>
              <span className="text-xs text-gray-500">{meta.label}</span>
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-[260px] rounded-xl shadow-lg p-2"
        >
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="cursor-pointer flex items-center gap-2 px-2 py-2 rounded-lg focus:bg-gray-50"
          >
            <UserCog className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-700">Quản lý tài khoản</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer flex items-center gap-2 text-rose-600 focus:text-rose-700 focus:bg-rose-50 px-2 py-2 rounded-lg mt-1"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Thoát khỏi hệ thống</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserProfileDialog
        open={open}
        onOpenChange={setOpen}
        user={user}
        onUserUpdated={handleUserUpdated}
      />
    </>
  );
}
