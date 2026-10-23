"use client";

import React, { Suspense, useState, useRef, useEffect } from "react";
import { Bell, Search, Menu, Ticket, CreditCard, Building2, Check, ExternalLink, CornerDownLeft, LayoutDashboard, FileText, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/context/DataContext";
import { cn } from "@/lib/utils";

type SearchResultItem = {
  id: string | number;
  title: string;
  subtitle: string;
  category: "companies" | "pages" | "invoices" | "tickets";
  href: string;
};

function SearchInput() {
  const { t, locale, dir } = useLanguage();
  const isAr = locale === "ar";
  const router = useRouter();
  const { companies, invoices, tickets } = useData();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Global listener for Ctrl+K / ⌘K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setShowResults(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Run search filter across context logs
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const term = query.toLowerCase();
    const matches: SearchResultItem[] = [];

    // 1. Search Companies
    companies.forEach(c => {
      const name = isAr ? c.name : c.nameEn;
      const owner = isAr ? c.owner : c.ownerEn;
      if (name.toLowerCase().includes(term) || owner.toLowerCase().includes(term) || c.email.toLowerCase().includes(term)) {
        matches.push({
          id: c.id,
          title: name,
          subtitle: `${t("owner")}: ${owner} · ${c.email}`,
          category: "companies",
          href: `/dashboard/companies/${c.id}`
        });
      }
    });

    // 2. Search Invoices
    invoices.forEach(inv => {
      const company = isAr ? inv.company : inv.companyEn;
      if (inv.id.toLowerCase().includes(term) || company.toLowerCase().includes(term)) {
        matches.push({
          id: inv.id,
          title: inv.id,
          subtitle: `${isAr ? "فاتورة لشركة" : "Invoice for"} ${company} · ${inv.total} SAR`,
          category: "invoices",
          href: `/dashboard/invoices`
        });
      }
    });

    // 3. Search Tickets
    tickets.forEach(tk => {
      const subject = isAr ? tk.subject : tk.subjectEn;
      const company = isAr ? tk.company : tk.companyEn;
      if (tk.id.toLowerCase().includes(term) || subject.toLowerCase().includes(term) || company.toLowerCase().includes(term)) {
        matches.push({
          id: tk.id,
          title: subject,
          subtitle: `${tk.id} · ${company} · ${tk.priority.toUpperCase()}`,
          category: "tickets",
          href: `/dashboard/tickets`
        });
      }
    });

    // 4. Search Static Pages
    const pages = [
      { path: "/dashboard", label: t("dashboard"), labelEn: "Dashboard" },
      { path: "/dashboard/companies", label: t("companies"), labelEn: "Companies" },
      { path: "/dashboard/plans", label: t("plans"), labelEn: "Plans" },
      { path: "/dashboard/subscriptions", label: t("subscriptions"), labelEn: "Subscriptions" },
      { path: "/dashboard/payments", label: t("payments"), labelEn: "Payments" },
      { path: "/dashboard/invoices", label: t("invoices"), labelEn: "Invoices" },
      { path: "/dashboard/users", label: t("adminUsers"), labelEn: "Admin Users" },
      { path: "/dashboard/roles", label: t("roles"), labelEn: "Roles & Permissions" },
      { path: "/dashboard/domains", label: t("domains"), labelEn: "Domains" },
      { path: "/dashboard/reports", label: t("reports"), labelEn: "Reports" },
      { path: "/dashboard/backups", label: t("backups"), labelEn: "Backups" },
      { path: "/dashboard/audit-logs", label: t("auditLogs"), labelEn: "Audit Logs" },
      { path: "/dashboard/tickets", label: t("tickets"), labelEn: "Tickets" },
      { path: "/dashboard/cms", label: t("cms"), labelEn: "CMS" },
      { path: "/dashboard/branding", label: t("branding"), labelEn: "Branding" },
      { path: "/dashboard/settings", label: t("settings"), labelEn: "General Settings" },
      { path: "/dashboard/profile", label: t("profile"), labelEn: "Profile" }
    ];

    pages.forEach(p => {
      const matchLabel = isAr ? p.label : p.labelEn;
      if (matchLabel.toLowerCase().includes(term) || p.path.includes(term)) {
        matches.push({
          id: p.path,
          title: matchLabel,
          subtitle: p.path,
          category: "pages",
          href: p.path
        });
      }
    });

    setResults(matches);
    setSelectedIndex(0);
  }, [query, companies, invoices, tickets, isAr, t]);

  // Click outside listener to auto-close popup dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: SearchResultItem) => {
    setQuery("");
    setShowResults(false);
    router.push(item.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setShowResults(false);
      inputRef.current?.blur();
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category === "companies") return <Building2 className="w-4 h-4 text-emerald-500" />;
    if (category === "invoices") return <FileText className="w-4 h-4 text-blue-500" />;
    if (category === "tickets") return <Ticket className="w-4 h-4 text-red-500" />;
    return <LayoutDashboard className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div 
      ref={containerRef}
      className="relative hidden md:block flex-1 max-w-md"
      onKeyDown={handleKeyDown}
    >
      <Search className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" style={{ [dir === "rtl" ? "right" : "left"]: 14 }} />
      <input
        ref={inputRef}
        type="text"
        placeholder={isAr ? "ابحث عن أي شيء (⌘K)..." : "Search everything (⌘K)..."}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
        className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 cursor-text"
        style={{ paddingInlineStart: 40, paddingInlineEnd: 48 }}
      />
      
      {query && (
        <button 
          onClick={() => {
            setQuery("");
            setResults([]);
          }}
          className="absolute top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-200 text-slate-400 cursor-pointer"
          style={{ [dir === "rtl" ? "left" : "right"]: 36 }}
        >
          <X className="w-3 h-3" />
        </button>
      )}

      <span className="absolute top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono border border-slate-200 bg-white px-1.5 py-0.5 rounded-lg shadow-2xs select-none" style={{ [dir === "rtl" ? "left" : "right"]: 12 }}>
        ⌘K
      </span>

      {/* Floating search results card */}
      {showResults && query.trim() && (
        <div 
          className={cn(
            "absolute top-12 z-55 w-full bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[350px] overflow-y-auto"
          )}
        >
          {results.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {results.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "p-3 flex items-center justify-between transition-colors cursor-pointer text-start",
                    idx === selectedIndex ? "bg-slate-50 text-slate-900 font-medium" : "text-slate-700 hover:bg-slate-50/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{item.title}</p>
                      <p className="text-[10px] text-slate-450 truncate font-semibold mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] uppercase font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                      {item.category === "companies" ? (isAr ? "شركة" : "Company") :
                       item.category === "invoices" ? (isAr ? "فاتورة" : "Invoice") :
                       item.category === "tickets" ? (isAr ? "تذكرة" : "Ticket") :
                       (isAr ? "صفحة" : "Page")}
                    </span>
                    {idx === selectedIndex && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 font-medium">
              {isAr ? "لا توجد نتائج مطابقة لبحثك." : "No matching results found."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Header({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale, setLocale } = useLanguage();

  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock list of active notification alerts
  const mockNotifications = [
    { id: 1, type: "ticket", title: "تذكرة دعم فني جديدة", titleEn: "New support ticket TKT-1032", company: "معهد الشرق", companyEn: "East Institute", time: "5m", read: false },
    { id: 2, type: "payment", title: "عملية دفع ناجحة", titleEn: "Payment success PMT-4029", company: "عقارات الرياض", companyEn: "Riyadh Real Estate", time: "1h", read: false },
    { id: 3, type: "company", title: "شركة جديدة مسجلة", titleEn: "New company registration", company: "تسويق الخليج", companyEn: "Gulf Marketing", time: "3h", read: true }
  ];

  const titles: Record<string, string> = {
    "/dashboard": t("dashboard"),
    "/dashboard/companies": t("companies"),
    "/dashboard/plans": t("plans"),
    "/dashboard/subscriptions": t("subscriptions"),
    "/dashboard/payments": t("payments"),
    "/dashboard/invoices": t("invoices"),
    "/dashboard/users": t("adminUsers"),
    "/dashboard/roles": t("roles"),
    "/dashboard/domains": t("domains"),
    "/dashboard/reports": t("reports"),
    "/dashboard/backups": t("backups"),
    "/dashboard/audit-logs": t("auditLogs"),
    "/dashboard/tickets": t("tickets"),
    "/dashboard/cms": t("cms"),
    "/dashboard/branding": t("branding"),
    "/dashboard/settings": t("settings"),
    "/dashboard/profile": t("profile"),
  };

  const title = titles[pathname] || t("dashboard");

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 select-none">
      <div className="flex items-center gap-3 flex-1">
        {/* Toggle Sidebar Button - Visible on both desktop & mobile */}
        <button 
          onClick={onOpenSidebar}
          className="p-2 -ms-2 rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer active:scale-95 transition-all"
          title={locale === "ar" ? "إخفاء/إظهار القائمة" : "Toggle Sidebar"}
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>

        <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">{title}</h1>
        <Suspense fallback={<div className="w-full max-w-md h-10 bg-slate-50 rounded-xl animate-pulse" />}>
          <SearchInput />
        </Suspense>
      </div>

      <div className="flex items-center gap-2 sm:gap-3.5 relative">
        {/* Language Switcher */}
        <button
          type="button"
          onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
          className="px-2.5 sm:px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-[11px] sm:text-xs font-semibold rounded-xl transition-all text-slate-600 flex items-center gap-1.5 shadow-2xs hover:text-slate-800 cursor-pointer"
        >
          <span>{locale === "ar" ? "English" : "العربية"}</span>
        </button>

        {/* Notification Bell Trigger */}
        <div ref={dropdownRef} className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "relative p-2 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-100 cursor-pointer",
              showNotifications && "bg-slate-100 border-slate-100"
            )}
            title={locale === "ar" ? "الإشعارات" : "Notifications"}
          >
            <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-600" />
            {hasUnread && (
              <span className="absolute top-1.5 end-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {showNotifications && (
            <div 
              className={cn(
                "absolute top-12 z-55 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-3 duration-200",
                locale === "ar" ? "left-0 origin-top-left" : "right-0 origin-top-right"
              )}
            >
              {/* Dropdown Header */}
              <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                <span className="font-bold text-xs text-slate-800">{locale === "ar" ? "آخر التنبيهات" : "System Alerts"}</span>
                {hasUnread && (
                  <button 
                    onClick={() => setHasUnread(false)}
                    className="text-[10px] text-blue-650 hover:text-blue-800 font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    {locale === "ar" ? "تحديد كقروء" : "Mark read"}
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                {mockNotifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={cn(
                      "p-3.5 flex gap-3 transition-colors hover:bg-slate-50/50 cursor-pointer",
                      !notif.read && hasUnread && "bg-blue-50/20"
                    )}
                    onClick={() => {
                      setShowNotifications(false);
                      if (notif.type === "ticket") router.push("/dashboard/tickets");
                      if (notif.type === "payment") router.push("/dashboard/payments");
                      if (notif.type === "company") router.push("/dashboard/companies");
                    }}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center border shrink-0",
                      notif.type === "ticket" ? "bg-red-50 border-red-100 text-red-500" :
                      notif.type === "payment" ? "bg-emerald-50 border-emerald-100 text-emerald-500" :
                      "bg-blue-50 border-blue-100 text-blue-500"
                    )}>
                      {notif.type === "ticket" && <Ticket className="w-4 h-4" />}
                      {notif.type === "payment" && <CreditCard className="w-4 h-4" />}
                      {notif.type === "company" && <Building2 className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0 text-start">
                      <div className="flex justify-between items-baseline">
                        <p className={cn(
                          "text-xs truncate",
                          !notif.read && hasUnread ? "font-bold text-slate-800" : "font-medium text-slate-600"
                        )}>
                          {locale === "ar" ? notif.title : notif.titleEn}
                        </p>
                        <span className="text-[9px] text-slate-400 font-mono">{notif.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate font-semibold">
                        {locale === "ar" ? `الشركة: ${notif.company}` : `Company: ${notif.companyEn}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Actions */}
              <div 
                onClick={() => {
                  setShowNotifications(false);
                  router.push("/dashboard/notifications");
                }}
                className="px-4 py-2 text-center text-[10px] font-bold text-slate-500 hover:text-[var(--primary)] border-t border-slate-100 bg-slate-50/50 flex justify-center items-center gap-1 cursor-pointer transition-colors"
              >
                {locale === "ar" ? "عرض كافة الإشعارات والتحليلات" : "View system notification panel"}
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
