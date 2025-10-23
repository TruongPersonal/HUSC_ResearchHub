"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

/* ========== Types ========== */
type Major = { code: string; name: string }; // id = code
type Faculty = { code: string; name: string; majors: Major[] };

/* ========== Mock ========== */
const MOCK_FACULTIES: Faculty[] = [
  {
    code: "CNTT",
    name: "Công nghệ Thông tin",
    majors: [
      { code: "111", name: "Kỹ thuật phần mềm" },
      { code: "102", name: "Công nghệ Thông tin" },
      { code: "1021", name: "Khoa học máy tính" },
      { code: "1022", name: "Công nghệ phần mềm" },
      { code: "1023", name: "Mạng máy tính" },
    ],
  },
];

/* ========== UI State Types ========== */
type ModalState = {
  type: "edit";
  faculty: Faculty;
  originalCode: string;
} | null;

/* ========== Page ========== */
export default function FacultiesPage() {
  const [rows, setRows] = useState<Faculty[]>(MOCK_FACULTIES);
  const [q, setQ] = useState("");
  const [modal, setModal] = useState<ModalState>(null);

  // Toggle create card
  const [showCreate, setShowCreate] = useState(false);
  const [createCode, setCreateCode] = useState("");
  const [createName, setCreateName] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (f) =>
        f.code.toLowerCase().includes(s) ||
        f.name.toLowerCase().includes(s) ||
        f.majors.some(
          (m) =>
            m.code.toLowerCase().includes(s) || m.name.toLowerCase().includes(s)
        )
    );
  }, [rows, q]);

  /* ===== CRUD helpers ===== */
  const validateFaculty = (code: string, name: string, skipCode?: string) => {
    const c = (code ?? "").trim();
    const n = (name ?? "").trim();
    if (!c) return { ok: false as const, msg: "Mã khoa không được để trống." };
    if (!n) return { ok: false as const, msg: "Tên khoa không được để trống." };
    if (rows.some((r) => r.code === c && r.code !== skipCode)) {
      return { ok: false as const, msg: "Mã khoa đã tồn tại." };
    }
    return { ok: true as const, code: c, name: n };
  };

  const createFaculty = (code: string, name: string) => {
    const v = validateFaculty(code, name);
    if (!v.ok) return { ok: false as const, msg: v.msg };
    setRows((prev) => [{ code: v.code, name: v.name, majors: [] }, ...prev]);
    return { ok: true as const };
  };

  const saveEditFaculty = (
    originalCode: string,
    code: string,
    name: string,
    majors: Major[]
  ) => {
    const v = validateFaculty(code, name, originalCode);
    if (!v.ok) {
      alert(v.msg);
      return false;
    }

    // Clean majors
    const seen = new Set<string>();
    const cleaned: Major[] = [];
    for (const m of majors) {
      const c = (m.code || "").trim();
      const n = (m.name || "").trim();
      if (!c || !n) continue;
      if (seen.has(c)) continue;
      seen.add(c);
      cleaned.push({ code: c, name: n });
    }

    setRows((prev) =>
      prev.map((r) =>
        r.code === originalCode
          ? { code: v.code, name: v.name, majors: cleaned }
          : r
      )
    );
    return true;
  };

  const onDelete = (code: string) => {
    setRows((prev) => prev.filter((r) => r.code !== code));
  };

  /* ===== Create form handlers (card) ===== */
  const handleCancelCreate = () => {
    setCreateCode("");
    setCreateName("");
    setShowCreate(false);
  };

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createFaculty(createCode, createName);
    if (!res.ok) {
      alert(res.msg);
      return;
    }
    handleCancelCreate();
  };

  return (
    <div className="min-w-0 space-y-4">
      {/* Header */}
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Quản lý khoa/ngành
          </h1>
          <p className="text-sm text-neutral-600">
            Thêm, sửa khoa và ngành của khoa.
          </p>
        </div>
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showCreate ? "Đóng form" : "Thêm khoa"}
        </button>
      </div>

      {/* Create card (toggle) — GIỐNG “Thêm năm học” */}
      {showCreate && (
        <form
          onSubmit={submitCreate}
          className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            {/* Mã khoa */}
            <div className="md:col-span-4">
              <label className="mb-1 block text-sm font-medium">
                Mã khoa *
              </label>
              <input
                value={createCode}
                onChange={(e) => setCreateCode(e.target.value || "")}
                placeholder="CNTT"
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tên khoa */}
            <div className="md:col-span-8">
              <label className="mb-1 block text-sm font-medium">
                Tên khoa *
              </label>
              <input
                value={createName}
                onChange={(e) => setCreateName(e.target.value || "")}
                placeholder="VD: Khoa Công nghệ Thông tin"
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Actions */}
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
                Tạo khoa mới
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Search */}
      <div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value || "")}
          placeholder="Tìm theo mã/tên khoa hoặc ngành…"
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="min-w-full table-fixed">
          <thead className="bg-neutral-50 text-left text-[13px] text-neutral-700 border-b">
            <tr>
              <th className="px-4 py-3 w-36">MÃ KHOA</th>
              <th className="px-4 py-3">TÊN KHOA</th>
              <th className="px-4 py-3 w-44 text-right">THAO TÁC</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-10 text-center text-neutral-500"
                >
                  Không có dữ liệu.
                </td>
              </tr>
            )}

            {filtered.map((r) => (
              <tr key={r.code} className="hover:bg-neutral-50">
                <td className="px-4 py-3">{r.code}</td>
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        setModal({
                          type: "edit",
                          faculty: r,
                          originalCode: r.code,
                        })
                      }
                      className="rounded-md border px-2.5 py-1.5 text-sm hover:bg-neutral-50"
                    >
                      Sửa
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="rounded-md border border-red-500 px-2.5 py-1.5 text-sm text-red-600 hover:bg-red-50">
                          Xoá
                        </button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xóa khoa này?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Xóa khoa{" "}
                            <strong>{r.name}</strong> ({r.code})?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(r.code)}>
                            Xác nhận xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {modal?.type === "edit" && (
        <EditFacultyModal
          faculty={modal.faculty}
          originalCode={modal.originalCode}
          onClose={() => setModal(null)}
          onSubmit={(newCode, name, majors) => {
            if (saveEditFaculty(modal.originalCode, newCode, name, majors))
              setModal(null);
          }}
        />
      )}
    </div>
  );
}

/* ========== Edit Modal (quản lý ngành; id = code) ========== */
function EditFacultyModal({
  faculty,
  originalCode,
  onClose,
  onSubmit,
}: {
  faculty: Faculty;
  originalCode: string;
  onClose: () => void;
  onSubmit: (code: string, name: string, majors: Major[]) => void;
}) {
  const [code, setCode] = useState(faculty.code);
  const [name, setName] = useState(faculty.name);
  const [majors, setMajors] = useState<Major[]>(
    faculty.majors.map((m) => ({ ...m }))
  );

  // inline inputs for add-major
  const [mCode, setMCode] = useState("");
  const [mName, setMName] = useState("");

  useEscClose(onClose);

  const addMajor = () => {
    const c = (mCode || "").trim();
    const n = (mName || "").trim();
    if (!c || !n) {
      alert("Mã/Tên ngành không được để trống.");
      return;
    }
    if (majors.some((m) => (m.code || "").trim() === c)) {
      alert("Mã ngành đã tồn tại trong khoa này.");
      return;
    }
    setMajors((arr) => [...arr, { code: c, name: n }]);
    setMCode("");
    setMName("");
  };

  const removeMajor = (index: number) => {
    setMajors((arr) => arr.filter((_, i) => i !== index));
  };

  const updateMajor = (index: number, patch: Partial<Major>) => {
    setMajors((arr) =>
      arr.map((m, i) => (i === index ? { ...m, ...patch } : m))
    );
  };

  return (
    <ModalShell title={`Sửa khoa: ${originalCode}`} onClose={onClose}>
      <div className="space-y-4 text-sm">
        {/* Basic info */}
        <div className="grid gap-2 md:grid-cols-12">
          <label className="md:col-span-3 text-neutral-600">Mã khoa *</label>
          <input
            className="md:col-span-9 rounded-md border border-neutral-300 bg-white px-3 py-2"
            value={code}
            onChange={(e) => setCode(e.target.value || "")}
          />
        </div>
        <div className="grid gap-2 md:grid-cols-12">
          <label className="md:col-span-3 text-neutral-600">Tên khoa *</label>
          <input
            className="md:col-span-9 rounded-md border border-neutral-300 bg-white px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value || "")}
          />
        </div>

        {/* Majors editor */}
        <div className="rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="font-medium">Ngành đào tạo</div>
            <div className="text-neutral-500">{majors.length} ngành</div>
          </div>
          <div className="border-t">
            {majors.length === 0 ? (
              <div className="px-3 py-6 text-neutral-500">Chưa có ngành.</div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-neutral-50 text-left text-[13px] text-neutral-700 border-b">
                  <tr>
                    <th className="px-3 py-2 w-44">Mã ngành</th>
                    <th className="px-3 py-2">Tên ngành</th>
                    <th className="px-3 py-2 w-24"></th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {majors.map((m, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2">
                        <input
                          className="w-full rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm"
                          value={m.code}
                          onChange={(e) =>
                            updateMajor(idx, { code: e.target.value || "" })
                          }
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          className="w-full rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm"
                          value={m.name}
                          onChange={(e) =>
                            updateMajor(idx, { name: e.target.value || "" })
                          }
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => removeMajor(idx)}
                          className="rounded-md border px-2.5 py-1.5 text-sm hover:bg-neutral-50"
                        >
                          Xoá
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Add major inline */}
          <div className="border-t px-3 py-2 flex flex-col gap-2 md:flex-row">
            <input
              className="md:w-44 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
              placeholder="Mã ngành"
              value={mCode}
              onChange={(e) => setMCode(e.target.value || "")}
            />
            <input
              className="md:flex-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
              placeholder="Tên ngành"
              value={mName}
              onChange={(e) => setMName(e.target.value || "")}
            />
            <button
              onClick={addMajor}
              className="rounded-md border px-2.5 py-1.5 text-sm hover:bg-neutral-50"
            >
              + Thêm ngành
            </button>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border px-2.5 py-1.5 text-sm hover:bg-neutral-50"
          >
            Đóng
          </button>
          <button
            onClick={() => onSubmit(code, name, majors)}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ========== Modal Shell (simple, no deps) ========== */
function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  // close on backdrop click
  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // lock scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={onBackdrop}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-3xl rounded-xl bg-white shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        <div className="px-4 py-4">{children}</div>
      </div>
    </div>
  );
}

/* ========== Hook: ESC to close modal ========== */
function useEscClose(onClose: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
}
