"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Pencil, KeyRound } from "lucide-react"
import { User, UserRole } from "@/features/users/types"
import { Badge } from "@/components/ui/badge"

interface UserTableProps {
    data: User[]
    onEdit: (user: User) => void
    onResetPassword: (id: number) => Promise<void>
}

function RoleBadge({ role }: { role: UserRole }) {
    const styles: Record<UserRole, string> = {
        ADMIN: "bg-rose-100 text-rose-700 hover:bg-rose-100/80 border-rose-200",
        ASSISTANT: "bg-amber-100 text-amber-700 hover:bg-amber-100/80 border-amber-200",
        TEACHER: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100/80 border-indigo-200",
        STUDENT: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 border-emerald-200",
    }
    const labels: Record<UserRole, string> = {
        ADMIN: "Quản trị viên",
        ASSISTANT: "Trợ lý viên",
        TEACHER: "Giảng viên",
        STUDENT: "Sinh viên",
    }
    return (
        <Badge variant="outline" className={`${styles[role]} border`}>
            {labels[role]}
        </Badge>
    )
}

export function UserTable({ data, onEdit, onResetPassword }: UserTableProps) {


    return (
        <div className="rounded-md border shadow-sm bg-white">
            <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead className="font-semibold text-gray-700">Mã người dùng</TableHead>
                        <TableHead className="font-semibold text-gray-700">Họ tên</TableHead>
                        <TableHead className="font-semibold text-gray-700">Vai trò</TableHead>
                        <TableHead className="font-semibold text-gray-700">Khoa</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                Chưa có dữ liệu.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row) => (
                            <TableRow key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-medium">{row.username}</TableCell>
                                <TableCell>{row.fullName}</TableCell>
                                <TableCell>
                                    <RoleBadge role={row.role} />
                                </TableCell>
                                <TableCell>
                                    {row.departmentName ? (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
                                            {row.departmentName}
                                        </Badge>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {(row.role === "STUDENT" || row.role === "TEACHER") && (
                                            <>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" title="Reset Password" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                            <KeyRound className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Xác nhận reset mật khẩu?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Bạn có chắc chắn muốn reset mật khẩu cho người dùng <strong>{row.fullName}</strong> ({row.username}) không?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => onResetPassword(row.id)}
                                                            >
                                                                Xác nhận
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                                <Button variant="ghost" size="icon" onClick={() => onEdit(row)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
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
