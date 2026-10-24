import React, { useState } from 'react';
import { ShiftHandover, UserProfile, ShiftRosterStaff } from '../../types/cargo';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Building2,
  Check,
  Printer,
  Eye,
  EyeOff,
  Phone,
  Shield,
  FileText,
  XCircle,
  Plus,
} from 'lucide-react';
import { Language } from '../../i18n/translations';
import { motion } from 'motion/react';
import { DocumentType } from '../DocumentPrintModal';

interface ShiftViewProps {
  shiftData: ShiftHandover;
  currentUser: UserProfile;
  currentLang: Language;
  onAcknowledgeShift: (supervisorName: string) => void;
  onRejectShift?: (reason: string) => void;
  onOpenShiftModal: () => void;
  onOpenPrintModal?: (type: DocumentType, c?: any) => void;
}

export const ShiftView: React.FC<ShiftViewProps> = ({
  shiftData,
  currentUser,
  currentLang,
  onAcknowledgeShift,
  onRejectShift,
  onOpenShiftModal,
  onOpenPrintModal,
}) => {
  const [supervisorInput, setSupervisorInput] = useState(currentUser.name);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const openItems = shiftData.openItems || [];
  const summary = shiftData.summary || {
    totalAccepted: 0,
    totalXrayed: 0,
    totalAvsecCleared: 0,
    totalDoIssued: 0,
    totalDelivered: 0,
    openExceptionsCount: 0,
    pendingXrayCount: 0,
    pendingAvsecCount: 0,
    undeliveredDoCount: 0,
  };

  const rosterList = shiftData.roster || [
    {
      id: 'RST-01',
      name: 'Capt. Hendra Wijaya, S.T.',
      roleCategory: 'MANAGER_SHIFT' as const,
      jobTitle: 'Manager Shift Kargo (Outgoing)',
      whatsappNumber: '+62 811-9872-001',
      assignment: 'Komando Operasional & Otorisasi Lini 1',
      isActive: true,
    },
    {
      id: 'RST-02',
      name: 'Budi Santoso',
      roleCategory: 'SUPERVISOR_SHIFT' as const,
      jobTitle: 'Supervisor Shift 01 (Admin Compliance)',
      whatsappNumber: '+62 812-3456-7890',
      assignment: 'Penerbitan DO, Billing & Rekonsiliasi BTB',
      isActive: true,
    },
    {
      id: 'RST-03',
      name: 'Rahmat Hidayat',
      roleCategory: 'SUPERVISOR_SHIFT' as const,
      jobTitle: 'Supervisor Shift 02 (Lead Checker)',
      whatsappNumber: '+62 813-8890-1234',
      assignment: 'Pengawasan Screening X-Ray & Penimbangan',
      isActive: true,
    },
    {
      id: 'RST-04',
      name: 'Aris Setiawan',
      roleCategory: 'DG_OFFICER' as const,
      jobTitle: 'Petugas Dangerous Goods (DG Certified)',
      whatsappNumber: '+62 815-7762-3341',
      assignment: 'Triage IATA DGR, Surat Reject DG & Hazmat',
      isActive: true,
    },
    {
      id: 'RST-05',
      name: 'Mayor Bambang Suryo',
      roleCategory: 'SENIOR_AVSEC' as const,
      jobTitle: 'Senior AVSEC (External Authority)',
      whatsappNumber: '+62 818-4421-9988',
      assignment: 'Pengesahan Kelayakan Terbang & Stamp AVSEC',
      isActive: true,
    },
  ];

  const handlePrintDocument = () => {
    if (onOpenPrintModal) {
      onOpenPrintModal('SHIFT_HANDOVER');
    } else {
      window.print();
    }
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    if (onRejectShift) {
      onRejectShift(rejectReason);
    }
    setShowRejectBox(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Pergantian Shift & Roster Resmi v1.7
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono">
              Protokol Resmi Pergantian Regu
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rekonsiliasi antar-regu, serah terima kasus terbuka, susunan roster resmi 5 kategori, dan tanda tangan digital manager incoming.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePrintDocument}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-98 cursor-pointer flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span>Cetak Berita Acara Shift (A4 PDF)</span>
          </button>

          <button
            onClick={onOpenShiftModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-98 cursor-pointer flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <span>Form Pengesahan Manager</span>
          </button>
        </div>
      </div>

      {/* Shift Overview Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                {shiftData.shiftCode || 'SHIFT-1 (06:00 - 14:00)'} · Sedang Berjalan
              </span>
              <span className="text-xs font-mono text-slate-300 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                {shiftData.date || '2026-10-24'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {shiftData.station || 'Terminal Cargo Security Command CGK'}
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Manager Shift Penyerah (Outgoing): <strong className="text-white">{shiftData.outgoingManager || shiftData.outgoingSupervisor}</strong>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/80 border border-slate-700 p-4 rounded-2xl">
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase">Status Acknowledgment:</span>
              <p className={`text-sm font-bold ${
                shiftData.status === 'ACKNOWLEDGED'
                  ? 'text-emerald-400'
                  : shiftData.status === 'REJECTED'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}>
                {shiftData.status === 'ACKNOWLEDGED'
                  ? 'TELAH DISAHKAN & DITERIMA ✓'
                  : shiftData.status === 'REJECTED'
                  ? 'DITOLAK OLEH MANAGER INCOMING'
                  : 'MENUNGGU PENGESAHAN INCOMING'}
              </p>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                Manager Penerima: {shiftData.incomingManager || shiftData.incomingSupervisor}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Roster Personel 5 Kategori (PRD v1.6/v1.7 §4.11 & AC-084, AC-085) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">
                Susunan Roster Personel Shift Resmi (5 Kategori Wajib)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              1 Manager Shift, 2 Supervisor Shift, 1-2 Petugas DG, dan Senior AVSEC (External Authority).
            </p>
          </div>

          <button
            onClick={() => setShowWhatsApp(!showWhatsApp)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            title="Kebijakan Privasi Data Pribadi"
          >
            {showWhatsApp ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
            <span>{showWhatsApp ? 'Sembunyikan Kontak' : 'Tampilkan Kontak WhatsApp'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3 w-10 text-center">No</th>
                <th className="py-2.5 px-3">Nama Lengkap</th>
                <th className="py-2.5 px-3">Kategori Roster</th>
                <th className="py-2.5 px-3">Penugasan Operasional</th>
                <th className="py-2.5 px-3">Kontak WhatsApp (Izin Khusus)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rosterList.map((staff, idx) => (
                <tr key={staff.id || idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {staff.name}
                    {staff.roleCategory === 'SENIOR_AVSEC' && (
                      <span className="ml-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        NON-LOGIN AUTH
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      staff.roleCategory === 'MANAGER_SHIFT'
                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                        : staff.roleCategory === 'SUPERVISOR_SHIFT'
                        ? 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                        : staff.roleCategory === 'DG_OFFICER'
                        ? 'bg-purple-100 text-purple-900 border border-purple-200'
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}>
                      {staff.roleCategory}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{staff.assignment}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {showWhatsApp ? (
                      <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {staff.whatsappNumber}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">●●●●-●●●●-●●●● (Terproteksi)</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      AKTIF / ON-DUTY
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tally Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Total Koli Diterima</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{summary.totalAccepted} Koli</p>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Tercatat</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Koli Selesai X-Ray</span>
          <p className="text-xl font-bold text-blue-600 mt-1">{summary.totalXrayed} Koli</p>
          <span className="text-[10px] text-slate-400 font-mono">Dual-View Tunnel</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Menunggu AVSEC</span>
          <p className="text-xl font-bold text-amber-600 mt-1">{summary.pendingAvsecCount} Koli</p>
          <span className="text-[10px] text-amber-600 font-semibold">Perlu Investigasi</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Kasus Eksepsi Terbuka</span>
          <p className="text-xl font-bold text-rose-600 mt-1">{summary.openExceptionsCount} Kasus</p>
          <span className="text-[10px] text-rose-600 font-semibold">Dipindahkan ke Shift 2</span>
        </div>
      </div>

      {/* Handover Briefing Notes */}
      {shiftData.handoverNotes && (
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Catatan Operasional Penyerah (Outgoing Briefing):
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
            {shiftData.handoverNotes}
          </p>
        </div>
      )}

      {/* Critical Issues Transfer List (AC-088) */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
          <span>Daftar Kasus Kritis Yang Diestafetkan ke Shift Berikutnya:</span>
          <span className="text-[10px] font-mono text-slate-400">Aturan: Case Tetap Terbuka</span>
        </h3>

        {openItems.length > 0 ? (
          <div className="space-y-2">
            {openItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{item.refId}</span>
                      <span className="text-[10px] bg-white border border-amber-200 text-amber-800 font-mono px-1.5 py-0.5 rounded">
                        {item.refType}
                      </span>
                    </div>
                    <p className="text-slate-700 text-xs mt-1">{item.detail}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 self-start sm:self-auto shrink-0">
                  {item.actionRequired}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
            Tidak ada item tertahan yang tertinggal. Seluruh kargo shift ini telah terselesaikan.
          </div>
        )}
      </div>

      {/* Incoming Manager Sign-Off Section (AC-086, AC-089) */}
      {shiftData.status !== 'ACKNOWLEDGED' && (
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                Otorisasi & Pengesahan Serah Terima oleh Manager Incoming
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Manager Shift incoming dapat mengesahkan (Acknowledge) atau menolak laporan dengan alasan tertulis resmi.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowRejectBox(!showRejectBox)}
                className="px-3.5 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Tolak Laporan</span>
              </button>
              <button
                onClick={() => onAcknowledgeShift(supervisorInput)}
                className="py-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs active:scale-98 transition-all cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sahkan & Terima Handover (Acknowledge)</span>
              </button>
            </div>
          </div>

          {showRejectBox && (
            <form onSubmit={handleReject} className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
              <label className="text-xs font-bold text-rose-900 block">
                Alasan Penolakan Laporan Handover (Wajib Diisi):
              </label>
              <textarea
                required
                rows={3}
                placeholder="Tuliskan alasan penolakan (misal: selisih koli belum direkonsiliasi atau dokumen CSD belum lengkap)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-rose-300 text-xs bg-white focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectBox(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg"
                >
                  Kirim Penolakan Laporan
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </motion.div>
  );
};
