"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Key, Plus, Copy, Trash2, X, ShieldCheck, ShieldAlert, Info, Settings, ToggleRight, ToggleLeft, Network, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

type APIKeyItem = {
  id: number;
  name: string;
  keyPreview: string;
  created: string;
  status: "active" | "revoked";
};

type IntegrationItem = {
  id: string;
  name: string;
  description: string;
  descriptionAr: string;
  status: boolean;
  provider: string;
};

const initialKeys: APIKeyItem[] = [
  { id: 1, name: "Production ERP Sync", keyPreview: "dl_live_...2F8A", created: "2026-07-01 10:14", status: "active" },
  { id: 2, name: "Dev Testing Webhook", keyPreview: "dl_test_...8B91", created: "2026-07-09 11:32", status: "active" }
];

const initialIntegrations: IntegrationItem[] = [
  { id: "google", name: "Google Workspace", description: "Allow users single sign-on (SSO) and sync contact calendars.", descriptionAr: "تمكين تسجيل الدخول الموحد للعملاء ومزامنة جداول التقويم.", status: true, provider: "Google" },
  { id: "meta", name: "Meta Lead Ads", description: "Sync customer leads automatically from Facebook & Instagram ads.", descriptionAr: "مزامنة العملاء المتوقعين تلقائياً من إعلانات فيسبوك وانستجرام.", status: true, provider: "Meta" },
  { id: "whatsapp", name: "WhatsApp Business API", description: "Default business gateway for conversational templates.", descriptionAr: "بوابة أعمال واتساب لإرسال الإشعارات والرد التلقائي.", status: true, provider: "WhatsApp" },
  { id: "gemini", name: "Google Gemini Cloud", description: "Platform backend engine for intelligent AI text summaries.", descriptionAr: "محرك الذكاء الاصطناعي لتلخيص المحادثات وإنشاء الردود.", status: true, provider: "Google" },
  { id: "openai", name: "OpenAI Platform", description: "Secondary AI model routing fallback integrations.", descriptionAr: "تكامل إضافي ونموذج احتياطي لعمليات الذكاء الاصطناعي.", status: false, provider: "OpenAI" }
];

export default function APIIntegrationsPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";

  const [integrations, setIntegrations] = useState<IntegrationItem[]>(initialIntegrations);
  const [keys, setKeys] = useState<APIKeyItem[]>(initialKeys);
  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  // Webhook settings
  const [webhookUrl, setWebhookUrl] = useState("https://api.myerp.com/daleel-receiver");
  const [webhookEvents, setWebhookEvents] = useState<string[]>([
    "company.registered", "subscription.updated"
  ]);

  // Operational states (No window alerts/confirms!)
  const [revokingKey, setRevokingKey] = useState<APIKeyItem | null>(null);
  const [pinging, setPinging] = useState(false);

  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(int => {
      if (int.id === id) {
        const nextStatus = !int.status;
        toast.info(
          isAr
            ? `تم ${nextStatus ? "تفعيل" : "تعطيل"} ربط ${int.name}`
            : `${int.name} integration ${nextStatus ? "enabled" : "disabled"}`
        );
        return { ...int, status: nextStatus };
      }
      return int;
    }));
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const rawKey = "dl_" + (newKeyName.toLowerCase().includes("test") ? "test_" : "live_") + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const masked = rawKey.substring(0, 8) + "..." + rawKey.substring(rawKey.length - 4);
    
    const newKeyItem: APIKeyItem = {
      id: Date.now(),
      name: newKeyName,
      keyPreview: masked,
      created: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "active"
    };

    setKeys([newKeyItem, ...keys]);
    setGeneratedKey(rawKey);
    setNewKeyName("");
  };

  const confirmRevokeKey = () => {
    if (!revokingKey) return;
    setKeys(prev => prev.map(k => {
      if (k.id === revokingKey.id) return { ...k, status: "revoked" as const };
      return k;
    }));
    toast.error(isAr ? "تم إبطال مفتاح الـ API" : "API token revoked");
    setRevokingKey(null);
  };

  const handleToggleEvent = (ev: string) => {
    if (webhookEvents.includes(ev)) {
      setWebhookEvents(webhookEvents.filter(e => e !== ev));
    } else {
      setWebhookEvents([...webhookEvents, ev]);
    }
  };

  const triggerPing = () => {
    setPinging(true);
    setTimeout(() => {
      setPinging(false);
      toast.success(isAr ? "تم إرسال إشارة تجريبية (Ping) بنجاح والاستجابة 200 OK!" : "Test payload triggered! Destination responded with 200 OK.");
    }, 1500);
  };

  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-12 gap-5 items-start">
        {/* Integrations Modules */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-500" />
              {isAr ? "بوابات التكامل والربط الخارجية" : "External Integrations Providers"}
            </h3>

            <div className="divide-y divide-slate-100 space-y-3.5">
              {integrations.map((int) => (
                <div key={int.id} className="flex justify-between items-start pt-3.5 first:pt-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center font-bold text-sm border border-slate-100 select-none">
                      {int.provider.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-800">{int.name}</span>
                        <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 rounded">{int.provider}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{isAr ? int.descriptionAr : int.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleIntegration(int.id)}
                    className="focus:outline-none cursor-pointer"
                  >
                    {int.status ? (
                      <ToggleRight className="w-9 h-9 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-slate-300" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Webhooks config */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
              <Network className="w-4 h-4 text-emerald-500" />
              {isAr ? "إعدادات الويب هوكس (Webhooks)" : "Webhooks Configuration"}
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "رابط استقبال البيانات (Payload URL)" : "Payload Destination URL"}</label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="input font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 block">{isAr ? "الأحداث التي تبث فوراً" : "Subscribed Payload Events"}</label>
              <div className="grid grid-cols-2 gap-3 pt-1">
                {[
                  { key: "company.registered", label: "company.registered" },
                  { key: "subscription.updated", label: "subscription.updated" },
                  { key: "payment.processed", label: "payment.processed" },
                  { key: "ticket.created", label: "ticket.created" }
                ].map((ev) => {
                  const isChecked = webhookEvents.includes(ev.key);
                  return (
                    <button
                      key={ev.key}
                      type="button"
                      onClick={() => handleToggleEvent(ev.key)}
                      className={`flex items-center gap-2.5 px-3 py-2 border rounded-xl text-xs font-semibold cursor-pointer text-start ${
                        isChecked 
                          ? "bg-slate-50 border-slate-300 text-slate-800" 
                          : "bg-white border-slate-100 hover:bg-slate-50 text-slate-400"
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        readOnly 
                        checked={isChecked} 
                        className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer pointer-events-none" 
                      />
                      {ev.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-50 flex gap-2">
              <button
                type="button"
                disabled={pinging}
                onClick={triggerPing}
                className="btn-outline btn-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                {pinging ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {isAr ? "جاري الإرسال..." : "Sending..."}
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    {isAr ? "إرسال إشارة تجريبية (Ping)" : "Send Test Payload"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* API Tokens Keys list */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-500" />
              {isAr ? "مفاتيح الـ API للمطورين" : "Developer API Tokens"}
            </h3>
            <button
              onClick={() => {
                setGeneratedKey(null);
                setShowAddKeyModal(true);
              }}
              className="btn-accent btn-xs px-2.5 py-1 cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> {isAr ? "جديد" : "New"}
            </button>
          </div>

          <div className="space-y-3">
            {keys.map((k) => (
              <div key={k.id} className="p-3.5 border border-slate-100 rounded-xl space-y-2 bg-slate-50/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{k.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{isAr ? "أصدر في: " : "Issued: "}{k.created}</p>
                  </div>
                  <span className={`badge text-[9px] ${k.status === "active" ? "badge-success" : "badge-neutral"}`}>
                    {k.status === "active" ? (isAr ? "فعال" : "Active") : (isAr ? "ملغي" : "Revoked")}
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-slate-100/50 pt-2 text-xs">
                  <span className="font-mono text-slate-550 select-all font-semibold">{k.keyPreview}</span>
                  {k.status === "active" && (
                    <button
                      onClick={() => setRevokingKey(k)}
                      className="text-red-500 hover:text-red-700 font-bold text-[11px] cursor-pointer"
                    >
                      {isAr ? "إلغاء المفتاح" : "Revoke Key"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Key Modal */}
      {showAddKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">{isAr ? "توليد مفتاح واجهة برمجية جديد" : "Generate Developer API Token"}</h3>
              <button
                type="button"
                onClick={() => setShowAddKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {generatedKey ? (
              <div className="p-5 space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex gap-2.5 text-emerald-800 text-xs">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">{isAr ? "تم توليد المفتاح بأمان" : "Token Generated Successfully"}</p>
                    <p className="mt-0.5 leading-relaxed">{isAr ? "احفظ هذا المفتاح الآن في مكان آمن، فلن تتمكن من رؤيته مجدداً!" : "Make sure to copy this token now. It will not be shown again for security reasons!"}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 block">{isAr ? "قيمة مفتاح الـ API" : "API Token Key"}</label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={generatedKey}
                      className="input font-mono text-xs bg-slate-50 select-all pr-12 text-slate-800 font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedKey);
                        toast.success(isAr ? "تم نسخ المفتاح للحافظة" : "Copied to clipboard!");
                      }}
                      className="absolute top-1/2 -translate-y-1/2 end-3 p-1.5 hover:bg-slate-200 rounded-md cursor-pointer"
                      title="Copy Key"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddKeyModal(false)}
                  className="btn-primary w-full py-2.5 cursor-pointer font-bold shadow"
                >
                  {isAr ? "إتمام الحفظ" : "Done"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleGenerateKey} className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "اسم المفتاح (الوصف)" : "Key Description Label"}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dashboard ERP API Connector"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="input text-sm"
                  />
                </div>

                <div className="flex gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl leading-relaxed">
                  <Info className="w-4 h-4 flex-shrink-0 text-slate-400 mt-0.5" />
                  <p>{isAr ? "سيتم توليد مفتاح بصلاحية كاملة لقراءة وإدخال بيانات الشركات والعملاء." : "Generated keys grant read & write authorizations across companies and client CRM databases."}</p>
                </div>

                <button type="submit" className="btn-accent w-full py-2.5 mt-2 cursor-pointer font-bold">
                  <Plus className="w-4 h-4" /> {isAr ? "إنشاء المفتاح" : "Generate Token"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Revoke API Key Confirmation Modal */}
      {revokingKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100 p-5 space-y-4 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500 border border-red-100">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">
                {isAr ? "سحب وإلغاء مفتاح الـ API" : "Revoke Developer API Token"}
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {isAr 
                  ? `هل أنت متأكد من إلغاء وسحب صلاحية المفتاح "${revokingKey.name}"؟ ستتوقف جميع التطبيقات والعمليات الخارجية المتصلة عبره فوراً عن العمل.`
                  : `Are you sure you want to revoke API token "${revokingKey.name}"? External ERPs and integrations linked via this key will stop functioning immediately.`}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRevokingKey(null)}
                className="btn-outline flex-1 cursor-pointer btn-sm"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={confirmRevokeKey}
                className="btn-danger bg-red-600 hover:bg-red-700 text-white flex-1 cursor-pointer btn-sm"
              >
                {isAr ? "سحب وإلغاء" : "Revoke Token"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
