import React, { useState } from 'react';
import {
  Scan,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  Barcode,
  Package,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Consignment } from '../types/cargo';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  consignments: Consignment[];
  onAddNewConsignment: (newConsignment: Consignment) => void;
  onLogScanEvent: (barcode: string, result: string) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  consignments,
  onAddNewConsignment,
  onLogScanEvent,
}) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    status: 'success' | 'warning' | 'error' | null;
    message: string;
    consignment?: Consignment;
  }>({ status: null, message: '' });

  // Preset quick scans for demonstration
  const presets = [
    { label: 'AWB 126-89412045 (Valid Garmin ICs)', code: '126-89412045' },
    { label: 'AWB 157-77291044 (Sumatra Coffee - Threat Hold)', code: '157-77291044' },
    { label: 'AWB 999-12048591 (Orchids - Missing Piece)', code: '999-12048591' },
    { label: 'Unregistered AWB 888-71049281 (Auto CSD Lookup)', code: '888-71049281' },
    { label: 'Damaged Barcode Syntax (Trigger Exception)', code: 'ERR#BAD_BARCODE' },
  ];

  const handleScan = (codeToScan?: string) => {
    const code = (codeToScan || barcodeInput).trim();
    if (!code) return;

    onLogScanEvent(code, 'KEYBOARD_WEDGE_SCAN');

    // Rule CR-02: Format validation
    if (code.includes('ERR#') || code.length < 8) {
      setScanResult({
        status: 'error',
        message: `Format barcode tidak terbaca/rusak [${code}]. Tiket eksepsi otomatis dibuat sesuai SOP.`,
      });
      return;
    }

    // Existing check
    const existing = consignments.find((c) => c.awbNumber === code || c.id === code);
    if (existing) {
      setScanResult({
        status: 'success',
        message: `Pencocokan Sukses: AWB [${existing.awbNumber}] ditemukan di registri CSD. Status saat ini: ${existing.status}. Rekonsiliasi: ${existing.totalReceivedPieces}/${existing.totalDeclaredPieces} koli.`,
        consignment: existing,
      });
      return;
    }

    // Auto Intake simulation
    const simulatedConsignment: Consignment = {
      id: `CNS-${Date.now().toString().slice(-4)}`,
      awbNumber: code,
      airline: 'Garuda Indonesia Cargo',
      flightNo: 'GA-890',
      destination: 'HND',
      totalDeclaredPieces: 6,
      totalReceivedPieces: 6,
      totalWeightKg: 142.5,
      shipper: 'PT Nusantara Jaya Logistik',
      consignee: 'Tokyo Aviation Express Ltd',
      natureOfGoods: 'Perishable - Fresh Tropical Fruits',
      status: 'AWAITING_XRAY',
      dataVersion: 1,
      csdVerified: true,
      slaStatus: 'ON_TRACK',
      slaMinutesRemaining: 180,
      slaDeadline: 'Today 16:30',
      lastUpdatedAt: new Date().toLocaleTimeString(),
      pieces: Array.from({ length: 6 }, (_, i) => ({
        id: `PC-${Date.now().toString().slice(-4)}-${i + 1}`,
        pieceNumber: i + 1,
        barcode: `${code}-P${String(i + 1).padStart(2, '0')}`,
        weightKg: 23.75,
        status: 'AWAITING_XRAY',
        scannedAtHandover: false,
      })),
      xrayInspections: [],
    };

    onAddNewConsignment(simulatedConsignment);
    setScanResult({
      status: 'success',
      message: `Penerimaan Baru: AWB [${code}] berhasil di-intake dari registri CSD Maskapai. 6 koli fisik terdaftar dan dijadwalkan ke antrean X-Ray Dual-View.`,
      consignment: simulatedConsignment,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop with Motion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="bg-white rounded-2xl max-w-xl w-full shadow-xl border border-slate-200/90 overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-5 sm:px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
                  <Scan className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">Simulator Barcode / QR Scanner</h3>
                  <p className="text-[11px] text-slate-400">USB / Bluetooth Wedge Emulation</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {/* Laser Animation Banner */}
              <div className="relative h-28 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center text-center p-4">
                <div className="absolute left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_12px_#f43f5e] animate-laser z-10" />
                <div className="relative z-20 flex flex-col items-center">
                  <Barcode className="w-12 h-12 text-slate-400 mb-1" />
                  <span className="text-[11px] font-mono text-slate-300">Arahkan scanner fisik atau ketik nomor AWB di bawah</span>
                </div>
              </div>

              {/* Input Area */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Input Keyboard Wedge / Barcode Manual:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                      placeholder="Ketik AWB (contoh: 126-89412045)..."
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={() => handleScan()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-sm"
                  >
                    Lookup
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Mendukung input berulang tanpa duplikasi transaksi ganda (Idempotent Scan).
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">Skenario Uji Coba Cepat:</p>
                <div className="space-y-1.5">
                  {presets.map((preset) => (
                    <button
                      key={preset.code}
                      onClick={() => {
                        setBarcodeInput(preset.code);
                        handleScan(preset.code);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-xs font-medium text-slate-700 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">{preset.label}</span>
                      <span className="font-mono text-[10px] text-slate-400 shrink-0 ml-2">{preset.code}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scan Feedback */}
              {scanResult.status && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                    scanResult.status === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : scanResult.status === 'warning'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {scanResult.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {scanResult.status === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                    <span>{scanResult.status === 'success' ? 'Verifikasi Berhasil' : 'Peringatan Keamanan Data'}</span>
                  </div>
                  <p>{scanResult.message}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px] font-mono">Status Sensor: Ready</span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
