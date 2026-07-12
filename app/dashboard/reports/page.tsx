"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { BarChart3, Download, TrendingUp, Calendar, ArrowUpRight, DollarSign, Building2, Users, X, Loader2, CheckCircle } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

// Mock datasets for different timeframes
const performanceMockData30d = [
  { date: "07-01", revenue: 5800, activeCompanies: 142, activeSub: 136, newLeads: 1200 },
  { date: "07-03", revenue: 6100, activeCompanies: 143, activeSub: 136, newLeads: 1400 },
  { date: "07-05", revenue: 7500, activeCompanies: 144, activeSub: 137, newLeads: 1800 },
  { date: "07-07", revenue: 9800, activeCompanies: 145, activeSub: 138, newLeads: 2100 },
  { date: "07-09", revenue: 11000, activeCompanies: 146, activeSub: 140, newLeads: 2500 },
  { date: "07-11", revenue: 12500, activeCompanies: 148, activeSub: 142, newLeads: 3100 }
];

const performanceMockData6m = [
  { date: "Feb 2026", revenue: 112000, activeCompanies: 115, activeSub: 111, newLeads: 28000 },
  { date: "Mar 2026", revenue: 125000, activeCompanies: 122, activeSub: 118, newLeads: 31000 },
  { date: "Apr 2026", revenue: 148000, activeCompanies: 128, activeSub: 124, newLeads: 35000 },
  { date: "May 2026", revenue: 162000, activeCompanies: 136, activeSub: 130, newLeads: 38000 },
  { date: "Jun 2026", revenue: 175000, activeCompanies: 141, activeSub: 135, newLeads: 41000 },
  { date: "Jul 2026", revenue: 187500, activeCompanies: 148, activeSub: 142, newLeads: 45000 }
];

const performanceMockData12m = [
  { date: "Aug 2025", revenue: 85000, activeCompanies: 95, activeSub: 90, newLeads: 18000 },
  { date: "Sep 2025", revenue: 89000, activeCompanies: 98, activeSub: 92, newLeads: 19500 },
  { date: "Oct 2025", revenue: 92000, activeCompanies: 102, activeSub: 96, newLeads: 21000 },
  { date: "Nov 2025", revenue: 95000, activeCompanies: 105, activeSub: 100, newLeads: 23000 },
  { date: "Dec 2025", revenue: 98000, activeCompanies: 110, activeSub: 105, newLeads: 25000 },
  { date: "Jan 2026", revenue: 105000, activeCompanies: 112, activeSub: 108, newLeads: 26500 },
  { date: "Feb 2026", revenue: 112000, activeCompanies: 115, activeSub: 111, newLeads: 28000 },
  { date: "Mar 2026", revenue: 125000, activeCompanies: 122, activeSub: 118, newLeads: 31000 },
  { date: "Apr 2026", revenue: 148000, activeCompanies: 128, activeSub: 124, newLeads: 35000 },
  { date: "May 2026", revenue: 162000, activeCompanies: 136, activeSub: 130, newLeads: 38000 },
  { date: "Jun 2026", revenue: 175000, activeCompanies: 141, activeSub: 135, newLeads: 41000 },
  { date: "Jul 2026", revenue: 187500, activeCompanies: 148, activeSub: 142, newLeads: 45000 }
];

const bestSellers = [
  { name: "Basic", nameAr: "الأساسية", sales: 120, revenue: 35880 },
  { name: "Professional", nameAr: "الاحترافية", sales: 245, revenue: 146755 },
  { name: "Enterprise", nameAr: "المؤسسية", sales: 85, revenue: 101915 }
];

const activeColors = ["#94A3B8", "#10B981", "#1E3A8A"];

export default function ReportsPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";

  const [activeTab, setActiveTab] = useState<"finance" | "growth" | "packages">("finance");
  const [timeframe, setTimeframe] = useState("6m");
  
  // Custom export report status modals
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Dynamic Chart Data mapping
  const [chartData, setChartData] = useState(performanceMockData6m);

  useEffect(() => {
    if (timeframe === "30d") {
      setChartData(performanceMockData30d);
    } else if (timeframe === "12m") {
      setChartData(performanceMockData12m);
    } else {
      setChartData(performanceMockData6m);
    }
  }, [timeframe]);

  const handleExportSubmit = () => {
    setIsExporting(true);
    setExportProgress(10);
    setExportSuccess(false);

    // Simulate compiling report data progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            triggerFileDownload();
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const triggerFileDownload = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (activeTab === "finance" || activeTab === "growth") {
      csvContent += "Date/Month,Revenue (SAR),Active Companies,Active Subscriptions,New Leads\n";
      chartData.forEach(d => {
        csvContent += `${d.date},${d.revenue},${d.activeCompanies},${d.activeSub},${d.newLeads}\n`;
      });
    } else {
      csvContent += "Plan Name,Total Sales,Total Revenue (SAR)\n";
      bestSellers.forEach(d => {
        csvContent += `"${isAr ? d.nameAr : d.name}",${d.sales},${d.revenue}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `daleel_crm_report_${activeTab}_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExporting(false);
    toast.success(isAr ? "تم تصدير ملف التقرير بنجاح" : "Report exported successfully as CSV!");
  };

  return (
    <div className="space-y-5">
      {/* Header and Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <p className="text-sm text-slate-500">
          {isAr
            ? "تقارير تحليلية ومؤشرات الأداء للمنصة بشكل شامل"
            : "Generate, visualize, and export system analytics, financial stats, and client usage metrics"}
        </p>

        <div className="flex gap-2 self-start sm:self-auto">
          {/* Timeframe Selector */}
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none pr-8 appearance-none cursor-pointer"
              style={{ paddingInlineStart: 30 }}
            >
              <option value="30d">{isAr ? "آخر 30 يوم" : "Last 30 Days"}</option>
              <option value="6m">{isAr ? "آخر 6 أشهر" : "Last 6 Months"}</option>
              <option value="12m">{isAr ? "آخر سنة" : "Last Year"}</option>
            </select>
            <Calendar className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" style={{ [isAr ? "right" : "left"]: 10 }} />
          </div>

          <button onClick={handleExportSubmit} className="btn-outline btn-sm cursor-pointer flex items-center gap-1.5">
            <Download className="w-4 h-4" /> {t("export")}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("finance")}
          className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "finance"
              ? "border-[var(--primary)] text-[var(--primary)] font-bold"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          {isAr ? "التقارير المالية" : "Financials Overview"}
        </button>
        <button
          onClick={() => setActiveTab("growth")}
          className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "growth"
              ? "border-[var(--primary)] text-[var(--primary)] font-bold"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          {isAr ? "نمو الشركات والمستخدمين" : "Growth & Signup Audits"}
        </button>
        <button
          onClick={() => setActiveTab("packages")}
          className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "packages"
              ? "border-[var(--primary)] text-[var(--primary)] font-bold"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          {isAr ? "أداء الباقات" : "Plans Performance"}
        </button>
      </div>

      {/* Dynamic Report Content */}
      <div className="grid md:grid-cols-4 gap-4">
        {activeTab === "finance" && (
          <>
            <div className="stat-card text-center py-5">
              <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500 border border-emerald-100 mx-auto mb-2">
                <DollarSign className="w-4.5 h-4.5" />
              </div>
              <p className="text-2xl font-extrabold text-slate-800 font-mono">187,500 SAR</p>
              <p className="text-xs text-slate-450 mt-1 font-semibold">{isAr ? "إيرادات الشهر الحالي" : "Current Month Revenue"}</p>
            </div>
            <div className="stat-card text-center py-5">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 border border-blue-100 mx-auto mb-2">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <p className="text-2xl font-extrabold text-slate-800 font-mono">+12.4%</p>
              <p className="text-xs text-slate-450 mt-1 font-semibold">{isAr ? "معدل النمو المالي" : "Revenue Growth Rate"}</p>
            </div>
            <div className="stat-card text-center py-5 lg:col-span-2">
              <div className="flex justify-between items-center px-1">
                <div className="text-start">
                  <p className="text-xs text-slate-450 font-semibold">{isAr ? "توقعات أرباح الربع القادم" : "Q3 Projected Earnings"}</p>
                  <p className="text-lg font-bold text-slate-750 font-mono mt-0.5">620,000 SAR</p>
                </div>
                <div className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  {isAr ? "ثقة مرتفعة" : "High Confidence"}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "growth" && (
          <>
            <div className="stat-card text-center py-5">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 border border-blue-100 mx-auto mb-2">
                <Building2 className="w-4.5 h-4.5" />
              </div>
              <p className="text-2xl font-extrabold text-slate-800 font-mono">{timeframe === "30d" ? "6" : timeframe === "12m" ? "53" : "33"}</p>
              <p className="text-xs text-slate-450 mt-1 font-semibold">{isAr ? "شركات مسجلة جديدة" : "New Companies Signed Up"}</p>
            </div>
            <div className="stat-card text-center py-5">
              <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center text-violet-500 border border-violet-100 mx-auto mb-2">
                <Users className="w-4.5 h-4.5" />
              </div>
              <p className="text-2xl font-extrabold text-slate-800 font-mono">{timeframe === "30d" ? "148" : timeframe === "12m" ? "1,240" : "850"}</p>
              <p className="text-xs text-slate-450 mt-1 font-semibold">{isAr ? "مستخدمين نشطين جدد" : "New User Accounts Created"}</p>
            </div>
          </>
        )}
      </div>

      {/* Main Charts Canvas */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-800">
            {activeTab === "finance" ? (isAr ? "منحنى الإيرادات التراكمي" : "Cumulative Revenue Trend Curve") :
             activeTab === "growth" ? (isAr ? "نمو حسابات المشتركين الجدد والعملاء المحتملين" : "Active Registrations & New Leads Intake Analytics") :
             (isAr ? "توزيع الإيرادات والمبيعات حسب باقة الاشتراك" : "Revenue and Conversions by Subscription Tier")}
          </h3>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === "finance" ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip formatter={(value) => [`${value} SAR`, isAr ? "الإيرادات" : "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            ) : activeTab === "growth" ? (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip />
                <Legend iconType="circle" />
                <Bar name={isAr ? "الشركات النشطة" : "Active Companies"} dataKey="activeCompanies" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                <Bar name={isAr ? "العملاء المحتملين Leads" : "New Leads"} dataKey="newLeads" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={bestSellers}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="sales"
                >
                  {bestSellers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={activeColors[index % activeColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} ${isAr ? "مبيعات" : "sales"}`, isAr ? "المبيعات" : "Sales"]} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export loading overlay */}
      {isExporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100 p-5 space-y-4 text-center">
            <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin mx-auto" />
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-800 text-sm">{isAr ? "جاري استخراج وتجميع التقارير" : "Compiling Report Datasets"}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isAr 
                  ? `جاري تحضير ملف CSV للتقرير (${activeTab}) بنسبة ${exportProgress}%...` 
                  : `Filtering table rows for tab ${activeTab} (${exportProgress}% compiled)...`}
              </p>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div 
                className="bg-[var(--primary)] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
