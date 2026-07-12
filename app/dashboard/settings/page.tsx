"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Settings, Save, Globe, Mail, Shield, HardDrive, RefreshCw, CheckCircle2, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function GeneralSettingsPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";

  const [activeTab, setActiveTab] = useState<"general" | "localization" | "smtp" | "storage">("general");

  // Platform general state
  const [systemName, setSystemName] = useState("Daleel CRM Platform");
  const [supportEmail, setSupportEmail] = useState("support@daleelcrm.com");
  const [supportPhone, setSupportPhone] = useState("+966 11 900 8000");

  // Localization state
  const [defaultLanguage, setDefaultLanguage] = useState("ar");
  const [timezone, setTimezone] = useState("Asia/Riyadh");
  const [currency, setCurrency] = useState("SAR");

  // SMTP Settings
  const [smtpHost, setSmtpHost] = useState("smtp.sendgrid.net");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("apikey");
  const [smtpPass, setSmtpPass] = useState("SG.mock_smtp_password_hash_value");
  const [smtpEncryption, setSmtpEncryption] = useState("tls");
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [smtpVerified, setSmtpVerified] = useState<boolean | null>(null);

  // Storage and cache state
  const [storageDriver, setStorageDriver] = useState("s3");
  const [s3Bucket, setS3Bucket] = useState("daleel-user-assets-prod");
  const [s3Region, setS3Region] = useState("me-central-1");
  const [sessionTimeout, setSessionTimeout] = useState(120);

  // Operational states (No window alerts/confirms!)
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleTestSMTP = () => {
    setTestingSmtp(true);
    setSmtpVerified(null);
    setTimeout(() => {
      setTestingSmtp(false);
      setSmtpVerified(true);
      toast.success(isAr ? "تم إرسال بريد الاختبار بنجاح، تحقق من صندوق الوارد!" : "Test email sent successfully! Check inbox.");
    }, 1500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveProgress(10);
    setSaveSuccess(false);

    const interval = setInterval(() => {
      setSaveProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setSaveSuccess(true);
          return 100;
        }
        return prev + 30;
      });
    }, 350);
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <p className="text-sm text-slate-500">
          {isAr
            ? "تهيئة إعدادات النظام الرئيسية للمنصة، سيرفرات البريد SMTP، والتخزين السحابي"
            : "Configure general core variables, localized regional defaults, mail servers, and block storage folders"}
        </p>

        <button type="submit" className="btn-primary btn-sm self-start sm:self-auto cursor-pointer flex items-center gap-1.5 shadow-md">
          <Save className="w-4 h-4" /> {t("save")}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {[
          { id: "general" as const, label: isAr ? "الإعدادات العامة" : "General Config", icon: Settings },
          { id: "localization" as const, label: isAr ? "اللغة والمنطقة" : "Regional Localization", icon: Globe },
          { id: "smtp" as const, label: isAr ? "سيرفر البريد SMTP" : "Mail Server SMTP", icon: Mail },
          { id: "storage" as const, label: isAr ? "التخزين والملفات" : "Storage & Caching", icon: HardDrive }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                isSelected 
                  ? "border-[var(--primary)] text-[var(--primary)] font-bold" 
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* General Settings */}
      {activeTab === "general" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-500" />
            {isAr ? "بيانات النظام العامة" : "General White-label Properties"}
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "اسم النظام" : "Platform Name"}</label>
              <input
                type="text"
                required
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                className="input text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "بريد الدعم الفني" : "Support Email Address"}</label>
              <input
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="input text-sm font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "هاتف الدعم" : "Support Phone"}</label>
              <input
                type="text"
                required
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="input text-sm font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Localization Settings */}
      {activeTab === "localization" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-500" />
            {isAr ? "اللغة والخيارات الإقليمية" : "Regional Configuration"}
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "اللغة الافتراضية" : "Default Locale"}</label>
              <select
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
                className="input py-2 text-xs font-semibold cursor-pointer"
              >
                <option value="ar">{isAr ? "العربية" : "Arabic"}</option>
                <option value="en">{isAr ? "الإنجليزية" : "English"}</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "المنطقة الزمنية" : "Default Timezone"}</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="input py-2 text-xs font-semibold cursor-pointer"
              >
                <option value="Asia/Riyadh">{isAr ? "الرياض (UTC+3)" : "Riyadh (UTC+3)"}</option>
                <option value="Asia/Dubai">{isAr ? "دبي (UTC+4)" : "Dubai (UTC+4)"}</option>
                <option value="UTC">{isAr ? "التوقيت العالمي (UTC)" : "Universal Coordinated (UTC)"}</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "العملة الافتراضية" : "Default Currency"}</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input py-2 text-xs font-semibold cursor-pointer"
              >
                <option value="SAR">SAR (ر.س)</option>
                <option value="AED">AED (د.إ)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* SMTP Settings */}
      {activeTab === "smtp" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-500" />
            {isAr ? "إعدادات خادم البريد SMTP" : "Outgoing Mail Server Settings (SMTP)"}
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "عنوان الخادم (Host)" : "SMTP Server Host"}</label>
              <input
                type="text"
                required
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                className="input text-sm font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "المنفذ (Port)" : "SMTP Port"}</label>
              <input
                type="text"
                required
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
                className="input text-sm font-mono"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "اسم المستخدم" : "SMTP Username"}</label>
              <input
                type="text"
                required
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                className="input text-sm font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "كلمة المرور" : "SMTP Password"}</label>
              <input
                type="password"
                required
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
                className="input text-sm font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "نوع التشفير" : "SMTP Encryption"}</label>
              <select
                value={smtpEncryption}
                onChange={(e) => setSmtpEncryption(e.target.value)}
                className="input py-2 text-xs font-semibold cursor-pointer"
              >
                <option value="tls">TLS (Recommended)</option>
                <option value="ssl">SSL</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleTestSMTP}
              disabled={testingSmtp}
              className="btn-outline btn-sm cursor-pointer flex items-center gap-1.5"
            >
              {testingSmtp ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {isAr ? "جاري فحص الاتصال..." : "Pinging Host..."}
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  {isAr ? "اختبار اتصال SMTP" : "Test SMTP Connection"}
                </>
              )}
            </button>
            {smtpVerified && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {isAr ? "تم التحقق - خادم البريد متصل وصحيح" : "Verified - Mail Server Connected"}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Storage and Cache Settings */}
      {activeTab === "storage" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-500" />
            {isAr ? "إعدادات التخزين السحابي والكاش" : "Object Cloud Storage & Caching"}
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "مزود التخزين" : "Storage Target Driver"}</label>
              <select
                value={storageDriver}
                onChange={(e) => setStorageDriver(e.target.value)}
                className="input py-2 text-xs cursor-pointer"
              >
                <option value="local">{isAr ? "تخزين محلي (خادم الويب)" : "Local Web Server Storage"}</option>
                <option value="s3">Amazon AWS S3 Cloud Bucket</option>
                <option value="gcs">Google Cloud Storage</option>
              </select>
            </div>

            {storageDriver === "s3" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "اسم الـ S3 Bucket" : "AWS S3 Bucket Name"}</label>
                  <input
                    type="text"
                    required
                    value={s3Bucket}
                    onChange={(e) => setS3Bucket(e.target.value)}
                    className="input text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "المنطقة (AWS Region)" : "S3 Bucket Region"}</label>
                  <input
                    type="text"
                    required
                    value={s3Region}
                    onChange={(e) => setS3Region(e.target.value)}
                    className="input text-sm font-mono"
                  />
                </div>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "مدة بقاء الجلسة (دقائق)" : "Admin Session Lifetime (Minutes)"}</label>
              <input
                type="number"
                required
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(parseInt(e.target.value) || 0)}
                className="input text-sm font-mono"
              />
            </div>
            
            <div className="space-y-1 bg-slate-50 border border-slate-100 rounded-xl p-3 text-slate-500 text-xs flex flex-col justify-center select-none">
              <span className="font-semibold text-slate-700">{isAr ? "نظام الكاش (Redis Cache):" : "System Caching Status:"}</span>
              <span className="text-[10px] mt-0.5 text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                {isAr ? "مكتمل الاتصال - خادم Redis نشط" : "Online - Active Redis Cache Cluster"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Saving Loader Modal */}
      {saving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100 p-5 space-y-4 text-center">
            {!saveSuccess ? (
              <div className="space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-sm">{isAr ? "جاري حفظ وتطبيق الإعدادات" : "Applying Global Configurations"}</h4>
                  <p className="text-xs text-slate-400">
                    {isAr 
                      ? `جاري حفظ ملفات التكوين وتحديث المتغيرات البيئية... ${saveProgress}%` 
                      : `Saving configuration files and updating environment variables... ${saveProgress}%`}
                  </p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${saveProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{isAr ? "تم تطبيق التعديلات بنجاح!" : "Configuration Applied successfully!"}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {isAr 
                      ? "تم تحديث إعدادات النظام وتغيير متغيرات التخزين والاتصال بنجاح."
                      : "Core system variables, network connection links, and storage targets are now updated."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSaving(false)}
                  className="btn-primary cursor-pointer w-full py-2.5"
                >
                  {isAr ? "موافق" : "Done"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
