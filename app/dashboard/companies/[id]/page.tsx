"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { companies, plans } from "@/lib/mock/data";
import { 
  Building2, ArrowLeft, LogIn, ShieldAlert, CheckCircle2, 
  CreditCard, LayoutGrid, ClipboardList, Users, Shield, 
  Globe, Sparkles, Phone, Mail, MapPin, RefreshCw, Save
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function CompanyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";

  // Find company
  const companyId = parseInt(id);
  const companyData = companies.find(c => c.id === companyId);

  // States
  const [company, setCompany] = useState(companyData);
  const [activeTab, setActiveTab] = useState<"general" | "subscription" | "usage" | "logs">("general");
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(1);

  if (!company) {
    return (
      <div className="stat-card flex flex-col items-center justify-center py-20 text-center">
        <Building2 className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">{isAr ? "الشركة غير موجودة" : "Company Not Found"}</h2>
        <p className="text-slate-500 text-sm mb-5">{isAr ? "المعرف الذي تحاول الوصول إليه غير مسجل." : "The requested company ID does not exist."}</p>
        <Link href="/dashboard/companies" className="btn-primary btn-sm">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> {isAr ? "العودة للشركات" : "Back to Companies"}
        </Link>
      </div>
    );
  }

  const handleLoginAs = () => {
    toast.info(
      isAr 
        ? `جاري تحويلك وتسجيل الدخول كمسؤول لشركة: ${company.name}` 
        : `Logging in as Administrator for: ${company.nameEn}...`
    );
  };

  const handleToggleStatus = () => {
    const nextStatus = company.status === "active" ? "suspended" : "active";
    setCompany({ ...company, status: nextStatus });
    toast.success(
      isAr 
        ? `تم ${nextStatus === "active" ? "تفعيل" : "تعليق"} حساب الشركة بنجاح!` 
        : `Company status updated to ${nextStatus}!`
    );
  };

  const handleRenew = () => {
    const nextYear = new Date(company.endDate);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const dateStr = nextYear.toISOString().split("T")[0];
    
    setCompany({ ...company, endDate: dateStr });
    toast.success(
      isAr 
        ? `تم تجديد الاشتراك بنجاح حتى تاريخ ${dateStr}` 
        : `Subscription renewed successfully until ${dateStr}!`
    );
  };

  const handlePlanChange = () => {
    const targetPlan = plans.find(p => p.id === selectedPlanId);
    if (!targetPlan) return;

    setCompany({
      ...company,
      plan: targetPlan.name,
      planEn: targetPlan.nameEn
    });
    setShowPlanModal(false);
    toast.success(
      isAr 
        ? `تمت ترقية الباقة لشركة ${company.name} إلى ${targetPlan.name}` 
        : `Upgraded plan for ${company.nameEn} to ${targetPlan.nameEn}!`
    );
  };

  return (
    <div className="space-y-5">
      {/* Back Button & Main Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <Link href="/dashboard/companies" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" />
          {isAr ? "العودة لقائمة الشركات" : "Back to Companies List"}
        </Link>

        <div className="flex flex-wrap gap-2">
          <button onClick={handleLoginAs} className="btn-accent btn-sm">
            <LogIn className="w-4 h-4" /> {isAr ? "تسجيل دخول كـ" : "Login As"}
          </button>
          <button onClick={handleToggleStatus} className={`btn-sm ${company.status === "active" ? "btn-danger" : "btn-outline"}`}>
            {company.status === "active" ? (isAr ? "إيقاف الحساب" : "Suspend Account") : (isAr ? "تفعيل الحساب" : "Activate Account")}
          </button>
          <button onClick={() => setShowPlanModal(true)} className="btn-outline btn-sm">
            {isAr ? "تغيير الباقة" : "Change Plan"}
          </button>
          <button onClick={handleRenew} className="btn-outline btn-sm">
            {isAr ? "تجديد التراخيص" : "Renew Sub"}
          </button>
        </div>
      </div>

      {/* Company Header Widget */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xl shadow-xs border border-blue-100">
          {company.logo}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">{isAr ? company.name : company.nameEn}</h2>
            <span className={`badge text-[10px] uppercase font-bold tracking-wider ${company.status === "active" ? "badge-success" : "badge-danger"}`}>
              {company.status === "active" ? t("active") : t("inactive")}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isAr ? company.owner : company.ownerEn} · {isAr ? company.country : company.countryEn}
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-slate-400 font-bold uppercase">{t("plan")}</p>
          <span className="badge badge-info mt-1 text-xs font-semibold">{isAr ? company.plan : company.planEn}</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all ${
            activeTab === "general" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          {isAr ? "البيانات العامة" : "General Info"}
        </button>
        <button
          onClick={() => setActiveTab("subscription")}
          className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all ${
            activeTab === "subscription" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          {isAr ? "الاشتراكات والفوترة" : "Subscription & Billing"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("usage")}
          className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all ${
            activeTab === "usage" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          {isAr ? "استهلاك الموارد" : "Resource Usage"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all ${
            activeTab === "logs" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          {isAr ? "سجل العمليات" : "Activity Logs"}
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "general" && (
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2">{isAr ? "معلومات الاتصال" : "Contact Information"}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2.5 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{company.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{company.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{isAr ? company.country : company.countryEn}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2">{isAr ? "تفاصيل إدارية" : "Administrative Details"}</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 block">{isAr ? "تاريخ التأسيس" : "Registration Date"}</span>
                <span className="font-semibold text-slate-800 font-mono mt-1 block">{company.startDate}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 block">{isAr ? "تاريخ التجديد القادم" : "Next Renewal Date"}</span>
                <span className="font-semibold text-slate-800 font-mono mt-1 block">{company.endDate}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "subscription" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-500" />
            {isAr ? "تفاصيل باقة الاشتراك الحالية والفوترة" : "Current Plan & Billing cycles"}
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <span className="text-xs text-slate-400 uppercase font-bold">{t("plan")}</span>
              <p className="text-lg font-bold text-slate-800 mt-1">{isAr ? company.plan : company.planEn}</p>
            </div>
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <span className="text-xs text-slate-400 uppercase font-bold">{isAr ? "تاريخ البداية" : "Start Date"}</span>
              <p className="text-sm font-semibold text-slate-700 font-mono mt-1">{company.startDate}</p>
            </div>
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <span className="text-xs text-slate-400 uppercase font-bold">{isAr ? "تاريخ النهاية" : "Expiry Date"}</span>
              <p className="text-sm font-semibold text-slate-700 font-mono mt-1">{company.endDate}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-between items-center text-xs">
            <div>
              <p className="font-bold text-slate-800">{isAr ? "حالة الدفع للفترة الحالية" : "Current Payment Status"}</p>
              <p className="text-slate-500 mt-0.5">{isAr ? "آخر دفعة كانت ناجحة في " : "Last successful charge: "}{company.startDate}</p>
            </div>
            <span className="badge badge-success text-xs font-semibold px-3 py-1">
              {isAr ? "مدفوعة" : "Paid"}
            </span>
          </div>
        </div>
      )}

      {activeTab === "usage" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-5">
          <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2">
            {isAr ? "استهلاك الموارد بالنسبة للحدود المسموحة" : "Active Resources vs License Allocation Limits"}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* User count limit */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>{isAr ? "المستخدمون النشطون" : "Active Users"}</span>
                <span>{company.users} / 15 {isAr ? "مستخدم" : "users"}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: `${(company.users / 15) * 100}%` }} />
              </div>
            </div>

            {/* Leads count limit */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>{isAr ? "إجمالي الـ Leads" : "Managed Leads"}</span>
                <span>{formatNumber(company.leads, locale)} / 10,000</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${(company.leads / 10000) * 100}%` }} />
              </div>
            </div>

            {/* Modules Check */}
            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span className="font-semibold text-slate-700">{isAr ? "الذكاء الاصطناعي (AI):" : "AI Features:"}</span>
                <span className="badge badge-success text-[9px]">{isAr ? "متاح" : "Enabled"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-slate-700">{isAr ? "دومين مخصص:" : "Custom Domain:"}</span>
                <span className="badge badge-success text-[9px]">{isAr ? "متاح" : "Enabled"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2">
            {isAr ? "سجل نشاط وحماية الحساب" : "Security Checkpoint & Backup Logs"}
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 flex justify-between items-center">
              <span className="text-slate-500">{isAr ? "آخر عملية تسجيل دخول للمالك" : "Owner Last Login"}</span>
              <span className="font-semibold text-slate-700">2026-07-11 22:15</span>
            </div>
            <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 flex justify-between items-center">
              <span className="text-slate-500">{isAr ? "آخر تعديل على الصلاحيات" : "Account Permission Update"}</span>
              <span className="font-semibold text-slate-700">2026-07-01 10:14</span>
            </div>
            <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 flex justify-between items-center">
              <span className="text-slate-500">{isAr ? "آخر نسخة احتياطية للملفات" : "Latest Cloud Backup Archive"}</span>
              <span className="font-semibold text-slate-700">2026-07-11 02:00</span>
            </div>
          </div>
        </div>
      )}

      {/* Change Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">{isAr ? "تغيير الباقة الحالية" : "Select Subscription Plan"}</h3>
              <button
                type="button"
                onClick={() => setShowPlanModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-medium"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                {plans.map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer select-none transition-all ${
                      selectedPlanId === p.id
                        ? "border-emerald-500 bg-emerald-50/50 text-emerald-800"
                        : "border-slate-150 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="plan_radio"
                        checked={selectedPlanId === p.id}
                        onChange={() => setSelectedPlanId(p.id)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="font-bold text-sm block text-slate-800">{isAr ? p.name : p.nameEn}</span>
                        <span className="text-slate-500 text-xs font-mono">{formatCurrency(p.monthly, locale)} / {isAr ? "شهر" : "mo"}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <button onClick={handlePlanChange} className="btn-accent w-full py-2.5 mt-2">
                {isAr ? "تأكيد تغيير الباقة" : "Upgrade Plan Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
