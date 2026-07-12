"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { FileEdit, Globe, Check, Eye, HelpCircle, Save, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";

type CMSPageItem = {
  id: number;
  title: string;
  titleAr: string;
  slug: string;
  lastUpdated: string;
  status: "published" | "draft";
  content: string;
  contentAr: string;
  seoDescription: string;
  seoDescriptionAr: string;
};

const initialPages: CMSPageItem[] = [
  { id: 1, title: "Homepage Hero & Landing", titleAr: "الرئيسية والعرض التسويقي", slug: "/", lastUpdated: "2026-07-10 14:22", status: "published", content: "Welcome to Daleel CRM SaaS Platform...", contentAr: "مرحباً بكم في منصة دليل الشرق لخدمات العملاء...", seoDescription: "SaaS CRM system for managing leads and sales.", seoDescriptionAr: "نظام إدارة علاقات العملاء والمبيعات للشركات." },
  { id: 2, title: "About Us Page", titleAr: "صفحة من نحن", slug: "/about", lastUpdated: "2026-07-08 11:10", status: "published", content: "Our company is built on customer-first principles...", contentAr: "تأسست شركتنا بناءً على مبدأ الأولوية للعميل...", seoDescription: "Who we are and what drives our platform.", seoDescriptionAr: "من نحن وما الذي يدفع منصتنا للأمام." },
  { id: 3, title: "Pricing & Plans Policy", titleAr: "جدول الأسعار والاشتراكات", slug: "/pricing", lastUpdated: "2026-07-09 09:30", status: "published", content: "Explore flexible licensing tiers...", contentAr: "اكتشف خطط الأسعار والترخيص المرنة...", seoDescription: "Flexible subscription pricing details.", seoDescriptionAr: "تفاصيل أسعار الاشتراك المرنة ومستويات الترخيص." },
  { id: 4, title: "Terms of Service", titleAr: "الشروط والأحكام", slug: "/terms", lastUpdated: "2026-07-01 10:00", status: "published", content: "These terms govern the use of our services...", contentAr: "تحكم هذه الشروط والأحكام استخدام خدماتنا الفنية...", seoDescription: "Daleel CRM terms of service agreement.", seoDescriptionAr: "اتفاقية وشروط الاستخدام الخاصة بالمنصة." },
  { id: 5, title: "Privacy Policy", titleAr: "سياسة الخصوصية", slug: "/privacy", lastUpdated: "2026-07-01 10:00", status: "published", content: "We value and protect your data...", contentAr: "نحن نقدر ونحمي بيانات حساباتكم الخاصة...", seoDescription: "How we collect and manage user data privacy.", seoDescriptionAr: "كيف نقوم بجمع وحماية بيانات المستخدمين لدينا." },
  { id: 6, title: "Refund Policy", titleAr: "سياسة الاسترجاع والضمان", slug: "/refunds", lastUpdated: "2026-06-25 15:40", status: "draft", content: "Review refund cycles and SLA periods...", contentAr: "مراجعة دورات استرداد الأموال وفترات الضمان والخدمة...", seoDescription: "License refunds and guarantees policy.", seoDescriptionAr: "سياسة استرجاع الأموال والضمان الخاصة بالتراخيص." },
  { id: 7, title: "Frequently Asked Questions (FAQ)", titleAr: "الأسئلة الشائعة FAQ", slug: "/faq", lastUpdated: "2026-07-05 16:30", status: "published", content: "Got questions? Find answers here...", contentAr: "هل لديك أسئلة؟ ابحث عن إجاباتك هنا...", seoDescription: "Helpful answers to common SaaS platform questions.", seoDescriptionAr: "إجابات مفيدة لجميع الأسئلة الشائعة حول المنصة." }
];

export default function CMSPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";

  const [cmsPages, setCmsPages] = useState<CMSPageItem[]>(initialPages);
  const [editingPage, setEditingPage] = useState<CMSPageItem | null>(null);

  // Edit fields
  const [editTitle, setEditTitle] = useState("");
  const [editTitleAr, setEditTitleAr] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editContentAr, setEditContentAr] = useState("");
  const [editSeo, setEditSeo] = useState("");
  const [editSeoAr, setEditSeoAr] = useState("");

  const handleStartEdit = (p: CMSPageItem) => {
    setEditingPage(p);
    setEditTitle(p.title);
    setEditTitleAr(p.titleAr);
    setEditSlug(p.slug);
    setEditContent(p.content);
    setEditContentAr(p.contentAr);
    setEditSeo(p.seoDescription);
    setEditSeoAr(p.seoDescriptionAr);
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    setCmsPages(prev => prev.map(p => {
      if (p.id === editingPage.id) {
        return {
          ...p,
          title: editTitle,
          titleAr: editTitleAr,
          slug: editSlug,
          content: editContent,
          contentAr: editContentAr,
          seoDescription: editSeo,
          seoDescriptionAr: editSeoAr,
          lastUpdated: new Date().toISOString().replace("T", " ").substring(0, 16)
        };
      }
      return p;
    }));

    setEditingPage(null);
    toast.success(isAr ? "تم حفظ محتوى الصفحة بنجاح!" : "CMS Page contents saved successfully!");
  };

  const handleToggleStatus = (id: number) => {
    setCmsPages(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === "published" ? "draft" : "published";
        toast.info(
          isAr 
            ? `تم تغيير حالة الصفحة إلى ${nextStatus === "published" ? "منشورة" : "مسودة"}` 
            : `Page status set to ${nextStatus}`
        );
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex justify-between items-center pb-2">
        <p className="text-sm text-slate-500">
          {isAr
            ? "تعديل محتوى موقع المنصة التعريفي، الشروط والأحكام وسياسات الخصوصية والأسعار"
            : "Manage and edit public marketing pages, static pricing lists, FAQs, legal policies, and footer links"}
        </p>
      </div>

      {/* List Grid */}
      <div className="table-wrap overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>{isAr ? "عنوان الصفحة" : "Page Title"}</th>
              <th>{isAr ? "الرابط البديل (Slug)" : "Slug"}</th>
              <th>{isAr ? "آخر تعديل" : "Last Updated"}</th>
              <th>{t("status")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {cmsPages.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="font-semibold text-sm text-slate-800">{isAr ? p.titleAr : p.title}</div>
                  <div className="text-[11px] text-slate-400 font-mono hidden sm:block">{isAr ? p.title : p.titleAr}</div>
                </td>
                <td className="text-sm font-mono text-blue-600">
                  <span className="inline-flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    {p.slug}
                  </span>
                </td>
                <td className="text-xs text-slate-500 font-mono">{p.lastUpdated}</td>
                <td>
                  <button
                    onClick={() => handleToggleStatus(p.id)}
                    className="focus:outline-none cursor-pointer"
                    title={isAr ? "تغيير حالة النشر" : "Toggle Publish Status"}
                  >
                    {p.status === "published" ? (
                      <span className="badge badge-success inline-flex items-center gap-1 cursor-pointer">
                        <Check className="w-3 h-3" />
                        {isAr ? "منشورة" : "Published"}
                      </span>
                    ) : (
                      <span className="badge badge-neutral inline-flex items-center gap-1 cursor-pointer">
                        {isAr ? "مسودة" : "Draft"}
                      </span>
                    )}
                  </button>
                </td>
                <td>
                  <div className="flex gap-0.5">
                    <button
                      onClick={() => handleStartEdit(p)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-blue-600 cursor-pointer"
                      title={isAr ? "تعديل المحتوى" : "Edit Page"}
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`https://daleelcrm.com${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"
                      title={isAr ? "معاينة الصفحة" : "Preview"}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Content Editor Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-bold text-slate-800">
                {isAr ? `تعديل محتوى: ${editingPage.titleAr}` : `Edit Page: ${editingPage.title}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-medium cursor-pointer"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
            </div>
            
            <form onSubmit={handleSavePage} className="p-5 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "عنوان الصفحة (إنجليزي)" : "Page Title (English)"}</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="input text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "عنوان الصفحة (عربي)" : "Page Title (Arabic)"}</label>
                  <input
                    type="text"
                    required
                    value={editTitleAr}
                    onChange={(e) => setEditTitleAr(e.target.value)}
                    className="input text-sm text-right"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "الرابط البديل (Slug)" : "Page Slug"}</label>
                  <input
                    type="text"
                    required
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    className="input font-mono text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                    {isAr ? "حالة النشر الحالية" : "Publish Status"}
                  </label>
                  <div className="flex items-center gap-2 pt-2.5">
                    <span className="text-xs text-slate-500 font-medium">{isAr ? "مسودة" : "Draft"}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(editingPage.id)}
                      className="text-slate-700 hover:opacity-80 transition-all focus:outline-none cursor-pointer"
                    >
                      {editingPage.status === "published" ? (
                        <ToggleRight className="w-9 h-9 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-slate-300" />
                      )}
                    </button>
                    <span className="text-xs text-slate-700 font-semibold">{isAr ? "منشورة ومتاحة" : "Published & Active"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">{isAr ? "وصف محركات البحث SEO (إنجليزي)" : "SEO Meta Description (English)"}</label>
                <input
                  type="text"
                  value={editSeo}
                  onChange={(e) => setEditSeo(e.target.value)}
                  className="input text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">{isAr ? "وصف محركات البحث SEO (عربي)" : "SEO Meta Description (Arabic)"}</label>
                <input
                  type="text"
                  value={editSeoAr}
                  onChange={(e) => setEditSeoAr(e.target.value)}
                  className="input text-xs text-right"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">{isAr ? "محتوى الصفحة (إنجليزي)" : "Page Content (English)"}</label>
                <textarea
                  rows={6}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="input font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">{isAr ? "محتوى الصفحة (عربي)" : "Page Content (Arabic)"}</label>
                <textarea
                  rows={6}
                  value={editContentAr}
                  onChange={(e) => setEditContentAr(e.target.value)}
                  className="input font-mono text-xs text-right"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="btn-outline btn-sm cursor-pointer"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="btn-primary btn-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" /> {isAr ? "حفظ التغييرات" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
