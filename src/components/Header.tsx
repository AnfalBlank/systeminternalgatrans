import React, { useState } from 'react';
import {
  Search,
  Bell,
  Scan,
  UserCheck,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  X,
  Menu,
  Download,
  Printer,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types/cargo';
import { Language, translations } from '../i18n/translations';

interface HeaderProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSwitchUser: (user: UserProfile) => void;
  onOpenScanner: () => void;
  onOpenDocumentPrint?: () => void;
  onOpenChat?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  unreadAlertsCount: number;
  currentLang: Language;
  onToggleLang: (lang: Language) => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenScanner,
  onOpenDocumentPrint,
  onOpenChat,
  searchQuery,
  onSearchChange,
  unreadAlertsCount,
  currentLang,
  onToggleLang,
  onOpenMobileMenu,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const t = translations[currentLang];

  const sampleNotifications = [
    {
      id: 'AL-1',
      title: currentLang === 'id' ? 'Tindakan Diperlukan: X-Ray Threat Hold' : 'X-Ray Threat Hold Required Action',
      detail:
        currentLang === 'id'
          ? 'AWB 157-77291044 (Koli #04) ditahan karena anomali massa organik padat. Tim ETD sekunder telah diberangkatkan.'
          : 'AWB 157-77291044 (Unit #04) flagged for dense organic mass. Secondary ETD dispatched.',
      time: currentLang === 'id' ? '12m lalu' : '12m ago',
      type: 'critical',
    },
    {
      id: 'AL-2',
      title: currentLang === 'id' ? 'Batas Waktu Penerbangan GA-872 Mendekat' : 'Flight GA-872 Cutoff Approaching',
      detail:
        currentLang === 'id'
          ? 'Peringatan SLA: 45 menit menuju batas waktu cutoff terminal. DO-2026-GA-0419 telah terbit.'
          : 'SLA warning: 45 minutes until terminal dispatch cutoff. DO-2026-GA-0419 issued.',
      time: currentLang === 'id' ? '28m lalu' : '28m ago',
      type: 'warning',
    },
    {
      id: 'AL-3',
      title: currentLang === 'id' ? 'Bukti Serah Terima (PoH) Terverifikasi' : 'Proof of Handover Verified',
      detail:
        currentLang === 'id'
          ? 'Seluruh 4 koli AWB 205-88391204 telah diserahkan ke Gudang ANA dengan segel digital.'
          : 'All 4 pieces of AWB 205-88391204 delivered to ANA Warehouse with digital seal.',
      time: currentLang === 'id' ? '52m lalu' : '52m ago',
      type: 'info',
    },
  ];

  return (
    <header className="h-16 lg:h-18 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/80 flex items-center justify-between gap-3 sticky top-0 z-30 select-none">
      {/* Mobile Drawer Hamburger & App Identifier */}
      <div className="flex items-center gap-2.5">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 -ml-1 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="lg:hidden flex items-center gap-2">
          <img src="/logo.png" alt="Gatrans Logo" className="w-7 h-7 rounded-full object-contain" />
          <span className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight truncate max-w-[170px]">Gatrans MOS</span>
        </div>
      </div>

      {/* Desktop Search bar */}
      <div className="hidden sm:flex flex-1 max-w-md lg:max-w-lg relative">
        <div className="relative w-full flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-12 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <kbd className="hidden lg:inline-flex absolute right-3 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-2xs pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className="sm:hidden p-2 rounded-xl border border-slate-200/80 text-slate-600 hover:bg-slate-50 transition-colors"
          aria-label="Cari konsinyasi"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Language Switcher Toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => onToggleLang('id')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentLang === 'id' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Ganti ke Bahasa Indonesia"
          >
            <span>🇮🇩</span>
            <span className="hidden sm:inline">ID</span>
          </button>
          <button
            onClick={() => onToggleLang('en')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentLang === 'en' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Switch to English"
          >
            <span>🇬🇧</span>
            <span className="hidden sm:inline">EN</span>
          </button>
        </div>

        {/* Quick Barcode Scanner button */}
        <button
          onClick={onOpenScanner}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-sm"
          title="Simulate Handheld Barcode / QR Scanner Input"
        >
          <Scan className="w-4 h-4" />
          <span className="hidden md:inline">{t.scannerSimBtn}</span>
        </button>

        {/* Global Print / Export Document Button */}
        {onOpenDocumentPrint && (
          <button
            onClick={onOpenDocumentPrint}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs"
            title="Cetak & Ekspor Dokumen Resmi Penerbangan (A4 PDF)"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span className="hidden lg:inline">Cetak Dokumen (PDF)</span>
          </button>
        )}

        {/* Operational Chat Button */}
        {onOpenChat && (
          <button
            onClick={onOpenChat}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200/80 hover:bg-blue-50/70 hover:border-blue-200 flex items-center justify-center text-slate-600 hover:text-blue-700 transition-colors relative cursor-pointer"
            title={currentLang === 'id' ? 'Chat & Koordinasi Tim Operasional' : 'Team Operational Chat'}
            aria-label="Chat tim kargo"
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
              2
            </span>
          </button>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowAlertsMenu(!showAlertsMenu);
              setShowRoleMenu(false);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors relative cursor-pointer"
            aria-label="Pemberitahuan keamanan"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown with Motion */}
          <AnimatePresence>
            {showAlertsMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-lg border border-slate-200/90 p-4 z-50"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900">{t.securityAlerts}</span>
                    <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-200 font-mono">
                      {unreadAlertsCount} {t.activeAlerts}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAlertsMenu(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto">
                  {sampleNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-xl border text-xs ${
                        notif.type === 'critical'
                          ? 'bg-rose-50/70 border-rose-200/80 text-rose-900'
                          : notif.type === 'warning'
                          ? 'bg-amber-50/70 border-amber-200/80 text-amber-900'
                          : 'bg-slate-50 border-slate-200/80 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <div className="flex items-center gap-1.5">
                          {notif.type === 'critical' && (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          )}
                          {notif.type === 'warning' && (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          )}
                          {notif.type === 'info' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                          <span className="truncate max-w-[200px]">{notif.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{notif.detail}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RBAC Role & User Profile Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowAlertsMenu(false);
            }}
            className="flex items-center gap-2 sm:gap-2.5 p-1 sm:pl-2 sm:pr-3 sm:py-1.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${currentUser.avatarColor}`}
            >
              {currentUser.initials}
            </div>
            <div className="text-left hidden md:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900">{currentUser.name}</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-600">
                  {currentUser.badgeId}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">{currentUser.roleLabel}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Role selector dropdown with Motion */}
          <AnimatePresence>
            {showRoleMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-lg border border-slate-200/90 p-2 z-50"
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{t.switchRoleTitle}</p>
                  <p className="text-[11px] text-slate-500">{t.switchRoleSub}</p>
                </div>
                <div className="py-1 max-h-64 overflow-y-auto">
                  {allUsers.map((user) => {
                    const isCurrent = user.id === currentUser.id;
                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSwitchUser(user);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          isCurrent ? 'bg-blue-50 text-blue-800 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0 ${user.avatarColor}`}
                          >
                            {user.initials}
                          </div>
                          <div className="truncate">
                            <div className="font-semibold text-slate-900 truncate">{user.name}</div>
                            <div className="text-[10px] text-slate-500 truncate">{user.roleLabel}</div>
                          </div>
                        </div>
                        {isCurrent && <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Search Dropdown Bar */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sm:hidden absolute top-16 left-0 right-0 p-3 bg-white border-b border-slate-200 shadow-lg z-20"
          >
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                autoFocus
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="absolute right-2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
