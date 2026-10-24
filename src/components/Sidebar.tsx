import React, { useState } from 'react';
import {
  LayoutGrid,
  PackageSearch,
  ClipboardCheck,
  ScanEye,
  FileSignature,
  Scale,
  Truck,
  ReceiptText,
  Columns3,
  AlertOctagon,
  CreditCard,
  FileBarChart,
  CalendarClock,
  Fingerprint,
  SlidersHorizontal,
  Plane,
  X,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Crown,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, translations } from '../i18n/translations';
import { UserProfile, UserRole, NavTab, ROLE_ALLOWED_TABS } from '../types/cargo';

export type { NavTab };

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  openExceptionsCount: number;
  pendingXrayCount: number;
  pendingAvsecCount: number;
  onOpenShiftModal: () => void;
  currentLang: Language;
  currentUser: UserProfile;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  openExceptionsCount,
  pendingXrayCount,
  pendingAvsecCount,
  onOpenShiftModal,
  currentLang,
  currentUser,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const t = translations[currentLang];
  // Default to compact icon-only view for a sleek floating pill aesthetic
  const [isExpanded, setIsExpanded] = useState(false);

  interface MenuItem {
    id: NavTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }

  interface MenuSection {
    sectionTitle: string;
    items: MenuItem[];
  }

  // Unified single cohesive theme: Professional Solid Blue #2563EB across all menu items
  const sections: MenuSection[] = [
    {
      sectionTitle: currentLang === 'id' ? 'EKSEKUTIF & STRATEGIS' : 'EXECUTIVE & STRATEGY',
      items: [
        {
          id: 'executive',
          label: currentLang === 'id' ? 'Dashboard Eksekutif' : 'Executive Cockpit',
          icon: <Crown className="w-5 h-5 shrink-0" />,
        },
      ],
    },
    {
      sectionTitle: currentLang === 'id' ? 'OPERASIONAL UTAMA' : 'CORE OPERATIONS',
      items: [
        {
          id: 'dashboard',
          label: t.navDashboard,
          icon: <LayoutGrid className="w-5 h-5 shrink-0" />,
        },
        {
          id: 'consignments',
          label: currentLang === 'id' ? 'Registrasi & Kargo' : 'Consignments & AWB',
          icon: <PackageSearch className="w-5 h-5 shrink-0" />,
        },
        {
          id: 'checklist',
          label: currentLang === 'id' ? 'Checklist & Alat EVD' : 'Checklist & EVD Detector',
          icon: <ClipboardCheck className="w-5 h-5 shrink-0" />,
        },
        {
          id: 'xray',
          label: currentLang === 'id' ? 'Screening X-Ray' : 'X-Ray Dual-View',
          icon: <ScanEye className="w-5 h-5 shrink-0" />,
          badge: pendingXrayCount > 0 ? pendingXrayCount : undefined,
          badgeColor: 'bg-blue-100 text-blue-700',
        },
        {
          id: 'avsec',
          label: currentLang === 'id' ? 'Konfirmasi AVSEC' : 'AVSEC Fit-to-Fly',
          icon: <FileSignature className="w-5 h-5 shrink-0" />,
          badge: pendingAvsecCount > 0 ? pendingAvsecCount : undefined,
          badgeColor: 'bg-blue-100 text-blue-700',
        },
        {
          id: 'weighing',
          label: currentLang === 'id' ? 'Timbang & CSD / STK' : 'Weighing & CSD/STK',
          icon: <Scale className="w-5 h-5 shrink-0" />,
        },
        {
          id: 'dispatch',
          label: currentLang === 'id' ? 'Loading & Lini 1' : 'Loading & Line 1 Dispatch',
          icon: <Truck className="w-5 h-5 shrink-0" />,
        },
        {
          id: 'handover',
          label: currentLang === 'id' ? 'DO & Serah Terima' : 'DO, BTB & PoH Handover',
          icon: <ReceiptText className="w-5 h-5 shrink-0" />,
        },
      ],
    },
    {
      sectionTitle: currentLang === 'id' ? 'DISPOSISI & KEUANGAN' : 'DISPATCH & BILLING',
      items: [
        {
          id: 'kanban',
          label: currentLang === 'id' ? 'Papan Disposisi' : 'Operational Kanban',
          icon: <Columns3 className="w-5 h-5 shrink-0" />,
        },
        {
          id: 'exceptions',
          label: currentLang === 'id' ? 'Tiket Eksepsi' : 'Exception Ledger',
          icon: <AlertOctagon className="w-5 h-5 shrink-0" />,
          badge: openExceptionsCount > 0 ? openExceptionsCount : undefined,
          badgeColor: 'bg-rose-500 text-white',
        },
        {
          id: 'invoicing',
          label: currentLang === 'id' ? 'Invoice & Pembayaran' : 'Invoices & Payments',
          icon: <CreditCard className="w-5 h-5 shrink-0" />,
        },
      ],
    },
    {
      sectionTitle: currentLang === 'id' ? 'LAPORAN & TATA KELOLA' : 'REPORTS & GOVERNANCE',
      items: [
        {
          id: 'reports',
          label: currentLang === 'id' ? 'Pusat Laporan & Ekspor' : 'Reports & Exports',
          icon: <FileBarChart className="w-5 h-5 shrink-0" />,
        },
        {
          id: 'shift',
          label: currentLang === 'id' ? 'Logbook Shift' : 'Shift Logbook',
          icon: <CalendarClock className="w-5 h-5 shrink-0" />,
        },
        {
          id: 'audit',
          label: currentLang === 'id' ? 'Jejak Audit & Kontrol' : 'Audit Trail & Controls',
          icon: <Fingerprint className="w-5 h-5 shrink-0" />,
        },
        {
          id: 'settings',
          label: currentLang === 'id' ? 'SOP & Kebijakan SLA' : 'SOP & SLA Policies',
          icon: <SlidersHorizontal className="w-5 h-5 shrink-0" />,
        },
      ],
    },
  ];

  // RBAC Filtering: Display only authorized modules for the current role
  const allowedTabs = ROLE_ALLOWED_TABS[currentUser.role] || ROLE_ALLOWED_TABS.ADMIN;
  const filteredSections: MenuSection[] = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => allowedTabs.includes(item.id)),
    }))
    .filter((section) => section.items.length > 0);

  // Helper to render navigation items with unified solid blue styling
  const renderNavSection = (section: MenuSection, sIdx: number, expanded: boolean) => (
    <div key={sIdx} className="space-y-1">
      {expanded ? (
        <div className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-wider font-mono text-slate-400 uppercase transition-opacity">
          {section.sectionTitle}
        </div>
      ) : (
        <div className="h-px bg-slate-100 my-2 mx-2" />
      )}

      {section.items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <div key={item.id} className="relative group">
            <button
              onClick={() => onTabChange(item.id)}
              className={`relative flex items-center transition-all duration-150 cursor-pointer rounded-2xl select-none ${
                expanded
                  ? 'w-full px-3 py-2.5 gap-3'
                  : 'w-12 h-12 mx-auto justify-center'
              } ${
                isActive
                  ? 'bg-blue-600 text-white font-medium shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90'
              }`}
              title={!expanded ? item.label : undefined}
            >
              {/* Icon container */}
              <div
                className={`flex items-center justify-center shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'
                }`}
              >
                {item.icon}
              </div>

              {/* Text label when expanded */}
              {expanded && (
                <span className="text-xs font-semibold truncate flex-1 text-left">
                  {item.label}
                </span>
              )}

              {/* Badge */}
              {item.badge !== undefined && (
                expanded ? (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-bold font-mono shadow-xs ring-2 ring-white">
                    {item.badge}
                  </span>
                )
              )}

              {/* Active indicator bar for collapsed mode */}
              {!expanded && isActive && (
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 rounded-r-full" />
              )}
            </button>

            {/* Floating Tooltip in compact icon-only mode */}
            {!expanded && (
              <div className="hidden lg:group-hover:flex items-center absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
                <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-lg whitespace-nowrap flex items-center gap-2 border border-slate-800 animate-in fade-in zoom-in-95 duration-100">
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-bold font-mono">
                      {item.badge}
                    </span>
                  )}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Floating Pill Sidebar: Smoothly toggles between Compact Icon-Only and Expanded */}
      <aside
        className={`hidden lg:flex flex-col my-3 ml-3 h-[calc(100vh-1.5rem)] rounded-[32px] bg-white border border-slate-200/90 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.08)] z-30 transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shrink-0 select-none ${
          isExpanded ? 'w-[272px]' : 'w-[80px]'
        }`}
      >
        {/* Header with App Logo & Expand/Collapse Toggle Button */}
        <div className="h-18 px-3.5 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-11 h-11 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 flex items-center justify-center p-1.5 shadow-2xs transition-all cursor-pointer shrink-0"
              title={isExpanded ? 'Ciutkan Navigasi' : 'Perluas Navigasi'}
              aria-label="Toggle Navigation"
            >
              <img src="/logo.png" alt="Gatrans Logo" className="w-8 h-8 rounded-full object-contain" />
            </button>

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="min-w-0 flex-1"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 tracking-tight text-sm truncate">
                    Gatrans
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold truncate leading-tight">
                  Management Operations System
                </p>
              </motion.div>
            )}
          </div>

          {/* Toggle Expand/Collapse Button */}
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              title="Ciutkan ke mode ringkas"
              aria-label="Collapse Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Role Wewenang Badge */}
        {isExpanded && (
          <div className="mx-3 mt-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between shrink-0">
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block truncate">Peran Aktif</span>
              <span className="text-xs font-bold text-slate-800 truncate block">{currentUser.roleLabel}</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
              {allowedTabs.length} Modul
            </span>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 px-2.5 py-3 space-y-3 overflow-y-auto overflow-x-hidden scrollbar-none">
          {filteredSections.map((section, sIdx) => renderNavSection(section, sIdx, isExpanded))}
        </nav>

        {/* Footer Area: Shift Status Card or Compact Shift Pill - Solid Navy Slate, No Tacky Gradient */}
        <div className="p-2.5 border-t border-slate-100 shrink-0">
          {isExpanded ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="p-3 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Shift 1 Aktif</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">06:00 - 14:00</span>
              </div>
              <div>
                <div className="text-xs font-bold truncate">Terminal Kargo 2 CGK</div>
                <div className="text-[10px] text-slate-400">Kepatuhan SLA: 98.2%</div>
              </div>
              <button
                onClick={onOpenShiftModal}
                className="w-full mt-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 active:scale-98 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1 text-slate-200 hover:text-white"
              >
                <span>Logbook Shift</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={onOpenShiftModal}
                className="w-12 h-12 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer relative group shadow-xs border border-slate-800"
                title="Shift 1 Aktif · Terminal Kargo 2 CGK"
              >
                <CalendarClock className="w-5 h-5 text-emerald-400" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
                
                {/* Floating tooltip */}
                <div className="hidden lg:group-hover:flex items-center absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-lg whitespace-nowrap border border-slate-800">
                    <div>Shift 1 Aktif (06:00 - 14:00)</div>
                    <div className="text-[10px] text-slate-400">Klik untuk Logbook Shift</div>
                  </div>
                </div>
              </button>

              {/* Expand Toggle Button when collapsed */}
              <button
                onClick={() => setIsExpanded(true)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
                title="Perluas Navigasi"
                aria-label="Expand Navigation"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Slide-Over with Motion */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative w-72 max-w-[85vw] h-full bg-white shadow-xl border-r border-slate-200/80 z-10 flex flex-col"
            >
              {/* Mobile Header */}
              <div className="h-18 px-5 flex items-center justify-between border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center p-1 shadow-2xs shrink-0">
                    <img src="/logo.png" alt="Gatrans Logo" className="w-7 h-7 rounded-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-extrabold text-slate-900 tracking-tight text-base block truncate">
                      Gatrans
                    </span>
                    <p className="text-[10px] text-slate-500 font-semibold truncate max-w-[150px]">
                      Management Operations System
                    </p>
                  </div>
                </div>

                <button
                  onClick={onCloseMobile}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Tutup navigasi"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Role Wewenang Badge Mobile */}
              <div className="mx-4 mt-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between shrink-0">
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block truncate">Peran Aktif</span>
                  <span className="text-xs font-bold text-slate-800 truncate block">{currentUser.roleLabel}</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                  {allowedTabs.length} Modul
                </span>
              </div>

              {/* Mobile Nav list */}
              <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
                {filteredSections.map((section, sIdx) => renderNavSection(section, sIdx, true))}
              </nav>

              {/* Mobile Footer */}
              <div className="p-3 border-t border-slate-100 shrink-0">
                <div className="p-3 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Shift 1 Aktif</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">06:00 - 14:00</span>
                  </div>
                  <button
                    onClick={() => {
                      if (onCloseMobile) onCloseMobile();
                      onOpenShiftModal();
                    }}
                    className="w-full mt-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 active:scale-98 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1 text-slate-200"
                  >
                    <span>Logbook Shift</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
