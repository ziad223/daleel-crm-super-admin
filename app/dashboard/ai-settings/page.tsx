"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Sparkles, Save, ShieldAlert, Cpu, Sliders, AlertCircle, Key, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type PlanLimit = {
  planId: string;
  name: string;
  nameAr: string;
  enabled: boolean;
  limitType: "tokens" | "calls";
  monthlyLimit: number;
};

export default function AISettingsPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";

  const [enableAI, setEnableAI] = useState(true);
  const [provider, setProvider] = useState("gemini");
  const [apiKey, setApiKey] = useState("AIzaSyD-mock-key-value-12345");
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState("gemini-2.5-flash");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are an assistant inside Daleel CRM. Help sales agents manage leads, draft replies, and summarize ticket threads."
  );
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1500);
  const [testing, setTesting] = useState(false);

  const [planLimits, setPlanLimits] = useState<PlanLimit[]>([
    { planId: "basic", name: "Basic", nameAr: "الأساسية", enabled: false, limitType: "calls", monthlyLimit: 0 },
    { planId: "professional", name: "Professional", nameAr: "الاحترافية", enabled: true, limitType: "calls", monthlyLimit: 500 },
    { planId: "enterprise", name: "Enterprise", nameAr: "المؤسسية", enabled: true, limitType: "tokens", monthlyLimit: 5000000 }
  ]);

  const handleTestConnection = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      toast.success(
        isAr 
          ? "تم الاتصال بنجاح! طراز الاستجابة: " + model 
          : `Connection succeeded! Response Model: ${model}`
      );
    }, 1500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isAr ? "تم حفظ إعدادات الذكاء الاصطناعي بنجاح" : "AI configurations saved successfully!");
  };

  const handleLimitChange = (idx: number, field: keyof PlanLimit, val: any) => {
    setPlanLimits(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <p className="text-sm text-slate-500">
          {isAr 
            ? "تكوين إعدادات الذكاء الاصطناعي الافتراضية للمنصة وربط مفاتيح API الخاصة بمزودي الخدمة" 
            : "Configure global AI endpoints, API credentials, prompts, and monthly token limits per subscription plan"}
        </p>
        <button type="submit" className="btn-primary btn-sm self-start sm:self-auto">
          <Save className="w-4 h-4" /> {t("save")}
        </button>
      </div>

      {/* Global AI Switch */}
      <div className="stat-card flex items-center justify-between p-5">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800">
              {isAr ? "تفعيل ميزات الذكاء الاصطناعي للمنصة" : "Enable AI Integration Globally"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr ? "تعطيل هذا الخيار سيوقف جميع روبوتات المحادثة ومولدات الردود في كل حسابات الشركات." : "Turning this off suspends all automated features, email assistants, and chatbots."}
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enableAI}
            onChange={(e) => setEnableAI(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
        </label>
      </div>

      {enableAI && (
        <div className="grid md:grid-cols-12 gap-5">
          {/* Main API Settings */}
          <div className="md:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-violet-500" />
                {isAr ? "بيانات مزود الخدمة" : "API Provider Credentials"}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "مزود الخدمة" : "Provider"}</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="input py-2"
                  >
                    <option value="gemini">Google Gemini</option>
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic Claude</option>
                    <option value="deepseek">DeepSeek AI</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">{isAr ? "الموديل النشط" : "Model"}</label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="input py-2 font-mono text-xs"
                  >
                    {provider === "gemini" && (
                      <>
                        <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                        <option value="gemini-2.5-pro">gemini-2.5-pro</option>
                      </>
                    )}
                    {provider === "openai" && (
                      <>
                        <option value="gpt-4o">gpt-4o</option>
                        <option value="gpt-4o-mini">gpt-4o-mini</option>
                      </>
                    )}
                    {provider === "anthropic" && (
                      <>
                        <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
                        <option value="claude-3-haiku">claude-3-5-haiku</option>
                      </>
                    )}
                    {provider === "deepseek" && (
                      <>
                        <option value="deepseek-chat">deepseek-chat</option>
                        <option value="deepseek-coder">deepseek-coder</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <Key className="w-3 h-3" /> {isAr ? "مفتاح API الخاص بك" : "Secret API Key"}
                </label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="input font-mono text-sm"
                    placeholder="Enter Secret Key"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute top-1/2 -translate-y-1/2 end-3 text-xs font-medium text-slate-500 hover:text-slate-700"
                  >
                    {showKey ? (isAr ? "إخفاء" : "Hide") : (isAr ? "إظهار" : "Show")}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="btn-outline btn-sm"
                >
                  {testing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      {isAr ? "جاري فحص الاتصال..." : "Testing endpoint..."}
                    </>
                  ) : (
                    isAr ? "اختبار الاتصال بالنظام" : "Test Provider Connection"
                  )}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-violet-500" />
                {isAr ? "إعدادات الاستجابة الافتراضية" : "Model Configurations"}
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">{isAr ? "التوجيه الأساسي للروبوت (System Instructions)" : "System Instructions / Prompt Template"}</label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="input min-h-[90px] text-sm"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>{isAr ? "درجة الحرارة (Temperature)" : "Temperature"}</span>
                    <span className="font-mono text-violet-600">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-violet-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>{isAr ? "الحد الأقصى للرموز (Max Tokens)" : "Max Output Tokens"}</span>
                    <span className="font-mono text-violet-600">{maxTokens}</span>
                  </div>
                  <input
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value) || 0)}
                    className="input py-1 text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Plan Limits */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-violet-500" />
                {isAr ? "حدود الباقات ومستويات الاستخدام" : "AI limits per Plan Tier"}
              </h3>
              
              <p className="text-xs text-slate-500">
                {isAr 
                  ? "قم بتعيين الحد الأقصى لاستدعاءات الذكاء الاصطناعي المسموح بها لكل شركة شهريًا بناءً على فئة الاشتراك."
                  : "Govern client resource allocations and define max tokens or AI request cycles allocated per billing cycle."}
              </p>

              <div className="space-y-4 pt-1">
                {planLimits.map((plan, idx) => (
                  <div key={plan.planId} className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-800">{isAr ? plan.nameAr : plan.name}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={plan.enabled}
                          onChange={(e) => handleLimitChange(idx, "enabled", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                      </label>
                    </div>

                    {plan.enabled ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-slate-500">{isAr ? "نوع الحصّة" : "Measure Unit"}</label>
                          <select
                            value={plan.limitType}
                            onChange={(e) => handleLimitChange(idx, "limitType", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none"
                          >
                            <option value="calls">{isAr ? "طلبات / شهر" : "Requests / mo"}</option>
                            <option value="tokens">{isAr ? "توكنز / شهر" : "Tokens / mo"}</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-slate-500">{isAr ? "الحد الشهري" : "Monthly Limit"}</label>
                          <input
                            type="number"
                            value={plan.monthlyLimit}
                            onChange={(e) => handleLimitChange(idx, "monthlyLimit", parseInt(e.target.value) || 0)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono focus:outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-red-500 italic">
                        {isAr ? "الذكاء الاصطناعي معطل لهذه الباقة" : "AI Access is disabled for this tier"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800 text-xs">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">{isAr ? "تحذير الأمان والاستهلاك" : "Usage Threshold Warning"}</p>
                <p className="mt-0.5 leading-relaxed">
                  {isAr 
                    ? "تأكد من تأمين مفتاح الـ API وتعيين سقف استهلاك مالي في لوحة تحكم مزود الخدمة مباشرة لمنع أي تكاليف زائدة غير متوقعة."
                    : "Make sure you set consumption alarms directly inside your OpenAI or Google Cloud Console billing manager as well."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
