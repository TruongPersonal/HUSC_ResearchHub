"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { Announcement } from "@/features/announcements/types"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface AnnouncementTableProps {
    data: Announcement[]
    onEdit: (announcement: Announcement) => void
}

export function AnnouncementTable({ data, onEdit }: AnnouncementTableProps) {
    return (
        <div className="rounded-md border shadow-sm bg-white">
            <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead className="font-semibold text-gray-700 w-[300px]">Tiêu đề</TableHead>
                        <TableHead className="font-semibold text-gray-700">Nội dung</TableHead>
                        <TableHead className="font-semibold text-gray-700 w-[200px]">Ngày đăng</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700 w-[100px]">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                Chưa có dữ liệu.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row) => (
                            <TableRow key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-medium align-top">{row.title}</TableCell>
                                <TableCell className="whitespace-pre-wrap align-top line-clamp-3">
                                    {row.content.length > 150 ? row.content.substring(0, 150) + "..." : row.content}
                                </TableCell>
                                <TableCell className="align-top text-muted-foreground">
                                    {row.publishDatetime ? format(new Date(row.publishDatetime), "dd/MM/yyyy HH:mm", { locale: vi }) : "-"}
                                </TableCell>
                                <TableCell className="text-right align-top">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => onEdit(row)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
