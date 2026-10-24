import React, { useState } from 'react';
import {
  FileText,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Printer,
  PenTool,
  Lock,
  Layers,
  Plane,
  Stamp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Consignment, UserProfile } from '../types/cargo';
import { DocumentType } from './DocumentPrintModal';

interface DOModalProps {
  isOpen: boolean;
  onClose: () => void;
  consignment: Consignment | null;
  currentUser: UserProfile;
  onIssueDO: (consignmentId: string, customSealNo: string) => void;
  onConfirmHandover: (
    consignmentId: string,
    receiverName: string,
    airlineWarehouse: string,
    condition: 'INTACT_SEAL' | 'MINOR_TEAR' | 'DAMAGED_CRUSHED',
    signatureText: string
  ) => void;
  onOpenPrintModal?: (type: DocumentType, c?: Consignment) => void;
}

export const DOModal: React.FC<DOModalProps> = ({
  isOpen,
  onClose,
  consignment,
  currentUser,
  onIssueDO,
  onConfirmHandover,
  onOpenPrintModal,
}) => {
  const [sealNumber, setSealNumber] = useState('BC-SEAL-' + Math.floor(10000 + Math.random() * 90000));
  const [receiverName, setReceiverName] = useState('Olivia Brown (Warehouse Supv)');
  const [warehouseLocation, setWarehouseLocation] = useState('Warehouse Bay B - Airside Ramp');
  const [condition, setCondition] = useState<'INTACT_SEAL' | 'MINOR_TEAR' | 'DAMAGED_CRUSHED'>('INTACT_SEAL');
  const [signatureText, setSignatureText] = useState('VERIFIED_O_BROWN_E_SIG');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  if (!consignment) return null;

  const isAVSECApproved = consignment.avsecReview?.decision === 'APPROVED';
  const hasThreatHold = consignment.status === 'XRAY_HOLD' || consignment.status === 'XRAY_REJECTED';
  const isDOIssued = consignment.deliveryOrder?.status === 'ISSUED';
  const isDelivered = consignment.status === 'DELIVERED';

  // PRD v1.3 RBAC:
  // - Handler & Admin are authorized for Physical Seal & DO issuance
  // - Driver & Admin are authorized for Line 1 Handover & Proof of Handover (PoH)
  const canManageSealAndIssueDO = currentUser.role === 'HANDLER' || currentUser.role === 'ADMIN';
  const canConfirmHandover = currentUser.role === 'DRIVER' || currentUser.role === 'ADMIN';

  // Rule CR-01 Check
  const handleIssueDO = () => {
    if (!isAVSECApproved) {
      setErrorBanner('PRASYARAT KEAMANAN: DO tidak dapat diterbitkan sebelum mendapatkan konfirmasi kelayakan terbang (AVSEC Cleared)!');
      return;
    }
    if (hasThreatHold) {
      setErrorBanner('PELANGGARAN KONTROL: DO tidak dapat diterbitkan saat status penahanan X-Ray aktif!');
      return;
    }
    if (!canManageSealAndIssueDO) {
      setErrorBanner('Wewenang Terbatas: Pemasangan segel dan penerbitan DO wajib diotorisasi oleh Handler / Admin.');
      return;
    }
    setErrorBanner(null);
    onIssueDO(consignment.id, sealNumber);
  };

  // Rule CR-07 Check
  const handleConfirmHandover = () => {
    if (!isDOIssued) {
      setErrorBanner('PRASYARAT HANDOVER: Serah terima memerlukan Delivery Order resmi yang telah diterbitkan.');
      return;
    }
    if (!canConfirmHandover) {
      setErrorBanner('Wewenang Terbatas: Serah terima fisik dan tanda tangan digital ke gudang maskapai dilakukan oleh Driver / Admin.');
      return;
    }
    setErrorBanner(null);
    onConfirmHandover(consignment.id, receiverName, warehouseLocation, condition, signatureText);
  };

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
            className="bg-white rounded-2xl max-w-4xl w-full shadow-xl border border-slate-200/90 overflow-hidden relative z-10 flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="px-5 sm:px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">Delivery Order & Digital Proof of Handover</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  AWB {consignment.awbNumber}
                </span>
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md ${
                  isDOIssued ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30' : 'bg-slate-700 text-slate-300'
                }`}>
                  {isDOIssued ? 'DO # ' + consignment.deliveryOrder?.doNumber : 'STATUS: DRAFT DO'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Aviation Cargo Security & Handover Standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Banner */}
        {errorBanner && (
          <div className="px-6 py-3 bg-rose-50 border-b border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2 shrink-0">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorBanner}</span>
          </div>
        )}

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Printable Official Delivery Order Document Replica */}
          <div className="bg-white rounded-2xl border-2 border-slate-300 p-6 shadow-sm relative overflow-hidden font-sans">
            {/* Watermark for Draft vs Issued */}
            {!isDOIssued && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                <span className="text-8xl font-black rotate-[-25deg] text-slate-900 uppercase">
                  DRAFT ONLY
                </span>
              </div>
            )}

            {/* Document Header */}
            <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 shadow-xs">
                  <img src="/logo.png" alt="Gatrans" className="w-7 h-7 rounded-full object-contain" />
                </div>
                <div>
                  <h2 className="text-base font-black tracking-tight text-slate-900 uppercase">
                    GATRANS MANAGEMENT OPERATIONS SYSTEM · DELIVERY ORDER (DO)
                  </h2>
                  <p className="text-[11px] text-slate-500 font-mono">
                    ICAO Annex 17 Security Regulated Agent · Reg ID: RA-CGK-0012
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase font-mono text-slate-400 font-semibold block">Document No.</span>
                <span className="text-base font-extrabold font-mono text-slate-900">
                  {consignment.deliveryOrder?.doNumber || 'DO-DRAFT-PRE-ISSUE'}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Version: v{consignment.deliveryOrder?.version || 1}
                </span>
              </div>
            </div>

            {/* Consignment Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-200 text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Air Waybill (AWB)</span>
                <span className="font-mono font-bold text-slate-900">{consignment.awbNumber}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Flight & Destination</span>
                <span className="font-mono font-bold text-slate-900">{consignment.flightNo} ➔ {consignment.destination}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Carrier</span>
                <span className="font-semibold text-slate-900">{consignment.airline}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Customs Seal #</span>
                <span className="font-mono font-bold text-blue-700">
                  {consignment.deliveryOrder?.customsSealNo || sealNumber}
                </span>
              </div>
            </div>

            {/* Shipper & Consignee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 border-b border-slate-200 text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Shipper / Consignor</span>
                <span className="font-semibold text-slate-900">{consignment.shipper}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">{consignment.natureOfGoods}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Consignee</span>
                <span className="font-semibold text-slate-900">{consignment.consignee}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">{consignment.specialHandling}</p>
              </div>
            </div>

            {/* Piece Summary & Security Stamps */}
            <div className="py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Pieces</span>
                  <span className="font-mono font-extrabold text-slate-900 text-sm">
                    {consignment.totalReceivedPieces} / {consignment.totalDeclaredPieces} Units
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Gross Weight</span>
                  <span className="font-mono font-extrabold text-slate-900 text-sm">
                    {consignment.totalWeightKg} KG
                  </span>
                </div>
              </div>

              {/* AVSEC Approval Stamp Box */}
              <div className={`p-3 rounded-xl border-2 text-center text-xs ${
                isAVSECApproved
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                  : 'border-rose-400 bg-rose-50 text-rose-900'
              }`}>
                <div className="flex items-center justify-center gap-1 font-bold text-[11px] uppercase">
                  {isAVSECApproved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                  <span>{isAVSECApproved ? 'AVSEC SECURITY CLEARED' : 'SECURITY CLEARANCE PENDING'}</span>
                </div>
                {consignment.avsecReview && (
                  <p className="text-[10px] font-mono mt-0.5 font-semibold text-emerald-700">
                    Stamp: {consignment.avsecReview.securityStampNo}
                  </p>
                )}
              </div>
            </div>

            {/* Signatures Row */}
            <div className="pt-4 grid grid-cols-2 gap-6 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                  Airside Dispatch Officer (Issuer)
                </span>
                <span className="font-bold text-slate-900">
                  {consignment.deliveryOrder?.dispatcherName || currentUser.name}
                </span>
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  Issued: {consignment.deliveryOrder?.issuedAt || 'Pending Issue'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                  Airline Warehouse Receiver
                </span>
                <span className="font-bold text-slate-900">
                  {consignment.proofOfHandover?.receivedBy || 'Awaiting Ramp Transfer'}
                </span>
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  Handover: {consignment.proofOfHandover?.handoverTime || 'Not yet completed'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Module 1: Dispatch Officer DO Issuance (CR-01 & CR-05) */}
          {!isDOIssued ? (
            <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Issue Official Delivery Order</h4>
                  <p className="text-xs text-slate-500">
                    Converts Draft DO into legal Dispatch Authorization. Requires AVSEC clearance.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-indigo-200 text-indigo-900">
                  Role: Handler / Admin
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Customs Security Seal Number</label>
                  <input
                    type="text"
                    value={sealNumber}
                    onChange={(e) => setSealNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold"
                  />
                </div>
                <div className="sm:pt-5">
                  <button
                    onClick={handleIssueDO}
                    disabled={!canManageSealAndIssueDO || !isAVSECApproved}
                    className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Stamp className="w-4 h-4" />
                    <span>Issue Delivery Order (DO)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Action Module 2: Warehouse Handover & Digital Proof of Handover (FR-10 & CR-07) */
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Digital Proof of Handover (PoH) Verification</h4>
                  <p className="text-xs text-slate-500">
                    Consignment only marked DELIVERED after physical warehouse piece reconciliation.
                  </p>
                </div>
                {isDelivered ? (
                  <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold">
                    PoH #{consignment.proofOfHandover?.proofNo}
                  </span>
                ) : (
                  <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                    Awaiting Handover Signoff
                  </span>
                )}
              </div>

              {!isDelivered ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Airline Warehouse Receiver</label>
                      <input
                        type="text"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Transfer Bay Location</label>
                      <input
                        type="text"
                        value={warehouseLocation}
                        onChange={(e) => setWarehouseLocation(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Cargo Condition</label>
                      <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                      >
                        <option value="INTACT_SEAL">Intact Seal - Zero Damage</option>
                        <option value="MINOR_TEAR">Minor Surface Tear (Documented)</option>
                        <option value="DAMAGED_CRUSHED">Damaged / Crushed (Hold Exception)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Digital Signature Code</label>
                      <input
                        type="text"
                        value={signatureText}
                        onChange={(e) => setSignatureText(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="text-xs">
                      {!canConfirmHandover ? (
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" />
                          Wewenang Terbatas: Tanda tangan serah terima gudang maskapai wajib oleh Driver / Admin.
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono text-[11px]">
                          Driver/Petugas bertugas: {currentUser.name} ({currentUser.role})
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleConfirmHandover}
                      disabled={!canConfirmHandover}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      <PenTool className="w-4 h-4" />
                      <span>Confirm Handover & Generate Proof (PoH)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Proof Number:</span>
                    <span className="font-bold text-slate-900">{consignment.proofOfHandover?.proofNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Handed Over At:</span>
                    <span>{consignment.proofOfHandover?.handoverTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Receiver:</span>
                    <span>{consignment.proofOfHandover?.receivedBy} ({consignment.proofOfHandover?.airlineWarehouse})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Verified Pieces:</span>
                    <span className="font-bold text-emerald-700">
                      {consignment.proofOfHandover?.actualPieces} / {consignment.proofOfHandover?.plannedPieces} Reconciled
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Official Aviation Document · Aviation Security & Dispatch</span>
          </div>
          <div className="flex items-center gap-2">
            {onOpenPrintModal && (
              <>
                <button
                  type="button"
                  onClick={() => onOpenPrintModal('DELIVERY_ORDER', consignment)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-300" />
                  <span>Cetak DO (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenPrintModal('POH_BTB', consignment)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak BTB / PoH</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
);
};
