"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Camera, Save, X, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type FieldConfig<T> = {
  key: keyof T;
  label: string;
  type: "text" | "email" | "tel" | "date" | "select" | "readonly";
  options?: string[];
  colSpan?: "full" | "half";
  editable?: boolean;
};

interface InformationsProps<T> {
  title?: string;
  data: T | null;
  fields: FieldConfig<T>[];
  avatarUrlKey: keyof T;
  leftSummary?: React.ReactNode;
  onAvatarChange?: (file: File, preview: string) => void;
  onAvatarDelete?: () => void;
  onSubmit?: (data: T) => Promise<boolean | void> | boolean | void;
  onCancel?: () => void;
  errors?: Record<string, string>;
  readOnlyKeys?: (keyof T)[];
  className?: string;
  roleLabel?: string;
}

/**
 * Form cập nhật thông tin cá nhân chi tiết.
 * Bao gồm các trường: Họ tên, Email, SĐT, Giới tính, Ngày sinh, v.v.
 * Hỗ trợ upload Avatar.
 */
export default function Informations<T extends Record<string, any>>({
  // title, // Removed unused title
  data,
  fields,
  avatarUrlKey,
  leftSummary,
  onAvatarChange,
  onAvatarDelete,
  onSubmit,
  onCancel,
  errors,
  readOnlyKeys = [],
  className,
  roleLabel,
}: InformationsProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<T | null>(data);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => {
        // Simple check to avoid loop if data object reference changes but content might be same?
        // Since generic T is Record, we assume if reference changes we update.
        // BUT to satisfy linter "set-state-in-effect", we ensure we don't just setState blindly.
        // Actually, the previous code `setFormData(data)` runs on every data change.
        // If `data` comes from a stable source (React Query), it's fine.
        // If not, we should check.
        if (JSON.stringify(prev) !== JSON.stringify(data)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          return data;
        }
        return prev;
      });

      if (data[avatarUrlKey]) {
        setAvatarPreview(prev => {
          if (prev !== data[avatarUrlKey]) return data[avatarUrlKey] as string;
          return prev;
        });
      }
    }
  }, [data, avatarUrlKey]);

  if (!data || !formData) return null;

  const handleInputChange = (key: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev!, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setAvatarPreview(preview);
      onAvatarChange?.(file, preview);
    }
  };

  const handleSubmit = async () => {
    try {
      if (onSubmit) {
        const result = await onSubmit(formData);
        // If result is explicitly false, do not close edit mode
        if (result === false) {
          return;
        }
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Có lỗi xảy ra khi lưu thông tin");
    }
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
    if (data[avatarUrlKey]) {
      setAvatarPreview(data[avatarUrlKey] as string);
    }
    onCancel?.();
  };

  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative",
        className,
      )}
    >
      {/* Edit Actions - Absolute Top Right */}
      <div className="absolute top-6 right-6 z-10">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm text-sm font-medium"
          >
            <Pencil className="w-4 h-4" />
            Chỉnh sửa
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm text-sm font-medium"
            >
              <X className="w-4 h-4" />
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-200 text-sm font-medium"
            >
              <Save className="w-4 h-4" />
              Lưu
            </button>
          </div>
        )}
      </div>

      <div className="p-8">
        <div className="flex flex-col gap-10">
          {/* Top Section: Avatar & Summary (Stacked & Centered) */}
          <div className="flex flex-col items-center space-y-6 border-b border-gray-100 pb-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-gray-100 relative">
                <Image
                  src={avatarPreview || "/images/avatars/student.png"}
                  alt="Avatar"
                  fill
                  className="object-cover"
                  unoptimized // Bypass Next.js optimization to allow localhost URLs
                />
              </div>
              {isEditing && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110"
                    title="Thay đổi ảnh"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setAvatarPreview("/images/avatars/student.png"); // Set to default immediately
                      if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
                      onAvatarDelete?.();
                    }}
                    className="absolute top-1 right-1 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all transform hover:scale-110"
                    title="Xoá ảnh"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* Name & Role */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">
                {String(data.name || "User")}
              </h3>
              <div className="flex items-center justify-center gap-2">
                <span
                  className={cn(
                    "text-sm font-medium px-3 py-1 rounded-full",
                    roleLabel === "Giảng viên"
                      ? "text-green-600 bg-green-50"
                      : "text-blue-600 bg-blue-50",
                  )}
                >
                  {roleLabel || "Sinh viên"}
                </span>
                <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  {String(data.faculty || "Công nghệ thông tin")}
                </span>
              </div>
            </div>

            {/* Summary Info (Horizontal Grid) */}
            <div className="w-full max-w-3xl">{leftSummary}</div>
          </div>

          {/* Bottom Section: Form Fields */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {fields.map((field) => {
                const isReadOnly =
                  !isEditing ||
                  field.editable === false ||
                  field.type === "readonly" ||
                  readOnlyKeys.includes(field.key);

                return (
                  <div
                    key={String(field.key)}
                    className={cn(
                      field.colSpan === "full"
                        ? "md:col-span-2"
                        : "md:col-span-1",
                    )}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <div className="relative">
                        <select
                          disabled={isReadOnly}
                          value={String(formData[field.key] || "")}
                          onChange={(e) =>
                            handleInputChange(field.key, e.target.value)
                          }
                          className={cn(
                            "w-full px-4 py-2.5 rounded-xl border bg-white text-gray-900 transition-all focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none",
                            isReadOnly
                              ? "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                              : errors?.[String(field.key)]
                                ? "border-red-500 focus:border-red-500 bg-red-50/10"
                                : "border-gray-200 focus:border-blue-500",
                          )}
                        >
                          <option value="" disabled></option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        {!isReadOnly && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        type={field.type === "readonly" ? "text" : field.type}
                        disabled={isReadOnly}
                        value={String(formData[field.key] || "")}
                        onChange={(e) =>
                          handleInputChange(field.key, e.target.value)
                        }
                        className={cn(
                          "w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500/20 outline-none",
                          isReadOnly
                            ? "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                            : errors?.[String(field.key)]
                              ? "border-red-500 focus:border-red-500 bg-red-50/10"
                              : "border-gray-200 bg-white text-gray-900 focus:border-blue-500",
                        )}
                      />
                    )}
                    {errors?.[String(field.key)] && (
                      <p className="mt-1 text-sm text-red-500 font-medium animate-in fade-in-0 slide-in-from-top-1">
                        {errors[String(field.key)]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
