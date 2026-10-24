import React, { useState } from 'react';
import {
  ShieldAlert,
  X,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  User,
  ArrowRight,
  FileSpreadsheet,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExceptionCase, Consignment } from '../types/cargo';

interface ExceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  exceptions: ExceptionCase[];
  selectedConsignment?: Consignment | null;
  onResolveException: (exceptionId: string, resolutionNotes: string) => void;
  onCreateException: (newCase: Partial<ExceptionCase>) => void;
}

export const ExceptionModal: React.FC<ExceptionModalProps> = ({
  isOpen,
  onClose,
  exceptions,
  selectedConsignment,
  onResolveException,
  onCreateException,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [resolutionInput, setResolutionInput] = useState('');

  // Form states for creating a new exception
  const [category, setCategory] = useState<ExceptionCase['category']>('XRAY_THREAT_HOLD');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<ExceptionCase['priority']>('HIGH');
  const [awbNumber, setAwbNumber] = useState(selectedConsignment ? selectedConsignment.awbNumber : '');
  const [notes, setNotes] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !awbNumber) return;

    onCreateException({
      category,
      title,
      priority,
      awbNumber,
      status: 'OPEN',
      assignedTo: 'Sarah Miller (AVSEC Officer)',
      chronology: [
        {
          timestamp: new Date().toLocaleTimeString(),
          actor: 'Manual Operator Input',
          action: 'Case Created',
          note: notes || 'Incident ticket logged per SOP §4.4.',
        },
      ],
    });

    setTitle('');
    setNotes('');
    setActiveTab('list');
  };

  const selectedCase = exceptions.find((e) => e.id === selectedCaseId) || exceptions[0];

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
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">Cargo Exception & Incident Management</h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30">
                  Incident Log
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Controlled Incident Lifecycle · Zero Lost Exceptions · Chronological Audit
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

        {/* Tab switch */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Active Exceptions ({exceptions.filter((e) => e.status !== 'CLOSED').length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              + Create Incident Ticket
            </button>
          </div>
          <span className="text-xs text-slate-400 font-mono">Case ID & Audit Tracked</span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Exceptions List (span 5) */}
              <div className="md:col-span-5 space-y-2.5 border-r border-slate-100 pr-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Incidents Queue</p>
                {exceptions.map((exc) => {
                  const isSelected = selectedCase?.id === exc.id;
                  const isCritical = exc.priority === 'CRITICAL';
                  const isResolved = exc.status === 'RESOLVED' || exc.status === 'CLOSED';

                  return (
                    <div
                      key={exc.id}
                      onClick={() => setSelectedCaseId(exc.id)}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-slate-900">{exc.caseNo}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                            isCritical ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {exc.priority}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800 text-[11px] leading-snug line-clamp-2">{exc.title}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                        <span className="font-mono">AWB {exc.awbNumber}</span>
                        <span className={`font-semibold ${isResolved ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {exc.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Case Details & Resolution (span 7) */}
              {selectedCase ? (
                <div className="md:col-span-7 space-y-4">
                  <div className="pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-base text-slate-900">{selectedCase.caseNo}</span>
                      <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-slate-100 text-slate-700">
                        {selectedCase.category.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">{selectedCase.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">Assigned PIC: {selectedCase.assignedTo}</p>
                  </div>

                  {/* Chronology Log */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Investigation Chronology
                    </h5>
                    <div className="space-y-2 border-l-2 border-slate-200 pl-3">
                      {selectedCase.chronology.map((c, i) => (
                        <div key={i} className="text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-slate-700">{c.timestamp}</span>
                            <span className="font-medium text-slate-500">· {c.actor}</span>
                          </div>
                          <p className="text-slate-600 mt-0.5 font-medium">{c.action}: {c.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resolution Input */}
                  {selectedCase.status !== 'RESOLVED' && selectedCase.status !== 'CLOSED' && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <label className="block text-xs font-semibold text-slate-700">
                        Record Resolution & Closure Evidence (SOP §4.4)
                      </label>
                      <textarea
                        rows={2}
                        value={resolutionInput}
                        onChange={(e) => setResolutionInput(e.target.value)}
                        placeholder="Detail the corrective action taken, ETD negative swab, or secondary scan outcome..."
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20"
                      />
                      <button
                        onClick={() => {
                          if (resolutionInput) {
                            onResolveException(selectedCase.id, resolutionInput);
                            setResolutionInput('');
                          }
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                      >
                        Resolve & Authorize Clearance
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="md:col-span-7 flex items-center justify-center text-slate-400 text-xs">
                  Select an incident case to review details.
                </div>
              )}
            </div>
          ) : (
            /* Create Exception Form */
            <form onSubmit={handleCreate} className="max-w-xl mx-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Incident Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="XRAY_THREAT_HOLD">X-Ray Threat Hold (Organic/Shielded)</option>
                  <option value="PIECE_COUNT_MISMATCH">Piece Count Mismatch (Missing/Extra Unit)</option>
                  <option value="BARCODE_UNREADABLE">Unreadable / Damaged Barcode Label</option>
                  <option value="CSD_MISMATCH">CSD Snapshot Data Discrepancy</option>
                  <option value="HANDOVER_DISCREPANCY">Airline Warehouse Handover Seal Discrepancy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Air Waybill (AWB)</label>
                <input
                  type="text"
                  value={awbNumber}
                  onChange={(e) => setAwbNumber(e.target.value)}
                  placeholder="e.g. 126-89412045"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Incident Title / Summary</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Discrepancy in carton count at bay intake"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Priority Level</label>
                <div className="flex gap-3">
                  {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        priority === p ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Observations</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe initial physical findings or inspection trigger..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Log Exception Ticket
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Non-bypassable Incident Tracking & Audit Standards</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Exceptions
          </button>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
);
};
