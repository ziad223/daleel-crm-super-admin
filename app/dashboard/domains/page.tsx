"use client";

import React, { useState, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Globe, Plus, CheckCircle, XCircle, RefreshCw, ShieldAlert, ShieldCheck, Trash2, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

type DomainItem = {
  id: number;
  company: string;
  companyEn: string;
  domain: string;
  sslStatus: "active" | "expired" | "pending";
  dnsStatus: "valid" | "invalid" | "pending";
  sslExpiry: string;
  lastChecked: string;
};

const initialDomains: DomainItem[] = [
  { id: 1, company: "عقارات الرياض", companyEn: "Riyadh Real Estate", domain: "portal.riyadh-re.com", sslStatus: "active", dnsStatus: "valid", sslExpiry: "2026-10-15", lastChecked: "2026-07-11 12:30" },
  { id: 2, company: "معهد الشرق للتدريب", companyEn: "East Training Institute", domain: "academy.east-inst.com", sslStatus: "active", dnsStatus: "valid", sslExpiry: "2026-09-08", lastChecked: "2026-07-11 10:15" },
  { id: 3, company: "تسويق الخليج", companyEn: "Gulf Marketing", domain: "crm.gulfmkt.com", sslStatus: "active", dnsStatus: "valid", sslExpiry: "2027-01-20", lastChecked: "2026-07-11 08:00" },
  { id: 4, company: "شركة الشحن السريع", companyEn: "Fast Shipping Co", domain: "track.fastship.sa", sslStatus: "expired", dnsStatus: "valid", sslExpiry: "2026-07-05", lastChecked: "2026-07-11 11:45" },
  { id: 5, company: "عيادات النور", companyEn: "Noor Clinics", domain: "noor-crm.com", sslStatus: "pending", dnsStatus: "invalid", sslExpiry: "-", lastChecked: "2026-07-11 09:30" }
];

function DomainsContent() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";
  
  const [domains, setDomains] = useState<DomainItem[]>(initialDomains);
  const [filterStatus, setFilterStatus] = useState<"all" | "valid" | "invalid" | "expired">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [newCompany, setNewCompany] = useState("");
  
  // Custom operational modals states
  const [deletingDomain, setDeletingDomain] = useState<DomainItem | null>(null);
  const [renewingSSL, setRenewingSSL] = useState<DomainItem | null>(null);
  const [isRenewing, setIsRenewing] = useState(false);
  const [renewSuccess, setRenewSuccess] = useState(false);
  
  const [loadingId, setLoadingId] = useState<number | null>(null);

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

  const handleVerify = (id: number) => {
    setLoadingId(id);
    setTimeout(() => {
      setDomains(prev => prev.map(d => {
        if (d.id === id) {
          toast.success(isAr ? `تم التحقق من DNS للدومين ${d.domain} بنجاح!` : `DNS verification for ${d.domain} succeeded!`);
          return { ...d, dnsStatus: "valid", lastChecked: new Date().toISOString().replace("T", " ").substring(0, 16) };
        }
        return d;
      }));
      setLoadingId(null);
    }, 1500);
  };

  const startRenewSSL = (d: DomainItem) => {
    setRenewingSSL(d);
    setIsRenewing(true);
    setRenewSuccess(false);

    setTimeout(() => {
      setIsRenewing(false);
      setRenewSuccess(true);
      
      // Update in domains array
      setDomains(prev => prev.map(item => {
        if (item.id === d.id) {
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + 365); // 1 Year extension
          return {
            ...item,
            sslStatus: "active" as const,
            sslExpiry: expiry.toISOString().split("T")[0]
          };
        }
        return item;
      }));
    }, 2000);
  };

  const confirmDeleteDomain = () => {
    if (!deletingDomain) return;
    setDomains(prev => prev.filter(d => d.id !== deletingDomain.id));
    toast.success(isAr ? "تم إزالة ربط الدومين بنجاح" : "Domain mapping deleted successfully");
    setDeletingDomain(null);
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim() || !newCompany.trim()) return;

    const newItem: DomainItem = {
      id: Date.now(),
      company: newCompany,
      companyEn: newCompany,
      domain: newDomain.toLowerCase().trim(),
      sslStatus: "pending",
      dnsStatus: "pending",
      sslExpiry: "-",
      lastChecked: "-"
    };

    setDomains([newItem, ...domains]);
    setNewDomain("");
    setNewCompany("");
    setShowAddModal(false);
    toast.success(isAr ? "تم ربط الدومين الجديد بنجاح!" : "New custom domain mapped successfully!");
  };

  const filtered = domains.filter(d => {
    const term = search.toLowerCase();
    const name = isAr ? d.company : d.companyEn;
    const matchesSearch = d.domain.toLowerCase().includes(term) || name.toLowerCase().includes(term);
    
    if (!matchesSearch) return false;
    
    if (filterStatus === "valid") return d.dnsStatus === "valid";
    if (filterStatus === "invalid") return d.dnsStatus === "invalid";
    if (filterStatus === "expired") return d.sslStatus === "expired";
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <p className="text-sm text-slate-500">
          {isAr ? "إدارة الدومينات المخصصة للشركات والتحقق من صحة DNS وشهادات الحماية SSL" : "Manage companies custom domains, verify their DNS records, and track SSL certificates"}
        </p>
        <button onClick={() => setShowAddModal(true)} className="btn-accent btn-sm self-start sm:self-auto cursor-pointer">
          <Plus className="w-4 h-4" /> {isAr ? "ربط دومين جديد" : "Link Custom Domain"}
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Globe className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" style={{ [isAr ? "right" : "left"]: 12 }} />
          <input
            type="text"
            placeholder={isAr ? "البحث عن دومين أو شركة..." : "Search domain or company..."}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="input"
            style={{ paddingInlineStart: 36 }}
          />
        </div>
        <div className="flex gap-2">
          {["all", "valid", "invalid", "expired"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`btn-outline btn-sm cursor-pointer capitalize ${
                filterStatus === status ? "bg-slate-100 font-bold border-slate-350 text-slate-900" : ""
              }`}
            >
              {status === "all" ? (isAr ? "الكل" : "All") : 
               status === "valid" ? (isAr ? "DNS صحيح" : "DNS Valid") :
               status === "invalid" ? (isAr ? "DNS خطأ" : "DNS Mismatch") :
               (isAr ? "SSL منتهية" : "SSL Expired")}
            </button>
          ))}
        </div>
      </div>

      {/* Grid domains */}
      <div className="table-wrap overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("companyName")}</th>
              <th>{isAr ? "الدومين المخصص" : "Custom Domain"}</th>
              <th>{isAr ? "حالة الـ DNS" : "DNS Status"}</th>
              <th>{isAr ? "شهادة SSL" : "SSL Security"}</th>
              <th>{isAr ? "انتهاء شهادة SSL" : "SSL Expiry"}</th>
              <th>{isAr ? "آخر فحص" : "Last Verification"}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id}>
                <td className="font-medium">{isAr ? d.company : d.companyEn}</td>
                <td className="font-mono text-sm font-semibold text-slate-700">{d.domain}</td>
                <td>
                  <span className={`badge ${
                    d.dnsStatus === "valid" ? "badge-success" : 
                    d.dnsStatus === "invalid" ? "badge-danger" : 
                    "badge-neutral"
                  }`}>
                    {d.dnsStatus === "valid" ? (isAr ? "متطابق وصحيح" : "Valid Configuration") : 
                     d.dnsStatus === "invalid" ? (isAr ? "غير متطابق" : "DNS Mismatch") : 
                     (isAr ? "معلق" : "Pending")}
                  </span>
                </td>
                <td>
                  <span className={`badge ${
                    d.sslStatus === "active" ? "badge-success" : 
                    d.sslStatus === "expired" ? "badge-danger" : 
                    "badge-neutral"
                  }`}>
                    {d.sslStatus === "active" ? (isAr ? "نشطة وآمنة" : "Active SSL") : 
                     d.sslStatus === "expired" ? (isAr ? "منتهية الصلاحية" : "Expired SSL") : 
                     (isAr ? "معلقة" : "Pending")}
                  </span>
                </td>
                <td className="text-sm font-mono text-slate-500">{d.sslExpiry}</td>
                <td className="text-xs text-slate-400 font-mono">{d.lastChecked}</td>
                <td>
                  <div className="flex gap-0.5">
                    <button
                      disabled={loadingId === d.id}
                      onClick={() => handleVerify(d.id)}
                      className={`p-1.5 rounded-lg text-blue-600 transition-colors ${
                        loadingId === d.id ? "bg-slate-50 opacity-50 cursor-not-allowed" : "hover:bg-blue-50 cursor-pointer"
                      }`}
                      title={isAr ? "فحص DNS الآن" : "Verify DNS Routing"}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingId === d.id ? "animate-spin" : ""}`} />
                    </button>
                    <button
                      onClick={() => startRenewSSL(d)}
                      disabled={d.sslStatus === "active"}
                      className={`p-1.5 rounded-lg text-emerald-600 transition-colors ${
                        d.sslStatus === "active" ? "opacity-30 cursor-not-allowed" : "hover:bg-emerald-50 cursor-pointer"
                      }`}
                      title={isAr ? "تجديد شهادة SSL" : "Renew SSL Cert"}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingDomain(d)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 cursor-pointer transition-colors"
                      title={isAr ? "حذف الربط" : "Remove Domain Link"}
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

      {/* Add Domain Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-500" />
                {isAr ? "ربط دومين جديد مخصص" : "Map Custom Domain"}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddDomain} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">{isAr ? "الشركة" : "Company Account"}</label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? "اسم الشركة..." : "Company name..."}
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="input text-sm text-right"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">{isAr ? "الدومين المخصص" : "Custom Domain URL"}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. crm.company.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="input font-mono"
                />
              </div>

              <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-800 space-y-1">
                <p className="font-semibold">{isAr ? "توجيه DNS المطلوب:" : "DNS Target Configuration:"}</p>
                <p className="font-mono text-[11px] bg-white/60 p-1.5 rounded border border-blue-100 select-all">
                  Type: CNAME | Host: @ | Value: crm.daleelplatform.com
                </p>
              </div>

              <button type="submit" className="btn-accent w-full py-2.5 mt-2 cursor-pointer">
                <Plus className="w-4 h-4" /> {isAr ? "ربط الدومين" : "Map Domain"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Domain Confirmation Modal */}
      {deletingDomain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100 p-5 space-y-4 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500 border border-red-100">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">
                {isAr ? "تأكيد إلغاء ربط الدومين" : "Confirm Domain Link Deletion"}
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {isAr 
                  ? `هل أنت متأكد من إلغاء ربط الدومين "${deletingDomain.domain}" الخاص بشركة "${deletingDomain.company}"؟ سيؤدي ذلك إلى توقف وصول موظفي الشركة عبر هذا المسار.`
                  : `Are you sure you want to delete custom domain link "${deletingDomain.domain}" for "${deletingDomain.companyEn}"? Employees will lose access via this routing path.`}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingDomain(null)}
                className="btn-outline flex-1 cursor-pointer btn-sm"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={confirmDeleteDomain}
                className="btn-danger bg-red-600 hover:bg-red-700 text-white flex-1 cursor-pointer btn-sm"
              >
                {isAr ? "إلغاء الربط" : "Remove Link"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SSL Renewal Loader Modal */}
      {renewingSSL && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100 p-5 space-y-4 text-center">
            {isRenewing ? (
              <div className="py-6 space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{isAr ? "تجديد شهادة الحماية SSL" : "Renewing SSL Security Certificate"}</h4>
                  <p className="text-xs text-slate-400 mt-1">{isAr ? "جاري الاتصال بـ Let's Encrypt وإصدار الشهادة..." : "Communicating with Let's Encrypt API..."}</p>
                </div>
              </div>
            ) : (
              <div className="py-2 space-y-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{isAr ? "تم تجديد الشهادة بنجاح!" : "SSL Renewed Successfully!"}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {isAr 
                      ? `تم إصدار وتفعيل شهادة حماية SSL جديدة صالحة لمدة عام كامل للدومين "${renewingSSL.domain}"`
                      : `A new SSL security license has been issued and applied for "${renewingSSL.domain}" for 1 year.`}
                  </p>
                </div>
                <button
                  onClick={() => setRenewingSSL(null)}
                  className="btn-primary cursor-pointer w-full py-2.5 mt-2"
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

export default function DomainsPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-slate-500 font-medium">Loading domains...</div>}>
      <DomainsContent />
    </Suspense>
  );
}
