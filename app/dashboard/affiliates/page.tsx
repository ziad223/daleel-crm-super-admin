"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Users, Link as LinkIcon, DollarSign, ExternalLink, Activity, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Affiliate = {
  id: number;
  name: string;
  email: string;
  referralCode: string;
  clicks: number;
  conversions: number;
  totalEarnings: number;
  status: "active" | "pending" | "disabled";
};

const mockAffiliates: Affiliate[] = [
  { id: 1, name: "Ahmed Marketing", email: "ahmed@marketing.com", referralCode: "AHMED26", clicks: 1250, conversions: 45, totalEarnings: 15000, status: "active" },
  { id: 2, name: "Tech Solutions", email: "info@tech-sol.com", referralCode: "TECHCRM", clicks: 840, conversions: 12, totalEarnings: 4500, status: "active" },
  { id: 3, name: "Sara Design", email: "sara@design.com", referralCode: "SARA_D", clicks: 0, conversions: 0, totalEarnings: 0, status: "pending" },
];

export default function AffiliatesPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";
  
  const [affiliates, setAffiliates] = useState<Affiliate[]>(mockAffiliates);
  const [search, setSearch] = useState("");

  const filtered = affiliates.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            {isAr ? "برنامج الشركاء (Affiliates)" : "Affiliate Program"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isAr ? "إدارة المسوقين والموزعين وتتبع العمولات" : "Manage resellers, tracking links, and commissions"}
          </p>
        </div>
        
        <button className="btn bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-sm">
          <Plus className="w-4 h-4 mr-1.5" /> {isAr ? "إضافة مسوق جديد" : "Add Affiliate"}
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card p-5">
          <h3 className="text-slate-500 text-sm font-medium mb-1">{isAr ? "إجمالي المسوقين" : "Total Affiliates"}</h3>
          <p className="text-2xl font-bold text-slate-800">{affiliates.length}</p>
        </div>
        <div className="stat-card p-5">
          <h3 className="text-slate-500 text-sm font-medium mb-1">{isAr ? "إجمالي النقرات" : "Total Clicks"}</h3>
          <p className="text-2xl font-bold text-blue-600">{affiliates.reduce((sum, a) => sum + a.clicks, 0).toLocaleString()}</p>
        </div>
        <div className="stat-card p-5">
          <h3 className="text-slate-500 text-sm font-medium mb-1">{isAr ? "إجمالي التحويلات" : "Total Conversions"}</h3>
          <p className="text-2xl font-bold text-emerald-600">{affiliates.reduce((sum, a) => sum + a.conversions, 0)}</p>
        </div>
        <div className="stat-card p-5">
          <h3 className="text-slate-500 text-sm font-medium mb-1">{isAr ? "إجمالي العمولات المدفوعة" : "Total Payouts"}</h3>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(affiliates.reduce((sum, a) => sum + a.totalEarnings, 0), locale)}</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="stat-card">
        <div className="p-4 border-b border-slate-100">
          <input 
            type="text" 
            placeholder={isAr ? "البحث عن مسوق..." : "Search affiliates..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input w-full max-w-sm py-2 text-sm bg-slate-50"
          />
        </div>

        <div className="table-wrap">
          <div className="overflow-x-auto w-full">
            <table className="data-table min-w-max">
              <thead>
                <tr>
                  <th>{isAr ? "المسوق" : "Affiliate"}</th>
                  <th>{isAr ? "رمز الإحالة" : "Referral Code"}</th>
                  <th>{isAr ? "النقرات" : "Clicks"}</th>
                  <th>{isAr ? "التحويلات" : "Conversions"}</th>
                  <th>{isAr ? "معدل التحويل" : "Conv. Rate"}</th>
                  <th>{isAr ? "العمولات (الأرباح)" : "Earnings"}</th>
                  <th>{isAr ? "الحالة" : "Status"}</th>
                  <th>{isAr ? "الإجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div className="font-bold text-slate-800">{a.name}</div>
                      <div className="text-xs text-slate-500">{a.email}</div>
                    </td>
                    <td>
                      <span className="font-mono text-sm bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100 flex items-center gap-1.5 w-fit">
                        <LinkIcon className="w-3 h-3" /> {a.referralCode}
                      </span>
                    </td>
                    <td className="font-medium text-slate-600">{a.clicks.toLocaleString()}</td>
                    <td className="font-medium text-emerald-600">{a.conversions}</td>
                    <td className="font-medium text-blue-600">
                      {a.clicks > 0 ? ((a.conversions / a.clicks) * 100).toFixed(1) : 0}%
                    </td>
                    <td className="font-bold">{formatCurrency(a.totalEarnings, locale)}</td>
                    <td>
                      <span className={`badge ${
                        a.status === "active" ? "badge-success" : 
                        a.status === "pending" ? "badge-warning" : "badge-neutral"
                      }`}>
                        {a.status === "active" ? (isAr ? "نشط" : "Active") : 
                         a.status === "pending" ? (isAr ? "قيد المراجعة" : "Pending") : (isAr ? "موقوف" : "Disabled")}
                      </span>
                    </td>
                    <td>
                      <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1 cursor-pointer bg-purple-50 px-2 py-1.5 rounded-lg transition-colors">
                        <Activity className="w-3.5 h-3.5" /> {isAr ? "التفاصيل" : "Details"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
