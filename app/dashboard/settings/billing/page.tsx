"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Receipt, Save, Building2, MapPin, Calculator, FileText } from "lucide-react";

export default function BillingSettingsPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Receipt className="w-6 h-6 text-slate-600" />
          {isAr ? "الإعدادات الضريبية والمالية" : "Tax & Billing Settings"}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {isAr ? "إدارة معلومات الشركة الأم والضرائب المطبقة على الاشتراكات" : "Manage mother company details and applied taxes"}
        </p>
      </div>

      <div className="space-y-6">
        <div className="stat-card p-6">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Building2 className="w-5 h-5 text-indigo-500" />
            {isAr ? "معلومات الشركة المصدرة للفواتير" : "Biller Company Information"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">{isAr ? "اسم الشركة التجاري" : "Company Legal Name"}</label>
              <input type="text" className="form-input w-full" defaultValue="Daleel CRM Solutions LLC" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{isAr ? "الرقم الضريبي (VAT / TIN)" : "Tax Number (VAT / TIN)"}</label>
              <input type="text" className="form-input w-full" defaultValue="310239120300003" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{isAr ? "رقم السجل التجاري" : "Commercial Registration"}</label>
              <input type="text" className="form-input w-full" defaultValue="1010123456" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{isAr ? "البريد الإلكتروني المالي" : "Billing Email"}</label>
              <input type="email" className="form-input w-full" defaultValue="billing@daleelcrm.com" />
            </div>
          </div>
        </div>

        <div className="stat-card p-6">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Calculator className="w-5 h-5 text-amber-500" />
            {isAr ? "إعدادات الضرائب" : "Tax Settings"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="col-span-full flex items-center gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
              <div>
                <p className="font-bold text-amber-900">{isAr ? "تطبيق ضريبة القيمة المضافة (VAT)" : "Apply Value Added Tax (VAT)"}</p>
                <p className="text-xs text-amber-700 mt-0.5">{isAr ? "إضافة الضريبة تلقائياً لجميع فواتير الاشتراكات" : "Automatically add tax to all subscription invoices"}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">{isAr ? "نسبة الضريبة (%)" : "Tax Rate (%)"}</label>
              <input type="number" className="form-input w-full" defaultValue="15" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{isAr ? "اسم الضريبة (يظهر بالفاتورة)" : "Tax Name (Invoice Label)"}</label>
              <input type="text" className="form-input w-full" defaultValue="VAT (15%)" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button className="btn bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer px-6">
            <Save className="w-4 h-4 mr-2" />
            {isAr ? "حفظ الإعدادات المالية" : "Save Billing Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
