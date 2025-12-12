"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Faculty } from "@/features/faculties/types";

const formSchema = z.object({
  code: z.string().min(1, "Mã khoa không được để trống"),
  name: z.string().min(1, "Tên khoa không được để trống"),
});

type FormValues = z.infer<typeof formSchema>;

interface FacultyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Faculty | null;
  onSubmit: (values: FormValues) => Promise<void>;
}

/**
 * Form tạo/chỉnh sửa Khoa/Bộ môn.
 * Các trường: Mã khoa, Tên khoa.
 */
export function FacultyForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: FacultyFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        code: initialData.code,
        name: initialData.name,
      });
    } else {
      form.reset({
        code: "",
        name: "",
      });
    }
  }, [initialData, form, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Chỉnh sửa khoa" : "Thêm khoa mới"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Cập nhật thông tin khoa."
              : "Tạo khoa mới cho hệ thống."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              await onSubmit(values);
              onOpenChange(false);
            })}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã Khoa</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: CNTT" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Khoa</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Công nghệ Thông tin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
