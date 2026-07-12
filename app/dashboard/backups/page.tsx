"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Database, Plus, RefreshCw, Download, RotateCcw, Trash2, CheckCircle2, ShieldAlert, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

type BackupItem = {
  id: number;
  name: string;
  date: string;
  size: string;
  type: "db" | "files" | "full";
  status: "completed" | "failed" | "running";
};

const initialBackups: BackupItem[] = [
  { id: 1, name: "backup_prod_db_2026-07-11.sql", date: "2026-07-11 02:00", size: "48.2 MB", type: "db", status: "completed" },
  { id: 2, name: "backup_prod_assets_2026-07-10.tar.gz", date: "2026-07-10 03:30", size: "1.42 GB", type: "files", status: "completed" },
  { id: 3, name: "backup_full_system_2026-07-09.zip", date: "2026-07-09 01:00", size: "1.58 GB", type: "full", status: "completed" },
  { id: 4, name: "backup_prod_db_2026-07-08.sql", date: "2026-07-08 02:00", size: "47.9 MB", type: "db", status: "completed" },
  { id: 5, name: "backup_prod_db_2026-07-07.sql", date: "2026-07-07 02:00", size: "47.5 MB", type: "db", status: "failed" }
];

export default function BackupsPage() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";

  const [backups, setBackups] = useState<BackupItem[]>(initialBackups);
  const [backupType, setBackupType] = useState<"db" | "files" | "full">("db");

  // Operational states (No window alerts/confirms!)
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [tempBackupItem, setTempBackupItem] = useState<BackupItem | null>(null);

  const [restoringBackup, setRestoringBackup] = useState<BackupItem | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);

  const [deletingBackup, setDeletingBackup] = useState<BackupItem | null>(null);

  const handleCreateBackup = () => {
    setCreatingBackup(true);
    setBackupProgress(5);
    setBackupSuccess(false);

    const newBackup: BackupItem = {
      id: Date.now(),
      name: `backup_manual_${backupType}_${new Date().toISOString().split("T")[0]}.` + (backupType === "db" ? "sql" : backupType === "files" ? "tar.gz" : "zip"),
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      size: backupType === "db" ? "48.5 MB" : backupType === "files" ? "350 MB" : "410 MB",
      type: backupType,
      status: "completed"
    };
    setTempBackupItem(newBackup);

    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setBackups(old => [newBackup, ...old]);
          setBackupSuccess(true);
          return 100;
        }
        return prev + 20;
      });
    }, 450);
  };

  const handleRestoreSubmit = (item: BackupItem) => {
    setRestoringBackup(item);
    setIsRestoring(true);
    setRestoreProgress(10);
    setRestoreSuccess(false);

    const interval = setInterval(() => {
      setRestoreProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          setIsRestoring(false);
          setRestoreSuccess(true);
          return 100;
        }
        return prev + 15;
      });
    }, 300);
  };

  const confirmDeleteBackup = () => {
    if (!deletingBackup) return;
    setBackups(prev => prev.filter(b => b.id !== deletingBackup.id));
    toast.success(isAr ? "تم حذف النسخة الاحتياطية بنجاح" : "Backup file deleted successfully!");
    setDeletingBackup(null);
  };

  const handleDownload = (name: string) => {
    toast.info(isAr ? `جاري بدء تحميل الملف ${name}...` : `Starting download for ${name}...`);
  };

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <p className="text-sm text-slate-500">
          {isAr
            ? "إنشاء وإدارة النسخ الاحتياطية لقواعد البيانات ومستودعات التخزين السحابية يدوياً أو جدولتها"
            : "Manually compile snapshots, recover system state, and manage cloud backup historical files"}
        </p>

        {/* Action Controls */}
        <div className="flex gap-2 self-start sm:self-auto">
          <select
            value={backupType}
            onChange={(e) => setBackupType(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="db">{isAr ? "قاعدة البيانات فقط" : "Database Only"}</option>
            <option value="files">{isAr ? "الملفات المرفوعة" : "Uploads & Files"}</option>
            <option value="full">{isAr ? "نسخة كاملة للنظام" : "Full System Backup"}</option>
          </select>
          <button
            onClick={handleCreateBackup}
            className="btn-accent btn-sm cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            {isAr ? "إنشاء نسخة الآن" : "Backup Now"}
          </button>
        </div>
      </div>

      <div className="table-wrap overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>{isAr ? "اسم الملف" : "Backup Filename"}</th>
              <th>{isAr ? "تاريخ الحفظ" : "Date Created"}</th>
              <th>{isAr ? "الحجم" : "Size"}</th>
              <th>{isAr ? "النوع" : "Type"}</th>
              <th>{t("status")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {backups.map((b) => (
              <tr key={b.id}>
                <td className="font-mono text-sm font-semibold text-slate-700">{b.name}</td>
                <td className="text-sm text-slate-500">{b.date}</td>
                <td className="text-sm text-slate-700 font-medium font-mono">{b.size}</td>
                <td>
                  <span className="badge badge-info">
                    {b.type === "db" ? (isAr ? "قاعدة بيانات" : "Database") :
                     b.type === "files" ? (isAr ? "ملفات ووسائط" : "Assets") :
                     (isAr ? "نسخة كاملة" : "Full System")}
                  </span>
                </td>
                <td>
                  <span className={`badge ${
                    b.status === "completed" ? "badge-success" : 
                    b.status === "failed" ? "badge-danger" : 
                    "badge-neutral"
                  }`}>
                    {b.status === "completed" ? (isAr ? "سليمة ومكتملة" : "Completed") : 
                     b.status === "failed" ? (isAr ? "فشلت" : "Failed") : 
                     (isAr ? "جاري الحفظ" : "Running")}
                  </span>
                </td>
                <td>
                  <div className="flex gap-0.5">
                    <button
                      onClick={() => handleDownload(b.name)}
                      className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 cursor-pointer transition-colors"
                      title={isAr ? "تحميل الملف" : "Download File"}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRestoreSubmit(b)}
                      disabled={b.status !== "completed"}
                      className={`p-1.5 rounded-lg text-emerald-600 transition-colors ${
                        b.status === "completed" ? "hover:bg-emerald-50 cursor-pointer" : "opacity-30 cursor-not-allowed"
                      }`}
                      title={isAr ? "استعادة النظام لهذه اللحظة" : "Restore System State"}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingBackup(b)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 cursor-pointer transition-colors"
                      title={isAr ? "حذف الملف" : "Delete File"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Creating Backup Progress Modal */}
      {creatingBackup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100 p-5 space-y-4 text-center">
            {!backupSuccess ? (
              <div className="space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-sm">{isAr ? "جاري إنشاء النسخة الاحتياطية" : "Compiling System Backup"}</h4>
                  <p className="text-xs text-slate-400">
                    {isAr 
                      ? `جاري ضغط الملفات وتجميع قاعدة البيانات... ${backupProgress}%` 
                      : `Dumping schemas and compression in progress... ${backupProgress}%`}
                  </p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${backupProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{isAr ? "تم حفظ النسخة الاحتياطية!" : "Backup Created Successfully!"}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {isAr 
                      ? `تم تصدير وحفظ الملف "${tempBackupItem?.name}" سحابياً بنجاح وتأمينه.`
                      : `File "${tempBackupItem?.name}" was successfully stored and encrypted.`}
                  </p>
                </div>
                <button
                  onClick={() => setCreatingBackup(false)}
                  className="btn-primary cursor-pointer w-full py-2.5"
                >
                  {isAr ? "موافق" : "Done"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Restore Confirmation and Loader Modal */}
      {restoringBackup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100 p-5 space-y-4 text-center">
            {isRestoring ? (
              <div className="py-4 space-y-4">
                <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin mx-auto" />
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-sm">{isAr ? "جاري استعادة حالة النظام" : "Restoring System State"}</h4>
                  <p className="text-xs text-slate-400">
                    {isAr 
                      ? `جاري استبدال الجداول وملفات التكوين... ${restoreProgress}%` 
                      : `Importing SQL schemas and setting configs... ${restoreProgress}%`}
                  </p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-[var(--primary)] h-1.5 rounded-full transition-all duration-300" style={{ width: `${restoreProgress}%` }} />
                </div>
              </div>
            ) : restoreSuccess ? (
              <div className="py-2 space-y-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{isAr ? "تم استعادة النظام بالكامل!" : "System Restore Completed!"}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {isAr 
                      ? `تم بنجاح استرجاع تكوين وجداول النظام للحالة المستقرة الخاصة بملف "${restoringBackup.name}".`
                      : `State successfully reverted to checkpoint file "${restoringBackup.name}".`}
                  </p>
                </div>
                <button
                  onClick={() => setRestoringBackup(null)}
                  className="btn-primary cursor-pointer w-full py-2.5"
                >
                  {isAr ? "إغلاق" : "Close"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-100">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{isAr ? "تأكيد استعادة النظام" : "Confirm System Restore"}</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {isAr 
                      ? `تحذير: هل أنت متأكد من استبدال قاعدة البيانات الحالية واستعادة النظام للحالة المستقرة الخاصة بملف "${restoringBackup.name}"؟ سيتم استبدال وحذف أي مدخلات مالية أو أنشطة تمت بعد هذا التاريخ!`
                      : `Warning: Reverting system state to backup "${restoringBackup.name}" will overwrite all changes and billing updates occurred after its timestamp!`}
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRestoringBackup(null)}
                    className="btn-outline flex-1 cursor-pointer btn-sm"
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRestoreSubmit(restoringBackup)}
                    className="btn-accent flex-1 cursor-pointer btn-sm"
                  >
                    {isAr ? "استعادة الآن" : "Restore Checkpoint"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Backup Confirmation Modal */}
      {deletingBackup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100 p-5 space-y-4 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500 border border-red-100">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">
                {isAr ? "حذف نسخة احتياطية" : "Confirm Backup Deletion"}
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {isAr 
                  ? `هل أنت متأكد من حذف ملف النسخة الاحتياطية "${deletingBackup.name}" نهائياً من مستودع التخزين السحابي؟`
                  : `Are you sure you want to permanently delete backup file "${deletingBackup.name}" from storage repositories?`}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingBackup(null)}
                className="btn-outline flex-1 cursor-pointer btn-sm"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={confirmDeleteBackup}
                className="btn-danger bg-red-600 hover:bg-red-700 text-white flex-1 cursor-pointer btn-sm"
              >
                {isAr ? "حذف نهائي" : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
