import React from 'react';
import { Consignment, UserProfile } from '../../types/cargo';
import { KanbanBoard } from '../KanbanBoard';
import { Columns3, Sparkles } from 'lucide-react';
import { Language } from '../../i18n/translations';
import { motion } from 'motion/react';

interface KanbanViewProps {
  consignments: Consignment[];
  currentUser: UserProfile;
  currentLang: Language;
  onSelectConsignment: (c: Consignment) => void;
  onOpenXRayModal: (c: Consignment) => void;
  onOpenPieceModal: (c: Consignment) => void;
  onOpenDOModal: (c: Consignment) => void;
  onOpenExceptionModal: (c: Consignment) => void;
  onOpenScanner: () => void;
}

export const KanbanView: React.FC<KanbanViewProps> = (props) => {
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
              {props.currentLang === 'id'
                ? 'Papan Disposisi Alur Operasional (Kanban)'
                : 'Cargo Dispatch Operational Kanban'}
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-mono">
              End-to-End Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {props.currentLang === 'id'
              ? 'Pantau pergerakan fisik kargo melalui 5 gerbang keamanan: Penerimaan → X-Ray → AVSEC → DO Terbit → Serah Terima.'
              : 'Monitor physical cargo movement across 5 security gates: Intake → X-Ray → AVSEC → DO Issued → Handover.'}
          </p>
        </div>
      </div>

      <KanbanBoard {...props} />
    </motion.div>
  );
};
