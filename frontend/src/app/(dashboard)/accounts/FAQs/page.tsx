"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

/**
 * FAQsPage — Bản đơn giản, gọn, dễ đọc
 * - Desktop-only: min-width cố định, không breakpoint
 * - Accordion (shadcn): bấm từng mục là sổ ra
 * - Khối liên hệ: email + số điện thoại (click-to-call)
 */
export default function FAQsPage() {
  // Danh sách Q&A (có thể tách ra file JSON sau)
  const faqs = [
    {
      q: "Làm thế nào để đăng ký đề tài nghiên cứu khoa học?",
      a: "Đăng nhập hệ thống → mục “Đăng ký đề tài” → điền thông tin bắt buộc → gửi đăng ký.",
    },
    {
      q: "Tôi có thể chỉnh sửa thông tin sau khi đăng ký không?",
      a: "Có, trong THỜI GIAN MỞ ĐĂNG KÝ. Sau khi đề tài được duyệt chính thức, bạn không thể tự chỉnh sửa.",
    },
    {
      q: "Ai được phép đăng ký đề tài?",
      a: "Sinh viên Trường Đại học Khoa học, Đại học Huế có tài khoản hệ thống hợp lệ.",
    },
    {
      q: "Một nhóm tối đa bao nhiêu thành viên?",
      a: "Thường 3–5 thành viên/đề tài (tùy thông báo từng đợt). Vui lòng xem quy định cụ thể ở trang Thông báo.",
    },
    {
      q: "Có bắt buộc giảng viên hướng dẫn không?",
      a: "Có. Bạn chọn giảng viên hướng dẫn trong danh sách hoặc nhập thông tin theo mẫu nếu có hướng dẫn ngoài đơn vị.",
    },
    {
      q: "Theo dõi trạng thái xét duyệt ở đâu?",
      a: "Vào mục “Đề tài của tôi” → xem cột Trạng thái (Đã nộp / Đang duyệt / Cần bổ sung / Đã duyệt...).",
    },
    {
      q: "Thời hạn nộp và kết quả công bố khi nào?",
      a: "Thời hạn và lịch công bố được ghi trong Thông báo của từng đợt. Hãy kiểm tra trang Thông báo thường xuyên.",
    },
    {
      q: "Khi nào được cấp kinh phí/biên nhận?",
      a: "Sau khi đề tài được duyệt và hoàn tất thủ tục theo hướng dẫn. Liên hệ phòng chức năng để biết chi tiết.",
    },
  ];

  // Desktop-only constants
  const PAGE_MIN_W = "min-w-[1280px]";
  const WRAPPER_W = "w-[900px]";

  return (
    <div className={`relative min-h-screen ${PAGE_MIN_W} bg-white`}>
      <main
        className={`relative z-10 mx-auto py-14 ${WRAPPER_W} flex flex-col gap-8`}
      >
        {/* Tiêu đề */}
        <header className="text-center">
          <h1 className="text-[30px] leading-[36px] font-extrabold tracking-tight text-blue-700">
            Câu hỏi thường gặp (FAQ)
          </h1>
          <p className="mt-2 text-neutral-700">
            Những thắc mắc phổ biến khi dùng HUSC ResearchHub.
          </p>
        </header>

        {/* Danh sách FAQ — bấm từng mục để sổ */}
        <section className="bg-white rounded-2xl border border-neutral-200 shadow p-2">
          {/* Cho mở nhiều mục cùng lúc */}
          <Accordion type="multiple">
            {faqs.map((item, idx) => (
              <AccordionItem key={idx} value={`f-${idx}`} className="px-4">
                <AccordionTrigger className="text-left text-[15px] font-semibold text-blue-700">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-neutral-800">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Liên hệ nhanh */}
        <aside className="bg-white rounded-2xl border border-neutral-200 shadow p-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">
            Cần hỗ trợ trực tiếp?
          </h2>
          <p className="text-neutral-700 mb-4">
            Liên hệ{" "}
            <span className="font-semibold">
              Phòng Khoa học, Công nghệ và Hợp tác Quốc tế
            </span>{" "}
            – Trường Đại học Khoa học, Đại học Huế.
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
        </aside>
      </main>
    </div>
  );
}
