import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#161D2E] shadow-inner">
      <div className="container mx-auto py-7 flex flex-row items-center justify-between">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Image
            src="/icons/logo.png"
            alt="Logo"
            width={48}
            height={48}
            priority
            className="bg-white rounded-full shadow"
          />
        </div>

        {/* Tên và mô tả */}
        <div className="flex flex-col ml-3 text-center">
          <p className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent font-bold text-lg">
            HUSC ResearchHub
          </p>
          <p className="text-xs text-white">
            Hệ thống quản lý đăng ký đề tài Nghiên cứu khoa học - Trường Đại học
            Khoa học, Đại học Huế
          </p>
        </div>

        {/* Bản quyền */}
        <ul className="flex flex-wrap items-center justify-center gap-4 text-xs text-white">
          <li>&copy; 2025 CIPHER TEAM</li>
          <li>
            <Link
              href="/accounts/about"
              className="hover:underline hover:text-neutral-200 transition-colors"
            >
              Về chúng tôi
            </Link>
          </li>
          <li>
            <Link
              href="/accounts/FAQs"
              className="hover:underline hover:text-neutral-200 transition-colors"
            >
              Hỏi đáp
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
