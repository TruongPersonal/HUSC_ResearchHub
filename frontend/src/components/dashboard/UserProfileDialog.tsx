"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { authService } from "@/features/auth/api/auth.service";
import { useRouter } from "next/navigation";

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { username: string; fullName?: string; role?: string };
  onUserUpdated: (newFullName: string) => void;
}

/**
 * Dialog xem và cập nhật thông tin cá nhân.
 * Hỗ trợ đổi tên hiển thị và mật khẩu.
 */
export function UserProfileDialog({
  open,
  onOpenChange,
  user,
  onUserUpdated,
}: UserProfileDialogProps) {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [password, setPassword] = useState("");
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Initialize fullName when user loads or dialog opens
  useEffect(() => {
    if (user?.fullName) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFullName(user.fullName);
    }
  }, [user, open]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
    toast.success("Đã đăng xuất thành công");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let hasChanges = false;

      // 1. Handle Profile Update (Name)
      if (fullName && fullName !== user?.fullName) {
        hasChanges = true;
        toast.loading("Đang cập nhật thông tin...");
        const res = await authService.updateProfile({ fullName });

        // Dispatch event to update other components
        window.dispatchEvent(new Event("profile-updated"));

        toast.dismiss();
        toast.success("Cập nhật thông tin thành công");

        // Notify parent to update local state
        onUserUpdated(fullName);
      }

      // 2. Handle Password Change (if fields are filled)
      if (oldPassword || password) {
        hasChanges = true;
        if (!oldPassword || !password) {
          // If one field is filled but not both
          toast.error(
            "Vui lòng nhập đầy đủ mật khẩu cũ và mới để đổi mật khẩu",
          );
          return;
        }

        toast.loading("Đang cập nhật mật khẩu...");
        await authService.changePassword({
          oldPassword,
          newPassword: password,
        });

        toast.dismiss();
        toast.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
        onOpenChange(false);

        // Logout and redirect to login
        handleLogout();
        return; // Exit function as we are logging out
      }

      if (!hasChanges) {
        toast.info("Không có thay đổi nào để lưu.");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.dismiss();
      console.error("Update failed", error);
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Cập nhật thất bại";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[420px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl">Thông tin tài khoản</DialogTitle>
          <DialogDescription>
            Xem và cập nhật thông tin cá nhân của bạn.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Họ và tên
              </Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ và tên"
              />
            </div>

            {user.role !== "ADMIN" && user.role !== "ASSISTANT" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Đổi mật khẩu
                </Label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Input
                      type={showOldPwd ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Mật khẩu cũ"
                      className="pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPwd((v) => !v)}
                      className="absolute right-0 top-0 h-full w-8 grid place-items-center text-gray-400 hover:text-gray-600"
                    >
                      {showOldPwd ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  <div className="relative flex-1">
                    <Input
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mật khẩu mới"
                      className="pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-0 top-0 h-full w-8 grid place-items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPwd ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-lg"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="rounded-lg bg-primary hover:bg-primary/90"
            >
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
