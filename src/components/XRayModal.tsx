import React, { useState } from 'react';
import {
  ScanLine,
  X,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Layers,
  Eye,
  Camera,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Consignment, UserProfile, XRayResult } from '../types/cargo';

interface XRayModalProps {
  isOpen: boolean;
  onClose: () => void;
  consignment: Consignment | null;
  currentUser: UserProfile;
  onRecordXRayResult: (consignmentId: string, result: XRayResult, notes: string, threatClass?: string) => void;
  onRecordAVSECDecision: (consignmentId: string, decision: 'APPROVED' | 'REJECTED' | 'HELD_FOR_SECONDARY', reason: string) => void;
}

export const XRayModal: React.FC<XRayModalProps> = ({
  isOpen,
  onClose,
  consignment,
  currentUser,
  onRecordXRayResult,
  onRecordAVSECDecision,
}) => {
  const [selectedResult, setSelectedResult] = useState<XRayResult>('PASS');
  const [notes, setNotes] = useState('');
  const [threatClass, setThreatClass] = useState<string>('None');
  const [avsecReason, setAvsecReason] = useState('');
  const [viewAngle, setViewAngle] = useState<'top' | 'side' | 'dual'>('dual');

  if (!consignment) return null;

  // PRD v1.3 RBAC: Checker and Admin record official X-Ray operator results and AVSEC clearances
  const canRecordXRay = currentUser.role === 'CHECKER' || currentUser.role === 'ADMIN';
  const canRecordAVSEC = currentUser.role === 'CHECKER' || currentUser.role === 'ADMIN';

  const handleSaveXRay = () => {
    onRecordXRayResult(consignment.id, selectedResult, notes || 'Inspection completed according to SOP §4.3.', threatClass);
  };

  const handleSaveAVSEC = (decision: 'APPROVED' | 'REJECTED' | 'HELD_FOR_SECONDARY') => {
    onRecordAVSECDecision(
      consignment.id,
      decision,
      avsecReason || 'Compliant with ICAO Annex 17 and civil aviation security directives.'
    );
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
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">Dual-View X-Ray Screening & AVSEC Triage</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  AWB {consignment.awbNumber}
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  Data Version: v{consignment.dataVersion}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Smiths Detection HI-SCAN 100100V-2is · Dual Energy False-Color Spectrum
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Simulated Dual-View X-Ray Screen */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  TUNNEL 01: ACTIVE LIVE STREAM
                </span>
                <span className="text-slate-400 font-mono">Sens: 0.12mm Copper Wire</span>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800">
                <button
                  onClick={() => setViewAngle('dual')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                    viewAngle === 'dual' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Dual View (V1+V2)
                </button>
                <button
                  onClick={() => setViewAngle('top')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                    viewAngle === 'top' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Top View
                </button>
                <button
                  onClick={() => setViewAngle('side')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                    viewAngle === 'side' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Side View
                </button>
              </div>
            </div>

            {/* Simulated False-Color Visualizer Canvas */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* View 1: Top Projection */}
              {(viewAngle === 'dual' || viewAngle === 'top') && (
                <div className="h-56 bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded-xl border border-slate-800 p-4 relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>VIEW 1: VERTICAL TOP (90°)</span>
                    <span className="text-blue-400 font-semibold">Z-Effective: 7.4 (Organic/Mixed)</span>
                  </div>

                  {/* False Color Representation */}
                  <div className="flex-1 flex items-center justify-center relative">
                    {/* Simulated cargo wireframe with dual-energy colors */}
                    <div className="w-56 h-32 rounded-lg border-2 border-dashed border-cyan-500/50 relative bg-slate-900/40 p-2 flex items-center justify-around">
                      {/* Orange: Organic material / coffee / textile / liquids */}
                      <div className="w-20 h-20 rounded bg-gradient-to-br from-amber-500/70 to-orange-600/80 blur-2xs flex items-center justify-center text-[10px] text-white font-mono font-bold">
                        ORGANIC
                      </div>
                      {/* Green: Mixed / glass / light metals */}
                      <div className="w-14 h-24 rounded bg-gradient-to-br from-emerald-500/60 to-teal-600/70 blur-2xs flex items-center justify-center text-[9px] text-white font-mono font-bold">
                        CIRCUIT
                      </div>
                      {/* Blue: Dense metals / shielding / lead */}
                      <div className="w-12 h-16 rounded bg-gradient-to-br from-blue-500/80 to-indigo-700/90 blur-2xs flex items-center justify-center text-[9px] text-white font-mono font-bold">
                        METAL
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                    <span>Smiths HI-SCAN V1</span>
                    <span>Piece: #01 to #{consignment.totalReceivedPieces} Verified</span>
                  </div>
                </div>
              )}

              {/* View 2: Horizontal Side Projection */}
              {(viewAngle === 'dual' || viewAngle === 'side') && (
                <div className="h-56 bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded-xl border border-slate-800 p-4 relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>VIEW 2: HORIZONTAL SIDE (0°)</span>
                    <span className="text-emerald-400 font-semibold">Density: 1.42 g/cm³</span>
                  </div>

                  <div className="flex-1 flex items-center justify-center relative">
                    <div className="w-56 h-28 rounded-lg border-2 border-dashed border-indigo-500/50 relative bg-slate-900/40 p-2 flex items-center justify-around">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500/70 to-amber-600/80 blur-2xs flex items-center justify-center text-[9px] text-white font-mono font-bold">
                        CORE
                      </div>
                      <div className="w-24 h-18 rounded bg-gradient-to-br from-cyan-600/60 to-blue-700/80 blur-2xs flex items-center justify-center text-[9px] text-white font-mono font-bold">
                        SHIELD OK
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                    <span>Smiths HI-SCAN V2</span>
                    <span>False Color Palette: 4-Color High Contrast</span>
                  </div>
                </div>
              )}
            </div>

            {/* Spectrum Color Reference */}
            <div className="flex items-center justify-center gap-6 pt-3 mt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-orange-500" />
                Orange: Low-Z Organics (Plastics/Explosives/Foods)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                Green: Medium-Z Mixed (Aluminum/Glass/Silicon)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-600" />
                Blue: High-Z Inorganics (Steel/Copper/Gold)
              </span>
            </div>
          </div>

          {/* Section 1: X-Ray Operator Result Logging (FR-06) */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">X-Ray Operator Decision Recording</h4>
                <p className="text-xs text-slate-500">
                  Current Operator: {currentUser.name} ({currentUser.roleLabel})
                </p>
              </div>
              <span className="text-xs font-mono font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                Rule: Hold/Review ≠ Pass
              </span>
            </div>

            {/* Result Radio Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { val: 'PASS' as XRayResult, label: 'PASS (Clear)', bg: 'hover:border-emerald-500 text-emerald-800', active: 'border-emerald-600 bg-emerald-50 text-emerald-900' },
                { val: 'REVIEW_REQUIRED' as XRayResult, label: 'REVIEW REQ.', bg: 'hover:border-amber-500 text-amber-800', active: 'border-amber-600 bg-amber-50 text-amber-900' },
                { val: 'HOLD' as XRayResult, label: 'HOLD (Threat)', bg: 'hover:border-rose-500 text-rose-800', active: 'border-rose-600 bg-rose-50 text-rose-900' },
                { val: 'REJECT' as XRayResult, label: 'REJECT (Prohibited)', bg: 'hover:border-red-500 text-red-800', active: 'border-red-600 bg-red-50 text-red-900' },
              ].map((btn) => (
                <button
                  key={btn.val}
                  type="button"
                  onClick={() => setSelectedResult(btn.val)}
                  className={`p-3 rounded-xl border-2 text-xs font-bold text-center transition-all cursor-pointer ${
                    selectedResult === btn.val ? btn.active : `border-slate-200 bg-white ${btn.bg}`
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Operator Notes & Threat Class */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Threat Classification</label>
                <select
                  value={threatClass}
                  onChange={(e) => setThreatClass(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="None">None (Standard Verified Cargo)</option>
                  <option value="Organic Mass">Organic Mass Anomaly (High Density Core)</option>
                  <option value="Shielded Object">Shielded / Opaque Metal Chamber</option>
                  <option value="Battery/Hazmat">Lithium Battery / Uncertified Hazmat</option>
                  <option value="Unidentified">Unidentified Geometric Foreign Object</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inspection Notes / SOP Reference</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Dual energy density confirmed, seals checked..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs">
                {!canRecordXRay ? (
                  <span className="text-rose-600 font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    Wewenang Terbatas: Hanya Checker & Admin yang dapat mencatat hasil X-Ray.
                  </span>
                ) : (
                  <span className="text-slate-500 font-mono text-[11px]">
                    Operator terotorisasi: {currentUser.name} ({currentUser.role})
                  </span>
                )}
              </div>
              <button
                onClick={handleSaveXRay}
                disabled={!canRecordXRay}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Record X-Ray Inspection Result
              </button>
            </div>
          </div>

          {/* Section 2: AVSEC Formal Validation (FR-08 & CR-01) */}
          <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-700" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">AVSEC Official Security Validation</h4>
                  <p className="text-xs text-slate-500">
                    Mandatory prerequisite for Delivery Order issuance. Version-locked to Snapshot v{consignment.dataVersion}.
                  </p>
                </div>
              </div>

              {consignment.avsecReview ? (
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  Stamp: {consignment.avsecReview.securityStampNo}
                </span>
              ) : (
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                  AVSEC Decision Pending
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                AVSEC Officer Formal Assessment & Legal Basis
              </label>
              <input
                type="text"
                value={avsecReason}
                onChange={(e) => setAvsecReason(e.target.value)}
                placeholder="e.g. Certified Known Consignor verified; scan layers match CSD snapshot."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {canRecordAVSEC
                    ? 'Wewenang: Checker & Admin mencatat bukti konfirmasi AVSEC resmi.'
                    : 'Akses Dibatasi: Hanya Checker & Admin yang berwenang mencatat stempel AVSEC.'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSaveAVSEC('REJECTED')}
                  disabled={!canRecordAVSEC}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 cursor-pointer"
                >
                  Reject Consignment
                </button>
                <button
                  onClick={() => handleSaveAVSEC('HELD_FOR_SECONDARY')}
                  disabled={!canRecordAVSEC}
                  className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed text-amber-800 text-xs font-semibold rounded-xl border border-amber-200 cursor-pointer"
                >
                  Hold for Physical / K-9 ETD
                </button>
                <button
                  onClick={() => handleSaveAVSEC('APPROVED')}
                  disabled={!canRecordAVSEC}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Grant AVSEC Clearance</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="font-mono">Audit Hash: SHA256-V{consignment.dataVersion}-CNS-{consignment.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
);
};
