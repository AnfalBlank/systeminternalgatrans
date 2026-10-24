import React, { useState } from 'react';
import { Consignment, UserProfile, LoadingSealRecord, GoodsReceiptBTB } from '../../types/cargo';
import {
  Truck,
  LockKeyhole,
  Navigation,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  Building2,
  Calendar,
  Sparkles,
  QrCode,
  Check,
  ChevronRight,
  ShieldCheck,
  FileCheck,
  Printer,
} from 'lucide-react';
import { Language } from '../../i18n/translations';
import { motion, AnimatePresence } from 'motion/react';
import { DocumentType } from '../DocumentPrintModal';

interface DispatchViewProps {
  consignments: Consignment[];
  currentUser: UserProfile;
  currentLang: Language;
  onRecordLoadingAndSeal: (consignmentId: string, sealData: Partial<LoadingSealRecord>) => void;
  onConfirmDispatchLine1: (consignmentId: string) => void;
  onRecordBTBReceipt: (consignmentId: string, btbData: Partial<GoodsReceiptBTB>) => void;
  onOpenPrintModal?: (type: DocumentType, c?: Consignment) => void;
}

export const DispatchView: React.FC<DispatchViewProps> = ({
  consignments,
  currentUser,
  currentLang,
  onRecordLoadingAndSeal,
  onConfirmDispatchLine1,
  onRecordBTBReceipt,
  onOpenPrintModal,
}) => {
  const [activeTab, setActiveTab] = useState<'SCHEDULE_TRUCK' | 'LOADING_SEAL' | 'LINE1_DISPATCH' | 'BTB_RECEIPT'>(
    'LOADING_SEAL'
  );
  const [selectedConsignmentId, setSelectedConsignmentId] = useState<string>(consignments[0]?.id || '');

  const selectedConsignment = consignments.find((c) => c.id === selectedConsignmentId) || consignments[0];

  // Loading & Seal State
  const [truckPlateNo, setTruckPlateNo] = useState('B 9841 UXR (Truk Box Line 1)');
  const [driverName, setDriverName] = useState('Bambang Wijaya');
  const [sealNumber, setSealNumber] = useState(`SEAL-GAT-${Math.floor(10000 + Math.random() * 90000)}`);
  const [sealCondition, setSealCondition] = useState<'INTACT_PERFECT' | 'TAMPER_EVIDENT_ACTIVE' | 'DAMAGED'>('INTACT_PERFECT');

  // BTB State
  const [btbNo, setBtbNo] = useState(`BTB-${selectedConsignment?.airline.slice(0, 2).toUpperCase()}-2026-${Math.floor(10000 + Math.random() * 90000)}`);
  const [airlineReceiverName, setAirlineReceiverName] = useState('Yusuf Maulana (Staf Gudang Maskapai)');
  const [actualPiecesReceived, setActualPiecesReceived] = useState<number>(selectedConsignment?.totalReceivedPieces || 12);
  const [actualWeightReceived, setActualWeightReceived] = useState<number>(selectedConsignment?.totalWeightKg || 284.5);
  const [btbNotes, setBtbNotes] = useState('Diterima lengkap dengan segel utuh di Gudang Lini 1 maskapai.');

  const handleSaveLoadingSeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsignment) return;
    onRecordLoadingAndSeal(selectedConsignment.id, {
      consignmentId: selectedConsignment.id,
      truckPlateNo,
      truckCapacityTons: 5.0,
      driverName,
      driverId: 'USR-04',
      routeCode: 'Line 1 - Landside Cargo Gateway to Airside Warehouse',
      sealNumber,
      sealCondition,
      loadedPieces: selectedConsignment.totalReceivedPieces,
      loadedBy: `${currentUser.name} (${currentUser.roleLabel})`,
      loadedAt: new Date().toLocaleTimeString(),
      dispatchStatus: 'LOADED_AND_SEALED',
    });
  };

  const handleDispatch = () => {
    if (!selectedConsignment) return;
    onConfirmDispatchLine1(selectedConsignment.id);
  };

  const handleSaveBTB = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsignment) return;
    const isMatched = actualPiecesReceived === selectedConsignment.totalReceivedPieces;
    onRecordBTBReceipt(selectedConsignment.id, {
      receiptNo: btbNo,
      consignmentId: selectedConsignment.id,
      awbNumber: selectedConsignment.awbNumber,
      airlineWarehouse: `Gudang Ekspor Lini 1 ${selectedConsignment.airline}`,
      receivedByName: airlineReceiverName,
      receivedAt: new Date().toLocaleTimeString(),
      expectedPieces: selectedConsignment.totalReceivedPieces,
      actualPieces: actualPiecesReceived,
      expectedWeightKg: selectedConsignment.totalWeightKg,
      actualWeightKg: actualWeightReceived,
      condition: 'INTACT_SEAL',
      status: isMatched ? 'MATCHED' : 'DISCREPANCY',
      notes: btbNotes,
      attachedSignatureRef: `SIG-BTB-${Date.now().toString().slice(-4)}.png`,
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
              <Truck className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Loading, Segel, Dispatch Line 1 & BTB Maskapai
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Pemuatan Truk, Segel & Lini 1
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pemuatan kargo ke armada truk, pemasangan & verifikasi segel keamanan, pengiriman Lini 1 oleh Driver, dan pencatatan Bukti Timbang Barang (BTB) maskapai.
          </p>
        </div>

        {/* Consignment Selector Quick Bar & Print Action */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedConsignmentId}
            onChange={(e) => {
              setSelectedConsignmentId(e.target.value);
              const found = consignments.find((c) => c.id === e.target.value);
              if (found) {
                setActualPiecesReceived(found.totalReceivedPieces);
                setActualWeightReceived(found.totalWeightKg);
              }
            }}
            className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-amber-500"
          >
            {consignments.map((c) => (
              <option key={c.id} value={c.id}>
                {c.awbNumber} - {c.airline} ({c.status})
              </option>
            ))}
          </select>

          {selectedConsignment && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenPrintModal && onOpenPrintModal('DELIVERY_ORDER', selectedConsignment)}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Cetak Delivery Order Resmi Lini 1"
              >
                <Printer className="w-3.5 h-3.5 text-slate-300" />
                <span>Cetak DO</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenPrintModal && onOpenPrintModal('POH_BTB', selectedConsignment)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Cetak Bukti Tanda Terima Barang (BTB) & PoH"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak BTB</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl w-fit border border-slate-200/70">
        <button
          onClick={() => setActiveTab('LOADING_SEAL')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'LOADING_SEAL'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LockKeyhole className="w-4 h-4 text-amber-600" />
          <span>1. Loading & Pemasangan Segel</span>
        </button>

        <button
          onClick={() => setActiveTab('LINE1_DISPATCH')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'LINE1_DISPATCH'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Navigation className="w-4 h-4 text-blue-600" />
          <span>2. Dispatch Rute Lini 1 (Driver)</span>
        </button>

        <button
          onClick={() => setActiveTab('BTB_RECEIPT')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'BTB_RECEIPT'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4 text-emerald-600" />
          <span>3. Penerimaan BTB Maskapai</span>
        </button>
      </div>

      {/* Tab 1: Loading & Pemasangan Segel */}
      {activeTab === 'LOADING_SEAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSaveLoadingSeal} className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Formulir Loading Kargo & Verifikasi Segel Truk: {selectedConsignment?.awbNumber}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Handler memverifikasi jumlah piece fisik dan memasang segel keamanan anti-manipulasi (*tamper-evident seal*).
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Penerbangan: {selectedConsignment?.flightNo}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Armada Truk Box Line 1:
                </label>
                <input
                  type="text"
                  required
                  value={truckPlateNo}
                  onChange={(e) => setTruckPlateNo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Driver Penugasan (Line 1 Driver):
                </label>
                <input
                  type="text"
                  required
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nomor Segel Keamanan (Seal Number):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={sealNumber}
                    onChange={(e) => setSealNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-amber-900 bg-amber-50/50"
                  />
                  <LockKeyhole className="absolute right-3.5 top-2.5 w-4 h-4 text-amber-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kondisi Fisik Segel (Seal Condition):
                </label>
                <select
                  value={sealCondition}
                  onChange={(e: any) => setSealCondition(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                >
                  <option value="INTACT_PERFECT">INTACT_PERFECT (Segel Terkunci Sempurna & Utuh)</option>
                  <option value="TAMPER_EVIDENT_ACTIVE">TAMPER_EVIDENT_ACTIVE (Sensor Terpasang)</option>
                  <option value="DAMAGED">DAMAGED (Segel Rusak / Tidak Sah - Block Dispatch)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Koli Dimuat:</span>
                <span className="font-bold text-slate-800">{selectedConsignment?.totalReceivedPieces} Pieces</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Berat Kargo:</span>
                <span className="font-bold text-slate-800">{selectedConsignment?.totalWeightKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Petugas Loading (Handler):</span>
                <span className="font-bold text-slate-800">{currentUser.name} ({currentUser.roleLabel})</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Aturan Pemuatan: Loading kargo mencatat koli, Handler, dan nomor segel.
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <LockKeyhole className="w-4 h-4" />
                <span>Simpan Loading & Kunci Segel</span>
              </button>
            </div>
          </form>

          {/* Right Status Card */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 font-bold uppercase">Status Segel Truk</span>
                <LockKeyhole className="w-5 h-5 text-amber-400" />
              </div>
              {selectedConsignment?.loadingSeal ? (
                <div className="space-y-3">
                  <div className="text-xl font-mono font-bold text-amber-300">
                    {selectedConsignment.loadingSeal.sealNumber}
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Kendaraan:</span>
                      <span className="font-bold text-white">{selectedConsignment.loadingSeal.truckPlateNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Driver:</span>
                      <span className="font-bold text-white">{selectedConsignment.loadingSeal.driverName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status Segel:</span>
                      <span className="font-bold text-emerald-400">{selectedConsignment.loadingSeal.sealCondition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Waktu Kunci:</span>
                      <span className="text-slate-200">{selectedConsignment.loadingSeal.loadedAt}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/5 border border-dashed border-white/10 text-xs text-slate-400 text-center">
                  Truk belum dimuat dan disegel.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Dispatch Rute Line 1 (Driver) */}
      {activeTab === 'LINE1_DISPATCH' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Konsol Dispatch Driver - Rute Lini 1 Bandara
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Driver memverifikasi prasyarat keamanan dan memberangkatkan kargo menuju gudang maskapai.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Driver Aktif: {currentUser.role === 'DRIVER' ? currentUser.name : 'Bambang Wijaya'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Rute Lini 1: Landside Terminal Kargo → Gudang Maskapai Airside</h4>
                  <p className="text-[11px] text-slate-500">Estimasi waktu tempuh steril: 15 menit melalui Pos Pemeriksaan Keamanan Gerbang 3.</p>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-blue-100">
                  <span className="text-slate-400 text-[10px] block">AWB Kargo</span>
                  <span className="font-bold text-slate-900">{selectedConsignment?.awbNumber}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-blue-100">
                  <span className="text-slate-400 text-[10px] block">Nomor Segel</span>
                  <span className="font-mono font-bold text-amber-700">{selectedConsignment?.loadingSeal?.sealNumber || 'SEAL-PENDING'}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-blue-100">
                  <span className="text-slate-400 text-[10px] block">Status Keamanan</span>
                  <span className="font-bold text-emerald-600">FIT TO FLY / DO VALID</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-800">Checklist Driver Sebelum Berangkat:</div>
              <div className="space-y-1 text-slate-600">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Surat Tanda Terima Kargo (STK) fisik dan DO terbit telah dibawa.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Segel pintu truk terkunci rapat dan nomor fisik cocok dengan sistem.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Izin lintas Airside (Pass Bandara Driver) valid.</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Waktu Keberangkatan dicatat otomatis pada audit trail.</span>
              </div>
              <button
                onClick={handleDispatch}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Konfirmasi Berangkat Line 1 (Driver)</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Aturan Dispatch Driver</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Driver tidak diizinkan mengubah muatan kargo di jalan. Jika segel putus atau rusak selama perjalanan di Lini 1, Driver wajib berhenti dan melapor ke AVSEC Patroli.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Penerimaan BTB Maskapai */}
      {activeTab === 'BTB_RECEIPT' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSaveBTB} className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Pencatatan BTB (Bukti Timbang Barang / Bukti Tanda Terima Barang) Maskapai
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Penerimaan fisik oleh petugas gudang maskapai di area Lini 1 airside.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Gudang Maskapai
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nomor BTB Resmi Maskapai:
                </label>
                <input
                  type="text"
                  required
                  value={btbNo}
                  onChange={(e) => setBtbNo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Petugas Penerima Maskapai:
                </label>
                <input
                  type="text"
                  required
                  value={airlineReceiverName}
                  onChange={(e) => setAirlineReceiverName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Jumlah Koli Aktual Diterima (Pieces):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={actualPiecesReceived}
                    onChange={(e) => setActualPiecesReceived(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400">
                    Harapan: {selectedConsignment?.totalReceivedPieces}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Berat Aktual Ditimbang Maskapai (kg):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={actualWeightReceived}
                    onChange={(e) => setActualWeightReceived(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400">
                    Harapan: {selectedConsignment?.totalWeightKg} kg
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Catatan Penerimaan / Temuan Discrepancy:
              </label>
              <textarea
                value={btbNotes}
                onChange={(e) => setBtbNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Aturan Validasi: Selisih koli/berat memicu tiket exception dan menahan penutupan DO.
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                <span>Simpan Penerimaan BTB</span>
              </button>
            </div>
          </form>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Peran BTB</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              BTB adalah bukti sah penerimaan barang oleh gudang maskapai. Setelah BTB cocok, kargo berlanjut ke tahap pembuatan invoice dan serah terima akhir (*Proof of Handover*).
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
