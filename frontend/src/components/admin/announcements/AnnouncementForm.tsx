"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { Announcement } from "@/features/announcements/types";

const formSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  content: z.string().min(1, "Nội dung không được để trống"),
});

interface AnnouncementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: Announcement | null;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
}

/**
 * Form tạo/chỉnh sửa Thông báo.
 * Các trường: Tiêu đề, Nội dung.
 */
export function AnnouncementForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: AnnouncementFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        content: initialData.content,
      });
    } else {
      form.reset({
        title: "",
        content: "",
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Chỉnh sửa thông báo" : "Thêm thông báo mới"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Cập nhật thông tin thông báo."
              : "Tạo thông báo mới cho hệ thống."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tiêu đề thông báo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập nội dung thông báo..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Lưu thay đổi</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
