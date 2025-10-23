"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type FormState = {
  // Thông tin chung
  studentLeader: string; // Họ tên SV đăng ký làm chủ nhiệm
  members: string;       // Thành viên tham gia (mã SV, cách nhau dấu phẩy)
  advisor: string;       // Giảng viên tư vấn
  // Nội dung đề tài
  title: string;         // Tên đề tài
  objective: string;     // Mục tiêu (<= 100 từ)
  content: string;       // Nội dung chính (<= 100 từ)
  budget: string;        // Kinh phí đề nghị (ví dụ: "10 triệu")
  // Khác
  note: string;          // Ghi chú
};

const MAX_WORDS = 100;
const wc = (s: string) => (s.trim().match(/\S+/g) || []).length;

export default function TopicProposeForm() {
  const [form, setForm] = useState<FormState>({
    studentLeader: "",
    members: "",
    advisor: "",
    title: "",
    objective: "",
    content: "",
    budget: "",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const objectiveWords = useMemo(() => wc(form.objective), [form.objective]);
  const contentWords = useMemo(() => wc(form.content), [form.content]);

  const setField =
    <K extends keyof FormState>(key: K) =>
    (value: FormState[K]) =>
      setForm((p) => ({ ...p, [key]: value }));

  const handleInput =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setField(key)(e.target.value as any);

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.studentLeader.trim())
      next.studentLeader = "Vui lòng nhập mã sinh viên chủ nhiệm.";
    if (!form.title.trim())
      next.title = "Vui lòng nhập tên đề tài.";
    if (!form.objective.trim())
      next.objective = "Vui lòng nhập mục tiêu đề tài.";
    if (!form.content.trim())
      next.content = "Vui lòng nhập nội dung đề tài.";
    if (objectiveWords > MAX_WORDS)
      next.objective = `Mục tiêu tối đa ${MAX_WORDS} từ.`;
    if (contentWords > MAX_WORDS)
      next.content = `Nội dung tối đa ${MAX_WORDS} từ.`;
    if (!form.budget.trim())
      next.budget = "Vui lòng nhập kinh phí đề nghị.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: Gửi lên API (JSON hoặc multipart nếu có file về sau)
    console.log("Payload:", form);
  };

  const fieldClass = (key: keyof FormState) =>
    errors[key]
      ? "border-red-300 focus-visible:ring-red-200"
      : "";

  return (
    <div className="min-h-screen flex items-start justify-center mt-20 py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-4xl rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-8"
      >
        {/* Header */}
        <header className="text-center space-y-1">
          <h2 className="text-2xl font-semibold text-[#0b57a8]">Đề xuất đề tài NCKH</h2>
          <p className="text-sm text-muted-foreground">
            Điền thông tin ngắn gọn, rõ ràng. Trường có dấu <span className="text-red-500">*</span> là bắt buộc.
          </p>
        </header>

        {/* 1) Thông tin chung */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-semibold">1</span>
            <h3 className="font-medium">Thông tin chung</h3>
          </div>
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Họ tên chủ nhiệm */}
            <div>
              <Label htmlFor="studentLeader">
                Sinh viên chủ nhiệm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="studentLeader"
                value={form.studentLeader}
                onChange={handleInput("studentLeader")}
                placeholder="23t1020573"
                className={fieldClass("studentLeader")}
                aria-invalid={!!errors.studentLeader}
              />
              {errors.studentLeader && (
                <p className="text-xs text-red-600 mt-1">{errors.studentLeader}</p>
              )}
            </div>

            {/* Thành viên tham gia */}
            <div>
              <Label htmlFor="members">Thành viên tham gia</Label>
              <Input
                id="members"
                value={form.members}
                onChange={handleInput("members")}
                placeholder="23T1020565, 23T1020532, …"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ghi <b>mã sinh viên</b>, nhiều SV cách nhau bằng dấu phẩy.
              </p>
            </div>

            {/* Giảng viên tư vấn */}
            <div className="md:col-span-2">
              <Label htmlFor="advisor">
                Giảng viên tư vấn
              </Label>
              <Input
                id="advisor"
                value={form.advisor}
                onChange={handleInput("advisor")}
                placeholder="Nguyễn Văn Trung"
                className={fieldClass("advisor")}
                aria-invalid={!!errors.advisor}
              />
              {errors.advisor && (
                <p className="text-xs text-red-600 mt-1">{errors.advisor}</p>
              )}
            </div>
          </div>
        </section>

        {/* 2) Nội dung đề tài */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-semibold">2</span>
            <h3 className="font-medium">Nội dung đề tài</h3>
          </div>
          <Separator />

          {/* Tên đề tài */}
          <div>
            <Label htmlFor="title">
              Tên đề tài <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={handleInput("title")}
              placeholder="Xây dựng web hỗ trợ đăng ký đề tài nghiên cứu khoa học…"
              className={fieldClass("title")}
              aria-invalid={!!errors.title}
            />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
          </div>

          {/* Mục tiêu (≤100 từ) */}
          <div>
            <Label htmlFor="objective">
              Mục tiêu của đề tài <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="objective"
              rows={4}
              value={form.objective}
              onChange={handleInput("objective")}
              placeholder="Viết ngắn gọn, tối đa 100 từ…"
              className={fieldClass("objective")}
              aria-invalid={!!errors.objective}
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">Tối đa 100 từ.</p>
              <p className={`text-xs ${objectiveWords > MAX_WORDS ? "text-red-600" : "text-muted-foreground"}`}>
                {objectiveWords}/{MAX_WORDS} từ
              </p>
            </div>
            {errors.objective && (
              <p className="text-xs text-red-600 mt-1">{errors.objective}</p>
            )}
          </div>

          {/* Nội dung chính (≤100 từ) */}
          <div>
            <Label htmlFor="content">
              Nội dung chính của đề tài <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              rows={6}
              value={form.content}
              onChange={handleInput("content")}
              placeholder="Tóm tắt ngắn gọn nội dung triển khai, tối đa 100 từ…"
              className={fieldClass("content")}
              aria-invalid={!!errors.content}
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">Tối đa 100 từ.</p>
              <p className={`text-xs ${contentWords > MAX_WORDS ? "text-red-600" : "text-muted-foreground"}`}>
                {contentWords}/{MAX_WORDS} từ
              </p>
            </div>
            {errors.content && (
              <p className="text-xs text-red-600 mt-1">{errors.content}</p>
            )}
          </div>

          {/* Kinh phí đề nghị */}
          <div className="md:w-1/2">
            <Label htmlFor="budget">
              Kinh phí đề nghị <span className="text-red-500">*</span>
            </Label>
            <Input
              id="budget"
              inputMode="text"
              placeholder="10 triệu"
              value={form.budget}
              onChange={handleInput("budget")}
              className={fieldClass("budget")}
              aria-invalid={!!errors.budget}
            />
            <p className="text-xs text-muted-foreground mt-1">Đề xuất từ 7–10 triệu.</p>
            {errors.budget && <p className="text-xs text-red-600 mt-1">{errors.budget}</p>}
          </div>

          {/* Ghi chú */}
          <div>
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
              rows={3}
              value={form.note}
              onChange={handleInput("note")}
              placeholder="Cho nhóm đề xuất đề tài mới"
            />
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Hủy
          </Button>
          <Button type="submit">Gửi đăng ký</Button>
        </div>
      </form>
    </div>
  );
}
