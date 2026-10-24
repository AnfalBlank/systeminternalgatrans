import React from 'react';
import {
  Package,
  ScanLine,
  ShieldCheck,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ShieldAlert,
} from 'lucide-react';
import { Consignment, UserProfile } from '../types/cargo';
import { Language, translations } from '../i18n/translations';

interface KanbanBoardProps {
  consignments: Consignment[];
  currentUser: UserProfile;
  onSelectConsignment: (c: Consignment) => void;
  onOpenXRayModal: (c: Consignment) => void;
  onOpenPieceModal: (c: Consignment) => void;
  onOpenDOModal: (c: Consignment) => void;
  onOpenExceptionModal: (c: Consignment) => void;
  onOpenScanner: () => void;
  currentLang: Language;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  consignments,
  currentUser,
  onSelectConsignment,
  onOpenXRayModal,
  onOpenPieceModal,
  onOpenDOModal,
  onOpenExceptionModal,
  onOpenScanner,
  currentLang,
}) => {
  const t = translations[currentLang];

  // Categorize consignments into 4 Kanban stages
  const col1_Intake = consignments.filter(
    (c) =>
      c.status === 'RECEIVED' ||
      c.status === 'DATA_EXCEPTION' ||
      c.status === 'PIECE_RECONCILIATION' ||
      c.status === 'AWAITING_XRAY'
  );

  const col2_Screening = consignments.filter(
    (c) =>
      c.status === 'XRAY_HOLD' ||
      c.status === 'XRAY_REVIEW_REQUIRED' ||
      c.status === 'AWAITING_AVSEC' ||
      c.status === 'AVSEC_REJECTED_OR_HELD'
  );

  const col3_DODraft = consignments.filter(
    (c) =>
      c.status === 'AVSEC_APPROVED' ||
      c.status === 'DO_DRAFT'
  );

  const col4_Handover = consignments.filter(
    (c) =>
      c.status === 'DO_ISSUED' ||
      c.status === 'AWAITING_WAREHOUSE_HANDOVER' ||
      c.status === 'HANDOVER_DISCREPANCY' ||
      c.status === 'DELIVERED'
  );

  const columns = [
    {
      id: 'intake',
      title: t.colIntake,
      count: col1_Intake.length,
      badgeColor: 'bg-slate-200 text-slate-700',
      headerBg: 'bg-slate-100/70',
      items: col1_Intake,
      emptyLabel: t.emptyIntake,
    },
    {
      id: 'screening',
      title: t.colScreening,
      count: col2_Screening.length,
      badgeColor: 'bg-amber-100 text-amber-800',
      headerBg: 'bg-amber-50/60',
      items: col2_Screening,
      emptyLabel: t.emptyScreening,
    },
    {
      id: 'avsec_do',
      title: t.colAvsecDO,
      count: col3_DODraft.length,
      badgeColor: 'bg-blue-100 text-blue-800',
      headerBg: 'bg-blue-50/60',
      items: col3_DODraft,
      emptyLabel: t.emptyAvsec,
    },
    {
      id: 'handover',
      title: t.colHandover,
      count: col4_Handover.length,
      badgeColor: 'bg-emerald-100 text-emerald-800',
      headerBg: 'bg-emerald-50/60',
      items: col4_Handover,
      emptyLabel: t.emptyHandover,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return {
          label: currentLang === 'id' ? 'Diserahkan (PoH)' : 'Delivered (PoH)',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'DO_ISSUED':
        return {
          label: currentLang === 'id' ? 'DO Terbit' : 'DO Issued',
          bg: 'bg-purple-100 text-purple-800 border-purple-200',
        };
      case 'AVSEC_APPROVED':
        return {
          label: currentLang === 'id' ? 'Lolos AVSEC' : 'AVSEC Approved',
          bg: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case 'XRAY_HOLD':
        return {
          label: currentLang === 'id' ? 'Tahan (Threat X-Ray)' : 'Threat Hold (X-Ray)',
          bg: 'bg-rose-100 text-rose-800 border-rose-200',
        };
      case 'DATA_EXCEPTION':
        return {
          label: currentLang === 'id' ? 'Eksepsi Data' : 'Data Exception',
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      default:
        return {
          label: status.replace(/_/g, ' '),
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
      {/* Kanban Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base tracking-tight">{t.kanbanTitle}</h3>
            <p className="text-xs text-slate-400">{t.kanbanSub}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.scanInboundCargo}</span>
          </button>
        </div>
      </div>

      {/* 4 Columns Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
        {columns.map((col) => (
          <div key={col.id} className="bg-slate-50/70 rounded-2xl p-3 border border-slate-200/60 flex flex-col min-h-[460px]">
            {/* Column Header */}
            <div className={`flex items-center justify-between p-2.5 rounded-xl ${col.headerBg} mb-3 border border-slate-200/50`}>
              <span className="font-bold text-xs text-slate-800 tracking-tight">{col.title}</span>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
                {col.count}
              </span>
            </div>

            {/* Cards List */}
            <div className="flex-1 space-y-3 overflow-y-auto">
              {col.items.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                  <Package className="w-6 h-6 text-slate-300 mb-1" />
                  <span>{col.emptyLabel}</span>
                </div>
              ) : (
                col.items.map((item) => {
                  const statusInfo = getStatusBadge(item.status);
                  const isThreatHold = item.status === 'XRAY_HOLD';
                  const isDelivered = item.status === 'DELIVERED';

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all text-xs"
                    >
                      {/* Top Row: AWB & Flight */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono font-bold text-slate-900 text-xs tracking-tight">
                          AWB {item.awbNumber}
                        </span>
                        <span className="font-mono text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60">
                          {item.flightNo} ➔ {item.destination}
                        </span>
                      </div>

                      {/* Cargo Description */}
                      <p className="font-medium text-slate-700 text-[11px] truncate">{item.natureOfGoods}</p>
                      <p className="text-[10px] text-slate-400 truncate mb-2">{item.shipper}</p>

                      {/* Badges Row */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusInfo.bg}`}>
                          {statusInfo.label}
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border font-mono ${getPriorityBadge(item.priority)}`}>
                          {item.priority}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                          {item.totalReceivedPieces}/{item.totalDeclaredPieces} {currentLang === 'id' ? 'Koli' : 'Pcs'}
                        </span>
                      </div>

                      {/* Cutoff / SLA warning */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100 mb-2.5">
                        <div className="flex items-center gap-1 font-mono">
                          <Clock className={`w-3 h-3 ${item.slaStatus === 'WARNING' ? 'text-amber-600' : 'text-slate-400'}`} />
                          <span>{t.cutoff}: {item.cutoffTime}</span>
                        </div>
                        {item.slaMinutesRemaining > 0 ? (
                          <span className={`font-mono font-semibold ${item.slaStatus === 'WARNING' ? 'text-amber-600' : 'text-slate-600'}`}>
                            {item.slaMinutesRemaining}m SLA
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-semibold font-mono">
                            {currentLang === 'id' ? 'Selesai' : 'Completed'}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <button
                          onClick={() => onOpenPieceModal(item)}
                          className="py-1 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-lg text-[10px] border border-slate-200 transition-colors cursor-pointer text-center"
                        >
                          {t.btnPieces} ({item.pieces.length})
                        </button>

                        {isThreatHold ? (
                          <button
                            onClick={() => onOpenExceptionModal(item)}
                            className="py-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg text-[10px] border border-rose-200 transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                          >
                            <ShieldAlert className="w-3 h-3" />
                            <span>{t.btnThreatHold}</span>
                          </button>
                        ) : col.id === 'intake' || col.id === 'screening' ? (
                          <button
                            onClick={() => onOpenXRayModal(item)}
                            className="py-1 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-[10px] border border-blue-200 transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                          >
                            <ScanLine className="w-3 h-3" />
                            <span>{t.btnXrayScreening}</span>
                          </button>
                        ) : col.id === 'avsec_do' ? (
                          <button
                            onClick={() => onOpenDOModal(item)}
                            className="py-1 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg text-[10px] border border-indigo-200 transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            <span>{item.deliveryOrder?.status === 'ISSUED' ? t.btnViewDO : t.btnDraftIssueDO}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onOpenDOModal(item)}
                            className="py-1 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg text-[10px] border border-emerald-200 transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{isDelivered ? t.btnPoHVerified : t.btnHandoverPoH}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Column Footer: Quick Action */}
            <button
              onClick={onOpenScanner}
              className="mt-3 w-full py-2 px-3 border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 text-slate-500 hover:text-blue-700 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.btnAddQueue}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
