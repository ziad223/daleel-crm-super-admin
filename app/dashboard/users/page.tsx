"use client";

import React, { useState } from "react";
import { Plus, MoreHorizontal, KeyRound, Trash2, X, UserCheck, Save, Loader2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/context/DataContext";
import { toast } from "sonner";

type AdminUser = {
  id: number;
  name: string;
  nameEn: string;
  email: string;
  role: string;
  roleAr: string;
  status: string;
  lastLogin: string;
};

export default function AdminUsersPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";
  const { adminUsers, setAdminUsers } = useData();

  // Modals / Selection states
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [resettingUser, setResettingUser] = useState<AdminUser | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState("");

  // Add User Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Support");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const handleToggleStatus = (id: number) => {
    setAdminUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === "active" ? "inactive" : "active";
        toast.success(
          isAr 
            ? `تم ${nextStatus === "active" ? "تفعيل" : "تعطيل"} حساب المشرف "${u.name}"` 
            : `User account status set to ${nextStatus}`
        );
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const startResetPasswordFlow = (u: AdminUser) => {
    const generatedPass = Math.random().toString(36).slice(-8);
    setResettingUser(u);
    setGeneratedPassword(generatedPass);
  };

  const confirmDeleteUser = () => {
    if (!deletingUser) return;
    setAdminUsers(prev => prev.filter(u => u.id !== deletingUser.id));
    toast.success(
      isAr 
        ? `تم حذف حساب المشرف "${deletingUser.name}" بنجاح` 
        : `User "${deletingUser.name}" deleted successfully`
    );
    setDeletingUser(null);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (adminUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error(isAr ? "هذا البريد الإلكتروني مسجل بالفعل" : "This email address is already registered.");
      return;
    }

    const roleMapAr: Record<string, string> = {
      "Super Admin": "مدير للنظام",
      "Support": "الدعم الفني",
      "Finance": "المالية",
      "Sales": "المبيعات",
      "Developer": "مطور النظام"
    };

    const newUser: AdminUser = {
      id: Date.now(),
      name: name.trim(),
      nameEn: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      roleAr: roleMapAr[role] || "مشرف نظام",
      status,
      lastLogin: "-"
    };

    setAdminUsers([newUser, ...adminUsers]);
    setName("");
    setEmail("");
    setShowAddModal(false);
    toast.success(
      isAr 
        ? `تم إضافة المشرف "${newUser.name}" بنجاح!` 
        : `Administrator "${newUser.name}" added successfully!`
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{isAr ? "مشرفو منصة دليل الشرق CRM" : "Daleel Al Sharq CRM platform administrators"}</p>
        <button onClick={() => setShowAddModal(true)} className="btn-accent cursor-pointer flex items-center gap-1"><Plus className="w-4 h-4" /> {t("add")}</button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>{isAr ? "اسم المشرف" : "Name"}</th>
              <th>{isAr ? "البريد الإلكتروني" : "Email"}</th>
              <th>{isAr ? "الدور" : "Role"}</th>
              <th>{isAr ? "آخر دخول" : "Last Login"}</th>
              <th>{t("status")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.map((u) => (
              <tr key={u.id}>
                <td className="font-medium">{u.name}</td>
                <td className="font-mono text-sm text-slate-600">{u.email}</td>
                <td>
                  <span className={`badge ${
                    u.role === "Super Admin" ? "badge-danger" : 
                    u.role === "Developer" ? "badge-info" : 
                    "badge-neutral"
                  }`}>
                    {isAr ? u.roleAr : u.role}
                  </span>
                </td>
                <td className="text-sm text-slate-500">{u.lastLogin}</td>
                <td>
                  <button 
                    onClick={() => handleToggleStatus(u.id)}
                    className={`badge transition-all cursor-pointer hover:scale-105 active:scale-95 ${u.status === "active" ? "badge-success" : "badge-neutral"}`}
                    title={isAr ? "اضغط للتبديل" : "Click to toggle"}
                  >
                    {u.status === "active" ? (isAr ? "نشط" : "Active") : (isAr ? "معطل" : "Disabled")}
                  </button>
                </td>
                <td>
                  <div className="flex gap-0.5">
                    <button 
                      onClick={() => startResetPasswordFlow(u)} 
                      className="p-1.5 hover:bg-amber-50 rounded-lg text-amber-600 cursor-pointer transition-colors" 
                      title={isAr ? "إعادة تعيين كلمة المرور" : "Reset Password"}
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(u.id)} 
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer transition-colors" 
                      title={u.status === "active" ? (isAr ? "تعطيل الحساب" : "Activate Account") : (isAr ? "تفعيل الحساب" : "Disable Account")}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setDeletingUser(u)} 
                      className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 cursor-pointer transition-colors" 
                      title={isAr ? "حذف المشرف" : "Delete Account"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Administrator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">{isAr ? "إضافة مشرف نظام جديد" : "Add Admin Account"}</h3>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">{isAr ? "الاسم الكامل" : "Full Name"}</label>
                <input 
                  type="text" 
                  required 
                  placeholder={isAr ? "مثال: عبد الرحمن السديري" : "e.g. John Doe"}
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="input text-sm text-right" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">{isAr ? "البريد الإلكتروني" : "Email Address"}</label>
                <input 
                  type="email" 
                  required 
                  placeholder="admin@daleelcrm.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="input text-sm font-mono" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "صلاحية الدور" : "Admin Role"}</label>
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    className="input text-xs font-semibold py-2"
                  >
                    <option value="Super Admin">{isAr ? "مدير النظام" : "Super Admin"}</option>
                    <option value="Support">{isAr ? "الدعم الفني" : "Support"}</option>
                    <option value="Finance">{isAr ? "المالية" : "Finance"}</option>
                    <option value="Sales">{isAr ? "المبيعات" : "Sales"}</option>
                    <option value="Developer">{isAr ? "مطور" : "Developer"}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "الحالة" : "Status"}</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="input text-xs font-semibold py-2"
                  >
                    <option value="active">{isAr ? "نشط" : "Active"}</option>
                    <option value="inactive">{isAr ? "معطل" : "Disabled"}</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-accent w-full py-3 mt-3 flex items-center justify-center gap-1.5 font-bold shadow-md cursor-pointer">
                <Plus className="w-4 h-4" /> {isAr ? "إنشاء الحساب وتوليد الباسورد" : "Create Account & Password"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal Confirmation */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100 p-5 space-y-4 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500 border border-red-100">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">
                {isAr ? "تأكيد حذف المشرف" : "Confirm Administrator Deletion"}
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {isAr 
                  ? `هل أنت متأكد من حذف حساب المشرف "${deletingUser.name}" نهائياً من المنصة؟ لن تتمكن من استرجاع هذا الحساب بعد الحذف.`
                  : `Are you sure you want to permanently delete "${deletingUser.name}"? This action cannot be undone.`}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="btn-outline flex-1 cursor-pointer btn-sm"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
                className="btn-danger bg-red-600 hover:bg-red-700 text-white flex-1 cursor-pointer btn-sm"
              >
                {isAr ? "حذف الحساب" : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Success Modal */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100 p-5 space-y-4 text-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">
                {isAr ? "تم إعادة تعيين كلمة المرور" : "Password Reset Successfully"}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {isAr 
                  ? `تم توليد كلمة مرور مؤقتة جديدة للمشرف "${resettingUser.name}"`
                  : `A new temporary password has been generated for "${resettingUser.name}"`}
              </p>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">{isAr ? "كلمة المرور المؤقتة" : "Temporary Password"}</span>
              <span className="text-xl font-bold font-mono text-slate-800 select-all tracking-wide mt-1.5">{generatedPassword}</span>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              {isAr 
                ? "يرجى نسخ كلمة المرور السابقة وإرسالها للمشرف للدخول بها وتغييرها عند تسجيل الدخول الأول." 
                : "Please copy this password and send it securely to the administrator."}
            </p>

            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedPassword);
                toast.success(isAr ? "تم نسخ كلمة المرور!" : "Password copied to clipboard!");
                setResettingUser(null);
              }}
              className="btn-primary cursor-pointer w-full py-2.5"
            >
              {isAr ? "نسخ كلمة المرور وإغلاق" : "Copy Password & Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
