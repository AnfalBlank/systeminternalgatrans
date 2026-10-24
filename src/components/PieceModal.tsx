import React, { useState } from 'react';
import {
  Layers,
  X,
  CheckCircle2,
  AlertTriangle,
  Barcode,
  Scale,
  ShieldCheck,
  Check,
  Scan,
  Printer,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Consignment, Piece } from '../types/cargo';

interface PieceModalProps {
  isOpen: boolean;
  onClose: () => void;
  consignment: Consignment | null;
  onUpdatePieceHandover: (consignmentId: string, pieceId: string, verified: boolean) => void;
}

export const PieceModal: React.FC<PieceModalProps> = ({
  isOpen,
  onClose,
  consignment,
  onUpdatePieceHandover,
}) => {
  const [pieceScanInput, setPieceScanInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!consignment) return null;

  const handleSimulatePieceScan = (e: React.FormEvent) => {
    e.preventDefault();
    const barcode = pieceScanInput.trim();
    if (!barcode) return;

    const matchedPiece = consignment.pieces.find((p) => p.barcode.toLowerCase() === barcode.toLowerCase());
    if (matchedPiece) {
      onUpdatePieceHandover(consignment.id, matchedPiece.id, true);
      setFeedback(`Koli #${matchedPiece.pieceNo} [${matchedPiece.barcode}] Terverifikasi. Identitas cocok.`);
      setPieceScanInput('');
    } else {
      setFeedback(`Validasi Koli: Barcode [${barcode}] tidak cocok dengan koli yang terdaftar pada AWB ${consignment.awbNumber}!`);
    }
  };

  const verifiedCount = consignment.pieces.filter((p) => p.scannedAtHandover).length;
  const allVerified = verifiedCount === consignment.pieces.length && consignment.pieces.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="bg-white rounded-2xl max-w-3xl w-full shadow-xl border border-slate-200/90 overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-5 sm:px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">Rekonsiliasi Fisik Unit Koli</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                      AWB {consignment.awbNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {consignment.airline} · {consignment.totalReceivedPieces} of {consignment.totalDeclaredPieces} koli tercatat
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {/* Scan Barcode input for piece */}
              <form onSubmit={handleSimulatePieceScan} className="flex gap-2">
                <div className="relative flex-1">
                  <Scan className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={pieceScanInput}
                    onChange={(e) => setPieceScanInput(e.target.value)}
                    placeholder="Pindai barcode koli fisik (contoh: 126-89412045-P01)..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  Verifikasi Koli
                </button>
              </form>

              {/* Feedback Alert */}
              {feedback && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    feedback.includes('tidak cocok')
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}
                >
                  {feedback.includes('tidak cocok') ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <span>{feedback}</span>
                </div>
              )}

              {/* Pieces Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase font-mono">
                        <th className="py-2.5 px-3">Koli #</th>
                        <th className="py-2.5 px-3">Barcode Fisik</th>
                        <th className="py-2.5 px-3">Berat / Dimensi</th>
                        <th className="py-2.5 px-3">Hasil X-Ray</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Rekonsiliasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {consignment.pieces.map((piece) => (
                        <tr key={piece.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                            #{String(piece.pieceNo).padStart(2, '0')}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-800 flex items-center gap-1.5">
                            <Barcode className="w-3.5 h-3.5 text-slate-400" />
                            <span>{piece.barcode}</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">
                            {piece.weightKg} kg · {piece.dimensionsCm} cm
                          </td>
                          <td className="py-2.5 px-3">
                            {piece.xrayResult ? (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                                  piece.xrayResult === 'PASS'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : piece.xrayResult === 'HOLD'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {piece.xrayResult}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">Belum Screening</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">
                            {piece.status.replace(/_/g, ' ')}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() =>
                                onUpdatePieceHandover(consignment.id, piece.id, !piece.scannedAtHandover)
                              }
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                                piece.scannedAtHandover
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                              }`}
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>{piece.scannedAtHandover ? 'Cocok' : 'Check In'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px]">Validasi Fisik: Seluruh unit koli wajib direkonsiliasi sebelum terbang.</span>
              </div>
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
