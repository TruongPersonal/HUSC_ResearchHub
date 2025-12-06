import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProposalFormState } from "./types";
import { FileText, Target, AlignLeft, DollarSign, StickyNote } from "lucide-react";

interface ContentSectionProps {
    form: ProposalFormState;
    handleInput: (key: keyof ProposalFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    errors: Record<string, string>;
    fieldClass: (key: keyof ProposalFormState) => string;
    descriptionWords: number;
    objectiveWords: number;
    contentWords: number;
    maxWords: number;
}

export function ContentSection({
    form,
    handleInput,
    errors,
    fieldClass,
    descriptionWords,
    objectiveWords,
    contentWords,
    maxWords
}: ContentSectionProps) {
    return (
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold shadow-sm shadow-blue-200">
                        2
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">Nội dung đề tài</h3>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                        <FileText className="w-4 h-4 text-blue-500" />
                        Tên đề tài <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        value={form.title}
                        onChange={handleInput("title")}
                        className={`${fieldClass("title")} font-medium focus-visible:ring-blue-500/20`}
                        placeholder="Nhập tên đề tài nghiên cứu..."
                    />
                    {errors.title && <p className="text-xs text-red-600 font-medium">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                        <FileText className="w-4 h-4 text-blue-500" />
                        Mô tả <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        value={form.description}
                        onChange={handleInput("description")}
                        className={`${fieldClass("description")} focus-visible:ring-blue-500/20`}
                        placeholder="Mô tả tổng quan về đề tài..."
                    />
                    {errors.description && <p className="text-xs text-red-600 font-medium">{errors.description}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2 text-gray-700">
                            <Target className="w-4 h-4 text-blue-500" />
                            Mục tiêu <span className="text-red-500">*</span>
                        </Label>
                        <span className={`text-xs ${objectiveWords > maxWords ? "text-red-500 font-bold" : "text-gray-400"}`}>
                            {objectiveWords}/{maxWords} từ
                        </span>
                    </div>
                    <Textarea
                        rows={4}
                        value={form.objective}
                        onChange={handleInput("objective")}
                        className={`${fieldClass("objective")} focus-visible:ring-blue-500/20 resize-none`}
                        placeholder="Mô tả ngắn gọn mục tiêu của đề tài..."
                    />
                    {errors.objective && <p className="text-xs text-red-600 font-medium">{errors.objective}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2 text-gray-700">
                            <AlignLeft className="w-4 h-4 text-blue-500" />
                            Nội dung chính <span className="text-red-500">*</span>
                        </Label>
                        <span className={`text-xs ${contentWords > maxWords ? "text-red-500 font-bold" : "text-gray-400"}`}>
                            {contentWords}/{maxWords} từ
                        </span>
                    </div>
                    <Textarea
                        rows={6}
                        value={form.content}
                        onChange={handleInput("content")}
                        className={`${fieldClass("content")} focus-visible:ring-blue-500/20 resize-none`}
                        placeholder="Mô tả các nội dung chính sẽ thực hiện..."
                    />
                    {errors.content && <p className="text-xs text-red-600 font-medium">{errors.content}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-gray-700">
                            <DollarSign className="w-4 h-4 text-blue-500" />
                            Kinh phí đề nghị <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={form.budget}
                            onChange={handleInput("budget")}
                            placeholder="VNĐ"
                            className={`${fieldClass("budget")} focus-visible:ring-blue-500/20`}
                        />
                        {errors.budget && <p className="text-xs text-red-600 font-medium">{errors.budget}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-gray-700">
                            <StickyNote className="w-4 h-4 text-blue-500" />
                            Ghi chú
                        </Label>
                        <Textarea
                            rows={1}
                            value={form.note}
                            onChange={handleInput("note")}
                            className="focus-visible:ring-blue-500/20 min-h-[42px]"
                            placeholder="Ghi chú thêm nếu có..."
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
