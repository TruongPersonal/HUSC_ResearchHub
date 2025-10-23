"use client";

import { useMemo, useState, useEffect } from "react";

/* ========== Types ========== */
type YearStage = "Đang đăng ký" | "Đang xét duyệt" | "Đang thực hiện";

type YearRow = {
  id: string;        // dùng luôn làm mã "2024-2025"
  startYear: number; // 2024
  endYear: number;   // 2025
  stage: YearStage;
};

type StageFilter = "ALL" | YearStage;

/* ========== Mock data (đã chuẩn hoá) ========== */
const MOCK_YEARS: YearRow[] = [
  { id: "2022-2023", startYear: 2022, endYear: 2023, stage: "Đang thực hiện" },
  { id: "2023-2024", startYear: 2023, endYear: 2024, stage: "Đang thực hiện" },
  { id: "2024-2025", startYear: 2024, endYear: 2025, stage: "Đang thực hiện" },
  { id: "2025-2026", startYear: 2025, endYear: 2026, stage: "Đang đăng ký" }, // editable
];

/* ========== Badges ========== */
const StageBadge = ({ v }: { v: YearStage }) => {
  const cls: Record<YearStage, string> = {
    "Đang đăng ký": "border-blue-200 bg-blue-50 text-blue-700",
    "Đang xét duyệt": "border-amber-200 bg-amber-50 text-amber-700",
    "Đang thực hiện": "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${cls[v]}`}>
      {v}
    </span>
  );
};

/* ========== Page ========== */
export default function AssistantSessionsPage() {
  const [rows, setRows] = useState<YearRow[]>(MOCK_YEARS);

  // Năm hiện tại theo dữ liệu
  const maxStartYear = useMemo(() => Math.max(...rows.map((r) => r.startYear)), [rows]);
  const isLocked = (r: YearRow) => r.startYear < maxStartYear;

  /* Filters */
  const [q, setQ] = useState("");
  const [stageFilter, setStageFilter] = useState<StageFilter>("ALL");

  /* Paging */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* Row edit */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftStage, setDraftStage] = useState<YearStage | null>(null);

  const STAGE_OPTIONS: YearStage[] = ["Đang đăng ký", "Đang xét duyệt", "Đang thực hiện"];

  /* Derived list */
  const filtered = useMemo(() => {
    return rows.filter((y) => {
      const matchQ = !q || y.id.toLowerCase().includes(q.toLowerCase());
      // locked vẫn xem như “Đang thực hiện” cho mục đích lọc, nhưng UI sẽ KHÔNG hiển thị trạng thái
      const visibleStage: YearStage = isLocked(y) ? "Đang thực hiện" : y.stage;
      const matchStage = stageFilter === "ALL" ? true : visibleStage === stageFilter;
      return matchQ && matchStage;
    });
  }, [rows, q, stageFilter, maxStartYear]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  /* Edit handlers */
  const startEditRow = (id: string) => {
    const r = rows.find((x) => x.id === id);
    if (!r || isLocked(r)) return;
    setEditingId(id);
    setDraftStage(r.stage);
  };

  const cancelEditRow = () => {
    setEditingId(null);
    setDraftStage(null);
  };

  const saveEditRow = (id: string) => {
    if (!draftStage) return;
    const r = rows.find((x) => x.id === id);
    if (!r || isLocked(r)) return;
    setRows((prev) => prev.map((r2) => (r2.id === id ? { ...r2, stage: draftStage } : r2)));
    setEditingId(null);
    setDraftStage(null);
  };

  return (
    <div className="min-w-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Quản lý phiên</h1>
        <p className="text-sm text-neutral-600">
            Mở phiên, theo dõi tiến độ trong năm học.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="md:col-span-1">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo mã"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            value={stageFilter}
            onChange={(e) => {
              setStageFilter(e.target.value as StageFilter);
              setPage(1);
            }}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">— Tất cả trạng thái —</option>
            {STAGE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="max-h-[520px] overflow-auto">
          <table className="min-w-full table-fixed">
            <thead className="sticky top-0 z-10 border-b border-neutral-200 bg-neutral-50 text-left text-[13px] uppercase tracking-wide text-neutral-600">
              <tr>
                <th className="w-40 px-4 py-3">Mã</th>
                <th className="w-32 px-4 py-3">Năm bắt đầu</th>
                <th className="w-28 px-4 py-3">Năm kết thúc</th>
                <th className="w-40 px-4 py-3">Trạng thái</th>
                <th className="w-24 px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-sm">
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-neutral-500">
                    Không có dữ liệu phù hợp.
                  </td>
                </tr>
              )}

              {pageData.map((r) => {
                const locked = isLocked(r);
                const editing = editingId === r.id && !locked;
                const visibleStage: YearStage = locked ? "Đang thực hiện" : r.stage;

                return (
                  <tr key={r.id} className="transition-colors hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-900">{r.id}</td>
                    <td className="px-4 py-3">{r.startYear}</td>
                    <td className="px-4 py-3">{r.endYear}</td>

                    {/* === Cột Trạng thái ===
                        - Locked: KHÔNG hiển thị trạng thái (không badge), chỉ hiện chip "Khoá"
                        - Editable + not editing: hiện badge trạng thái
                        - Editing: hiện select để đổi
                    */}
                    <td className="px-4 py-3">
                      {locked ? (
                        <span className="rounded-full border border-neutral-300 bg-neutral-50 px-2 py-0.5 text-[11px] text-neutral-600">
                          Khoá
                        </span>
                      ) : editing ? (
                        <select
                          value={draftStage ?? visibleStage}
                          onChange={(e) => setDraftStage(e.target.value as YearStage)}
                          className="w-full rounded-md border border-blue-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                        >
                          {STAGE_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <StageBadge v={visibleStage} />
                      )}
                    </td>

                    {/* Cột Thao tác */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        {locked ? (
                          <span className="text-neutral-300">—</span>
                        ) : !editing ? (
                          <button
                            onClick={() => startEditRow(r.id)}
                            className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm hover:bg-neutral-100"
                          >
                            Sửa
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => saveEditRow(r.id)}
                              className="rounded-md bg-blue-600 px-2 py-1 text-sm font-medium text-white hover:bg-blue-700"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={cancelEditRow}
                              className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm hover:bg-neutral-100"
                            >
                              Hủy
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-700">
        <div>
          Hiển thị {pageData.length ? (page - 1) * pageSize + 1 : 0}
          {"–"}
          {Math.min(page * pageSize, filtered.length)} / {filtered.length}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Mỗi trang</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-md border border-neutral-300 bg-white px-2 py-1 disabled:opacity-50"
          >
            Trước
          </button>
          <span>
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-md border border-neutral-300 bg-white px-2 py-1 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
