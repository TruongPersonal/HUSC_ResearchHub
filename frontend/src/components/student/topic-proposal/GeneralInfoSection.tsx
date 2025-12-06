import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ProposalFormState, Teacher } from "@/components/shared/topic-proposal/types";
import { User, Users, GraduationCap } from "lucide-react";

interface GeneralInfoSectionProps {
    form: ProposalFormState;
    handleInput: (key: keyof ProposalFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    teacherList: Teacher[];
    errors: Record<string, string>;
    fieldClass: (key: keyof ProposalFormState) => string;
}

export function GeneralInfoSection({ form, handleInput, teacherList, errors, fieldClass }: GeneralInfoSectionProps) {
    return (
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold shadow-sm shadow-blue-200">
                        1
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">Thông tin chung</h3>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-gray-700">
                            <User className="w-4 h-4 text-blue-500" />
                            Sinh viên chủ nhiệm <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={form.studentLeader}
                            readOnly
                            className="bg-gray-50 text-gray-500 border-gray-200 focus-visible:ring-0"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
