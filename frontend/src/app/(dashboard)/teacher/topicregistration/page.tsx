"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Search, Info, Send } from "lucide-react";

/* ================== Types (CHUẨN HOÁ) ================== */
// Trang này CHỈ làm việc với 2 trạng thái: ĐÃ DUYỆT, TỪ CHỐI
export type TopicStatus = "APPROVED" | "REJECTED";

export type TopicRow = {
  code: string;        // Mã đề tài
  title: string;       // Tên đề tài
  status: TopicStatus; // Chỉ APPROVED | REJECTED
  short?: string;      // Mô tả ngắn
  objective?: string;  // Mục tiêu tóm tắt
  content?: string;    // Nội dung tóm tắt
  budget?: string;     // Kinh phí đề xuất/được duyệt
  year: number;        // Năm bắt đầu năm học (ví dụ 2024 cho 2024–2025)
};

/* ================== Mock data (CHỈ 2 TRẠNG THÁI HỢP LỆ) ================== */
const MY_TOPICS: TopicRow[] = [
    {
    code: "NCKH-24-027",
    title: "Hệ thống khuyến nghị tài liệu học tập theo học phần",
    status: "APPROVED",
    short: "Recommender cho tài liệu nội bộ khoa",
    objective: "Cá nhân hoá gợi ý tài liệu theo học phần và kết quả học tập.",
    content: "Matrix factorization/Content-based, đánh giá offline/online, tích hợp SSO của trường.",
    budget: "9 triệu",
    year: 2024,
  },
  {
    code: "NCKH-24-033",
    title: "Tối ưu hoá thời khoá biểu bằng thuật toán di truyền",
    status: "REJECTED",
    short: "GA + ràng buộc phòng và giảng viên",
    objective: "Tạo lịch thoả mãn ràng buộc phòng, ca, GV, giảm xung đột.",
    content: "Mã hoá nhiễm sắc thể, fitness, chọn-lai-đột biến, so sánh heuristic.",
    budget: "7 triệu",
    year: 2024,
  },
  {
    code: "NCKH-23-042",
    title: "Phát hiện gian lận trong thi cử trực tuyến bằng AI",
    status: "APPROVED",
    short: "AI giám sát thi online",
    objective: "Nhận diện hành vi bất thường qua webcam và âm thanh.",
    content: "Dùng CNN + audio analysis, cảnh báo real-time, dashboard giám sát.",
    budget: "10 triệu",
    year: 2023,
  },
  {
    code: "NCKH-24-018",
    title: "Phân loại cảm xúc sinh viên từ phản hồi học tập",
    status: "APPROVED",
    short: "NLP cho feedback học tập",
    objective: "Xây dựng mô hình phân tích cảm xúc để cải thiện giảng dạy.",
    content: "Fine-tune BERT tiếng Việt, visualization kết quả, dashboard giảng viên.",
    budget: "8 triệu",
    year: 2024,
  },
  {
    code: "NCKH-24-015",
    title: "Website quản lý đề tài nghiên cứu khoa học sinh viên",
    status: "APPROVED",
    short: "Hệ thống đăng ký đề tài NCKH",
    objective: "Quản lý đăng ký, duyệt, và báo cáo tiến độ NCKH.",
    content: "Spring Boot + React, phân quyền sinh viên, GV, khoa, báo cáo PDF.",
    budget: "7 triệu",
    year: 2024,
  },
  {
    code: "NCKH-22-061",
    title: "Phân tích hành vi truy cập web của sinh viên",
    status: "APPROVED",
    short: "Data analytics cho LMS",
    objective: "Phân tích dữ liệu sử dụng để gợi ý cải thiện học tập.",
    content: "ETL từ log, clustering người dùng, dashboard thống kê.",
    budget: "6 triệu",
    year: 2022,
  },
  {
    code: "NCKH-21-010",
    title: "Ứng dụng chatbot hỗ trợ sinh viên CNTT",
    status: "APPROVED",
    short: "Chatbot tư vấn học vụ",
    objective: "Trả lời câu hỏi thường gặp và hướng dẫn quy trình học tập.",
    content: "LLM fine-tune, RAG với dữ liệu trường, giao diện chat web.",
    budget: "12 triệu",
    year: 2021,
  },
  {
    code: "NCKH-24-008",
    title: "Nhận diện khuôn mặt sinh viên ra vào phòng máy",
    status: "REJECTED",
    short: "Face recognition cho quản lý phòng máy",
    objective: "Tự động điểm danh và cảnh báo truy cập trái phép.",
    content: "OpenCV + DeepFace, lưu lịch sử truy cập, báo cáo thống kê.",
    budget: "8 triệu",
    year: 2024,
  },
];

/* ================== Helpers ================== */
const MAX_WORDS = 100;
const wc = (s: string) => (s.trim().match(/\S+/g) || []).length;

function StatusBadge({ status }: { status: TopicStatus }) {
  const map: Record<TopicStatus, { label: string; cls: string }> = {
    APPROVED: { label: "Đã duyệt", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    REJECTED: { label: "Từ chối", cls: "bg-rose-50 text-rose-700 border-rose-200" },
  };
  const m = map[status];
  return <Badge variant="outline" className={`rounded-full ${m.cls}`}>{m.label}</Badge>;
}

/* ================== Propose (Teacher - tinh giản thông tin chung) ================== */

type TeacherProposeFormState = {
  title: string;
  objective: string;
  content: string;
  budget: string;
  note: string;
};

function TeacherProposeForm({ currentTeacher }: { currentTeacher: string }) {
  const [form, setForm] = useState<TeacherProposeFormState>({
    title: "",
    objective: "",
    content: "",
    budget: "",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const objectiveWords = useMemo(() => wc(form.objective), [form.objective]);
  const contentWords = useMemo(() => wc(form.content), [form.content]);

  const setField = <K extends keyof TeacherProposeFormState>(key: K) => (v: TeacherProposeFormState[K]) => setForm(p => ({ ...p, [key]: v }));
  const handleInput = (key: keyof TeacherProposeFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setField(key)(e.target.value as any);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "Vui lòng nhập tên đề tài.";
    if (!form.objective.trim()) next.objective = "Vui lòng nhập mục tiêu đề tài.";
    if (!form.content.trim()) next.content = "Vui lòng nhập nội dung đề tài.";
    if (!form.budget.trim()) next.budget = "Vui lòng nhập kinh phí đề nghị.";
    if (objectiveWords > MAX_WORDS) next.objective = `Mục tiêu tối đa ${MAX_WORDS} từ.`;
    if (contentWords > MAX_WORDS) next.content = `Nội dung tối đa ${MAX_WORDS} từ.`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // advisor = currentTeacher (ngầm định theo tài khoản giảng viên đang đăng nhập)
    const payload = { ...form, advisor: currentTeacher };
    console.log("TeacherPropose payload:", payload);
    // TODO: POST /api/teacher/topic-registration/propose {payload}
  };

  const fieldClass = (key: keyof TeacherProposeFormState) => (errors[key] ? "border-red-300 focus-visible:ring-red-200" : "");

  return (
    <form onSubmit={handleSubmit} className="bg-white w-full rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-8">

      <section className="space-y-4">
        <div>
          <Label htmlFor="title">Tên đề tài <span className="text-red-500">*</span></Label>
          <Input id="title" value={form.title} onChange={handleInput("title")} placeholder="Ví dụ: Hệ thống gợi ý tài liệu học tập..." className={fieldClass("title")} aria-invalid={!!errors.title}/>
          {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
        </div>

        <div>
          <Label htmlFor="objective">Mục tiêu <span className="text-red-500">*</span></Label>
          <Textarea id="objective" rows={4} value={form.objective} onChange={handleInput("objective")} placeholder="Tối đa 100 từ..." className={fieldClass("objective")} aria-invalid={!!errors.objective}/>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-neutral-600">Tối đa 100 từ.</p>
            <p className={`text-xs ${objectiveWords > MAX_WORDS ? "text-red-600" : "text-neutral-600"}`}>{objectiveWords}/{MAX_WORDS} từ</p>
          </div>
          {errors.objective && <p className="text-xs text-red-600 mt-1">{errors.objective}</p>}
        </div>

        <div>
          <Label htmlFor="content">Nội dung chính <span className="text-red-500">*</span></Label>
          <Textarea id="content" rows={6} value={form.content} onChange={handleInput("content")} placeholder="Tóm tắt ngắn gọn, tối đa 100 từ..." className={fieldClass("content")} aria-invalid={!!errors.content}/>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-neutral-600">Tối đa 100 từ.</p>
            <p className={`text-xs ${contentWords > MAX_WORDS ? "text-red-600" : "text-neutral-600"}`}>{contentWords}/{MAX_WORDS} từ</p>
          </div>
          {errors.content && <p className="text-xs text-red-600 mt-1">{errors.content}</p>}
        </div>

        <div className="md:w-1/2">
          <Label htmlFor="budget">Kinh phí đề nghị <span className="text-red-500">*</span></Label>
          <Input id="budget" value={form.budget} onChange={handleInput("budget")} placeholder="10 triệu" className={fieldClass("budget")} aria-invalid={!!errors.budget}/>
          <p className="text-xs text-neutral-600 mt-1">Đề xuất từ 7–10 triệu.</p>
          {errors.budget && <p className="text-xs text-red-600 mt-1">{errors.budget}</p>}
        </div>

        <div>
          <Label htmlFor="note">Ghi chú</Label>
          <Textarea id="note" rows={3} value={form.note} onChange={handleInput("note")} placeholder="Ghi chú gửi Hội đồng/Khoa"/>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>Huỷ</Button>
        <Button type="submit" className="gap-2"><Send className="h-4 w-4"/> Gửi đề xuất</Button>
      </div>
    </form>
  );
}

/* ================== Pick Existing Topic (lọc đúng theo năm & trạng thái) ================== */

function TopicPicker({
  topics,
  onSubmit,
  allowedStatuses = ["APPROVED", "REJECTED"],
  fromYear = new Date().getFullYear() - 6,
  toYear = new Date().getFullYear() - 1,
}: {
  topics: TopicRow[];
  onSubmit: (t: TopicRow) => void;
  allowedStatuses?: TopicStatus[];
  fromYear?: number;
  toYear?: number;
}) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const byStatus = topics.filter((t) => allowedStatuses.includes(t.status));
    const byYear = byStatus.filter((t) => t.year >= fromYear && t.year <= toYear);

    if (!q.trim()) return byYear;
    const s = q.toLowerCase();
    return byYear.filter(
      (t) => t.title.toLowerCase().includes(s) || t.code.toLowerCase().includes(s)
    );
  }, [q, topics, allowedStatuses, fromYear, toYear]);

  const current = useMemo(() => filtered.find((t) => t.code === selected) || null, [selected, filtered]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã/tên đề tài" className="pl-9"/>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((t) => {
          const active = selected === t.code;
          return (
            <Card key={t.code} className={`transition border ${active ? "border-[#0b57a8] ring-2 ring-[#0b57a8]/20" : ""}`}>
              <button type="button" onClick={() => setSelected(t.code)} className="w-full text-left">
                <CardContent className="flex items-center gap-2">
                  {active ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#0b57a8]"/> : <Circle className="mt-0.5 h-5 w-5 text-muted-foreground"/>}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-neutral-900">{t.code}</span>
                    </div>
                  </div>
                </CardContent>
              </button>
            </Card>
          );
        })}
      </div>

      {/* Preview & submit */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Xem trước đăng ký</h3>
          </div>
          {current && <StatusBadge status={current.status} />}
        </div>
        <Separator className="my-4"/>
        {current ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm text-neutral-600">Mã: <span className="font-medium">{current.code}</span></p>
              <p className="font-medium">{current.title}</p>
              {current.short && <p className="text-sm text-neutral-600">{current.short}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500">Mục tiêu</p>
                <p className="text-sm">{current.objective || "—"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs uppercase tracking-wide text-neutral-500">Nội dung</p>
                <p className="text-sm">{current.content || "—"}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500">Kinh phí</p>
                <p className="text-sm">{current.budget || "—"}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-neutral-600">Chưa có đề tài nào được chọn.</p>
        )}
        <div className="flex items-center justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={() => setSelected(null)}>Bỏ chọn</Button>
          <Button type="button" disabled={!current} onClick={() => current && onSubmit(current)} className="gap-2">
            <Send className="h-4 w-4"/> Gửi đăng ký
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ================== Page ================== */

export default function TeacherTopicRegistrationPage() {
  // Lấy từ session giảng viên đăng nhập (demo)
  const currentTeacher = "TS. Nguyễn Văn Trung";

  const handleSubmitExisting = (t: TopicRow) => {
    // TODO: POST /api/teacher/topic-registration/existing
    console.log("Submit existing topic:", t);
  };

  return (
    <div className="min-h-screen mt-20 py-10 px-4 flex items-start justify-center text-neutral-800">
      <div className="w-full max-w-5xl space-y-6">
        <header className="text-center space-y-1">
          <h1 className="text-2xl font-semibold leading-tight text-purple-800">Đăng ký đề tài</h1>
          <p className="text-sm text-neutral-600">Chọn lại đề tài hoặc đề xuất đề tài mới.</p>
        </header>

        <Tabs defaultValue="pick" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="pick">Chọn đề tài đã có</TabsTrigger>
            <TabsTrigger value="propose">Đề xuất đề tài mới</TabsTrigger>
          </TabsList>

          <TabsContent value="pick" className="mt-6">
            {/* Mặc định allowedStatuses=["APPROVED","REJECTED"], fromYear=thisYear-1, toYear=thisYear */}
            <TopicPicker topics={MY_TOPICS} onSubmit={handleSubmitExisting} />
          </TabsContent>

          <TabsContent value="propose" className="mt-6">
            <TeacherProposeForm currentTeacher={currentTeacher} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
