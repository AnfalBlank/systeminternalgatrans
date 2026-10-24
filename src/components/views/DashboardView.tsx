import React from 'react';
import { Consignment, UserProfile } from '../../types/cargo';
import { MetricCards } from '../MetricCards';
import { BentoGrid } from '../BentoGrid';
import { KanbanBoard } from '../KanbanBoard';
import {
  Calendar,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  Zap,
  CheckCircle2,
  ScanEye,
  FileSignature,
  Scale,
  Truck,
  ReceiptText,
  CreditCard,
  FileBarChart,
  ClipboardCheck,
  CalendarClock,
  Clock,
  ChevronRight,
  PackageCheck,
  ShieldCheck,
  Crown,
  DollarSign,
  TrendingUp,
  SlidersHorizontal,
  FileCheck2,
} from 'lucide-react';
import { Language, translations } from '../../i18n/translations';
import { motion } from 'motion/react';

interface DashboardViewProps {
  consignments: Consignment[];
  teamMembers: UserProfile[];
  currentUser: UserProfile;
  totalPieces: number;
  xrayedPieces: number;
  pendingAvsecPieces: number;
  doIssuedCount: number;
  deliveredCount: number;
  openExceptionsCount: number;
  currentLang: Language;
  onSelectConsignment: (c: Consignment) => void;
  onOpenXRayModal: (c: Consignment) => void;
  onOpenPieceModal: (c: Consignment) => void;
  onOpenDOModal: (c: Consignment) => void;
  onOpenExceptionModal: (c: Consignment) => void;
  onOpenScanner: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  consignments,
  teamMembers,
  currentUser,
  totalPieces,
  xrayedPieces,
  pendingAvsecPieces,
  doIssuedCount,
  deliveredCount,
  openExceptionsCount,
  currentLang,
  onSelectConsignment,
  onOpenXRayModal,
  onOpenPieceModal,
  onOpenDOModal,
  onOpenExceptionModal,
  onOpenScanner,
  onNavigateToTab,
}) => {
  const t = translations[currentLang];

  // Critical operational warnings per PRD
  const warningConsignments = consignments.filter((c) => c.slaStatus === 'WARNING');
  const criticalHoldCount = consignments.filter(
    (c) => c.status === 'XRAY_HOLD' || c.status === 'AVSEC_REJECTED_OR_HELD'
  ).length;

  // Role-specific priority task computations
  const readyToDepartCount = consignments.filter((c) => c.status === 'LOADING_SEALED').length;
  const inTransitCount = consignments.filter((c) => c.status === 'IN_TRANSIT_LINE1').length;
  const awaitingHandoverCount = consignments.filter(
    (c) => c.status === 'AWAITING_WAREHOUSE_HANDOVER' || c.status === 'DO_ISSUED'
  ).length;

  const needWeighingCount = consignments.filter((c) => !c.weighingRecord).length;
  const readyToLoadCount = consignments.filter(
    (c) => c.status === 'DO_ISSUED' || c.status === 'FIT_TO_FLY_CONFIRMED' || c.status === 'AVSEC_APPROVED'
  ).length;

  const awaitingXrayCount = consignments.filter((c) => c.status === 'AWAITING_XRAY').length;
  const awaitingAvsecCount = consignments.filter(
    (c) => c.status === 'AWAITING_AVSEC' || c.status === 'XRAY_HOLD'
  ).length;
  const docChecklistCount = consignments.filter(
    (c) => c.status === 'RECEIVED' || c.status === 'PIECE_RECONCILIATION'
  ).length;

  const readyForDOCount = consignments.filter(
    (c) => c.status === 'AVSEC_APPROVED' || c.status === 'FIT_TO_FLY_CONFIRMED'
  ).length;
  const pendingInvoiceCount = consignments.filter((c) => c.deliveryOrder && !c.invoice).length || 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 sm:space-y-7"
    >
      {/* Welcome Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {t.greetingMorning}, {currentUser.name.split(' ')[0]}! 👋
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
              {currentUser.roleLabel}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{t.greetingSubtitle}</p>
        </div>

        {/* Date range picker pill & Quick Action */}
        <div className="flex flex-wrap items-center gap-2">
          {(currentUser.role === 'MANAGERIAL' || currentUser.role === 'SUPERADMIN' || currentUser.role === 'ADMIN') && (
            <button
              onClick={() => onNavigateToTab('executive')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-slate-900 to-blue-900 hover:from-slate-800 hover:to-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Dashboard Eksekutif</span>
            </button>
          )}

          <div className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs text-xs font-semibold text-slate-700">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{t.todayFilter}</span>
          </div>

          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Scan Masuk</span>
          </button>
        </div>
      </div>

      {/* Role-Specific Priority Task Queue Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              {currentUser.role === 'SUPERADMIN' && <SlidersHorizontal className="w-5 h-5 text-purple-600" />}
              {currentUser.role === 'MANAGERIAL' && <Crown className="w-5 h-5 text-amber-600" />}
              {currentUser.role === 'ADMIN_CSD' && <FileCheck2 className="w-5 h-5 text-cyan-600" />}
              {currentUser.role === 'DRIVER' && <Truck className="w-5 h-5" />}
              {currentUser.role === 'HANDLER' && <Scale className="w-5 h-5" />}
              {currentUser.role === 'CHECKER' && <ScanEye className="w-5 h-5" />}
              {currentUser.role === 'ADMIN' && <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  {currentUser.role === 'SUPERADMIN' && (currentLang === 'id' ? 'Superadmin: Konfigurasi Sistem, Otoritas Penuh & Jejak Audit' : 'Superadmin Control: Full Authority, Policies & Audit Trail')}
                  {currentUser.role === 'MANAGERIAL' && (currentLang === 'id' ? 'Kokpit Eksekutif Manajerial & Owner: Pengawasan Omzet & Kinerja' : 'Executive Cockpit: Revenue, Throughput & Performance')}
                  {currentUser.role === 'ADMIN_CSD' && (currentLang === 'id' ? 'Antrean Admin CSD: Penimbangan Kargo, Deklarasi CSD & STK' : 'Admin CSD Queue: Scale Records, CSD & STK Issuance')}
                  {currentUser.role === 'DRIVER' && (currentLang === 'id' ? 'Antrean Tugas Driver: Rute Lini 1 & Serah Terima' : 'Driver Priority Queue: Line 1 & Ramp Handover')}
                  {currentUser.role === 'HANDLER' && (currentLang === 'id' ? 'Antrean Tugas Handler: Timbangan Digital & Loading Segel' : 'Handler Priority Queue: Scales, CSD & Loading')}
                  {currentUser.role === 'CHECKER' && (currentLang === 'id' ? 'Antrean Tugas Checker: Dokumen, Screening X-Ray & AVSEC' : 'Checker Priority Queue: Inspection, X-Ray & AVSEC')}
                  {currentUser.role === 'ADMIN' && (currentLang === 'id' ? 'Pengawasan Operasional: Otorisasi DO, Tagihan & Kepatuhan' : 'Operations Overview: DO, Invoicing & Compliance')}
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser.role === 'SUPERADMIN' && (currentLang === 'id' ? 'Akses penuh ke seluruh 16 modul operasional, audit trail kriptografi, konfigurasi SLA, dan kebijakan keamanan.' : 'Full administrative access across all modules, cryptographic audit logs, SLA rules, and system RBAC.')}
                {currentUser.role === 'MANAGERIAL' && (currentLang === 'id' ? 'Pantau total omzet Rp 482.7M, tonase bulanan 48.6 Ton, indeks kepatuhan SLA 99.85%, dan jadwal umur piutang.' : 'Executive overview of revenue, cargo tonnage, SLA compliance index, and aging receivables.')}
                {currentUser.role === 'ADMIN_CSD' && (currentLang === 'id' ? 'Verifikasi tiket timbang kalibrasi metrologi, penerbitan deklarasi keamanan ICAO CSD, dan pencetakan STK.' : 'Metrology weight verification, ICAO CSD declaration issuance, and STK print operations.')}
                {currentUser.role === 'DRIVER' && (currentLang === 'id' ? 'Verifikasi segel pra-keberangkatan, pantau armada truk, dan catat tanda tangan BTB maskapai.' : 'Verify seals, track transit route, and complete airline BTB / PoH sign-off.')}
                {currentUser.role === 'HANDLER' && (currentLang === 'id' ? 'Akurasi berat koli per AWB, penerbitan CSD/STK resmi, dan penguncian segel fisik truk.' : 'Record tare/net weights, generate CSD/STK, and secure truck seals.')}
                {currentUser.role === 'CHECKER' && (currentLang === 'id' ? 'Pemeriksaan kepatuhan keamanan ICAO Annex 17, pemindaian dual-view, dan stempel AVSEC.' : 'Enforce aviation security standards, analyze dual-view scans, and record AVSEC approvals.')}
                {currentUser.role === 'ADMIN' && (currentLang === 'id' ? 'Pengawasan SLA terpadu, konversi draft DO, pencatatan invoice dasar, dan audit logbook.' : 'Oversee end-to-end SLA, issue Delivery Orders, track invoicing, and audit shift tallies.')}
              </p>
            </div>
          </div>
        </div>

        {/* Priority Task Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* DRIVER ROLE CARDS */}
          {currentUser.role === 'DRIVER' && (
            <>
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Truk Siap Berangkat</span>
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{readyToDepartCount} Kargo</div>
                  <p className="text-[11px] text-slate-500 mt-1">Segel terpasang, siap inspeksi fisik & keberangkatan.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('dispatch')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Mulai Rute Lini 1</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Dalam Perjalanan</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{inTransitCount} Armada</div>
                  <p className="text-[11px] text-slate-500 mt-1">Sedang transit menuju gudang cargo maskapai.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('dispatch')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Pantau Dispatch</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Serah Terima Gudang</span>
                    <ReceiptText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{awaitingHandoverCount} Kargo</div>
                  <p className="text-[11px] text-slate-500 mt-1">Perlu tanda tangan BTB & Proof of Handover (PoH).</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('handover')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Proses Serah Terima</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Logbook Shift Driver</span>
                    <CalendarClock className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-lg font-bold text-slate-900">Shift 1 Aktif</div>
                  <p className="text-[11px] text-slate-500 mt-1">Catat status armada & estafet koli sebelum off-duty.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('shift')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Logbook Shift</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {/* HANDLER ROLE CARDS */}
          {currentUser.role === 'HANDLER' && (
            <>
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Antrean Penimbangan</span>
                    <Scale className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{needWeighingCount} Kargo</div>
                  <p className="text-[11px] text-slate-500 mt-1">Timbang digital per koli & terbitkan CSD / STK.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('weighing')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Timbangan Digital</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Kargo Siap Muat</span>
                    <Truck className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{readyToLoadCount} Kargo</div>
                  <p className="text-[11px] text-slate-500 mt-1">Muat koli ke kontainer truk di Staging Bay.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('dispatch')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Proses Loading Truk</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Segel Terpasang</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{readyToDepartCount} Armada</div>
                  <p className="text-[11px] text-slate-500 mt-1">Kunci pintu armada & catat nomor segel fisik.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('dispatch')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Cek Status Segel</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Total Koli Fisik</span>
                    <PackageCheck className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{totalPieces} Koli</div>
                  <p className="text-[11px] text-slate-500 mt-1">Verifikasi jumlah piece fisik di area staging.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('consignments')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Daftar Koli Fisik</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {/* CHECKER ROLE CARDS */}
          {currentUser.role === 'CHECKER' && (
            <>
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Screening X-Ray</span>
                    <ScanEye className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{awaitingXrayCount} Koli</div>
                  <p className="text-[11px] text-slate-500 mt-1">Dual-view Z-eff density & deteksi ancaman.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('xray')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Stasiun X-Ray</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Konfirmasi AVSEC</span>
                    <FileSignature className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{awaitingAvsecCount} Kargo</div>
                  <p className="text-[11px] text-slate-500 mt-1">Catat stempel resmi AVSEC & deklarasi layak terbang.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('avsec')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Catat Stempel AVSEC</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Checklist & Uji EVD</span>
                    <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{docChecklistCount} Dokumen</div>
                  <p className="text-[11px] text-slate-500 mt-1">Pemeriksaan fisik koli & uji swab partikel ETD.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('checklist')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Checklist Dokumen</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Kasus Eksepsi & Reject</span>
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{openExceptionsCount} Kasus</div>
                  <p className="text-[11px] text-slate-500 mt-1">Penerbitan surat reject atau minta data tambahan.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('exceptions')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Kelola Eksepsi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {/* ADMIN ROLE CARDS */}
          {currentUser.role === 'ADMIN' && (
            <>
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Otorisasi DO Terbit</span>
                    <ReceiptText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{readyForDOCount} Kargo</div>
                  <p className="text-[11px] text-slate-500 mt-1">AVSEC cleared, siap diterbitkan DO resmi.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('handover')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Penerbitan DO</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Invoice & Pembayaran</span>
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{pendingInvoiceCount} Tagihan</div>
                  <p className="text-[11px] text-slate-500 mt-1">Pembuatan invoice dasar & pencatatan pelunasan.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('invoicing')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Kelola Billing</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Tiket Eksepsi Terbuka</span>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{openExceptionsCount} Kasus</div>
                  <p className="text-[11px] text-slate-500 mt-1">Disposisi & resolusi penahanan barang.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('exceptions')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Tinjau Kasus</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Pusat Laporan & Ekspor</span>
                    <FileBarChart className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-lg font-bold text-slate-900">Rekap CSD & Log</div>
                  <p className="text-[11px] text-slate-500 mt-1">Ekspor laporan bulanan, SLA & jejak audit.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('reports')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Laporan</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {/* MANAGERIAL ROLE CARDS */}
          {currentUser.role === 'MANAGERIAL' && (
            <>
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-blue-900 mb-1">
                    <span>Cockpit Eksekutif</span>
                    <Crown className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900">Rp 482.7M</div>
                  <p className="text-[11px] text-slate-600 mt-1">Realisasi omzet kargo bulanan (+14.2% MoM).</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('executive')}
                  className="mt-3 text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Dashboard Eksekutif</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Jadwal Umur Piutang</span>
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900">96.2% Lancar</div>
                  <p className="text-[11px] text-slate-500 mt-1">Nol piutang macet (&gt;30 hari), Rp 344M term aktif.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('invoicing')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Lihat Billing Kasir & Kredit</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Tonase & Throughput</span>
                    <Scale className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900">48.6 Ton</div>
                  <p className="text-[11px] text-slate-500 mt-1">1.840 Koli diproses, utilisasi armada 89.4%.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('reports')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Laporan Throughput</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Integritas & Audit Shift</span>
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-lg font-bold text-slate-900">99.85% SLA</div>
                  <p className="text-[11px] text-slate-500 mt-1">Roster 5 kategori shift & zero security incident.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('shift')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Logbook Shift</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {/* SUPERADMIN ROLE CARDS */}
          {currentUser.role === 'SUPERADMIN' && (
            <>
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-purple-900 mb-1">
                    <span>Otoritas Superadmin</span>
                    <SlidersHorizontal className="w-4 h-4 text-purple-700" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">16 Modul Aktif</div>
                  <p className="text-[11px] text-slate-600 mt-1">Akses penuh RBAC, audit log kriptografi & SOP SLA.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('settings')}
                  className="mt-3 text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>Konfigurasi Kebijakan</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Cockpit Eksekutif</span>
                    <Crown className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900">Rp 482.7M</div>
                  <p className="text-[11px] text-slate-500 mt-1">Analisis finansial, yield per kg & market share.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('executive')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Eksekutif</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Jejak Audit SHA-256</span>
                    <ShieldAlert className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900">Immutable</div>
                  <p className="text-[11px] text-slate-500 mt-1">10 Kriteria kritis terpantau real-time 100%.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('audit')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Audit Trail</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Pusat Laporan & Ekspor</span>
                    <FileBarChart className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-lg font-bold text-slate-900">PDF & Data Dump</div>
                  <p className="text-[11px] text-slate-500 mt-1">Ekspor seluruh berkas dokumen penerbangan.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('reports')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Laporan</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {/* ADMIN_CSD ROLE CARDS */}
          {currentUser.role === 'ADMIN_CSD' && (
            <>
              <div className="p-4 rounded-xl border border-cyan-200 bg-cyan-50/60 hover:bg-cyan-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-cyan-900 mb-1">
                    <span>Timbangan Digital</span>
                    <Scale className="w-4 h-4 text-cyan-700" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{needWeighingCount} Kargo</div>
                  <p className="text-[11px] text-slate-600 mt-1">Pencatatan gross/tare weight & kalibrasi metrologi.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('weighing')}
                  className="mt-3 text-xs font-bold text-cyan-700 hover:text-cyan-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>Stasiun Timbang</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Penerbitan CSD & STK</span>
                    <FileCheck2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900">{readyForDOCount} Berkas</div>
                  <p className="text-[11px] text-slate-500 mt-1">Deklarasi keamanan ICAO Annex 17 & tiket STK.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('weighing')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Terbitkan CSD</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Checklist Manifes Koli</span>
                    <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{docChecklistCount} Manifes</div>
                  <p className="text-[11px] text-slate-500 mt-1">Pencocokan SMU/PTI & verifikasi koli fisik.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('checklist')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Checklist</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Rekonsiliasi Billing</span>
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-lg font-bold text-slate-900">Kasir & Kredit</div>
                  <p className="text-[11px] text-slate-500 mt-1">Validasi timbangan kargo dengan invoice resmi.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('invoicing')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Cek Billing</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* SLA Alert Banner if Warnings or Critical Holds Exist */}
      {(warningConsignments.length > 0 || criticalHoldCount > 0) && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950">
                {currentLang === 'id'
                  ? 'Perhatian Operasional: Kargo Mendekati Batas SLA & Penahanan'
                  : 'Operational Notice: Cargo Approaching SLA Cutoff & Holds'}
              </p>
              <p className="text-[11px] text-amber-800/90 mt-0.5">
                {warningConsignments.length} {currentLang === 'id' ? 'konsinyasi mendekati batas cutoff' : 'consignments near cutoff'}, {criticalHoldCount} {currentLang === 'id' ? 'penahanan aktif memerlukan tindakan.' : 'active holds require triage.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => onNavigateToTab('exceptions')}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{currentLang === 'id' ? 'Tinjau Eksepsi' : 'Review Exceptions'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 4 Core Metric Cards */}
      <MetricCards
        totalConsignments={consignments.length}
        totalPieces={totalPieces}
        xrayedPieces={xrayedPieces}
        pendingAvsecPieces={pendingAvsecPieces}
        doIssuedCount={doIssuedCount}
        deliveredCount={deliveredCount}
        currentLang={currentLang}
      />

      {/* Bento Grid (Stage progress, Donut, Flights, Duty Personnel, Stacked Bar Chart) */}
      <BentoGrid
        consignments={consignments}
        teamMembers={teamMembers}
        onSelectConsignment={onSelectConsignment}
        onFilterByStatus={() => onNavigateToTab('kanban')}
        onOpenXRayModal={onOpenXRayModal}
        currentLang={currentLang}
      />

      {/* Bottom Kanban Board Section */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{currentLang === 'id' ? 'Papan Disposisi Alur Operasional' : 'Operational Workflow Board'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Live Monitor
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">
              {currentLang === 'id'
                ? 'Klik kargo untuk melakukan inspeksi, review AVSEC, atau penerbitan DO'
                : 'Click any cargo card to inspect pieces, validate AVSEC, or issue DO'}
            </p>
          </div>

          <button
            onClick={() => onNavigateToTab('kanban')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{currentLang === 'id' ? 'Buka Papan Penuh' : 'View Full Board'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <KanbanBoard
          consignments={consignments}
          currentUser={currentUser}
          onSelectConsignment={onSelectConsignment}
          onOpenXRayModal={onOpenXRayModal}
          onOpenPieceModal={onOpenPieceModal}
          onOpenDOModal={onOpenDOModal}
          onOpenExceptionModal={onOpenExceptionModal}
          onOpenScanner={onOpenScanner}
          currentLang={currentLang}
        />
      </div>
    </motion.div>
  );
};
