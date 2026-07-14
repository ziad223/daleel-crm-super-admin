"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Search, Plus, Filter, Tag, Copy, MoreHorizontal, Trash2, StopCircle } from "lucide-react";
import { toast } from "sonner";

type Coupon = {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  maxUses: number | null; // null means unlimited
  uses: number;
  startDate: string;
  endDate: string | null;
  status: "active" | "expired" | "disabled";
};

const mockCoupons: Coupon[] = [
  { id: 1, code: "WELCOME20", type: "percentage", value: 20, maxUses: 100, uses: 45, startDate: "2026-01-01", endDate: "2026-12-31", status: "active" },
  { id: 2, code: "BLACKFRIDAY", type: "percentage", value: 50, maxUses: null, uses: 320, startDate: "2026-11-20", endDate: "2026-11-30", status: "expired" },
  { id: 3, code: "FLAT500", type: "fixed", value: 500, maxUses: 50, uses: 50, startDate: "2026-05-01", endDate: null, status: "disabled" },
];

export default function CouponsPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";
  
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for new coupon
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<"percentage" | "fixed">("percentage");
  const [newValue, setNewValue] = useState("");
  const [newMaxUses, setNewMaxUses] = useState("");
  const [newEndDate, setNewEndDate] = useState("");

  const filtered = coupons.filter(c => c.code.toLowerCase().includes(search.toLowerCase()));

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(isAr ? "تم نسخ كود الخصم!" : "Promo code copied!");
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newValue) return;
    
    const newCoupon: Coupon = {
      id: Date.now(),
      code: newCode.toUpperCase(),
      type: newType,
      value: Number(newValue),
      maxUses: newMaxUses ? Number(newMaxUses) : null,
      uses: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: newEndDate || null,
      status: "active"
    };

    setCoupons([newCoupon, ...coupons]);
    setShowAddModal(false);
    toast.success(isAr ? "تم إنشاء الكوبون بنجاح!" : "Coupon created successfully!");
    
    // reset
    setNewCode(""); setNewValue(""); setNewMaxUses(""); setNewEndDate("");
  };

  const toggleStatus = (id: number) => {
    setCoupons(prev => prev.map(c => {
      if (c.id === id && c.status !== "expired") {
        const nextStatus = c.status === "active" ? "disabled" : "active";
        toast.info(isAr ? `تم ${nextStatus === "active" ? "تفعيل" : "إيقاف"} الكوبون` : `Coupon ${nextStatus}`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const deleteCoupon = (id: number) => {
    if (confirm(isAr ? "تأكيد حذف الكوبون؟" : "Confirm delete?")) {
      setCoupons(prev => prev.filter(c => c.id !== id));
      toast.success(isAr ? "تم الحذف" : "Deleted");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Tag className="w-6 h-6 text-emerald-600" />
            {isAr ? "الكوبونات والخصومات" : "Coupons & Promotions"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isAr ? "إدارة أكواد الخصم والحملات الترويجية للمنصة" : "Manage promotional codes and discount campaigns"}
          </p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" /> {isAr ? "إنشاء كوبون جديد" : "Create New Coupon"}
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card p-5">
          <h3 className="text-slate-500 text-sm font-medium mb-1">{isAr ? "إجمالي الكوبونات النشطة" : "Total Active Coupons"}</h3>
          <p className="text-2xl font-bold text-emerald-600">{coupons.filter(c => c.status === "active").length}</p>
        </div>
        <div className="stat-card p-5">
          <h3 className="text-slate-500 text-sm font-medium mb-1">{isAr ? "إجمالي مرات الاستخدام" : "Total Redemptions"}</h3>
          <p className="text-2xl font-bold text-blue-600">{coupons.reduce((sum, c) => sum + c.uses, 0)}</p>
        </div>
        <div className="stat-card p-5">
          <h3 className="text-slate-500 text-sm font-medium mb-1">{isAr ? "كوبونات منتهية الصلاحية" : "Expired Coupons"}</h3>
          <p className="text-2xl font-bold text-slate-600">{coupons.filter(c => c.status === "expired" || c.status === "disabled").length}</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="stat-card">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className={`absolute top-2.5 w-4 h-4 text-slate-400 ${isAr ? 'right-3' : 'left-3'}`} />
            <input 
              type="text" 
              placeholder={isAr ? "البحث برمز الكوبون..." : "Search by code..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`form-input w-full ${isAr ? 'pr-9' : 'pl-9'} py-2 text-sm bg-slate-50`}
            />
          </div>
          <button className="btn btn-outline btn-sm whitespace-nowrap cursor-pointer text-slate-600 border-slate-200">
            <Filter className="w-4 h-4 mr-1.5" /> {isAr ? "فلترة متقدمة" : "Advanced Filter"}
          </button>
        </div>

        <div className="table-wrap">
          <div className="overflow-x-auto w-full">
            <table className="data-table min-w-max">
              <thead>
                <tr>
                  <th>{isAr ? "رمز الكوبون" : "Promo Code"}</th>
                  <th>{isAr ? "قيمة الخصم" : "Discount Value"}</th>
                  <th>{isAr ? "الاستخدام" : "Usage"}</th>
                  <th>{isAr ? "تاريخ البدء" : "Start Date"}</th>
                  <th>{isAr ? "تاريخ الانتهاء" : "End Date"}</th>
                  <th>{isAr ? "الحالة" : "Status"}</th>
                  <th>{isAr ? "الإجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm bg-slate-100 px-2 py-1 rounded border border-slate-200">
                          {c.code}
                        </span>
                        <button onClick={() => handleCopyCode(c.code)} className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer" title={isAr ? "نسخ" : "Copy"}>
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="font-medium">
                      {c.type === "percentage" ? `${c.value}%` : `${c.value} SAR`}
                    </td>
                    <td>
                      <div className="text-sm">
                        <span className="font-medium">{c.uses}</span>
                        <span className="text-slate-400 text-xs ml-1">
                          / {c.maxUses ? c.maxUses : "∞"}
                        </span>
                      </div>
                      {c.maxUses && (
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full ${c.uses >= c.maxUses ? 'bg-red-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${Math.min(100, (c.uses / c.maxUses) * 100)}%` }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="text-sm text-slate-500">{c.startDate}</td>
                    <td className="text-sm text-slate-500">{c.endDate || "---"}</td>
                    <td>
                      <span className={`badge ${
                        c.status === "active" ? "badge-success" : 
                        c.status === "expired" ? "badge-neutral" : "badge-danger"
                      }`}>
                        {c.status === "active" ? (isAr ? "نشط" : "Active") : 
                         c.status === "expired" ? (isAr ? "منتهي" : "Expired") : (isAr ? "موقوف" : "Disabled")}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleStatus(c.id)} disabled={c.status === "expired"} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${c.status === "expired" ? "text-slate-300 cursor-not-allowed" : "hover:bg-slate-100 text-slate-600"}`} title={isAr ? "تغيير الحالة" : "Toggle Status"}>
                          <StopCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteCoupon(c.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors cursor-pointer" title={isAr ? "حذف" : "Delete"}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">
                      {isAr ? "لا توجد كوبونات" : "No coupons found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg">{isAr ? "إنشاء كوبون خصم جديد" : "Create New Promo Code"}</h3>
            </div>
            
            <form onSubmit={handleAddCoupon} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">{isAr ? "رمز الكوبون *" : "Promo Code *"}</label>
                <input 
                  type="text" 
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase().replace(/\s/g, ""))}
                  placeholder="e.g. SUMMER20"
                  className="form-input w-full font-mono uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">{isAr ? "نوع الخصم" : "Discount Type"}</label>
                  <select 
                    value={newType} 
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="form-input w-full"
                  >
                    <option value="percentage">{isAr ? "نسبة مئوية (%)" : "Percentage (%)"}</option>
                    <option value="fixed">{isAr ? "مبلغ ثابت" : "Fixed Amount"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">{isAr ? "قيمة الخصم *" : "Discount Value *"}</label>
                  <input 
                    type="number" 
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="e.g. 20"
                    min="1"
                    className="form-input w-full"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700">{isAr ? "الحد الأقصى للاستخدام" : "Max Uses limit"}</label>
                  <input 
                    type="number" 
                    value={newMaxUses}
                    onChange={(e) => setNewMaxUses(e.target.value)}
                    placeholder={isAr ? "اتركه فارغاً لعدد لا محدود" : "Leave empty for unlimited"}
                    min="1"
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700">{isAr ? "تاريخ الانتهاء" : "End Date"}</label>
                  <input 
                    type="date" 
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="form-input w-full"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline flex-1 cursor-pointer">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button type="submit" className="btn bg-emerald-600 hover:bg-emerald-700 text-white flex-1 cursor-pointer">
                  {isAr ? "حفظ وإنشاء" : "Save & Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
