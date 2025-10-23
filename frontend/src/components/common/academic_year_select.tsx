"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

/**
 * AcademicYearSelect (Common UI)
 * - Không phụ thuộc nguồn dữ liệu: nhận options từ props
 * - Desktop-only: w-[220px] cố định, không breakpoint
 */
export function AcademicYearSelect({
  value,
  onChange,
  options,
  placeholder = "Chọn năm học",
  className = "",
  isLoading = false,
}: {
  value: string | undefined;
  onChange: (v: string) => void;
  options: string[];      // ví dụ: ["2025-2026","2026-2027",...]
  placeholder?: string;
  className?: string;
  isLoading?: boolean;    // hiển thị khi đang tải
}) {
  return (
    <Select value={value} onValueChange={onChange} disabled={isLoading || options.length === 0}>
      <SelectTrigger className={`w-[200px] rounded-none ${className}`}>
        <SelectValue placeholder={isLoading ? "Đang tải..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Năm học</SelectLabel>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt.replace("-", "–")}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
