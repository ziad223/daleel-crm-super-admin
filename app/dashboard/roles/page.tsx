"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Shield, Plus, Check, Save, UserCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Permission = "view" | "add" | "edit" | "delete" | "export" | "refund" | "print" | "download";

type ModulePermissions = {
  module: string;
  moduleAr: string;
  available: Permission[];
  granted: Permission[];
};

type Role = {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  permissions: ModulePermissions[];
};

const initialRoles: Role[] = [
  {
    id: "super_admin",
    name: "Super Admin",
    nameAr: "مدير النظام (سوبر أدمن)",
    description: "Full access to all modules and configurations.",
    descriptionAr: "صلاحية كاملة لجميع الأقسام والإعدادات في المنصة.",
    permissions: [
      { module: "Companies", moduleAr: "الشركات", available: ["view", "add", "edit", "delete", "export"], granted: ["view", "add", "edit", "delete", "export"] },
      { module: "Subscriptions", moduleAr: "الاشتراكات", available: ["view", "edit"], granted: ["view", "edit"] },
      { module: "Plans", moduleAr: "الباقات", available: ["add", "delete"], granted: ["add", "delete"] },
      { module: "Payments", moduleAr: "المدفوعات", available: ["refund"], granted: ["refund"] },
      { module: "Invoices", moduleAr: "الفواتير", available: ["print", "download"], granted: ["print", "download"] },
    ]
  },
  {
    id: "support",
    name: "Support Staff",
    nameAr: "الدعم الفني",
    description: "Manage tickets, view companies and subscriptions.",
    descriptionAr: "إدارة تذاكر الدعم وعرض الشركات وتفاصيل الاشتراكات.",
    permissions: [
      { module: "Companies", moduleAr: "الشركات", available: ["view", "add", "edit", "delete", "export"], granted: ["view", "edit"] },
      { module: "Subscriptions", moduleAr: "الاشتراكات", available: ["view", "edit"], granted: ["view"] },
      { module: "Plans", moduleAr: "الباقات", available: ["add", "delete"], granted: [] },
      { module: "Payments", moduleAr: "المدفوعات", available: ["refund"], granted: [] },
      { module: "Invoices", moduleAr: "الفواتير", available: ["print", "download"], granted: ["print"] },
    ]
  },
  {
    id: "finance",
    name: "Finance Manager",
    nameAr: "المالية والاشتراكات",
    description: "Manage subscription plans, invoices, and process refunds.",
    descriptionAr: "إدارة المدفوعات والاشتراكات والفواتير وإجراء عمليات الاسترجاع.",
    permissions: [
      { module: "Companies", moduleAr: "الشركات", available: ["view", "add", "edit", "delete", "export"], granted: ["view", "export"] },
      { module: "Subscriptions", moduleAr: "الاشتراكات", available: ["view", "edit"], granted: ["view", "edit"] },
      { module: "Plans", moduleAr: "الباقات", available: ["add", "delete"], granted: ["add"] },
      { module: "Payments", moduleAr: "المدفوعات", available: ["refund"], granted: ["refund"] },
      { module: "Invoices", moduleAr: "الفواتير", available: ["print", "download"], granted: ["print", "download"] },
    ]
  },
  {
    id: "sales",
    name: "Sales Agent",
    nameAr: "المبيعات والعملاء",
    description: "View and add new companies, view subscriptions.",
    descriptionAr: "عرض وإضافة شركات جديدة للاتفاق معهم ومتابعة الاشتراكات.",
    permissions: [
      { module: "Companies", moduleAr: "الشركات", available: ["view", "add", "edit", "delete", "export"], granted: ["view", "add", "export"] },
      { module: "Subscriptions", moduleAr: "الاشتراكات", available: ["view", "edit"], granted: ["view"] },
      { module: "Plans", moduleAr: "الباقات", available: ["add", "delete"], granted: [] },
      { module: "Payments", moduleAr: "المدفوعات", available: ["refund"], granted: [] },
      { module: "Invoices", moduleAr: "الفواتير", available: ["print", "download"], granted: [] },
    ]
  }
];

export default function RolesPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleNameAr, setNewRoleNameAr] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const selectedRole = roles[selectedRoleIndex];

  const handlePermissionToggle = (moduleIndex: number, perm: Permission) => {
    setRoles(prev => {
      const copy = [...prev];
      const roleCopy = { ...copy[selectedRoleIndex] };
      const moduleCopy = { ...roleCopy.permissions[moduleIndex] };
      
      if (moduleCopy.granted.includes(perm)) {
        moduleCopy.granted = moduleCopy.granted.filter(p => p !== perm);
      } else {
        moduleCopy.granted = [...moduleCopy.granted, perm];
      }
      
      roleCopy.permissions[moduleIndex] = moduleCopy;
      copy[selectedRoleIndex] = roleCopy;
      return copy;
    });
  };

  const handleSave = () => {
    toast.success(isAr ? "تم حفظ التعديلات بنجاح" : "Permissions saved successfully!");
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim() || !newRoleNameAr.trim()) {
      toast.error(isAr ? "يرجى إدخال اسم الدور باللغتين" : "Please input role names in both languages");
      return;
    }

    const newRole: Role = {
      id: `role_${Date.now()}`,
      name: newRoleName,
      nameAr: newRoleNameAr,
      description: "Custom role created by administrator.",
      descriptionAr: "دور مخصص تم إنشاؤه بواسطة مدير المنصة.",
      permissions: [
        { module: "Companies", moduleAr: "الشركات", available: ["view", "add", "edit", "delete", "export"], granted: ["view"] },
        { module: "Subscriptions", moduleAr: "الاشتراكات", available: ["view", "edit"], granted: ["view"] },
        { module: "Plans", moduleAr: "الباقات", available: ["add", "delete"], granted: [] },
        { module: "Payments", moduleAr: "المدفوعات", available: ["refund"], granted: [] },
        { module: "Invoices", moduleAr: "الفواتير", available: ["print", "download"], granted: [] },
      ]
    };

    setRoles([...roles, newRole]);
    setSelectedRoleIndex(roles.length);
    setNewRoleName("");
    setNewRoleNameAr("");
    setShowAddModal(false);
    toast.success(isAr ? "تم إضافة الدور الجديد بنجاح" : "New role added successfully!");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <p className="text-sm text-slate-500">
            {isAr ? "تحديد الصلاحيات والوصول لموظفي ومسؤولي لوحة الإشراف" : "Define system capabilities and roles for the platform administrators"}
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-accent btn-sm cursor-pointer">
          <Plus className="w-4 h-4" /> {isAr ? "إضافة دور جديد" : "Add New Role"}
        </button>
      </div>

      <div className="grid md:grid-cols-12 gap-5 items-start">
        {/* Roles Sidebar List */}
        <div className="md:col-span-4 space-y-2">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-400 mb-3 px-1 uppercase tracking-wider">
              {isAr ? "الأدوار المتاحة" : "Available Roles"}
            </h3>
            <div className="space-y-1">
              {roles.map((role, idx) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleIndex(idx)}
                  className={`w-full text-start flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                    selectedRoleIndex === idx
                      ? "bg-[var(--primary)] text-white shadow-sm font-semibold"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className={`w-4 h-4 ${selectedRoleIndex === idx ? "text-emerald-400" : "text-slate-400"}`} />
                    <span className="text-sm">{isAr ? role.nameAr : role.name}</span>
                  </div>
                  {selectedRoleIndex === idx && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-100 rounded-2xl p-4 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">{isAr ? "ملاحظة:" : "Notice:"}</p>
            <p>
              {isAr
                ? "أي تعديل على الصلاحيات سيطبق فوراً على جميع موظفي هذا الدور."
                : "Any changes to role permissions are applied immediately to all members."}
            </p>
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="md:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-500" />
                {isAr ? selectedRole.nameAr : selectedRole.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isAr ? selectedRole.descriptionAr : selectedRole.description}
              </p>
            </div>

            <div className="space-y-4">
              {selectedRole.permissions.map((p, mIdx) => (
                <div key={p.module} className="border border-slate-100 rounded-xl overflow-hidden shadow-xs">
                  <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-800">{isAr ? p.moduleAr : p.module}</span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase">{p.module}</span>
                  </div>

                  <div className="p-4 flex flex-wrap gap-4">
                    {p.available.map((perm) => {
                      const isGranted = p.granted.includes(perm);
                      return (
                        <label
                          key={perm}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                            isGranted
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-medium"
                              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isGranted}
                            onChange={() => handlePermissionToggle(mIdx, perm)}
                          />
                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                            isGranted ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"
                          }`}>
                            {isGranted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className="capitalize">{perm}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button onClick={handleSave} className="btn-primary cursor-pointer">
                <Save className="w-4 h-4" /> {isAr ? "حفظ التعديلات" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">{isAr ? "إضافة دور جديد" : "Add New Role"}</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-medium cursor-pointer"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
            </div>
            <form onSubmit={handleAddRole} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  {isAr ? "اسم الدور (إنجليزي)" : "Role Name (English)"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sales Supervisor"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  {isAr ? "اسم الدور (عربي)" : "Role Name (Arabic)"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مشرف مبيعات"
                  value={newRoleNameAr}
                  onChange={(e) => setNewRoleNameAr(e.target.value)}
                  className="input"
                />
              </div>

              <button type="submit" className="btn-accent w-full py-2.5 mt-2 cursor-pointer">
                <Plus className="w-4 h-4" /> {isAr ? "إنشاء الدور" : "Create Role"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
