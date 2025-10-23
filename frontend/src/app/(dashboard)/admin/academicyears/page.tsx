"use client";

import { useMemo, useState, useEffect } from "react";

/* ========== Types ========== */
type YearStage = "Bắt đầu" | "Kết thúc";

type YearRow = {
  id: string;
  code: string; // "2024-2025"
  startYear: number; // 2024
  endYear: number;   // 2025
  isActive: boolean;
  isCurrent: boolean;
  stage: YearStage;
};

type ActiveFilter = "ALL" | "ACTIVE" | "INACTIVE";

/* ========== Mock data (2 trạng thái) ========== */
const MOCK_YEARS: YearRow[] = [
  {
    id: "y2022",
    code: "2022-2023",
    startYear: 2022,
    endYear: 2023,
    isActive: false,
    isCurrent: false,
    stage: "Kết thúc",
  },
  {
    id: "y2023",
    code: "2023-2024",
    startYear: 2023,
    endYear: 2024,
    isActive: true,
    isCurrent: false,
    stage: "Bắt đầu",
  },
  {
    id: "y2024",
    code: "2024-2025",
    startYear: 2024,
    endYear: 2025,
    isActive: true,
    isCurrent: true,
    stage: "Bắt đầu",
  },
];

/* ========== Utils ========== */
const genId = (start: number) => `y${start}`;
const codeOf = (start: number, end: number) => `${start}-${end}`;
const padEnDash = (code: string) => code.replace("-", "–");

/* ========== Badges ========== */
const ActiveBadge = ({ on }: { on: boolean }) => (
  <span
    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${
      on
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-neutral-200 bg-neutral-50 text-neutral-600"
    }`}
  >
    {on ? "Bật" : "Tắt"}
  </span>
);

const StageBadge = ({ v }: { v: YearStage }) => {
  const cls: Record<YearStage, string> = {
    "Bắt đầu": "border-blue-200 bg-blue-50 text-blue-700",
    "Kết thúc": "border-neutral-200 bg-neutral-50 text-neutral-600",
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${cls[v]}`}>
      {v}
    </span>
  );
};

/* ========== Page ========== */
export default function AcademicYearsPage() {
  /* Data */
  const [rows, setRows] = useState<YearRow[]>(MOCK_YEARS);

  /* Filters */
  const [q, setQ] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("ALL");

  /* Paging */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* Create toggle */
  const [showCreate, setShowCreate] = useState(false);

  /* Create form state */
  const [createStart, setCreateStart] = useState<number>(nextStartSuggestion(MOCK_YEARS));
  const [createEnd, setCreateEnd] = useState<number>(createStart + 1);
  const createStage: YearStage = "Bắt đầu"; // mặc định
  const createCode = codeOf(createStart, createEnd);

  useEffect(() => {
    // Start đổi -> End auto = Start + 1
    setCreateEnd(createStart + 1);
  }, [createStart]);

  /* Derived list */
  const filtered = useMemo(() => {
    return rows.filter((y) => {
      const matchQ = !q || y.code.toLowerCase().includes(q.toLowerCase());
      const matchActive =
        activeFilter === "ALL" ? true : activeFilter === "ACTIVE" ? y.isActive : !y.isActive;
      return matchQ && matchActive;
    });
  }, [rows, q, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  /* ========== Row-level edit state ========== */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<YearRow> | null>(null);

  const isRowEditing = (id: string) => editingId === id;

  const startEditRow = (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    setEditingId(id);
    setDraft({ ...row });
  };

  const cancelEditRow = () => {
    setEditingId(null);
    setDraft(null);
  };

  const saveEditRow = (id: string) => {
    if (!draft) return;

    // Validate start/end & uniqueness/overlap
    const start = Number(draft.startYear);
    if (!Number.isInteger(start) || start < 2000 || start > 3000) {
      alert("Năm bắt đầu không hợp lệ hoặc ngoài phạm vi (2000–3000).");
      return;
    }
    const end = start + 1;
    const newCode = codeOf(start, end);

    if (rows.some((r) => r.id !== id && r.code === newCode)) {
      alert("Mã năm học đã tồn tại.");
      return;
    }
    if (rows.some((r) => r.id !== id && overlapsHalfOpen(start, end, r.startYear, r.endYear))) {
      alert("Khoảng năm học bị chồng lấn với năm đã có.");
      return;
    }

    applyUpdate(id, {
      startYear: start,
      endYear: end,
      code: newCode,
      isActive: draft.isActive ?? getRow(rows, id)?.isActive ?? false,
      stage: (draft.stage as YearStage) ?? (getRow(rows, id)?.stage as YearStage),
    });

    // TODO: PUT/PATCH to API as needed
    setEditingId(null);
    setDraft(null);
  };

  const onDraftChange = (key: keyof YearRow, value: any) => {
    setDraft((d) => ({ ...(d || {}), [key]: value }));
  };

  /* Update helpers */
  const applyUpdate = (id: string, patch: Partial<YearRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const setCurrent = (id: string) => {
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        isCurrent: r.id === id,
        // nếu là năm hiện tại và đang "Kết thúc" thì bật lại "Bắt đầu"
        stage: r.id === id ? (r.stage === "Kết thúc" ? "Bắt đầu" : r.stage) : r.stage,
      }))
    );
    // TODO: PATCH /api/academic-years/{id}/current
  };

  /* Create */
  const createValidate = () => {
    if (!Number.isInteger(createStart) || !Number.isInteger(createEnd)) {
      alert("Năm không hợp lệ.");
      return false;
    }
    if (createStart < 2000 || createStart > 3000 || createEnd < 2001 || createEnd > 3001) {
      alert("Năm ngoài phạm vi hợp lý (2000–3001).");
      return false;
    }
    if (createEnd !== createStart + 1) {
      alert("Năm kết thúc phải bằng năm bắt đầu + 1.");
      return false;
    }
    const code = codeOf(createStart, createEnd);
    if (rows.some((r) => r.code === code)) {
      alert("Mã năm học đã tồn tại.");
      return false;
    }
    if (rows.some((r) => overlapsHalfOpen(createStart, createEnd, r.startYear, r.endYear))) {
      alert("Khoảng năm học bị chồng lấn với năm đã có.");
      return false;
    }
    return true;
  };

  const handleCancelCreate = () => {
    // reset rồi đóng form
    const next = nextStartSuggestion(rows);
    setCreateStart(next);
    setCreateEnd(next + 1);
    setShowCreate(false);
  };

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createValidate()) return;

    const newRow: YearRow = {
      id: genId(createStart),
      code: codeOf(createStart, createEnd),
      startYear: createStart,
      endYear: createEnd,
      isActive: false,          // ⬅️ mặc định KHÔNG kích hoạt
      isCurrent: false,
      stage: "Bắt đầu",         // mặc định trạng thái "Bắt đầu"
    };
    // TODO: POST /api/academic-years
    setRows((prev) => [newRow, ...prev]);
    // reset gợi ý tiếp theo
    const next = nextStartSuggestion([newRow, ...rows]);
    setCreateStart(next);
    setCreateEnd(next + 1);
    setShowCreate(false);
  };

  /* Icons */
  const IconStar = ({ filled }: { filled?: boolean }) => (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 cursor-pointer ${
        filled ? "fill-amber-400 stroke-amber-400" : "stroke-current"
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );

  return (
    <div className="min-w-0">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Quản lý năm học</h1>
          <p className="text-sm text-neutral-600">Thêm năm học, kích hoạt & chọn trạng thái năm học.</p>
        </div>

        <button
          onClick={() => setShowCreate((v) => !v)}
          className="rounded-lg border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showCreate ? "Đóng form" : "Thêm năm học"}
        </button>
      </div>

      {/* Create card (toggle) */}
      {showCreate && (
        <form onSubmit={submitCreate} className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="mb-1 block text-sm font-medium">Năm bắt đầu *</label>
              <input
                type="number"
                value={createStart}
                onChange={(e) => setCreateStart(Number(e.target.value))}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                min={2000}
                max={3000}
              />
            </div>

            {/* End: tự tăng, không cho nhập */}
            <div className="md:col-span-6">
              <label className="mb-1 block text-sm font-medium">Năm kết thúc</label>
              <input
                value={createEnd}
                disabled
                className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm"
              />
            </div>

            {/* Header trạng thái + mã */}
            <div className="md:col-span-12 mt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <b className="text-sm text-neutral-700">Trạng thái mặc định:</b>
                <StageBadge v={createStage} />
              </div>

              <div className="flex items-center gap-2">
                <b className="text-sm text-neutral-700">Mã: </b>
                <span className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1.5">
                  <span className="font-mono text-sm font-semibold tracking-tight">{padEnDash(createCode)}</span>
                </span>
                <span className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-2 py-0.5 text-[11px] text-neutral-600">
                  AUTO
                </span>
              </div>
            </div>

            <div className="md:col-span-12 mt-1 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelCreate}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Tạo năm học
              </button>
            </div>
          </div>
        </form>
      )}

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
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value as ActiveFilter);
              setPage(1);
            }}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">— Trạng thái kích hoạt —</option>
            <option value="ACTIVE">Kích hoạt</option>
            <option value="INACTIVE">Không kích hoạt</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="max-h-[520px] overflow-auto">
          <table className="min-w-full table-fixed">
            <thead className="sticky top-0 z-10 bg-neutral-50 text-left text-[13px] uppercase tracking-wide text-neutral-600 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 w-12 text-center">★</th>
                <th className="px-4 py-3 w-40">Mã</th>
                <th className="px-4 py-3 w-32">Năm bắt đầu</th>
                <th className="px-4 py-3 w-28">Năm kết thúc</th>
                <th className="px-4 py-3 w-28">Kích hoạt</th>
                <th className="px-4 py-3 w-36">Trạng thái</th>
                <th className="px-4 py-3 w-32 text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200 text-sm">
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-neutral-500">
                    Không có dữ liệu phù hợp.
                  </td>
                </tr>
              )}

              {pageData.map((r) => {
                const editing = isRowEditing(r.id);
                const draftStart = editing ? Number(draft?.startYear) : r.startYear;
                const draftEnd = editing ? Number(draftStart) + 1 : r.endYear;
                const draftActive = editing ? Boolean(draft?.isActive) : r.isActive;
                const draftStage = (editing ? (draft?.stage as YearStage) : r.stage) as YearStage;

                return (
                  <tr key={r.id} className="hover:bg-neutral-50 transition-colors">
                    {/* Star first column */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setCurrent(r.id)}
                        title="Đặt làm hiện tại"
                        aria-label="Đặt làm năm hiện tại"
                      >
                        <IconStar filled={r.isCurrent} />
                      </button>
                    </td>

                    {/* Code */}
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {padEnDash(editing ? codeOf(draftStart, draftEnd) : r.code)}
                    </td>

                    {/* StartYear */}
                    <td className="px-4 py-3">
                      {editing ? (
                        <input
                          type="number"
                          value={draftStart}
                          onChange={(e) => onDraftChange("startYear", Number(e.currentTarget.value))}
                          className="w-full rounded-md border border-blue-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                          min={2000}
                          max={3000}
                        />
                      ) : (
                        <span className="text-neutral-900">{r.startYear}</span>
                      )}
                    </td>

                    {/* EndYear readonly (text) */}
                    <td className="px-4 py-3">
                      <span className="text-neutral-900">{editing ? draftEnd : r.endYear}</span>
                    </td>

                    {/* Active */}
                    <td className="px-4 py-3">
                      {editing ? (
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={draftActive}
                            onChange={(e) => onDraftChange("isActive", e.target.checked)}
                            className="h-4 w-4 accent-blue-600"
                          />
                          <span>{draftActive ? "Bật" : "Tắt"}</span>
                        </label>
                      ) : (
                        <ActiveBadge on={r.isActive} />
                      )}
                    </td>

                    {/* Stage (2 trạng thái) */}
                    <td className="px-4 py-3">
                      {editing ? (
                        <select
                          value={draftStage}
                          onChange={(e) => onDraftChange("stage", e.target.value as YearStage)}
                          className="w-full rounded-md border border-blue-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Bắt đầu">Bắt đầu</option>
                          <option value="Kết thúc">Kết thúc</option>
                        </select>
                      ) : (
                        <StageBadge v={r.stage} />
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {!editing ? (
                          <button
                            onClick={() => startEditRow(r.id)}
                            className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm hover:bg-neutral-100"
                            title="Sửa hàng này"
                          >
                            Sửa
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => saveEditRow(r.id)}
                              className="rounded-md bg-blue-600 px-2 py-1 text-sm font-medium text-white hover:bg-blue-700"
                              title="Lưu"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={cancelEditRow}
                              className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm hover:bg-neutral-100"
                              title="Hủy"
                            >
                              Hủy
                            </button>
                          </>
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

/* ========== Helpers ========== */
function nextStartSuggestion(list: YearRow[]) {
  if (!list.length) return new Date().getFullYear();
  const maxStart = Math.max(...list.map((x) => x.startYear));
  return maxStart + 1;
}

function getRow(list: YearRow[], id: string) {
  return list.find((r) => r.id === id);
}

// dải nửa mở [s1,e1) và [s2,e2) chồng khi max(start) < min(end)
function overlapsHalfOpen(s1: number, e1: number, s2: number, e2: number) {
  return Math.max(s1, s2) < Math.min(e1, e2);
}
