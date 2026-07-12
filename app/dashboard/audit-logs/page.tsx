"use client";

import React, { useState, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ClipboardList, Search, Download, ShieldAlert, Monitor, Globe, X, User, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

type LogItem = {
  id: number;
  user: string;
  userEmail: string;
  action: string;
  actionAr: string;
  ip: string;
  device: string;
  timestamp: string;
  category: "auth" | "company" | "billing" | "system" | "ai";
};

const initialLogs: LogItem[] = [
  { id: 1, user: "أحمد الراشد", userEmail: "ahmed@daleelcrm.com", action: "Updated AI Limits for Professional Plan", actionAr: "تحديث حدود الذكاء الاصطناعي للباقة الاحترافية", ip: "192.168.1.45", device: "Chrome / Windows 11", timestamp: "2026-07-11 14:32", category: "ai" },
  { id: 2, user: "نورة السعيد", userEmail: "noura@daleelcrm.com", action: "Resolved Ticket TKT-1031", actionAr: "إغلاق وحل تذكرة الدعم TKT-1031", ip: "192.168.1.12", device: "Safari / macOS", timestamp: "2026-07-11 12:15", category: "system" },
  { id: 3, user: "خالد المالكي", userEmail: "khaled@daleelcrm.com", action: "Processed Refund for Inv-2026-0850", actionAr: "معالجة عملية استرجاع فاتورة Inv-2026-0850", ip: "192.168.1.98", device: "Firefox / Ubuntu", timestamp: "2026-07-11 11:45", category: "billing" },
  { id: 4, user: "أحمد الراشد", userEmail: "ahmed@daleelcrm.com", action: "Suspended Company 'Noor Clinics'", actionAr: "تعليق حساب شركة 'عيادات النور'", ip: "192.168.1.45", device: "Chrome / Windows 11", timestamp: "2026-07-11 09:30", category: "company" },
  { id: 5, user: "سارة العتيبي", userEmail: "sara@daleelcrm.com", action: "Logged in successfully", actionAr: "تسجيل الدخول للنظام بنجاح", ip: "10.0.4.15", device: "Edge / Windows 10", timestamp: "2026-07-10 16:45", category: "auth" },
  { id: 6, user: "خالد المالكي", userEmail: "khaled@daleelcrm.com", action: "Created manual database backup", actionAr: "إنشاء نسخة احتياطية يدوية لقواعد البيانات", ip: "192.168.1.98", device: "Firefox / Ubuntu", timestamp: "2026-07-10 14:02", category: "system" },
  { id: 7, user: "نورة السعيد", userEmail: "noura@daleelcrm.com", action: "Added company 'Fast Shipping Co'", actionAr: "إضافة شركة جديدة 'شركة الشحن السريع'", ip: "192.168.1.12", device: "Safari / macOS", timestamp: "2026-07-10 10:20", category: "company" }
];

function AuditLogsContent() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";

  const [logs] = useState<LogItem[]>(initialLogs);
  const [filterCategory, setFilterCategory] = useState<"all" | "auth" | "company" | "billing" | "system" | "ai">("all");
  
  // Custom operational modals states (No window alerts!)
  const [viewingLog, setViewingLog] = useState<LogItem | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const handleSearchChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleExport = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "User,Email,Action,Category,IP Address,Device,Timestamp\n";
      
      logs.forEach(l => {
        const actionText = isAr ? l.actionAr : l.action;
        csvContent += `"${l.user}","${l.userEmail}","${actionText}","${l.category}","${l.ip}","${l.device}","${l.timestamp}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "daleel_crm_audit_logs.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      toast.success(isAr ? "تم تصدير سجل العمليات بنجاح" : "Audit logs exported successfully!");
    }, 1500);
  };

  const filtered = logs.filter(l => {
    const term = search.toLowerCase();
    const matchesSearch = l.user.toLowerCase().includes(term) ||
      l.userEmail.toLowerCase().includes(term) ||
      (isAr ? l.actionAr : l.action).toLowerCase().includes(term);

    const matchesCategory = filterCategory === "all" || l.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <p className="text-sm text-slate-500">
          {isAr
            ? "تتبع تفصيلي لجميع أنشطة وعمليات المشرفين والموظفين على المنصة لأغراض الحماية والتدقيق"
            : "Platform-wide chronological ledger tracking administrative sessions, configuration adjustments, and database operations"}
        </p>

        <button onClick={handleExport} className="btn-outline btn-sm self-start sm:self-auto cursor-pointer flex items-center gap-1.5">
          <Download className="w-4 h-4" /> {isAr ? "تصدير السجل" : "Export Logs"}
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" style={{ [isAr ? "right" : "left"]: 12 }} />
          <input
            type="text"
            placeholder={isAr ? "ابحث بالاسم، البريد أو العملية..." : "Search user, email, or action..."}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="input"
            style={{ paddingInlineStart: 36 }}
          />
        </div>
        <div className="flex gap-2">
          {["all", "auth", "company", "billing", "system", "ai"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat as any)}
              className={`btn-outline btn-sm cursor-pointer capitalize ${
                filterCategory === cat ? "bg-slate-100 font-bold border-slate-350 text-slate-900" : ""
              }`}
            >
              {cat === "all" ? (isAr ? "الكل" : "All") : 
               cat === "auth" ? (isAr ? "دخول" : "Auth") :
               cat === "company" ? (isAr ? "الشركات" : "Companies") :
               cat === "billing" ? (isAr ? "المالية" : "Billing") :
               cat === "system" ? (isAr ? "النظام" : "System") : "AI"}
            </button>
          ))}
        </div>
      </div>

      {/* Table List */}
      <div className="table-wrap overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>{isAr ? "المشرف" : "User"}</th>
              <th>{isAr ? "العملية" : "Activity / Action"}</th>
              <th>{isAr ? "التصنيف" : "Category"}</th>
              <th>{isAr ? "عنوان IP" : "IP Address"}</th>
              <th>{isAr ? "الجهاز" : "Device / Platform"}</th>
              <th>{isAr ? "الوقت" : "Timestamp"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr 
                key={log.id} 
                onClick={() => setViewingLog(log)} 
                className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                title={isAr ? "اضغط لعرض تفاصيل العملية" : "Click to view audit details"}
              >
                <td>
                  <div>
                    <div className="font-semibold text-slate-700">{log.user}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{log.userEmail}</div>
                  </div>
                </td>
                <td className="max-w-xs truncate font-medium text-slate-750">
                  {isAr ? log.actionAr : log.action}
                </td>
                <td>
                  <span className={`badge ${
                    log.category === "auth" ? "badge-info" :
                    log.category === "ai" ? "badge-success" :
                    log.category === "company" ? "badge-neutral" :
                    log.category === "billing" ? "badge-warning" : "badge-danger"
                  }`}>
                    {log.category.toUpperCase()}
                  </span>
                </td>
                <td className="text-xs text-slate-500 font-mono">
                  <span className="inline-flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-400" />
                    {log.ip}
                  </span>
                </td>
                <td className="text-xs text-slate-500 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <Monitor className="w-3 h-3 text-slate-400" />
                    {log.device}
                  </span>
                </td>
                <td className="text-xs text-slate-400 font-mono">{log.timestamp}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400 text-sm font-medium">
                  {isAr ? "لا توجد عمليات مطابقة في السجل" : "No audit trail records match the criteria"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Log Details Modal */}
      {viewingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[var(--primary)]" />
                {isAr ? "تفاصيل سجل التدقيق والعملية" : "Detailed Activity Audit Log"}
              </h3>
              <button 
                type="button" 
                onClick={() => setViewingLog(null)} 
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isAr ? "العملية المنفذة" : "Action Performed"}</p>
                <p className="text-sm font-bold text-slate-800 leading-relaxed">
                  {isAr ? viewingLog.actionAr : viewingLog.action}
                </p>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-400 font-semibold flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-450" />
                    {isAr ? "المشرف المسؤول" : "Administrator"}
                  </span>
                  <div className="text-end">
                    <span className="font-bold text-slate-700 block">{viewingLog.user}</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{viewingLog.userEmail}</span>
                  </div>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-400 font-semibold">{isAr ? "تصنيف العملية" : "Category"}</span>
                  <span className="badge badge-info">{viewingLog.category.toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-400 font-semibold">{isAr ? "توقيت العملية" : "Execution Timestamp"}</span>
                  <span className="text-slate-750 font-mono font-medium">{viewingLog.timestamp}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-400 font-semibold">{isAr ? "عنوان الـ IP" : "Network Address"}</span>
                  <span className="text-slate-700 font-mono font-medium">{viewingLog.ip}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-400 font-semibold">{isAr ? "نظام التشغيل والمتصفح" : "Browser User Agent"}</span>
                  <span className="text-slate-705 font-medium">{viewingLog.device}</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-3 flex gap-2.5 border border-blue-100 text-[11px] text-blue-800">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="font-bold">{isAr ? "عملية مدققة وموثقة" : "Cryptographically Signed"}</p>
                  <p className="mt-0.5 leading-relaxed">
                    {isAr 
                      ? "هذه العملية مسجلة في سجل تدقيق النظام المشفر ولا يمكن تعديلها أو حذفها لأغراض النزاهة والأمان." 
                      : "This log entry is immutable and stored securely for audit compliance requirements."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Loader Overlay */}
      {isExporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100 p-5 space-y-3 text-center">
            <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto" />
            <div>
              <h4 className="font-bold text-slate-800 text-sm">{isAr ? "جاري استخراج السجل..." : "Compiling Audit Ledger..."}</h4>
              <p className="text-xs text-slate-400 mt-1">{isAr ? "جاري تجميع حركات المشرفين وتصديرها كملف CSV..." : "Retrieving administrative events into CSV formatted columns..."}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuditLogsPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-slate-500 font-medium">Loading audit logs...</div>}>
      <AuditLogsContent />
    </Suspense>
  );
}
