"use client";

import { useEffect, useState } from "react";

/**
 * useAcademicYears
 * - TẠM THỜI: trả về danh sách mẫu (mock)
 * - SAU NÀY: thay phần fetch() để gọi API/CSDL
 */
export function useAcademicYears() {
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      // TODO: thay bằng gọi API thật, ví dụ: const res = await fetch("/api/academic-years")
      //       const data = await res.json(); setYears(data)
      await new Promise((r) => setTimeout(r, 350)); // giả lập độ trễ
      const mock = ["2025-2026"];
      if (!cancelled) {
        setYears(mock);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { years, loading };
}
