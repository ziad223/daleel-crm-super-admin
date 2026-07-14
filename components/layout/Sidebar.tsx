"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building2, Package, CreditCard, FileText,
  Users, Shield, Globe, Sparkles, BarChart3, Database,
  ClipboardList, Ticket, Bell, FileEdit, Palette, Settings,
  Key, User, LogOut, X, PackagePlus, Tag, Activity, Receipt
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

type SidebarProps = {
  mobileOpen: boolean;
  desktopCollapsed: boolean;
  onClose: () => void;
};

export default function Sidebar({ mobileOpen, desktopCollapsed, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t, locale } = useLanguage();

  const menu = [
    { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/dashboard/companies", label: t("companies"), icon: Building2 },
    { href: "/dashboard/plans", label: t("plans"), icon: Package },
    { href: "/dashboard/subscriptions", label: t("subscriptions"), icon: CreditCard },
    { href: "/dashboard/addons", label: t("addons" as any), icon: PackagePlus },
    { href: "/dashboard/coupons", label: t("coupons" as any), icon: Tag },
    { href: "/dashboard/payments", label: t("payments"), icon: CreditCard },
    { href: "/dashboard/invoices", label: t("invoices"), icon: FileText },
    { href: "/dashboard/users", label: t("adminUsers"), icon: Users },
    { href: "/dashboard/affiliates", label: t("affiliates" as any), icon: Users },
    { href: "/dashboard/roles", label: t("roles"), icon: Shield },
    { href: "/dashboard/domains", label: t("domains"), icon: Globe },
    { href: "/dashboard/ai-settings", label: t("aiSettings"), icon: Sparkles },
    { href: "/dashboard/reports", label: t("reports"), icon: BarChart3 },
    { href: "/dashboard/system-health", label: t("systemHealth" as any), icon: Activity },
    { href: "/dashboard/security", label: t("security" as any), icon: Shield },
    { href: "/dashboard/backups", label: t("backups"), icon: Database },
    { href: "/dashboard/audit-logs", label: t("auditLogs"), icon: ClipboardList },
    { href: "/dashboard/tickets", label: t("tickets"), icon: Ticket },
    { href: "/dashboard/notifications", label: t("notifications"), icon: Bell },
    { href: "/dashboard/cms", label: t("cms"), icon: FileEdit },
    { href: "/dashboard/branding", label: t("branding"), icon: Palette },
    { href: "/dashboard/api", label: t("apiIntegrations"), icon: Key },
    { href: "/dashboard/settings/billing", label: t("billing" as any), icon: Receipt },
    { href: "/dashboard/settings", label: t("settings"), icon: Settings },
    { href: "/dashboard/profile", label: t("profile"), icon: User },
  ];

  return (
    <>
      {/* Mobile Drawer backdrop overlay */}
      {mobileOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden cursor-pointer"
        />
      )}

      <aside 
        className={cn(
          "fixed top-0 z-50 h-screen w-[260px] bg-[var(--sidebar)] text-white flex flex-col transition-transform duration-300 ease-in-out lg:z-40",
          locale === "ar"
            ? cn(
                "right-0",
                mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
                desktopCollapsed ? "lg:translate-x-full" : "lg:translate-x-0"
              )
            : cn(
                "left-0",
                mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                desktopCollapsed ? "lg:-translate-x-full" : "lg:translate-x-0"
              )
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-500/30 border border-emerald-400">
              د
            </div>
            <div>
              <div className="font-bold text-[15px] tracking-tight">{t("platformName")}</div>
              <div className="text-[10px] text-emerald-400 font-medium tracking-wider">SUPER ADMIN</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg lg:hidden cursor-pointer">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {menu.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={cn("sidebar-link cursor-pointer", isActive && "active")}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400">
              أ
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">أحمد الراشد</div>
              <div className="text-[10px] text-slate-500">{t("superAdmin")}</div>
            </div>
            <button className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer">
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
