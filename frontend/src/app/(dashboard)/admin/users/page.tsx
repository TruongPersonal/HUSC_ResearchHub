"use client";

import { useEffect, useMemo, useState } from "react";

/* ========== Types ========== */
type UserRole = "admin" | "assistant" | "teacher" | "student";
type Faculty = "CNTT";

type UserRow = {
  id_user: string;
  full_name: string;
  role: UserRole;
  faculty?: Faculty;
};

const DEFAULT_PASSWORD = "password12345!";
const FACULTIES: Faculty[] = ["CNTT"];

/* ========== Mock data (thay bằng API sau) ========== */
const MOCK_USERS: UserRow[] = [
  {
    id_user: "admin1",
    full_name: "Quản trị hệ thống",
    role: "admin",
    faculty: "CNTT",
  },
  {
    id_user: "assistant1",
    full_name: "TS. Nguyễn Văn Anh",
    role: "assistant",
    faculty: "CNTT",
  },
  {
    id_user: "ttbinh",
    full_name: "ThS. Trần Thị Bính",
    role: "teacher",
    faculty: "CNTT",
  },
  {
    id_user: "23t1020573",
    full_name: "Ngô Quang Trường",
    role: "student",
    faculty: "CNTT",
  },
  {
    id_user: "23t1020999",
    full_name: "Nguyễn Thị C",
    role: "student",
    faculty: "CNTT",
  },
  {
    id_user: "lvdinh",
    full_name: "PGS. Lê Văn Dĩnh",
    role: "teacher",
    faculty: "CNTT",
  },
];

/* ========== Badges ========== */
function RoleBadge({ role }: { role: UserRole }) {
  const style: Record<UserRole, string> = {
    admin: "bg-rose-50 text-rose-700 border border-rose-200",
    assistant: "bg-amber-50 text-amber-700 border border-amber-200",
    teacher: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    student: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };
  const abbr: Record<UserRole, string> = {
    admin: "QTV",
    assistant: "TLV", // Trợ lý khoa
    teacher: "GV",
    student: "SV",
  };
  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[12px] font-medium min-w-10 ${style[role]}`}
    >
      {abbr[role]}
    </span>
  );
}

function FacultyBadge({ f }: { f?: Faculty }) {
  const v = f ?? "CNTT";
  return (
    <span className="px-2 py-0.5 rounded-md text-[12px] bg-blue-50 text-blue-700 border border-blue-200">
      {v}
    </span>
  );
}

/* ========== CSV helper (Export TRANG HIỆN TẠI) ========== */
function exportCSV(
  data: UserRow[],
  filename = `users_export_${Date.now()}.csv`
) {
  const header = ["id_user", "full_name", "role", "faculty"];
  const lines = [header.join(",")].concat(
    data.map((r) =>
      [r.id_user, r.full_name, r.role, r.faculty ?? "CNTT"]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    )
  );
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ========== Main Page ========== */
export default function UsersPage() {
  /* Filters, paging (KHÔNG sắp xếp) */
  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const [role, setRole] = useState<"" | UserRole>("");
  const [faculty, setFaculty] = useState<"" | Faculty>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // mặc định 10/mỗi trang

  /* Data */
  const [rows, setRows] = useState<UserRow[]>(MOCK_USERS);

  /* Create form (Card gọn, 2 hàng) */
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<{
    id_user: string;
    full_name: string;
    role: UserRole;
    faculty: Faculty;
  }>({
    id_user: "",
    full_name: "",
    role: "student",
    faculty: "CNTT",
  });

  /* Edit inline */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    full_name: string;
    role: UserRole;
    faculty: Faculty;
  }>({
    full_name: "",
    role: "student",
    faculty: "CNTT",
  });

  /* Debounce search */
  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  /* Derived list (chỉ lọc, không sort) */
  const filtered = useMemo(() => {
    return rows.filter((u) => {
      const mQ =
        !qDebounced ||
        u.full_name.toLowerCase().includes(qDebounced.toLowerCase()) ||
        u.id_user.toLowerCase().includes(qDebounced.toLowerCase());
      const mRole = !role || u.role === role;
      const mFac = !faculty || (u.faculty ?? "CNTT") === faculty;
      return mQ && mRole && mFac;
    });
  }, [rows, qDebounced, role, faculty]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  /* Actions (mock) */
  const resetPasswordOne = (id: string) => {
    // POST /api/users/{id}/reset-password  { password: DEFAULT_PASSWORD }
    alert(`Đã reset mật khẩu cho ${id} về: ${DEFAULT_PASSWORD}`);
  };

  const handleExportCurrent = () =>
    exportCSV(pageData, `users_export_page_${Date.now()}.csv`);

  const validateCreate = () => {
    if (!createForm.id_user.trim() || !createForm.full_name.trim()) {
      alert("Vui lòng nhập đầy đủ Mã và Họ tên.");
      return false;
    }
    if (rows.some((r) => r.id_user === createForm.id_user.trim())) {
      alert("Mã người dùng đã tồn tại.");
      return false;
    }
    return true;
  };

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCreate()) return;

    const newUser: UserRow = {
      id_user: createForm.id_user.trim(),
      full_name: createForm.full_name.trim(),
      role: createForm.role,
      faculty: createForm.faculty,
    };

    // POST /api/users  body: { ...newUser, password: DEFAULT_PASSWORD }
    setRows((prev) => [newUser, ...prev]);
    setShowCreate(false);
    setCreateForm({
      id_user: "",
      full_name: "",
      role: "student",
      faculty: "CNTT",
    });
    alert(`Đã tạo ${newUser.id_user} với mật khẩu: ${DEFAULT_PASSWORD}`);
  };

  const startEdit = (u: UserRow) => {
    setEditingId(u.id_user);
    setEditForm({
      full_name: u.full_name,
      role: u.role,
      faculty: (u.faculty ?? "CNTT") as Faculty,
    });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = (id: string) => {
    if (!editForm.full_name.trim()) {
      alert("Họ tên không được để trống.");
      return;
    }
    const updated = rows.map((r) =>
      r.id_user === id
        ? {
            ...r,
            full_name: editForm.full_name.trim(),
            role: editForm.role,
            faculty: editForm.faculty,
          }
        : r
    );
    // PUT /api/users/{id}  body: { full_name, role, faculty }
    setRows(updated);
    setEditingId(null);
  };

  /* Icons (SVG inline) */
  const IconEdit = () => (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
  const IconKey = () => (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 2l-2 2" />
      <path d="M7 15l-4 4 1 3 3-1 4-4" />
      <circle cx="15" cy="9" r="5" />
    </svg>
  );

  return (
    <div className="min-w-0">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Quản lý tài khoản
          </h1>
          <p className="text-sm text-neutral-600">
            Thêm tài khoản, reset mật khẩu, phân quyền cho người dùng hệ thống.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCurrent}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm hover:bg-neutral-50"
            title="Export các bản ghi ở TRANG hiện tại"
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="rounded-lg border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {showCreate ? "Đóng form" : "Thêm người dùng"}
          </button>
        </div>
      </div>

      {/* Create Card (layout 2 hàng cân đối) */}
      {showCreate && (
        <form
          onSubmit={submitCreate}
          className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            {/* Hàng 1: Mã (4), Họ tên (8) */}
            <div className="md:col-span-4">
              <label className="mb-1 block text-sm font-medium">
                Mã người dùng *
              </label>
              <input
                value={createForm.id_user}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, id_user: e.target.value }))
                }
                required
                placeholder="nvtrung / 23t1020573"
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Duy nhất trong hệ thống.
              </p>
            </div>
            <div className="md:col-span-8">
              <label className="mb-1 block text-sm font-medium">Họ tên *</label>
              <input
                value={createForm.full_name}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, full_name: e.target.value }))
                }
                required
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Hàng 2: Vai trò (3), Khoa (3), Spacer, Actions */}
            <div className="md:col-span-3">
              <label className="mb-1 block text-sm font-medium">Vai trò</label>
              <select
                value={createForm.role}
                onChange={(e) =>
                  setCreateForm((f) => ({
                    ...f,
                    role: e.target.value as UserRole,
                  }))
                }
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
              >
                <option value="admin">QTV</option>
                <option value="assistant">TLV</option>
                <option value="teacher">GV</option>
                <option value="student">SV</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="mb-1 block text-sm font-medium">Khoa</label>
              <select
                value={createForm.faculty}
                onChange={(e) =>
                  setCreateForm((f) => ({
                    ...f,
                    faculty: e.target.value as Faculty,
                  }))
                }
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
              >
                {FACULTIES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3 hidden md:block" />
            <div className="md:col-span-3 flex items-end justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Tạo người dùng
              </button>
            </div>
          </div>

          <div className="mt-3 text-sm text-neutral-600">
            *Mật khẩu mặc định:{" "}
            <span className="font-medium">{DEFAULT_PASSWORD}</span>
          </div>
        </form>
      )}

      {/* Filters (đơn giản, KHÔNG có page size ở đây) */}
      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
        <div className="md:col-span-2">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo mã/họ tên…"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value as any);
              setPage(1);
            }}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Vai trò —</option>
            <option value="admin">QTV</option>
            <option value="assistant">TLV</option>
            <option value="teacher">GV</option>
            <option value="student">SV</option>
          </select>
        </div>
        <div>
          <select
            value={faculty}
            onChange={(e) => {
              setFaculty(e.target.value as any);
              setPage(1);
            }}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Khoa —</option>
            {FACULTIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="max-h-[520px] overflow-auto">
          <table className="min-w-full table-fixed">
            <thead className="sticky top-0 z-10 bg-neutral-50 text-left text-[13px] uppercase tracking-wide text-neutral-600 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 w-44">Mã</th>
                <th className="px-4 py-3">Họ tên</th>
                <th className="px-4 py-3 w-24">Vai trò</th>
                <th className="px-4 py-3 w-40">Khoa</th>
                <th className="px-4 py-3 w-48"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200 text-sm">
              {pageData.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-neutral-500"
                  >
                    Không có dữ liệu phù hợp.
                  </td>
                </tr>
              )}

              {pageData.map((u, idx) => {
                const isEditing = editingId === u.id_user;

                return (
                  <tr
                    key={u.id_user}
                    className={`transition-colors ${"bg-white"} hover:!bg-neutral-100`}
                  >
                    {/* MÃ */}
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {u.id_user}
                    </td>

                    {/* HỌ TÊN */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          autoFocus
                          value={editForm.full_name}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              full_name: e.target.value,
                            }))
                          }
                          className="w-full rounded-md border border-neutral-300 px-2 py-1 text-sm bg-white focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span>{u.full_name}</span>
                      )}
                    </td>

                    {/* VAI TRÒ (badge viết tắt) */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          value={editForm.role}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              role: e.target.value as UserRole,
                            }))
                          }
                          className="w-full rounded-md border border-neutral-300 px-2 py-1 text-sm bg-white"
                        >
                          <option value="admin">QTV</option>
                          <option value="assistant">TLV</option>
                          <option value="teacher">GV</option>
                          <option value="student">SV</option>
                        </select>
                      ) : (
                        <RoleBadge role={u.role} />
                      )}
                    </td>

                    {/* KHOA (cho phép sửa) */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          value={editForm.faculty}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              faculty: e.target.value as Faculty,
                            }))
                          }
                          className="w-full rounded-md border border-neutral-300 px-2 py-1 text-sm bg-white"
                        >
                          {FACULTIES.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <FacultyBadge f={(u.faculty ?? "CNTT") as Faculty} />
                      )}
                    </td>

                    {/* ACTIONS (ghost buttons + icon) */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => saveEdit(u.id_user)}
                            className="rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="rounded-md border border-neutral-300 px-3 py-1.5 hover:bg-neutral-100"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => resetPasswordOne(u.id_user)}
                            className="inline-flex items-center gap-1 rounded-md border border-neutral-200 px-3 py-1.5 text-neutral-700 hover:bg-neutral-100"
                            title="Reset mật khẩu"
                          >
                            <IconKey /> <span className="text-sm">Reset</span>
                          </button>
                          <button
                            onClick={() => startEdit(u)}
                            className="inline-flex items-center gap-1 rounded-md border border-neutral-200 px-3 py-1.5 text-neutral-700 hover:bg-neutral-100"
                            title="Sửa thông tin"
                          >
                            <IconEdit /> <span className="text-sm">Sửa</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination (đưa “Mỗi trang” vào đây, gọn và đúng ngữ cảnh) */}
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
