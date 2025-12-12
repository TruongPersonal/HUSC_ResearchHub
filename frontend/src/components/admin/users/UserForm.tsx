"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/features/users/types";
import { Faculty } from "@/features/faculties/types";
import { facultyService } from "@/features/faculties/api/faculty.service";

const formSchema = z
  .object({
    username: z.string().min(1, "Mã người dùng không được để trống"),
    fullName: z.string().min(1, "Họ tên không được để trống"),
    role: z.enum(["ADMIN", "ASSISTANT", "TEACHER", "STUDENT"]),
    departmentId: z.string().optional(),
  })
  .refine(
    (data) => {
      // Require Department for TEACHER and STUDENT (and ASSISTANT if enabled later)
      if (
        (data.role === "TEACHER" ||
          data.role === "STUDENT" ||
          data.role === "ASSISTANT") &&
        (!data.departmentId || data.departmentId === "0")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Vui lòng chọn Khoa",
      path: ["departmentId"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: User | null;
  onSubmit: (values: CreateUserRequest | UpdateUserRequest) => Promise<void>;
}

/**
 * Form tạo/chỉnh sửa Người dùng.
 * Hỗ trợ chọn vai trò (Admin, Assistant, Teacher, Student) và Khoa (nếu cần).
 */
export function UserForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: UserFormProps) {
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await facultyService.getAll("", 0, 100);
        setFaculties(res.content);
      } catch (error) {
        console.error("Failed to fetch faculties", error);
      }
    };
    fetchFaculties();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      fullName: "",
      role: "STUDENT",
      departmentId: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        username: initialData.username,
        fullName: initialData.fullName,
        role: initialData.role,
        departmentId: initialData.departmentId?.toString(),
      });
    } else {
      form.reset({
        username: "",
        fullName: "",
        role: "STUDENT",
        departmentId: undefined,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const submitData = {
      ...values,
      departmentId:
        values.departmentId && values.departmentId !== "0"
          ? parseInt(values.departmentId)
          : undefined,
    };
    await onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Cập nhật thông tin người dùng."
              : "Tạo người dùng mới cho hệ thống."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã người dùng</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: nvtrung / 23t1020573"
                      {...field}
                      disabled={!!initialData}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vai trò</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="STUDENT">Sinh viên</SelectItem>
                        <SelectItem value="TEACHER">Giảng viên</SelectItem>
                        {/* Admin cannot create other Admins or Assistants via this form as per request */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khoa</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn khoa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>

                        {faculties.map((f) => (
                          <SelectItem key={f.id} value={f.id.toString()}>
                            {f.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Lưu thay đổi</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
