import React, { useState } from 'react';
import { Consignment, UserProfile, ManualEVDInspection, RejectLetter, AdditionalDataRequest } from '../../types/cargo';
import {
  ClipboardCheck,
  Radio,
  FileX,
  FileQuestion,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  Printer,
  Sparkles,
  Zap,
  ArrowRight,
  Plus,
  RefreshCw,
  FileText,
  BadgeAlert,
  Sliders,
  Check,
  X,
} from 'lucide-react';
import { Language } from '../../i18n/translations';
import { motion, AnimatePresence } from 'motion/react';

import { DocumentType } from '../DocumentPrintModal';

interface ChecklistViewProps {
  consignments: Consignment[];
  currentUser: UserProfile;
  currentLang: Language;
  onUpdateChecklist: (consignmentId: string, passedItems: string[], notes: string) => void;
  onRecordEVD: (consignmentId: string, evdData: Partial<ManualEVDInspection>) => void;
  onIssueRejectLetter: (consignmentId: string, rejectData: Partial<RejectLetter>) => void;
  onRequestAdditionalData: (consignmentId: string, reqData: Partial<AdditionalDataRequest>) => void;
  onOpenPrintModal?: (type: DocumentType, c?: Consignment) => void;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  consignments,
  currentUser,
  currentLang,
  onUpdateChecklist,
  onRecordEVD,
  onIssueRejectLetter,
  onRequestAdditionalData,
  onOpenPrintModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'CHECKLIST' | 'EVD_INSPECTION' | 'REJECT_LETTER' | 'DATA_REQUEST' | 'FORM_CHECKER_UNLOADING'
  >('FORM_CHECKER_UNLOADING');
  const [selectedConsignmentId, setSelectedConsignmentId] = useState<string>(consignments[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedConsignment = consignments.find((c) => c.id === selectedConsignmentId) || consignments[0];

  // Checklist state
  const defaultChecklistItems = [
    { id: 'CI-1', code: 'DOC_AWB', label: 'Air Waybill (AWB) Fisik Valid & Barcode Jelas', category: 'DOCUMENT' },
    { id: 'CI-2', code: 'DOC_CSD', label: 'Cargo Security Declaration (CSD) Tersedia & Lengkap', category: 'DOCUMENT' },
    { id: 'CI-3', code: 'PKG_INTEGRITY', label: 'Integritas Kemasan Utuh (Bebas Sobek, Bocor, Rembes)', category: 'PHYSICAL_PACKAGE' },
    { id: 'CI-4', code: 'LABEL_COMPLIANCE', label: 'Label Identitas Piece & Barcode Koli Sesuai Manifest', category: 'PHYSICAL_PACKAGE' },
    { id: 'CI-5', code: 'DG_CHECK', label: 'Verifikasi Barang Berbahaya (Non-DG / DGR Label Sesuai SOP)', category: 'DANGEROUS_GOODS' },
  ];

  const [checkedItemIds, setCheckedItemIds] = useState<string[]>(['CI-1', 'CI-2', 'CI-3', 'CI-4', 'CI-5']);
  const [checklistNotes, setChecklistNotes] = useState('');

  // EVD State
  const [swabLocation, setSwabLocation] = useState<'Handles/Latches' | 'Cardboard Seam' | 'Ventilation Hole' | 'Internal Liner'>('Cardboard Seam');
  const [evdResult, setEvdResult] = useState<'CLEAR' | 'SUSPICIOUS_TRACE' | 'FAIL_ALARM'>('CLEAR');
  const [evdNotes, setEvdNotes] = useState('');
  const [isScanningEVD, setIsScanningEVD] = useState(false);

  // Reject Letter State
  const [rejectReasonCode, setRejectReasonCode] = useState('SEC_THREAT_ORGANIC_ALARM');
  const [rejectDetail, setRejectDetail] = useState('');

  // Additional Data Request State
  const [requestedFieldsInput, setRequestedFieldsInput] = useState('');
  const [requestedFromInput, setRequestedFromInput] = useState('Shipper / Regulated Agent');

  const toggleChecklistItem = (id: string) => {
    setCheckedItemIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSaveChecklist = () => {
    if (!selectedConsignment) return;
    onUpdateChecklist(selectedConsignment.id, checkedItemIds, checklistNotes);
  };

  const handleRunEVDSimulation = () => {
    setIsScanningEVD(true);
    setTimeout(() => {
      setIsScanningEVD(false);
      if (!selectedConsignment) return;
      onRecordEVD(selectedConsignment.id, {
        consignmentId: selectedConsignment.id,
        pieceId: selectedConsignment.pieces[0]?.id,
        pieceBarcode: selectedConsignment.pieces[0]?.barcode,
        inspectionType: 'EVD_TRACE_DETECTOR',
        deviceReference: 'Smiths IONSCAN 600 EVD (Explosives & Trace Detector)',
        swabLocation,
        result: evdResult,
        threatDetected: evdResult === 'CLEAR' ? 'None (Clean Baseline)' : 'Residu Partikulat Nitro-Aromatic / Narcotic Trace',
        notes: evdNotes || 'Pemeriksaan usap (swab) pada koli fisik sesuai SOP Pemeriksaan EVD.',
      });
    }, 1200);
  };

  const handleCreateRejectLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsignment) return;
    onIssueRejectLetter(selectedConsignment.id, {
      consignmentId: selectedConsignment.id,
      awbNumber: selectedConsignment.awbNumber,
      reasonCode: rejectReasonCode,
      reasonDetail: rejectDetail || 'Barang ditolak terbang berdasarkan hasil pemeriksaan keamanan radiasi/EVD yang tidak memenuhi standar kelayakan terbang.',
      evidenceRef: `XRAY-${selectedConsignment.id}-EVD-TRACE`,
      actionRequired: 'Kargo dikeluarkan dari lini steril bandara dan dikembalikan kepada pengirim atau diserahkan ke AVSEC Kepolisian.',
    });
    setRejectDetail('');
  };

  const handleCreateDataRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsignment || !requestedFieldsInput.trim()) return;
    const fields = requestedFieldsInput.split(',').map((s) => s.trim()).filter(Boolean);
    onRequestAdditionalData(selectedConsignment.id, {
      consignmentId: selectedConsignment.id,
      awbNumber: selectedConsignment.awbNumber,
      requestedFields: fields,
      requestedFrom: requestedFromInput,
      dueAt: 'Within 2 hours',
    });
    setRequestedFieldsInput('');
  };

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
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Checklist Fisik, Alat EVD & Surat Reject
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Pemeriksaan Awal & Alat EVD
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pemeriksaan dokumen & fisik oleh Checker, pengujian jejak partikel bahan terlarang (EVD), serta tata kelola penolakan kargo.
          </p>
        </div>

        {/* Consignment Selector Quick Bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">AWB Aktif:</span>
          <select
            value={selectedConsignmentId}
            onChange={(e) => setSelectedConsignmentId(e.target.value)}
            className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-blue-500"
          >
            {consignments.map((c) => (
              <option key={c.id} value={c.id}>
                {c.awbNumber} - {c.airline} ({c.totalReceivedPieces} Koli)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub-tab Navigation Buttons */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl w-fit border border-slate-200/70">
        <button
          onClick={() => setActiveSubTab('FORM_CHECKER_UNLOADING')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'FORM_CHECKER_UNLOADING'
              ? 'bg-white text-blue-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          <span>0. Unloading Gatrans & Form Checker</span>
        </button>

        <button
          onClick={() => setActiveSubTab('CHECKLIST')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'CHECKLIST'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ClipboardCheck className="w-4 h-4 text-emerald-600" />
          <span>1. Checklist Dokumen & Fisik</span>
        </button>

        <button
          onClick={() => setActiveSubTab('EVD_INSPECTION')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'EVD_INSPECTION'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Radio className="w-4 h-4 text-cyan-600" />
          <span>2. Pemeriksaan Lanjutan (Alat EVD)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('REJECT_LETTER')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'REJECT_LETTER'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileX className="w-4 h-4 text-rose-600" />
          <span>3. Surat Reject & DG Disposisi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('DATA_REQUEST')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'DATA_REQUEST'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileQuestion className="w-4 h-4 text-indigo-600" />
          <span>4. Permintaan Data Tambahan</span>
        </button>
      </div>

      {/* Sub-tab 1: Checklist Dokumen & Fisik */}
      {activeSubTab === 'CHECKLIST' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Daftar Periksa Fisik & Dokumen Kargo: {selectedConsignment?.awbNumber}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Checker memverifikasi integritas fisik, label kemasan, dan kelengkapan dokumen sesuai SOP.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Pemeriksa: {currentUser.name} ({currentUser.roleLabel})
              </span>
            </div>

            <div className="space-y-3">
              {defaultChecklistItems.map((item) => {
                const isPassed = checkedItemIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isPassed
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-900'
                        : 'bg-rose-50/50 border-rose-200 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-white transition-all ${
                          isPassed ? 'bg-emerald-600' : 'bg-slate-300'
                        }`}
                      >
                        {isPassed && <Check className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{item.label}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {isPassed ? 'Terpenuhi dan sesuai standar penerimaan kargo.' : 'Belum diverifikasi / ada ketidaksesuaian.'}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isPassed ? 'LULUS (PASS)' : 'DITAHAN'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Catatan Pemeriksaan Checker / Temuan Khusus:
              </label>
              <textarea
                value={checklistNotes}
                onChange={(e) => setChecklistNotes(e.target.value)}
                placeholder="Tuliskan catatan inspeksi visual, kondisi packaging koli, atau alasan penahanan bila ada..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Aturan Kelayakan: Checklist yang belum lengkap otomatis memblokir proses ke tahap X-Ray.</span>
              </div>
              <button
                onClick={handleSaveChecklist}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Hasil Checklist</span>
              </button>
            </div>
          </div>

          {/* Right Status Card */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Status Konsinyasi</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h4 className="text-xl font-bold">{selectedConsignment?.awbNumber}</h4>
              <p className="text-xs text-slate-400 mt-1">{selectedConsignment?.shipper}</p>

              <div className="my-5 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Koli:</span>
                  <span className="font-bold text-white">{selectedConsignment?.totalReceivedPieces} Pieces</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Berat Bruto:</span>
                  <span className="font-bold text-white">{selectedConsignment?.totalWeightKg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Komoditas:</span>
                  <span className="font-bold text-white">{selectedConsignment?.natureOfGoods}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Penanganan Khusus:</span>
                  <span className="font-bold text-amber-400">{selectedConsignment?.specialHandling || 'GENERAL'}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-400/20 text-xs text-blue-200">
                <strong>Kontrol Keamanan:</strong> Seluruh item checklist wajib disetujui oleh peran Checker sebelum barang dapat dinaikkan ke konveyor terowongan X-Ray.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Pemeriksaan Lanjutan & Alat EVD */}
      {activeSubTab === 'EVD_INSPECTION' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-cyan-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Alat Pendeteksi Barang Terlarang (EVD / Explosive & Narcotics Trace Detector)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Digunakan untuk koli dengan anomali radiasi X-Ray atau pemeriksaan acak mandatori.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                Smiths IONSCAN 600
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Titik Usap / Lokasi Swab Koli Fisik:
                </label>
                <select
                  value={swabLocation}
                  onChange={(e: any) => setSwabLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                >
                  <option value="Cardboard Seam">Celah Lipatan Kardus (Cardboard Seam)</option>
                  <option value="Handles/Latches">Gagang / Pegangan Kotak (Handles/Latches)</option>
                  <option value="Ventilation Hole">Lubang Ventilasi (Ventilation Hole)</option>
                  <option value="Internal Liner">Lapisan Dalam Pembungkus (Internal Liner)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hasil Respon Spektrometer EVD:
                </label>
                <select
                  value={evdResult}
                  onChange={(e: any) => setEvdResult(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                >
                  <option value="CLEAR">CLEAR (Tidak Ada Residu Terlarang)</option>
                  <option value="SUSPICIOUS_TRACE">SUSPICIOUS_TRACE (Residu Terdeteksi - Tahan Kargo)</option>
                  <option value="FAIL_ALARM">FAIL_ALARM (Alarm Peledak/Narkotika Positif - Block Total)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Catatan Alat Detektor & Petugas Checker:
              </label>
              <textarea
                value={evdNotes}
                onChange={(e) => setEvdNotes(e.target.value)}
                placeholder="Tuliskan pembacaan puncak ion mobility spectrometry, nomor kalibrasi strip swab, dan tindakan pengamanan..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Test Simulation Button */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold">Pemeriksaan Swab Sensorik</div>
                  <div className="text-[11px] text-slate-400">Jalankan kalibrasi desorber & analisis jejak partikel</div>
                </div>
              </div>

              <button
                disabled={isScanningEVD}
                onClick={handleRunEVDSimulation}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 shrink-0"
              >
                {isScanningEVD ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menganalisis Swab...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Catat Hasil Tes EVD</span>
                  </>
                )}
              </button>
            </div>

            {/* Riwayat EVD Inspections */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                Riwayat Pengujian EVD pada AWB Ini:
              </h4>
              {selectedConsignment?.evdInspections && selectedConsignment.evdInspections.length > 0 ? (
                <div className="space-y-2">
                  {selectedConsignment.evdInspections.map((evd) => (
                    <div
                      key={evd.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{evd.deviceReference}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200">
                            Lokasi: {evd.swabLocation}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{evd.notes}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            evd.result === 'CLEAR'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {evd.result}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">{evd.inspectedAt}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  Belum ada uji EVD tercatat untuk konsinyasi ini.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Standar Pemeriksaan Alat EVD</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                EVD didefinisikan sebagai <strong>alat pendeteksi barang terlarang</strong>. Pengujian dilakukan tanpa merusak koli dengan mengusap permukaan dan menganalisis mikrogram residu peledak atau zat narkotika.
              </p>
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Ketentuan SOP:</strong> Jika hasil EVD menunjukkan <em>SUSPICIOUS_TRACE</em> atau <em>FAIL_ALARM</em>, kargo otomatis ditahan dan Checker segera menerbitkan Surat Reject ke pihak Shipper.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Surat Reject Resmi */}
      {activeSubTab === 'REJECT_LETTER' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Penerbitan Surat Reject Resmi (Surat Penolakan Barang)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Diterbitkan ketika kargo ditolak terbang sesuai regulasi keamanan kargo & penerbangan. Dokumen memiliki nomor unik dan jejak audit.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                Template Resmi KM 211
              </span>
            </div>

            {selectedConsignment?.rejectLetter ? (
              <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileX className="w-5 h-5 text-rose-600" />
                    <span className="font-bold text-sm text-rose-950">
                      Surat Reject Aktif: {selectedConsignment.rejectLetter.rejectNo}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                    {selectedConsignment.rejectLetter.status}
                  </span>
                </div>
                <div className="text-xs text-rose-900 space-y-1">
                  <div><strong>Alasan Penolakan:</strong> {selectedConsignment.rejectLetter.reasonCode}</div>
                  <div><strong>Keterangan:</strong> {selectedConsignment.rejectLetter.reasonDetail}</div>
                  <div><strong>Diterbitkan Oleh:</strong> {selectedConsignment.rejectLetter.issuedBy} ({selectedConsignment.rejectLetter.issuedAt})</div>
                  <div><strong>Tindakan Wajib:</strong> {selectedConsignment.rejectLetter.actionRequired}</div>
                </div>
                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => {
                      if (onOpenPrintModal && selectedConsignment) {
                        onOpenPrintModal('SURAT_REJECT_DG', selectedConsignment);
                      } else {
                        window.print();
                      }
                    }}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-slate-300" />
                    <span>Cetak Surat Reject (A4 PDF)</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateRejectLetter} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kode Alasan Penolakan Kargo (Reason Code):
                  </label>
                  <select
                    value={rejectReasonCode}
                    onChange={(e) => setRejectReasonCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                  >
                    <option value="SEC_THREAT_ORGANIC_ALARM">SEC-01: Ancaman Radiasi / Residu Partikel Organik Berbahaya</option>
                    <option value="DOC_MISMATCH_SUSPICIOUS">SEC-02: Dokumen CSD Palsu / Tidak Cocok dengan Fisik</option>
                    <option value="DGR_UNDECLARED_HAZARD">SEC-03: Bahan Berbahaya (DG) Tanpa Deklarasi IATA</option>
                    <option value="DAMAGED_LEAKING_PACKAGE">SEC-04: Kemasan Rusak Parah / Berisiko Mengontaminasi Pesawat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Penjelasan Rinci / Temuan di Lapangan:
                  </label>
                  <textarea
                    required
                    value={rejectDetail}
                    onChange={(e) => setRejectDetail(e.target.value)}
                    placeholder="Tuliskan justifikasi detail mengenai penolakan kargo ini untuk dicetak pada surat resmi..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-rose-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Tindakan ini permanen dan kargo akan dikeluarkan dari alur dispatch penerbangan.</span>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <FileX className="w-4 h-4" />
                    <span>Terbitkan Surat Reject Resmi</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ketentuan Surat Reject</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Surat Reject adalah dokumen sah yang menghentikan kargo secara legal dari penerbangan. Dokumen ini diserahkan kepada agen pengirim/maskapai beserta bukti scan X-Ray/EVD.
            </p>
          </div>
        </div>
      )}

      {/* Sub-tab 4: Permintaan Data Tambahan */}
      {activeSubTab === 'DATA_REQUEST' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Permintaan Data Tambahan (Additional Data Request)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kirimkan permintaan dokumen pelengkap ke Shipper/Regulated Agent bila manifest belum memadai.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateDataRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ditujukan Kepada (Recipient):
                </label>
                <input
                  type="text"
                  value={requestedFromInput}
                  onChange={(e) => setRequestedFromInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Dokumen / Field yang Diminta (Pisahkan dengan koma):
                </label>
                <input
                  type="text"
                  required
                  value={requestedFieldsInput}
                  onChange={(e) => setRequestedFieldsInput(e.target.value)}
                  placeholder="e.g. MSDS Kimia Baterai, Surat Izin BPOM, Sertifikat Karantina Tumbuhan"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Kirim Permintaan Dokumen Tambahan</span>
                </button>
              </div>
            </form>

            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                Daftar Permintaan Aktif:
              </h4>
              {selectedConsignment?.dataRequests && selectedConsignment.dataRequests.length > 0 ? (
                <div className="space-y-2">
                  {selectedConsignment.dataRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">Ke: {req.requestedFrom}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                            {req.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Item: {req.requestedFields.join(', ')}
                        </p>
                      </div>
                      <div className="text-right text-[11px] text-slate-400">
                        Batas: {req.dueAt}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  Tidak ada permintaan data tambahan aktif untuk kargo ini.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ketentuan Permintaan Dokumen Tambahan</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Permintaan data tambahan bertujuan agar Shipper segera melengkapi dokumen sebelum batas waktu penerbangan (SLA). Checker dapat memantau status pemenuhan secara real-time.
            </p>
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
              <strong>Catatan Audit:</strong> Seluruh permintaan data dicatat ke dalam audit trail dan akan memperbarui status kargo menjadi data hold bila melewati batas waktu.
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 0: Unloading Gatrans & Form Checker */}
      {activeSubTab === 'FORM_CHECKER_UNLOADING' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Form Unloading Gatrans & Form Checker Lapangan</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200">
                    Standar Operasional Unloading & Checker
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pencatatan awal penerimaan bongkar muatan dari Agen/Shipper, pencocokan SMU/PTI, dan verifikasi fisik koli oleh Checker.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700">
                AWB: {selectedConsignment?.awbNumber}
              </span>
            </div>

            {/* Bagian 1: Data Unloading Gatrans */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  1. Data Penerimaan & Unloading di Area Gatrans
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Custody Initial
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Nomor SMU (Surat Muatan Udara):</label>
                  <input
                    type="text"
                    readOnly
                    value={`SMU-${selectedConsignment?.airline.slice(0, 2).toUpperCase()}-${selectedConsignment?.awbNumber.slice(-6)}`}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Nomor Referensi PTI (Pemberitahuan Tentang Isi):</label>
                  <input
                    type="text"
                    readOnly
                    value={`PTI-2026-${selectedConsignment?.id.slice(-4) || '0412'}`}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Pihak Penyerah (Agen / Shipper):</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedConsignment?.shipper || 'PT Nusantara Jaya Logistik'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Kondisi Kemasan Saat Tiba:</label>
                  <select className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800">
                    <option value="BAIK_UTUH">BAIK & UTUH (Tidak Cacat/Bocor)</option>
                    <option value="RUSAK_SOBEK">KEMASAN SOBEK / CRUSHED</option>
                    <option value="SEGEL_TIDAK_STANDAR">SEGEL TIDAK STANDAR / TAMPER</option>
                    <option value="BASAH_REMBES">REMBES / BASAH (HOLD)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                <div>Koli Dideklarasikan: <strong className="text-slate-900">{selectedConsignment?.totalDeclaredPieces} Koli</strong></div>
                <div>Koli Dihitung Fisik: <strong className="text-slate-900">{selectedConsignment?.totalReceivedPieces} Koli</strong></div>
                <div>Selisih Fisik Awal: <strong className={selectedConsignment?.totalDeclaredPieces === selectedConsignment?.totalReceivedPieces ? 'text-emerald-700' : 'text-rose-700'}>
                  {selectedConsignment?.totalDeclaredPieces === selectedConsignment?.totalReceivedPieces ? 'NIHIL (Sesuai)' : `${Math.abs((selectedConsignment?.totalDeclaredPieces || 0) - (selectedConsignment?.totalReceivedPieces || 0))} Koli Selisih`}
                </strong></div>
              </div>
            </div>

            {/* Bagian 2: Hasil Pemeriksaan Form Checker (AC-110) */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  2. Hasil Pemeriksaan Form Checker Lapangan
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Pemeriksa: {currentUser.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Status Kelengkapan Dokumen:</label>
                  <select className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800">
                    <option value="LENGKAP">DOKUMEN LENGKAP (AWB, PTI, Manifest Valid)</option>
                    <option value="TIDAK_LENGKAP">DOKUMEN KURANG / TIDAK VALID</option>
                    <option value="EXCEPTION">EXCEPTION / DOKUMEN MENYIMPANG</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Status Fisik & Kemasan Koli:</label>
                  <select className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800">
                    <option value="SESUAI">SESUAI DENGAN MANIFEST (No Issue)</option>
                    <option value="SELISIH_KOLI">SELISIH JUMLAH KOLI (Blocker)</option>
                    <option value="KEMASAN_RUSAK">KEMASAN RUSAK / PERLU KARANTINA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1 text-xs">
                  Catatan Checker & Rekomendasi Alur Keamanan:
                </label>
                <textarea
                  rows={2}
                  defaultValue="Pemeriksaan fisik awal dan pencocokan AWB/PTI selesai di area unloading Gatrans. Kemasan koli utuh, label piece terpasang rapi, dan siap dialihkan ke Tunnel Screening X-Ray #01."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                <div>
                  <strong>Perpindahan Tanggung Jawab (Custody Transfer):</strong> Diserahkan dari Checker ke Operator X-Ray Tunnel 01.
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('CHECKLIST')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Form & Lanjut ke Screening</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ketentuan Unloading & Bongkar Muatan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Penerimaan awal di Gatrans mencatat waktu tiba, pihak penyerah, referensi SMU/PTI, jumlah koli awal, kondisi kemasan, serta bukti penerimaan.
              </p>
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Aturan Penerimaan:</strong> Penerimaan awal bukan persetujuan keamanan atau persetujuan terbang. Kargo dilarang melanjutkan ke dispatch sebelum seluruh tahapan X-Ray, DG review (bila relevan), dan tanda tangan AVSEC terpenuhi.
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
