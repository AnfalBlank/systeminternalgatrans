import React, { useState } from 'react';
import { Consignment, UserProfile } from '../../types/cargo';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  Send,
  Building2,
  Stamp,
  Download,
  FileCheck2,
  ChevronRight,
} from 'lucide-react';
import { Language } from '../../i18n/translations';
import { motion } from 'motion/react';

interface HandoverViewProps {
  consignments: Consignment[];
  currentUser: UserProfile;
  currentLang: Language;
  onSelectConsignment: (c: Consignment) => void;
  onOpenDOModal: (c: Consignment) => void;
  onIssueDO: (consignmentId: string, customSealNo: string) => void;
  onConfirmHandover: (
    consignmentId: string,
    receiverName: string,
    warehouse: string,
    condition: any,
    signature: string
  ) => void;
}

export const HandoverView: React.FC<HandoverViewProps> = ({
  consignments,
  currentUser,
  currentLang,
  onSelectConsignment,
  onOpenDOModal,
  onIssueDO,
  onConfirmHandover,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'DO_QUEUE' | 'HANDOVER_QUEUE' | 'DELIVERED_POH'>(
    'DO_QUEUE'
  );

  // Ready for DO (AVSEC Approved, DO status DRAFT or not issued yet)
  const readyForDO = consignments.filter(
    (c) => (c.status === 'AVSEC_APPROVED' || c.status === 'DO_DRAFT') && c.deliveryOrder?.status !== 'ISSUED'
  );

  // Ready for Handover (DO is ISSUED, awaiting airline warehouse receipt)
  const readyForHandover = consignments.filter(
    (c) => c.status === 'DO_ISSUED' || c.status === 'AWAITING_WAREHOUSE_HANDOVER'
  );

  // Delivered with PoH
  const deliveredList = consignments.filter(
    (c) => c.status === 'DELIVERED' && c.proofOfHandover !== undefined
  );

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
              {currentLang === 'id'
                ? 'Penerbitan Delivery Order (DO) & Serah Terima Gudang'
                : 'Delivery Order (DO) & Airline Warehouse Handover'}
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono">
              DO Terbit & Serah Terima Lini 1
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentLang === 'id'
              ? 'Verifikasi draft DO dengan segel Bea Cukai. Serah terima fisik kargo dengan Bukti Digital (PoH).'
              : 'Verify draft DO with Customs Seal. Physical handover to airline cargo terminal with Digital PoH.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-slate-100 rounded-xl text-slate-700 border border-slate-200">
            Dispatcher: {currentUser.name}
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveSubTab('DO_QUEUE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'DO_QUEUE'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Stamp className="w-4 h-4" />
          <span>Antrean Penerbitan DO ({readyForDO.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('HANDOVER_QUEUE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'HANDOVER_QUEUE'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Serah Terima Maskapai ({readyForHandover.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('DELIVERED_POH')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'DELIVERED_POH'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Arsip Digital PoH ({deliveredList.length})</span>
        </button>
      </div>

      {/* View Content based on Sub-Tab */}
      {activeSubTab === 'DO_QUEUE' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="font-bold">Prasyarat Keamanan Terpenuhi:</p>
              <p className="text-[11px] text-blue-700 mt-0.5">
                Konsinyasi di bawah telah mengantongi validasi AVSEC resmi dan lolos 100% pemeriksaan X-Ray. Dispatch
                Officer dapat memverifikasi segel Bea Cukai dan menerbitkan DO resmi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readyForDO.map((c) => (
              <div
                key={c.id}
                className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-mono text-sm font-bold text-slate-900">{c.awbNumber}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                      DO DRAFT
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Penerbangan:</span>
                      <span className="font-semibold text-slate-800">
                        {c.airline} · {c.flightNo}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tujuan:</span>
                      <span className="font-bold text-blue-700">{c.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Koli / Berat:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {c.totalReceivedPieces} koli · {c.totalWeightKg} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">AVSEC Stamp:</span>
                      <span className="font-mono text-[11px] text-purple-700">
                        {c.avsecReview?.securityStampNo || 'AVSEC-OK'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectConsignment(c);
                      onOpenDOModal(c);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Stamp className="w-3.5 h-3.5" />
                    <span>Verifikasi & Terbitkan DO ↗</span>
                  </button>
                </div>
              </div>
            ))}

            {readyForDO.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-600">Tidak ada draft DO yang menunggu penerbitan.</p>
                <p className="text-xs text-slate-400 mt-0.5">Semua kargo yang disetujui AVSEC telah diproses.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'HANDOVER_QUEUE' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 text-xs text-cyan-900 flex items-center gap-3">
            <Building2 className="w-5 h-5 text-cyan-600 shrink-0" />
            <div>
              <p className="font-bold">Proses Serah Terima Fisik Gudang Maskapai:</p>
              <p className="text-[11px] text-cyan-700 mt-0.5">
                Pindai setiap koli fisik secara individual terhadap manifest DO. Periksa segel utuh dan rekam tanda
                tangan digital staf gudang maskapai untuk menerbitkan Bukti Digital PoH.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readyForHandover.map((c) => (
              <div
                key={c.id}
                className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-mono text-sm font-bold text-slate-900">{c.awbNumber}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-bold border border-cyan-200">
                      DO ISSUED
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nomor DO:</span>
                      <span className="font-mono font-bold text-slate-900">{c.deliveryOrder?.doNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Segel Bea Cukai:</span>
                      <span className="font-mono text-emerald-700 font-bold">
                        {c.deliveryOrder?.customsSealNo || 'BC-SEAL-VERIFIED'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gudang Maskapai:</span>
                      <span className="font-semibold text-slate-800">{c.airline} Warehouse</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Koli Siap Handover:</span>
                      <span className="font-mono font-bold text-slate-900">{c.totalReceivedPieces} Koli</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectConsignment(c);
                      onOpenDOModal(c);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Mulai Handover & Tanda Tangan PoH ↗</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'DELIVERED_POH' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase font-mono">
                    <th className="py-3 px-4 sm:px-6">Bukti PoH #</th>
                    <th className="py-3 px-4">AWB & Nomor DO</th>
                    <th className="py-3 px-4">Penerima Gudang</th>
                    <th className="py-3 px-4">Koli Fisik</th>
                    <th className="py-3 px-4">Status Segel</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Tanda Tangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {deliveredList.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-blue-700">
                        {c.proofOfHandover?.proofNo || `POH-${c.id}`}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-semibold text-slate-900">{c.awbNumber}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{c.deliveryOrder?.doNumber}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{c.proofOfHandover?.receivedBy}</div>
                        <div className="text-[10px] text-slate-400">{c.proofOfHandover?.airlineWarehouse}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {c.proofOfHandover?.actualPieces} / {c.proofOfHandover?.plannedPieces} Koli
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {c.proofOfHandover?.conditionStatus === 'INTACT_SEAL' ? 'Segel Utuh (Intact)' : 'Terkontrol'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right font-mono text-emerald-700 font-bold">
                        {c.proofOfHandover?.digitalSignature ? `Signed: ${c.proofOfHandover.digitalSignature}` : 'Verified ✓'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
