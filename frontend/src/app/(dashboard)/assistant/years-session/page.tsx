"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { SearchFilterBar } from "@/components/shared/SearchFilterBar"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { YearSessionList } from "@/components/assistant/years-session/YearSessionList"
import { YearSessionForm } from "@/components/assistant/years-session/YearSessionForm"
import { yearSessionService } from "@/features/academic-year/api/year-session.service"
import { YearSession } from "@/features/academic-year/types"
import { toast } from "sonner"
import { useAuth } from "@/features/auth/context/AuthContext"

export default function YearSessionsPage() {
    const { user } = useAuth()
    const [data, setData] = useState<YearSession[]>([])
    const [open, setOpen] = useState(false)
    const [editingSession, setEditingSession] = useState<YearSession | null>(null)

    // Pagination & Search state
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const pageSize = 10

    // Debounce search query manually
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
            setCurrentPage(0) // Reset to first page on search
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.departmentId) return

            try {
                const result = await yearSessionService.getAll(
                    debouncedSearchQuery,
                    currentPage,
                    pageSize,
                    user.departmentId,
                    statusFilter
                )
                setData(result.content)
                setTotalPages(result.totalPages)
            } catch (error: any) {
                console.error("Failed to fetch year sessions", error)
                const message = error?.response?.data?.message || "Không thể tải danh sách phiên năm học"
                toast.error(message)
            }
        }
        fetchData()
    }, [currentPage, debouncedSearchQuery, refreshKey, user, statusFilter])

    const handleCreate = () => {
        setEditingSession(null)
        setOpen(true)
    }

    const handleEdit = (session: YearSession) => {
        setEditingSession(session)
        setOpen(true)
    }

    const handleSubmit = async (values: { academicYearId?: number; status: string }) => {
        if (!user?.departmentId) {
            toast.error("Không tìm thấy thông tin khoa của bạn")
            return
        }

        try {
            if (editingSession) {
                await yearSessionService.update(editingSession.id, {
                    status: values.status as any
                })
                toast.success("Cập nhật phiên năm học thành công")
            } else {
                if (!values.academicYearId) return
                await yearSessionService.create({
                    academicYearId: values.academicYearId,
                    departmentId: user.departmentId,
                    status: values.status as any
                })
                toast.success("Thêm phiên năm học thành công")
            }
            setRefreshKey(prev => prev + 1)
            setOpen(false)
        } catch (error: any) {
            console.error("Failed to save", error)
            const message = error?.response?.data?.message || "Có lỗi xảy ra khi lưu dữ liệu"
            toast.error(message)
        }
    }

    return (
        <div className="h-full flex-1 flex-col space-y-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Quản lý phiên năm học</h2>
                    <p className="text-muted-foreground">Danh sách các phiên năm học của khoa.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm phiên năm học
                </Button>
            </div>

            <SearchFilterBar
                searchPlaceholder="Tìm kiếm theo năm..."
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                filters={[
                    {
                        key: "status",
                        placeholder: "Trạng thái",
                        value: statusFilter,
                        onValueChange: setStatusFilter,
                        options: [
                            { label: "Tất cả", value: "ALL" },
                            { label: "Đang đăng ký", value: "ON_REGISTRATION" },
                            { label: "Đang xét duyệt", value: "UNDER_REVIEW" },
                            { label: "Đang thực hiện", value: "IN_PROGRESS" },
                            { label: "Hoàn thành", value: "COMPLETED" },
                        ]
                    }
                ]}
            />

            <YearSessionList
                sessions={data}
                onEdit={handleEdit}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <YearSessionForm
                open={open}
                onOpenChange={setOpen}
                initialData={editingSession}
                onSubmit={handleSubmit}
            />

        </div>
    )
}
