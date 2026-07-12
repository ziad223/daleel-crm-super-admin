"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/context/DataContext";
import { formatCurrency } from "@/lib/utils";
import { Eye, Download, Printer, Mail, X, FileText, CheckCircle2, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Invoice = {
  id: string;
  company: string;
  companyEn: string;
  plan: string;
  planEn: string;
  amount: number;
  tax: number;
  total: number;
  status: string;
  date: string;
};

export default function InvoicesPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";
  const { invoices } = useData();

  // Modal / Preview states
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [emailingInvoice, setEmailingInvoice] = useState<Invoice | null>(null);
  
  // Email form states
  const [targetEmail, setTargetEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const startEmailFlow = (inv: Invoice) => {
    setEmailingInvoice(inv);
    setTargetEmail(isAr ? "finance@company.com" : "billing@clientcompany.com");
    setEmailSubject(isAr ? `فاتورة رقم ${inv.id} - دليل الشرق CRM` : `Invoice ${inv.id} - Daleel CRM`);
    setEmailBody(
      isAr 
        ? `عزيزنا العميل في ${inv.company}،\n\nتجدون مرفقاً طيه فاتورة سداد اشتراك باقة ${inv.plan} لعام 2026 بقيمة إجمالية ${inv.total} ر.س.\n\nشكراً لتعاملكم معنا.` 
        : `Dear Billing Team at ${inv.companyEn},\n\nPlease find attached the tax invoice for your annual subscription to the ${inv.planEn} plan (${inv.total} SAR).\n\nThank you for choosing Daleel CRM.`
    );
    setSendSuccess(false);
    setIsSending(false);
  };

  const handleSendEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
    }, 2000);
  };

  const handlePrint = (inv: Invoice) => {
    setViewingInvoice(inv);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleDownloadPDF = (invId: string) => {
    const inv = invoices.find(i => i.id === invId);
    if (inv) {
      setViewingInvoice(inv);
      setTimeout(() => {
        window.print();
      }, 150);
    }
  };

  const handleExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Invoice ID,Company,Plan,Subtotal,Tax,Total,Date,Status\n";
    invoices.forEach(inv => {
      csvContent += `"${inv.id}","${inv.companyEn}","${inv.planEn}",${inv.amount},${inv.tax},${inv.total},${inv.date},"${inv.status}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "daleel_crm_invoices.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(isAr ? "تم تصدير سجل الفواتير بنجاح" : "Invoices log exported successfully!");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{isAr ? "جميع الفواتير الصادرة للشركات" : "All issued client invoices"}</p>
        <button onClick={handleExport} className="btn-outline cursor-pointer flex items-center gap-1.5"><Download className="w-4 h-4" /> {t("export")}</button>
      </div>

      <div className="table-wrap overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>{isAr ? "رقم الفاتورة" : "Invoice ID"}</th>
              <th>{t("companyName")}</th>
              <th>{t("plan")}</th>
              <th>{isAr ? "المبلغ" : "Subtotal"}</th>
              <th>{isAr ? "الضريبة" : "VAT"}</th>
              <th>{isAr ? "الإجمالي" : "Total"}</th>
              <th>{isAr ? "التاريخ" : "Date"}</th>
              <th>{t("status")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="font-bold text-slate-700 font-mono text-sm">{inv.id}</td>
                <td className="font-medium">{isAr ? inv.company : inv.companyEn}</td>
                <td><span className="badge badge-info">{isAr ? inv.plan : inv.planEn}</span></td>
                <td className="font-mono text-sm">{formatCurrency(inv.amount, locale)}</td>
                <td className="font-mono text-sm">{formatCurrency(inv.tax, locale)}</td>
                <td className="font-bold font-mono text-sm text-emerald-600">{formatCurrency(inv.total, locale)}</td>
                <td className="text-sm text-slate-500">{inv.date}</td>
                <td>
                  <span className={`badge ${inv.status === "paid" ? "badge-success" : "badge-danger"}`}>
                    {inv.status === "paid" ? (isAr ? "مدفوعة" : "Paid") : (isAr ? "غير مدفوعة" : "Unpaid")}
                  </span>
                </td>
                <td>
                  <div className="flex gap-0.5">
                    <button 
                      onClick={() => setViewingInvoice(inv)} 
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer transition-colors" 
                      title={isAr ? "عرض الفاتورة" : "View Invoice"}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDownloadPDF(inv.id)} 
                      className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 cursor-pointer transition-colors" 
                      title={isAr ? "تحميل PDF" : "Download PDF"}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handlePrint(inv)} 
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer transition-colors" 
                      title={isAr ? "طباعة" : "Print"}
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => startEmailFlow(inv)} 
                      className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 cursor-pointer transition-colors" 
                      title={isAr ? "إرسال بالبريد" : "Email Invoice"}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoice View Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100 print-area">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between no-print">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                {isAr ? "فاتورة سداد إلكترونية" : "Tax Invoice Details"}
              </h3>
              <button 
                type="button" 
                onClick={() => setViewingInvoice(null)} 
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Logo / Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-bold text-base text-slate-800">{isAr ? "دليل الشرق لتقنية المعلومات" : "Daleel Al Sharq IT Solutions"}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{isAr ? "الرقم الضريبي: ٣٠٢١٥٤٩٨٧٤٠٠٠٠٣" : "VAT ID: 302154987400003"}</p>
                  <p className="text-[10px] text-slate-400">{isAr ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}</p>
                </div>
                <div className="text-end">
                  <span className="text-xs font-bold text-slate-400 block">{isAr ? "رقم الفاتورة" : "Invoice No"}</span>
                  <span className="font-mono font-bold text-sm text-slate-800">{viewingInvoice.id}</span>
                </div>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">{isAr ? "مفوترة إلى:" : "Billed To:"}</span>
                  <span className="font-bold text-slate-800 mt-1 block">{isAr ? viewingInvoice.company : viewingInvoice.companyEn}</span>
                  <span className="text-slate-500 block">{isAr ? "الاشتراك السنوي في النظام" : "SaaS Annual Subscription"}</span>
                </div>
                <div className="text-end">
                  <span className="text-[10px] font-bold text-slate-400 block">{isAr ? "تاريخ الإصدار:" : "Billing Date:"}</span>
                  <span className="text-slate-800 font-medium mt-1 block">{viewingInvoice.date}</span>
                  <span className="text-[10px] font-bold text-slate-400 block mt-2">{isAr ? "طريقة السداد:" : "Billing Method:"}</span>
                  <span className="text-slate-800 font-medium block">{isAr ? "بطاقة دفع إلكترونية" : "Credit Card / Gateway"}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-100 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-start divide-y divide-slate-100">
                  <thead className="bg-slate-50 font-bold text-slate-500">
                    <tr>
                      <th className="p-3 text-start">{isAr ? "البيان" : "Description"}</th>
                      <th className="p-3 text-center">{isAr ? "الكمية" : "Qty"}</th>
                      <th className="p-3 text-end">{isAr ? "السعر" : "Price"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-3 font-semibold">
                        {isAr ? `اشتراك باقة: ${viewingInvoice.plan}` : `SaaS Subscription Plan: ${viewingInvoice.planEn}`}
                      </td>
                      <td className="p-3 text-center font-mono">1</td>
                      <td className="p-3 text-end font-mono">{formatCurrency(viewingInvoice.amount, locale)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="w-1/2 ml-auto space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>{isAr ? "المبلغ الخاضع للضريبة:" : "Subtotal:"}</span>
                  <span className="font-mono text-slate-700">{formatCurrency(viewingInvoice.amount, locale)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isAr ? "ضريبة القيمة المضافة (15%):" : "VAT (15%):"}</span>
                  <span className="font-mono text-slate-700">{formatCurrency(viewingInvoice.tax, locale)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-bold text-slate-800">
                  <span>{isAr ? "المبلغ المستحق السداد:" : "Invoice Total:"}</span>
                  <span className="font-mono text-emerald-600">{formatCurrency(viewingInvoice.total, locale)}</span>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex gap-2 border-t border-slate-100 pt-4 no-print">
                <button 
                  onClick={() => handleDownloadPDF(viewingInvoice.id)} 
                  className="btn-outline flex-1 cursor-pointer flex items-center justify-center gap-1.5 btn-sm"
                >
                  <Download className="w-4 h-4" /> {isAr ? "تنزيل الفاتورة PDF" : "Download PDF"}
                </button>
                <button 
                  onClick={() => handlePrint(viewingInvoice)} 
                  className="btn-outline flex-1 cursor-pointer flex items-center justify-center gap-1.5 btn-sm"
                >
                  <Printer className="w-4 h-4" /> {isAr ? "طباعة الفاتورة" : "Print Copy"}
                </button>
                <button 
                  onClick={() => startEmailFlow(viewingInvoice)} 
                  className="btn-accent flex-1 cursor-pointer flex items-center justify-center gap-1.5 btn-sm"
                >
                  <Mail className="w-4 h-4" /> {isAr ? "إرسال بالبريد" : "Email Client"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Email Modal */}
      {emailingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                {isAr ? "إرسال الفاتورة بالبريد" : "Send Invoice via Email"}
              </h3>
              <button 
                type="button" 
                onClick={() => setEmailingInvoice(null)} 
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              {!sendSuccess ? (
                <form onSubmit={handleSendEmailSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">{isAr ? "بريد العميل المستلم" : "Recipient Email"}</label>
                    <input
                      type="email"
                      required
                      value={targetEmail}
                      onChange={(e) => setTargetEmail(e.target.value)}
                      className="input text-sm font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">{isAr ? "عنوان الرسالة" : "Email Subject"}</label>
                    <input
                      type="text"
                      required
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="input text-sm font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">{isAr ? "محتوى الإيميل" : "Message Body"}</label>
                    <textarea
                      rows={5}
                      required
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="input text-sm leading-relaxed"
                    />
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={() => setEmailingInvoice(null)}
                      className="btn-outline flex-1 cursor-pointer btn-sm"
                    >
                      {isAr ? "إلغاء" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      disabled={isSending}
                      className="btn-accent flex-1 cursor-pointer btn-sm flex justify-center items-center gap-1.5"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          {isAr ? "جاري الإرسال..." : "Sending..."}
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          {isAr ? "إرسال الفاتورة" : "Send Email"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100 text-emerald-500">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{isAr ? "تم إرسال الفاتورة بنجاح!" : "Invoice Dispatched Successfully!"}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {isAr 
                        ? `تم إرسال نسخة رقمية من الفاتورة رقم ${emailingInvoice.id} إلى البريد ${targetEmail}.`
                        : `A billing PDF copy of Invoice ${emailingInvoice.id} was dispatched to ${targetEmail}.`}
                    </p>
                  </div>
                  <button
                    onClick={() => setEmailingInvoice(null)}
                    className="btn-primary cursor-pointer btn-sm px-6"
                  >
                    {isAr ? "إغلاق" : "Done"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
