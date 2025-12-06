import Image from "next/image";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-[#161D2E] text-white py-4 mt-auto relative z-50">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Brand & Logo */}
                <div className="flex items-center gap-3">
                    <div className="bg-white p-1 rounded-full shadow-lg">
                        <Image
                            src="/images/icons/logo.png"
                            alt="HUSC ResearchHub Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            HUSC ResearchHub
                        </h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                            Đại học Khoa học, Đại học Huế
                        </p>
                    </div>
                </div>

                {/* Copyright & Links */}
                <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-gray-400">
                    <span>&copy; 2025 CIPHER TEAM</span>
                    <div className="hidden md:block w-1 h-1 bg-gray-600 rounded-full" />
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-white transition-colors">
                            Về chúng tôi
                        </Link>
                        <Link href="#" className="hover:text-white transition-colors">
                            Hỏi đáp
                        </Link>
                        <Link href="#" className="hover:text-white transition-colors">
                            Điều khoản
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
