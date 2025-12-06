"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { SearchFilterBar } from "@/components/shared/SearchFilterBar"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { FacultyTable } from "@/components/admin/faculties/FacultyTable"
import { FacultyForm } from "@/components/admin/faculties/FacultyForm"
import { facultyService } from "@/features/faculties/api/faculty.service"
import { Faculty, CreateFacultyRequest } from "@/features/faculties/types"
import { toast } from "sonner"

export default function FacultiesPage() {
    const [data, setData] = useState<Faculty[]>([])
    const [open, setOpen] = useState(false)
    const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null)

    // Pagination & Search state
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [searchQuery, setSearchQuery] = useState("")
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
            try {
                const result = await facultyService.getAll(debouncedSearchQuery, currentPage, pageSize)
                setData(result.content)
                setTotalPages(result.totalPages)
            } catch (error: any) {
                console.error("Failed to fetch faculties", error)
                const message = error?.response?.data?.message || "Không thể tải danh sách khoa"
                toast.error(message)
            }
        }
        fetchData()
    }, [currentPage, debouncedSearchQuery, refreshKey])

    const handleCreate = () => {
        setEditingFaculty(null)
        setOpen(true)
    }

    const handleEdit = (faculty: Faculty) => {
        setEditingFaculty(faculty)
        setOpen(true)
    }

    const handleSubmit = async (values: CreateFacultyRequest) => {
        try {
            if (editingFaculty) {
                await facultyService.update(editingFaculty.id, values)
                toast.success("Cập nhật khoa thành công")
            } else {
                await facultyService.create(values)
                toast.success("Tạo khoa mới thành công")
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
                    <h2 className="text-2xl font-bold tracking-tight">Quản lý Khoa</h2>
                    <p className="text-muted-foreground">Danh sách các Khoa hệ thống.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm Khoa
                </Button>
            </div>

            <SearchFilterBar
                searchPlaceholder="Tìm kiếm Khoa..."
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <FacultyTable
                data={data}
                onEdit={handleEdit}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <FacultyForm
                open={open}
                onOpenChange={setOpen}
                initialData={editingFaculty}
                onSubmit={handleSubmit}
            />
        </div>
    )
}
