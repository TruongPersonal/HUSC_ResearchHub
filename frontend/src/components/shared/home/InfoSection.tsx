import Link from "next/link";

interface InfoSectionProps {
    topicsHref?: string;
    announcementsHref?: string;
}

export function InfoSection({
    topicsHref = "/student/topics",
    announcementsHref = "/student/announcements"
}: InfoSectionProps) {
    return (
        <div className="space-y-8 pt-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium border border-blue-100">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
                Hệ thống QLĐK đề tài NCKH
            </div>

            <div className="space-y-4">
                <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                    HUSC <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">ResearchHub</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                    Nền tảng trực tuyến hỗ trợ sinh viên đăng ký và quản lý đề tài nghiên cứu khoa học.
                    Đơn giản hóa quy trình, kết nối giảng viên và sinh viên hiệu quả.
                </p>
            </div>

            <div className="flex flex-wrap gap-4">
                <Link
                    href={topicsHref}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5"
                >
                    Đăng ký ngay
                </Link>
                <Link
                    href={announcementsHref}
                    className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium border border-gray-200 rounded-lg transition-all"
                >
                    Xem thông báo
                </Link>
            </div>
        </div>
    )
}
