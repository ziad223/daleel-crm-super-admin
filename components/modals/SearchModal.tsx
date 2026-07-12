"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/context/DataContext";
import { useRouter } from "next/navigation";
import { Search, X, Building2, CreditCard, Ticket, FileText, LayoutDashboard, CornerDownLeft } from "lucide-react";

type SearchResultItem = {
  id: string | number;
  title: string;
  subtitle: string;
  category: "companies" | "pages" | "invoices" | "tickets";
  href: string;
};

export default function SearchModal() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";
  const router = useRouter();

  const {
    showSearchModal,
    setShowSearchModal,
    companies,
    invoices,
    tickets
  } = useData();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global listener for Ctrl+K / ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowSearchModal(!showSearchModal);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSearchModal, setShowSearchModal]);

  // Focus input when modal opens
  useEffect(() => {
    if (showSearchModal) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [showSearchModal]);

  // Run search query
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

    // 4. Search Pages (Static titles)
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
      { path: "/dashboard/ai-settings", label: t("aiSettings"), labelEn: "AI Settings" },
      { path: "/dashboard/reports", label: t("reports"), labelEn: "Reports" },
      { path: "/dashboard/backups", label: t("backups"), labelEn: "Backups" },
      { path: "/dashboard/audit-logs", label: t("auditLogs"), labelEn: "Audit Logs" },
      { path: "/dashboard/tickets", label: t("tickets"), labelEn: "Tickets" },
      { path: "/dashboard/notifications", label: t("notifications"), labelEn: "Notifications" },
      { path: "/dashboard/cms", label: t("cms"), labelEn: "CMS" },
      { path: "/dashboard/branding", label: t("branding"), labelEn: "Branding" },
      { path: "/dashboard/api", label: t("apiIntegrations"), labelEn: "API & Integrations" },
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

  const handleSelect = (item: SearchResultItem) => {
    setShowSearchModal(false);
    router.push(item.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
      setShowSearchModal(false);
    }
  };

  if (!showSearchModal) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-xs p-4 pt-[15vh]"
      onClick={() => setShowSearchModal(false)}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100 flex flex-col max-h-[50vh] animate-in fade-in slide-in-from-top-4 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search header */}
        <div className="flex items-center gap-3 px-4 border-b border-slate-100 py-3.5 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder={isAr ? "ابحث عن أي شيء (شركات، فواتير، تذاكر، صفحات)..." : "Search companies, invoices, tickets, pages..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 text-sm focus:outline-none font-medium"
          />
          <span className="text-[10px] text-slate-400 font-semibold border border-slate-200 bg-white px-2 py-0.5 rounded-lg select-none uppercase shadow-3xs">
            ESC
          </span>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2">
          {results.length > 0 ? (
            <div className="space-y-1">
              {results.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={`${item.category}_${item.id}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-start flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                      isSelected ? "bg-slate-50 text-slate-900" : "text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        item.category === "companies" ? "bg-blue-50 text-blue-600" :
                        item.category === "invoices" ? "bg-emerald-50 text-emerald-600" :
                        item.category === "tickets" ? "bg-red-50 text-red-600" :
                        "bg-slate-100 text-slate-600"
                      }`}>
                        {item.category === "companies" && <Building2 className="w-4 h-4" />}
                        {item.category === "invoices" && <FileText className="w-4 h-4" />}
                        {item.category === "tickets" && <Ticket className="w-4 h-4" />}
                        {item.category === "pages" && <LayoutDashboard className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{item.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5 font-medium">{item.subtitle}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-150 px-1.5 py-0.5 rounded-md font-mono select-none">
                        {item.category}
                      </span>
                      {isSelected && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : query.trim() ? (
            <div className="text-center py-8 text-slate-400 text-sm font-medium">
              {isAr ? "لا توجد نتائج مطابقة لخيارات البحث" : "No matches found"}
            </div>
          ) : (
            <div className="text-slate-400 text-xs py-8 text-center font-medium leading-relaxed">
              <p>{isAr ? "اكتب للبدء في البحث السريع عن الموارد والشركات..." : "Start typing to search across CRM resources..."}</p>
              <p className="text-[10px] text-slate-300 mt-1">{isAr ? "استخدم مفاتيح الأسهم للتحرك و Enter للاختيار" : "Use arrow keys to navigate and Enter to select"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
