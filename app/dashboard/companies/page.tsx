"use client";

import React, { Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, Search, Download, LogIn, MoreHorizontal, Building2, Filter } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/context/DataContext";
import { formatNumber } from "@/lib/utils";
import CompanyRowActions from "@/components/companies/CompanyRowActions";

function CompaniesContent() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";
  const { companies, setCompanies, setShowAddCompanyModal } = useData();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";

  const handleSearchChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const filtered = companies.filter(c => {
    const name = isAr ? c.name : c.nameEn;
    return name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (isAr ? c.owner : c.ownerEn).toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-4">
      {/* Mini Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="stat-card text-center py-4">
          <p className="text-2xl font-bold">{companies.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">{t("totalCompanies")}</p>
        </div>
        <div className="stat-card text-center py-4">
          <p className="text-2xl font-bold text-emerald-600">{companies.filter(c => c.status === "active").length}</p>
          <p className="text-xs text-slate-500 mt-0.5">{t("activeCompanies")}</p>
        </div>
        <div className="stat-card text-center py-4">
          <p className="text-2xl font-bold text-red-500">{companies.filter(c => c.status === "suspended").length}</p>
          <p className="text-xs text-slate-500 mt-0.5">{t("suspendedCompanies")}</p>
        </div>
        <div className="stat-card text-center py-4">
          <p className="text-2xl font-bold">{formatNumber(companies.reduce((s, c) => s + c.users, 0), locale)}</p>
          <p className="text-xs text-slate-500 mt-0.5">{t("totalUsers")}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" style={{ [isAr ? "right" : "left"]: 12 }} />
            <input
              type="text"
              placeholder={t("search")}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="input"
              style={{ paddingInlineStart: 36 }}
            />
          </div>
          <button className="btn-outline"><Filter className="w-4 h-4" /> {t("filter")}</button>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline cursor-pointer"><Download className="w-4 h-4" /> {t("export")}</button>
          <button onClick={() => setShowAddCompanyModal(true)} className="btn-accent cursor-pointer">
            <Plus className="w-4 h-4" /> {t("addCompany")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <div className="overflow-x-auto w-full">
          <table className="data-table min-w-max">
            <thead>
              <tr>
                <th>{t("companyName")}</th>
                <th>{t("owner")}</th>
                <th>{t("email")} / {t("phone")}</th>
                <th>{t("country")}</th>
                <th>{t("plan")}</th>
                <th>{t("users")}</th>
                <th>{t("leads")}</th>
                <th>{t("startDate")}</th>
                <th>{t("endDate")}</th>
                <th>{t("status")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link href={`/dashboard/companies/${c.id}`} className="flex items-center gap-2.5 hover:opacity-80">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-bold">{c.logo}</div>
                      <span className="font-medium text-sm text-blue-700">{isAr ? c.name : c.nameEn}</span>
                    </Link>
                  </td>
                  <td className="text-sm">{isAr ? c.owner : c.ownerEn}</td>
                  <td>
                    <div className="text-sm">{c.email}</div>
                    <div className="text-[11px] text-slate-400">{c.phone}</div>
                  </td>
                  <td className="text-sm">{isAr ? c.country : c.countryEn}</td>
                  <td><span className="badge badge-info">{isAr ? c.plan : c.planEn}</span></td>
                  <td className="text-center font-medium">{c.users}</td>
                  <td className="text-center font-medium">{formatNumber(c.leads, locale)}</td>
                  <td className="text-sm text-slate-500">{c.startDate}</td>
                  <td className="text-sm text-slate-500">{c.endDate}</td>
                  <td>
                    <span className={`badge ${c.status === "active" ? "badge-success" : "badge-danger"}`}>
                      {c.status === "active" ? t("active") : t("inactive")}
                    </span>
                  </td>
                  <td>
                    <CompanyRowActions company={c} setCompanies={setCompanies} t={t} isAr={isAr} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-slate-500 font-medium">Loading companies...</div>}>
      <CompaniesContent />
    </Suspense>
  );
}
