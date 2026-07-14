"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogIn, MoreHorizontal, Edit, PauseCircle, PlayCircle, Trash2 } from "lucide-react";

export default function CompanyRowActions({ company, setCompanies, t, isAr }: { company: any, setCompanies: any, t: any, isAr: boolean }) {
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusToggle = () => {
    setCompanies((prev: any[]) => prev.map((c: any) => 
      c.id === company.id 
        ? { ...c, status: c.status === "active" ? "suspended" : "active" } 
        : c
    ));
    setOpen(false);
  };

  const confirmDelete = () => {
    setCompanies((prev: any[]) => prev.filter((c: any) => c.id !== company.id));
    setShowDeleteModal(false);
    setOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-0.5 relative" ref={menuRef}>
        <button onClick={() => setShowLoginModal(true)} className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 cursor-pointer transition-colors" title={t("loginAs")}>
          <LogIn className="w-4 h-4" />
        </button>
        <button onClick={() => setOpen(!open)} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </button>
        
        {open && (
          <div className={`absolute top-full mt-1 ${isAr ? 'left-0' : 'right-0'} w-48 bg-white border border-slate-100 rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100`}>
            <Link href={`/dashboard/companies/${company.id}/edit`} className="w-full text-start px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer text-slate-700">
              <Edit className="w-4 h-4 text-slate-400" /> {isAr ? "تعديل بيانات الشركة" : "Edit Company"}
            </Link>
            <button onClick={handleStatusToggle} className="w-full text-start px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer text-slate-700">
              {company.status === "active" ? <PauseCircle className="w-4 h-4 text-amber-500" /> : <PlayCircle className="w-4 h-4 text-emerald-500" />} 
              {company.status === "active" ? (isAr ? "إيقاف الشركة مؤقتاً" : "Suspend Company") : (isAr ? "تفعيل الشركة" : "Activate Company")}
            </button>
            <hr className="my-1 border-slate-100" />
            <button onClick={() => { setOpen(false); setShowDeleteModal(true) }} className="w-full text-start px-3 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2.5 cursor-pointer font-medium">
              <Trash2 className="w-4 h-4" /> {isAr ? "حذف الشركة نهائياً" : "Delete Company"}
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200 whitespace-normal">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-5 mx-auto border-4 border-red-100">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">{isAr ? "حذف الشركة" : "Delete Company"}</h3>
            <p className="text-slate-500 text-center mb-6 text-sm leading-relaxed">
              {isAr 
                ? `هل أنت متأكد من رغبتك في حذف شركة "${company.name}" بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء.` 
                : `Are you sure you want to permanently delete "${company.nameEn}"? This action cannot be undone.`}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowDeleteModal(false)} className="btn bg-slate-100 hover:bg-slate-200 text-slate-700 flex-1 cursor-pointer font-medium border-0">
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button onClick={confirmDelete} className="btn bg-red-600 hover:bg-red-700 text-white flex-1 cursor-pointer font-medium border-0 shadow-lg shadow-red-600/20">
                {isAr ? "نعم، احذف الشركة" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login As Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200 whitespace-normal">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 mx-auto border-4 border-emerald-100">
              <LogIn className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">{isAr ? "الدخول كشركة" : "Login As Company"}</h3>
            <p className="text-slate-500 text-center mb-6 text-sm leading-relaxed">
              {isAr 
                ? `سيتم تحويلك إلى لوحة تحكم شركة "${company.name}". ستتمكن من رؤية وتعديل بياناتهم وكأنك صاحب الشركة.` 
                : `You will be redirected to the dashboard of "${company.nameEn}".`}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowLoginModal(false)} className="btn bg-slate-100 hover:bg-slate-200 text-slate-700 flex-1 cursor-pointer font-medium border-0">
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button onClick={() => {
                setShowLoginModal(false);
                alert(isAr ? `جاري الدخول كـ ${company.name}` : `Logging in as ${company.nameEn}`);
              }} className="btn bg-emerald-600 hover:bg-emerald-700 text-white flex-1 cursor-pointer font-medium border-0 shadow-lg shadow-emerald-600/20">
                {isAr ? "متابعة الدخول" : "Proceed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
