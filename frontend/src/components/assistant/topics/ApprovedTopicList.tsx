import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings2, Calendar, User, GraduationCap, FileText } from "lucide-react";
import { ApprovedTopicResponse } from "@/features/topics/types";
import { ApprovedTopicStatusBadge, getApprovedTopicStatusConfig } from "./ApprovedTopicStatusBadge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ApprovedTopicListProps {
    topics: ApprovedTopicResponse[];
    onOpenDetail?: (topic: ApprovedTopicResponse) => void;
    onOpenAction?: (topic: ApprovedTopicResponse) => void;
    onOpenReport?: (topic: ApprovedTopicResponse) => void;
}

export function ApprovedTopicList({ topics, onOpenDetail, onOpenAction, onOpenReport }: ApprovedTopicListProps) {
    if (topics.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg bg-gray-50/50">
                <p>Chưa có đề tài nào.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {topics.map((t, index) => {
                const statusConfig = getApprovedTopicStatusConfig(t.status);
                return (
                    <Card
                        key={index}
                        className={cn(
                            "group relative overflow-hidden transition-all duration-200 hover:shadow-md border-gray-200 pl-1 cursor-pointer",
                            statusConfig.borderColor.replace("border-l-", "border-l-[4px] ")
                        )}
                        onClick={() => onOpenDetail?.(t)}
                    >
                        <div className="px-4 flex flex-col gap-3">
                            {/* Header: Title & Status */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    {t.code && (
                                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 py-0.5 px-2 mb-4 w-fit">
                                            {t.code}
                                        </Badge>
                                    )}
                                    <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-[#0b57a8] transition-colors">
                                        {t.topic.title}
                                    </h3>
                                    {t.topic.shortDescription && (
                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                            {t.topic.shortDescription}
                                        </p>
                                    )}
                                </div>
                                <ApprovedTopicStatusBadge status={t.status} />
                            </div>

                            {/* Info Rows */}
                            <div className="flex flex-col gap-2 text-sm text-gray-600">
                                {/* Row 1: SV & GV */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-start gap-2" title="Sinh viên thực hiện">
                                        <User className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                                        <div className="flex flex-wrap gap-1">
                                            {t.topic.approvedMembers && t.topic.approvedMembers.length > 0 ? (
                                                t.topic.approvedMembers.map((s, idx) => (
                                                    <span key={s.id} className="text-gray-900">
                                                        {s.name}
                                                        {s.id === t.topic.studentLeaderId && <span className="text-blue-600 font-medium ml-1">(Chủ nhiệm)</span>}
                                                        {idx < (t.topic.approvedMembers?.length || 0) - 1 && ", "}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 italic">Chưa có sinh viên</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2" title="Giảng viên hướng dẫn">
                                        <GraduationCap className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                                        <div className="flex flex-wrap gap-1">
                                            {t.topic.advisors && t.topic.advisors.length > 0 ? (
                                                t.topic.advisors.map((a, idx) => (
                                                    <span key={a.id} className="text-gray-900">
                                                        {a.name}
                                                        {idx < (t.topic.advisors?.length || 0) - 1 && ", "}
                                                    </span>
                                                ))
                                            ) : (
                                                // Fallback
                                                t.topic.advisorName ? (
                                                    <span className="text-gray-900">{t.topic.advisorName}</span>
                                                ) : (
                                                    <span className="text-gray-500 italic">Chưa có giảng viên</span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Row 3: Dates & Actions */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1 mt-1">
                                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-muted-foreground">
                                        <div className="flex items-center gap-2 min-w-[200px]" title="Ngày duyệt">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span>{format(new Date(t.createdAt), "dd/MM/yyyy")}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2 md:pt-0" onClick={(e) => e.stopPropagation()}>
                                        {t.status !== "CANCELED" && t.status !== "COMPLETED" && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 gap-1.5 text-gray-600 hover:text-[#0b57a8] hover:bg-blue-50 border-dashed border-gray-300"
                                                onClick={() => onOpenReport?.(t)}
                                            >
                                                <FileText className="h-4 w-4" />
                                                Xem báo cáo
                                            </Button>
                                        )}
                                        {t.status !== "CANCELED" && t.status !== "COMPLETED" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 gap-1.5 border-gray-300 shadow-sm hover:border-[#0b57a8] hover:text-[#0b57a8]"
                                                onClick={() => onOpenAction?.(t)}
                                            >
                                                <Settings2 className="h-4 w-4" />
                                                Thao tác
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
