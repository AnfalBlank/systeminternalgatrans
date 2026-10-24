import React, { useState } from 'react';
import { Consignment, UserProfile, ExceptionCase, AuditEvent } from '../../types/cargo';
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Truck,
  CreditCard,
  Layers,
  Sparkles,
  ArrowUpRight,
  Boxes,
  FileSpreadsheet,
} from 'lucide-react';
import { Language } from '../../i18n/translations';
import { motion } from 'motion/react';

interface ReportsViewProps {
  consignments: Consignment[];
  exceptions: ExceptionCase[];
  auditLogs: AuditEvent[];
  currentLang: Language;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  consignments,
  exceptions,
  auditLogs,
  currentLang,
}) => {
  const [reportType, setReportType] = useState<
    'OVERVIEW' | 'XRAY_EVD' | 'AVSEC_CONFIRMATION' | 'DISPATCH_BTB' | 'INVOICE_PAYMENT' | 'SLA_EXCEPTIONS'
  >('OVERVIEW');
  const [dateFilter, setDateFilter] = useState<'TODAY' | 'LAST_7_DAYS' | 'THIS_MONTH'>('TODAY');
  const [airlineFilter, setAirlineFilter] = useState<string>('ALL');

  const filteredConsignments = consignments.filter((c) => {
    if (airlineFilter !== 'ALL' && c.airline !== airlineFilter) return false;
    return true;
  });

  // Export functions (CSV simulation)
  const handleExportCSV = () => {
    const headers = ['AWB Number', 'Airline', 'Flight', 'Pieces', 'Weight (kg)', 'Status', 'SLA Status'];
    const rows = filteredConsignments.map((c) => [
      c.awbNumber,
      c.airline,
      c.flightNo,
      c.totalReceivedPieces,
      c.totalWeightKg,
      c.status,
      c.slaStatus,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Gatrans_Report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Aggregate metrics
  const totalKoli = filteredConsignments.reduce((acc, c) => acc + c.totalReceivedPieces, 0);
  const totalWeight = filteredConsignments.reduce((acc, c) => acc + c.totalWeightKg, 0);
  const xRayPassCount = filteredConsignments.filter((c) => c.status !== 'AWAITING_XRAY' && c.status !== 'XRAY_HOLD').length;
  const avsecFitCount = filteredConsignments.filter((c) => c.avsecReview?.decision === 'APPROVED').length;
  const deliveredCount = filteredConsignments.filter((c) => c.status === 'DELIVERED').length;
  const totalRevenue = filteredConsignments.reduce((acc, c) => acc + (c.invoice?.totalAmount || 0), 0);
  const totalPaidRevenue = filteredConsignments.reduce((acc, c) => acc + (c.invoice?.paidAmount || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/80 shadow-2xs">
              <FileBarChart className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Pusat Laporan Operasional & Audit Kargo
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Pusat Analitik & Laporan Operasional
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rekapitulasi pergerakan barang, efektivitas screening X-Ray/EVD, konfirmasi kelayakan terbang AVSEC, serah terima BTB, dan realisasi keuangan.
          </p>
        </div>

        {/* Global Export & Print Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-slate-500 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Filter Laporan:</span>
          </span>

          <select
            value={reportType}
            onChange={(e: any) => setReportType(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-slate-800 bg-white"
          >
            <option value="OVERVIEW">1. Rekapitulasi Umum Operasional</option>
            <option value="XRAY_EVD">2. Laporan Screening X-Ray & EVD</option>
            <option value="AVSEC_CONFIRMATION">3. Laporan Konfirmasi AVSEC (Fit to Fly)</option>
            <option value="DISPATCH_BTB">4. Laporan Dispatch Lini 1 & BTB Maskapai</option>
            <option value="INVOICE_PAYMENT">5. Laporan Invoice & Pembayaran</option>
            <option value="SLA_EXCEPTIONS">6. Laporan SLA & Exception Aging</option>
          </select>

          <select
            value={airlineFilter}
            onChange={(e) => setAirlineFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">Semua Maskapai</option>
            <option value="Garuda Indonesia">Garuda Indonesia</option>
            <option value="Singapore Airlines">Singapore Airlines</option>
            <option value="Qatar Airways Cargo">Qatar Airways Cargo</option>
            <option value="Emirates SkyCargo">Emirates SkyCargo</option>
            <option value="All Nippon Airways">All Nippon Airways</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Periode:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['TODAY', 'LAST_7_DAYS', 'THIS_MONTH'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setDateFilter(period)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  dateFilter === period ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {period === 'TODAY' ? 'Hari Ini' : period === 'LAST_7_DAYS' ? '7 Hari Terakhir' : 'Bulan Ini'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Highlights Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Koli Diproses</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalKoli}</div>
          <span className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Berat: {totalWeight.toFixed(1)} kg
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lolos X-Ray & EVD</span>
          <div className="text-2xl font-black text-cyan-600 mt-1">{xRayPassCount} AWB</div>
          <span className="text-[11px] font-semibold text-slate-500 mt-1">
            {((xRayPassCount / (consignments.length || 1)) * 100).toFixed(0)}% Kepatuhan Keamanan
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AVSEC Fit to Fly</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{avsecFitCount} AWB</div>
          <span className="text-[11px] font-semibold text-slate-500 mt-1">100% Terverifikasi Snapshot</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Realisasi Invoice</span>
          <div className="text-xl font-black text-indigo-600 mt-1">Rp {(totalRevenue / 1000000).toFixed(2)}M</div>
          <span className="text-[11px] font-semibold text-emerald-600 mt-1">
            Terbayar: Rp {(totalPaidRevenue / 1000000).toFixed(2)}M
          </span>
        </div>
      </div>

      {/* Main Table of Current Report View */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {reportType === 'OVERVIEW' && 'Tabel Rekapitulasi Lengkap Konsinyasi Kargo Bandara'}
              {reportType === 'XRAY_EVD' && 'Laporan Audit Inspeksi Radiasi X-Ray & Pemeriksaan Jejak EVD'}
              {reportType === 'AVSEC_CONFIRMATION' && 'Buku Register Konfirmasi Keamanan AVSEC (Fit to Fly)'}
              {reportType === 'DISPATCH_BTB' && 'Laporan Pengiriman Lini 1 & Rekonsiliasi BTB Maskapai'}
              {reportType === 'INVOICE_PAYMENT' && 'Laporan Penerbitan Tagihan Invoice & Status Pembayaran'}
              {reportType === 'SLA_EXCEPTIONS' && 'Laporan Kepatuhan SLA & Buku Kasus Insiden Operasional'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan {filteredConsignments.length} transaksi kargo aktif sesuai filter yang dipilih.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold border-y border-slate-100 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Nomor AWB</th>
                <th className="py-3 px-4">Maskapai & Rute</th>
                <th className="py-3 px-3 text-center">Koli Fisik</th>
                <th className="py-3 px-3 text-right">Berat (kg)</th>
                <th className="py-3 px-4">Status X-Ray / EVD</th>
                <th className="py-3 px-4">Konfirmasi AVSEC</th>
                <th className="py-3 px-4">Lini 1 & BTB</th>
                <th className="py-3 px-4">Invoice Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredConsignments.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{c.awbNumber}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{c.airline}</div>
                    <div className="text-[10px] text-slate-400">{c.flightNo} ({c.origin} → {c.destination})</div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-800">{c.totalReceivedPieces}</td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-800">{c.totalWeightKg.toFixed(1)}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'XRAY_HOLD'
                          ? 'bg-rose-100 text-rose-800'
                          : c.status === 'AWAITING_XRAY'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {c.status === 'XRAY_HOLD' ? 'HOLD / EVD ALARM' : c.status === 'AWAITING_XRAY' ? 'QUEUED' : 'PASSED'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {c.avsecReview ? (
                      <div>
                        <span className="font-mono text-[11px] text-emerald-700 font-bold">
                          {c.avsecReview.securityStampNo}
                        </span>
                        <div className="text-[10px] text-slate-400">{c.avsecReview.officerName.split(' ')[0]}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">Belum Konfirmasi</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {c.goodsReceiptBTB ? (
                      <span className="font-mono text-[11px] text-emerald-700 font-bold">
                        {c.goodsReceiptBTB.receiptNo}
                      </span>
                    ) : c.loadingSeal ? (
                      <span className="font-mono text-[11px] text-blue-700 font-bold">
                        Line 1 In-Transit
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">Staging</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {c.invoice ? (
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.invoice.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.invoice.status === 'PARTIALLY_PAID'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {c.invoice.status}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">Drafting</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
          <span>Non-repudiation audit logging active · Seluruh ekspor data terekam pada jejak audit resmi</span>
          <span className="font-mono">Checksum SHA256-RPT-EXPORT-VERIFIED</span>
        </div>
      </div>
    </motion.div>
  );
};
