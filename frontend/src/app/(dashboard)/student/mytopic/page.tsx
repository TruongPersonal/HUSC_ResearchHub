"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

/* =============== Types =============== */

type TopicStatus = "PENDING" | "NEEDS_UPDATE" | "REJECTED" | "APPROVED";

type Topic = {
  code: string; // dùng như id
  title: string;
  status: TopicStatus;
};

type TopicDetail = {
  code: string;
  studentLeader: string;
  members: string;
  advisor: string;
  title: string;
  objective: string;
  content: string;
  budget: string;
  note: string;
  status: TopicStatus;
};

/* =============== Mock data =============== */

const dataList: Topic[] = [
  {
    code: "NCKH-25-001",
    title: "Ứng dụng học máy trong phân loại văn bản tiếng Việt",
    status: "PENDING",
  },
  {
    code: "NCKH-25-014",
    title: "Phân tích mạng xã hội cho dữ liệu giáo dục",
    status: "NEEDS_UPDATE",
  },
  {
    code: "NCKH-25-028",
    title: "Hệ thống gợi ý đề tài cho sinh viên năm 3",
    status: "REJECTED",
  },
  {
    code: "NCKH-25-042",
    title: "Xây dựng portal quản lý NCKH sinh viên HUSC ResearchHub",
    status: "APPROVED",
  },
];

const mockDetailByCode: Record<string, TopicDetail> = {
  "NCKH-25-001": {
    code: "NCKH-25-001",
    status: "PENDING",
    studentLeader: "23T1020573",
    members: "23T1020565, 23T1020532",
    advisor: "",
    title: "Ứng dụng học máy trong phân loại văn bản tiếng Việt",
    objective:
      "Ứng dụng các mô hình học máy để phân loại văn bản tiếng Việt theo chủ đề.",
    content:
      "Thu thập dữ liệu, tiền xử lý, baseline SVM/NB, thử BERT, đánh giá & demo.",
    budget: "10 triệu",
    note: "Nhóm tự chuẩn bị tập dữ liệu mở.",
  },
  "NCKH-25-014": {
    code: "NCKH-25-014",
    status: "NEEDS_UPDATE",
    studentLeader: "23T1020111",
    members: "23T1020222",
    advisor: "ThS. Trần Thị B",
    title: "Phân tích mạng xã hội cho dữ liệu giáo dục",
    objective: "Phân tích tương tác SV trên LMS để gợi ý nhóm học & tài liệu.",
    content: "Khai phá mạng học tập, đo trung tâm/cộng đồng; thử nghiệm gợi ý.",
    budget: "9 triệu",
    note: "Bổ sung kế hoạch đạo đức nghiên cứu (IRB).",
  },
  "NCKH-25-028": {
    code: "NCKH-25-028",
    status: "REJECTED",
    studentLeader: "22T1010999",
    members: "",
    advisor: "",
    title: "Hệ thống gợi ý đề tài cho sinh viên năm 3",
    objective: "Gợi ý đề tài theo sở thích & năng lực học phần.",
    content: "Hồ sơ môn học/kỹ năng; CF/CBF; đánh giá offline.",
    budget: "8 triệu",
    note: "Trùng hướng với đề tài cấp Khoa đã có.",
  },
  "NCKH-25-042": {
    code: "NCKH-25-042",
    status: "APPROVED",
    studentLeader: "23T1020001",
    members: "23T1020002, 23T1020003",
    advisor: "PGS.TS. Phạm Thị D",
    title: "Xây dựng portal quản lý NCKH sinh viên HUSC ResearchHub",
    objective: "Xây hệ thống web quản lý quy trình NCKH SV tại HUSC.",
    content:
      "Phân tích quy trình, thiết kế CSDL, FE Next.js, BE Spring Boot, thông báo, minh chứng.",
    budget: "10 triệu",
    note: "Đã duyệt, nộp hợp đồng trong tuần.",
  },
};

const contractUrl = (code: string) => `/files/contract_template.docx`;

/* =============== Page =============== */

export default function StudentMyTopicsPage() {
  const WRAPPER_W = "w-[1120px]";
  const TABLE_MIN_W = "min-w-[880px]";

  const pendingList = useMemo(
    () =>
      dataList.filter(
        (t) =>
          t.status === "PENDING" ||
          t.status === "NEEDS_UPDATE" ||
          t.status === "REJECTED"
      ),
    []
  );
  const approvedList = useMemo(
    () => dataList.filter((t) => t.status === "APPROVED"),
    []
  );

  const defaultTab = pendingList.length > 0 ? "pending" : "approved";
  const [tab, setTab] = useState<"pending" | "approved">(defaultTab as any);

  // panel
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState<TopicDetail | null>(null);

  // form state (edit inline)
  const [edit, setEdit] = useState<TopicDetail | null>(null);

  //   useEffect(() => {
  //     if (!openView) return;
  //     const prev = document.body.style.overflow;
  //     document.body.style.overflow = "hidden";
  //     return () => (document.body.style.overflow = prev);
  //   }, [openView]);

  const openByCode = (code: string) => {
    const detail = mockDetailByCode[code] ?? null; // sau này fetch(`/api/topics/${code}`)
    setViewData(detail);
    // nếu được chỉnh (PENDING/NEEDS_UPDATE) → bật chế độ edit với bản copy
    if (
      detail &&
      (detail.status === "PENDING" || detail.status === "NEEDS_UPDATE")
    ) {
      setEdit({ ...detail });
    } else {
      setEdit(null);
    }
    setOpenView(true);
  };

  const onClose = () => {
    setOpenView(false);
    setTimeout(() => {
      setViewData(null);
      setEdit(null);
    }, 250);
  };

  const canEdit = (s: TopicStatus) => s === "PENDING" || s === "NEEDS_UPDATE";
  const canDownload = (s: TopicStatus) => s === "APPROVED";

  const onChange = <K extends keyof TopicDetail>(k: K, v: TopicDetail[K]) => {
    if (!edit) return;
    setEdit({ ...edit, [k]: v });
  };

  const onSave = async () => {
    if (!edit) return;
    // TODO: call API PUT/PATCH `/api/topics/${edit.code}`
    // body: edit
    console.log("SAVE payload:", edit);
    // Giả sử backend trả ok → cập nhật viewData
    setViewData(edit);
    // vẫn giữ panel mở
  };

  return (
    <div className="min-h-screen mt-20">
      <main className={`mx-auto ${WRAPPER_W} py-10`}>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#0b57a8]">
            Đề tài của tôi
          </h1>
          <p className="text-neutral-700 text-sm mt-1">
            Xem các đề tài bạn đã gửi và theo dõi trạng thái xét duyệt.
          </p>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <div className="bg-white rounded-xl border border-neutral-200 shadow p-3 flex items-center justify-between">
            <TabsList className="bg-neutral-100 p-1 rounded-lg">
              <TabsTrigger value="pending" className="px-4">
                Chưa duyệt
              </TabsTrigger>
              <TabsTrigger value="approved" className="px-4">
                Đã duyệt
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Link
                href="/student/topicpropose"
                className="h-10 inline-flex items-center justify-center px-4 rounded-md bg-blue-700 text-white font-semibold hover:bg-blue-800 active:bg-blue-900 transition"
              >
                + Đề xuất đề tài mới
              </Link>
            </div>
          </div>

          {/* PENDING */}
          <TabsContent value="pending" className="mt-4">
            <div
              className={`bg-white rounded-2xl border border-neutral-200 shadow p-4 ${TABLE_MIN_W}`}
            >
              {pendingList.length === 0 ? (
                <EmptyState
                  title="Chưa có đề tài trong mục này"
                  desc="Hãy đề xuất đề tài mới hoặc kiểm tra tab 'Đã duyệt'."
                  actionHref="/(dashboard)/student/topics/new"
                  actionText="Đề xuất đề tài"
                />
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-neutral-600 border-b">
                      <th className="py-2 pr-3 font-medium">Mã</th>
                      <th className="py-2 pr-3 font-medium">Tên đề tài</th>
                      <th className="py-2 pr-3 font-medium">Trạng thái</th>
                      <th className="py-2 pr-3 font-medium">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingList.map((t) => (
                      <tr key={t.code} className="border-b last:border-none">
                        <td className="py-2 pr-3">{t.code}</td>
                        <td className="py-2 pr-3">
                          <div>{t.title}</div>
                        </td>
                        <td className="py-2 pr-3">
                          <StatusBadge status={t.status} />
                        </td>
                        <td className="py-2 pr-3">
                          <button
                            type="button"
                            onClick={() => openByCode(t.code)}
                            className="inline-flex h-8 items-center justify-center px-3 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 transition"
                          >
                            Xem
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>

          {/* APPROVED */}
          <TabsContent value="approved" className="mt-4">
            <div
              className={`bg-white rounded-2xl border border-neutral-200 shadow p-4 ${TABLE_MIN_W}`}
            >
              {approvedList.length === 0 ? (
                <EmptyState
                  title="Chưa có đề tài đã duyệt"
                  desc="Khi đề tài được duyệt, bạn sẽ thấy ở đây."
                  actionHref="/(dashboard)/student/topics"
                  actionText="Xem danh sách đề tài"
                />
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-neutral-600 border-b">
                      <th className="py-2 pr-3 font-medium">Mã</th>
                      <th className="py-2 pr-3 font-medium">Tên đề tài</th>
                      <th className="py-2 pr-3 font-medium">Trạng thái</th>
                      <th className="py-2 pr-3 font-medium">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedList.map((t) => (
                      <tr key={t.code} className="border-b last:border-none">
                        <td className="py-2 pr-3">{t.code}</td>
                        <td className="py-2 pr-3">
                          <div>{t.title}</div>
                        </td>
                        <td className="py-2 pr-3">
                          <StatusBadge status={t.status} />
                        </td>
                        <td className="py-2 pr-3">
                          <button
                            type="button"
                            onClick={() => openByCode(t.code)}
                            className="inline-flex h-8 items-center justify-center px-3 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 transition"
                          >
                            Xem
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Panel chi tiết */}
      <SlideOver open={openView} onClose={onClose} title="Chi tiết đề tài">
        {!viewData ? (
          <div className="p-6 text-sm text-neutral-600">Đang tải…</div>
        ) : (
          <DetailContent
            data={viewData}
            editable={canEdit(viewData.status)}
            downloadable={canDownload(viewData.status)}
            edit={edit}
            onChange={onChange}
            onSave={onSave}
          />
        )}
      </SlideOver>
    </div>
  );
}

/* =============== UI phụ trợ =============== */

function EmptyState({
  title,
  desc,
  actionHref,
  actionText,
}: {
  title: string;
  desc: string;
  actionHref: string;
  actionText: string;
}) {
  return (
    <div className="py-10 text-center text-neutral-700">
      <p className="font-medium">{title}</p>
      <p className="text-sm mt-1">{desc}</p>
      <Link
        href={actionHref}
        className="inline-flex mt-4 h-9 items-center justify-center px-3 rounded-md bg-blue-700 text-white hover:bg-blue-800 transition"
      >
        {actionText}
      </Link>
    </div>
  );
}

function StatusBadge({ status }: { status: TopicStatus }) {
  const map: Record<TopicStatus, { text: string; cls: string }> = {
    PENDING: {
      text: "Đang duyệt",
      cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    },
    NEEDS_UPDATE: {
      text: "Cần bổ sung",
      cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
    },
    REJECTED: {
      text: "Từ chối",
      cls: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
    },
    APPROVED: {
      text: "Đã duyệt",
      cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    },
  };
  const { text, cls } = map[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}
    >
      {text}
    </span>
  );
}

/* =============== SlideOver =============== */

function SlideOver({
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
      className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`absolute right-0 top-0 h-full w-full sm:w-[735px] bg-white shadow-xl border-l transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <p className="text-[15px] font-semibold">{title ?? "Chi tiết"}</p>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>
        <div className="h-[calc(100vh-57px)] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/* =============== DetailContent (inline edit) =============== */

function DetailContent({
  data,
  editable,
  downloadable,
  edit,
  onChange,
  onSave,
}: {
  data: TopicDetail;
  editable: boolean;
  downloadable: boolean;
  edit: TopicDetail | null;
  onChange: <K extends keyof TopicDetail>(k: K, v: TopicDetail[K]) => void;
  onSave: () => void;
}) {
  const readOnly = !editable;

  return (
    <div className="p-6 space-y-8">
      {/* Header + actions */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#0b57a8]">{data.title}</h2>
          <p className="text-sm text-neutral-600 mt-1">
            Mã: <span className="font-medium">{data.code}</span>
          </p>
          <div className="mt-2">
            <StatusBadge status={data.status} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {downloadable && (
            <a
              href={contractUrl(data.code)}
              className="inline-flex h-9 items-center justify-center px-3 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 transition"
            >
              Tải
            </a>
          )}
        </div>
      </div>

      {/* 1) Thông tin chung */}
      <section className="space-y-3">
        <h3 className="font-medium flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-semibold">
            1
          </span>
          Thông tin chung
        </h3>

        {/* SV chủ nhiệm */}
        <Field label="Sinh viên chủ nhiệm">
          {readOnly ? (
            <div className="text-sm">{data.studentLeader}</div>
          ) : (
            <input
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              value={edit?.studentLeader ?? ""}
              onChange={(e) => onChange("studentLeader", e.target.value)}
            />
          )}
        </Field>

        {/* Thành viên tham gia */}
        <Field label="Thành viên tham gia (mã SV, cách nhau dấu phẩy)">
          {readOnly ? (
            <div className="text-sm">{data.members || "-"}</div>
          ) : (
            <input
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              value={edit?.members ?? ""}
              onChange={(e) => onChange("members", e.target.value)}
            />
          )}
        </Field>

        {/* Giảng viên tư vấn */}
        <Field label="Giảng viên tư vấn">
          {readOnly ? (
            <div className="text-sm">{data.advisor}</div>
          ) : (
            <input
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              value={edit?.advisor ?? ""}
              onChange={(e) => onChange("advisor", e.target.value)}
            />
          )}
        </Field>
      </section>

      {/* 2) Nội dung đề tài */}
      <section className="space-y-3">
        <h3 className="font-medium flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-semibold">
            2
          </span>
          Nội dung đề tài
        </h3>

        {/* Tên đề tài */}
        <Field label="Tên đề tài">
          {readOnly ? (
            <div className="text-sm">{data.title}</div>
          ) : (
            <input
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              value={edit?.title ?? ""}
              onChange={(e) => onChange("title", e.target.value)}
            />
          )}
        </Field>

        {/* Mục tiêu */}
        <Field label="Mục tiêu (≤100 từ)">
          {readOnly ? (
            <div className="text-sm whitespace-pre-line">{data.objective}</div>
          ) : (
            <textarea
              rows={3}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              value={edit?.objective ?? ""}
              onChange={(e) => onChange("objective", e.target.value)}
            />
          )}
        </Field>

        {/* Nội dung chính */}
        <Field label="Nội dung chính (≤100 từ)">
          {readOnly ? (
            <div className="text-sm whitespace-pre-line">{data.content}</div>
          ) : (
            <textarea
              rows={5}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              value={edit?.content ?? ""}
              onChange={(e) => onChange("content", e.target.value)}
            />
          )}
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kinh phí */}
          <Field label="Kinh phí đề nghị">
            {readOnly ? (
              <div className="text-sm">{data.budget}</div>
            ) : (
              <input
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                value={edit?.budget ?? ""}
                onChange={(e) => onChange("budget", e.target.value)}
              />
            )}
          </Field>

          {/* Ghi chú */}
          <Field label="Ghi chú">
            {readOnly ? (
              <div className="text-sm">{data.note || "-"}</div>
            ) : (
              <textarea
                rows={3}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                value={edit?.note ?? ""}
                onChange={(e) => onChange("note", e.target.value)}
              />
            )}
          </Field>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-2">
        {editable && (
          <button
            onClick={onSave}
            className="inline-flex h-9 items-center justify-center px-4 rounded-md bg-blue-700 text-white hover:bg-blue-800 transition"
          >
            Lưu thay đổi
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="text-[12px] uppercase tracking-wide text-neutral-500">
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}
