import React, { useState } from 'react';
import { Consignment, UserProfile, XRayResult } from '../../types/cargo';
import {
  ScanLine,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  Info,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Language } from '../../i18n/translations';
import { motion } from 'motion/react';

interface XRayViewProps {
  consignments: Consignment[];
  currentUser: UserProfile;
  currentLang: Language;
  onSelectConsignment: (c: Consignment) => void;
  onOpenXRayModal: (c: Consignment) => void;
  onRecordResult: (consignmentId: string, result: XRayResult, notes: string, threat?: string) => void;
}

export const XRayView: React.FC<XRayViewProps> = ({
  consignments,
  currentUser,
  currentLang,
  onSelectConsignment,
  onOpenXRayModal,
  onRecordResult,
}) => {
  // Consignments queue for X-ray
  const awaitingXray = consignments.filter(
    (c) => c.status === 'AWAITING_XRAY' || c.status === 'RECEIVED'
  );
  const inHold = consignments.filter(
    (c) => c.status === 'XRAY_HOLD' || c.status === 'XRAY_REVIEW_REQUIRED'
  );
  const passedXray = consignments.filter(
    (c) => c.status === 'AWAITING_AVSEC' || c.status === 'AVSEC_APPROVED' || c.status === 'DO_ISSUED' || c.status === 'DELIVERED'
  );

  const [activeQueueTab, setActiveQueueTab] = useState<'AWAITING' | 'HOLD' | 'PASSED'>('AWAITING');

  // Currently inspected item in the simulated viewer
  const [selectedForSim, setSelectedForSim] = useState<Consignment>(
    awaitingXray[0] || consignments[0]
  );
  const [densityFilter, setDensityFilter] = useState<'STANDARD' | 'ORGANIC' | 'INORGANIC' | 'DENSE'>('STANDARD');
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [threatClass, setThreatClass] = useState('None');

  const currentList =
    activeQueueTab === 'AWAITING'
      ? awaitingXray
      : activeQueueTab === 'HOLD'
      ? inHold
      : passedXray;

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
              {currentLang === 'id' ? 'Stasiun Pemeriksaan X-Ray Dual-View' : 'Dual-View X-Ray Screening Tunnel'}
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono">
              Tunnel 01 · HI-SCAN 100100V
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentLang === 'id'
              ? 'Pemeriksaan radiasi multi-energi, identifikasi material organik/anorganik, dan standar keamanan terkalibrasi.'
              : 'Multi-energy dual-view inspection, organic/inorganic identification, and calibrated security standard.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Sensor Radiasi Kalibrasi Aktif</span>
          </div>
        </div>
      </div>

      {/* Main Dual-View Simulator & Control Center - Solid Dark Theme */}
      {selectedForSim && (
        <div className="p-5 bg-slate-900 rounded-2xl text-white border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-stretch gap-6">
            {/* Visual X-Ray Screen Canvas Simulator */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-emerald-400 font-bold">VIEW-A (TOP) & VIEW-B (SIDE)</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-300">AWB: {selectedForSim.awbNumber}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono border border-blue-400/30">
                    {selectedForSim.totalReceivedPieces} Koli Terpindai
                  </span>
                </div>
              </div>

              {/* Simulated Dual-View Canvas with Laser Animation */}
              <div className="relative mt-3 h-56 sm:h-64 rounded-2xl bg-[#090d16] border border-slate-700 flex items-center justify-center overflow-hidden">
                {/* Laser sweep animation line */}
                <div className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-laser z-20 pointer-events-none" />

                {/* Grid Overlay */}
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Simulated Cargo X-Ray silhouettes */}
                <div className="relative z-10 flex items-center justify-center gap-8 px-6 text-center">
                  <div className="p-4 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-950/20 flex flex-col items-center">
                    <Layers className="w-10 h-10 text-cyan-400 mb-2 animate-pulse" />
                    <span className="text-[11px] font-mono text-cyan-300 font-bold">VIEW A: Top Perspective</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Dual Matrix Sensor 160kV</span>
                  </div>

                  <div className="p-4 rounded-xl border border-dashed border-indigo-500/40 bg-indigo-950/20 flex flex-col items-center">
                    <ScanLine className="w-10 h-10 text-indigo-400 mb-2 animate-pulse" />
                    <span className="text-[11px] font-mono text-indigo-300 font-bold">VIEW B: Lateral Angle</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Penetration 35mm Steel</span>
                  </div>
                </div>

                {/* Filter indicator */}
                <div className="absolute bottom-2 left-3 z-20 text-[10px] font-mono text-slate-400 flex items-center gap-2">
                  <span className="text-cyan-400">Filter Aktif:</span>
                  <span className="uppercase text-white font-bold">{densityFilter}</span>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                <span className="text-slate-400 text-[11px] mr-1">Spektrum Energi:</span>
                {(['STANDARD', 'ORGANIC', 'INORGANIC', 'DENSE'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDensityFilter(mode)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                      densityFilter === mode
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Operator Decision Action Card */}
            <div className="w-full lg:w-80 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="font-bold text-slate-200">Keputusan X-Ray Operator</span>
                  <span className="text-[10px] font-mono text-emerald-400">{currentUser.name}</span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Klasifikasi Ancaman:</span>
                    <select
                      value={threatClass}
                      onChange={(e) => setThreatClass(e.target.value)}
                      className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="None">None (Aman / Clear)</option>
                      <option value="WEAPONS">Senjata / Logam Tajam (Weapons)</option>
                      <option value="EXPLOSIVES">Bahan Peledak / IED (Explosives)</option>
                      <option value="ORGANIC_DENSE">Massa Organik Padat (Dense Organic)</option>
                      <option value="SHIELDED_LEAD">Timbal / Logam Pelindung (Shielded)</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Catatan Operator:</span>
                    <textarea
                      value={inspectionNotes}
                      onChange={(e) => setInspectionNotes(e.target.value)}
                      placeholder="Masukkan catatan pemeriksaan dual-view sesuai SOP..."
                      rows={2}
                      className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Decision Buttons (PASS, HOLD, REJECT) */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    onRecordResult(selectedForSim.id, 'PASS', inspectionNotes || 'Lolos pemeriksaan dual-view');
                    setInspectionNotes('');
                  }}
                  className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer flex flex-col items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PASS</span>
                </button>

                <button
                  onClick={() => {
                    onRecordResult(
                      selectedForSim.id,
                      'HOLD',
                      inspectionNotes || 'Ditahan untuk pemeriksaan fisik sekunder',
                      threatClass
                    );
                    setInspectionNotes('');
                  }}
                  className="py-2.5 px-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-xs hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer flex flex-col items-center justify-center gap-1"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>HOLD</span>
                </button>

                <button
                  onClick={() => {
                    onRecordResult(
                      selectedForSim.id,
                      'REJECT',
                      inspectionNotes || 'Barang ditolak karena terindikasi DGR / Terlarang',
                      threatClass
                    );
                    setInspectionNotes('');
                  }}
                  className="py-2.5 px-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-xs hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer flex flex-col items-center justify-center gap-1"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>REJECT</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Queue Tabs & Listing */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {(['AWAITING', 'HOLD', 'PASSED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveQueueTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeQueueTab === tab
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'AWAITING' && `Antrean Screening (${awaitingXray.length})`}
                {tab === 'HOLD' && `Ditahan / Triage (${inHold.length})`}
                {tab === 'PASSED' && `Lolos X-Ray (${passedXray.length})`}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-mono">
            SOP: Semua koli wajib 100% dipindai sebelum AVSEC stamp
          </span>
        </div>

        {/* Queue Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
          {currentList.map((c) => {
            const isSelected = selectedForSim?.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedForSim(c)}
                className={`p-4 rounded-xl border text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/20'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1.5">
                  <span className="font-mono text-sm">{c.awbNumber}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {c.flightNo}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 space-y-0.5 mb-2.5">
                  <div>
                    <span className="text-slate-400">Maskapai:</span> {c.airline} → {c.destination}
                  </div>
                  <div>
                    <span className="text-slate-400">Koli:</span> {c.totalReceivedPieces} koli (
                    {c.totalWeightKg} kg)
                  </div>
                  <div>
                    <span className="text-slate-400">Komoditas:</span> {c.natureOfGoods}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400">ID: {c.id}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenXRayModal(c);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] transition-colors cursor-pointer"
                  >
                    Buka Inspeksi ↗
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
