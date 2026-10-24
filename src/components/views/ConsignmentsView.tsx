import React, { useState, useMemo } from 'react';
import { Consignment, ConsignmentStatus } from '../../types/cargo';
import {
  Search,
  Filter,
  Plus,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  ScanLine,
  ShieldCheck,
  FileText,
  Clock,
  Printer,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Language, translations } from '../../i18n/translations';
import { motion } from 'motion/react';
import { DocumentType } from '../DocumentPrintModal';

interface ConsignmentsViewProps {
  consignments: Consignment[];
  currentLang: Language;
  onSelectConsignment: (c: Consignment) => void;
  onOpenPieceModal: (c: Consignment) => void;
  onOpenXRayModal: (c: Consignment) => void;
  onOpenScanner: () => void;
  onOpenPrintModal?: (type: DocumentType, c?: Consignment) => void;
}

export const ConsignmentsView: React.FC<ConsignmentsViewProps> = ({
  consignments,
  currentLang,
  onSelectConsignment,
  onOpenPieceModal,
  onOpenXRayModal,
  onOpenScanner,
  onOpenPrintModal,
}) => {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [airlineFilter, setAirlineFilter] = useState<string>('ALL');

  // Filtered list
  const filtered = useMemo(() => {
    return consignments.filter((c) => {
      const matchSearch =
        !searchTerm.trim() ||
        c.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.flightNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.shipper.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.consignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.pieces.some((p) => p.barcode.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const matchAirline = airlineFilter === 'ALL' || c.airline === airlineFilter;

      return matchSearch && matchStatus && matchAirline;
    });
  }, [consignments, searchTerm, statusFilter, airlineFilter]);

  const uniqueAirlines = useMemo(() => {
    return Array.from(new Set(consignments.map((c) => c.airline)));
  }, [consignments]);

  const getStatusBadge = (status: ConsignmentStatus) => {
    switch (status) {
      case 'RECEIVED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">Diterima (Intake)</span>;
      case 'AWAITING_XRAY':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Antrean X-Ray</span>;
      case 'XRAY_HOLD':
      case 'XRAY_REVIEW_REQUIRED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">X-Ray Hold / Triage</span>;
      case 'XRAY_REJECTED':
      case 'AVSEC_REJECTED_OR_HELD':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Ditolak / Investigasi</span>;
      case 'AWAITING_AVSEC':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">Menunggu AVSEC</span>;
      case 'AVSEC_APPROVED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">AVSEC Approved</span>;
      case 'DO_ISSUED':
      case 'AWAITING_WAREHOUSE_HANDOVER':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">DO Terbit (Menuju Gudang)</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Selesai (PoH Valid)</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
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
      {/* Top Header & Intake Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {currentLang === 'id' ? 'Registri Konsinyasi & Penerimaan Kargo' : 'Cargo Consignment & Intake Registry'}
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {consignments.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentLang === 'id'
              ? 'Verifikasi data CSD, rekonsiliasi per koli fisik, dan status alur keamanan.'
              : 'CSD data verification, piece-level physical reconciliation, and security workflow.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{currentLang === 'id' ? 'Scan Kargo Baru' : 'Intake New Cargo'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              currentLang === 'id'
                ? 'Cari no. AWB, no. penerbangan, pengirim, atau barcode koli...'
                : 'Search AWB, flight no, shipper, or piece barcode...'
            }
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Select */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">{currentLang === 'id' ? 'Semua Status' : 'All Status'}</option>
              <option value="RECEIVED">RECEIVED</option>
              <option value="AWAITING_XRAY">AWAITING_XRAY</option>
              <option value="XRAY_HOLD">XRAY_HOLD</option>
              <option value="AWAITING_AVSEC">AWAITING_AVSEC</option>
              <option value="AVSEC_APPROVED">AVSEC_APPROVED</option>
              <option value="DO_ISSUED">DO_ISSUED</option>
              <option value="DELIVERED">DELIVERED</option>
            </select>
          </div>

          {/* Airline Select */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
            <select
              value={airlineFilter}
              onChange={(e) => setAirlineFilter(e.target.value)}
              className="bg-transparent font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">{currentLang === 'id' ? 'Semua Maskapai' : 'All Airlines'}</option>
              {uniqueAirlines.map((air) => (
                <option key={air} value={air}>
                  {air}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Consignment Table / Card List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4 sm:px-6">AWB & Penerbangan</th>
                <th className="py-3 px-4">Pengirim / Penerima</th>
                <th className="py-3 px-4">Koli & Rekonsiliasi Fisik</th>
                <th className="py-3 px-4">Berat & Komoditas</th>
                <th className="py-3 px-4">Status & Keamanan</th>
                <th className="py-3 px-4 sm:px-6 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filtered.map((c) => {
                const isReconciled = c.totalReceivedPieces === c.totalDeclaredPieces;
                const xrayedCount = c.pieces.filter((p) => p.xrayResult !== undefined).length;

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                    onClick={() => {
                      onSelectConsignment(c);
                      onOpenPieceModal(c);
                    }}
                  >
                    {/* AWB & Flight */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                          {c.awbNumber}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {c.csdVerified ? 'CSD ✓' : 'Manual'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-slate-700">{c.airline}</span>
                        <span>·</span>
                        <span className="font-mono">{c.flightNo}</span>
                        <span>→</span>
                        <span className="font-bold text-blue-700">{c.destination}</span>
                      </div>
                    </td>

                    {/* Shipper & Consignee */}
                    <td className="py-3.5 px-4 max-w-[180px]">
                      <div className="font-medium text-slate-900 truncate" title={c.shipper}>
                        {c.shipper}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5" title={c.consignee}>
                        To: {c.consignee}
                      </div>
                    </td>

                    {/* Pieces Reconciliation (PRD CR-04) */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">
                          {c.totalReceivedPieces} / {c.totalDeclaredPieces} koli
                        </span>
                        {isReconciled ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" title="Cocok (Match)" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" title="Selisih (Discrepancy)" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {xrayedCount} / {c.totalReceivedPieces} telah X-Ray
                      </div>
                    </td>

                    {/* Weight & Commodity */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-slate-800">{c.totalWeightKg} kg</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[140px] mt-0.5">
                        {c.natureOfGoods}
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4">{getStatusBadge(c.status)}</td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            onSelectConsignment(c);
                            onOpenPieceModal(c);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer transition-colors"
                          title="Lihat Koli & Cetak Barcode"
                        >
                          <Boxes className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            onSelectConsignment(c);
                            onOpenXRayModal(c);
                          }}
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium cursor-pointer transition-colors"
                          title="Pemeriksaan X-Ray"
                        >
                          <ScanLine className="w-3.5 h-3.5" />
                        </button>
                        {onOpenPrintModal && (
                          <button
                            onClick={() => {
                              onSelectConsignment(c);
                              onOpenPrintModal('DELIVERY_ORDER', c);
                            }}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium cursor-pointer transition-colors"
                            title="Cetak Dokumen Resmi (DO / CSD / Invoice)"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Boxes className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-600">Tidak ada konsinyasi yang cocok.</p>
                    <p className="text-xs text-slate-400 mt-0.5">Coba ubah filter atau kata kunci pencarian Anda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
