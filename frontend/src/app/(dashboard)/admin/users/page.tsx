"use client"

import { useState, useEffect } from "react"
import { Plus, FileDown } from "lucide-react"
import { SearchFilterBar } from "@/components/shared/SearchFilterBar"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { UserTable } from "@/components/admin/users/UserTable"
import { UserForm } from "@/components/admin/users/UserForm"
import { userService } from "@/features/users/api/user.service"
import { User, UserRole, CreateUserRequest, UpdateUserRequest } from "@/features/users/types"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { facultyService } from "@/features/faculties/api/faculty.service"
import { Faculty } from "@/features/faculties/types"

export default function UsersPage() {
    const [data, setData] = useState<User[]>([])
    const [open, setOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)

    // Pagination & Search state
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState<UserRole | undefined>(undefined)
    const [departmentFilter, setDepartmentFilter] = useState<string>("0") // "0" means all
    const pageSize = 10

    const [faculties, setFaculties] = useState<Faculty[]>([])

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const res = await facultyService.getAll("", 0, 100)
                setFaculties(res.content)
            } catch (error) {
                console.error("Failed to fetch faculties", error)
            }
        }
        fetchFaculties()
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
            setCurrentPage(0)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    const fetchData = async (page: number, keyword: string, role?: UserRole, deptId?: number) => {
        try {
            const result = await userService.getAll(keyword, role, deptId, page, pageSize)
            setData(result.content)
            setTotalPages(result.totalPages)
        } catch (error) {
            console.error("Failed to fetch users", error)
            toast.error("Không thể tải danh sách người dùng")
        }
    }

    useEffect(() => {
        const deptId = departmentFilter !== "0" ? parseInt(departmentFilter) : undefined
        fetchData(currentPage, debouncedSearchQuery, roleFilter, deptId)
    }, [currentPage, debouncedSearchQuery, roleFilter, departmentFilter])

    const handleCreate = () => {
        setEditingUser(null)
        setOpen(true)
    }

    const handleEdit = (user: User) => {
        setEditingUser(user)
        setOpen(true)
    }



    const handleResetPassword = async (id: number) => {
        try {
            await userService.resetPassword(id)
            // Show password in a persistent toast or dialog
            toast.success("Reset mật khẩu thành công. Mật khẩu mới đã được gửi về email @husc.edu.vn của người dùng.")
        } catch (error) {
            console.error("Failed to reset password", error)
            toast.error("Có lỗi xảy ra khi reset mật khẩu")
        }
    }

    const handleSubmit = async (values: CreateUserRequest | UpdateUserRequest) => {
        try {
            if (editingUser) {
                await userService.update(editingUser.id, values)
                toast.success("Cập nhật người dùng thành công")
            } else {
                const newUser = await userService.create(values)
                if (newUser.role === "STUDENT" || newUser.role === "TEACHER") {
                    toast.success("Tạo người dùng thành công. Mật khẩu đã được gửi về email @husc.edu.vn của người dùng.")
                } else {
                    toast.success("Tạo người dùng thành công.")
                }
            }
            const deptId = departmentFilter !== "0" ? parseInt(departmentFilter) : undefined
            fetchData(currentPage, debouncedSearchQuery, roleFilter, deptId)
            setOpen(false)
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error("Failed to save", error)
            const message = error.response?.data?.message || "Có lỗi xảy ra"
            toast.error(message)
        }
    }

    const handleImportClick = () => {
        document.getElementById("file-upload")?.click()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            toast.info("Đang xử lý import...")
            await userService.importUsers(file)

            toast.success("Import người dùng thành công.")

            const deptId = departmentFilter !== "0" ? parseInt(departmentFilter) : undefined
            fetchData(currentPage, debouncedSearchQuery, roleFilter, deptId)
        } catch (error) {
            console.error("Failed to import", error)
            toast.error("Có lỗi xảy ra khi import dữ liệu")
        } finally {
            // Reset input
            event.target.value = ""
        }
    }

    return (
        <div className="h-full flex-1 flex-col space-y-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Quản lý tài khoản</h2>
                    <p className="text-muted-foreground">
                        Danh sách các người dùng hệ thống.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                    />
                    <Button variant="outline" onClick={handleImportClick}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Import Excel
                    </Button>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Thêm người dùng
                    </Button>
                </div>
            </div>

            <SearchFilterBar
                searchPlaceholder="Tìm kiếm người dùng..."
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                filters={[
                    {
                        key: "role",
                        placeholder: "Vai trò",
                        value: roleFilter || "ALL",
                        onValueChange: (val) => setRoleFilter(val === "ALL" ? undefined : val as UserRole),
                        options: [
                            { label: "Tất cả vai trò", value: "ALL" },
                            { label: "Quản trị viên", value: "ADMIN" },
                            { label: "Trợ lý viên", value: "ASSISTANT" },
                            { label: "Giảng viên", value: "TEACHER" },
                            { label: "Sinh viên", value: "STUDENT" },
                        ],
                        minWidth: "180px"
                    },
                    {
                        key: "department",
                        placeholder: "Khoa",
                        value: departmentFilter,
                        onValueChange: setDepartmentFilter,
                        options: [
                            { label: "Tất cả khoa", value: "0" },
                            ...faculties.map(f => ({ label: f.name, value: f.id.toString() }))
                        ],
                        minWidth: "200px"
                    }
                ]}
            />

            <UserTable
                data={data}
                onEdit={handleEdit}
                onResetPassword={handleResetPassword}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <UserForm
                open={open}
                onOpenChange={setOpen}
                initialData={editingUser}
                onSubmit={handleSubmit}
            />
        </div >
    )
}
