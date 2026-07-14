"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Plus, PackagePlus, Edit, Trash2, StopCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

type Addon = {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  billing: "monthly" | "yearly" | "once";
  activeSubscriptions: number;
  status: "active" | "disabled";
};

const mockAddons: Addon[] = [
  { id: 1, name: "5 مستخدمين إضافيين", nameEn: "5 Extra Users", description: "باقة 5 مستخدمين تضاف للحد الأقصى", descriptionEn: "Adds 5 more users to limit", price: 100, billing: "monthly", activeSubscriptions: 42, status: "active" },
  { id: 2, name: "رسائل واتساب لامحدودة", nameEn: "Unlimited WhatsApp", description: "ربط رقم واتساب وإرسال لا محدود", descriptionEn: "Unlimited WhatsApp messaging", price: 300, billing: "monthly", activeSubscriptions: 15, status: "active" },
  { id: 3, name: "10 جيجا مساحة تخزين", nameEn: "10GB Storage", description: "مساحة إضافية لرفع الملفات", descriptionEn: "Extra cloud storage", price: 50, billing: "monthly", activeSubscriptions: 89, status: "active" },
  { id: 4, name: "تدريب مخصص للفريق", nameEn: "Custom Team Training", description: "جلسة تدريبية لمرة واحدة", descriptionEn: "One-time training session", price: 1500, billing: "once", activeSubscriptions: 3, status: "active" },
];

export default function AddonsPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";
  
  const [addons, setAddons] = useState<Addon[]>(mockAddons);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <PackagePlus className="w-6 h-6 text-indigo-600" />
            {isAr ? "الإضافات المدفوعة (Add-ons)" : "Paid Add-ons"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isAr ? "إدارة الخدمات الإضافية التي يمكن للشركات شراؤها" : "Manage extra services that companies can purchase"}
          </p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" /> {isAr ? "إضافة خدمة جديدة" : "Create Add-on"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {addons.map(addon => (
          <div key={addon.id} className="stat-card border border-slate-100 hover:border-indigo-100 transition-colors flex flex-col h-full relative overflow-hidden group">
            {addon.status === "disabled" && (
              <div className="absolute inset-0 bg-slate-50/50 z-10"></div>
            )}
            
            <div className="p-5 flex-1 relative z-20">
              <div className="flex justify-between items-start mb-3">
                <span className={`badge ${addon.status === "active" ? "badge-success" : "badge-neutral"}`}>
                  {addon.status === "active" ? (isAr ? "نشط" : "Active") : (isAr ? "موقوف" : "Disabled")}
                </span>
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  {addon.billing === "monthly" ? (isAr ? "شهري" : "Monthly") : 
                   addon.billing === "yearly" ? (isAr ? "سنوي" : "Yearly") : (isAr ? "مرة واحدة" : "One-time")}
                </span>
              </div>
              
              <h3 className="font-bold text-lg text-slate-800 mb-1">{isAr ? addon.name : addon.nameEn}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">
                {isAr ? addon.description : addon.descriptionEn}
              </p>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-end justify-between">
                <div>
                  <div className="text-sm text-slate-400 mb-1">{isAr ? "السعر" : "Price"}</div>
                  <div className="font-bold text-xl text-slate-800">
                    {formatCurrency(addon.price, locale)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400 mb-1">{isAr ? "المشتركين" : "Subscribers"}</div>
                  <div className="font-bold text-indigo-600">{addon.activeSubscriptions}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between relative z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-sm text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 cursor-pointer font-medium">
                <Edit className="w-4 h-4" /> {isAr ? "تعديل" : "Edit"}
              </button>
              <button 
                className={`text-sm flex items-center gap-1.5 cursor-pointer font-medium ${addon.status === "active" ? 'text-amber-600 hover:text-amber-700' : 'text-emerald-600 hover:text-emerald-700'}`}
                onClick={() => {
                  setAddons(prev => prev.map(a => a.id === addon.id ? {...a, status: a.status === 'active' ? 'disabled' : 'active'} : a));
                }}
              >
                <StopCircle className="w-4 h-4" /> {addon.status === "active" ? (isAr ? "إيقاف" : "Disable") : (isAr ? "تفعيل" : "Enable")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
