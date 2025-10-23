"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: signIn("credentials", { username: id, password: pw, redirect: true })
  }
  
  return (
    
    <div className="relative min-h-screen min-w-[1280px] overflow-hidden bg-neutral-50">
      {/* LAYER 1 — Mesh gradient */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 opacity-90
          [background-image:radial-gradient(60rem_40rem_at_-10%_20%,rgba(56,189,248,0.28),transparent_60%),radial-gradient(50rem_30rem_at_110%_10%,rgba(147,51,234,0.22),transparent_60%),radial-gradient(40rem_30rem_at_50%_110%,rgba(59,130,246,0.18),transparent_60%)]
          bg-no-repeat bg-[length:auto] bg-[position:0_0,100%_0,50%_100%]
        "
      />

      {/* LAYER 2 — Noise pattern nhẹ */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "url('/images/background_noise.png')",
          backgroundSize: "300px 300px",
        }}
      />

      {/* KHỐI CHÍNH: 2 cột cố định, trái (login) – phải (hero) */}
      <div className="relative z-10 mx-auto w-[1240px] h-screen grid grid-cols-[560px_1fr] items-center gap-[60px]">
        {/* CỘT TRÁI — Logo + Form */}
        <div className="flex flex-col items-start">
          {/* Logo + tiêu đề */}
          <div className="flex flex-row items-center mb-10 gap-5">
            <div className="bg-white rounded-3xl shadow-lg p-4 flex items-center justify-center">
              <Image src="/icons/logo.png" alt="Logo" width={64} height={64} priority />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent font-extrabold text-[32px] leading-[36px] mb-1 tracking-tight drop-shadow">
                HUSC ResearchHub
              </h1>
              <p className="text-neutral-700 text-[15px] font-medium leading-[22px]">
                Đơn giản, nhanh chóng, tiện lợi
              </p>
            </div>
          </div>

          {/* Form đăng nhập */}
          <div className="w-[560px] bg-white/95 backdrop-blur-[2px] rounded-2xl shadow-2xl p-10 border border-white/60">
            <h2 className="text-[20px] font-semibold text-center mb-7">
              Truy cập hệ thống
            </h2>

            <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
              {/* Tên đăng nhập */}
              <div className="flex flex-col gap-2">
                <label htmlFor="loginId" className="text-[14px] font-medium text-neutral-800">
                  Tên đăng nhập
                </label>
                <input
                  id="loginId"
                  type="text"
                  placeholder="23t1020573"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="h-10 px-4 rounded-md border border-neutral-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  autoComplete="username"
                  aria-label="Tên đăng nhập"
                  required
                />
              </div>

              {/* Mật khẩu */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-[14px] font-medium text-neutral-800">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="**********"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="h-10 px-4 rounded-md border border-neutral-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  autoComplete="current-password"
                  aria-label="Mật khẩu"
                  required
                />
              </div>

              {/* Quên mật khẩu */}
              <div className="flex items-center justify-between">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="text-blue-700 hover:underline text-[13px] font-semibold"
                    >
                      Quên mật khẩu?
                    </button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className="w-[520px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bạn quên mật khẩu?</AlertDialogTitle>
                      <AlertDialogDescription className="text-neutral-700">
                        Vui lòng liên hệ{" "}
                        <span className="font-semibold">
                          Phòng Khoa học, Công nghệ và Hợp tác Quốc tế
                        </span>{" "}
                        – Trường Đại học Khoa học, Đại học Huế để được hỗ trợ đổi mật khẩu.
                        <br />
                        <br />
                        Email:{" "}
                        <a href="mailto:khcndhkh@hueuni.edu.vn" className="text-blue-700 font-medium">
                          khcndhkh@hueuni.edu.vn
                        </a>
                        <br />
                        Điện thoại: (0234) 3828427
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction>Đã hiểu</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* <label className="flex items-center gap-2 text-[13px] text-neutral-700">
                  <input type="checkbox" className="size-4" /> Ghi nhớ đăng nhập
                </label> */}
              </div>

              <button
                type="submit"
                className="h-10 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 active:bg-blue-900 transition"
              >
                Đăng nhập
              </button>
            </form>
          </div>
        </div>

        {/* CỘT PHẢI — Ảnh hero + glow */}
        <div className="relative h-[820px]">
          {/* Glow phía sau ảnh */}
          <div
            aria-hidden
            className="
              pointer-events-none absolute
              right-[20px] bottom-[40px]
              w-[720px] h-[720px]
              rounded-full blur-3xl
              bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.35),rgba(59,130,246,0.0)_60%)]
            "
          />
          {/* Ảnh đã tách nền */}
          <div className="absolute right-0 bottom-0 w-[680px] h-[820px]">
            <Image
              src="/images/scientific_research.png"
              alt="HUSC ResearchHub Hero"
              fill
              sizes="680px"
              priority
              className="object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.35)] select-none pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
