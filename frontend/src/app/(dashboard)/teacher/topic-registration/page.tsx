"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Loader2,
  Send,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertTriangle,
  FileSignature,
} from "lucide-react";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import {
  ProposalFormState,
  Teacher,
} from "@/components/shared/topic-proposal/types";
import { ContentSection } from "@/components/shared/topic-proposal/ContentSection";
import { topicService } from "@/features/topics/api/topic.service";
import { useAcademicYear } from "@/contexts/AcademicYearContext";
import { authService } from "@/features/auth/api/auth.service";
import { yearSessionService } from "@/features/academic-year/api/year-session.service";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TopicRow } from "@/features/topics/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const MAX_WORDS = 100;
const wc = (s: string) => (s.trim().match(/\S+/g) || []).length;

type ProposeMode = "NEW" | "REUSE";

/**
 * Trang Đăng ký đề tài mới dành cho Giảng viên.
 * Cho phép Giảng viên tự đăng ký đề tài (làm chủ nhiệm hoặc hướng dẫn).
 * Hỗ trợ chế độ: Tạo mới hoàn toàn (NEW) hoặc Chọn lại đề tài cũ đã bị từ chối/hủy (REUSE).
 */
export default function TeacherTopicProposePage() {
  const router = useRouter();
  const { selectedYear } = useAcademicYear();

  // --- STATE ---
  const [mode, setMode] = useState<ProposeMode>("NEW");
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // For Reuse Mode
  const [rejectedTopics, setRejectedTopics] = useState<TopicRow[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<ProposalFormState>({
    studentLeader: "", // Not used for Teacher
    members: "",
    advisor: "",
    title: "",
    description: "",
    objective: "",
    content: "",
    budget: "",
    note: "",
  });

  const descriptionWords = useMemo(
    () => wc(form.description),
    [form.description],
  );
  const objectiveWords = useMemo(() => wc(form.objective), [form.objective]);
  const contentWords = useMemo(() => wc(form.content), [form.content]);

  // --- HELPER FUNCTIONS ---
  const setField =
    <K extends keyof ProposalFormState>(key: K) =>
      (value: ProposalFormState[K]) =>
        setForm((p) => ({ ...p, [key]: value }));

  const handleInput =
    (key: keyof ProposalFormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setField(key)(e.target.value as string);

  // --- INIT DATA ---
  useEffect(() => {
    const initData = async () => {
      if (!selectedYear) return;

      try {
        // 1. Get Profile
        const user = await authService.getProfile();
        setCurrentUser(user);
        setForm((prev) => ({ ...prev, advisor: user.fullName })); // Show self as advisor

        // 2. Check Session
        if (user.departmentId) {
          // Fetch sessions by departmentId to ensure correct status
          const sessionsResponse = await yearSessionService.getAll(
            undefined,
            0,
            100,
            user.departmentId,
          );
          const currentSession = sessionsResponse.content.find(
            (s) =>
              s.academicYearId === selectedYear.id &&
              s.departmentId === user.departmentId,
          );
          setIsSessionOpen(currentSession?.status === "ON_REGISTRATION");
        }

        // 3. Get Rejected Topics (for Reuse Mode)
        const myTopics = await topicService.getMyTopics();
        // Filter for rejected topics that the teacher was an ADVISOR for (which is all of them in 'my-topics' for a teacher)
        // But logically, a teacher might want to reuse a topic they proposed OR they advised that got rejected?
        // The requirements say "Reuse old rejected topic".
        // We filter topics with status REJECTED or CANCELLED
        const rejected = myTopics.filter(
          (t) => t.status === "REJECTED" || t.status === "CANCELLED",
        );
        setRejectedTopics(rejected);
      } catch (e) {
        console.error("Failed to init teacher propose page", e);
      }
    };

    initData();
  }, [selectedYear]);

  // --- HANDLERS ---
  const handleReuseSelect = (topicId: string) => {
    setSelectedTopicId(topicId);
    const topic = rejectedTopics.find((t) => t.id.toString() === topicId);
    if (topic) {
      setForm((prev) => ({
        ...prev,
        title: topic.title,
        description: topic.short || "", // Map shortDescription
        objective: topic.objective || "",
        content: topic.content || "",
        budget: topic.budget ? topic.budget.toString() : "",
        note: topic.note || "",
        // Keep advisor as self (currentUser)
      }));
      toast.info("Đã tải dữ liệu từ đề tài cũ");
    }
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "Vui lòng nhập tên đề tài.";
    if (!form.description.trim()) next.description = "Vui lòng nhập mô tả.";
    if (!form.objective.trim()) next.objective = "Vui lòng nhập mục tiêu.";
    if (!form.content.trim()) next.content = "Vui lòng nhập nội dung.";
    if (objectiveWords > MAX_WORDS) next.objective = `Tối đa ${MAX_WORDS} từ.`;
    if (contentWords > MAX_WORDS) next.content = `Tối đa ${MAX_WORDS} từ.`;
    if (!form.budget.trim()) {
      next.budget = "Vui lòng nhập kinh phí.";
    } else {
      const budgetVal = parseFloat(form.budget);
      if (isNaN(budgetVal)) {
        next.budget = "Kinh phí phải là số.";
      } else if (budgetVal < 7000000 || budgetVal > 10000000) {
        next.budget = "Kinh phí dự kiến phải từ 7 triệu đến 10 triệu VNĐ.";
      }
    }
    if (!selectedYear) next.year = "Vui lòng chọn năm học.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const payload = {
      title: form.title,
      description: form.description,
      objective: form.objective,
      content: form.content,
      budget: parseFloat(form.budget),
      note: form.note,
      academicYearId: selectedYear?.id,
      // No advisorId sent - backend assigns current teacher
    };

    try {
      await topicService.propose(payload);
      toast.success("Đăng ký đề tài thành công!");
      router.push("/teacher/my-topics");
    } catch (error) {
      console.error("Proposal failed", error);
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (key: keyof ProposalFormState) =>
    errors[key] ? "border-red-300 focus-visible:ring-red-200 bg-red-50" : "";

  return (
    <div className="max-w-[1080px] mx-auto pb-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Đăng ký đề tài mới
          </h1>
          <p className="text-gray-500 mt-1">
            Giảng viên đăng ký và tự hướng dẫn đề tài.
          </p>
        </div>

        {isSessionOpen ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-100 text-sm font-bold shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
            Mở
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full border border-red-100 text-sm font-bold shadow-sm">
            <XCircle className="w-4 h-4" />
            Đóng
          </div>
        )}
      </div>

      {/* Mode Selection */}
      <Tabs
        value={mode}
        onValueChange={(v) => setMode(v as ProposeMode)}
        className="mb-8"
      >
        <TabsList className="bg-gray-100/50 p-1 border border-gray-200/50 w-full md:w-auto h-auto">
          <TabsTrigger
            value="NEW"
            className="px-6 py-2.5 rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm font-medium gap-2"
            onClick={() => {
              // Reset form to blank when switching to NEW
              setForm((prev) => ({
                ...prev,
                title: "",
                description: "",
                objective: "",
                content: "",
                budget: "",
                note: "",
              }));
              setSelectedTopicId("");
            }}
          >
            <FileSignature className="w-4 h-4" />
            Tạo mới hoàn toàn
          </TabsTrigger>
          <TabsTrigger
            value="REUSE"
            className="px-6 py-2.5 rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm font-medium gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Chọn lại đề tài cũ
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Reuse Selector */}
        {mode === "REUSE" && (
          <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 space-y-4">
            <div className="flex items-center gap-2 text-blue-800 font-semibold">
              <RefreshCw className="w-5 h-5" />
              Chọn đề tài cũ để chỉnh sửa
            </div>
            {rejectedTopics.length === 0 ? (
              <div className="text-sm text-gray-500 italic bg-white p-4 rounded-lg border border-gray-200 text-center">
                Bạn chưa có đề tài nào bị từ chối.
              </div>
            ) : (
              <Select value={selectedTopicId} onValueChange={handleReuseSelect}>
                <SelectTrigger className="bg-white border-blue-200 focus:ring-blue-200 h-11">
                  <SelectValue placeholder="Chọn đề tài" />
                </SelectTrigger>
                <SelectContent>
                  {rejectedTopics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id.toString()}>
                      <span className="font-medium">
                        {topic.code ? `[${topic.code}] ` : ""}
                      </span>
                      {topic.title}
                      <span className="ml-2 text-xs text-gray-400">
                        (
                        {new Date(topic.submittedAt).toLocaleDateString(
                          "vi-VN",
                        )}
                        )
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {selectedTopicId && (
              <div className="text-sm text-blue-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Đã tải dữ liệu. Bạn có thể chỉnh sửa bên dưới trước khi gửi.
              </div>
            )}
          </div>
        )}

        {/* Simplified General Info for Teacher */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
            <h3 className="font-semibold text-gray-900 text-lg">
              Thông tin chung
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-700">Giảng viên hướng dẫn</Label>
              <Input
                value={currentUser?.username || "Đang tải..."}
                disabled
                className="bg-gray-100 border-gray-200 text-gray-600 font-medium"
              />
            </div>
          </div>
        </section>

        <ContentSection
          form={form}
          handleInput={handleInput}
          errors={errors}
          fieldClass={fieldClass}
          descriptionWords={0}
          objectiveWords={objectiveWords}
          contentWords={contentWords}
          maxWords={MAX_WORDS}
        />

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/teacher/my-topics")}
            className="px-6 py-2.5 h-auto rounded-xl border-gray-200 hover:bg-gray-50 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
          {isSessionOpen && (
            <Button
              type="submit"
              disabled={isSubmitting || (mode === "REUSE" && !selectedTopicId)}
              className="px-8 py-2.5 h-auto rounded-xl shadow-lg font-medium transition-all transform hover:-translate-y-0.5 bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {mode === "NEW" ? "Gửi đăng ký mới" : "Gửi lại đề tài"}
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
