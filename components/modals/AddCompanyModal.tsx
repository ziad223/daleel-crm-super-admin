"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/context/DataContext";
import { Plus, X, Building2, User, Mail, Phone, Globe, Shield, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function AddCompanyModal() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";
  
  const { 
    showAddCompanyModal, 
    setShowAddCompanyModal, 
    companies, 
    setCompanies,
    subscriptions,
    setSubscriptions,
    payments,
    setPayments,
    invoices,
    setInvoices,
    plans
  } = useData();

  // Form states
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [owner, setOwner] = useState("");
  const [ownerEn, setOwnerEn] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("السعودية");
  const [countryEn, setCountryEn] = useState("Saudi Arabia");
  const [planId, setPlanId] = useState(2); // Default to Professional
  const [status, setStatus] = useState<"active" | "suspended">("active");

  if (!showAddCompanyModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !nameEn.trim() || !owner.trim() || !ownerEn.trim() || !email.trim() || !phone.trim()) {
      toast.error(isAr ? "يرجى تعبئة جميع الحقول الإلزامية" : "Please fill in all required fields");
      return;
    }

    const selectedPlan = plans.find(p => p.id === planId) || plans[1];
    const newId = Date.now();
    const startDateStr = new Date().toISOString().split("T")[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const endDateStr = nextYear.toISOString().split("T")[0];

    // 1. Create Company
    const newCompany = {
      id: newId,
      name: name.trim(),
      nameEn: nameEn.trim(),
      owner: owner.trim(),
      ownerEn: ownerEn.trim(),
      email: email.trim(),
      phone: phone.trim(),
      country,
      countryEn,
      plan: selectedPlan.name,
      planEn: selectedPlan.nameEn,
      users: 1, // Init with 1 admin user
      leads: 0,
      startDate: startDateStr,
      endDate: endDateStr,
      status,
      logo: name.trim().charAt(0)
    };

    // 2. Create Subscription
    const newSubscription = {
      id: newId + 1,
      company: name.trim(),
      companyEn: nameEn.trim(),
      plan: selectedPlan.name,
      planEn: selectedPlan.nameEn,
      start: startDateStr,
      end: endDateStr,
      amount: selectedPlan.yearly,
      paymentStatus: "paid" as const,
      autoRenew: true
    };

    // 3. Create Invoice
    const newInvoice = {
      id: `INV-2026-0${Math.floor(Math.random() * 900) + 100}`,
      company: name.trim(),
      companyEn: nameEn.trim(),
      plan: selectedPlan.name,
      planEn: selectedPlan.nameEn,
      amount: selectedPlan.yearly,
      tax: Math.round(selectedPlan.yearly * 0.15 * 100) / 100, // 15% VAT
      total: Math.round(selectedPlan.yearly * 1.15 * 100) / 100,
      status: "paid" as const,
      date: startDateStr
    };

    // 4. Create Payment
    const newPayment = {
      id: newId + 2,
      company: name.trim(),
      companyEn: nameEn.trim(),
      transactionId: `TXN-2026-${Math.floor(Math.random() * 9000) + 1000}`,
      method: isAr ? "بطاقة ائتمان" : "Credit Card",
      methodEn: "Credit Card",
      amount: selectedPlan.yearly,
      tax: Math.round(selectedPlan.yearly * 0.15 * 100) / 100,
      date: startDateStr,
      status: "completed" as const
    };

    setCompanies([newCompany, ...companies]);
    setSubscriptions([newSubscription, ...subscriptions]);
    setInvoices([newInvoice, ...invoices]);
    setPayments([newPayment, ...payments]);

    // Clear form
    setName("");
    setNameEn("");
    setOwner("");
    setOwnerEn("");
    setEmail("");
    setPhone("");
    setShowAddCompanyModal(false);
    toast.success(
      isAr 
        ? `تم إضافة شركة "${name}" وتنشيط باقة "${selectedPlan.name}" بنجاح!` 
        : `Company "${nameEn}" added and plan "${selectedPlan.nameEn}" activated successfully!`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-500" />
            {isAr ? "إضافة شركة جديدة للمنصة" : "Add New SaaS Company"}
          </h3>
          <button
            type="button"
            onClick={() => setShowAddCompanyModal(false)}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "اسم الشركة (عربي)" : "Company Name (Arabic)"}</label>
              <input
                type="text"
                required
                placeholder="مثال: عقارات الرياض"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input text-sm text-right"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "اسم الشركة (إنجليزي)" : "Company Name (English)"}</label>
              <input
                type="text"
                required
                placeholder="e.g. Riyadh Real Estate"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="input text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "اسم المالك (عربي)" : "Owner Name (Arabic)"}</label>
              <input
                type="text"
                required
                placeholder="مثال: فهد العتيبي"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="input text-sm text-right"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "اسم المالك (إنجليزي)" : "Owner Name (English)"}</label>
              <input
                type="text"
                required
                placeholder="e.g. Fahd Al-Otaibi"
                value={ownerEn}
                onChange={(e) => setOwnerEn(e.target.value)}
                className="input text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "البريد الإلكتروني" : "Email Address"}</label>
              <input
                type="email"
                required
                placeholder="info@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input text-sm font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "رقم الهاتف" : "Phone Number"}</label>
              <input
                type="text"
                required
                placeholder="+966 50 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input text-sm font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "الدولة (عربي)" : "Country (Arabic)"}</label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input text-sm text-right"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "الدولة (إنجليزي)" : "Country (English)"}</label>
              <input
                type="text"
                required
                value={countryEn}
                onChange={(e) => setCountryEn(e.target.value)}
                className="input text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "باقة الاشتراك" : "Select Subscription Plan"}</label>
              <select
                value={planId}
                onChange={(e) => setPlanId(parseInt(e.target.value))}
                className="input py-2 text-xs font-semibold"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {isAr ? p.name : p.nameEn} ({p.yearly} SAR/yr)
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "حالة الحساب" : "Status"}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="input py-2 text-xs font-semibold"
              >
                <option value="active">{isAr ? "نشط" : "Active"}</option>
                <option value="suspended">{isAr ? "موقوف" : "Suspended"}</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn-accent w-full py-3 mt-3 flex items-center justify-center gap-1.5 font-bold shadow-md cursor-pointer hover:bg-emerald-600"
          >
            <Plus className="w-4 h-4" />
            {isAr ? "تنشيط وإضافة الشركة" : "Activate & Create Company"}
          </button>
        </form>
      </div>
    </div>
  );
}
