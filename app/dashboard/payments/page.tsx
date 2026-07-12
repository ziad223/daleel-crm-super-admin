"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/context/DataContext";
import { formatCurrency } from "@/lib/utils";
import { Download, Eye, RotateCcw, X, CreditCard, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

type Payment = {
  id: number;
  company: string;
  companyEn: string;
  transactionId: string;
  method: string;
  methodEn: string;
  amount: number;
  tax: number;
  date: string;
  status: string;
};

export default function PaymentsPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";
  const { payments, setPayments } = useData();

  // Modals / Details states
  const [viewingPayment, setViewingPayment] = useState<Payment | null>(null);

  const handleRefund = (id: number) => {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;

    if (payment.status === "refunded") {
      toast.warning(isAr ? "هذه العملية تم استرجاعها بالفعل" : "This payment has already been refunded.");
      return;
    }

    const confirmRefund = window.confirm(
      isAr 
        ? `هل أنت متأكد من رغبتك في استرجاع مبلغ العملية (${formatCurrency(payment.amount, locale)}) لشركة "${payment.company}"؟`
        : `Are you sure you want to refund this payment (${formatCurrency(payment.amount, locale)}) to "${payment.companyEn}"?`
    );

    if (confirmRefund) {
      setPayments(prev => prev.map(p => {
        if (p.id === id) {
          toast.success(
            isAr 
              ? `تم استرجاع مبلغ العملية بنجاح لصالح شركة ${p.company}`
              : `Payment refunded successfully to ${p.companyEn}`
          );
          return { ...p, status: "refunded" as const };
        }
        return p;
      }));
    }
  };

  const handleExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Company,Transaction ID,Method,Amount,Tax,Date,Status\n";
    payments.forEach(p => {
      csvContent += `"${p.companyEn}",${p.transactionId},"${p.methodEn}",${p.amount},${p.tax},${p.date},${p.status}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "daleel_crm_payments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(isAr ? "تم تصدير سجل المدفوعات بنجاح" : "Payments log exported successfully!");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{isAr ? "جميع عمليات الدفع في المنصة" : "All payment transactions on the platform"}</p>
        <button onClick={handleExport} className="btn-outline cursor-pointer flex items-center gap-1.5"><Download className="w-4 h-4" /> {t("export")}</button>
      </div>

      <div className="table-wrap overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("companyName")}</th>
              <th>{isAr ? "رقم العملية" : "Transaction ID"}</th>
              <th>{isAr ? "وسيلة الدفع" : "Method"}</th>
              <th>{isAr ? "المبلغ" : "Amount"}</th>
              <th>{isAr ? "التاريخ" : "Date"}</th>
              <th>{t("status")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="font-medium">{isAr ? p.company : p.companyEn}</td>
                <td className="font-mono text-xs">{p.transactionId}</td>
                <td className="text-sm text-slate-600">{isAr ? p.method : p.methodEn}</td>
                <td className="font-medium font-mono">{formatCurrency(p.amount, locale)}</td>
                <td className="text-sm text-slate-500">{p.date}</td>
                <td>
                  <span className={`badge ${
                    p.status === "completed" ? "badge-success" : 
                    p.status === "refunded" ? "badge-warning" : 
                    "badge-danger"
                  }`}>
                    {p.status === "completed" ? (isAr ? "مكتملة" : "Completed") : 
                     p.status === "refunded" ? (isAr ? "مسترجعة" : "Refunded") : 
                     (isAr ? "فشلت" : "Failed")}
                  </span>
                </td>
                <td>
                  <div className="flex gap-0.5">
                    <button 
                      onClick={() => setViewingPayment(p)} 
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer transition-colors" 
                      title={isAr ? "عرض التفاصيل" : "View Details"}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleRefund(p.id)} 
                      disabled={p.status !== "completed"}
                      className={`p-1.5 rounded-lg transition-colors ${
                        p.status === "completed" 
                          ? "hover:bg-red-50 text-red-600 cursor-pointer" 
                          : "text-slate-350 cursor-not-allowed opacity-40"
                      }`} 
                      title={isAr ? "استرجاع العملية" : "Refund Transaction"}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Details Modal */}
      {viewingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-500" />
                {isAr ? "تفاصيل العملية المالية" : "Transaction Audit Info"}
              </h3>
              <button 
                type="button" 
                onClick={() => setViewingPayment(null)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex flex-col items-center py-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-400 font-medium">{isAr ? "المبلغ الإجمالي" : "Total Charged"}</p>
                <p className="text-2xl font-bold text-slate-800 font-mono mt-0.5">{formatCurrency(viewingPayment.amount + viewingPayment.tax, locale)}</p>
                <span className={`badge mt-2 ${
                  viewingPayment.status === "completed" ? "badge-success" : 
                  viewingPayment.status === "refunded" ? "badge-warning" : 
                  "badge-danger"
                }`}>
                  {viewingPayment.status === "completed" ? (isAr ? "عملية مقبولة ومكتملة" : "Approved & Completed") : 
                   viewingPayment.status === "refunded" ? (isAr ? "عملية مسترجعة" : "Refunded Transaction") : 
                   (isAr ? "فشلت العملية" : "Declined / Failed")}
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-400 font-semibold">{isAr ? "الشركة" : "Company"}</span>
                  <span className="font-bold text-slate-700">{isAr ? viewingPayment.company : viewingPayment.companyEn}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-400 font-semibold">{isAr ? "رقم التحويل" : "Transaction ID"}</span>
                  <span className="font-mono text-slate-700">{viewingPayment.transactionId}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-400 font-semibold">{isAr ? "تاريخ السداد" : "Billing Date"}</span>
                  <span className="text-slate-700 font-medium">{viewingPayment.date}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-400 font-semibold">{isAr ? "طريقة الدفع" : "Payment Method"}</span>
                  <span className="text-slate-700 font-medium">{isAr ? viewingPayment.method : viewingPayment.methodEn}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-400 font-semibold">{isAr ? "قيمة الباقة" : "Subtotal"}</span>
                  <span className="font-mono text-slate-700">{formatCurrency(viewingPayment.amount, locale)}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-400 font-semibold">{isAr ? "قيمة الضريبة (15%)" : "Tax (15% VAT)"}</span>
                  <span className="font-mono text-slate-700">{formatCurrency(viewingPayment.tax, locale)}</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-3 flex gap-2.5 border border-emerald-100 text-[11px] text-emerald-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">{isAr ? "حماية وتدقيق المعاملات" : "Compliance Audit Verified"}</p>
                  <p className="mt-0.5 leading-relaxed">
                    {isAr 
                      ? "هذه المعاملة مشفرة وموثقة عبر بوابات الدفع الرسمية الخاصة بالمنصة وتتوافق مع لوائح التجارة الإقليمية." 
                      : "This transaction is compliant with commercial gateway requirements and matches our ledger audits."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
