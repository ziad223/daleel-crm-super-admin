"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import AddCompanyModal from "@/components/modals/AddCompanyModal";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguage();
  
  // Separate states for desktop and mobile sidebar visibility to prevent SSR/hydration flashes
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopCollapsed(!desktopCollapsed);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] overflow-x-hidden">
      <Sidebar 
        mobileOpen={mobileOpen} 
        desktopCollapsed={desktopCollapsed} 
        onClose={() => setMobileOpen(false)} 
      />
      
      <div 
        style={{
          paddingLeft: !desktopCollapsed ? (locale === "ar" ? 0 : 260) : 0,
          paddingRight: !desktopCollapsed ? (locale === "ar" ? 260 : 0) : 0
        }}
        className="max-lg:!p-0 min-h-screen flex flex-col transition-all duration-300 ease-in-out"
      >
        <Header onOpenSidebar={handleToggleSidebar} />
        <main className="p-4 sm:p-5 md:p-6 flex-1 w-full max-w-full overflow-hidden">
          {children}
        </main>
      </div>
      
      <AddCompanyModal />
    </div>
  );
}
