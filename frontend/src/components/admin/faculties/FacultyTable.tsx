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
import { Faculty } from "@/features/faculties/types"

interface FacultyTableProps {
    data: Faculty[]
    onEdit: (faculty: Faculty) => void
}

export function FacultyTable({ data, onEdit }: FacultyTableProps) {


    return (
        <div className="rounded-md border shadow-sm bg-white">
            <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead className="font-semibold text-gray-700">Mã Khoa</TableHead>
                        <TableHead className="font-semibold text-gray-700">Tên Khoa</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                Chưa có dữ liệu.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row) => (
                            <TableRow key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-medium">{row.code}</TableCell>
                                <TableCell>{row.name}</TableCell>
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
