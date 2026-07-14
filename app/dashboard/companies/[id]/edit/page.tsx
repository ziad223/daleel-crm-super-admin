"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/context/DataContext";
import { useRouter } from "next/navigation";
import { Building2, ArrowLeft, Save, Globe, Mail, Phone, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";
  const { companies, setCompanies } = useData();
  const router = useRouter();
  
  const companyId = parseInt(id);
  const [company, setCompany] = useState<any>(null);

  // Form fields
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [owner, setOwner] = useState("");
  const [ownerEn, setOwnerEn] = useState("");
  const [country, setCountry] = useState("");
  const [countryEn, setCountryEn] = useState("");
  const [status, setStatus] = useState("active");

  useEffect(() => {
    const found = companies.find(c => c.id === companyId);
    if (found) {
      setCompany(found);
      setName(found.name);
      setNameEn(found.nameEn);
      setEmail(found.email);
      setPhone(found.phone);
      setOwner(found.owner);
      setOwnerEn(found.ownerEn);
      setCountry(found.country);
      setCountryEn(found.countryEn);
      setStatus(found.status);
    }
  }, [companyId, companies]);

  if (!company) {
    return (
      <div className="stat-card flex flex-col items-center justify-center py-20 text-center">
        <Building2 className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">{isAr ? "جاري التحميل..." : "Loading..."}</h2>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nameEn.trim() || !email.trim()) {
      toast.error(isAr ? "الرجاء تعبئة الحقول المطلوبة" : "Please fill required fields");
      return;
    }

    setCompanies(prev => prev.map(c => {
      if (c.id === companyId) {
        return {
          ...c,
          name,
          nameEn,
          email,
          phone,
          owner,
          ownerEn,
          country,
          countryEn,
          status,
        };
      }
      return c;
    }));

    toast.success(isAr ? "تم تحديث بيانات الشركة بنجاح" : "Company updated successfully");
    router.push("/dashboard/companies");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            {isAr ? "تعديل بيانات الشركة" : "Edit Company Details"}
          </h1>
          <p className="text-slate-500 text-sm">
            {isAr ? `تحديث معلومات شركة ${company.name}` : `Update info for ${company.nameEn}`}
          </p>
        </div>
        <Link href="/dashboard/companies" className="btn btn-outline cursor-pointer">
          <ArrowLeft className={`w-4 h-4 ${isAr ? "ml-1.5" : "mr-1.5"} ${isAr ? "rotate-180" : ""}`} />
          {isAr ? "رجوع" : "Back"}
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="stat-card p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {isAr ? "اسم الشركة (عربي) *" : "Company Name (Arabic) *"}
              </label>
              <div className="relative">
                <Building2 className={`absolute top-3 w-5 h-5 text-slate-400 ${isAr ? 'right-3' : 'left-3'}`} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`form-input w-full ${isAr ? 'pr-10' : 'pl-10'} py-2.5 bg-slate-50 border-slate-200 focus:bg-white`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {isAr ? "البريد الإلكتروني *" : "Email Address *"}
              </label>
              <div className="relative">
                <Mail className={`absolute top-3 w-5 h-5 text-slate-400 ${isAr ? 'right-3' : 'left-3'}`} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`form-input w-full ${isAr ? 'pr-10' : 'pl-10'} py-2.5 bg-slate-50 border-slate-200 focus:bg-white`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {isAr ? "المدير المسؤول (عربي)" : "Owner Name (Arabic)"}
              </label>
              <div className="relative">
                <User className={`absolute top-3 w-5 h-5 text-slate-400 ${isAr ? 'right-3' : 'left-3'}`} />
                <input 
                  type="text" 
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className={`form-input w-full ${isAr ? 'pr-10' : 'pl-10'} py-2.5 bg-slate-50 border-slate-200 focus:bg-white`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {isAr ? "الدولة (عربي)" : "Country (Arabic)"}
              </label>
              <div className="relative">
                <Globe className={`absolute top-3 w-5 h-5 text-slate-400 ${isAr ? 'right-3' : 'left-3'}`} />
                <input 
                  type="text" 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={`form-input w-full ${isAr ? 'pr-10' : 'pl-10'} py-2.5 bg-slate-50 border-slate-200 focus:bg-white`}
                />
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {isAr ? "اسم الشركة (إنجليزي) *" : "Company Name (English) *"}
              </label>
              <div className="relative">
                <Building2 className={`absolute top-3 w-5 h-5 text-slate-400 ${isAr ? 'right-3' : 'left-3'}`} />
                <input 
                  type="text" 
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className={`form-input w-full ${isAr ? 'pr-10' : 'pl-10'} py-2.5 bg-slate-50 border-slate-200 focus:bg-white text-left`}
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {isAr ? "رقم الهاتف" : "Phone Number"}
              </label>
              <div className="relative">
                <Phone className={`absolute top-3 w-5 h-5 text-slate-400 ${isAr ? 'right-3' : 'left-3'}`} />
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`form-input w-full ${isAr ? 'pr-10' : 'pl-10'} py-2.5 bg-slate-50 border-slate-200 focus:bg-white text-left`}
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {isAr ? "المدير المسؤول (إنجليزي)" : "Owner Name (English)"}
              </label>
              <div className="relative">
                <User className={`absolute top-3 w-5 h-5 text-slate-400 ${isAr ? 'right-3' : 'left-3'}`} />
                <input 
                  type="text" 
                  value={ownerEn}
                  onChange={(e) => setOwnerEn(e.target.value)}
                  className={`form-input w-full ${isAr ? 'pr-10' : 'pl-10'} py-2.5 bg-slate-50 border-slate-200 focus:bg-white text-left`}
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {isAr ? "الدولة (إنجليزي)" : "Country (English)"}
              </label>
              <div className="relative">
                <Globe className={`absolute top-3 w-5 h-5 text-slate-400 ${isAr ? 'right-3' : 'left-3'}`} />
                <input 
                  type="text" 
                  value={countryEn}
                  onChange={(e) => setCountryEn(e.target.value)}
                  className={`form-input w-full ${isAr ? 'pr-10' : 'pl-10'} py-2.5 bg-slate-50 border-slate-200 focus:bg-white text-left`}
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 border-slate-100" />

        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-4">
            {isAr ? "حالة الحساب" : "Account Status"}
          </label>
          <div className="flex gap-4">
            <label className={`flex-1 flex items-center p-4 border rounded-xl cursor-pointer transition-all ${status === 'active' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:border-emerald-200 hover:bg-slate-50'}`}>
              <input type="radio" name="status" value="active" checked={status === 'active'} onChange={() => setStatus('active')} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300" />
              <div className={`mr-3 ml-3 flex-1 ${status === 'active' ? 'text-emerald-700' : 'text-slate-700'}`}>
                <span className="block font-medium">{isAr ? "نشط" : "Active"}</span>
                <span className="block text-xs mt-0.5 opacity-80">{isAr ? "الشركة قادرة على استخدام النظام بحرية" : "Company can use the system normally"}</span>
              </div>
            </label>
            
            <label className={`flex-1 flex items-center p-4 border rounded-xl cursor-pointer transition-all ${status === 'suspended' ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200 hover:border-amber-200 hover:bg-slate-50'}`}>
              <input type="radio" name="status" value="suspended" checked={status === 'suspended'} onChange={() => setStatus('suspended')} className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-slate-300" />
              <div className={`mr-3 ml-3 flex-1 ${status === 'suspended' ? 'text-amber-700' : 'text-slate-700'}`}>
                <span className="block font-medium">{isAr ? "موقوف مؤقتاً" : "Suspended"}</span>
                <span className="block text-xs mt-0.5 opacity-80">{isAr ? "إيقاف صلاحيات الدخول للمنصة" : "Block platform access"}</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4 gap-3">
          <Link href="/dashboard/companies" className="btn btn-outline cursor-pointer border-slate-300">
            {isAr ? "إلغاء التعديلات" : "Cancel"}
          </Link>
          <button type="submit" className="btn btn-primary cursor-pointer px-8 shadow-md">
            <Save className={`w-4 h-4 ${isAr ? "ml-2" : "mr-2"}`} />
            {isAr ? "حفظ التغييرات" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
