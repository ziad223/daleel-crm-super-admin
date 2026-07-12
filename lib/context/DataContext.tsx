"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  companies as mockCompanies,
  subscriptions as mockSubscriptions,
  payments as mockPayments,
  invoices as mockInvoices,
  tickets as mockTickets,
  adminUsers as mockAdminUsers,
  plans as mockPlans
} from "@/lib/mock/data";

type Company = typeof mockCompanies[0];
type Subscription = typeof mockSubscriptions[0];
type Payment = typeof mockPayments[0];
type Invoice = typeof mockInvoices[0];
type Ticket = typeof mockTickets[0];
type AdminUser = typeof mockAdminUsers[0];
type Plan = typeof mockPlans[0];

type DataContextType = {
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  subscriptions: Subscription[];
  setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  adminUsers: AdminUser[];
  setAdminUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  plans: Plan[];
  setPlans: React.Dispatch<React.SetStateAction<Plan[]>>;
  
  showAddCompanyModal: boolean;
  setShowAddCompanyModal: (show: boolean) => void;
  showSearchModal: boolean;
  setShowSearchModal: (show: boolean) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);

  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const getLocal = <T,>(key: string, fallback: T): T => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
      };

      setCompanies(getLocal("daleel_companies", mockCompanies));
      setSubscriptions(getLocal("daleel_subscriptions", mockSubscriptions));
      setPayments(getLocal("daleel_payments", mockPayments));
      setInvoices(getLocal("daleel_invoices", mockInvoices));
      setTickets(getLocal("daleel_tickets", mockTickets));
      setAdminUsers(getLocal("daleel_admin_users", mockAdminUsers));
      setPlans(getLocal("daleel_plans", mockPlans));
      setLoaded(true);
    }
  }, []);

  // Sync back to LocalStorage
  useEffect(() => {
    if (loaded && typeof window !== "undefined") {
      localStorage.setItem("daleel_companies", JSON.stringify(companies));
    }
  }, [companies, loaded]);

  useEffect(() => {
    if (loaded && typeof window !== "undefined") {
      localStorage.setItem("daleel_subscriptions", JSON.stringify(subscriptions));
    }
  }, [subscriptions, loaded]);

  useEffect(() => {
    if (loaded && typeof window !== "undefined") {
      localStorage.setItem("daleel_payments", JSON.stringify(payments));
    }
  }, [payments, loaded]);

  useEffect(() => {
    if (loaded && typeof window !== "undefined") {
      localStorage.setItem("daleel_invoices", JSON.stringify(invoices));
    }
  }, [invoices, loaded]);

  useEffect(() => {
    if (loaded && typeof window !== "undefined") {
      localStorage.setItem("daleel_tickets", JSON.stringify(tickets));
    }
  }, [tickets, loaded]);

  useEffect(() => {
    if (loaded && typeof window !== "undefined") {
      localStorage.setItem("daleel_admin_users", JSON.stringify(adminUsers));
    }
  }, [adminUsers, loaded]);

  useEffect(() => {
    if (loaded && typeof window !== "undefined") {
      localStorage.setItem("daleel_plans", JSON.stringify(plans));
    }
  }, [plans, loaded]);

  return (
    <DataContext.Provider
      value={{
        companies,
        setCompanies,
        subscriptions,
        setSubscriptions,
        payments,
        setPayments,
        invoices,
        setInvoices,
        tickets,
        setTickets,
        adminUsers,
        setAdminUsers,
        plans,
        setPlans,
        showAddCompanyModal,
        setShowAddCompanyModal,
        showSearchModal,
        setShowSearchModal
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
