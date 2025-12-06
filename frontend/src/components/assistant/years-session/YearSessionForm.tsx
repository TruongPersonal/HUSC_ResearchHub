"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { AcademicYear } from "@/features/academic-year/types"
import { yearSessionService } from "@/features/academic-year/api/year-session.service"
import { toast } from "sonner"

const formSchema = z.object({
    academicYearId: z.string().optional(),
    status: z.enum(["ON_REGISTRATION", "UNDER_REVIEW", "IN_PROGRESS", "COMPLETED"]),
})

interface YearSessionFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: { id: number; academicYearId: number; status: string; year: number } | null
    onSubmit: (values: { academicYearId?: number; status: string }) => Promise<void>
}

export function YearSessionForm({ open, onOpenChange, initialData, onSubmit }: YearSessionFormProps) {
    const [availableYears, setAvailableYears] = useState<AcademicYear[]>([])
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            academicYearId: "",
            status: "ON_REGISTRATION",
        },
    })

    useEffect(() => {
        if (open) {
            const fetchYears = async () => {
                setLoading(true)
                try {
                    const years = await yearSessionService.getAvailableYears()
                    setAvailableYears(years)
                } catch (error) {
                    console.error("Failed to fetch available years", error)
                    toast.error("Không thể tải danh sách năm học khả dụng")
                } finally {
                    setLoading(false)
                }
            }

            if (!initialData) {
                fetchYears()
                form.reset({
                    academicYearId: "",
                    status: "ON_REGISTRATION",
                })
            } else {
                form.reset({
                    academicYearId: initialData.academicYearId.toString(),
                    status: initialData.status as any,
                })
            }
        }
    }, [open, form, initialData])

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!initialData && !values.academicYearId) {
            form.setError("academicYearId", { message: "Vui lòng chọn năm học" })
            return
        }

        await onSubmit({
            academicYearId: values.academicYearId ? parseInt(values.academicYearId) : undefined,
            status: values.status
        })
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Chỉnh sửa phiên năm học" : "Thêm phiên năm học mới"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Cập nhật thông tin phiên năm học." : "Tạo phiên năm học cho khoa."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        {!initialData && (
                            <FormField
                                control={form.control}
                                name="academicYearId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Năm học</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={loading ? "Đang tải..." : "Chọn năm học"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {availableYears.length === 0 ? (
                                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                                        Không có năm học khả dụng
                                                    </div>
                                                ) : (
                                                    availableYears.map((year) => (
                                                        <SelectItem key={year.id} value={year.id.toString()}>
                                                            {year.year}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trạng thái {initialData ? `- ${initialData.year}` : ""}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn trạng thái" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="ON_REGISTRATION">Đang đăng ký</SelectItem>
                                            <SelectItem value="UNDER_REVIEW">Đang xét duyệt</SelectItem>
                                            <SelectItem value="IN_PROGRESS">Đang thực hiện</SelectItem>
                                            <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={loading || (availableYears.length === 0 && !initialData)}>
                                Lưu thay đổi
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
