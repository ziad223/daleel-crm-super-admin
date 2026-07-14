"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Activity, Cpu, HardDrive, Server, CheckCircle2, AlertTriangle, RefreshCw, Clock } from "lucide-react";

export default function SystemHealthPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            {isAr ? "حالة النظام والأداء" : "System Health & Performance"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isAr ? "مراقبة حية لاستهلاك الموارد ومهام الخلفية (Cron Jobs)" : "Live monitoring of resource usage and background tasks"}
          </p>
        </div>
        <button className="btn btn-outline text-sm">
          <RefreshCw className="w-4 h-4 mr-2" /> {isAr ? "تحديث الآن" : "Refresh Now"}
        </button>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="stat-card p-5 border-t-4 border-t-blue-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-bold text-slate-500">{isAr ? "استهلاك المعالج" : "CPU Usage"}</p>
              <h2 className="text-2xl font-black text-slate-800 mt-1">34%</h2>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Cpu className="w-6 h-6" /></div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "34%" }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-right">4 Cores / 8 Threads</p>
        </div>

        <div className="stat-card p-5 border-t-4 border-t-purple-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-bold text-slate-500">{isAr ? "الذاكرة العشوائية" : "RAM Usage"}</p>
              <h2 className="text-2xl font-black text-slate-800 mt-1">12.4 GB</h2>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl"><HardDrive className="w-6 h-6" /></div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: "75%" }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-right">16 GB Total (75%)</p>
        </div>

        <div className="stat-card p-5 border-t-4 border-t-emerald-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-bold text-slate-500">{isAr ? "حالة السيرفر" : "Server Status"}</p>
              <h2 className="text-xl font-bold text-emerald-600 mt-1 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                {isAr ? "متصل ويعمل بامتياز" : "Online & Healthy"}
              </h2>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><Server className="w-6 h-6" /></div>
          </div>
          <p className="text-sm text-slate-500 mt-4 border-t border-slate-100 pt-3">
            Uptime: <span className="font-mono font-bold text-slate-700">45d 12h 30m</span>
          </p>
        </div>
      </div>

      {/* Cron Jobs */}
      <div className="stat-card overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-600" />
          <h2 className="font-bold text-slate-800">{isAr ? "مهام الخلفية (Cron Jobs)" : "Background Tasks"}</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>{isAr ? "المهمة" : "Task Name"}</th>
                <th>{isAr ? "الوصف" : "Description"}</th>
                <th>{isAr ? "التكرار" : "Schedule"}</th>
                <th>{isAr ? "آخر تشغيل" : "Last Run"}</th>
                <th>{isAr ? "الحالة" : "Status"}</th>
                <th className="text-end">{isAr ? "الإجراء" : "Action"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold text-slate-800">Auto_Renew_Subs</td>
                <td className="text-sm text-slate-500">{isAr ? "تجديد اشتراكات الشركات التلقائي" : "Process auto-renewal payments"}</td>
                <td className="font-mono text-sm">0 0 * * * (Daily)</td>
                <td className="text-sm">Today, 00:00 AM</td>
                <td><span className="badge badge-success"><CheckCircle2 className="w-3 h-3 mr-1" /> Success</span></td>
                <td className="text-end"><button className="text-sm text-blue-600 hover:underline">{isAr ? "تشغيل الآن" : "Run Now"}</button></td>
              </tr>
              <tr>
                <td className="font-bold text-slate-800">Daily_DB_Backup</td>
                <td className="text-sm text-slate-500">{isAr ? "نسخ احتياطي لقاعدة البيانات" : "Full database backup"}</td>
                <td className="font-mono text-sm">0 2 * * * (Daily)</td>
                <td className="text-sm">Today, 02:00 AM</td>
                <td><span className="badge badge-success"><CheckCircle2 className="w-3 h-3 mr-1" /> Success</span></td>
                <td className="text-end"><button className="text-sm text-blue-600 hover:underline">{isAr ? "تشغيل الآن" : "Run Now"}</button></td>
              </tr>
              <tr>
                <td className="font-bold text-slate-800">Generate_Invoices</td>
                <td className="text-sm text-slate-500">{isAr ? "إصدار الفواتير الشهرية المعلقة" : "Generate pending monthly invoices"}</td>
                <td className="font-mono text-sm">0 8 1 * * (Monthly)</td>
                <td className="text-sm">July 1st, 08:00 AM</td>
                <td><span className="badge badge-danger"><AlertTriangle className="w-3 h-3 mr-1" /> Failed</span></td>
                <td className="text-end"><button className="text-sm text-blue-600 hover:underline">{isAr ? "إعادة التشغيل" : "Retry"}</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
