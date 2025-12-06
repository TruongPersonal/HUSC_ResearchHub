import { MyTopic } from "@/features/topics/types";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, ArrowRight } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface MyTopicsTableProps {
    data: MyTopic[];
    onView: (topic: MyTopic) => void;
    emptyMessage?: string;
    showCode?: boolean;
}

export function MyTopicsTable({ data, onView, emptyMessage = "Không có dữ liệu", showCode = true }: MyTopicsTableProps) {
    if (data.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-gray-50/80">
                    <TableRow className="hover:bg-gray-50/80 border-gray-100">
                        {showCode && <TableHead className="w-28 font-semibold text-gray-600">Mã</TableHead>}
                        <TableHead className="font-semibold text-gray-600">Tên đề tài</TableHead>
                        <TableHead className="w-32 font-semibold text-gray-600">Vai trò</TableHead>
                        <TableHead className="w-40 font-semibold text-gray-600">Trạng thái</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((topic) => (
                        <TableRow
                            key={topic.id}
                            className="hover:bg-blue-50/30 transition-colors cursor-pointer group border-gray-100"
                            onClick={() => onView(topic)}
                        >
                            {showCode && (
                                <TableCell className="font-mono text-gray-500 text-xs font-medium">
                                    {topic.code || "—"}
                                </TableCell>
                            )}
                            <TableCell>
                                <p className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                                    {topic.name}
                                </p>
                            </TableCell>
                            <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${topic.role === "LEADER"
                                    ? "bg-blue-50 text-blue-700 border-blue-100"
                                    : topic.role === "ADVISOR"
                                        ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                                        : topic.role === "PENDING"
                                            ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                                            : "bg-purple-50 text-purple-700 border-purple-100"
                                    }`}>
                                    {topic.role === "LEADER"
                                        ? "Chủ nhiệm"
                                        : topic.role === "ADVISOR"
                                            ? "Cố vấn"
                                            : topic.role === "PENDING"
                                                ? "Chờ duyệt"
                                                : "Thành viên"}
                                </span>
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={topic.status} />
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
