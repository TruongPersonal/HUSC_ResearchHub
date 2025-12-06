import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Topic } from "@/features/topics/types";
import { User, Target, FileText, Users, Crown } from "lucide-react";

interface TopicDetailModalProps {
    topic: Topic | null;
    open: boolean;
    onClose: () => void;
    onRegister: (topic: Topic) => void;
    isSessionOpen: boolean;
}

export function TopicDetailModal({ topic, open, onClose, onRegister, isSessionOpen }: TopicDetailModalProps) {
    if (!topic) return null;

    const canRegister = isSessionOpen && topic.status === "APPROVED";

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden border-none shadow-2xl [&>button]:hidden">
                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            {topic.code && (
                                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-3">
                                    {topic.code}
                                </Badge>
                            )}
                            <DialogTitle className="text-2xl font-bold leading-tight">
                                {topic.name}
                            </DialogTitle>
                        </div>
                        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-6">
                        <div>
                            <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-2">
                                <Target className="w-4 h-4 text-blue-500" />
                                Mô tả đề tài
                            </h4>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {topic.description || "Chưa có mô tả chi tiết cho đề tài này."}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-2">
                                    <User className="w-4 h-4 text-blue-500" />
                                    Giảng viên hướng dẫn
                                </h4>
                                {topic.lecturer.name === "Chưa có giảng viên hướng dẫn" ? (
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-500 text-sm italic">
                                        Chưa có giảng viên hướng dẫn
                                    </div>
                                ) : (
                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-blue-500" />
                                            <p className="font-medium text-blue-900">{topic.lecturer.name}</p>
                                        </div>
                                        {topic.lecturer.username && (
                                            <span className="text-xs font-mono text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                                                {topic.lecturer.username}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-2">
                                    <Users className="w-4 h-4 text-purple-500" />
                                    Sinh viên thực hiện
                                </h4>
                                {topic.students && topic.students.length > 0 ? (
                                    <div className="bg-purple-50 rounded-lg border border-purple-100 flex flex-col gap-1 p-2">
                                        {topic.students.map((student) => (
                                            <div key={student.id} className="p-2 flex items-center justify-between rounded-md">
                                                <div className="flex items-center gap-2">
                                                    {student.isLeader ? (
                                                        <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    ) : (
                                                        <User className="w-4 h-4 text-purple-400" />
                                                    )}
                                                    <span className={`text-sm ${student.isLeader ? "font-bold text-purple-900" : "font-medium text-purple-800"}`}>
                                                        {student.name}
                                                    </span>
                                                </div>
                                                {student.code && (
                                                    <span className="text-xs font-mono text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
                                                        {student.code}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-500 text-sm italic">
                                        Chưa có sinh viên thực hiện
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-2 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                    <Button variant="outline" onClick={onClose} className="border-gray-200">
                        Đóng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
