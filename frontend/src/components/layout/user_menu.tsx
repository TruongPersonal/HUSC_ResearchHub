"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LogOut, UserCog, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type UserRole = "admin" | "student" | "teacher" | "assistant";

const ROLE_META: Record<
  UserRole,
  { label: string; greet: string; defaultAvatar: string }
> = {
  admin: {
    label: "Quản trị viên",
    greet: "Xin chào, Quản trị viên 👋",
    defaultAvatar: "/icons/admin.png",
  },
  student: {
    label: "Sinh viên",
    greet: "Xin chào, Sinh viên 👋",
    defaultAvatar: "/icons/student.png",
  },
  teacher: {
    label: "Giảng viên",
    greet: "Xin chào, Giảng viên 👋",
    defaultAvatar: "/icons/teacher.png",
  },
  assistant: {
    label: "Trợ lý viên",
    greet: "Xin chào, Trợ lý viên 👋",
    defaultAvatar: "/icons/assistant.png",
  },
};

export function UserMenu({
  role = "student",
  displayName = "",
  username = "",
  avatarUrl,
}: {
  role?: UserRole;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
}) {
  const router = useRouter();
  const meta = ROLE_META[role];

  const avatar = useMemo(
    () => avatarUrl || meta.defaultAvatar,
    [avatarUrl, meta.defaultAvatar]
  );

  const [open, setOpen] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogout = () => {
    router.push("/");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API update password
    setOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Mở menu người dùng"
            className="flex items-center gap-3 rounded-full p-1 hover:bg-gray-50"
          >
            <Image
              src={avatar}
              alt={`${meta.label} avatar`}
              width={40}
              height={40}
              className="rounded-full object-cover"
              priority
            />
            <div className="hidden sm:flex flex-col items-start text-left leading-tight">
              <span className="text-sm font-medium">{displayName}</span>
              <span className="text-xs text-muted-foreground">{meta.label}</span>
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[260px] rounded-xl shadow-lg">
          <DropdownMenuLabel className="text-sm">{meta.greet}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="cursor-pointer flex items-center gap-2"
          >
            <UserCog className="w-4 h-4 text-gray-600" />
            Quản lý tài khoản
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer flex items-center gap-2 text-rose-600"
          >
            <LogOut className="w-4 h-4" />
            Thoát khỏi hệ thống
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog rút gọn */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[420px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Thông tin tài khoản</DialogTitle>
            <DialogDescription>
              Xem và thay đổi mật khẩu của bạn.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="flex flex-col gap-3">
              <div>
                <Label className="mb-1 block">Tên đăng nhập</Label>
                <Input value={username} disabled />
              </div>

              <div className="relative">
                <Label className="mb-1 block">Mật khẩu</Label>
                <Input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="**********"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-2 top-[20px] h-8 w-8 grid place-items-center rounded-md hover:bg-gray-100"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">Lưu thay đổi</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}