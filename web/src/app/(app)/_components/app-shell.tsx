"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  BarChart3,
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  FileUp,
  FolderKanban,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LayoutGrid,
  Library,
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
import { ModeToggle } from "@/components/mode-toggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
    href: "/groups",
    label: "Meu Grupo",
    description: "Gestão e indicadores do seu grupo",
    permission: "dept_manager:access", // Custom permission for the nav item logic
    icon: LayoutGrid,
  },
  {
    href: "/departments",
    label: "Grupos de Pesquisa",
    description: "Gerenciamento institucional de grupos",
    permission: "departments:manage",
    icon: Library,
  },
  {
    href: "/projects",
    label: labels.nav.projects,
    description: labels.shell.descriptions.projects,
    permission: "projects:read",
    icon: FolderKanban,
  },
  {
    href: "/submissions",
    label: labels.submission.title,
    description: "Submissão e aprovação interna",
    permission: "submissions:read",
    icon: FileUp,
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

  // Map of permissions to roles for Group access restriction
  // This is a UI-level filter as requested: restricted to cp_manager, maua_manager, and admin.
  // We use the email/JWT claims to check role if possible, or rely on specific manage permissions.
  const visibleItems = ITEMS.filter((item) => {
    if (item.permission === null) return true;
    
    // Explicit restriction for Groups-related tabs as requested
    if (item.href === "/groups" || item.href === "/departments") {
      // These should only be visible for managers/admins. 
      // We check if the user has 'departments:manage' which is held by admin and dept_manager,
      // but the user specifically asked for cp_manager, maua_manager, and admin.
      // Since RLS gates the data, we'll filter the UI here.
      return granted.has("departments:read") && (
        granted.has("users:manage") || // admin
        granted.has("submissions:approve") // managers typically have this
      );
    }

    return granted.has(item.permission);
  });

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

            <div className="ml-auto flex items-center gap-3">
              <Dialog>
                <DialogTrigger render={
                  <Button variant="ghost" size="icon-sm" aria-label="Ajuda" title="Ajuda">
                    <HelpCircle className="size-5" />
                  </Button>
                } />
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Manual do Usuário - SGPPF</DialogTitle>
                    <DialogDescription>
                      Guia passo a passo para utilizar as principais funcionalidades do sistema.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <section className="space-y-3">
                      <h4 className="text-sm font-semibold border-b pb-1">1. Gestão de Perfil e Pesquisadores</h4>
                      <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-2">
                        <li>Acesse <span className="text-foreground font-medium">Pesquisadores</span> para visualizar ou editar seu perfil.</li>
                        <li>Certifique-se de preencher o <span className="text-foreground font-medium">Lattes</span>, <span className="text-foreground font-medium">ORCID</span> e carregar seu <span className="text-foreground font-medium">Currículo (PDF)</span>.</li>
                        <li>Administradores podem desativar pesquisadores ou alterar papéis na aba <span className="text-foreground font-medium">Administração</span>.</li>
                      </ol>
                    </section>

                    <section className="space-y-3">
                      <h4 className="text-sm font-semibold border-b pb-1">2. Fluxo de Submissão de Projetos</h4>
                      <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-2">
                        <li>Vá em <span className="text-foreground font-medium">Submissões</span> e clique em "Novo".</li>
                        <li>Preencha os dados básicos, resumo e metodologia. Você pode salvar como <span className="text-foreground font-medium">Rascunho</span> para continuar depois.</li>
                        <li>Adicione os membros da equipe e anexe a proposta completa em PDF.</li>
                        <li>Clique em <span className="text-foreground font-medium">Submeter</span> para iniciar o fluxo de aprovação (Departamento → CP → Mauá).</li>
                      </ol>
                    </section>

                    <section className="space-y-3">
                      <h4 className="text-sm font-semibold border-b pb-1">3. Projetos e Financiamentos</h4>
                      <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-2">
                        <li>Propostas aprovadas tornam-se <span className="text-foreground font-medium">Projetos</span> automaticamente.</li>
                        <li>Na página do projeto, você pode gerenciar a carga horária dos membros e registrar <span className="text-foreground font-medium">Financiamentos</span> (bolsas, auxílios, etc).</li>
                        <li>Mantenha o status do projeto atualizado (Em andamento, Concluído, etc).</li>
                      </ol>
                    </section>

                    <section className="space-y-3">
                      <h4 className="text-sm font-semibold border-b pb-1">4. Publicações e Produção Acadêmica</h4>
                      <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-2">
                        <li>Para cadastrar uma publicação, use a opção <span className="text-foreground font-medium">Importar por DOI</span>.</li>
                        <li>O sistema buscará automaticamente o título, autores, ano e contagem de citações.</li>
                        <li>Verifique as informações e anexe o PDF da publicação (se permitido) para consulta interna.</li>
                      </ol>
                    </section>

                    <section className="space-y-3">
                      <h4 className="text-sm font-semibold border-b pb-1">5. Exportação e Relatórios</h4>
                      <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-2">
                        <li>Em cada listagem (Projetos, Publicações, etc), utilize o botão <span className="text-foreground font-medium">Exportar CSV</span> para baixar os dados filtrados.</li>
                        <li>O <span className="text-foreground font-medium">Dashboard</span> oferece uma visão consolidada de KPIs e gráficos para análise gerencial.</li>
                      </ol>
                    </section>

                    <div className="pt-4 border-t">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Desenvolvedores</h4>
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <span className="text-sm font-medium">Felipe Fazio</span>
                        <span className="text-sm font-medium">João Vitor Sesma</span>
                        <span className="text-sm font-medium">Ruy Monteiro</span>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <ModeToggle />
              <div className="hidden items-center gap-3 sm:flex lg:hidden">
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
          </div>
        </header>

        <main className="mx-auto w-full max-w-[100rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
