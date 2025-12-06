"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { User, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"
import { jwtDecode } from "jwt-decode"

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"

const formSchema = z.object({
    username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu"),
})

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        setError(null)
        try {
            const response = await api.post("/auth/login", values)
            const { accessToken } = response.data
            localStorage.setItem("token", accessToken)
            // Set cookie for middleware
            document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Strict`

            // Decode token to check role
            const decoded = jwtDecode<{ role: string }>(accessToken)
            const role = decoded.role

            if (role === "ROLE_ADMIN") {
                router.push("/admin")
            } else if (role === "ROLE_STUDENT") {
                router.push("/student")
            } else if (role === "ROLE_TEACHER") {
                router.push("/teacher")
            } else {
                router.push("/")
            }
        } catch (err) {
            console.error(err)
            setError("Tên đăng nhập hoặc mật khẩu không đúng")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-neutral-50 font-sans flex items-center justify-center">
            {/* Mesh gradient background */}
            <div
                aria-hidden
                className="
          pointer-events-none absolute inset-0 opacity-80
          [background-image:radial-gradient(60rem_40rem_at_-10%_20%,rgba(56,189,248,0.2),transparent_60%),radial-gradient(50rem_30rem_at_110%_10%,rgba(147,51,234,0.15),transparent_60%),radial-gradient(40rem_30rem_at_50%_110%,rgba(59,130,246,0.15),transparent_60%)]
        "
            />

            <div className="relative z-10 w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-6">
                {/* Left Column — Login Form */}
                <div className="flex flex-col justify-center max-w-[500px] mx-auto w-full">
                    {/* Header */}
                    <div className="mb-10 flex flex-col lg:flex-row items-center lg:items-start gap-5 text-center lg:text-left">
                        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm shrink-0">
                            <Image src="/images/icons/logo.png" alt="Logo" width={48} height={48} priority className="object-contain" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">
                                Chào mừng trở lại!
                            </h1>
                            <p className="text-neutral-500 text-lg">
                                Đăng nhập để tiếp tục truy cập <span className="font-semibold text-blue-600">hệ thống</span>
                            </p>
                        </div>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 lg:p-10">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-sm font-medium text-neutral-700">Tên đăng nhập</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                                                    <Input
                                                        placeholder="Mã người dùng"
                                                        className="pl-10 h-11 bg-white/50 border-neutral-200 focus:bg-white transition-all duration-200"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <FormLabel className="text-sm font-medium text-neutral-700">Mật khẩu</FormLabel>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <button
                                                            type="button"
                                                            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                                                        >
                                                            Quên mật khẩu?
                                                        </button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Bạn quên mật khẩu?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-neutral-600">
                                                                Vui lòng liên hệ <span className="font-semibold text-neutral-900">Phòng KH,CN & HTQT</span> để được cấp lại mật khẩu.
                                                                <div className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                                                                    <p className="mb-2">📧 <a href="mailto:khcndhkh@hueuni.edu.vn" className="text-blue-600 hover:underline">khcndhkh@hueuni.edu.vn</a></p>
                                                                    <p>📞 (0234) 3828427</p>
                                                                </div>
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogAction className="bg-blue-600 hover:bg-blue-700">Đã hiểu</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        className="pl-10 pr-10 h-11 bg-white/50 border-neutral-200 focus:bg-white transition-all duration-200"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-0 h-full grid place-items-center text-neutral-400 hover:text-neutral-600"
                                                    >
                                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center animate-in fade-in slide-in-from-top-1">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-blue-500/30 active:scale-[0.98]"
                                >
                                    {loading ? (
                                        "Đang xử lý..."
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Đăng nhập hệ thống <ArrowRight className="h-4 w-4" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>

                {/* Right Column — Hero Image */}
                <div className="hidden lg:flex items-center justify-center relative h-[600px]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="relative w-full h-full max-w-[600px]">
                        <Image
                            src="/images/scientific_research.png"
                            alt="Research Illustration"
                            fill
                            className="object-contain drop-shadow-2xl animate-in fade-in zoom-in duration-700"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
