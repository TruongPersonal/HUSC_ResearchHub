"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Edit, Save, X, Upload, AlertTriangle } from "lucide-react";

type BaseRecord = Record<string, any>;

type FieldType = "text" | "email" | "tel" | "date" | "select" | "textarea" | "readonly";

export type FieldConfig<T extends BaseRecord> = {
  key: keyof T;                 // key trong object dữ liệu
  label: string;                // nhãn hiển thị
  type: FieldType;              // loại input
  placeholder?: string;
  options?: string[];           // cho select
  colSpan?: "full" | "half";    // layout lưới
  editable?: boolean;           // override edit/readonly theo field
};

export type InformationsProps<T extends BaseRecord> = {
  title?: string;
  breadcrumb?: string[];
  data: T;                                  // dữ liệu ban đầu
  fields: FieldConfig<T>[];
  leftSummary?: React.ReactNode;            // khu bên trái (avatar + tóm tắt)
  avatarUrlKey?: keyof T;                   // key ảnh đại diện nếu có
  onAvatarChange?: (file: File, previewUrl: string) => void;
  onSubmit?: (next: T) => Promise<void> | void;
  onCancel?: (prev: T) => void;
  readOnlyKeys?: (keyof T)[];               // luôn readonly, kể cả khi isEditing = true
  className?: string;
};

export default function Informations<T extends BaseRecord>({
  title = "Thông tin cá nhân",
  data,
  fields,
  leftSummary,
  avatarUrlKey,
  onAvatarChange,
  onSubmit,
  onCancel,
  readOnlyKeys = [],
  className = "",
}: InformationsProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<T>(data);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // reset khi data ban đầu đổi (vd: fetch lại từ API)
  useEffect(() => {
    setValue(data);
    setDirty(false);
    setIsEditing(false);
  }, [data]);

  // thay đổi field
  const handleChange = <K extends keyof T>(key: K, next: T[K]) => {
    setValue((prev) => {
      const merged = { ...prev, [key]: next };
      setDirty(JSON.stringify(merged) !== JSON.stringify(data));
      return merged;
    });
  };

  // avatar preview
  const handleAvatarInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !avatarUrlKey) return;
    const preview = URL.createObjectURL(file);
    handleChange(avatarUrlKey, preview as any);
    onAvatarChange?.(file, preview);
  };

  // lưu
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await onSubmit?.(value);
      setDirty(false);
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.message || "Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  // huỷ
  const handleCancel = () => {
    setValue(data);
    setDirty(false);
    setIsEditing(false);
    onCancel?.(data);
  };

  const leftPanel = useMemo(() => {
    if (!avatarUrlKey) return leftSummary;

    const avatarUrl = (value?.[avatarUrlKey] as unknown as string) || "/images/Avatar/placeholder.png";

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            className="rounded-full w-[150px] h-[150px] object-cover border-4 border-white shadow-md"
            src={avatarUrl}
            alt="Avatar"
          />
          {isEditing && (
            <label className="absolute bottom-2 right-2 bg-amber-400 hover:bg-amber-500 p-2 rounded-full cursor-pointer shadow">
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarInput} />
              <Upload className="w-4 h-4 text-white" />
            </label>
          )}
        </div>
        {leftSummary && <div className="w-full mt-6">{leftSummary}</div>}
      </div>
    );
  }, [avatarUrlKey, value, isEditing, leftSummary]);

  return (
    <div className={`relative w-5xl mx-auto ${className} mt-30 mb-15`}>
      {/* Action bar */}
      <div className="flex justify-between items-center mt-4 px-1">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      </div>

      {/* Main */}
      <div className="mt-4">
        <div className="bg-white shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-xl p-6 mb-6">
          {leftPanel}
        </div>

        <div className="bg-white shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-xl p-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {fields.map((f) => {
              const k = f.key as string;
              const isReadOnly =
                !isEditing ||
                f.type === "readonly" ||
                f.editable === false ||
                (readOnlyKeys as string[]).includes(k);

              const common = {
                id: k,
                value: (value as any)[k] ?? "",
                onChange: (e: any) => handleChange(f.key as any, e.target?.value ?? e),
                className:
                  "w-full border rounded-md px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300",
                placeholder: f.placeholder,
              };

              const colClass = f.colSpan === "full" ? "xl:col-span-2" : "";

              return (
                <div className={colClass} key={k}>
                  <label
                    htmlFor={k}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {f.label}
                  </label>

                  {(() => {
                    if (isReadOnly) {
                      const display =
                        f.type === "date" && (value as any)[k]
                          ? new Date((value as any)[k]).toLocaleDateString("vi-VN")
                          : (value as any)[k] ?? "—";
                      return (
                        <div className="h-[38px] flex items-center px-3 rounded-md bg-gray-50 border text-gray-700">
                          <span className="truncate">{String(display)}</span>
                        </div>
                      );
                    }

                    if (f.type === "select") {
                      return (
                        <select {...common}>
                          {(f.options ?? []).map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      );
                    }

                    if (f.type === "textarea") {
                      return (
                        <textarea
                          {...common}
                          rows={5}
                          className="w-full border rounded-md px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                        />
                      );
                    }

                    // text | email | tel | date
                    return (
                      <input
                        {...common}
                        type={f.type === "date" ? "date" : f.type}
                      />
                    );
                  })()}
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>
      
    <div className="flex justify-between items-center mt-6 px-1">
        <div className="flex items-center ml-auto gap-4">
          {dirty && (
            <span className="inline-flex items-center gap-1 text-amber-600 text-sm">
              <AlertTriangle className="w-4 h-4" />
              Chưa lưu thay đổi
            </span>
          )}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 h-9 px-3 rounded-md bg-amber-300 hover:bg-amber-400 text-gray-800 shadow-sm transition"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 h-9 px-3 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm transition"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 h-9 px-3 rounded-md bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white shadow-sm transition"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
