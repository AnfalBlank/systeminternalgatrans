import React, { useState } from 'react';
import { Consignment, UserProfile } from '../../types/cargo';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  FileCheck,
  Award,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Language } from '../../i18n/translations';
import { motion } from 'motion/react';

interface AvsecViewProps {
  consignments: Consignment[];
  currentUser: UserProfile;
  currentLang: Language;
  onSelectConsignment: (c: Consignment) => void;
  onOpenXRayModal: (c: Consignment) => void;
  onRecordAVSECDecision: (
    consignmentId: string,
    decision: 'APPROVED' | 'REJECTED' | 'HELD_FOR_SECONDARY',
    reason: string
  ) => void;
}

export const AvsecView: React.FC<AvsecViewProps> = ({
  consignments,
  currentUser,
  currentLang,
  onSelectConsignment,
  onOpenXRayModal,
  onRecordAVSECDecision,
}) => {
  const [selectedConsignmentId, setSelectedConsignmentId] = useState<string | null>(
    consignments.find((c) => c.status === 'AWAITING_AVSEC')?.id || consignments[0]?.id || null
  );
  const [decisionReason, setDecisionReason] = useState('');

  const awaitingAvsec = consignments.filter((c) => c.status === 'AWAITING_AVSEC');
  const approvedAvsec = consignments.filter(
    (c) => c.status === 'AVSEC_APPROVED' || c.status === 'DO_ISSUED' || c.status === 'DELIVERED'
  );
  const heldOrRejected = consignments.filter(
    (c) => c.status === 'AVSEC_REJECTED_OR_HELD' || c.status === 'XRAY_HOLD'
  );

  const selectedConsignment = consignments.find((c) => c.id === selectedConsignmentId);

  const [avsecOfficerName, setAvsecOfficerName] = useState('Hendra Wijaya (Inspektur AVSEC Angkasa Pura)');
  const [stampNo, setStampNo] = useState(`AVSEC-CGK-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [attachmentRef, setAttachmentRef] = useState('FORM-TTD-AVSEC-4401.pdf');

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
              {currentLang === 'id' ? 'Pencatatan Konfirmasi AVSEC (Kelayakan Terbang)' : 'AVSEC Security Confirmation Desk'}
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono">
              Otoritas Keamanan Bandara
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentLang === 'id'
              ? 'AVSEC adalah otoritas eksternal. Checker/Admin mencatat referensi bukti tanda tangan kelayakan terbang (Fit to Fly) terikat versi snapshot.'
              : 'AVSEC is an external authority. Checker/Admin records the official signature proof of fit-to-fly bound to the data snapshot.'}
          </p>
        </div>

        {/* Security Officer Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-purple-50 border border-purple-200 rounded-xl text-xs font-semibold text-purple-700">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>Pencatat: {currentUser.name} ({currentUser.roleLabel})</span>
        </div>
      </div>

      {/* Main Review Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Awaiting AVSEC List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900">Antrean Validasi ({awaitingAvsec.length})</span>
            <span className="text-[10px] font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold">
              X-Ray Pass Required
            </span>
          </div>

          <div className="mt-3 space-y-2.5 max-h-[560px] overflow-y-auto">
            {awaitingAvsec.map((c) => {
              const isSelected = selectedConsignmentId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedConsignmentId(c.id)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50/50 shadow-xs ring-1 ring-purple-500/30'
                      : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span className="font-mono text-sm">{c.awbNumber}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                      v{c.dataVersion}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <div>
                      {c.airline} · {c.flightNo} → {c.destination}
                    </div>
                    <div>
                      {c.totalReceivedPieces} koli ({c.totalWeightKg} kg)
                    </div>
                  </div>
                </div>
              );
            })}

            {awaitingAvsec.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                <p className="text-xs font-semibold text-slate-600">Semua antrean AVSEC telah diproses!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Tidak ada koli tertahan di triage keamanan.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 2 columns: Snapshot Review Card & Action */}
        <div className="lg:col-span-2 space-y-5">
          {selectedConsignment ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-5">
              {/* Snapshot header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold text-slate-900">{selectedConsignment.awbNumber}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      Snapshot v{selectedConsignment.dataVersion}.0
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedConsignment.airline} · Penerbangan {selectedConsignment.flightNo} ke{' '}
                    {selectedConsignment.destination}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenXRayModal(selectedConsignment)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Inspeksi X-Ray ↗</span>
                  </button>
                </div>
              </div>

              {/* Data Audit Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Total Koli Fisik</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedConsignment.totalReceivedPieces} Koli
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Berat Bruto</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedConsignment.totalWeightKg} kg</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Verifikasi CSD</span>
                  <p className="text-sm font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Terverifikasi</span>
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Hasil X-Ray</span>
                  <p className="text-sm font-bold text-blue-600 mt-0.5">
                    {selectedConsignment.xrayInspections[0]?.result || 'PASS'}
                  </p>
                </div>
              </div>

              {/* Shipper & Consignee info */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Pengirim (Shipper)</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedConsignment.shipper}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Komoditas: {selectedConsignment.natureOfGoods}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Penerima (Consignee)</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedConsignment.consignee}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tujuan Akhir: Bandara Internasional {selectedConsignment.destination}
                  </p>
                </div>
              </div>

              {/* AVSEC Decision Form */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 leading-relaxed">
                  <strong>Prosedur Keamanan Bandara:</strong> AVSEC menandatangani dokumen fisik kelayakan terbang di luar sistem. Checker mencatat referensi stempel, nama petugas AVSEC, dan nomor bukti ke sistem.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nama Petugas AVSEC (Otoritas Eksternal):
                    </label>
                    <input
                      type="text"
                      value={avsecOfficerName}
                      onChange={(e) => setAvsecOfficerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nomor Stempel / Dokumen AVSEC:
                    </label>
                    <input
                      type="text"
                      value={stampNo}
                      onChange={(e) => setStampNo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-purple-800 bg-purple-50/50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Referensi Berkas / Tanda Tangan Fisik (Lampiran Bukti):
                    </label>
                    <input
                      type="text"
                      value={attachmentRef}
                      onChange={(e) => setAttachmentRef(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">
                    {currentLang === 'id' ? 'Catatan Otorisasi / Alasan Keputusan:' : 'Authorization Notes / Decision Reason:'}
                  </label>
                  <textarea
                    value={decisionReason}
                    onChange={(e) => setDecisionReason(e.target.value)}
                    placeholder="Masukkan justifikasi pemeriksaan keamanan sesuai standar Avsec ICAO / Dirjen Perhubungan Udara..."
                    rows={2}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>

                {/* Authorization Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      onRecordAVSECDecision(
                        selectedConsignment.id,
                        'APPROVED',
                        decisionReason || `Disetujui Layak Terbang oleh ${avsecOfficerName}. Stempel: ${stampNo}. Bukti: ${attachmentRef}`
                      );
                      setDecisionReason('');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    <span>Catat Konfirmasi Layak Terbang (Fit-to-Fly)</span>
                  </button>

                  <button
                    onClick={() => {
                      onRecordAVSECDecision(
                        selectedConsignment.id,
                        'HELD_FOR_SECONDARY',
                        decisionReason || 'Ditahan untuk pemeriksaan fisik sekunder ETD'
                      );
                      setDecisionReason('');
                    }}
                    className="py-2.5 px-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs border border-amber-200 transition-colors cursor-pointer"
                  >
                    Tahan ETD (Hold)
                  </button>

                  <button
                    onClick={() => {
                      onRecordAVSECDecision(
                        selectedConsignment.id,
                        'REJECTED',
                        decisionReason || 'Ditolak: Pelanggaran regulasi keselamatan kargo udara'
                      );
                      setDecisionReason('');
                    }}
                    className="py-2.5 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold text-xs border border-rose-200 transition-colors cursor-pointer"
                  >
                    Tolak (Reject)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <ShieldCheck className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">Pilih konsinyasi dari antrean di sebelah kiri.</p>
            </div>
          )}

          {/* Approved Items Ready for DO Generation */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Konsinyasi AVSEC Approved (Siap Cetak DO)</span>
              <span className="text-[10px] font-mono text-purple-600 font-bold">{approvedAvsec.length} Kargo</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {approvedAvsec.slice(0, 4).map((c) => (
                <div key={c.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{c.awbNumber}</span>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Stamp: {c.avsecReview?.securityStampNo || 'AVSEC-CGK-2026-VAL'}
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
