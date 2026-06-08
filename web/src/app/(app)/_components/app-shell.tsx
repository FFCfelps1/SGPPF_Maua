"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  BarChart3,
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { labels } from "@/lib/labels";
import { signOut } from "@/app/(auth)/_actions";

const ITEMS = [
  {
    href: "/dashboard",
    label: labels.nav.dashboard,
    description: labels.shell.descriptions.dashboard,
    permission: null,
    icon: LayoutDashboard,
  },
  {
    href: "/researchers",
    label: labels.nav.researchers,
    description: labels.shell.descriptions.researchers,
    permission: "researchers:read",
    icon: Users,
  },
  {
    href: "/projects",
    label: labels.nav.projects,
    description: labels.shell.descriptions.projects,
    permission: "projects:read",
    icon: FolderKanban,
  },
  {
    href: "/publications",
    label: labels.nav.publications,
    description: labels.shell.descriptions.publications,
    permission: "publications:read",
    icon: BookOpenText,
  },
  {
    href: "/advisings",
    label: labels.nav.advisings,
    description: labels.shell.descriptions.advisings,
    permission: "advisings:read",
    icon: GraduationCap,
  },
  {
    href: "/admin",
    label: labels.nav.admin,
    description: labels.shell.descriptions.admin,
    permission: "users:manage",
    icon: Settings,
  },
] as const;

function currentItem(pathname: string) {
  return (
    ITEMS.find(
      (item) =>
        pathname === item.href || pathname.startsWith(`${item.href}/`),
    ) ?? ITEMS[0]
  );
}

function initials(email: string) {
  const name = email.split("@")[0] ?? "";
  return name
    .split(/[._-]/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AppShell({
  children,
  permissions,
  email,
}: {
  children: ReactNode;
  permissions: string[];
  email: string;
}) {
  const pathname = usePathname();
  const activeItem = currentItem(pathname);
  const granted = new Set(permissions);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = ITEMS.filter(
    (item) => item.permission === null || granted.has(item.permission),
  );

  const sidebar = (
    <aside className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-20 items-center border-b border-sidebar-border px-2">
        <Link
          href="/dashboard"
          className="flex min-w-0 items-center gap-2"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex shrink-0 items-center">
            <img src="/logo_maua.svg" alt="Mauá" className="h-10 w-17" />
          </div>
          <span
            className={cn(
              "min-w-0 transition-opacity lg:hidden xl:block",
              collapsed && "xl:hidden",
            )}
          >
            <span className="block truncate text-sm font-semibold">
              {labels.app.name}
            </span>
            <span className="block truncate text-xs text-sidebar-foreground/60">
            {labels.shell.institution}
            </span>
          </span>
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="ml-auto lg:hidden"
          aria-label={labels.shell.closeNavigation}
          onClick={() => setMobileOpen(false)}
        >
          <X />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p
          className={cn(
            "mb-2 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45 lg:hidden xl:block",
            collapsed && "xl:hidden",
          )}
        >
          {labels.shell.management}
        </p>
        <nav className="space-y-1" aria-label="Navegação principal">
          {visibleItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                aria-current={active ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-5 shrink-0" strokeWidth={1.8} />
                <span
                  className={cn(
                    "min-w-0 lg:hidden xl:block",
                    collapsed && "xl:hidden",
                  )}
                >
                  <span className="block truncate font-medium">{item.label}</span>
                  <span
                    className={cn(
                      "block truncate text-xs",
                      active
                        ? "text-sidebar-primary-foreground/70"
                        : "text-sidebar-foreground/45",
                    )}
                  >
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/70 p-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-background text-xs font-semibold text-primary shadow-sm">
            {initials(email) || "IM"}
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 lg:hidden xl:block",
              collapsed && "xl:hidden",
            )}
          >
            <span className="block truncate text-xs font-medium">{email}</span>
            <span className="block text-[0.68rem] text-sidebar-foreground/50">
              {labels.shell.account}
            </span>
          </span>
          <form action={signOut}>
            <Button
              type="submit"
              variant="ghost"
              size="icon-sm"
              aria-label={labels.nav.signOut}
              title={labels.nav.signOut}
            >
              <LogOut />
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );

  return (
    <div
      className={cn(
        "min-h-svh bg-muted/30 lg:grid",
        collapsed
          ? "lg:grid-cols-[5.25rem_minmax(0,1fr)]"
          : "lg:grid-cols-[5.25rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]",
      )}
    >
      <div className="sticky top-0 hidden h-svh border-r border-sidebar-border lg:block">
        {sidebar}
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/35 backdrop-blur-sm"
            aria-label={labels.shell.closeNavigation}
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-[min(19rem,86vw)] shadow-2xl">
            {sidebar}
          </div>
        </div>
      ) : null}

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl">
          <div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label={labels.shell.openNavigation}
              onClick={() => setMobileOpen(true)}
            >
              <Menu />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="hidden lg:inline-flex"
              aria-label={
                collapsed
                  ? labels.shell.expandNavigation
                  : labels.shell.collapseNavigation
              }
              onClick={() => setCollapsed((value) => !value)}
            >
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                <BarChart3 className="size-3.5 text-primary" />
                SGPPF
              </div>
              <p className="truncate text-lg font-semibold tracking-tight">
                {activeItem.label}
              </p>
            </div>

            <div className="ml-auto hidden items-center gap-3 sm:flex lg:hidden">
              <span className="max-w-52 truncate text-sm text-muted-foreground">
                {email}
              </span>
              <form action={signOut}>
                <Button type="submit" variant="outline" size="sm">
                  <LogOut />
                  {labels.nav.signOut}
                </Button>
              </form>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[100rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
