"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Library, Search, CalendarDays, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard",          label: "Home",       icon: LayoutDashboard },
  { href: "/collection",         label: "Collezione", icon: Library },
  { href: "/search",             label: "Cerca",      icon: Search },
  { href: "/upcoming",           label: "In uscita",  icon: CalendarDays },
  { href: "/profile",            label: "Profilo",    icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border-default bg-bg-surface/95 backdrop-blur-md">
      <div className="flex items-stretch h-16 safe-area-pb">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-150 cursor-pointer"
              aria-label={label}
            >
              <Icon
                className={cn(
                  "size-5 transition-colors duration-150",
                  active ? "text-indigo-400" : "text-text-tertiary"
                )}
                strokeWidth={active ? 2 : 1.5}
              />
              <span className={cn(
                "text-[10px] font-medium tracking-wide transition-colors duration-150",
                active ? "text-indigo-400" : "text-text-tertiary"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
