import React, { useState } from 'react';
import { AuditEvent } from '../../types/cargo';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  Download,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import { Language } from '../../i18n/translations';
import { motion } from 'motion/react';

interface AuditViewProps {
  auditLogs: AuditEvent[];
  currentLang: Language;
}

export const AuditView: React.FC<AuditViewProps> = ({ auditLogs, currentLang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchSearch =
      !searchTerm.trim() ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.correlationId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchSearch && matchAction;
  });

  const criticalControls = [
    { id: 'SEC-01', name: 'Validasi AVSEC Wajib', status: 'ENFORCED', desc: 'DO terkunci tanpa AVSEC stamp snapshot v1.0+' },
    { id: 'SEC-02', name: 'Integritas Barcode/Data', status: 'ENFORCED', desc: 'Barcode konflik langsung diarahkan ke exception ledger' },
    { id: 'SEC-03', name: 'Integritas Hasil X-Ray', status: 'ENFORCED', desc: 'Hold/Reject tidak dapat di-bypass menjadi Pass' },
    { id: 'SEC-04', name: 'Rekonsiliasi Piece Fisik', status: 'ENFORCED', desc: 'Pencocokan identitas barcode koli individual' },
    { id: 'SEC-05', name: 'Draft DO vs DO Terbit', status: 'ENFORCED', desc: 'Draft tidak berlaku sebagai dokumen izin jalan' },
    { id: 'SEC-06', name: 'Exception Terlindungi', status: 'ENFORCED', desc: 'Tiket insiden tidak dapat dihapus diam-diam' },
    { id: 'SEC-07', name: 'Bukti Serah Terima PoH', status: 'ENFORCED', desc: 'Delivered hanya setelah verifikasi serah terima fisik' },
    { id: 'SEC-08', name: 'Hak Akses & Otorisasi RBAC', status: 'ENFORCED', desc: 'Pemisahan wewenang ketat antar peran bandara' },
    { id: 'SEC-09', name: 'Audit Trail Terlindungi', status: 'ENFORCED', desc: 'Jejak log append-only tidak dapat diedit pengguna' },
    { id: 'SEC-10', name: 'Idempotensi Scan', status: 'ENFORCED', desc: 'Double scan tidak membuat transaksi kargo ganda' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {currentLang === 'id' ? 'Jejak Audit Keamanan (Immutable Audit Trail)' : 'Immutable Security Audit Trail'}
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white font-mono">
              Append-Only Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentLang === 'id'
              ? 'Seluruh tindakan keamanan, pemindaian, verifikasi segel, dan penerbitan DO dicatat secara permanen untuk audit kepatuhan ICAO.'
              : 'All security events, barcode scans, customs seal validations, and DO issuances recorded for regulatory compliance.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kriptografi SHA-256 Integritas Aktif</span>
          </span>
        </div>
      </div>

      {/* Critical Controls Compliance Grid */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
          <span>Matriks Kepatuhan Kriteria Kritis (Critical Aviation Controls):</span>
          <span className="text-[10px] font-mono text-emerald-600 font-bold">10 / 10 Controls Enforced</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {criticalControls.map((cr) => (
            <div key={cr.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-blue-700">{cr.id}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                  {cr.status}
                </span>
              </div>
              <p className="font-bold text-slate-900 text-[11px] truncate">{cr.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{cr.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari aktor, ID transaksi, tindakan..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium"
            >
              <option value="ALL">Semua Tindakan</option>
              <option value="RECORD_XRAY_RESULT">RECORD_XRAY_RESULT</option>
              <option value="AVSEC_DECISION">AVSEC_DECISION</option>
              <option value="ISSUE_DELIVERY_ORDER">ISSUE_DELIVERY_ORDER</option>
              <option value="CONFIRM_HANDOVER_POH">CONFIRM_HANDOVER_POH</option>
              <option value="BARCODE_SCAN_EVENT">BARCODE_SCAN_EVENT</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                <th className="py-2.5 px-3">Waktu</th>
                <th className="py-2.5 px-3">Aktor & Peran</th>
                <th className="py-2.5 px-3">Tindakan (Action)</th>
                <th className="py-2.5 px-3">Entitas</th>
                <th className="py-2.5 px-3">Deskripsi Log</th>
                <th className="py-2.5 px-3 text-right">Korelasi ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 font-mono">
                  <td className="py-2.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">{log.occurredAt}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap font-sans">
                    <span className="font-semibold text-slate-900">{log.actor}</span>
                    <span className="text-[10px] text-slate-400 ml-1">({log.role})</span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap font-semibold text-slate-800">{log.entityId}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-600 max-w-xs truncate" title={log.description}>
                    {log.description}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[11px] text-slate-400">{log.correlationId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
