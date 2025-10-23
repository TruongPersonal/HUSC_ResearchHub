"use client";

import { useMemo, useState } from "react";

/* =============== Types =============== */
type TopicStatus = "PENDING" | "APPROVED";
type Person = { code: string; name: string };

type TopicCatalog = {
  code: string; // mã đề tài
  title: string; // tên đề tài (hiển thị)
  desc: string; // mô tả ngắn (hiển thị)
  status: TopicStatus;
  advisor?: string; // GVHD (có thể có sẵn)
  studentLeader?: Person; // SV chủ nhiệm (có thể có sẵn)
};

/* =============== Mock data =============== */
const CATALOG: TopicCatalog[] = [
  {
    code: "NCKH-25-001",
    title: "Ứng dụng học máy trong phân loại văn bản tiếng Việt",
    desc: "Pipeline phân loại văn bản tiếng Việt với SVM/BERT và demo web.",
    status: "PENDING",
    advisor: "TS. Nguyễn Văn A",
  },
  {
    code: "NCKH-25-014",
    title: "Phân tích mạng xã hội cho dữ liệu giáo dục",
    desc: "Phân tích tương tác SV trên LMS để tìm cộng đồng học tập.",
    status: "PENDING",
    advisor: "",
    studentLeader: { code: "23T1020999", name: "Trần Minh Khang" },
  },
  {
    code: "NCKH-25-028",
    title: "Hệ thống gợi ý đề tài cho sinh viên năm 3",
    desc: "Gợi ý đề tài dựa trên lịch sử học phần và kỹ năng.",
    status: "APPROVED",
    advisor: "TS. Lê Văn C",
  },
  {
    code: "NCKH-25-042",
    title: "HUSC ResearchHub — Cổng quản lý NCKH sinh viên",
    desc: "Thiết kế & triển khai portal quản lý quy trình NCKH SV.",
    status: "PENDING",
    advisor: "PGS.TS. Phạm Thị D",
  },
];

/* =============== Helpers =============== */
const canRegister = (s: TopicStatus) => s === "PENDING";

function StatusBadge({ status }: { status: TopicStatus }) {
  const map: Record<TopicStatus, { text: string; cls: string }> = {
    PENDING: {
      text: "Chưa duyệt",
      cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    },
    APPROVED: {
      text: "Đã duyệt",
      cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    },
  };
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}
    >
      {s.text}
    </span>
  );
}

/* =============== Page =============== */
export default function StudentTopicCatalogPage() {
  const WRAPPER_W = "w-[1120px]";
  const [q, setQ] = useState("");

  // Những đề tài đã gửi đăng ký → disable nút
  const [registeredCodes, setRegisteredCodes] = useState<Set<string>>(
    new Set()
  );

  // Dialog xác nhận
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selected, setSelected] = useState<TopicCatalog | null>(null);
  const [note, setNote] = useState("");

  const list = useMemo(() => {
    let arr = CATALOG;
    if (q.trim()) {
      const k = q.trim().toLowerCase();
      arr = arr.filter(
        (t) =>
          t.title.toLowerCase().includes(k) || t.desc.toLowerCase().includes(k)
      );
    }
    return arr;
  }, [q]);

  const onOpenRegister = (t: TopicCatalog) => {
    if (!canRegister(t.status) || registeredCodes.has(t.code)) return;
    setSelected(t);
    setNote(""); // reset note mỗi lần mở
    setOpenConfirm(true);
  };

  const onSubmitRegister = async () => {
    if (!selected) return;

    // Không gửi bất kỳ thông tin nào ngoài topicCode (+ note do SV nhập).
    // Việc gán SVCN/GVHD xử lý ở backend (nếu cần).
    // POST /api/student/registrations { topicCode, note }
    const payload = { topicCode: selected.code, note: note.trim() || undefined };
    console.log("REGISTER payload:", payload);

    // Disable nút đăng ký đề tài này
    setRegisteredCodes((prev) => new Set(prev).add(selected.code));

    // Đóng dialog
    setOpenConfirm(false);
    setTimeout(() => setSelected(null), 150);
  };

  const isDisabled = (t: TopicCatalog) =>
    !canRegister(t.status) || registeredCodes.has(t.code);

  return (
    <div className="min-h-screen mt-20">
      <main className={`mx-auto ${WRAPPER_W} py-10`}>
        {/* Header */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#0b57a8]">
              Danh sách đề tài
            </h1>
            <p className="text-neutral-700 text-sm mt-1">
              Sinh viên chỉ có thể đăng ký các đề tài <b>chưa duyệt</b>.
            </p>
          </div>

          {/* Search */}
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo tên đề tài/mô tả"
            className="h-10 w-[320px] rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* List */}
        <div className="grid grid-cols-1 gap-4">
          {list.length === 0 ? (
            <EmptyState
              title="Không tìm thấy đề tài"
              desc="Thử từ khoá khác."
            />
          ) : (
            list.map((t) => (
              <article
                key={t.code}
                className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-neutral-900">
                      {t.title}
                    </h2>
                    <p className="text-sm text-neutral-600">{t.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={t.status} />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenRegister(t)}
                    disabled={isDisabled(t)}
                    className={`inline-flex h-9 items-center justify-center px-4 rounded-md transition
                      ${
                        isDisabled(t)
                          ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                          : "bg-neutral-900 text-white hover:bg-neutral-800"
                      }`}
                  >
                    {registeredCodes.has(t.code) ? "Đã đăng ký" : "Đăng ký"}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      {/* Confirm Dialog — chỉ HIỂN THỊ dữ liệu có sẵn + ô Ghi chú */}
      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={onSubmitRegister}
        title="Xác nhận đăng ký"
      >
        {!selected ? (
          <div className="p-2 text-sm text-neutral-600">Đang tải…</div>
        ) : (
          <div className="space-y-4">
            {/* Header đúng format bạn yêu cầu */}
            <div className="space-y-1">
              <div className="text-sm text-neutral-600">
                Bạn đang đăng ký đề tài
              </div>
              <h2 className="text-lg font-semibold text-[#0b57a8]">
                {selected.title}
              </h2>
              <p className="text-sm text-neutral-600">
                SVCN:{" "}
                <span className="font-medium">
                  {selected.studentLeader?.name || "(chưa có)"}
                </span>{" "}
                • GVHD:{" "}
                <span className="font-medium">
                  {selected.advisor || "(chưa có)"}
                </span>
              </p>
            </div>

            {/* Ghi chú tự nguyện */}
            <div className="space-y-1">
              <label
                htmlFor="note"
                className="text-[12px] uppercase tracking-wide text-neutral-500"
              >
                Ghi chú (tuỳ chọn)
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Em quan tâm mảng X/Y, đã học các học phần A/B, mong muốn tham gia để…"
                rows={4}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              />
              <p className="text-xs text-neutral-500">
                Thông tin này chỉ gửi kèm yêu cầu; không thay đổi SVCN/GVHD.
              </p>
            </div>
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
}

/* =============== Simple components =============== */
function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="py-10 text-center text-neutral-700">
      <p className="font-medium">{title}</p>
      <p className="text-sm mt-1">{desc}</p>
    </div>
  );
}

/** Modal xác nhận gọn nhẹ (không phụ thuộc lib) */
function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className={`absolute left-1/2 top-1/2 w-[92vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl border transition-transform duration-200 ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="px-5 py-4 border-b">
          <p id="confirm-title" className="text-[15px] font-semibold">
            {title ?? "Xác nhận"}
          </p>
        </div>

        <div className="p-5">{children}</div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t">
          <button
            onClick={onClose}
            className="inline-flex h-9 items-center justify-center px-4 rounded-md border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 transition"
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex h-9 items-center justify-center px-4 rounded-md bg-blue-700 text-white hover:bg-blue-800 transition"
          >
            Gửi đăng ký
          </button>
        </div>
      </div>
    </div>
  );
}
