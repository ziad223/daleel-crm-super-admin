"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Palette, Upload, Eye, Image as ImageIcon, Check, Save, Sparkles, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function BrandingPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";

  const [activeTab, setActiveTab] = useState<"visuals" | "login" | "emails">("visuals");
  
  // Visuals state
  const [platformName, setPlatformName] = useState("Daleel CRM");
  const [primaryColor, setPrimaryColor] = useState("#1E3A8A");
  const [accentColor, setAccentColor] = useState("#10B981");
  const [sidebarBg, setSidebarBg] = useState("#0B1120");

  // Login visual state
  const [loginLayout, setLoginLayout] = useState("centered");
  const [welcomeText, setWelcomeText] = useState("Sign in to your dashboard");
  const [welcomeTextAr, setWelcomeTextAr] = useState("تسجيل الدخول إلى لوحة التحكم");

  // Email Templates state
  const [welcomeEmailSubject, setWelcomeEmailSubject] = useState("Welcome to Daleel CRM!");
  const [welcomeEmailBody, setWelcomeEmailBody] = useState("Hi {owner_name},\n\nThank you for choosing Daleel CRM. Your dashboard is ready at {dashboard_url}.");
  const [invoiceEmailSubject, setInvoiceEmailSubject] = useState("Your Monthly Invoice - Daleel CRM");
  const [invoiceEmailBody, setInvoiceEmailBody] = useState("Hi {owner_name},\n\nYour monthly subscription invoice {invoice_id} is generated. Total amount: {amount} SAR.");

  // Saving state
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const handlePresetColor = (pri: string, acc: string, side: string) => {
    setPrimaryColor(pri);
    setAccentColor(acc);
    setSidebarBg(side);
    toast.info(isAr ? "تم تطبيق رمز اللون الجاهز" : "Color preset applied!");
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <p className="text-sm text-slate-500">
          {isAr
            ? "تخصيص الهوية البصرية للمنصة، شعار النظام، ألوان الـ Sidebar، ونماذج رسائل البريد التلقائية"
            : "Customize white-label settings, logos, core application stylesheets, login screens, and transactional email layouts"}
        </p>

        <button type="submit" className="btn-primary btn-sm self-start sm:self-auto cursor-pointer">
          <Save className="w-4 h-4" /> {t("save")}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("visuals")}
          className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "visuals" ? "border-emerald-500 text-emerald-600 font-bold" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          {isAr ? "الهوية والألوان" : "Visual Identity & Themes"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("login")}
          className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "login" ? "border-emerald-500 text-emerald-600 font-bold" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          {isAr ? "شاشة الدخول" : "Login Customization"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("emails")}
          className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "emails" ? "border-emerald-500 text-emerald-600 font-bold" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          {isAr ? "قوالب البريد الإلكتروني" : "Transactional Email Templates"}
        </button>
      </div>

      {/* Visual Identity & Themes */}
      {activeTab === "visuals" && (
        <div className="grid md:grid-cols-12 gap-5">
          <div className="md:col-span-7 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-500" />
              {isAr ? "نظام الألوان والمظهر" : "Application Theme Colors"}
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "اسم النظام الرئيسي" : "White-label System Name"}</label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="input text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">{isAr ? "اللون الأساسي" : "Primary Color"}</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 border border-slate-200 rounded-lg cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="input py-1 font-mono text-xs max-w-[80px] text-center"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">{isAr ? "لون التمييز (Accent)" : "Accent Color"}</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 border border-slate-200 rounded-lg cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="input py-1 font-mono text-xs max-w-[80px] text-center"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">{isAr ? "خلفية القائمة الجانبية" : "Sidebar Theme"}</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={sidebarBg}
                    onChange={(e) => setSidebarBg(e.target.value)}
                    className="w-10 h-10 border border-slate-200 rounded-lg cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={sidebarBg}
                    onChange={(e) => setSidebarBg(e.target.value)}
                    className="input py-1 font-mono text-xs max-w-[80px] text-center"
                  />
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 block">{isAr ? "مجموعات ألوان جاهزة" : "Theme Presets"}</label>
              <div className="flex gap-3">
                {[
                  { name: isAr ? "كلاسيك" : "Classic Blue", pri: "#1E3A8A", acc: "#10B981", side: "#0B1120" },
                  { name: isAr ? "غابة الزمرد" : "Forest Emerald", pri: "#064E3B", acc: "#F59E0B", side: "#022C22" },
                  { name: isAr ? "الغروب الداكن" : "Sunset Dark", pri: "#4C1D95", acc: "#F43F5E", side: "#111827" }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetColor(preset.pri, preset.acc, preset.side)}
                    className="border border-slate-200 hover:border-slate-400 p-2.5 rounded-xl text-left bg-slate-50 transition-all text-xs font-medium space-y-1.5 flex-1"
                  >
                    <span className="block font-semibold text-slate-800">{preset.name}</span>
                    <div className="flex gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-full" style={{ background: preset.pri }} />
                      <div className="w-3.5 h-3.5 rounded-full" style={{ background: preset.acc }} />
                      <div className="w-3.5 h-3.5 rounded-full" style={{ background: preset.side }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Logo uploads panel */}
          <div className="md:col-span-5 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-500" />
              {isAr ? "شعار المنصة والـ Icon" : "Logo & Media Assets"}
            </h3>

            {/* Logo uploads */}
            <div className="border-2 border-dashed border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2.5">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold text-lg">
                {platformName.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">{isAr ? "تحميل الشعار الرئيسي (Main Logo)" : "Main Brand Logo"}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">SVG, PNG (max 200x50px, 2MB)</p>
              </div>
              <button type="button" className="btn-outline btn-xs py-1.5 px-3">
                <Upload className="w-3 h-3 mr-1" />
                {isAr ? "اختيار ملف..." : "Browse file..."}
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2.5">
              <div className="w-8 h-8 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center font-bold text-sm border border-slate-100">
                Icon
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">{isAr ? "تحميل الفايكون (Favicon)" : "Favicon (Icon)"}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">ICO, PNG (32x32px, 500KB)</p>
              </div>
              <button type="button" className="btn-outline btn-xs py-1.5 px-3">
                <Upload className="w-3 h-3 mr-1" />
                {isAr ? "اختيار ملف..." : "Browse file..."}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Customization */}
      {activeTab === "login" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-5">
          <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            {isAr ? "تخصيص واجهة تسجيل الدخول للمستخدمين" : "Login Portal Style Settings"}
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">{isAr ? "تخطيط شاشة الدخول" : "Layout Design Template"}</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "centered", label: isAr ? "وسطي (Centered)" : "Centered Card" },
                    { key: "split", label: isAr ? "منفصل (Split)" : "Split Screen" },
                    { key: "gradient", label: isAr ? "خلفية متدرجة" : "Vibrant Gradient" }
                  ].map((lay) => (
                    <button
                      key={lay.key}
                      type="button"
                      onClick={() => setLoginLayout(lay.key)}
                      className={`p-3 border rounded-xl text-xs font-semibold transition-all ${
                        loginLayout === lay.key
                          ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {lay.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">{isAr ? "نص الترحيب بالإنجليزية" : "Welcome Message (English)"}</label>
                <input
                  type="text"
                  value={welcomeText}
                  onChange={(e) => setWelcomeText(e.target.value)}
                  className="input text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">{isAr ? "نص الترحيب بالعربية" : "Welcome Message (Arabic)"}</label>
                <input
                  type="text"
                  value={welcomeTextAr}
                  onChange={(e) => setWelcomeTextAr(e.target.value)}
                  className="input text-sm text-right"
                />
              </div>
            </div>

            {/* Live mockup */}
            <div className="border border-slate-100 bg-slate-50 rounded-2xl p-6 flex flex-col justify-center items-center h-64 text-center select-none shadow-xs relative overflow-hidden">
              <span className="absolute top-3 left-3 text-[10px] text-slate-400 font-bold tracking-wider uppercase">Live Mockup Preview</span>
              {loginLayout === "gradient" && (
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-indigo-950 opacity-10" />
              )}
              {loginLayout === "split" && (
                <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-slate-900/10 border-l border-slate-200/50" />
              )}

              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-md mb-3">
                {platformName.charAt(0)}
              </div>
              <h4 className="font-bold text-sm text-slate-800">{platformName}</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-[200px]">{isAr ? welcomeTextAr : welcomeText}</p>
              
              <div className="w-48 bg-white border border-slate-200 rounded-lg p-1.5 mt-3 space-y-1.5">
                <div className="h-5 bg-slate-100 rounded-md" />
                <div className="h-5 bg-slate-100 rounded-md" />
                <div className="h-6 bg-slate-900 rounded-md text-[9px] text-white flex items-center justify-center font-bold">Sign In</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactional Email Templates */}
      {activeTab === "emails" && (
        <div className="grid md:grid-cols-2 gap-5">
          {/* Welcome Email */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500" />
              {isAr ? "قالب البريد الترحيبي (عند الاشتراك)" : "Welcome Email Template"}
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "عنوان الرسالة (Subject)" : "Email Subject"}</label>
              <input
                type="text"
                value={welcomeEmailSubject}
                onChange={(e) => setWelcomeEmailSubject(e.target.value)}
                className="input text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">
                {isAr ? "نص الرسالة (Body)" : "Email Body"}
              </label>
              <textarea
                rows={5}
                value={welcomeEmailBody}
                onChange={(e) => setWelcomeEmailBody(e.target.value)}
                className="input text-xs font-mono"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">Dynamic tags available: {"{owner_name}, {company_name}, {dashboard_url}"}</span>
            </div>
          </div>

          {/* Invoice Email */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500" />
              {isAr ? "قالب بريد الفواتير والدفع" : "Billing Invoice Email Template"}
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">{isAr ? "عنوان الرسالة (Subject)" : "Email Subject"}</label>
              <input
                type="text"
                value={invoiceEmailSubject}
                onChange={(e) => setInvoiceEmailSubject(e.target.value)}
                className="input text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">
                {isAr ? "نص الرسالة (Body)" : "Email Body"}
              </label>
              <textarea
                rows={5}
                value={invoiceEmailBody}
                onChange={(e) => setInvoiceEmailBody(e.target.value)}
                className="input text-xs font-mono"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">Dynamic tags available: {"{owner_name}, {invoice_id}, {amount}, {payment_date}"}</span>
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
                  <h4 className="font-bold text-slate-800 text-sm">{isAr ? "جاري تجميع وحفظ إعدادات الهوية" : "Publishing White-label System Visuals"}</h4>
                  <p className="text-xs text-slate-400">
                    {isAr 
                      ? `جاري كتابة ملفات التنسيق المخصصة... ${saveProgress}%` 
                      : `Writing custom asset files and stylesheets... ${saveProgress}%`}
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
                  <h4 className="font-bold text-slate-800 text-sm">{isAr ? "تم حفظ التخصيص بنجاح!" : "White-label Styles Published!"}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {isAr 
                      ? "تم تحديث ألوان النظام، الهوية، ونماذج الرسائل الصادرة، وسيتم تطبيقها على حسابات المشتركين."
                      : "Branding properties, custom colors, and notification templates are now live platform-wide."}
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
