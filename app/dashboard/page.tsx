"use client";

import {
  Building2, Users, UserPlus, DollarSign, CreditCard, FileText,
  Ticket, TrendingUp, AlertTriangle, CheckCircle2, Activity, Server, Database, RefreshCw
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { useData } from "@/lib/context/DataContext";
import {
  dashboardStats, monthlyRevenueData, newCompaniesData,
  planDistribution
} from "@/lib/mock/data";

function StatCard({ title, value, icon: Icon, color, change }: {
  title: string; value: string; icon: any; color: string; change?: string;
}) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 mb-1">{title}</p>
          <p className="text-xl font-bold tracking-tight">{value}</p>
          {change && <p className="text-[11px] text-emerald-600 mt-1 font-medium">{change}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminDashboard() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";
  const { companies, subscriptions, payments, tickets, invoices } = useData();

  // Dynamic calculations
  const totalCompaniesCount = companies.length;
  const activeCompaniesCount = companies.filter(c => c.status === "active").length;
  const suspendedCompaniesCount = companies.filter(c => c.status === "suspended").length;
  
  const activeSubscriptionsCount = subscriptions.filter(s => s.paymentStatus === "paid").length;
  const expiredSubscriptionsCount = subscriptions.filter(s => s.paymentStatus !== "paid").length;
  
  const totalUsersCount = companies.reduce((s, c) => s + c.users, 0);
  const totalLeadsCount = companies.reduce((s, c) => s + c.leads, 0);
  
  const totalRevenueSum = payments.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const monthlyRevenueSum = payments.filter(p => p.status === "completed" && p.date.startsWith("2026-07")).reduce((s, p) => s + p.amount, 0) || 187500;
  const yearlyRevenueSum = totalRevenueSum || 1845000;

  const mrrSum = monthlyRevenueSum;
  const arrSum = yearlyRevenueSum;
  const churnRate = "2.4%"; // Mock

  const stats = [
    { title: t("totalCompanies"), value: formatNumber(totalCompaniesCount, locale), icon: Building2, color: "bg-blue-50 text-blue-600", change: "+8%" },
    { title: t("activeCompanies"), value: formatNumber(activeCompaniesCount, locale), icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
    { title: t("suspendedCompanies"), value: formatNumber(suspendedCompaniesCount, locale), icon: AlertTriangle, color: "bg-red-50 text-red-600" },
    { title: isAr ? "MRR (إيرادات شهرية)" : "MRR", value: formatCurrency(mrrSum, locale), icon: RefreshCw, color: "bg-violet-50 text-violet-600", change: "+5%" },
    { title: isAr ? "ARR (إيرادات سنوية)" : "ARR", value: formatCurrency(arrSum, locale), icon: TrendingUp, color: "bg-indigo-50 text-indigo-600", change: "+12%" },
    { title: isAr ? "معدل الإلغاء (Churn)" : "Churn Rate", value: churnRate, icon: AlertTriangle, color: "bg-rose-50 text-rose-600", change: "-0.5%" },
    { title: t("activeSubscriptions"), value: formatNumber(activeSubscriptionsCount, locale), icon: CreditCard, color: "bg-violet-50 text-violet-600" },
    { title: t("expiredSubscriptions"), value: formatNumber(expiredSubscriptionsCount, locale), icon: AlertTriangle, color: "bg-amber-50 text-amber-600" },
    { title: t("totalUsers"), value: formatNumber(totalUsersCount, locale), icon: Users, color: "bg-indigo-50 text-indigo-600" },
    { title: t("totalLeads"), value: formatNumber(totalLeadsCount, locale), icon: UserPlus, color: "bg-cyan-50 text-cyan-600" },
    { title: t("totalRevenue"), value: formatCurrency(yearlyRevenueSum, locale), icon: DollarSign, color: "bg-green-50 text-green-700" },
    { title: t("supportTickets"), value: formatNumber(tickets.length, locale), icon: Ticket, color: "bg-orange-50 text-orange-600" },
  ];

  const chartData = monthlyRevenueData.map(d => ({
    ...d,
    label: isAr ? d.monthAr : d.month,
  }));

  const companiesChart = newCompaniesData.map(d => ({
    ...d,
    label: isAr ? d.monthAr : d.month,
  }));

  return (
    <div className="space-y-5">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="stat-card">
          <h3 className="font-bold text-base mb-4">{t("monthlyRevenueChart")}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v, locale)} />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#rev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card">
          <h3 className="font-bold text-base mb-4">{t("newCompaniesChart")}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companiesChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#1E3A8A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Plan Distribution + Top Companies */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="stat-card">
          <h3 className="font-bold text-base mb-4">{t("subscriptionsByPlan")}</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planDistribution} dataKey="value" nameKey={isAr ? "nameAr" : "name"} cx="50%" cy="50%" outerRadius={75} label>
                  {planDistribution.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {planDistribution.map((p, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                {isAr ? p.nameAr : p.name} ({p.value})
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card lg:col-span-2">
          <h3 className="font-bold text-base mb-4">{t("topCompanies")}</h3>
          <div className="space-y-3">
            {companies.slice(0, 5).map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">{i + 1}</div>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-bold">{c.logo}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{isAr ? c.name : c.nameEn}</div>
                  <div className="text-[11px] text-slate-400">{isAr ? c.plan : c.planEn} · {c.users} users · {formatNumber(c.leads, locale)} leads</div>
                </div>
                <span className={`badge ${c.status === "active" ? "badge-success" : "badge-danger"}`}>
                  {c.status === "active" ? t("active") : t("inactive")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent Companies */}
        <div className="table-wrap">
          <div className="px-4 py-3.5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-sm">{t("recentCompanies")}</h3>
            <a href="/dashboard/companies" className="text-xs text-blue-600 hover:underline">{t("view")}</a>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("companyName")}</th>
                  <th>{t("plan")}</th>
                  <th>{t("status")}</th>
                </tr>
              </thead>
              <tbody>
                {companies.slice(0, 4).map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold">{c.logo}</div>
                        <span className="font-medium text-sm">{isAr ? c.name : c.nameEn}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-info text-[10px]">{isAr ? c.plan : c.planEn}</span></td>
                    <td>
                      <span className={`badge ${c.status === "active" ? "badge-success" : "badge-danger"}`}>
                        {c.status === "active" ? t("active") : t("inactive")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="table-wrap">
          <div className="px-4 py-3.5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-sm">{t("recentPayments")}</h3>
            <a href="/dashboard/payments" className="text-xs text-blue-600 hover:underline">{t("view")}</a>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("companyName")}</th>
                  <th>{isAr ? "المبلغ" : "Amount"}</th>
                  <th>{t("status")}</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 4).map((p) => (
                  <tr key={p.id}>
                    <td className="font-medium text-sm">{isAr ? p.company : p.companyEn}</td>
                    <td className="font-medium">{formatCurrency(p.amount, locale)}</td>
                    <td>
                      <span className={`badge ${p.status === "completed" ? "badge-success" : "badge-danger"}`}>
                        {p.status === "completed" ? (isAr ? "مكتمل" : "Completed") : (isAr ? "فشل" : "Failed")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
