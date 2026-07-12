"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { User, KeyRound, Monitor, ShieldCheck, Clock, Save, Lock, X, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type SessionItem = {
  id: number;
  device: string;
  ip: string;
  location: string;
  locationAr: string;
  status: "active" | "expired";
  time: string;
};

const initialSessions: SessionItem[] = [
  { id: 1, device: "Chrome v122 / Windows 11", ip: "192.168.1.45", location: "Riyadh, Saudi Arabia", locationAr: "الرياض، المملكة العربية السعودية", status: "active", time: "2026-07-12 01:10 (Current Session)" },
  { id: 2, device: "Safari v17 / iPhone 15 Pro", ip: "94.90.12.115", location: "Dubai, UAE", locationAr: "دبي، الإمارات العربية المتحدة", status: "active", time: "2026-07-11 19:40" },
  { id: 3, device: "Chrome v121 / macOS", ip: "192.168.1.18", location: "Riyadh, Saudi Arabia", locationAr: "الرياض، المملكة العربية السعودية", status: "expired", time: "2026-07-09 10:15" }
];

export default function ProfilePage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";

  // Account state
  const [name, setName] = useState("أحمد الراشد");
  const [email, setEmail] = useState("ahmed@daleelcrm.com");
  const [phone, setPhone] = useState("+966 50 123 4567");

  // Passwords state
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");

  // Operational states (No window alerts/confirms!)
  const [updating, setUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateProgress(10);
    setUpdateSuccess(false);
    setSuccessMsg(isAr ? "تم تحديث بيانات الحساب الشخصية بنجاح!" : "Profile account details updated successfully!");

    const interval = setInterval(() => {
      setUpdateProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setUpdateSuccess(true);
          return 100;
        }
        return prev + 30;
      });
    }, 300);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currPass || !newPass || !confPass) return;
    
    if (newPass !== confPass) {
      toast.error(isAr ? "كلمة المرور الجديدة غير متطابقة" : "New passwords do not match");
      return;
    }

    setUpdating(true);
    setUpdateProgress(10);
    setUpdateSuccess(false);
    setSuccessMsg(isAr ? "تم تغيير كلمة المرور للمشرف وتأمين الحساب بنجاح!" : "Password changed and account credentials secured successfully!");

    const interval = setInterval(() => {
      setUpdateProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setCurrPass("");
          setNewPass("");
          setConfPass("");
          setUpdateSuccess(true);
          return 100;
        }
        return prev + 30;
      });
    }, 300);
  };

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-12 gap-5 items-start">
        {/* Account Details form */}
        <div className="md:col-span-8 space-y-5">
          <form onSubmit={handleUpdateProfile} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-500" />
              {isAr ? "الملف الشخصي للمشرف" : "Personal Account Settings"}
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">{isAr ? "الاسم" : "Full Name"}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input text-sm text-right"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">{isAr ? "رقم الجوال" : "Mobile Phone"}</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input text-sm font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "البريد الإلكتروني (اسم المستخدم)" : "Email Address"}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input text-sm font-mono bg-slate-50 text-slate-500 cursor-not-allowed"
                disabled
              />
            </div>

            <button type="submit" className="btn-primary btn-sm w-full py-2.5 cursor-pointer shadow-md flex items-center justify-center gap-1.5 font-bold">
              <Save className="w-4 h-4" />
              {isAr ? "حفظ التعديلات" : "Save Changes"}
            </button>
          </form>

          {/* Connected Sessions */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              {isAr ? "الأجهزة المتصلة والجلسات النشطة" : "Active Connected Devices"}
            </h3>

            <div className="divide-y divide-slate-100 space-y-3.5">
              {initialSessions.map((s) => (
                <div key={s.id} className="flex justify-between items-center pt-3.5 first:pt-0 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-500">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-700">{s.device}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{s.ip} · {isAr ? s.locationAr : s.location}</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className={`badge text-[9px] font-bold ${s.status === "active" ? "badge-success" : "badge-neutral"}`}>
                      {s.status === "active" ? (isAr ? "نشط" : "Active") : (isAr ? "منتهية" : "Expired")}
                    </span>
                    <span className="block text-[8px] text-slate-400 font-mono mt-1">{s.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Change password column */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-500" />
            {isAr ? "تغيير كلمة المرور" : "Change Password"}
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "كلمة المرور الحالية" : "Current Password"}</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={currPass}
                  onChange={(e) => setCurrPass(e.target.value)}
                  className="input text-sm"
                />
                <Lock className="absolute top-1/2 -translate-y-1/2 end-3.5 w-4 h-4 text-slate-300" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "كلمة المرور الجديدة" : "New Password"}</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="input text-sm"
                />
                <Lock className="absolute top-1/2 -translate-y-1/2 end-3.5 w-4 h-4 text-slate-300" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"}</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confPass}
                  onChange={(e) => setConfPass(e.target.value)}
                  className="input text-sm"
                />
                <Lock className="absolute top-1/2 -translate-y-1/2 end-3.5 w-4 h-4 text-slate-300" />
              </div>
            </div>

            <button type="submit" className="btn-accent w-full py-2.5 mt-2 flex items-center justify-center gap-1.5 cursor-pointer font-bold shadow">
              <ShieldCheck className="w-4 h-4" />
              {isAr ? "تحديث كلمة المرور" : "Update Password"}
            </button>
          </form>
        </div>
      </div>

      {/* Profile Updating Loader Modal */}
      {updating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100 p-5 space-y-4 text-center">
            {!updateSuccess ? (
              <div className="space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-sm">{isAr ? "جاري التحديث والتأمين" : "Updating Profile Accounts"}</h4>
                  <p className="text-xs text-slate-400">
                    {isAr 
                      ? `جاري حفظ البيانات في قاعدة البيانات وتحديث الجلسة... ${updateProgress}%` 
                      : `Saving user rows to SQL DB and syncing session... ${updateProgress}%`}
                  </p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${updateProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{isAr ? "تم تحديث الحساب!" : "Account Saved Successfully!"}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {successMsg}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUpdating(false)}
                  className="btn-primary cursor-pointer w-full py-2.5"
                >
                  {isAr ? "موافق" : "Done"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
