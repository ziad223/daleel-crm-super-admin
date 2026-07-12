"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/context/DataContext";
import { formatCurrency } from "@/lib/utils";
import { MoreHorizontal, RefreshCw, ArrowUp, ArrowDown, Pause, Play, X, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

type Subscription = {
  id: number;
  company: string;
  companyEn: string;
  plan: string;
  planEn: string;
  start: string;
  end: string;
  amount: number;
  paymentStatus: string;
  autoRenew: boolean;
};

export default function SubscriptionsPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";
  const { subscriptions, setSubscriptions, plans } = useData();

  // Modals / Selection states
  const [upgradingSub, setUpgradingSub] = useState<Subscription | null>(null);

  const handleExtend = (id: number) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === id) {
        // Add 30 days to the end date
        const currentEnd = new Date(s.end);
        currentEnd.setDate(currentEnd.getDate() + 30);
        const newEndStr = currentEnd.toISOString().split("T")[0];
        
        toast.success(
          isAr 
            ? `تم تمديد اشتراك "${s.company}" لمدة شهر إضافي حتى ${newEndStr}`
            : `Subscription for "${s.companyEn}" extended by 30 days until ${newEndStr}`
        );
        return { ...s, end: newEndStr, paymentStatus: "paid" as const };
      }
      return s;
    }));
  };

  const handleToggleAutoRenew = (id: number) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === id) {
        const nextAuto = !s.autoRenew;
        toast.success(
          isAr 
            ? `تم ${nextAuto ? "تفعيل" : "إيقاف"} التجديد التلقائي لشركة "${s.company}"`
            : `Auto renew set to ${nextAuto ? "Enabled" : "Disabled"} for "${s.companyEn}"`
        );
        return { ...s, autoRenew: nextAuto };
      }
      return s;
    }));
  };

  const handleTogglePaymentStatus = (id: number) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.paymentStatus === "paid" ? "unpaid" : "paid";
        toast.success(
          isAr 
            ? `تم تحديث حالة دفع اشتراك "${s.company}" إلى: ${nextStatus === "paid" ? "مدفوع" : "متأخر"}`
            : `Payment status for "${s.companyEn}" changed to: ${nextStatus.toUpperCase()}`
        );
        return { ...s, paymentStatus: nextStatus as any };
      }
      return s;
    }));
  };

  const handleUpgradePlan = (planId: number) => {
    if (!upgradingSub) return;
    
    const selectedPlan = plans.find(p => p.id === planId);
    if (!selectedPlan) return;

    setSubscriptions(prev => prev.map(s => {
      if (s.id === upgradingSub.id) {
        toast.success(
          isAr 
            ? `تم ترقية اشتراك "${s.company}" بنجاح إلى باقة ${selectedPlan.name}`
            : `Successfully upgraded "${s.companyEn}" to ${selectedPlan.nameEn}`
        );
        return {
          ...s,
          plan: selectedPlan.name,
          planEn: selectedPlan.nameEn,
          amount: selectedPlan.yearly
        };
      }
      return s;
    }));

    setUpgradingSub(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{isAr ? "جميع اشتراكات الشركات في المنصة" : "All company subscriptions on the platform"}</p>
      </div>

      <div className="table-wrap overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("companyName")}</th>
              <th>{t("plan")}</th>
              <th>{t("startDate")}</th>
              <th>{t("endDate")}</th>
              <th>{isAr ? "المبلغ" : "Amount"}</th>
              <th>{isAr ? "حالة الدفع" : "Payment"}</th>
              <th>{isAr ? "التجديد التلقائي" : "Auto Renew"}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr key={s.id}>
                <td className="font-medium">{isAr ? s.company : s.companyEn}</td>
                <td><span className="badge badge-info">{isAr ? s.plan : s.planEn}</span></td>
                <td className="text-sm text-slate-500">{s.start}</td>
                <td className="text-sm text-slate-500">{s.end}</td>
                <td className="font-medium font-mono">{formatCurrency(s.amount, locale)}</td>
                <td>
                  <button 
                    onClick={() => handleTogglePaymentStatus(s.id)}
                    className={`badge transition-all cursor-pointer hover:scale-105 active:scale-95 ${s.paymentStatus === "paid" ? "badge-success" : "badge-danger"}`}
                    title={isAr ? "اضغط لتغيير الحالة" : "Click to toggle status"}
                  >
                    {s.paymentStatus === "paid" ? (isAr ? "مدفوع" : "Paid") : (isAr ? "متأخر" : "Overdue")}
                  </button>
                </td>
                <td>
                  <button 
                    onClick={() => handleToggleAutoRenew(s.id)}
                    className={`badge transition-all cursor-pointer hover:scale-105 active:scale-95 ${s.autoRenew ? "badge-success" : "badge-neutral"}`}
                    title={isAr ? "اضغط للتبديل" : "Click to toggle"}
                  >
                    {s.autoRenew ? (isAr ? "نعم" : "Yes") : (isAr ? "لا" : "No")}
                  </button>
                </td>
                <td>
                  <div className="flex gap-0.5">
                    <button 
                      onClick={() => handleExtend(s.id)} 
                      className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 cursor-pointer transition-colors" 
                      title={isAr ? "تمديد 30 يوم" : "Extend 30 Days"}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setUpgradingSub(s)} 
                      className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 cursor-pointer transition-colors" 
                      title={isAr ? "ترقية الباقة" : "Upgrade Plan"}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleTogglePaymentStatus(s.id)} 
                      className="p-1.5 hover:bg-amber-50 rounded-lg text-amber-600 cursor-pointer transition-colors" 
                      title={s.paymentStatus === "paid" ? (isAr ? "تعليق الدفع" : "Suspend Payment") : (isAr ? "تنشيط الدفع" : "Activate Payment")}
                    >
                      {s.paymentStatus === "paid" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
                      <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upgrade Plan Selection Modal */}
      {upgradingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">
                {isAr 
                  ? `ترقية باقة: ${upgradingSub.company}` 
                  : `Upgrade Plan for: ${upgradingSub.companyEn}`}
              </h3>
              <button 
                type="button" 
                onClick={() => setUpgradingSub(null)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="bg-amber-50 rounded-xl p-3 flex gap-2.5 border border-amber-100">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-800">{isAr ? "تنبيه الترقية" : "Upgrade Warning"}</p>
                  <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                    {isAr 
                      ? "سيتم تطبيق رسوم الباقة الجديدة فوراً وتعديل الصلاحيات المتاحة لحساب الشركة." 
                      : "New pricing structures and resources allocation will take effect immediately upon upgrade."}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-500 block">
                  {isAr ? "اختر الباقة الجديدة للترقية إليها:" : "Select Target Plan:"}
                </label>
                <div className="grid gap-2">
                  {plans.map((p) => {
                    const isCurrent = p.nameEn.toLowerCase() === upgradingSub.planEn.toLowerCase();
                    return (
                      <button
                        key={p.id}
                        disabled={isCurrent}
                        onClick={() => handleUpgradePlan(p.id)}
                        className={`w-full p-3 rounded-xl border text-start flex items-center justify-between transition-all ${
                          isCurrent 
                            ? "bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed" 
                            : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200 cursor-pointer"
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-800">
                            {isAr ? p.name : p.nameEn} 
                            {isCurrent && (
                              <span className="text-[10px] text-slate-400 font-normal ml-2">({isAr ? "الباقة الحالية" : "Current"})</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                            {p.users} {isAr ? "مستخدمين" : "users"} · {p.leads.toLocaleString()} {isAr ? "عميل" : "leads"}
                          </div>
                        </div>
                        <div className="font-bold text-xs text-emerald-600 font-mono">
                          {p.yearly} SAR/yr
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
