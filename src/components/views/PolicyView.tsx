import React from 'react';
import { Shield, Clock, BookOpen, CheckCircle2, Lock, Users, Plane } from 'lucide-react';
import { Language } from '../../i18n/translations';
import { motion } from 'motion/react';

interface PolicyViewProps {
  currentLang: Language;
}

export const PolicyView: React.FC<PolicyViewProps> = ({ currentLang }) => {
  const slaPolicies = [
    { gate: 'Gate 1: Intake & Barcode', target: '15 Menit', warn: '10 Menit', desc: 'Scan barcode & CSD verification' },
    { gate: 'Gate 2: Pemeriksaan X-Ray', target: '25 Menit', warn: '18 Menit', desc: 'Dual-view multi-energy screening' },
    { gate: 'Gate 3: Validasi AVSEC', target: '30 Menit', warn: '20 Menit', desc: 'Snapshot binding & security stamp' },
    { gate: 'Gate 4: Penerbitan DO', target: '45 Menit', warn: '30 Menit', desc: 'Customs seal check before flight cutoff' },
    { gate: 'Gate 5: Handover Gudang', target: '30 Menit', warn: '20 Menit', desc: 'Piece count & digital PoH sign-off' },
  ];

  const sodMatrix = [
    { role: 'Receiving Admin', canScan: '✓', canXray: '✗', canAvsec: '✗', canDO: '✗', canHandover: '✗' },
    { role: 'X-Ray Operator', canScan: '✓', canXray: '✓', canAvsec: '✗', canDO: '✗', canHandover: '✗' },
    { role: 'AVSEC Officer', canScan: '✗', canXray: 'Review', canAvsec: '✓', canDO: '✗', canHandover: '✗' },
    { role: 'Dispatch Officer', canScan: '✗', canXray: '✗', canAvsec: '✗', canDO: '✓', canHandover: '✓' },
    { role: 'Warehouse Receiver', canScan: '✗', canXray: '✗', canAvsec: '✗', canDO: '✗', canHandover: '✓' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {currentLang === 'id' ? 'SOP, Kebijakan SLA & Pemisahan Wewenang' : 'SOP, SLA Policy & Separation of Duties'}
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-mono">
              Regulasi Keamanan Penerbangan
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentLang === 'id'
              ? 'Standar operasional prosedur kargo udara bandara (ICAO Annex 17) & batasan kewenangan sistem.'
              : 'Airport air cargo security SOPs (ICAO Annex 17) and system segregation of duties boundaries.'}
          </p>
        </div>
      </div>

      {/* SLA Policy Grid */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Target Batas Waktu Operasional (SLA Thresholds):</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">Standar SLA</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {slaPolicies.map((p, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-900 block">{p.gate}</span>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Target SLA:</span>
                  <span className="font-mono font-bold text-blue-600">{p.target}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Warning:</span>
                  <span className="font-mono font-bold text-amber-600">{p.warn}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Separation of Duties (SoD) Matrix */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-600" />
            <span>Matriks Pemisahan Wewenang (Pemisahan Wewenang Otentik):</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">Strict RBAC</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase font-mono">
                <th className="py-2.5 px-3">Role Petugas</th>
                <th className="py-2.5 px-3 text-center">Scan Masuk</th>
                <th className="py-2.5 px-3 text-center">X-Ray Operator</th>
                <th className="py-2.5 px-3 text-center">AVSEC Approval</th>
                <th className="py-2.5 px-3 text-center">Penerbitan DO</th>
                <th className="py-2.5 px-3 text-center">Serah Terima Gudang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sodMatrix.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 font-medium">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{r.role}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-600">{r.canScan}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-600">{r.canXray}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-purple-600">{r.canAvsec}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-indigo-600">{r.canDO}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">{r.canHandover}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
