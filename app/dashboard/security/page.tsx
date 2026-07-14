"use client";

import { Shield, ShieldAlert, Ban, Activity, Key, Search, Filter } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function SecurityPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{isAr ? "الأمان وجدار الحماية" : "Security & Firewall"}</h1>
          <p className="text-slate-500 mt-1">{isAr ? "إدارة الوصول، والـ IPs المحظورة، ومحاولات الدخول." : "Manage access, banned IPs, and login attempts."}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{isAr ? "الـ IPs المحظورة" : "Banned IPs"}</p>
              <p className="text-xl font-bold">12</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{isAr ? "الـ IPs الموثوقة (Whitelist)" : "Whitelisted IPs"}</p>
              <p className="text-xl font-bold">5</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{isAr ? "محاولات دخول فاشلة (اليوم)" : "Failed Logins (Today)"}</p>
              <p className="text-xl font-bold">47</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="table-wrap">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <h3 className="font-bold text-base">{isAr ? "سجل محاولات الدخول" : "Login Attempts Log"}</h3>
            <div className="flex items-center gap-2">
              <button className="btn btn-outline text-sm py-1.5"><Filter className="w-4 h-4 mr-2" /> {isAr ? "تصفية" : "Filter"}</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isAr ? "المستخدم/الشركة" : "User/Company"}</th>
                  <th>{isAr ? "IP Address" : "IP Address"}</th>
                  <th>{isAr ? "الحالة" : "Status"}</th>
                  <th>{isAr ? "التاريخ والوقت" : "Date & Time"}</th>
                  <th className="text-end">{isAr ? "إجراء" : "Action"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium text-sm">admin@daleel.com</td>
                  <td className="text-sm text-slate-600">192.168.1.1</td>
                  <td><span className="badge badge-success text-[10px]">Success</span></td>
                  <td className="text-sm text-slate-500">2026-07-14 10:23 AM</td>
                  <td className="text-end"></td>
                </tr>
                <tr>
                  <td className="font-medium text-sm">unknown</td>
                  <td className="text-sm text-slate-600">45.22.11.9</td>
                  <td><span className="badge badge-danger text-[10px]">Failed (Wrong Password)</span></td>
                  <td className="text-sm text-slate-500">2026-07-14 09:12 AM</td>
                  <td className="text-end"><button className="text-xs text-red-600 hover:underline">{isAr ? "حظر الـ IP" : "Ban IP"}</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      {/* Security Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        <div className="stat-card p-5 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-slate-800">{isAr ? "المصادقة الثنائية (2FA)" : "Enforce 2FA"}</h3>
              <p className="text-sm text-slate-500 mt-1">
                {isAr ? "إجبار جميع المشرفين ومدراء الشركات على استخدام المصادقة الثنائية." : "Force all admins and company owners to use 2FA."}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        <div className="stat-card p-5 border-l-4 border-l-purple-500">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-slate-800">{isAr ? "حماية جدار الحماية (WAF)" : "Web Application Firewall"}</h3>
              <p className="text-sm text-slate-500 mt-1">
                {isAr ? "تفعيل الحماية المتقدمة ضد هجمات DDoS والطلبات الخبيثة." : "Enable advanced protection against DDoS and malicious requests."}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
