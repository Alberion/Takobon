"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/collection",         label: "Libreria" },
  { href: "/collection/wishlist", label: "Wishlist" },
  { href: "/collection/missing",  label: "Mancanti" },
];

export function CollectionTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 px-4 pt-5 pb-3">
      {tabs.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 text-center py-2 rounded-xl text-xs font-medium transition-all duration-150",
              active
                ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                : "text-text-tertiary hover:text-text-secondary border border-transparent"
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
