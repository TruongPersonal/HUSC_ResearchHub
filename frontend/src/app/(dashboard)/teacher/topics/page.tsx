"use client";

import { useMemo, useState } from "react";

/* =============== Types =============== */
type TopicStatus = "PENDING" | "APPROVED";
type Person = { code: string; name: string };

type TopicCatalog = {
  code: string;          // mã đề tài
  title: string;         // tên đề tài (hiển thị)
  desc: string;          // mô tả ngắn (hiển thị)
  status: TopicStatus;
  advisor?: string;      // GVHD (có thể có sẵn)
  studentLeader?: Person;// SV chủ nhiệm (có thể có sẵn)
  content?: string;      // Nội dung (mới - cho GV xem chi tiết)
  objectives?: string[]; // Mục tiêu (mới - cho GV xem chi tiết)
};

/* =============== Mock data (mở rộng) =============== */
const CATALOG: TopicCatalog[] = [
  {
    code: "NCKH-25-001",
    title: "Ứng dụng học máy trong phân loại văn bản tiếng Việt",
    desc: "Pipeline phân loại văn bản tiếng Việt với SVM/BERT và demo web.",
    status: "PENDING",
    advisor: "TS. Nguyễn Văn A",
    content:
      "Xây dựng pipeline tiền xử lý (tokenization, stopwords, VNCoreNLP), so sánh SVM và BERT cho phân loại chủ đề. Xây dựng demo web minh họa.",
    objectives: [
      "Khảo sát độ chính xác SVM vs BERT trên bộ dữ liệu VN.",
      "Tối ưu hoá tốc độ suy luận cho demo web.",
      "Đề xuất quy trình chuẩn hoá dữ liệu văn bản tiếng Việt.",
    ],
  },
  {
    code: "NCKH-25-014",
    title: "Phân tích mạng xã hội cho dữ liệu giáo dục",
    desc: "Phân tích tương tác SV trên LMS để tìm cộng đồng học tập.",
    status: "PENDING",
    advisor: "",
    studentLeader: { code: "23T1020999", name: "Trần Minh Khang" },
    content:
      "Thu thập log thảo luận, bình luận và nhóm làm việc trên LMS. Xây dựng đồ thị tương tác SV và áp dụng community detection (Louvain).",
    objectives: [
      "Xác định cụm SV có tương tác học tập cao.",
      "Đo lường ảnh hưởng tương tác đến kết quả học tập.",
    ],
  },
  {
    code: "NCKH-25-028",
    title: "Hệ thống gợi ý đề tài cho sinh viên năm 3",
    desc: "Gợi ý đề tài dựa trên lịch sử học phần và kỹ năng.",
    status: "APPROVED",
    advisor: "TS. Lê Văn C",
    content:
      "Rút trích kỹ năng từ điểm các học phần, CV, và sở thích; gợi ý đề tài phù hợp bằng phương pháp collaborative filtering + rule-based.",
    objectives: [
      "Cải thiện mức phù hợp đề tài-SV.",
      "Giảm tỉ lệ huỷ/đổi đề tài muộn.",
    ],
  },
  {
    code: "NCKH-25-042",
    title: "HUSC ResearchHub — Cổng quản lý NCKH sinh viên",
    desc: "Thiết kế & triển khai portal quản lý quy trình NCKH SV.",
    status: "PENDING",
    advisor: "PGS.TS. Phạm Thị D",
    content:
      "Thiết kế hệ thống quản lý đăng ký, duyệt, theo dõi tiến độ, thông báo. Xây dựng kiến trúc FE Next.js + BE Spring Boot + MySQL.",
    objectives: [
      "Tự động hoá quy trình đăng ký/duyệt.",
      "Cung cấp báo cáo thống kê theo kỳ/năm.",
    ],
  },
];

/* =============== Helpers =============== */
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

/* =============== Page (Teacher View Only) =============== */
export default function TeacherTopicCatalogPage() {
  const WRAPPER_W = "w-[1120px]";
  const [q, setQ] = useState("");
  const [openDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState<TopicCatalog | null>(null);

  const list = useMemo(() => {
    let arr = CATALOG;
    if (q.trim()) {
      const k = q.trim().toLowerCase();
      arr = arr.filter(
        (t) =>
          t.title.toLowerCase().includes(k) ||
          t.desc.toLowerCase().includes(k) ||
          t.code.toLowerCase().includes(k)
      );
    }
    return arr;
  }, [q]);

  const openDetails = (t: TopicCatalog) => {
    setSelected(t);
    setOpenDetail(true);
  };

  return (
    <div className="min-h-screen mt-20">
      <main className={`mx-auto ${WRAPPER_W} py-10`}>
        {/* Header */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-purple-800">
              Danh sách đề tài
            </h1>
            <p className="text-neutral-700 mt-1 text-sm">
              Xem nhanh đề tài đã/đang đề xuất để{" "}
              <b>tránh trùng nội dung</b> khi mở đề xuất mới.
            </p>
          </div>

          {/* Search */}
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo mã/tên/mô tả"
            className="h-10 w-[360px] rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-purple-100"
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
                    <div className="text-xs text-neutral-500">{t.code}</div>
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
                  {/* KHÔNG có nút Đăng ký trong view của GV */}
                  <button
                    type="button"
                    onClick={() => openDetails(t)}
                    className="inline-flex h-9 items-center justify-center px-4 rounded-md border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 transition"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      {/* Details Dialog — chỉ xem (read-only), có Nội dung & Mục tiêu */}
      <DetailsDialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        title="Chi tiết đề tài"
      >
        {!selected ? (
          <div className="p-2 text-sm text-neutral-600">Đang tải…</div>
        ) : (
          <div className="space-y-5">
            {/* Header */}
            <div className="space-y-1">
              <div className="text-sm text-neutral-600">Thông tin đề tài</div>
              <h2 className="text-lg font-semibold text-purple-800">
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
                </span>{" "}
              </p>
            </div>

            {/* Nội dung */}
            <Section title="Nội dung">
              {selected.content ? (
                <p className="text-sm leading-6 text-neutral-800 whitespace-pre-line">
                  {selected.content}
                </p>
              ) : (
                <p className="text-sm text-neutral-500 italic">(Chưa cập nhật)</p>
              )}
            </Section>

            {/* Mục tiêu đề tài */}
            <Section title="Mục tiêu đề tài">
              {selected.objectives?.length ? (
                <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-800">
                  {selected.objectives.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-neutral-500 italic">(Chưa cập nhật)</p>
              )}
            </Section>
          </div>
        )}
      </DetailsDialog>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-[12px] uppercase tracking-wide text-neutral-500">
        {title}
      </div>
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
        {children}
      </div>
    </div>
  );
}

/** Dialog chi tiết (read-only) */
function DetailsDialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
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
        aria-labelledby="details-title"
        className={`absolute left-1/2 top-1/2 w-[92vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl border transition-transform duration-200 ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="px-5 py-4 border-b">
          <p id="details-title" className="text-[15px] font-semibold">
            {title ?? "Chi tiết"}
          </p>
        </div>
        <div className="p-5">{children}</div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t">
          <button
            onClick={onClose}
            className="inline-flex h-9 items-center justify-center px-4 rounded-md border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
