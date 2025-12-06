"use client";

import React, { useEffect, useState } from "react";
import Informations, { FieldConfig } from "@/components/shared/profile/Informations";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/api/auth.service";
import { User, UpdateProfileRequest } from "@/features/users/types";
import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

// Định nghĩa kiểu dữ liệu cho UI
type Profile = {
    avatar: string;
    name: string;
    class: string;
    faculty: string;
    course: string;
    gender: string;
    dob: string;
    username: string;
    email: string;
    phone: string;
};

// Cấu hình các trường hiển thị
const fields: FieldConfig<Profile>[] = [
    { key: "name", label: "Họ và tên", type: "text", colSpan: "half", editable: false },
    {
        key: "gender",
        label: "Giới tính",
        type: "select",
        options: ["Nam", "Nữ"],
        colSpan: "half",
    },
    { key: "dob", label: "Ngày sinh", type: "date", colSpan: "half" },
    { key: "username", label: "Tên tài khoản", type: "readonly", editable: false, colSpan: "half" },
    { key: "email", label: "Email", type: "email", colSpan: "half" },
    { key: "phone", label: "Số điện thoại", type: "tel", colSpan: "half" },
    { key: "course", label: "Khoá", type: "text", colSpan: "half" },
    { key: "class", label: "Lớp", type: "text", colSpan: "half" },
];

export default function StudentProfilePage() {
    const router = useRouter();
    const [data, setData] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
    const [deleteAvatar, setDeleteAvatar] = useState(false);

    // 1. Lấy dữ liệu khi vào trang
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user: User = await authService.getProfile();

                // Map API data to UI format
                let avatarUrl = user.avatarUrl;
                if (avatarUrl && avatarUrl.startsWith("/uploads")) {
                    avatarUrl = `http://localhost:8080${avatarUrl}`;
                }

                setData({
                    avatar: avatarUrl || "/images/avatars/student.png",
                    name: user.fullName,
                    class: user.className || "",
                    faculty: user.departmentName || "",
                    course: user.course?.toString() || "",
                    gender: user.sex === true ? "Nam" : user.sex === false ? "Nữ" : "",
                    dob: user.bornDate || "",
                    username: user.username,
                    email: user.email || "",
                    phone: user.phoneNumber || "",
                });
            } catch (error) {
                console.error("Failed to fetch profile", error);
                // Redirect to login if unauthorized?
                // router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Validation function
    const validateProfile = (data: Profile): boolean => {
        const newErrors: Record<string, string> = {};

        // 1. Email validation (Allow empty)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email && !emailRegex.test(data.email)) {
            newErrors.email = "Email không hợp lệ.";
        }

        // 2. Phone validation (10 digits, starts with 0)
        const phoneRegex = /^0\d{9}$/;
        if (data.phone && !phoneRegex.test(data.phone)) {
            newErrors.phone = "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0.";
        }

        // 3. Course validation (Numeric)
        if (data.course && isNaN(parseInt(data.course))) {
            newErrors.course = "Khoá phải là số.";
        }

        // 4. DOB validation (Must be 18+ years old)
        if (data.dob) {
            const dobDate = new Date(data.dob);
            const today = new Date();
            let age = today.getFullYear() - dobDate.getFullYear();
            const m = today.getMonth() - dobDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
                age--;
            }

            if (age < 18) {
                newErrors.dob = "Bạn phải đủ 18 tuổi trở lên.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 2. Xử lý cập nhật
    const handleUpdate = async (next: Profile): Promise<boolean> => {
        if (!data) return false;

        // Run validation
        if (!validateProfile(next)) {
            return false;
        }

        try {
            const updateData: UpdateProfileRequest = {
                fullName: next.name,
                email: next.email,
                phoneNumber: next.phone,
                sex: next.gender === "Nam" ? true : next.gender === "Nữ" ? false : undefined,
                bornDate: next.dob,
                course: next.course ? parseInt(next.course) : undefined,
                className: next.class,
                deleteAvatar: deleteAvatar
            };

            // Call updateProfile with both data and selectedAvatar
            const updatedUser = await authService.updateProfile(updateData, selectedAvatar || undefined);

            toast.success("Cập nhật thông tin thành công!");

            // Map updated user to UI format
            let avatarUrl = updatedUser.avatarUrl;
            if (avatarUrl && avatarUrl.startsWith("/uploads")) {
                avatarUrl = `http://localhost:8080${avatarUrl}`;
            }

            setData({
                avatar: avatarUrl || "/images/avatars/student.png",
                name: updatedUser.fullName,
                class: updatedUser.className || "",
                faculty: updatedUser.departmentName || "",
                course: updatedUser.course?.toString() || "",
                gender: updatedUser.sex === true ? "Nam" : updatedUser.sex === false ? "Nữ" : "",
                dob: updatedUser.bornDate || "",
                username: updatedUser.username,
                email: updatedUser.email || "",
                phone: updatedUser.phoneNumber || "",
            });

            setSelectedAvatar(null); // Reset selected avatar after success
            setDeleteAvatar(false);

            // Dispatch event to update UserMenu
            window.dispatchEvent(new Event('profile-updated'));
            return true;
        } catch (error) {
            console.error("Update failed", error);
            toast.error("Cập nhật thông tin thất bại.");
            return false;
        }
    };



    return (
        <div className="max-w-[1080px] mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>
                <p className="text-gray-500 mt-1">Quản lý thông tin cá nhân của bạn.</p>
            </div>

            {!data ? (
                <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50 shadow-none">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
                            <UserX className="w-8 h-8 text-gray-300" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Không tìm thấy thông tin</h3>
                            <p className="text-sm text-gray-500 mt-1">Không thể tải thông tin sinh viên.</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Informations<Profile>
                    data={data}
                    fields={fields}
                    avatarUrlKey="avatar"
                    onAvatarChange={(file, preview) => {
                        // Update preview immediately
                        if (data) {
                            setData({ ...data, avatar: preview });
                        }
                        // Store file for later submission
                        setSelectedAvatar(file);
                        setDeleteAvatar(false); // Reset delete flag if new file selected
                    }}
                    onAvatarDelete={() => {
                        setSelectedAvatar(null);
                        setDeleteAvatar(true);
                    }}
                    onSubmit={handleUpdate}
                    onCancel={() => {
                        setErrors({});
                        setSelectedAvatar(null);
                        setDeleteAvatar(false);
                    }}
                    readOnlyKeys={["username", "name"]} // Removed course and class from read-only
                    errors={errors}
                />
            )}
        </div>
    );
}
