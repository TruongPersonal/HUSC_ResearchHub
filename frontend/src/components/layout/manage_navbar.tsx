"use client";

import { useEffect, useMemo, useState } from "react";
import { AcademicYearSelect } from "../common/academic_year_select";
import { UserMenu } from "./user_menu";
import { useAcademicYears } from "@/lib/hooks/useAcademicYears";
// Nếu bạn dùng NextAuth, có thể lấy role từ session:
// import { useSession } from "next-auth/react";

/* ========= Types ========= */
type Role = "admin" | "assistant";

/* ========= Role-based UI config ========= */
const ROLE_UI: Record<
  Role,
  {
    title: string;
    showYearSelect: boolean; // ví dụ: ADMIN cần chọn năm, ASSISTANT thì ẩn (có thể bật lại)
  }
> = {
  admin: {
    title: "Admin Panel",
    showYearSelect: false,
  },
  assistant: {
    title: "Assistant Panel",
    showYearSelect: true, // đổi thành false nếu bạn muốn ẩn ở role này
  },
};

export default function ManageNavbar({
  role = "admin",
}: {
  role?: Role; // cho phép truyền prop; nếu dùng NextAuth thì bỏ prop này và đọc từ session
}) {
  // const { data } = useSession();
  // const role = (data?.user as any)?.role as Role ?? "ASSISTANT";

  const { years, loading } = useAcademicYears();

  const defaultYear = useMemo(
    () => (years && years.length ? years[0] : undefined),
    [years]
  );
  const [year, setYear] = useState<string | undefined>(undefined);

  // Đồng bộ default khi data về (tránh setState trong render)
  useEffect(() => {
    if (!year && defaultYear) setYear(defaultYear);
  }, [defaultYear, year]);

  const ui = ROLE_UI[role];

  return (
    <header className="h-17 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      {/* Trái: tiêu đề + (tuỳ role) chọn năm học */}
      <div className="flex items-center ">
        <div className="font-bold text-xl w-[168px] flex items-center h-17 border-r border-gray-200">
          {ui.title}
        </div>
        {ui.showYearSelect && (
          <AcademicYearSelect
            className="ml-5"
            value={year}
            onChange={setYear}
            options={years} // hiện mock; sau này lấy từ API/CSDL
            isLoading={loading}
          />
        )}
      </div>

      {/* Phải: avatar / menu người dùng (có thể truyền role để UserMenu tuỳ biến item) */}
      <div>
        <UserMenu
          role={role}
          displayName={role === "admin" ? "Nguyễn Văn A" : "Lê Thị B"}
          username={role === "admin" ? "admin1" : "assistant1"}
        />
      </div>
    </header>
  );
}
