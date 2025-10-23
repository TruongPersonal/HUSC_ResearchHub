"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useAcademicYears } from "@/lib/hooks/useAcademicYears";
import { useMemo, useState } from "react";
import { AcademicYearSelect } from "../common/academic_year_select";
import { NavItem, pickActiveHref } from "@/lib/nav";

/** Sidebar phụ cho quick links/bộ lọc… (có thể để trống nếu không cần) */
export default function LearnSidebar({
  items = [],
}: {
    items: NavItem[];
}) {
  const pathname = usePathname();
  const activeHref = pickActiveHref(items, pathname);

  const { years, loading } = useAcademicYears();

  // Mặc định chọn năm đầu danh sách khi có dữ liệu
  const defaultYear = useMemo(() => (years[0] ? years[0] : undefined), [years]);
  const [year, setYear] = useState<string | undefined>(undefined);

  // Đồng bộ default khi data về
  if (!year && defaultYear) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    setYear(defaultYear);
  }

  return (
    <>
      <AcademicYearSelect
        className="absolute z-30 top-30 bg-white"
        value={year}
        onChange={setYear}
        options={years} // dữ liệu hiện là mock; sau này lấy từ API/CSDL
        isLoading={loading}
      />
      <aside className="w-[200px] min-h-[calc(100vh-200px)] sticky z-20 bg-white border border-neutral-300 mt-50 rounded-tr-3xl flex flex-col justify-between">
        <nav className="py-10">
          <ul className="space-y-2">
            {items.map(({ href, label }) => {
              const isActive = href === activeHref;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block w-[200px] ml-[-2px] px-3 py-5 rounded-r-sm text-sm transition
                    ${
                      isActive
                        ? "bg-neutral-900 text-white font-semibold"
                        : "text-neutral-800 hover:bg-neutral-100"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 font-semibold bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-lg transition-colors"
          >
            Đăng xuất <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>
    </>
  );
}
