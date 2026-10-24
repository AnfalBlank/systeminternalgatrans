import React, { useState } from 'react';
import { ExceptionCase, UserProfile } from '../../types/cargo';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  User,
  CheckCircle2,
  Plus,
  Filter,
  Search,
  ArrowRight,
  History,
  FileWarning,
  Printer,
  FileX,
  PackageX,
} from 'lucide-react';
import { Language } from '../../i18n/translations';
import { motion } from 'motion/react';
import { DocumentType } from '../DocumentPrintModal';

interface ExceptionsViewProps {
  exceptions: ExceptionCase[];
  currentUser: UserProfile;
  currentLang: Language;
  onResolveException: (exceptionId: string, notes: string) => void;
  onCreateException: (newCase: Partial<ExceptionCase>) => void;
  onOpenPrintModal?: (type: DocumentType, c?: any) => void;
}

export const ExceptionsView: React.FC<ExceptionsViewProps> = ({
  exceptions,
  currentUser,
  currentLang,
  onResolveException,
  onCreateException,
  onOpenPrintModal,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(exceptions[0]?.id || null);
  const [resolveNotes, setResolveNotes] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New ticket state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<any>('XRAY_THREAT_HOLD');
  const [newPriority, setNewPriority] = useState<any>('HIGH');
  const [newAwb, setNewAwb] = useState('');
  const [newReason, setNewReason] = useState('');

  const filtered = exceptions.filter((e) => {
    const matchPriority = priorityFilter === 'ALL' || e.priority === priorityFilter;
    const matchStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchPriority && matchStatus;
  });

  const selectedCase = exceptions.find((e) => e.id === selectedCaseId);

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">HIGH</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">{p}</span>;
    }
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
              {currentLang === 'id' ? 'Buku Eksepsi & Manajemen Insiden Operasional' : 'Exception & Incident Ledger Desk'}
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono">
              Manajemen Kasus & Tiket Eksepsi
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentLang === 'id'
              ? 'Seluruh penahanan X-Ray, anomali koli, kerusakan, dan insiden kargo wajib memiliki nomor tiket, PIC, tenggat SLA, dan kronologi.'
              : 'Every X-ray hold, piece discrepancy, damage, and incident must carry a case ID, PIC, SLA deadline, and audit trail.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenPrintModal && (
            <button
              onClick={() => onOpenPrintModal('SURAT_REJECT_DG')}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
              title="Cetak Berita Acara & Surat Reject DG Resmi"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Cetak Surat Reject DG (A4 PDF)</span>
            </button>
          )}

          <button
            onClick={() => setIsCreateOpen(!isCreateOpen)}
            className="flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{currentLang === 'id' ? 'Buat Tiket Insiden' : 'Log Incident Case'}</span>
          </button>
        </div>
      </div>

      {/* Ticket Creation Drawer/Form if Open */}
      {isCreateOpen && (
        <div className="p-5 bg-white rounded-2xl border border-rose-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileWarning className="w-4 h-4 text-rose-600" />
              <span>Registrasi Tiket Kasus Eksepsi Baru</span>
            </h2>
            <button onClick={() => setIsCreateOpen(false)} className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer">
              Tutup ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Judul Insiden:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Contoh: Koli Rusak / Massa Organik X-Ray..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nomor AWB / Konsinyasi:</label>
              <input
                type="text"
                value={newAwb}
                onChange={(e) => setNewAwb(e.target.value)}
                placeholder="Contoh: 126-99014412"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Prioritas & SLA:</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              >
                <option value="CRITICAL">CRITICAL (Target 30 Menit)</option>
                <option value="HIGH">HIGH (Target 60 Menit)</option>
                <option value="MEDIUM">MEDIUM (Target 120 Menit)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">Kronologi Awal / Alasan Eksepsi:</label>
            <textarea
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              placeholder="Jelaskan temuan fisik atau sistem yang memicu pembuatan tiket ini..."
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <button
            onClick={() => {
              if (!newTitle.trim()) return;
              onCreateException({
                title: newTitle,
                category: newCategory,
                priority: newPriority,
                awbNumber: newAwb || 'AWB-MANUAL',
                chronology: [
                  {
                    timestamp: new Date().toLocaleTimeString(),
                    actor: currentUser.name,
                    action: 'Kasus Dibuat',
                    note: newReason || 'Tiket insiden operasional dibuka',
                  },
                ],
              });
              setNewTitle('');
              setNewAwb('');
              setNewReason('');
              setIsCreateOpen(false);
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Simpan Tiket Eksepsi
          </button>
        </div>
      )}

      {/* Main Grid: List on Left, Case Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exceptions List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900">Daftar Tiket ({filtered.length})</span>
            <div className="flex items-center gap-1">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-[10px] bg-slate-50 border border-slate-200 rounded-md p-1 font-semibold"
              >
                <option value="ALL">Semua Prioritas</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="mt-3 space-y-2.5 max-h-[580px] overflow-y-auto">
            {filtered.map((exc) => {
              const isSelected = selectedCaseId === exc.id;
              const isClosed = exc.status === 'RESOLVED' || exc.status === 'CLOSED';

              return (
                <div
                  key={exc.id}
                  onClick={() => setSelectedCaseId(exc.id)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/40 shadow-xs ring-1 ring-rose-500/20'
                      : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-slate-900">{exc.caseNo}</span>
                    {getPriorityBadge(exc.priority)}
                  </div>

                  <p className="font-semibold text-slate-900 text-xs truncate">{exc.title}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">AWB: {exc.awbNumber}</p>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{exc.dueAt}</span>
                    </span>
                    <span
                      className={`font-semibold px-1.5 py-0.2 rounded ${
                        isClosed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {exc.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Case Detail and Resolution Desk */}
        <div className="lg:col-span-2">
          {selectedCase ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-slate-900">{selectedCase.caseNo}</span>
                    {getPriorityBadge(selectedCase.priority)}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {selectedCase.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mt-1">{selectedCase.title}</h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400">Tenggat SLA:</span>
                  <p className="text-xs font-mono font-bold text-rose-600">{selectedCase.dueAt}</p>
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">AWB Terkait</span>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">{selectedCase.awbNumber}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">PIC Ditugaskan</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedCase.assignedTo}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Waktu Dibuat</span>
                  <p className="font-mono font-semibold text-slate-700 mt-0.5">{selectedCase.createdAt}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Status Tiket</span>
                  <p className="font-bold text-blue-600 mt-0.5">{selectedCase.status}</p>
                </div>
              </div>

              {/* Chronology Timeline (PRD Requirement) */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-slate-500" />
                  <span>Kronologi & Jejak Tindakan Investigasi:</span>
                </h4>

                <div className="space-y-2 border-l-2 border-slate-200 pl-3 ml-2">
                  {selectedCase.chronology.map((c, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{c.action}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {c.timestamp} · {c.actor}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{c.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Form if Open */}
              {selectedCase.status !== 'RESOLVED' && selectedCase.status !== 'CLOSED' ? (
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <label className="text-xs font-bold text-slate-900 block">
                    Formulir Penyelesaian Eksepsi (Resolusi Kasus):
                  </label>
                  <textarea
                    value={resolveNotes}
                    onChange={(e) => setResolveNotes(e.target.value)}
                    placeholder="Masukkan hasil investigasi sekunder, verifikasi dokumen, atau otorisasi pelepasan barang..."
                    rows={2}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                  <button
                    onClick={() => {
                      onResolveException(
                        selectedCase.id,
                        resolveNotes || 'Investigasi selesai. Koli diizinkan lanjut ke tahapan berikutnya.'
                      );
                      setResolveNotes('');
                    }}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tandai Selesai & Tutup Kasus (Resolve)</span>
                  </button>
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Kasus Telah Diselesaikan:</span> {selectedCase.resolutionNotes}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <ShieldAlert className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">Pilih kasus eksepsi dari daftar.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
