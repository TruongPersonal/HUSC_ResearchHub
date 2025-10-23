"use client";

import { BookOpen, ClipboardCheck, Users, Search } from "lucide-react"; // icon nhẹ, không rối

/**
 * AboutPage (Desktop-only, Fixed Size)
 * - Không responsive: khóa min-width + wrapper width cố định
 * - Bố cục: Hero (tiêu đề) → Card giới thiệu → Tính năng (4 thẻ) → Số liệu nhanh → Liên hệ
 */
export default function AboutPage() {
  // ===== CONSTANTS (giữ mọi thứ fixed-size) =====
  const PAGE_MIN_W = "min-w-[1280px]";
  const WRAPPER_W = "w-[1000px]"; // rộng hơn 2xl một chút cho thoáng
  const GRID_4 = "grid-cols-[1fr_1fr_1fr_1fr]"; // lưới 4 cột cố định

  return (
    <div
      className={`${PAGE_MIN_W} relative min-h-screen overflow-hidden`}
      // Nền tách 2 nửa rất nhẹ, không gây rối (desktop-only)
      style={{
        background:
          "linear-gradient(90deg,#ffffff 0%,#F7F9FF 100%)",
      }}
    >
      {/* Mesh rất mờ để nền bớt phẳng (có thể bỏ nếu muốn tối giản) */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 opacity-90
          [background-image:radial-gradient(58rem_36rem_at_-10%_20%,rgba(56,189,248,0.14),transparent_60%),radial-gradient(46rem_28rem_at_110%_10%,rgba(147,51,234,0.12),transparent_60%)]
          bg-no-repeat
        "
      />

      <main
        className={`relative z-10 mx-auto ${WRAPPER_W} py-14 flex flex-col gap-12`}
      >
        {/* ===== HERO: Tiêu đề + tagline ngắn ===== */}
        <header className="text-center">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100 text-xs font-semibold mb-4">
            Hệ thống quản lý đăng ký đề tài NCKH
          </div>
          <h1 className="text-[32px] leading-[38px] font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
            Giới thiệu về HUSC ResearchHub
          </h1>
          <p className="mt-2 text-neutral-700">
            Nền tảng hỗ trợ sinh viên Trường Đại học Khoa học, Đại học Huế đăng
            ký, theo dõi và quản lý đề tài nghiên cứu khoa học một cách hiện đại
            và minh bạch.
          </p>
        </header>

        {/* ===== CARD GIỚI THIỆU CHUNG ===== */}
        <section className="bg-white rounded-2xl shadow border border-neutral-200 p-8 space-y-4">
          <p>
            <strong>HUSC ResearchHub</strong> là hệ thống quản lý đăng ký đề tài
            nghiên cứu khoa học dành cho sinh viên. Nền tảng giúp bạn đăng ký
            trực tuyến, theo dõi tiến trình, cập nhật thông tin và quản lý hồ sơ
            đề tài tập trung.
          </p>
          <p>
            Mục tiêu của hệ thống là nâng cao chất lượng nghiên cứu khoa học
            trong sinh viên, tạo môi trường thuận lợi để phát triển ý tưởng và
            kết nối cộng đồng học thuật.
          </p>
        </section>

        {/* ===== TÍNH NĂNG CHÍNH — 4 THẺ ===== */}
        <section>
          <h2 className="text-lg font-semibold text-blue-700 mb-4">
            Chức năng chính
          </h2>
          <div className={`grid ${GRID_4} gap-4`}>
            <FeatureCard
              icon={<ClipboardCheck className="w-5 h-5" />}
              title="Đăng ký trực tuyến"
              desc="Nộp hồ sơ, tệp minh chứng và quản lý thông tin đề tài ngay trên hệ thống."
            />
            <FeatureCard
              icon={<Search className="w-5 h-5" />}
              title="Theo dõi xét duyệt"
              desc="Xem trạng thái theo thời gian thực: Đã nộp, Đang duyệt, Bổ sung, Đã duyệt…"
            />
            <FeatureCard
              icon={<Users className="w-5 h-5" />}
              title="Làm việc nhóm"
              desc="Quản lý thành viên, giảng viên hướng dẫn và phân công nhiệm vụ rõ ràng."
            />
            <FeatureCard
              icon={<BookOpen className="w-5 h-5" />}
              title="Tra cứu & thông báo"
              desc="Xem danh sách đề tài, lịch thông báo theo đợt, quy định – biểu mẫu."
            />
          </div>
        </section>

        {/* ===== LIÊN HỆ NHANH ===== */}
        <section className="bg-white rounded-2xl shadow border border-neutral-200 p-6">
          <h3 className="text-md font-semibold text-blue-700 mb-2">
            Liên hệ hỗ trợ
          </h3>
          <p className="text-neutral-700 mb-4">
            Phòng Khoa học, Công nghệ và Hợp tác Quốc tế – Trường Đại học Khoa
            học, Đại học Huế.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="tel:+842343828427"
              className="h-10 inline-flex items-center justify-center px-4 rounded-md bg-blue-700 text-white font-semibold hover:bg-blue-800 active:bg-blue-900 transition"
            >
              Gọi: (0234) 3828427
            </a>
            <a
              href="mailto:khcndhkh@hueuni.edu.vn"
              className="h-10 inline-flex items-center justify-center px-4 rounded-md border border-neutral-300 bg-white text-neutral-800 font-medium hover:bg-neutral-50 active:bg-neutral-100 transition"
            >
              Email: khcndhkh@hueuni.edu.vn
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

/** Thẻ tính năng gọn, đồng bộ thẩm mỹ app nội bộ */
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow p-5">
      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
        {icon}
      </div>
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-neutral-700 text-sm leading-6">{desc}</div>
    </div>
  );
}

/** Item số liệu nhanh (sạch – dễ đọc) */
function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div className="py-2">
      <div className="text-[28px] leading-[32px] font-extrabold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
        {number}
      </div>
      <div className="text-neutral-700">{label}</div>
    </div>
  );
}
