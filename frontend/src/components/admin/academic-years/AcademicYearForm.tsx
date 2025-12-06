"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AcademicYear } from "@/features/academic-year/types"

const formSchema = z.object({
    year: z.coerce.number().min(2000, "Năm phải lớn hơn 2000").max(2100, "Năm phải nhỏ hơn 2100"),
    status: z.enum(["START", "END"]),
    isActive: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface AcademicYearFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: AcademicYear | null
    onSubmit: (values: FormValues) => Promise<void>
}

export function AcademicYearForm({ open, onOpenChange, initialData, onSubmit }: AcademicYearFormProps) {
    const form = useForm<FormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            year: new Date().getFullYear(),
            status: "START",
            isActive: true,
        },
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                year: initialData.year,
                status: initialData.status,
                isActive: initialData.isActive,
            })
        } else {
            form.reset({
                year: new Date().getFullYear(),
                status: "START",
                isActive: true,
            })
        }
    }, [initialData, form, open])


    const handleFormSubmit = async (values: FormValues) => {
        await onSubmit(values)
        onOpenChange(false)
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Chỉnh sửa năm học" : "Thêm năm học mới"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Cập nhật thông tin năm học." : "Tạo năm học mới cho hệ thống."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="year"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Năm học</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trạng thái</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn trạng thái" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="START">Bắt đầu</SelectItem>
                                            <SelectItem value="END">Kết thúc</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Kích hoạt</FormLabel>
                                        <FormDescription>
                                            Cho phép sử dụng năm học này
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Lưu thay đổi
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
