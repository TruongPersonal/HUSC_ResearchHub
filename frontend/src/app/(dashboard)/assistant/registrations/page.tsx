"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, Settings2, Pencil } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

/* ===== Types ===== */
type Status = "PENDING" | "NEEDS_UPDATE" | "REJECTED" | "APPROVED";
type TopicRow = {
  code: string;
  title: string;
  short?: string;
  status: Status;
  studentLeader?: string; // mã SV
  advisor?: string;       // mã GV
  submittedAt: string;    // ISO
  objective?: string;
  content?: string;
  budget?: string;
  note?: string;          // <-- Ghi chú
};

/* ===== Mock master data ===== */
const TEACHERS = [
  { id: "gv_hoa", name: "TS. Nguyễn Văn A" },
  { id: "gv_binh", name: "ThS. Lê Văn B" },
  { id: "gv_hanh", name: "TS. Phạm Thị C" },
];

const STUDENTS = [
  { id: "23T1020573", name: "Ngô Quang Trường" },
  { id: "23T1088888", name: "Trần Thu H." },
  { id: "22T1011111", name: "Nguyễn Minh K." },
  { id: "24T1000123", name: "Võ Hải D." },
];

/* ===== Mock topics ===== */
const MOCK: TopicRow[] = [
  {
    code: "NCKH-25-001",
    title: "Ứng dụng học máy trong phân loại văn bản tiếng Việt",
    short: "Pipeline với BERT + demo web.",
    status: "PENDING",
    studentLeader: "23T1020573",
    advisor: "gv_hoa",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    objective: "Xây dựng mô hình phân loại văn bản tiếng Việt.",
    content: "Thu thập dữ liệu, fine-tune PhoBERT, xây dashboard.",
    budget: "3.000.000đ",
    note: "Cần bổ sung tập dữ liệu mẫu.",
  },
  {
    code: "NCKH-25-014",
    title: "Phân tích mạng xã hội học thuật tại HUSC",
    short: "Khai phá đồng tác giả và chủ đề.",
    status: "NEEDS_UPDATE",
    studentLeader: "23T1088888",
    advisor: "gv_binh",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    objective: "Mô hình hoá mạng đồng tác giả.",
    content: "Thu thập dữ liệu Google Scholar, trích xuất graph.",
    budget: "1.500.000đ",
  },
  {
    code: "NCKH-25-022",
    title: "Nhận dạng biển số xe thời gian thực",
    short: "YOLOv8 + OCR Viet.",
    status: "REJECTED",
    studentLeader: "22T1011111",
    advisor: "gv_hanh",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    note: "Đề xuất trùng chủ đề, yêu cầu hướng mới.",
  },
  {
    code: "NCKH-25-030",
    title: "Tối ưu hoá lịch thực hành phòng máy",
    short: "Thuật toán ràng buộc + UI",
    status: "APPROVED",
    studentLeader: "24T1000123",
    advisor: "gv_binh",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    content: "Model CSP, heuristic, UI Next.js.",
    budget: "2.000.000đ",
  },
];

/* ===== Helpers ===== */
const statusText = (s: Status) =>
  s === "PENDING" ? "Đang duyệt" :
  s === "NEEDS_UPDATE" ? "Cần bổ sung" :
  s === "REJECTED" ? "Từ chối" : "Đã duyệt";

const statusBadge = (s: Status) => {
  const base = "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs border";
  if (s === "PENDING") return <span className={`${base} border-amber-200 bg-amber-50 text-amber-700`}>Đang duyệt</span>;
  if (s === "NEEDS_UPDATE") return <span className={`${base} border-blue-200 bg-blue-50 text-blue-700`}>Cần bổ sung</span>;
  if (s === "REJECTED") return <span className={`${base} border-rose-200 bg-rose-50 text-rose-700`}>Từ chối</span>;
  return <span className={`${base} border-emerald-200 bg-emerald-50 text-emerald-700`}>Đã duyệt</span>;
};

const teacherName = (id?: string) => TEACHERS.find(t => t.id === id)?.name ?? "—";
const studentName = (id?: string) => STUDENTS.find(s => s.id === id)?.name ?? "—";

/* ===== Page ===== */
export default function RegistrationsPage() {
  const [items, setItems] = useState<TopicRow[]>(MOCK);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<Status | "ALL">("ALL");

  // derived
  const counts = useMemo(() => {
    const c = { ALL: items.length, PENDING: 0, NEEDS_UPDATE: 0, REJECTED: 0, APPROVED: 0 } as Record<string, number>;
    items.forEach(i => (c[i.status] += 1));
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    const qn = q.trim().toLowerCase();
    const byTab = tab === "ALL" ? items : items.filter(i => i.status === tab);
    if (!qn) return byTab;
    return byTab.filter(i =>
      i.code.toLowerCase().includes(qn) ||
      i.title.toLowerCase().includes(qn) ||
      (i.short ?? "").toLowerCase().includes(qn) ||
      studentName(i.studentLeader).toLowerCase().includes(qn) ||
      teacherName(i.advisor).toLowerCase().includes(qn)
    );
  }, [items, q, tab]);

  // dialogs
  const [detailCode, setDetailCode] = useState<string | null>(null);
  const [actionCode, setActionCode] = useState<string | null>(null);

  // View (Xem) dialog: edit toggle
  const currentView = items.find(x => x.code === detailCode);
  const [editMode, setEditMode] = useState(false);
  const [viewForm, setViewForm] = useState<Pick<TopicRow, "title"|"short"|"objective"|"content"|"budget"|"note">>({
    title: "", short: "", objective: "", content: "", budget: "", note: ""
  });

  const openView = (t: TopicRow) => {
    setDetailCode(t.code);
    setEditMode(false);
    setViewForm({
      title: t.title,
      short: t.short ?? "",
      objective: t.objective ?? "",
      content: t.content ?? "",
      budget: t.budget ?? "",
      note: t.note ?? "",
    });
  };

  const saveViewEdits = () => {
    if (!currentView) return;
    setItems(prev => prev.map(x => x.code === currentView.code ? {
      ...x,
      title: viewForm.title || x.title,
      short: viewForm.short,
      objective: viewForm.objective,
      content: viewForm.content,
      budget: viewForm.budget,
      note: viewForm.note,
    } : x));
    setEditMode(false);
  };

  // Action dialog (GVHD, SV, Trạng thái)
  const currentAction = items.find(x => x.code === actionCode);
  const [actionForm, setActionForm] = useState<{ advisor?: string; studentLeader?: string; status: Status } | null>(null);

  const openAction = (t: TopicRow) => {
    setActionCode(t.code);
    setActionForm({ advisor: t.advisor, studentLeader: t.studentLeader, status: t.status });
  };

  const saveAction = () => {
    if (!actionCode || !actionForm) return;
    setItems(prev => prev.map(x => x.code === actionCode ? {
      ...x,
      advisor: actionForm.advisor,
      studentLeader: actionForm.studentLeader,
      status: actionForm.status,
    } : x));
    setActionCode(null);
  };

  return (
    <div className="space-y-6">
      {/* Header + search */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Danh sách đề tài</h1>
          <p className="text-sm text-gray-600">Duyệt hồ sơ đăng ký, cập nhật, ghi chú, chỉnh sửa thông tin danh sách đề tài.</p>
        </div>
        <div className="w-[280px]">
          <Input placeholder="Tìm mã/tên đề tài, SVCN, GVHD" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList className="grid w-full grid-cols-5 md:w-[820px]">
          <TabsTrigger value="ALL">Tất cả <Badge className="ml-2" variant="secondary">{counts.ALL}</Badge></TabsTrigger>
          <TabsTrigger value="PENDING">Đang duyệt <Badge className="ml-2" variant="secondary">{counts.PENDING}</Badge></TabsTrigger>
          <TabsTrigger value="NEEDS_UPDATE">Cần bổ sung <Badge className="ml-2" variant="secondary">{counts.NEEDS_UPDATE}</Badge></TabsTrigger>
          <TabsTrigger value="REJECTED">Từ chối <Badge className="ml-2" variant="secondary">{counts.REJECTED}</Badge></TabsTrigger>
          <TabsTrigger value="APPROVED">Đã duyệt <Badge className="ml-2" variant="secondary">{counts.APPROVED}</Badge></TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {!filtered.length ? (
            <div className="text-sm text-neutral-500">Không có đề tài phù hợp.</div>
          ) : (
            <div className="grid gap-3">
              {filtered.map(t => (
                <div key={t.code} className="rounded-xl border bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="font-semibold text-[#0b57a8]">{t.title}</div>
                        {statusBadge(t.status)}
                      </div>
                      <div className="mt-1 text-xs text-neutral-500">
                        Nộp: {new Date(t.submittedAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {/* Xem (cho phép chỉnh sửa) */}
                      <Dialog open={detailCode === t.code} onOpenChange={(o) => { if (!o) { setDetailCode(null); setEditMode(false); } }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => openView(t)}>
                            <Eye className="h-4 w-4" /> Xem
                          </Button>
                        </DialogTrigger>
                        {currentView && (
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Chi tiết — {currentView.code}</DialogTitle>
                            </DialogHeader>

                            <div className="flex items-start justify-between gap-3">
                              <div className="text-lg font-semibold text-[#0b57a8]">{currentView.title}</div>
                              <Button size="sm" variant={editMode ? "secondary" : "default"} className="gap-1" onClick={() => setEditMode(v => !v)}>
                                <Pencil className="h-4 w-4" /> {editMode ? "Thoát sửa" : "Chỉnh sửa"}
                              </Button>
                            </div>

                            {/* Body */}
                            {!editMode ? (
                              <div className="mt-3 space-y-3">
                                <DetailRow label="Mô tả ngắn">{currentView.short || "—"}</DetailRow>
                                <DetailRow label="Mục tiêu">{currentView.objective || "—"}</DetailRow>
                                <DetailRow label="Nội dung">{currentView.content || "—"}</DetailRow>
                                <DetailRow label="Kinh phí dự kiến">{currentView.budget || "—"}</DetailRow>
                                <DetailRow label="Ghi chú">{currentView.note || "—"}</DetailRow>
                              </div>
                            ) : (
                              <div className="mt-3 space-y-3">
                                <Field label="Tên đề tài">
                                  <Input value={viewForm.title} onChange={(e) => setViewForm(s => ({ ...s, title: e.target.value }))} />
                                </Field>
                                <Field label="Mô tả ngắn">
                                  <Textarea className="min-h-[80px]" value={viewForm.short} onChange={(e) => setViewForm(s => ({ ...s, short: e.target.value }))} />
                                </Field>
                                <Field label="Mục tiêu">
                                  <Textarea className="min-h-[100px]" value={viewForm.objective} onChange={(e) => setViewForm(s => ({ ...s, objective: e.target.value }))} />
                                </Field>
                                <Field label="Nội dung">
                                  <Textarea className="min-h-[120px]" value={viewForm.content} onChange={(e) => setViewForm(s => ({ ...s, content: e.target.value }))} />
                                </Field>
                                <Field label="Kinh phí dự kiến">
                                  <Input value={viewForm.budget} onChange={(e) => setViewForm(s => ({ ...s, budget: e.target.value }))} />
                                </Field>
                                <Field label="Ghi chú">
                                  <Textarea className="min-h-[80px]" value={viewForm.note} onChange={(e) => setViewForm(s => ({ ...s, note: e.target.value }))} />
                                </Field>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setEditMode(false)}>Hủy</Button>
                                  <Button onClick={saveViewEdits}>Lưu</Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        )}
                      </Dialog>

                      {/* Thao tác (GVHD, SV, Trạng thái) */}
                      <Dialog open={actionCode === t.code} onOpenChange={(o) => !o && setActionCode(null)}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="gap-1" onClick={() => openAction(t)}>
                            <Settings2 className="h-4 w-4" /> Thao tác
                          </Button>
                        </DialogTrigger>
                        {currentAction && actionForm && (
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Thao tác — {currentAction.code}</DialogTitle>
                            </DialogHeader>

                            <Field label="Chọn giảng viên hướng dẫn">
                              <Select
                                value={actionForm.advisor ?? ""}
                                onValueChange={(v) => setActionForm(s => ({ ...(s as any), advisor: v || undefined }))}
                              >
                                <SelectTrigger className="w-full"><SelectValue placeholder="Chọn GVHD" /></SelectTrigger>
                                <SelectContent>
                                  {TEACHERS.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </Field>

                            <Field label="Chọn sinh viên chủ nhiệm">
                              <Select
                                value={actionForm.studentLeader ?? ""}
                                onValueChange={(v) => setActionForm(s => ({ ...(s as any), studentLeader: v || undefined }))}
                              >
                                <SelectTrigger className="w-full"><SelectValue placeholder="Chọn SV chủ nhiệm" /></SelectTrigger>
                                <SelectContent>
                                  {STUDENTS.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.id})</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </Field>

                            <Field label="Trạng thái">
                              <Select
                                value={actionForm.status}
                                onValueChange={(v) => setActionForm(s => ({ ...(s as any), status: v as Status }))}
                              >
                                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PENDING">Đang duyệt</SelectItem>
                                  <SelectItem value="NEEDS_UPDATE">Cần bổ sung</SelectItem>
                                  <SelectItem value="REJECTED">Từ chối</SelectItem>
                                  <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                                </SelectContent>
                              </Select>
                            </Field>

                            <div className="flex justify-end gap-2 pt-2">
                              <Button variant="outline" onClick={() => setActionCode(null)}>Hủy</Button>
                              <Button onClick={saveAction}>Lưu</Button>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ===== Tiny UI bits ===== */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-sm font-medium">{label}</div>
      {children}
    </div>
  );
}
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 items-start gap-3">
      <div className="col-span-1 text-sm font-medium text-neutral-700">{label}</div>
      <div className="col-span-2 text-sm text-neutral-800 whitespace-pre-wrap">{children}</div>
    </div>
  );
}
