"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/context/DataContext";
import { MessageSquare, CheckCircle, ArrowRight, X, Send, Loader2, UserCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

type Ticket = {
  id: string;
  company: string;
  companyEn: string;
  subject: string;
  subjectEn: string;
  priority: string;
  status: string;
  date: string;
};

type ChatMessage = {
  sender: "client" | "support";
  senderName: string;
  text: string;
  time: string;
};

const initialChats: Record<string, ChatMessage[]> = {
  "TKT-1031": [
    { sender: "client", senderName: "عيادات النور", text: "لدينا مشكلة في تفعيل خط ربط الواتساب وتظهر رسالة خطأ بالربط.", time: "11:20" },
    { sender: "support", senderName: "أحمد الراشد", text: "أهلاً بك، يرجى التأكد من ربط الحساب التجاري الموثق في Meta وتزويدنا برقم الهاتف.", time: "11:45" },
    { sender: "client", senderName: "عيادات النور", text: "تم التحقق وهو موثق، رقم الهاتف هو +966 50 123 4567.", time: "12:00" }
  ],
  "TKT-1032": [
    { sender: "client", senderName: "معهد الشرق للتدريب", text: "لم نتمكن من تنزيل الفواتير الأخيرة وتظهر صفحة بيضاء.", time: "10:15" }
  ]
};

export default function TicketsPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";
  const { tickets, setTickets } = useData();

  // Chat conversation threads states
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>(initialChats);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const priorityBadge = (p: string) => {
    if (p === "high") return "badge-danger";
    if (p === "medium") return "badge-warning";
    return "badge-neutral";
  };

  const statusBadge = (s: string) => {
    if (s === "open") return "badge-danger";
    if (s === "in_progress") return "badge-warning";
    return "badge-success";
  };

  const handleResolve = (id: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        toast.success(
          isAr 
            ? `تم حل تذكرة الدعم الفني ${id} بنجاح` 
            : `Ticket ${id} resolved successfully`
        );
        return { ...t, status: "resolved" };
      }
      return t;
    }));
  };

  const startReplyFlow = (tk: Ticket) => {
    setViewingTicket(tk);
    setReplyText("");
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !viewingTicket) return;

    setIsSending(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
      
      const newMsg: ChatMessage = {
        sender: "support",
        senderName: isAr ? "أحمد الراشد" : "Ahmed Al-Rashid",
        text: replyText.trim(),
        time: timeStr
      };

      // 1. Append message
      const ticketId = viewingTicket.id;
      const currentThread = conversations[ticketId] || [];
      setConversations({
        ...conversations,
        [ticketId]: [...currentThread, newMsg]
      });

      // 2. Set ticket status to In Progress
      setTickets(prev => prev.map(t => {
        if (t.id === ticketId && t.status === "open") {
          return { ...t, status: "in_progress" };
        }
        return t;
      }));

      setReplyText("");
      setIsSending(false);
      
      // Update ticket status in current modal copy
      setViewingTicket(prev => prev ? { ...prev, status: "in_progress" } : null);
    }, 800);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{isAr ? "تذاكر الدعم الفني من الشركات" : "Support tickets from companies"}</p>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>{isAr ? "رقم التذكرة" : "Ticket #"}</th>
              <th>{t("companyName")}</th>
              <th>{isAr ? "العنوان" : "Subject"}</th>
              <th>{isAr ? "الأولوية" : "Priority"}</th>
              <th>{t("status")}</th>
              <th>{isAr ? "التاريخ" : "Date"}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((tk) => (
              <tr key={tk.id}>
                <td className="font-mono text-sm font-medium">{tk.id}</td>
                <td className="font-medium">{isAr ? tk.company : tk.companyEn}</td>
                <td className="text-sm">{isAr ? tk.subject : tk.subjectEn}</td>
                <td>
                  <span className={`badge ${priorityBadge(tk.priority)}`}>
                    {tk.priority === "high" ? (isAr ? "عالية" : "High") : tk.priority === "medium" ? (isAr ? "متوسطة" : "Medium") : (isAr ? "منخفضة" : "Low")}
                  </span>
                </td>
                <td>
                  <span className={`badge ${statusBadge(tk.status)}`}>
                    {tk.status === "open" ? (isAr ? "مفتوحة" : "Open") : tk.status === "in_progress" ? (isAr ? "قيد المعالجة" : "In Progress") : (isAr ? "محلولة" : "Resolved")}
                  </span>
                </td>
                <td className="text-sm text-slate-500">{tk.date}</td>
                <td>
                  <div className="flex gap-0.5">
                    <button 
                      onClick={() => startReplyFlow(tk)} 
                      className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 cursor-pointer transition-colors" 
                      title={isAr ? "رد ومتابعة" : "Reply Thread"}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleResolve(tk.id)} 
                      disabled={tk.status === "resolved"}
                      className={`p-1.5 rounded-lg text-emerald-600 transition-colors ${
                        tk.status === "resolved" ? "opacity-35 cursor-not-allowed" : "hover:bg-emerald-50 cursor-pointer"
                      }`}
                      title={isAr ? "تحديد كمحلولة" : "Mark Resolved"}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ticket Conversation Modal */}
      {viewingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100 flex flex-col h-[70vh]">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <span className="font-mono text-xs bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">{viewingTicket.id}</span>
                  {isAr ? viewingTicket.subject : viewingTicket.subjectEn}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                  {isAr ? "الشركة:" : "From:"} {isAr ? viewingTicket.company : viewingTicket.companyEn} · {isAr ? "الحالة:" : "Status:"} {viewingTicket.status.toUpperCase()}
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setViewingTicket(null)} 
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Messages Box */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
              {(conversations[viewingTicket.id] || [
                { sender: "client", senderName: isAr ? viewingTicket.company : viewingTicket.companyEn, text: isAr ? viewingTicket.subject : viewingTicket.subjectEn, time: "09:00" }
              ]).map((msg, idx) => {
                const isSupport = msg.sender === "support";
                return (
                  <div 
                    key={idx} 
                    className={`flex flex-col max-w-[80%] ${isSupport ? "ml-auto" : "mr-auto"}`}
                    style={{ [isSupport ? "alignItems" : "alignItems"]: isSupport ? "flex-end" : "flex-start" }}
                  >
                    <span className="text-[9px] text-slate-400 font-bold px-1.5 mb-1 block">{msg.senderName}</span>
                    <div 
                      className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-3xs ${
                        isSupport 
                          ? "bg-[var(--primary)] text-white rounded-br-none" 
                          : "bg-white text-slate-850 rounded-bl-none border border-slate-100"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className={`text-[8px] mt-1.5 block text-end font-mono ${isSupport ? "text-white/60" : "text-slate-350"}`}>{msg.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Form */}
            {viewingTicket.status !== "resolved" ? (
              <form onSubmit={handleSendReply} className="p-3 border-t border-slate-100 flex gap-2 bg-white">
                <input
                  type="text"
                  required
                  placeholder={isAr ? "اكتب ردك الدعم الفني هنا..." : "Type support reply..."}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="input py-2 text-xs flex-1 focus:ring-1"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="btn-accent px-4 py-2 cursor-pointer rounded-xl flex justify-center items-center"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            ) : (
              <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs font-semibold text-slate-500 flex justify-center items-center gap-1">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                {isAr ? "هذه التذكرة مغلقة ومحلولة بالكامل." : "This support ticket is closed and resolved."}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
