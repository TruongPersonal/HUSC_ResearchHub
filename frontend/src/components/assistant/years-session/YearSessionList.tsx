"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { YearSession } from "@/features/academic-year/types";
import { Badge } from "@/components/ui/badge";

interface YearSessionListProps {
  sessions: YearSession[];
  onEdit: (session: YearSession) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ON_REGISTRATION":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
          Đang đăng ký
        </Badge>
      );
    case "UNDER_REVIEW":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">
          Đang xét duyệt
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
          Đang thực hiện
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200">
          Hoàn thành
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

/**
 * Bảng hiển thị danh sách các Phiên làm việc của Năm học.
 * Các cột: Năm học, Trạng thái (Badge), Thao tác.
 */
export function YearSessionList({ sessions, onEdit }: YearSessionListProps) {
  return (
    <div className="rounded-md border shadow-sm bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold text-gray-700">
              Năm học
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Trạng thái
            </TableHead>
            <TableHead className="w-[100px] text-right font-semibold text-gray-700">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="h-24 text-center text-muted-foreground"
              >
                Chưa có phiên năm học nào.
              </TableCell>
            </TableRow>
          ) : (
            sessions.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <TableCell className="font-medium">{item.year}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {item.academicYearStatus === "END" ? (
                      <div></div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
