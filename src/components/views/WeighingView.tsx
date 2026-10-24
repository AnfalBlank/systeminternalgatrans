import React, { useState } from 'react';
import { Consignment, UserProfile, WeighingRecord, CargoSecurityDoc } from '../../types/cargo';
import {
  Scale,
  FileSpreadsheet,
  FileCheck2,
  Printer,
  CheckCircle2,
  AlertTriangle,
  History,
  QrCode,
  Building2,
  Sparkles,
  RefreshCw,
  Plus,
  ArrowRight,
  ShieldCheck,
  Check,
  FileText,
} from 'lucide-react';
import { Language } from '../../i18n/translations';
import { motion, AnimatePresence } from 'motion/react';
import { DocumentType } from '../DocumentPrintModal';

interface WeighingViewProps {
  consignments: Consignment[];
  currentUser: UserProfile;
  currentLang: Language;
  onRecordWeighing: (consignmentId: string, weighing: Partial<WeighingRecord>) => void;
  onIssueCSD: (consignmentId: string, csd: Partial<CargoSecurityDoc>) => void;
  onIssueSTK: (consignmentId: string, stk: Partial<CargoSecurityDoc>) => void;
  onOpenPrintModal?: (type: DocumentType, c?: Consignment) => void;
}

export const WeighingView: React.FC<WeighingViewProps> = ({
  consignments,
  currentUser,
  currentLang,
  onRecordWeighing,
  onIssueCSD,
  onIssueSTK,
  onOpenPrintModal,
}) => {
  const [activeTab, setActiveTab] = useState<'WEIGHING' | 'CSD_DOCS' | 'STK_DOCS'>('WEIGHING');
  const [selectedConsignmentId, setSelectedConsignmentId] = useState<string>(consignments[0]?.id || '');
  const [showPrintModal, setShowPrintModal] = useState<null | 'CSD' | 'STK'>(null);

  const selectedConsignment = consignments.find((c) => c.id === selectedConsignmentId) || consignments[0];

  // Weighing inputs
  const [grossInput, setGrossInput] = useState<number>(selectedConsignment?.totalWeightKg || 284.5);
  const [tareInput, setTareInput] = useState<number>(14.5);
  const [lengthInput, setLengthInput] = useState<number>(45);
  const [widthInput, setWidthInput] = useState<number>(35);
  const [heightInput, setHeightInput] = useState<number>(30);
  const [scaleReference, setScaleReference] = useState('DIGI-SCALE-T2-08 (Kalibrasi Metrologi 2026)');

  // Calculated weights
  const piecesCount = selectedConsignment?.totalReceivedPieces || 1;
  const netWeight = Math.max(0, grossInput - tareInput);
  // Volume weight formula: (L x W x H) / 6000 per piece * pieces
  const volumeWeight = Number((((lengthInput * widthInput * heightInput) / 6000) * piecesCount).toFixed(1));
  const chargeableWeight = Math.max(grossInput, volumeWeight);

  const handleSaveWeighing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsignment) return;
    const ticketNo = `TKT-WGH-${Math.floor(10000 + Math.random() * 90000)}`;
    onRecordWeighing(selectedConsignment.id, {
      consignmentId: selectedConsignment.id,
      grossWeightKg: grossInput,
      tareWeightKg: tareInput,
      netWeightKg: netWeight,
      volumeWeightKg: volumeWeight,
      chargeableWeightKg: chargeableWeight,
      dimensionsSummary: `${piecesCount} Koli @ ${lengthInput}x${widthInput}x${heightInput} cm`,
      scaleReference,
      ticketReference: ticketNo,
      weighedBy: `${currentUser.name} (${currentUser.roleLabel})`,
      weighedAt: new Date().toLocaleTimeString(),
    });
  };

  const handleCreateCSD = () => {
    if (!selectedConsignment) return;
    const csdNum = `CSD-ID-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    onIssueCSD(selectedConsignment.id, {
      documentType: 'CSD',
      documentNo: csdNum,
      consignmentId: selectedConsignment.id,
      version: 1,
      status: 'ISSUED',
      securityStatus: 'SPX',
      regulatedAgentName: 'PT Gatrans Cargo Angkasa Logistics (RA-0021)',
      issuedBy: currentUser.name,
      screeningMethod: 'Dual-View X-Ray (Smiths HI-SCAN) + Visual Checklist',
      validUntil: '24 Jam sejak diterbitkan',
    });
  };

  const handleCreateSTK = () => {
    if (!selectedConsignment) return;
    const stkNum = `STK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    onIssueSTK(selectedConsignment.id, {
      documentType: 'STK',
      documentNo: stkNum,
      consignmentId: selectedConsignment.id,
      version: 1,
      status: 'ISSUED',
      securityStatus: 'SPX',
      regulatedAgentName: 'PT Gatrans Cargo Angkasa Logistics',
      issuedBy: currentUser.name,
      screeningMethod: 'Dual-View X-Ray & Penimbangan Terkalibrasi',
      validUntil: 'Hari Ini (Batas Cut-Off Penerbangan)',
    });
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
              <Scale className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Penimbangan Digital & Pengelolaan CSD / STK
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Timbangan Digital & CSD Resmi
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Penimbangan aktual terkalibrasi metrologi, kalkulasi berat volume/chargeable, serta pembuatan dokumen CSD dan STK resmi di dalam sistem.
          </p>
        </div>

        {/* Consignment Selector Quick Bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Pilih AWB:</span>
          <select
            value={selectedConsignmentId}
            onChange={(e) => {
              setSelectedConsignmentId(e.target.value);
              const found = consignments.find((c) => c.id === e.target.value);
              if (found) setGrossInput(found.totalWeightKg);
            }}
            className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-purple-500"
          >
            {consignments.map((c) => (
              <option key={c.id} value={c.id}>
                {c.awbNumber} - {c.airline} ({c.totalWeightKg} kg)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl w-fit border border-slate-200/70">
        <button
          onClick={() => setActiveTab('WEIGHING')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'WEIGHING'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4 text-purple-600" />
          <span>1. Stasiun Penimbangan Kargo</span>
        </button>

        <button
          onClick={() => setActiveTab('CSD_DOCS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'CSD_DOCS'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-emerald-600" />
          <span>2. Cargo Security Declaration (CSD)</span>
        </button>

        <button
          onClick={() => setActiveTab('STK_DOCS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'STK_DOCS'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
          <span>3. Surat Tugas Kargo (STK)</span>
        </button>
      </div>

      {/* Tab 1: Penimbangan Kargo */}
      {activeTab === 'WEIGHING' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSaveWeighing} className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Formulir Penimbangan Digital: {selectedConsignment?.awbNumber}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Petugas Handler/Checker menimbang unit fisik di timbangan bersertifikasi metrologi.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                Alat: DIGI-SCALE-T2
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Berat Bruto Terukur (Gross Weight):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={grossInput}
                    onChange={(e) => setGrossInput(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">KG</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tara Pallet / Pembungkus (Tare Weight):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={tareInput}
                    onChange={(e) => setTareInput(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">KG</span>
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Dimensi Rata-rata Koli (P × L × T dalam cm):
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div className="relative">
                  <input
                    type="number"
                    value={lengthInput}
                    onChange={(e) => setLengthInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-center"
                    placeholder="Panjang"
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-1">Panjang (P)</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={widthInput}
                    onChange={(e) => setWidthInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-center"
                    placeholder="Lebar"
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-1">Lebar (L)</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={heightInput}
                    onChange={(e) => setHeightInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-center"
                    placeholder="Tinggi"
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-1">Tinggi (T)</span>
                </div>
              </div>
            </div>

            {/* Calculations Card */}
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-[10px] text-purple-700 font-semibold uppercase">Berat Netto</span>
                <div className="text-base font-extrabold text-purple-950 mt-0.5">{netWeight.toFixed(1)} kg</div>
              </div>
              <div>
                <span className="text-[10px] text-purple-700 font-semibold uppercase">Volume Weight</span>
                <div className="text-base font-extrabold text-purple-950 mt-0.5">{volumeWeight} kg</div>
              </div>
              <div className="col-span-2 bg-white rounded-xl p-2 border border-purple-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Chargeable Weight (Tagihan)</span>
                <div className="text-lg font-black text-purple-600 mt-0.5">{chargeableWeight.toFixed(1)} KG</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Referensi Mesin Timbangan & Kalibrasi Metrologi:
              </label>
              <input
                type="text"
                value={scaleReference}
                onChange={(e) => setScaleReference(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Pencatat: {currentUser.name} ({currentUser.roleLabel})
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Rekaman Timbang Digital</span>
              </button>
            </div>
          </form>

          {/* Right Status Card */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-purple-400 font-bold uppercase">Tiket Timbang Aktif</span>
                <QrCode className="w-5 h-5 text-purple-400" />
              </div>
              {selectedConsignment?.weighing ? (
                <div className="space-y-3">
                  <div className="text-xl font-mono font-bold">{selectedConsignment.weighing.ticketReference}</div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bruto:</span>
                      <span className="font-bold text-white">{selectedConsignment.weighing.grossWeightKg} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Netto:</span>
                      <span className="font-bold text-white">{selectedConsignment.weighing.netWeightKg} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Chargeable:</span>
                      <span className="font-bold text-emerald-400">{selectedConsignment.weighing.chargeableWeightKg} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Petugas:</span>
                      <span className="text-slate-200">{selectedConsignment.weighing.weighedBy}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/5 border border-dashed border-white/10 text-xs text-slate-400 text-center">
                  Data timbang belum disimpan untuk AWB ini.
                </div>
              )}

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-400/20 text-xs text-purple-200">
                <strong>Aturan Operasional:</strong> CSD & STK tidak dapat difinalisasi sebelum data timbang aktual tercatat lengkap.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Cargo Security Declaration (CSD) */}
      {activeTab === 'CSD_DOCS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Cargo Security Declaration (CSD) Resmi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dokumen deklarasi keamanan kargo terakreditasi ICAO Annex 17 & Dirjen Perhubungan Udara.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Status SPX (Secure)
              </span>
            </div>

            {selectedConsignment?.csdDoc ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="font-mono font-bold text-sm text-slate-900">{selectedConsignment.csdDoc.documentNo}</span>
                      <div className="text-[11px] text-slate-500">{selectedConsignment.csdDoc.regulatedAgentName}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {selectedConsignment.csdDoc.status} (v{selectedConsignment.csdDoc.version})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Air Waybill:</span>
                    <div className="font-bold text-slate-800">{selectedConsignment.awbNumber}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Status Keamanan:</span>
                    <div className="font-bold text-emerald-600">{selectedConsignment.csdDoc.securityStatus} (Secure for Passenger Aircraft)</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Metode Screening:</span>
                    <div className="font-bold text-slate-800">{selectedConsignment.csdDoc.screeningMethod}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Diterbitkan Oleh:</span>
                    <div className="font-bold text-slate-800">{selectedConsignment.csdDoc.issuedBy} ({selectedConsignment.csdDoc.issuedAt})</div>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      if (onOpenPrintModal && selectedConsignment) {
                        onOpenPrintModal('CSD_STK', selectedConsignment);
                      } else {
                        window.print();
                      }
                    }}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-slate-300" />
                    <span>Cetak CSD & STK Resmi (A4 PDF)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-slate-200 text-center space-y-4">
                <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">CSD Belum Diterbitkan untuk AWB Ini</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Pastikan hasil screening X-Ray PASS dan penimbangan kargo telah selesai sebelum membuat dokumen.
                  </p>
                </div>
                <button
                  onClick={handleCreateCSD}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Generate Dokumen CSD Resmi</span>
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Mandat CSD (Regulated Agent)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              CSD adalah bukti legal bahwa kargo telah disaring secara aman oleh Regulated Agent bersertifikat. Tanpa CSD valid, maskapai menolak memuat barang ke lambung pesawat.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Surat Tugas Kargo (STK) */}
      {activeTab === 'STK_DOCS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Surat Tugas Kargo (STK / Surat Tanda Terima Kargo)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dokumen tugas operasional penanganan dan pergerakan kargo di area lini bandara.
                </p>
              </div>
            </div>

            {selectedConsignment?.stkDoc ? (
              <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-indigo-200">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                    <span className="font-mono font-bold text-sm text-indigo-950">{selectedConsignment.stkDoc.documentNo}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                    TERBIT (ISSUED)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">AWB Referensi:</span>
                    <div className="font-bold text-slate-800">{selectedConsignment.awbNumber}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Penerbangan:</span>
                    <div className="font-bold text-slate-800">{selectedConsignment.flightNo} ({selectedConsignment.destination})</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Koli / Berat:</span>
                    <div className="font-bold text-slate-800">{selectedConsignment.totalReceivedPieces} Koli / {selectedConsignment.totalWeightKg} kg</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Diterbitkan Oleh:</span>
                    <div className="font-bold text-slate-800">{selectedConsignment.stkDoc.issuedBy}</div>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end">
                  <button
                    onClick={() => {
                      if (onOpenPrintModal && selectedConsignment) {
                        onOpenPrintModal('CSD_STK', selectedConsignment);
                      } else {
                        window.print();
                      }
                    }}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-slate-300" />
                    <span>Cetak Dokumen STK (A4 PDF)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-slate-200 text-center space-y-4">
                <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">STK Belum Dibuat</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Buat STK untuk menugaskan Handler dan Driver mengangkut kargo menuju Line 1.
                  </p>
                </div>
                <button
                  onClick={handleCreateSTK}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Terbitkan Dokumen STK Resmi</span>
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Fungsi Dokumen STK</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              STK mendampingi kargo fisik selama pemindahan dari gedung terminal kargo menuju area staging dan truk Lini 1.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
