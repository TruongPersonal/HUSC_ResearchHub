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
import { AcademicYear } from "@/features/academic-year/types"
import { StatusBadge, ActiveBadge } from "./StatusBadge"

interface AcademicYearTableProps {
    data: AcademicYear[]
    onEdit: (year: AcademicYear) => void
}

export function AcademicYearTable({ data, onEdit }: AcademicYearTableProps) {

    return (
        <div className="rounded-md border shadow-sm bg-white">
            <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead className="font-semibold text-gray-700">Năm học</TableHead>
                        <TableHead className="font-semibold text-gray-700">Trạng thái</TableHead>
                        <TableHead className="font-semibold text-gray-700">Kích hoạt</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Thao tác</TableHead>
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
                                <TableCell className="font-medium">{row.year}</TableCell>
                                <TableCell>
                                    <StatusBadge status={row.status} />
                                </TableCell>
                                <TableCell>
                                    <ActiveBadge isActive={row.isActive} />
                                </TableCell>
                                <TableCell className="text-right">
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
