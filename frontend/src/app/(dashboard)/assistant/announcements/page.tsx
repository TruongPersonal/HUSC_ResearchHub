"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { SearchFilterBar } from "@/components/shared/SearchFilterBar"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { AnnouncementList } from "@/components/admin/announcements/AnnouncementList"
import { AnnouncementForm } from "@/components/admin/announcements/AnnouncementForm"
import { announcementService } from "@/features/announcements/api/announcement.service"
import { Announcement, CreateAnnouncementRequest } from "@/features/announcements/types"
import { toast } from "sonner"
import { useAcademicYear } from "@/contexts/AcademicYearContext"
import { useAuth } from "@/features/auth/context/AuthContext"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"


export default function AssistantAnnouncementsPage() {
    const { user } = useAuth()
    const { selectedYear, loading: yearLoading } = useAcademicYear()

    // Faculty Announcements State
    const [facultyData, setFacultyData] = useState<Announcement[]>([])
    const [facultyPage, setFacultyPage] = useState(0)
    const [facultyTotalPages, setFacultyTotalPages] = useState(0)
    const [facultySearch, setFacultySearch] = useState("")
    const [debouncedFacultySearch, setDebouncedFacultySearch] = useState("")

    // General Announcements State
    const [data, setData] = useState<Announcement[]>([])
    const [open, setOpen] = useState(false)
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null)

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
            if (!user?.departmentId || !selectedYear) return

            try {
                // Always fetch department announcements for assistant
                const result = await announcementService.getAll(
                    debouncedSearchQuery,
                    currentPage,
                    pageSize,
                    selectedYear.id,
                    user.departmentId
                )
                setData(result.content)
                setTotalPages(result.totalPages)
            } catch (error) {
                console.error("Failed to fetch announcements", error)
                toast.error("Không thể tải danh sách thông báo")
            }
        }
        fetchData()
    }, [currentPage, debouncedSearchQuery, refreshKey, user, selectedYear])

    const handleCreate = () => {
        setEditingAnnouncement(null)
        setOpen(true)
    }

    const handleEdit = (announcement: Announcement) => {
        setEditingAnnouncement(announcement)
        setOpen(true)
    }

    const handleDelete = (announcement: Announcement) => {
        setAnnouncementToDelete(announcement)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!announcementToDelete) return

        try {
            await announcementService.delete(announcementToDelete.id)
            toast.success("Xóa thông báo thành công")
            setRefreshKey(prev => prev + 1)
        } catch (error) {
            console.error("Failed to delete", error)
            toast.error("Có lỗi xảy ra khi xóa thông báo")
        } finally {
            setDeleteDialogOpen(false)
            setAnnouncementToDelete(null)
        }
    }

    const handleSubmit = async (values: CreateAnnouncementRequest) => {
        if (!user?.departmentId) {
            toast.error("Không tìm thấy thông tin khoa của bạn")
            return
        }

        try {
            const payload: CreateAnnouncementRequest = {
                ...values,
                academicYearId: selectedYear ? selectedYear.id : undefined,
                departmentId: user.departmentId
            }

            if (editingAnnouncement) {
                await announcementService.update(editingAnnouncement.id, payload)
                toast.success("Cập nhật thông báo thành công")
            } else {
                await announcementService.create(payload)
                toast.success("Tạo thông báo mới thành công")
            }
            setRefreshKey(prev => prev + 1)
            setOpen(false)
        } catch (error) {
            console.error("Failed to save", error)
            toast.error("Có lỗi xảy ra khi lưu dữ liệu")
        }
    }

    if (yearLoading) {
        return <div className="flex items-center justify-center h-full">Đang tải...</div>
    }

    return (
        <div className="h-full flex-1 flex-col space-y-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Quản lý thông báo</h2>
                    <p className="text-muted-foreground">Danh sách các thông báo của khoa.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm thông báo
                </Button>
            </div>

            <SearchFilterBar
                searchPlaceholder="Tìm kiếm thông báo..."
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <AnnouncementList
                data={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <AnnouncementForm
                open={open}
                onOpenChange={setOpen}
                initialData={editingAnnouncement}
                onSubmit={handleSubmit}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Thông báo này sẽ bị xóa vĩnh viễn khỏi hệ thống.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
