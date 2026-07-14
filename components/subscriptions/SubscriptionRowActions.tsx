"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, RefreshCw, ArrowUp, Pause, Play, Trash2 } from "lucide-react";

export default function SubscriptionRowActions({ 
  subscription, 
  isAr, 
  onExtend, 
  onUpgrade, 
  onTogglePayment,
  onDelete
}: { 
  subscription: any;
  isAr: boolean;
  onExtend: () => void;
  onUpgrade: () => void;
  onTogglePayment: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const confirmDelete = () => {
    onDelete();
    setShowDeleteModal(false);
    setOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-0.5 relative" ref={menuRef}>
        <button 
          onClick={onUpgrade}
          className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 cursor-pointer transition-colors" 
          title={isAr ? "ترقية الباقة" : "Upgrade Plan"}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setOpen(!open)} 
          className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
        >
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </button>
        
        {open && (
          <div className={`absolute top-full mt-1 ${isAr ? 'left-0' : 'right-0'} w-48 bg-white border border-slate-100 rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100`}>
            <button 
              onClick={() => { setOpen(false); onExtend(); }}
              className="w-full text-start px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer text-slate-700"
            >
              <RefreshCw className="w-4 h-4 text-blue-500" /> {isAr ? "تمديد الاشتراك (30 يوم)" : "Extend (30 Days)"}
            </button>
            <button 
              onClick={() => { setOpen(false); onTogglePayment(); }}
              className="w-full text-start px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer text-slate-700"
            >
              {subscription.paymentStatus === "paid" ? <Pause className="w-4 h-4 text-amber-500" /> : <Play className="w-4 h-4 text-emerald-500" />} 
              {subscription.paymentStatus === "paid" ? (isAr ? "تعليق الدفع" : "Suspend Payment") : (isAr ? "تأكيد الدفع" : "Confirm Payment")}
            </button>
            <hr className="my-1 border-slate-100" />
            <button 
              onClick={() => { setOpen(false); setShowDeleteModal(true); }}
              className="w-full text-start px-3 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2.5 cursor-pointer font-medium"
            >
              <Trash2 className="w-4 h-4" /> {isAr ? "إلغاء الاشتراك" : "Cancel Subscription"}
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
            <h3 className="text-xl font-bold text-center mb-2">{isAr ? "إلغاء الاشتراك" : "Cancel Subscription"}</h3>
            <p className="text-slate-500 text-center mb-6 text-sm leading-relaxed">
              {isAr 
                ? `هل أنت متأكد من رغبتك في إلغاء اشتراك "${subscription.company}" نهائياً؟ هذا الإجراء سيوقف وصولهم للخدمة.` 
                : `Are you sure you want to cancel the subscription for "${subscription.companyEn}"? This will revoke their access.`}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowDeleteModal(false)} className="btn bg-slate-100 hover:bg-slate-200 text-slate-700 flex-1 cursor-pointer font-medium border-0">
                {isAr ? "تراجع" : "Go Back"}
              </button>
              <button onClick={confirmDelete} className="btn bg-red-600 hover:bg-red-700 text-white flex-1 cursor-pointer font-medium border-0 shadow-lg shadow-red-600/20">
                {isAr ? "نعم، ألغِ الاشتراك" : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
