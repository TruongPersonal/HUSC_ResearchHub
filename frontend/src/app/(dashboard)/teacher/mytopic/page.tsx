"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

/* ================== Types ================== */
type TopicStatus = "PENDING" | "NEEDS_UPDATE" | "REJECTED" | "APPROVED";

type TopicRow = {
  code: string;
  title: string;
  status: TopicStatus;
  studentLeader?: string;
  advisor?: string;
};

type JoinRequest = {
  studentCode: string;
  fullName: string;
  note?: string;
  createdAt: string; // yyyy-mm-dd
};

type TopicDetail = {
  code: string;
  title: string;
  status: TopicStatus;
  studentLeader: string;
  members: string; // comma list (mã SV)
  advisor: string; // implicit = current teacher (hiển thị ở read-only)
  objective: string;
  content: string;
  budget: string;
  note: string;
  joinRequests?: JoinRequest[];
};

/* ================== Mock data ================== */
const LIST: TopicRow[] = [
  { code: "NCKH-25-001", title: "Ứng dụng học máy trong phân loại văn bản tiếng Việt", status: "PENDING" },
  { code: "NCKH-25-014", title: "Phân tích mạng xã hội cho dữ liệu giáo dục", status: "NEEDS_UPDATE", studentLeader: "23T1020999" },
  { code: "NCKH-25-028", title: "Hệ thống gợi ý đề tài cho sinh viên năm 3", status: "REJECTED" },
  { code: "NCKH-25-042", title: "Xây dựng portal quản lý NCKH sinh viên HUSC ResearchHub", status: "APPROVED", studentLeader: "23T1020001", advisor: "TS. Nguyễn Văn Trung" },
];

const DETAILS: Record<string, TopicDetail> = {
  "NCKH-25-001": {
    code: "NCKH-25-001",
    title: "Ứng dụng học máy trong phân loại văn bản tiếng Việt",
    status: "PENDING",
    studentLeader: "",
    members: "23T1020565, 23T1020532",
    advisor: "",
    objective: "Ứng dụng mô hình học máy để phân loại văn bản tiếng Việt theo chủ đề.",
    content: "Thu thập dữ liệu, tiền xử lý, baseline SVM/NB, thử BERT, đánh giá & demo web.",
    budget: "10 triệu",
    note: "Nhóm tự chuẩn bị dữ liệu mở.",
    joinRequests: [
      { studentCode: "23T1020573", fullName: "Ngô Quang Trường", note: "Quan tâm NLP, đã học ML.", createdAt: "2025-10-18" },
      { studentCode: "23T1020123", fullName: "Trần An", note: "Có kinh nghiệm thu thập dữ liệu.", createdAt: "2025-10-18" },
    ],
  },
  "NCKH-25-014": {
    code: "NCKH-25-014",
    title: "Phân tích mạng xã hội cho dữ liệu giáo dục",
    status: "NEEDS_UPDATE",
    studentLeader: "23T1020999",
    members: "23T1020999",
    advisor: "ThS. Trần Thị B",
    objective: "Phân tích tương tác SV trên LMS để gợi ý nhóm học & tài liệu.",
    content: "Khai phá mạng học tập, đo centrality/communities; thử nghiệm gợi ý.",
    budget: "9 triệu",
    note: "Bổ sung kế hoạch đạo đức nghiên cứu (IRB).",
    joinRequests: [],
  },
  "NCKH-25-028": {
    code: "NCKH-25-028",
    title: "Hệ thống gợi ý đề tài cho sinh viên năm 3",
    status: "REJECTED",
    studentLeader: "",
    members: "",
    advisor: "",
    objective: "Gợi ý đề tài theo sở thích & năng lực học phần.",
    content: "Hồ sơ môn học/kỹ năng; CF/CBF; đánh giá offline.",
    budget: "8 triệu",
    note: "Trùng hướng với đề tài cấp Khoa đã có.",
    joinRequests: [],
  },
  "NCKH-25-042": {
    code: "NCKH-25-042",
    title: "Xây dựng portal quản lý NCKH sinh viên HUSC ResearchHub",
    status: "APPROVED",
    studentLeader: "23T1020001",
    members: "23T1020002, 23T1020003",
    advisor: "TS. Nguyễn Văn Trung",
    objective: "Xây hệ thống web quản lý quy trình NCKH SV tại HUSC.",
    content: "Phân tích quy trình, thiết kế CSDL, FE Next.js, BE Spring Boot, thông báo, minh chứng.",
    budget: "10 triệu",
    note: "Đã duyệt, nộp hợp đồng trong tuần.",
    joinRequests: [{ studentCode: "23T1012345", fullName: "Lê Bình", note: "Front-end Next.js", createdAt: "2025-10-16" }],
  },
};

const contractUrl = (code: string) => `/files/contract_template.docx`;
const CREATE_TOPIC_HREF = "/teacher/topicregistration";

/* ================== Page ================== */
export default function TeacherMyTopicsPage() {
  const WRAPPER_W = "w-[1120px]";
  const TABLE_MIN_W = "min-w-[880px]";

  type Tab = "pending" | "approved";
  const pendingList = useMemo(() => LIST.filter(t => t.status !== "APPROVED"), []);
  const approvedList = useMemo(() => LIST.filter(t => t.status === "APPROVED"), []);
  const [tab, setTab] = useState<Tab>(pendingList.length ? "pending" : "approved");

  const list = tab === "approved" ? approvedList : pendingList;

  // panel
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<TopicDetail | null>(null);

  const openByCode = (code: string) => {
    const d = DETAILS[code];
    setData({ ...d });
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setTimeout(() => setData(null), 250);
  };

  // helper
  const canDownload = (d: TopicDetail) => d.status === "APPROVED" && !!d.studentLeader;
  const isLocked = (d?: TopicDetail | null) => !d ? true : d.status === "APPROVED" || d.status === "REJECTED";

  // SAVE (chỉ khi còn chỉnh được)
  const saveMeta = () => {
    if (!data || isLocked(data)) return;
    console.log("SAVE meta:", data);
    // TODO: call API
  };

  // join requests
  const approveJoin = (studentCode: string) => {
    if (!data || isLocked(data)) return;
    const filtered = data.joinRequests?.filter(r => r.studentCode !== studentCode) ?? [];
    const membersSet = new Set(chipsFromCSV(data.members));
    membersSet.add(studentCode);
    setData({ ...data, joinRequests: filtered, members: Array.from(membersSet).join(", ") });
  };
  const rejectJoin = (studentCode: string) => {
    if (!data || isLocked(data)) return;
    setData({ ...data, joinRequests: data.joinRequests?.filter(r => r.studentCode !== studentCode) });
  };

  // SVCN & member ops
  const setLeader = (studentCode: string) => {
    if (!data || isLocked(data)) return;
    const members = chipsFromCSV(data.members);
    if (!members.includes(studentCode)) return;
    setData({ ...data, studentLeader: studentCode });
  };
  const removeMember = (studentCode: string) => {
    if (!data || isLocked(data)) return;
    if (data.studentLeader === studentCode) {
      window.alert("Không thể xoá SVCN. Hãy chọn SVCN khác trước.");
      return;
    }
    const members = chipsFromCSV(data.members).filter(m => m !== studentCode);
    setData({ ...data, members: members.join(", ") });
  };

  return (
    <div className="min-h-screen mt-20">
      <main className={`mx-auto ${WRAPPER_W} py-10`}>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-purple-800">Đề tài của tôi</h1>
          <p className="text-neutral-700 mt-1 text-sm">Quản lý thành viên & SVCN, xử lý yêu cầu tham gia.</p>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <div className="bg-white rounded-xl border border-neutral-200 shadow p-3 flex items-center justify-between">
            <TabsList className="bg-neutral-100 p-1 rounded-lg">
              <TabsTrigger value="pending" className="px-4">Chưa duyệt</TabsTrigger>
              <TabsTrigger value="approved" className="px-4">Đã duyệt</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Link
                href={CREATE_TOPIC_HREF}
                className="h-10 inline-flex items-center justify-center px-4 rounded-md bg-blue-700 text-white font-semibold hover:bg-blue-800 active:bg-blue-900 transition"
              >
                + Đăng ký đề tài
              </Link>
            </div>
          </div>

          <TabsContent value="pending" className="mt-4">
            <TopicTable list={tab === "pending" ? list : []} onOpen={openByCode} minW={TABLE_MIN_W} />
          </TabsContent>
          <TabsContent value="approved" className="mt-4">
            <TopicTable list={tab === "approved" ? list : []} onOpen={openByCode} minW={TABLE_MIN_W} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Panel chi tiết */}
      <SlideOver open={open} onClose={close} title="Chi tiết đề tài">
        {!data ? (
          <div className="p-6 text-sm text-neutral-600">Đang tải…</div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Header + tải */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-purple-800 leading-snug">{data.title}</h2>
                <div className="text-sm text-neutral-600">Mã: <span className="font-medium">{data.code}</span></div>
                <div className="mt-2"><StatusBadge status={data.status} /></div>
              </div>
              <div className="flex items-center gap-2">
                {canDownload(data) && (
                  <a href={contractUrl(data.code)} className="inline-flex h-9 items-center justify-center px-3 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 transition">
                    Tải
                  </a>
                )}
              </div>
            </div>

            {/* Read-only vs Editable */}
            {isLocked(data) ? (
              <>
                <ReadSection no={1} title="Thông tin chung">
                  <ReadItem label="Sinh viên chủ nhiệm" value={data.studentLeader || "—"} />
                  <ReadItem label="Thành viên tham gia (mã SV, cách nhau dấu phẩy)" value={data.members || "—"} />
                  <ReadItem label="Giảng viên tư vấn" value={data.advisor || "—"} />
                </ReadSection>
                <ReadSection no={2} title="Nội dung đề tài">
                  <ReadItem label="Tên đề tài" value={data.title} />
                  <Grid two>
                    <ReadItem label="Mục tiêu (≤100 từ)" value={data.objective || "—"} />
                    <ReadItem label="Nội dung chính (≤100 từ)" value={data.content || "—"} />
                  </Grid>
                  <Grid two>
                    <ReadItem label="Kinh phí đề nghị" value={data.budget || "—"} />
                    <ReadItem label="Ghi chú" value={data.note || "—"} />
                  </Grid>
                </ReadSection>
              </>
            ) : (
              <>
                <Section title="Nội dung">
                  <Field label="Tên đề tài">
                    <input
                      value={data.title}
                      onChange={(e) => setData({ ...data, title: e.target.value })}
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-100"
                    />
                  </Field>
                  <Grid two>
                    <Field label="Mục tiêu (≤100 từ)">
                      <textarea
                        rows={3}
                        value={data.objective}
                        onChange={(e) => setData({ ...data, objective: e.target.value })}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-100"
                      />
                    </Field>
                    <Field label="Nội dung chính (≤100 từ)">
                      <textarea
                        rows={3}
                        value={data.content}
                        onChange={(e) => setData({ ...data, content: e.target.value })}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-100"
                      />
                    </Field>
                  </Grid>
                  <Grid two>
                    <Field label="Kinh phí đề nghị">
                      <input
                        value={data.budget}
                        onChange={(e) => setData({ ...data, budget: e.target.value })}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-100"
                      />
                    </Field>
                    <Field label="Ghi chú">
                      <textarea
                        rows={3}
                        value={data.note}
                        onChange={(e) => setData({ ...data, note: e.target.value })}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-100"
                      />
                    </Field>
                  </Grid>
                </Section>

                <Section title="Thành viên & SVCN">
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="space-y-1">
                      <div className="text-[12px] uppercase tracking-wide text-neutral-500">Sinh viên chủ nhiệm</div>
                      <select
                        value={data.studentLeader || ""}
                        onChange={(e) => setLeader(e.target.value)}
                        disabled={chipsFromCSV(data.members).length === 0}
                        className="w-full h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm"
                      >
                        <option value="" disabled>— Chọn từ thành viên —</option>
                        {chipsFromCSV(data.members).map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {chipsFromCSV(data.members).length === 0 ? (
                      <span className="text-sm text-neutral-500 italic">Chưa có thành viên.</span>
                    ) : (
                      chipsFromCSV(data.members).map((m) => {
                        const isLeader = m === data.studentLeader;
                        return (
                          <span
                            key={m}
                            className={`group inline-flex items-center gap-2 pl-2 pr-1 py-1 rounded-full text-xs font-medium ring-1
                              ${isLeader ? "bg-amber-50 text-amber-800 ring-amber-200" : "bg-neutral-100 text-neutral-700 ring-neutral-200"}`}
                            title={isLeader ? "Sinh viên chủ nhiệm" : "Thành viên"}
                          >
                            {isLeader ? "👑" : "👤"} {m}
                            {!isLeader && (
                              <button
                                onClick={() => removeMember(m)}
                                className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-black/10"
                                aria-label={`Xoá ${m}`}
                                title="Xoá thành viên"
                              >
                                ×
                              </button>
                            )}
                          </span>
                        );
                      })
                    )}
                  </div>
                </Section>

                <Section title="Yêu cầu tham gia">
                  {!data.joinRequests || data.joinRequests.length === 0 ? (
                    <div className="text-sm text-neutral-500 italic">Không có yêu cầu đang chờ xử lý.</div>
                  ) : (
                    <div className="space-y-2">
                      {data.joinRequests.map((r) => (
                        <div key={r.studentCode} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border rounded-lg p-3 bg-white">
                          <div className="text-sm">
                            <div className="font-medium">{r.studentCode} — {r.fullName}</div>
                            <div className="text-neutral-600">{r.note || "(không có ghi chú)"}</div>
                            <div className="text-xs text-neutral-500 mt-0.5">Gửi: {r.createdAt}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => approveJoin(r.studentCode)} className="inline-flex h-8 items-center justify-center px-3 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition">
                              Chấp nhận
                            </button>
                            <button onClick={() => rejectJoin(r.studentCode)} className="inline-flex h-8 items-center justify-center px-3 rounded-md bg-rose-600 text-white hover:bg-rose-700 transition">
                              Từ chối
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Section>

                {/* Nút Lưu */}
                <div className="flex items-center justify-end">
                  <button onClick={saveMeta} className="inline-flex h-9 items-center justify-center px-4 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 transition">
                    Lưu
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </SlideOver>
    </div>
  );
}

/* ================== Small UI helpers ================== */
function TopicTable({ list, onOpen, minW }: { list: TopicRow[]; onOpen: (code: string) => void; minW: string; }) {
  return (
    <div className={`bg-white rounded-2xl border border-neutral-200 shadow p-4 ${minW}`}>
      {list.length === 0 ? (
        <Empty title="Không có đề tài phù hợp" desc="Đổi bộ lọc để xem đề tài khác." />
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
            {list.map((t) => (
              <tr key={t.code} className="border-b last:border-none">
                <td className="py-2 pr-3">{t.code}</td>
                <td className="py-2 pr-3">{t.title}</td>
                <td className="py-2 pr-3"><StatusBadge status={t.status} /></td>
                <td className="py-2 pr-3">
                  <button
                    onClick={() => onOpen(t.code)}
                    className="inline-flex h-8 items-center justify-center px-3 rounded-md border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 transition"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function Empty({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="py-10 text-center text-neutral-700">
      <p className="font-medium">{title}</p>
      <p className="text-sm mt-1">{desc}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: TopicStatus }) {
  const map: Record<TopicStatus, { text: string; cls: string }> = {
    PENDING:      { text: "Đang duyệt",   cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-100" },
    NEEDS_UPDATE: { text: "Cần bổ sung",  cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-100" },
    REJECTED:     { text: "Từ chối",      cls: "bg-rose-50 text-rose-700 ring-1 ring-rose-100" },
    APPROVED:     { text: "Đã duyệt",     cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" },
  };
  const s = map[status];
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}>{s.text}</span>;
}

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
    <div aria-hidden={!open} className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
      <div role="dialog" aria-modal="true" className={`absolute right-0 top-0 h-full w-full sm:w-[735px] bg-white shadow-xl border-l transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <p className="text-[15px] font-semibold">{title ?? "Chi tiết"}</p>
          <button onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100" aria-label="Đóng">✕</button>
        </div>
        <div className="h-[calc(100vh-57px)] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-[12px] uppercase tracking-wide text-neutral-500">{title}</div>
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-[12px] uppercase tracking-wide text-neutral-500">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function Grid({ two, children }: { two?: boolean; children: React.ReactNode }) {
  return <div className={`grid gap-4 ${two ? "grid-cols-1 md:grid-cols-2" : ""}`}>{children}</div>;
}

/* ======= Read-only helpers ======= */
function ReadSection({ no, title, children }: { no: number; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-semibold">{no}</span>
        <div className="text-[15px] font-semibold">{title}</div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
function ReadItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-[12px] uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="text-sm leading-relaxed">{value || "—"}</div>
    </div>
  );
}

/* ======= Utils ======= */
function chipsFromCSV(csv: string) {
  return csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
