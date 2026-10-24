import React, { useState } from 'react';
import {
  Clock,
  X,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  FileText,
  Shield,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ShiftHandover, UserProfile } from '../types/cargo';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  shiftData: ShiftHandover;
  currentUser: UserProfile;
  onAcknowledgeShift: (supervisorName: string) => void;
}

export const ShiftModal: React.FC<ShiftModalProps> = ({
  isOpen,
  onClose,
  shiftData,
  currentUser,
  onAcknowledgeShift,
}) => {
  const [acknowledged, setAcknowledged] = useState(shiftData.status === 'ACKNOWLEDGED');

  const isSupervisor = currentUser.role === 'ADMIN' || currentUser.role === 'CHECKER' || Boolean(currentUser.id);

  const handleSign = () => {
    onAcknowledgeShift(currentUser.name);
    setAcknowledged(true);
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
            className="bg-white rounded-2xl max-w-3xl w-full shadow-xl border border-slate-200/90 overflow-hidden relative z-10 flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="px-5 sm:px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">Shift Handover & Operational Logbook</h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {shiftData.shiftCode}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Operational Continuity of In-Flight Security Cases & Exceptions
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
          {/* Shift Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Accepted Cargo</span>
              <span className="text-xl font-bold font-mono text-slate-900">{shiftData.summary.totalAccepted} AWB</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">X-Ray Screened</span>
              <span className="text-xl font-bold font-mono text-emerald-600">{shiftData.summary.totalXrayed} Consignments</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Open Exceptions</span>
              <span className="text-xl font-bold font-mono text-rose-600">{shiftData.summary.openExceptionsCount} Cases</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">DOs Issued</span>
              <span className="text-xl font-bold font-mono text-indigo-600">{shiftData.summary.totalDoIssued} DOs</span>
            </div>
          </div>

          {/* Handover Log Notes */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Outgoing Supervisor Operational Briefing
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">{shiftData.handoverNotes}</p>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono mt-3 pt-2 border-t border-slate-200">
              <span>Outgoing: {shiftData.outgoingSupervisor}</span>
              <span>Incoming: {shiftData.incomingSupervisor}</span>
              <span>Station: {shiftData.station}</span>
            </div>
          </div>

          {/* Unresolved Work Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Unresolved Items Carried Over (Mandatory Tracking)
              </h4>
              <span className="text-[10px] font-mono text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Active Cases Remain Open
              </span>
            </div>

            <div className="space-y-2">
              {shiftData.openItems.map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{item.refId}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-1.5 py-0.2 rounded">
                          {item.refType}
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium text-[11px] mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200 block">
                      {item.actionRequired}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supervisor Acknowledgment Box */}
          <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-xs text-slate-900">Shift Handover Acknowledgment</h4>
              <p className="text-xs text-slate-500">
                Incoming supervisor verifies all threat holds and open exception custody.
              </p>
            </div>

            {acknowledged ? (
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Shift Acknowledged by {currentUser.name}</span>
              </div>
            ) : (
              <button
                onClick={handleSign}
                disabled={!isSupervisor}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Acknowledge & Sign Logbook</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Continuous Shift Accountability & Custody Standards</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Logbook
          </button>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
);
};
