
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Send, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { ProposalFormState, Teacher } from "@/components/shared/topic-proposal/types";
import { GeneralInfoSection } from "@/components/student/topic-proposal/GeneralInfoSection";
import { ContentSection } from "@/components/shared/topic-proposal/ContentSection";
import { topicService } from "@/features/topics/api/topic.service";
import { useAcademicYear } from "@/contexts/AcademicYearContext";
import { authService } from "@/features/auth/api/auth.service";
import { yearSessionService } from "@/features/academic-year/api/year-session.service";

const MAX_WORDS = 100;
const wc = (s: string) => (s.trim().match(/\S+/g) || []).length;

export default function StudentTopicProposePage() {
    const router = useRouter();
    const { selectedYear } = useAcademicYear();

    // --- STATE ---
    // Session Status
    const [isSessionOpen, setIsSessionOpen] = useState(false);

    const [teacherList, setTeacherList] = useState<Teacher[]>([
        { id: 1, fullName: "TS. Nguyễn Văn A", department: "CNPM" },
        { id: 2, fullName: "ThS. Trần Thị B", department: "KHMT" },
        { id: 3, fullName: "TS. Lê Văn C", department: "HTTT" },
        { id: 4, fullName: "PGS.TS. Phạm Thị D", department: "MMT&TT" },
    ]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState<ProposalFormState>({
        studentLeader: "",
        members: "",
        advisor: "",
        title: "",
        description: "",
        objective: "",
        content: "",
        budget: "",
        note: "",
    });

    const descriptionWords = useMemo(() => wc(form.description), [form.description]);
    const objectiveWords = useMemo(() => wc(form.objective), [form.objective]);
    const contentWords = useMemo(() => wc(form.content), [form.content]);

    // --- HELPER FUNCTIONS ---
    const setField = <K extends keyof ProposalFormState>(key: K) => (value: ProposalFormState[K]) =>
        setForm((p) => ({ ...p, [key]: value }));

    const handleInput = (key: keyof ProposalFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setField(key)(e.target.value as string);

    // --- INIT DATA ---


    // Check Session Status and User Info
    useEffect(() => {
        const checkSessionAndUser = async () => {
            if (!selectedYear) return;

            let deptId: number | undefined;
            let currentUsername = "";

            // 1. Try to get from localStorage
            try {
                const stored = localStorage.getItem("user");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    deptId = parsed.departmentId;
                    currentUsername = parsed.username;
                }
            } catch (e) { /* ignore */ }

            // 2. Refresh profile from API to be sure
            try {
                const user = await authService.getProfile();
                if (user) {
                    deptId = user.departmentId;
                    currentUsername = user.username;
                    // Update form display
                    setForm(prev => ({ ...prev, studentLeader: user.username }));
                    // Update localStorage if needed
                    localStorage.setItem("user", JSON.stringify(user));
                }
            } catch (e) {
                console.error("Failed to fetch profile", e);
            }

            // 3. Fallback if still empty (shouldn't happen if auth works)
            if (!currentUsername) {
                currentUsername = "Unknown";
            }

            // Note: We already setForm inside the try block if successful.
            // If we relied only on localStorage, we might needed a setForm here as well if not already set.

            // 4. Check session status
            if (deptId) {
                try {
                    const sessionsResponse = await yearSessionService.getAll(undefined, 0, 100, deptId);
                    const currentSession = sessionsResponse.content.find(s => s.academicYearId === selectedYear.id);
                    setIsSessionOpen(currentSession?.status === "ON_REGISTRATION");
                } catch (e) {
                    console.error("Failed to fetch sessions", e);
                }
            }
        };

        checkSessionAndUser();
    }, [selectedYear]);

    // --- VALIDATE ---
    const validate = (): boolean => {
        const next: Record<string, string> = {};
        if (!form.title.trim()) next.title = "Vui lòng nhập tên đề tài.";
        if (!form.description.trim()) next.description = "Vui lòng nhập mô tả.";
        if (!form.objective.trim()) next.objective = "Vui lòng nhập mục tiêu.";
        if (!form.content.trim()) next.content = "Vui lòng nhập nội dung.";
        if (!form.content.trim()) next.content = "Vui lòng nhập nội dung.";
        // if (descriptionWords > MAX_WORDS) next.description = `Tối đa ${MAX_WORDS} từ.`; // Validation removed
        if (objectiveWords > MAX_WORDS) next.objective = `Tối đa ${MAX_WORDS} từ.`;
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

    // --- SUBMIT ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        // 2. Chuẩn bị Payload gửi đi
        const payload = {
            title: form.title,
            description: form.description,
            objective: form.objective,
            content: form.content,
            budget: parseFloat(form.budget), // Ensure budget is number
            note: form.note,
            academicYearId: selectedYear?.id, // Pass selected year ID
        };

        // 3. Gọi API Thật
        try {
            await topicService.propose(payload);
            toast.success("Đăng ký đề tài thành công!");
            router.push("/student/my-topics");
        } catch (error) {
            console.error("Proposal failed", error);
            toast.error("Đăng ký đề tài thất bại. Vui lòng thử lại.");
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
                    <h1 className="text-2xl font-bold text-gray-900">Đề xuất đề tài</h1>
                    <p className="text-gray-500 mt-1">Đề xuất đề tài nghiên cứu khoa học.</p>
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

            <form onSubmit={handleSubmit} className="space-y-8">
                <GeneralInfoSection
                    form={form}
                    handleInput={handleInput}
                    teacherList={teacherList}
                    errors={errors}
                    fieldClass={fieldClass}
                />

                <ContentSection
                    form={form}
                    handleInput={handleInput}
                    errors={errors}
                    fieldClass={fieldClass}
                    descriptionWords={0} // Unused
                    objectiveWords={objectiveWords}
                    contentWords={contentWords}
                    maxWords={MAX_WORDS}
                />

                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/student")}
                        className="px-6 py-2.5 h-auto rounded-xl border-gray-200 hover:bg-gray-50 hover:text-gray-900 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Hủy bỏ
                    </Button>
                    {isSessionOpen && (
                        <Button
                            type="submit"
                            disabled={isSubmitting}
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
                                    Gửi đăng ký
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
