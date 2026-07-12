"use client";

import React, { useState } from "react";
import { Plus, Check, X, Copy, Edit, Save, ToggleLeft, ToggleRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/context/DataContext";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

type Plan = {
  id: number;
  name: string;
  nameEn: string;
  monthly: number;
  yearly: number;
  users: number;
  leads: number;
  campaigns: number;
  ai: boolean;
  whatsapp: boolean;
  api: boolean;
  backup: boolean;
  customDomain: boolean;
  reports: boolean;
  status: string;
};

export default function PlansPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";
  
  const { plans, setPlans } = useData();

  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [monthly, setMonthly] = useState(199);
  const [yearly, setYearly] = useState(1990);
  const [users, setUsers] = useState(5);
  const [leads, setLeads] = useState(1000);
  const [campaigns, setCampaigns] = useState(10);
  const [ai, setAi] = useState(false);
  const [whatsapp, setWhatsapp] = useState(false);
  const [api, setApi] = useState(false);
  const [backup, setBackup] = useState(false);
  const [customDomain, setCustomDomain] = useState(false);
  const [reports, setReports] = useState(true);

  const handleToggleStatus = (id: number) => {
    setPlans(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === "active" ? "inactive" : "active";
        toast.success(
          isAr 
            ? `تم ${nextStatus === "active" ? "تفعيل" : "تعطيل"} الباقة بنجاح` 
            : `Plan status set to ${nextStatus}`
        );
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const handleCopy = (plan: Plan) => {
    const copyItem: Plan = {
      ...plan,
      id: Date.now(),
      name: `${plan.name} - نسخة`,
      nameEn: `${plan.nameEn} (Copy)`,
      status: "inactive"
    };
    setPlans([...plans, copyItem]);
    toast.success(isAr ? "تم استنساخ الباقة بنجاح" : "Plan duplicated successfully!");
  };

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nameEn.trim()) return;

    const newPlan: Plan = {
      id: Date.now(),
      name,
      nameEn,
      monthly,
      yearly,
      users,
      leads,
      campaigns,
      ai,
      whatsapp,
      api,
      backup,
      customDomain,
      reports,
      status: "active"
    };

    setPlans([...plans, newPlan]);
    setShowAddModal(false);
    toast.success(isAr ? "تم إنشاء باقة جديدة بنجاح" : "New plan created successfully!");
  };

  const handleEditPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    setPlans(prev => prev.map(p => {
      if (p.id === editingPlan.id) {
        return { ...editingPlan };
      }
      return p;
    }));

    setEditingPlan(null);
    toast.success(isAr ? "تم حفظ تعديلات الباقة بنجاح" : "Plan details updated successfully!");
  };

  const startEdit = (p: Plan) => {
    setEditingPlan({ ...p });
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{isAr ? "إدارة باقات الاشتراك المتاحة للشركات" : "Manage subscription plans available for companies"}</p>
        <button onClick={() => setShowAddModal(true)} className="btn-accent btn-sm cursor-pointer"><Plus className="w-4 h-4" /> {t("addPlan")}</button>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <div key={plan.id} className={`stat-card relative flex flex-col justify-between ${plan.nameEn === "Professional" ? "ring-2 ring-emerald-500 shadow-lg" : ""}`}>
            <div>
              {plan.nameEn === "Professional" && (
                <div className="absolute -top-3 end-5 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  {isAr ? "الأكثر طلباً" : "Most Popular"}
                </div>
              )}

              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold tracking-tight">{isAr ? plan.name : plan.nameEn}</h3>
                <span className={`badge text-[9px] uppercase font-bold ${plan.status === "active" ? "badge-success" : "badge-neutral"}`}>
                  {plan.status === "active" ? (isAr ? "نشطة" : "Active") : (isAr ? "موقوفة" : "Disabled")}
                </span>
              </div>
              
              <div className="my-4">
                <span className="text-3xl font-bold font-mono">{plan.monthly}</span>
                <span className="text-slate-500 text-sm"> {isAr ? "ر.س / شهر" : "SAR / mo"}</span>
              </div>
              <div className="text-xs text-slate-400 mb-5">
                {isAr ? `أو ${formatCurrency(plan.yearly, locale)} سنوياً` : `or ${formatCurrency(plan.yearly, locale)} yearly`}
              </div>

              <ul className="space-y-2 text-sm mb-6 border-t border-slate-50 pt-4">
                {[
                  { label: isAr ? `${plan.users === 999 ? "غير محدود" : plan.users} مستخدم` : `${plan.users === 999 ? "Unlimited" : plan.users} users`, ok: true },
                  { label: isAr ? `${plan.leads === 999999 ? "غير محدود" : plan.leads.toLocaleString()} Lead` : `${plan.leads === 999999 ? "Unlimited" : plan.leads.toLocaleString()} leads`, ok: true },
                  { label: isAr ? `${plan.campaigns === 999 ? "غير محدود" : plan.campaigns} حملة` : `${plan.campaigns === 999 ? "Unlimited" : plan.campaigns} campaigns`, ok: true },
                  { label: t("ai"), ok: plan.ai },
                  { label: t("whatsapp"), ok: plan.whatsapp },
                  { label: t("api"), ok: plan.api },
                  { label: t("backup"), ok: plan.backup },
                  { label: t("customDomain"), ok: plan.customDomain },
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {f.ok ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-slate-300" />}
                    <span className={f.ok ? "" : "text-slate-400"}>{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2 border-t border-slate-50 pt-4">
              <button onClick={() => startEdit(plan)} className="btn-outline flex-1 btn-sm cursor-pointer"><Edit className="w-3.5 h-3.5 mr-1" /> {t("edit")}</button>
              <button onClick={() => handleCopy(plan)} className="btn-outline btn-sm cursor-pointer" title={isAr ? "نسخ الباقة" : "Duplicate Plan"}><Copy className="w-3.5 h-3.5 text-slate-500" /></button>
              <button 
                onClick={() => handleToggleStatus(plan.id)} 
                className={`btn-sm cursor-pointer ${plan.status === "active" ? "btn-danger" : "btn-primary"}`}
              >
                {plan.status === "active" ? (isAr ? "تعطيل" : "Disable") : (isAr ? "تفعيل" : "Enable")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-bold text-slate-800">{isAr ? "إضافة باقة اشتراك جديدة" : "Create Subscription Plan"}</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddPlan} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "اسم الباقة (عربي)" : "Plan Name (Arabic)"}</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input text-sm text-right" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "اسم الباقة (إنجليزي)" : "Plan Name (English)"}</label>
                  <input type="text" required value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="input text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "السعر الشهري" : "Monthly Price"}</label>
                  <input type="number" required value={monthly} onChange={(e) => setMonthly(parseInt(e.target.value) || 0)} className="input text-sm font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "السعر السنوي" : "Yearly Price"}</label>
                  <input type="number" required value={yearly} onChange={(e) => setYearly(parseInt(e.target.value) || 0)} className="input text-sm font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "المستخدمين" : "Max Users"}</label>
                  <input type="number" value={users} onChange={(e) => setUsers(parseInt(e.target.value) || 0)} className="input text-sm font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "العملاء Leads" : "Max Leads"}</label>
                  <input type="number" value={leads} onChange={(e) => setLeads(parseInt(e.target.value) || 0)} className="input text-sm font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "الحملات" : "Max Campaigns"}</label>
                  <input type="number" value={campaigns} onChange={(e) => setCampaigns(parseInt(e.target.value) || 0)} className="input text-sm font-mono" />
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-50 pt-3">
                <label className="text-xs font-semibold text-slate-600 block">{isAr ? "الميزات والخصائص المتاحة" : "Features Checklist"}</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { state: ai, setState: setAi, label: isAr ? "الذكاء الاصطناعي (AI)" : "AI Capabilities" },
                    { state: whatsapp, setState: setWhatsapp, label: isAr ? "بوابة واتساب" : "WhatsApp Gateway" },
                    { state: api, setState: setApi, label: isAr ? "الوصول للـ API" : "Developer API" },
                    { state: backup, setState: setBackup, label: isAr ? "نسخ احتياطي سحابي" : "Cloud Backups" },
                    { state: customDomain, setState: setCustomDomain, label: isAr ? "دومين مخصص" : "Custom Domain" },
                    { state: reports, setState: setReports, label: isAr ? "التقارير التحليلية" : "Advanced Reports" }
                  ].map((f, i) => (
                    <label key={i} className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs cursor-pointer select-none">
                      <input type="checkbox" checked={f.state} onChange={(e) => f.setState(e.target.checked)} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                      <span className="font-semibold text-slate-700">{f.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-accent w-full py-3 mt-3 flex items-center justify-center gap-1.5 font-bold shadow-md cursor-pointer">
                <Plus className="w-4 h-4" /> {isAr ? "إضافة الباقة" : "Create Plan"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-bold text-slate-800">{isAr ? `تعديل باقة: ${editingPlan.name}` : `Edit Plan: ${editingPlan.nameEn}`}</h3>
              <button type="button" onClick={() => setEditingPlan(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleEditPlan} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "اسم الباقة (عربي)" : "Plan Name (Arabic)"}</label>
                  <input type="text" required value={editingPlan.name} onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })} className="input text-sm text-right" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "اسم الباقة (إنجليزي)" : "Plan Name (English)"}</label>
                  <input type="text" required value={editingPlan.nameEn} onChange={(e) => setEditingPlan({ ...editingPlan, nameEn: e.target.value })} className="input text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "السعر الشهري" : "Monthly Price"}</label>
                  <input type="number" required value={editingPlan.monthly} onChange={(e) => setEditingPlan({ ...editingPlan, monthly: parseInt(e.target.value) || 0 })} className="input text-sm font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "السعر السنوي" : "Yearly Price"}</label>
                  <input type="number" required value={editingPlan.yearly} onChange={(e) => setEditingPlan({ ...editingPlan, yearly: parseInt(e.target.value) || 0 })} className="input text-sm font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "المستخدمين" : "Max Users"}</label>
                  <input type="number" value={editingPlan.users} onChange={(e) => setEditingPlan({ ...editingPlan, users: parseInt(e.target.value) || 0 })} className="input text-sm font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "العملاء Leads" : "Max Leads"}</label>
                  <input type="number" value={editingPlan.leads} onChange={(e) => setEditingPlan({ ...editingPlan, leads: parseInt(e.target.value) || 0 })} className="input text-sm font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "الحملات" : "Max Campaigns"}</label>
                  <input type="number" value={editingPlan.campaigns} onChange={(e) => setEditingPlan({ ...editingPlan, campaigns: parseInt(e.target.value) || 0 })} className="input text-sm font-mono" />
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-50 pt-3">
                <label className="text-xs font-semibold text-slate-600 block">{isAr ? "الميزات والخصائص المتاحة" : "Features Checklist"}</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "ai", label: isAr ? "الذكاء الاصطناعي (AI)" : "AI Capabilities" },
                    { key: "whatsapp", label: isAr ? "بوابة واتساب" : "WhatsApp Gateway" },
                    { key: "api", label: isAr ? "الوصول للـ API" : "Developer API" },
                    { key: "backup", label: isAr ? "نسخ احتياطي سحابي" : "Cloud Backups" },
                    { key: "customDomain", label: isAr ? "دومين مخصص" : "Custom Domain" },
                    { key: "reports", label: isAr ? "التقارير التحليلية" : "Advanced Reports" }
                  ].map((f) => (
                    <label key={f.key} className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs cursor-pointer select-none">
                      <input type="checkbox" checked={(editingPlan as any)[f.key]} onChange={(e) => setEditingPlan({ ...editingPlan, [f.key]: e.target.checked })} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                      <span className="font-semibold text-slate-700">{f.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-3 mt-3 flex items-center justify-center gap-1.5 font-bold shadow-md cursor-pointer">
                <Save className="w-4 h-4" /> {isAr ? "حفظ التغييرات" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
