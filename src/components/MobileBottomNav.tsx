import React from 'react';
import {
  LayoutGrid,
  PackageSearch,
  ScanEye,
  FileSignature,
  Scale,
  Truck,
  ReceiptText,
  CalendarClock,
  Menu,
  Crown,
  CreditCard,
  FileBarChart,
  ClipboardCheck,
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { NavTab, UserProfile } from '../types/cargo';

interface MobileBottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenMobileMenu: () => void;
  pendingXrayCount: number;
  pendingAvsecCount: number;
  currentLang: Language;
  currentUser: UserProfile;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenMobileMenu,
  pendingXrayCount,
  pendingAvsecCount,
  currentLang,
  currentUser,
}) => {
  const t = translations[currentLang];

  let primaryTabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [];

  if (currentUser.role === 'MANAGERIAL') {
    primaryTabs = [
      { id: 'executive', label: 'Eksekutif', icon: <Crown className="w-5 h-5" /> },
      { id: 'dashboard', label: 'Dasbor', icon: <LayoutGrid className="w-5 h-5" /> },
      { id: 'invoicing', label: 'Keuangan', icon: <CreditCard className="w-5 h-5" /> },
      { id: 'reports', label: 'Laporan', icon: <FileBarChart className="w-5 h-5" /> },
    ];
  } else if (currentUser.role === 'ADMIN_CSD') {
    primaryTabs = [
      { id: 'dashboard', label: 'Dasbor', icon: <LayoutGrid className="w-5 h-5" /> },
      { id: 'weighing', label: 'Timbang', icon: <Scale className="w-5 h-5" /> },
      { id: 'checklist', label: 'Checklist', icon: <ClipboardCheck className="w-5 h-5" /> },
      { id: 'consignments', label: 'Kargo', icon: <PackageSearch className="w-5 h-5" /> },
    ];
  } else if (currentUser.role === 'DRIVER') {
    primaryTabs = [
      { id: 'dashboard', label: 'Dasbor', icon: <LayoutGrid className="w-5 h-5" /> },
      { id: 'dispatch', label: 'Lini 1', icon: <Truck className="w-5 h-5" /> },
      { id: 'handover', label: 'Handover', icon: <ReceiptText className="w-5 h-5" /> },
      { id: 'shift', label: 'Shift', icon: <CalendarClock className="w-5 h-5" /> },
    ];
  } else if (currentUser.role === 'HANDLER') {
    primaryTabs = [
      { id: 'dashboard', label: 'Dasbor', icon: <LayoutGrid className="w-5 h-5" /> },
      { id: 'consignments', label: 'Kargo', icon: <PackageSearch className="w-5 h-5" /> },
      { id: 'weighing', label: 'Timbang', icon: <Scale className="w-5 h-5" /> },
      { id: 'dispatch', label: 'Loading', icon: <Truck className="w-5 h-5" /> },
    ];
  } else if (currentUser.role === 'CHECKER') {
    primaryTabs = [
      { id: 'dashboard', label: 'Dasbor', icon: <LayoutGrid className="w-5 h-5" /> },
      { id: 'consignments', label: 'Kargo', icon: <PackageSearch className="w-5 h-5" /> },
      {
        id: 'xray',
        label: 'X-Ray',
        icon: <ScanEye className="w-5 h-5" />,
        badge: pendingXrayCount > 0 ? pendingXrayCount : undefined,
      },
      {
        id: 'avsec',
        label: 'AVSEC',
        icon: <FileSignature className="w-5 h-5" />,
        badge: pendingAvsecCount > 0 ? pendingAvsecCount : undefined,
      },
    ];
  } else {
    // ADMIN & SUPERADMIN
    primaryTabs = [
      { id: 'executive', label: 'Eksekutif', icon: <Crown className="w-5 h-5" /> },
      { id: 'dashboard', label: 'Dasbor', icon: <LayoutGrid className="w-5 h-5" /> },
      { id: 'consignments', label: 'Kargo', icon: <PackageSearch className="w-5 h-5" /> },
      {
        id: 'xray',
        label: 'X-Ray',
        icon: <ScanEye className="w-5 h-5" />,
        badge: pendingXrayCount > 0 ? pendingXrayCount : undefined,
      },
      { id: 'invoicing', label: 'Billing', icon: <CreditCard className="w-5 h-5" /> },
    ];
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-xl px-2 py-1 pb-safe flex items-center justify-around select-none">
      {primaryTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative ${
              isActive ? 'text-blue-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              {tab.icon}
              {tab.badge !== undefined && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-2xs">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[54px]">{tab.label}</span>
          </button>
        );
      })}

      {/* Menu / Drawer Toggle */}
      <button
        onClick={onOpenMobileMenu}
        className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
        aria-label="Buka menu lengkap"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 tracking-tight">Semua</span>
      </button>
    </nav>
  );
};
