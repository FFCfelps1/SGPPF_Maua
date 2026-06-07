"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { labels } from "@/lib/labels";

// Each item is gated on a read permission (Dashboard is always visible). Resulting v1
// nav: admin sees all; researcher and consultant see all but Administração.
const ITEMS: { href: string; label: string; permission: string | null }[] = [
  { href: "/dashboard", label: labels.nav.dashboard, permission: null },
  { href: "/researchers", label: labels.nav.researchers, permission: "researchers:read" },
  { href: "/projects", label: labels.nav.projects, permission: "projects:read" },
  { href: "/publications", label: labels.nav.publications, permission: "publications:read" },
  { href: "/advisings", label: labels.nav.advisings, permission: "advisings:read" },
  { href: "/admin", label: labels.nav.admin, permission: "users:manage" },
];

export function AppNav({ permissions }: { permissions: string[] }) {
  const pathname = usePathname();
  const granted = new Set(permissions);

  return (
    <nav className="flex items-center gap-1">
      {ITEMS.filter(
        (item) => item.permission === null || granted.has(item.permission),
      ).map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              active
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
