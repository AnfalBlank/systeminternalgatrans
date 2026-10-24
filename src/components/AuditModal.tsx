import React, { useState } from 'react';
import {
  History,
  X,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  FileCheck,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuditEvent } from '../types/cargo';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs: AuditEvent[];
}

export const AuditModal: React.FC<AuditModalProps> = ({ isOpen, onClose, auditLogs }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesType = filterType === 'ALL' || log.entityType === filterType;
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

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
                <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shadow-xs">
                  <History className="w-5 h-5" />
                </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">Immutable Audit Trail & Security Ledger</h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Audit Ledger
                </span>
              </div>
              <p className="text-xs text-slate-400">
                End-to-End Cryptographic Auditability · Unalterable Actor & Decision Logs
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

        {/* Filter Toolbar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by actor, action, AWB, or entity ID..."
              className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Domain:</span>
            {['ALL', 'XRAY', 'AVSEC', 'DO', 'HANDOVER'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterType === type ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Log Entries */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100">
          {filteredLogs.map((log) => (
            <div key={log.id} className="py-3.5 first:pt-0 last:pb-0 text-xs">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 text-[11px]">{log.occurredAt}</span>
                  <span className="font-mono font-bold text-slate-900">{log.action}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono">
                    {log.entityType}: {log.entityId}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <Lock className="w-3 h-3" />
                  <span className="font-mono">{log.correlationId}</span>
                </div>
              </div>

              <p className="text-slate-700 font-medium">{log.description}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                <span>Actor: {log.actor} ({log.role.replace(/_/g, ' ')})</span>
                <span>Audit ID: {log.id}</span>
                <span className="text-emerald-600 font-semibold">Security Control Met (P0)</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>CR-09: Tamper-proof event logs. System administrators cannot delete or mutate audit trails.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Audit Trail
          </button>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
);
};
