"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
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
import { authService } from "@/features/auth/api/auth.service";
import { toast } from "sonner";

const formSchema = z.object({
    username: z.string().min(1, "Vui lòng nhập mã người dùng"),
});

/**
 * Trang Quên mật khẩu.
 * Giao diện được thiết kế đồng bộ với trang Login.
 */
export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            await authService.forgotPassword(values.username);
            setIsSuccess(true);
            toast.success("Yêu cầu thành công! Vui lòng kiểm tra email.");
        } catch (error: any) {
            console.error(error);
            const msg = error?.response?.data?.message || "Có lỗi xảy ra";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-neutral-50 font-sans flex items-center justify-center">
            {/* Mesh gradient background - Consistent with Login Page */}
            <div
                aria-hidden
                className="
          pointer-events-none absolute inset-0 opacity-80
          [background-image:radial-gradient(60rem_40rem_at_-10%_20%,rgba(56,189,248,0.2),transparent_60%),radial-gradient(50rem_30rem_at_110%_10%,rgba(147,51,234,0.15),transparent_60%),radial-gradient(40rem_30rem_at_50%_110%,rgba(59,130,246,0.15),transparent_60%)]
        "
            />

            <div className="relative z-10 w-full max-w-[500px] p-6">
                {/* Header Logo Area */}
                <div className="mb-8 flex flex-col items-center text-center gap-4">
                    <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm shrink-0 animate-in zoom-in duration-500">
                        <Image
                            src="/images/icons/logo.png"
                            alt="Logo"
                            width={48}
                            height={48}
                            priority
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
                            Quên mật khẩu?
                        </h1>
                        <p className="text-neutral-500 text-lg max-w-[350px] mx-auto leading-relaxed">
                            Lấy lại quyền truy cập vào{" "}
                            <span className="font-semibold text-blue-600">hệ thống</span>.
                        </p>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {isSuccess ? (
                        <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-neutral-900">Email đã được gửi!</h3>
                                <p className="text-neutral-600">
                                    Đã gửi thông tin khôi phục mật khẩu đến địa chỉ email (<strong>@husc.edu.vn</strong>) của bạn.
                                </p>
                            </div>
                            <Button asChild className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-blue-500/30 active:scale-[0.98]">
                                <Link href="/login">
                                    Quay lại trang đăng nhập
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-sm font-medium text-neutral-700">
                                                Mã người dùng
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                                                    <Input
                                                        placeholder="Mã sinh viên / giảng viên"
                                                        className="pl-10 h-11 bg-white/50 border-neutral-200 focus:bg-white transition-all duration-200"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-blue-500/30 active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        "Đang xử lý..."
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Gửi yêu cầu <ArrowRight className="h-4 w-4" />
                                        </span>
                                    )}
                                </Button>

                                <div className="flex items-center justify-center">
                                    <Link
                                        href="/login"
                                        className="group flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                        Quay lại
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    )}
                </div>

                {/* Footer info */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-neutral-400">
                        Cần hỗ trợ? Liên hệ <a href="mailto:khcndhkh@hueuni.edu.vn" className="text-blue-600 hover:underline">Phòng KH,CN & HTQT</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
