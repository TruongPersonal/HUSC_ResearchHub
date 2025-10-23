"use client";

import Image from "next/image";

/**
 * TeacherHomePage (Desktop-only, Fixed-size, Split Background)
 * - 2 cột cố định: Trái (tiêu đề + mô tả + CTA), Phải (hero image)
 * - Không responsive: khóa kích thước, dùng cho màn hình desktop
 *
 * THAM SỐ DỄ CHỈNH:
 *  - WRAPPER_W       : bề ngang khối chính (1080px)
 *  - GRID_COLS       : độ rộng cột trái/cột phải (520px / 1fr)
 *  - HERO_W / HERO_H : khung ảnh hero (560 x 420)
 *  - HERO_SRC        : ảnh hero cho giảng viên
 */
export default function TeacherHomePage() {
  const WRAPPER_W = "w-[1080px]";
  const GRID_COLS = "grid-cols-[520px_1fr]";
  const HERO_W = "w-[560px]";
  const HERO_H = "h-[420px]";

  return (
    <>
      {/* Mesh gradient phủ nhẹ để có chiều sâu */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 opacity-90
          [background-image:radial-gradient(58rem_36rem_at_-10%_20%,rgba(56,189,248,0.20),transparent_60%),radial-gradient(46rem_28rem_at_110%_10%,rgba(147,51,234,0.16),transparent_60%),radial-gradient(40rem_28rem_at_50%_110%,rgba(59,130,246,0.12),transparent_60%)]
          bg-no-repeat bg-[length:auto] bg-[position:0_0,100%_0,50%_100%]
        "
      />

      {/* ===== MAIN WRAPPER ===== */}
      <div
        className={`relative z-10 mx-auto ${WRAPPER_W} h-screen grid ${GRID_COLS} items-center`}
      >
        {/* ==== LEFT COLUMN — Text & CTAs ==== */}
        <div className="-translate-x-[20px]">
          {/* Badge “đang hoạt động” */}
          <div
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold mb-4
                       bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-100"
          >
            <span className="w-2 h-2 bg-violet-500 rounded-full mr-2 animate-pulse" />
            Hệ thống QLĐK đề tài NCKH
          </div>

          {/* Title + gradient nhấn “ResearchHub” */}
          <h1 className="font-extrabold tracking-tight text-[44px] leading-[52px] mb-3">
            HUSC{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-400 bg-clip-text text-transparent">
              ResearchHub
            </span>
          </h1>

          {/* Subtitle dành cho GV */}
          <p className="text-[16px] leading-[26px] text-neutral-700 mb-8">
            Quản lý đăng ký đề tài NCKH sinh viên, theo dõi tiến độ, phản hồi
            hồ sơ và công bố thông báo một cách tập trung. Giao diện gọn, thao
            tác nhanh, phù hợp quy trình của khoa.
          </p>

          {/* CTAs chính cho vai trò giảng viên */}
          <div className="flex items-center gap-3">
            <a
              href="/teacher/mytopic"
              className="inline-flex items-center justify-center h-10 px-5 rounded-md
                         bg-violet-700 text-white font-semibold hover:bg-violet-800 active:bg-violet-900 transition"
            >
              Duyệt đăng ký
            </a>
            <a
              href="/teacher/announcements"
              className="inline-flex items-center justify-center h-10 px-5 rounded-md
                         border border-neutral-300 bg-white text-neutral-800 font-medium
                         hover:bg-neutral-50 active:bg-neutral-100 transition"
            >
              Xem thông báo
            </a>
          </div>
        </div>

        {/* ==== RIGHT COLUMN — Hero image + subtle glow ==== */}
        <div className="relative">
          {/* Glow sau ảnh cho cảm giác nổi khối */}
          <div
            aria-hidden
            className="
              pointer-events-none absolute
              right-[10px] bottom-[0px]
              w-[520px] h-[520px]
              rounded-full blur-3xl
              bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.26),rgba(59,130,246,0.0)_60%)]
            "
          />
          {/* Khung ảnh cố định kích thước (không responsive) */}
          <div className={`relative ${HERO_W} ${HERO_H}`}>
            <Image
              src={"/images/husc_scientific_research.png"}
              alt="Minh hoạ bảng điều khiển giảng viên duyệt đề tài NCKH"
              fill
              sizes="560px"
              priority
              className="object-contain drop-shadow-[0_16px_44px_rgba(0,0,0,0.28)] select-none pointer-events-none"
            />
          </div>
        </div>
      </div>
    </>
  );
}
