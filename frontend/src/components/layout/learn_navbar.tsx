"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserMenu } from "./user_menu";
import { NavItem, pickActiveHref } from "@/lib/nav";

export default function LearnNavbar({
  brandHref = "/",
  items,
  theme = "student", // "student" | "teacher"
}: {
  brandHref?: string;
  items: NavItem[];
  theme?: "student" | "teacher";
}) {
  const pathname = usePathname();
  const activeHref = pickActiveHref(items, pathname);
  const palette =
    theme === "teacher"
      ? {
          active: "bg-purple-900 text-white font-semibold",
          inactive: "text-black hover:text-white hover:bg-purple-900",
        }
      : {
          active: "bg-blue-950 text-white font-semibold",
          inactive: "text-black hover:text-white hover:bg-blue-950",
        };

  return (
    <nav className="fixed container z-40 left-1/2 -translate-x-1/2 rounded-b-3xl shadow bg-white">
      <div className="flex items-center justify-between px-20 py-1">
        <div className="flex items-center">
          <Image
            src="/icons/logo.png"
            alt="Logo"
            width={60}
            height={60}
            priority
          />
        </div>
        <ul className="flex items-center gap-4">
          {items.map(({ href, label }) => {
            const isActive = href === activeHref;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`px-3 py-1 text-sm rounded transition ${
                    isActive ? palette.active : palette.inactive
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-4">
          <UserMenu
            role={theme === "teacher" ? "teacher" : "student"}
            displayName={
              theme === "student" ? "Ngô Quang Trường" : "Nguyễn Văn Trung"
            }
            username={theme === "student" ? "23t1020573" : "nvtrung"}
          />
        </div>
      </div>
    </nav>
  );
}
