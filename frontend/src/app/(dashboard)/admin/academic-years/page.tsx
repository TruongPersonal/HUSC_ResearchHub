"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { SearchFilterBar } from "@/components/shared/SearchFilterBar"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { AcademicYearTable } from "@/components/admin/academic-years/AcademicYearTable"
import { AcademicYearForm } from "@/components/admin/academic-years/AcademicYearForm"
import { academicYearService } from "@/features/academic-year/api/academic-year.service"
import { AcademicYear, CreateAcademicYearRequest } from "@/features/academic-year/types"
import { toast } from "sonner"

export default function AcademicYearsPage() {
    const [data, setData] = useState<AcademicYear[]>([])
    const [open, setOpen] = useState(false)
    const [editingYear, setEditingYear] = useState<AcademicYear | null>(null)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const pageSize = 10

    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
    const [refreshKey, setRefreshKey] = useState(0)
    const [activeFilter, setActiveFilter] = useState("all")

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
            setCurrentPage(0) // Reset to first page on search
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        const fetchData = async () => {
            try {
                let isActive: boolean | undefined = undefined
                if (activeFilter === "active") isActive = true
                if (activeFilter === "inactive") isActive = false

                const result = await academicYearService.getAll(debouncedSearchQuery, currentPage, pageSize, isActive)
                setData(result.content)
                setTotalPages(result.totalPages)
            } catch (error: any) {
                console.error("Failed to fetch academic years", error)
                const message = error?.response?.data?.message || "Không thể tải danh sách năm học"
                toast.error(message)
            }
        }
        fetchData()
    }, [currentPage, debouncedSearchQuery, refreshKey, activeFilter])

    const handleCreate = () => {
        setEditingYear(null)
        setOpen(true)
    }

    const handleEdit = (year: AcademicYear) => {
        setEditingYear(year)
        setOpen(true)
    }



    const handleSubmit = async (values: CreateAcademicYearRequest) => {
        try {
            if (editingYear) {
                await academicYearService.update(editingYear.id, values)
                toast.success("Cập nhật năm học thành công")
            } else {
                await academicYearService.create(values)
                toast.success("Tạo năm học mới thành công")
            }
            setRefreshKey(prev => prev + 1)
            setOpen(false)
            // Dispatch event to update AcademicYearSelector
            window.dispatchEvent(new Event("academic-year-updated"))
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
                    <h2 className="text-2xl font-bold tracking-tight">Quản lý năm học</h2>
                    <p className="text-muted-foreground">Danh sách các năm học hệ thống.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm năm học
                </Button>
            </div>

            <SearchFilterBar
                searchPlaceholder="Tìm kiếm năm học..."
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                filters={[
                    {
                        key: "status",
                        placeholder: "Trạng thái",
                        value: activeFilter,
                        onValueChange: setActiveFilter,
                        options: [
                            { value: "all", label: "Tất cả trạng thái" },
                            { value: "active", label: "Đang kích hoạt" },
                            { value: "inactive", label: "Chưa kích hoạt" },
                        ],
                    },
                ]}
            />

            <AcademicYearTable
                data={data}
                onEdit={handleEdit}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <AcademicYearForm
                open={open}
                onOpenChange={setOpen}
                initialData={editingYear}
                onSubmit={handleSubmit}
            />
        </div>
    )
}
