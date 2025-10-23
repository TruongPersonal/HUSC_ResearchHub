"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string };

export default function ManageSidebar({
  items,
  className,
}: {
  items: Item[];          // REQUIRED
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={[
        "w-[200px] sticky top-17 min-h-[calc(100vh-68px)] bg-white border-r border-gray-200",
        className ?? "",
      ].join(" ")}
    >
      <div className="">
        <nav aria-label="sidebar navigation">
          <ul className="space-y-1 py-5">
            {items.map(({ href, label }) => {
              const active =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href + "/"));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`block px-7 py-5 rounded-r-sm text-sm transition
                      focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                      ${active ? "bg-blue-950 text-white font-semibold" : "text-neutral-800 hover:bg-neutral-100"}`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
