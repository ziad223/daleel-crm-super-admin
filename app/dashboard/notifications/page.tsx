"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Bell, Send, CheckCircle2, RefreshCw, Mail, MessageSquare, ShieldAlert, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

type BroadcastHistoryItem = {
  id: number;
  title: string;
  body: string;
  target: string;
  targetAr: string;
  channels: ("in_app" | "email" | "whatsapp")[];
  date: string;
  status: "sent" | "failed";
};

const initialHistory: BroadcastHistoryItem[] = [
  { id: 1, title: "System Maintenance Scheduled", body: "We will perform a routine maintenance on 14th July between 02:00 AM and 04:00 AM.", target: "All Companies", targetAr: "جميع الشركات", channels: ["in_app", "email"], date: "2026-07-11 12:00", status: "sent" },
  { id: 2, title: "Upgrade to Professional with 20% discount", body: "Upgrade your billing cycle today and receive 20% flat discount on yearly renewal.", target: "Basic Plan Users", targetAr: "مشتركي الباقة الأساسية", channels: ["in_app", "whatsapp"], date: "2026-07-08 09:30", status: "sent" },
  { id: 3, title: "API Integration credentials updated", body: "Important API changes will take effect this evening. Please review your developer credentials.", target: "Riyadh Real Estate", targetAr: "عقارات الرياض", channels: ["email"], date: "2026-07-05 15:45", status: "sent" }
];

export default function NotificationsPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetType, setTargetType] = useState<"all" | "company" | "plan">("all");
  const [targetValue, setTargetValue] = useState("");
  const [channels, setChannels] = useState<("in_app" | "email" | "whatsapp")[]>(["in_app"]);
  const [history, setHistory] = useState<BroadcastHistoryItem[]>(initialHistory);

  // Custom modal loader states
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState(0);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleChannelToggle = (ch: "in_app" | "email" | "whatsapp") => {
    if (channels.includes(ch)) {
      setChannels(channels.filter(c => c !== ch));
    } else {
      setChannels([...channels, ch]);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error(isAr ? "يرجى ملء جميع الحقول المطلوبة" : "Please input title and message body");
      return;
    }
    if (channels.length === 0) {
      toast.error(isAr ? "يرجى اختيار قناة إرسال واحدة على الأقل" : "Please select at least one delivery channel");
      return;
    }

    setBroadcasting(true);
    setBroadcastProgress(5);
    setBroadcastSuccess(false);

    let targetDesc = "All Companies";
    let targetDescAr = "جميع الشركات";
    
    if (targetType === "company") {
      targetDesc = targetValue || "Selected Company";
      targetDescAr = targetValue || "الشركة المحددة";
    } else if (targetType === "plan") {
      targetDesc = `${targetValue} Plan Users`;
      targetDescAr = `مشتركي الباقة ${targetValue === "Basic" ? "الأساسية" : targetValue === "Professional" ? "الاحترافية" : "المؤسسية"}`;
    }

    const newItem: BroadcastHistoryItem = {
      id: Date.now(),
      title: title.trim(),
      body: body.trim(),
      target: targetDesc,
      targetAr: targetDescAr,
      channels: [...channels],
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "sent"
    };

    const interval = setInterval(() => {
      setBroadcastProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setHistory(old => [newItem, ...old]);
          setBroadcastSuccess(true);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const resetForm = () => {
    setTitle("");
    setBody("");
    setTargetValue("");
    setChannels(["in_app"]);
    setBroadcasting(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Description */}
      <div className="flex justify-between items-center border-b border-slate-50 pb-3">
        <p className="text-sm text-slate-500">
          {isAr
            ? "بث وإرسال إشعارات جماعية للشركات عبر قنوات متعددة"
            : "Compose and broadcast mass alerts, platform notices, and system announcements across channels"}
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-5 items-start">
        {/* Broadcast Form */}
        <form onSubmit={handleSend} className="md:col-span-5 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2">
            {isAr ? "إنشاء بث جديد" : "Compose Broadcast Notification"}
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">{isAr ? "العنوان" : "Notice Title"}</label>
            <input
              type="text"
              required
              placeholder={isAr ? "عنوان الإشعار..." : "Alert title..."}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">{isAr ? "الرسالة" : "Alert Message Body"}</label>
            <textarea
              rows={4}
              required
              placeholder={isAr ? "اكتب محتوى الإشعار بالتفصيل..." : "Compose announcement..."}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="input text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "الفئة المستهدفة" : "Audience Group"}</label>
              <select
                value={targetType}
                onChange={(e) => {
                  setTargetType(e.target.value as any);
                  setTargetValue("");
                }}
                className="input py-2 text-xs font-semibold cursor-pointer"
              >
                <option value="all">{isAr ? "جميع الشركات" : "All Companies"}</option>
                <option value="plan">{isAr ? "بناء على الباقة" : "Subscription Plan"}</option>
                <option value="company">{isAr ? "شركة محددة" : "Specific Company"}</option>
              </select>
            </div>

            {targetType !== "all" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">{isAr ? "التفاصيل" : "Target Details"}</label>
                {targetType === "plan" ? (
                  <select
                    value={targetValue}
                    required
                    onChange={(e) => setTargetValue(e.target.value)}
                    className="input py-2 text-xs font-semibold cursor-pointer"
                  >
                    <option value="">{isAr ? "اختر الباقة..." : "Select plan..."}</option>
                    <option value="Basic">{isAr ? "الأساسية" : "Basic"}</option>
                    <option value="Professional">{isAr ? "الاحترافية" : "Professional"}</option>
                    <option value="Enterprise">{isAr ? "المؤسسية" : "Enterprise"}</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder={isAr ? "اسم الشركة..." : "Company name..."}
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    className="input text-sm"
                  />
                )}
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-600 block">{isAr ? "قنوات الإرسال" : "Delivery Channels"}</label>
            <div className="flex gap-2">
              {[
                { type: "in_app" as const, label: isAr ? "داخل المنصة" : "In-App", icon: Bell },
                { type: "email" as const, label: isAr ? "البريد الإلكتروني" : "Email", icon: Mail },
                { type: "whatsapp" as const, label: isAr ? "الواتساب" : "WhatsApp", icon: MessageSquare }
              ].map((c) => {
                const isSelected = channels.includes(c.type);
                const Icon = c.icon;
                return (
                  <button
                    key={c.type}
                    type="button"
                    onClick={() => handleChannelToggle(c.type)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-slate-900 border-slate-900 text-white" 
                        : "bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit" className="btn-accent w-full py-3 mt-2 cursor-pointer font-bold shadow-md flex justify-center items-center gap-2">
            <Send className="w-4 h-4" /> {isAr ? "بدء البث والإرسال" : "Launch Broadcast"}
          </button>
        </form>

        {/* History List */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2">
            {isAr ? "سجل البث والرسائل السابقة" : "Broadcast Log History"}
          </h3>

          <div className="space-y-3.5">
            {history.map((h) => (
              <div key={h.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{h.title}</h4>
                    <span className="text-[9px] text-slate-400 font-bold block mt-1">
                      {isAr ? "الهدف:" : "Target:"} {isAr ? h.targetAr : h.target}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">{h.date}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{h.body}</p>
                <div className="flex justify-between items-center border-t border-slate-100 pt-2 text-[10px]">
                  <div className="flex gap-1.5">
                    {h.channels.map((ch) => (
                      <span key={ch} className="bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-slate-500 font-bold uppercase font-mono">
                        {ch.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                  <span className="badge badge-success text-[9px] uppercase font-bold">{isAr ? "تم الإرسال" : "Broadcast Sent"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Broadcasting Loader Modal */}
      {broadcasting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100 p-5 space-y-4 text-center">
            {!broadcastSuccess ? (
              <div className="space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-sm">{isAr ? "جاري بث الإشعار" : "Broadcasting Alerts"}</h4>
                  <p className="text-xs text-slate-400">
                    {isAr 
                      ? `جاري الإرسال عبر البوابات والقنوات المحددة... ${broadcastProgress}%` 
                      : `Syncing SMTP and SMS network queues... ${broadcastProgress}%`}
                  </p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${broadcastProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{isAr ? "تم إرسال الإشعار بنجاح!" : "Alert Broadcasted Successfully!"}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {isAr 
                      ? "تم ترحيل وبث الرسائل لجميع قنوات الوصول المحددة وقاعدة البيانات."
                      : "Messages successfully queued and broadcasted to selected target clients."}
                  </p>
                </div>
                <button
                  onClick={resetForm}
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
