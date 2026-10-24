import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { NavTab, ROLE_ALLOWED_TABS } from './types/cargo';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DashboardView } from './components/views/DashboardView';
import { ExecutiveDashboardView } from './components/views/ExecutiveDashboardView';
import { ConsignmentsView } from './components/views/ConsignmentsView';
import { XRayView } from './components/views/XRayView';
import { AvsecView } from './components/views/AvsecView';
import { HandoverView } from './components/views/HandoverView';
import { ExceptionsView } from './components/views/ExceptionsView';
import { KanbanView } from './components/views/KanbanView';
import { ShiftView } from './components/views/ShiftView';
import { AuditView } from './components/views/AuditView';
import { PolicyView } from './components/views/PolicyView';
import { ChecklistView } from './components/views/ChecklistView';
import { WeighingView } from './components/views/WeighingView';
import { DispatchView } from './components/views/DispatchView';
import { InvoicingView } from './components/views/InvoicingView';
import { ReportsView } from './components/views/ReportsView';
import { ChatView } from './components/views/ChatView';
import { ScannerModal } from './components/ScannerModal';
import { PieceModal } from './components/PieceModal';
import { XRayModal } from './components/XRayModal';
import { DOModal } from './components/DOModal';
import { ExceptionModal } from './components/ExceptionModal';
import { ShiftModal } from './components/ShiftModal';
import { AuditModal } from './components/AuditModal';
import { DocumentPrintModal, DocumentType } from './components/DocumentPrintModal';
import {
  INITIAL_CONSIGNMENTS,
  INITIAL_USERS,
  INITIAL_EXCEPTIONS,
  INITIAL_SHIFT_HANDOVER,
  INITIAL_AUDIT_LOGS,
} from './data/mockCargoData';
import {
  Consignment,
  UserProfile,
  ExceptionCase,
  ShiftHandover,
  AuditEvent,
  XRayResult,
  DocumentChecklist,
  ManualEVDInspection,
  RejectLetter,
  AdditionalDataRequest,
  WeighingRecord,
  CargoSecurityDoc,
  LoadingSealRecord,
  GoodsReceiptBTB,
  BasicInvoice,
  PaymentRecord,
} from './types/cargo';
import {
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Check,
} from 'lucide-react';
import { Language, translations } from './i18n/translations';
import { AnimatePresence } from 'motion/react';

export default function App() {
  // Language State - Default to Indonesian as requested!
  const [lang, setLang] = useState<Language>('id');
  const t = translations[lang];

  // Core State
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [consignments, setConsignments] = useState<Consignment[]>(INITIAL_CONSIGNMENTS);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[1]); // Budi Santoso (ADMIN)
  const [exceptions, setExceptions] = useState<ExceptionCase[]>(INITIAL_EXCEPTIONS);
  const [shiftData, setShiftData] = useState<ShiftHandover>(INITIAL_SHIFT_HANDOVER);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPieceModalOpen, setIsPieceModalOpen] = useState(false);
  const [isXRayModalOpen, setIsXRayModalOpen] = useState(false);
  const [isDOModalOpen, setIsDOModalOpen] = useState(false);
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isDocumentPrintModalOpen, setIsDocumentPrintModalOpen] = useState(false);
  const [printDocumentType, setPrintDocumentType] = useState<DocumentType>('DELIVERY_ORDER');
  const [printConsignment, setPrintConsignment] = useState<Consignment | null>(null);
  const [selectedConsignment, setSelectedConsignment] = useState<Consignment | null>(null);

  const handleOpenPrintModal = (type: DocumentType, c?: Consignment) => {
    setPrintDocumentType(type);
    if (c) {
      setPrintConsignment(c);
      setSelectedConsignment(c);
    } else if (selectedConsignment) {
      setPrintConsignment(selectedConsignment);
    } else if (consignments.length > 0) {
      setPrintConsignment(consignments[0]);
    }
    setIsDocumentPrintModalOpen(true);
  };

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'warning' | 'error' | 'info'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Filtered consignments based on search query
  const filteredConsignments = useMemo(() => {
    if (!searchQuery.trim()) return consignments;
    const q = searchQuery.toLowerCase();
    return consignments.filter(
      (c) =>
        c.awbNumber.toLowerCase().includes(q) ||
        c.flightNo.toLowerCase().includes(q) ||
        c.airline.toLowerCase().includes(q) ||
        c.shipper.toLowerCase().includes(q) ||
        c.consignee.toLowerCase().includes(q) ||
        c.destination.toLowerCase().includes(q) ||
        c.natureOfGoods.toLowerCase().includes(q) ||
        (c.deliveryOrder && c.deliveryOrder.doNumber.toLowerCase().includes(q)) ||
        c.pieces.some((p) => p.barcode.toLowerCase().includes(q))
    );
  }, [consignments, searchQuery]);

  // Aggregate metrics
  const totalPieces = consignments.reduce((acc, c) => acc + c.totalDeclaredPieces, 0);
  const xrayedPieces = consignments.reduce(
    (acc, c) => acc + c.pieces.filter((p) => p.xrayResult !== undefined).length,
    0
  );
  const pendingAvsecPieces = consignments
    .filter((c) => c.status === 'AWAITING_AVSEC' || c.status === 'XRAY_HOLD' || c.status === 'XRAY_REVIEW_REQUIRED')
    .reduce((acc, c) => acc + c.totalReceivedPieces, 0);
  const doIssuedCount = consignments.filter((c) => c.deliveryOrder?.status === 'ISSUED').length;
  const deliveredCount = consignments.filter((c) => c.status === 'DELIVERED').length;
  const openExceptionsCount = exceptions.filter((e) => e.status !== 'CLOSED' && e.status !== 'RESOLVED').length;

  // Handlers for operational state changes
  const handleRecordXRayResult = (
    consignmentId: string,
    result: XRayResult,
    notes: string,
    threatClass?: string
  ) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== consignmentId) return c;

        const newInspection = {
          id: `XR-${Date.now().toString().slice(-4)}`,
          inspectedAt: new Date().toLocaleTimeString(),
          operatorId: currentUser.id,
          operatorName: currentUser.name,
          stationId: currentUser.station,
          scannerModel: 'Smiths Detection HI-SCAN 100100V-2is',
          result,
          notes,
          dataVersion: c.dataVersion,
          densityLevel: result === 'PASS' ? ('Low' as const) : ('Suspicious' as const),
          threatClass: (threatClass as any) || 'None',
        };

        const updatedPieces = c.pieces.map((p) => ({
          ...p,
          xrayResult: result,
          status: result === 'PASS' ? ('XRAY_PASS' as const) : ('XRAY_HOLD' as const),
          xrayTimestamp: new Date().toLocaleTimeString(),
          xrayOperator: currentUser.name,
        }));

        let newStatus = c.status;
        if (result === 'PASS') {
          newStatus = 'AWAITING_AVSEC';
        } else if (result === 'HOLD') {
          newStatus = 'XRAY_HOLD';
        } else if (result === 'REVIEW_REQUIRED') {
          newStatus = 'XRAY_REVIEW_REQUIRED';
        } else if (result === 'REJECT') {
          newStatus = 'XRAY_REJECTED';
        }

        return {
          ...c,
          status: newStatus,
          pieces: updatedPieces,
          xrayInspections: [newInspection, ...c.xrayInspections],
          lastUpdatedAt: new Date().toLocaleTimeString(),
        };
      })
    );

    if (result === 'HOLD' || result === 'REJECT') {
      const newExc: ExceptionCase = {
        id: `EXC-2026-${Date.now().toString().slice(-3)}`,
        caseNo: `EXC-2026-${Date.now().toString().slice(-3)}`,
        category: 'XRAY_THREAT_HOLD',
        title: lang === 'id' ? `Penahanan X-Ray: ${threatClass || 'Objek Mencurigakan'}` : `X-Ray Threat Hold: ${threatClass || 'Suspicious Object'}`,
        priority: 'CRITICAL',
        status: 'ASSIGNED',
        consignmentId,
        awbNumber: consignments.find((c) => c.id === consignmentId)?.awbNumber || '',
        assignedTo: 'Sarah Miller (AVSEC Officer)',
        createdAt: new Date().toLocaleTimeString(),
        dueAt: 'Within 30 mins',
        chronology: [
          {
            timestamp: new Date().toLocaleTimeString(),
            actor: currentUser.name,
            action: lang === 'id' ? 'Ancaman Terdeteksi pada X-Ray Dual-View' : 'Threat Flagged during Dual-View X-Ray Screening',
            note: notes,
          },
        ],
      };
      setExceptions((prev) => [newExc, ...prev]);
    }

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      occurredAt: new Date().toLocaleTimeString(),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'RECORD_XRAY_RESULT',
      entityType: 'XRAY',
      entityId: consignmentId,
      description: `Recorded result ${result} on consignment ${consignmentId}. ThreatClass: ${threatClass || 'None'}.`,
      criticalControlMet: true,
      correlationId: `TX-${Date.now().toString().slice(-4)}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    setIsXRayModalOpen(false);
    showToast(
      lang === 'id' ? `Hasil X-Ray ${result} dicatat. Status diperbarui sesuai SOP.` : `X-Ray inspection recorded: ${result}. State updated per SOP.`,
      result === 'PASS' ? 'success' : 'warning'
    );
  };

  const handleRecordAVSECDecision = (
    consignmentId: string,
    decision: 'APPROVED' | 'REJECTED' | 'HELD_FOR_SECONDARY',
    reason: string
  ) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== consignmentId) return c;

        const newReview = {
          id: `AVS-${Date.now().toString().slice(-4)}`,
          decidedAt: new Date().toLocaleTimeString(),
          officerId: currentUser.id,
          officerName: currentUser.name,
          decision,
          reason,
          reviewedDataVersion: c.dataVersion,
          securityStampNo: `AVSEC-CGK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        };

        let newStatus = c.status;
        let newDO = c.deliveryOrder;

        if (decision === 'APPROVED') {
          newStatus = 'AVSEC_APPROVED';
          if (!newDO) {
            newDO = {
              id: `DO-${Date.now().toString().slice(-4)}`,
              doNumber: `DO-2026-${c.airline.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
              version: 1,
              status: 'DRAFT',
              carrier: c.airline,
              flightNo: c.flightNo,
              destination: c.destination,
              customsSealNo: `BC-SEAL-${Math.floor(10000 + Math.random() * 90000)}`,
              totalPieces: c.totalReceivedPieces,
              totalGrossWeightKg: c.totalWeightKg,
            };
          }
        } else if (decision === 'REJECTED') {
          newStatus = 'AVSEC_REJECTED_OR_HELD';
        } else {
          newStatus = 'XRAY_HOLD';
        }

        return {
          ...c,
          status: newStatus,
          avsecReview: newReview,
          deliveryOrder: newDO,
          lastUpdatedAt: new Date().toLocaleTimeString(),
        };
      })
    );

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      occurredAt: new Date().toLocaleTimeString(),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'AVSEC_DECISION',
      entityType: 'AVSEC',
      entityId: consignmentId,
      description: `AVSEC ${decision} granted by ${currentUser.name}. Reason: ${reason}`,
      criticalControlMet: true,
      correlationId: `TX-${Date.now().toString().slice(-4)}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    setIsXRayModalOpen(false);
    showToast(
      lang === 'id' ? `Keputusan AVSEC [${decision}] dicatat pada versi snapshot.` : `AVSEC Decision [${decision}] recorded to snapshot version.`,
      decision === 'APPROVED' ? 'success' : 'error'
    );
  };

  const handleIssueDO = (consignmentId: string, customSealNo: string) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== consignmentId) return c;
        if (!c.deliveryOrder) return c;

        const updatedDO = {
          ...c.deliveryOrder,
          status: 'ISSUED' as const,
          issuedAt: new Date().toLocaleTimeString(),
          issuedBy: currentUser.id,
          dispatcherName: currentUser.name,
          customsSealNo: customSealNo,
        };

        return {
          ...c,
          status: 'DO_ISSUED',
          deliveryOrder: updatedDO,
          lastUpdatedAt: new Date().toLocaleTimeString(),
        };
      })
    );

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      occurredAt: new Date().toLocaleTimeString(),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'ISSUE_DELIVERY_ORDER',
      entityType: 'DO',
      entityId: consignmentId,
      description: `Delivery Order issued by Dispatch Officer ${currentUser.name}. Customs Seal: ${customSealNo}`,
      criticalControlMet: true,
      correlationId: `TX-${Date.now().toString().slice(-4)}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    setIsDOModalOpen(false);
    showToast(
      lang === 'id' ? `Delivery Order (DO) berhasil diterbitkan dengan segel ${customSealNo}.` : `Delivery Order issued with seal ${customSealNo}. Ready for airline handover!`,
      'success'
    );
  };

  const handleConfirmHandover = (
    consignmentId: string,
    receiverName: string,
    airlineWarehouse: string,
    condition: 'INTACT_SEAL' | 'MINOR_TEAR' | 'DAMAGED_CRUSHED',
    signatureText: string
  ) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== consignmentId) return c;

        const newPoH = {
          id: `POH-2026-${Date.now().toString().slice(-4)}`,
          proofNo: `POH-2026-${Date.now().toString().slice(-4)}-V1`,
          handoverTime: new Date().toLocaleTimeString(),
          doNumber: c.deliveryOrder?.doNumber || 'N/A',
          handedOverBy: `${currentUser.name} (${currentUser.roleLabel})`,
          receivedBy: receiverName,
          airlineWarehouse,
          plannedPieces: c.totalDeclaredPieces,
          actualPieces: c.totalReceivedPieces,
          conditionStatus: condition,
          digitalSignature: signatureText,
          notes: `Handover verified with intact seals. Signed digitally by ${receiverName}.`,
          verifiedPieceIds: c.pieces.map((p) => p.id),
        };

        const updatedPieces = c.pieces.map((p) => ({
          ...p,
          status: 'HANDED_OVER' as const,
          scannedAtHandover: true,
        }));

        return {
          ...c,
          status: 'DELIVERED',
          proofOfHandover: newPoH,
          pieces: updatedPieces,
          lastUpdatedAt: new Date().toLocaleTimeString(),
        };
      })
    );

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      occurredAt: new Date().toLocaleTimeString(),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'CONFIRM_HANDOVER_POH',
      entityType: 'HANDOVER',
      entityId: consignmentId,
      description: `Digital Proof of Handover signed off by ${receiverName}. Status moved to DELIVERED.`,
      criticalControlMet: true,
      correlationId: `TX-${Date.now().toString().slice(-4)}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    setIsDOModalOpen(false);
    showToast(
      lang === 'id' ? 'Serah terima terkonfirmasi! Bukti PoH digital telah dibuat. Kargo berstatus DELIVERED.' : 'Handover confirmed! Digital Proof of Handover (PoH) generated. Consignment marked DELIVERED.',
      'success'
    );
  };

  const handleUpdatePieceHandover = (consignmentId: string, pieceId: string, verified: boolean) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== consignmentId) return c;
        const updatedPieces = c.pieces.map((p) => (p.id === pieceId ? { ...p, scannedAtHandover: verified } : p));
        return {
          ...c,
          pieces: updatedPieces,
        };
      })
    );
  };

  const handleAddNewConsignment = (newConsignment: Consignment) => {
    setConsignments((prev) => [newConsignment, ...prev]);
    showToast(
      lang === 'id' ? `AWB masuk ${newConsignment.awbNumber} berhasil diterima dan masuk antrean screening.` : `Inbound AWB ${newConsignment.awbNumber} accepted and queued for screening.`,
      'success'
    );
  };

  const handleResolveException = (exceptionId: string, resolutionNotes: string) => {
    setExceptions((prev) =>
      prev.map((e) => {
        if (e.id !== exceptionId) return e;
        return {
          ...e,
          status: 'RESOLVED',
          resolvedAt: new Date().toLocaleTimeString(),
          resolutionNotes,
          chronology: [
            ...e.chronology,
            {
              timestamp: new Date().toLocaleTimeString(),
              actor: currentUser.name,
              action: lang === 'id' ? 'Eksepsi Diselesaikan' : 'Exception Resolved',
              note: resolutionNotes,
            },
          ],
        };
      })
    );
    showToast(
      lang === 'id' ? `Kasus eksepsi ${exceptionId} berhasil diselesaikan.` : `Exception ${exceptionId} resolved per SOP.`,
      'success'
    );
  };

  const handleCreateException = (newCase: Partial<ExceptionCase>) => {
    const fullCase: ExceptionCase = {
      id: `EXC-2026-${Date.now().toString().slice(-3)}`,
      caseNo: `EXC-2026-${Date.now().toString().slice(-3)}`,
      category: newCase.category || 'XRAY_THREAT_HOLD',
      title: newCase.title || 'Operational Incident',
      priority: newCase.priority || 'HIGH',
      status: 'OPEN',
      consignmentId: newCase.consignmentId || 'CNS-MANUAL',
      awbNumber: newCase.awbNumber || 'UNKNOWN',
      assignedTo: newCase.assignedTo || currentUser.name,
      createdAt: new Date().toLocaleTimeString(),
      dueAt: 'Within 60 mins',
      chronology: newCase.chronology || [],
    };
    setExceptions((prev) => [fullCase, ...prev]);
    showToast(
      lang === 'id' ? `Tiket insiden ${fullCase.caseNo} telah dicatat dalam buku eksepsi.` : `Incident Case ${fullCase.caseNo} logged in exception ledger.`,
      'warning'
    );
  };

  const handleAcknowledgeShift = (supervisorName: string) => {
    setShiftData((prev) => ({
      ...prev,
      status: 'ACKNOWLEDGED',
      acknowledgedAt: new Date().toLocaleTimeString(),
      incomingSupervisor: supervisorName,
    }));
    showToast(
      lang === 'id' ? `Serah terima shift telah ditandatangani oleh ${supervisorName}.` : `Shift Handover acknowledged by ${supervisorName}.`,
      'success'
    );
  };

  // PRD v1.3: Checklist, EVD, Reject Letter & Data Request Handlers
  const handleUpdateChecklist = (consignmentId: string, checklist: DocumentChecklist) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== consignmentId) return c;
        return {
          ...c,
          documentChecklist: checklist,
          lastUpdatedAt: new Date().toLocaleTimeString(),
        };
      })
    );

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      occurredAt: new Date().toLocaleTimeString(),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'UPDATE_CHECKLIST',
      entityType: 'CONSIGNMENT',
      entityId: consignmentId,
      description: `Checklist kelengkapan dokumen diperbarui: Status ${checklist.status} oleh ${currentUser.name}.`,
      criticalControlMet: true,
      correlationId: `TX-CHK-${Date.now().toString().slice(-4)}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    showToast(
      lang === 'id' ? `Checklist AWB diperbarui [Status: ${checklist.status}].` : `Checklist updated [Status: ${checklist.status}].`,
      checklist.status === 'COMPLETE' ? 'success' : 'warning'
    );
  };

  const handleRecordEVD = (consignmentId: string, evd: ManualEVDInspection) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== consignmentId) return c;
        const newStatus = evd.result === 'CLEAR' ? c.status : 'XRAY_HOLD';
        return {
          ...c,
          status: newStatus,
          evdInspection: evd,
          lastUpdatedAt: new Date().toLocaleTimeString(),
        };
      })
    );

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      occurredAt: new Date().toLocaleTimeString(),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'RECORD_EVD_INSPECTION',
      entityType: 'XRAY',
      entityId: consignmentId,
      description: `Pemeriksaan EVD Trace (${evd.deviceModel}): Hasil ${evd.result}. Swab area: ${evd.swabArea}.`,
      criticalControlMet: true,
      correlationId: `TX-EVD-${Date.now().toString().slice(-4)}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    showToast(
      lang === 'id' ? `Hasil EVD (${evd.result}) berhasil disimpan!` : `EVD inspection result (${evd.result}) logged.`,
      evd.result === 'CLEAR' ? 'success' : 'error'
    );
  };

  const handleIssueRejectLetter = (consignmentId: string, rejectLetter: RejectLetter) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== consignmentId) return c;
        return {
          ...c,
          status: 'XRAY_REJECTED',
          rejectLetter,
          lastUpdatedAt: new Date().toLocaleTimeString(),
        };
      })
    );

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      occurredAt: new Date().toLocaleTimeString(),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'ISSUE_REJECT_LETTER',
      entityType: 'CONSIGNMENT',
      entityId: consignmentId,
      description: `Surat Penolakan Resmi diterbitkan: ${rejectLetter.letterNumber}. Alasan: ${rejectLetter.primaryReason}.`,
      criticalControlMet: true,
      correlationId: `TX-REJ-${Date.now().toString().slice(-4)}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    showToast(
      lang === 'id' ? `Surat Penolakan Resmi [${rejectLetter.letterNumber}] telah diterbitkan.` : `Official Reject Letter [${rejectLetter.letterNumber}] issued.`,
      'error'
    );
  };

  const handleRequestAdditionalData = (consignmentId: string, req: AdditionalDataRequest) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== consignmentId) return c;
        return {
          ...c,
          status: 'XRAY_REVIEW_REQUIRED',
          additionalDataRequest: req,
          lastUpdatedAt: new Date().toLocaleTimeString(),
        };
      })
    );

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      occurredAt: new Date().toLocaleTimeString(),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'REQUEST_ADDITIONAL_DATA',
      entityType: 'CONSIGNMENT',
      entityId: consignmentId,
      description: `Permintaan data tambahan/MSDS/Surat Pernyataan diajukan oleh ${currentUser.name}. Target: ${req.targetParty}.`,
      criticalControlMet: true,
      correlationId: `TX-REQ-${Date.now().toString().slice(-4)}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    showToast(
      lang === 'id' ? `Permintaan data tambahan telah dikirim ke ${req.targetParty}.` : `Additional data request sent to ${req.targetParty}.`,
      'warning'
    );
  };

  // PRD v1.3: Digital Scale Weighing & CSD / STK Handlers
  const handleRecordWeighing = (consignmentId: string, record: WeighingRecord) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== consignmentId) return c;
        return {
          ...c,
          totalWeightKg: record.netWeightKg,
          weighingRecord: record,
          lastUpdatedAt: new Date().toLocaleTimeString(),
        };
      })
    );

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      occurredAt: new Date().toLocaleTimeString(),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'RECORD_WEIGHING',
      entityType: 'CONSIGNMENT',
      entityId: consignmentId,
      description: `Penimbangan digital tersertifikasi dicatat: ${record.scaleTicketNumber} (Net: ${record.netWeightKg} kg, Chargeable: ${record.chargeableWeightKg} kg). Discrepancy: ${record.discrepancyPercentage.toFixed(1)}%.`,
      criticalControlMet: true,
      correlationId: `TX-WGH-${Date.now().toString().slice(-4)}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    showToast(
      lang === 'id' ? `Data timbangan ${record.scaleTicketNumber} berhasil disimpan.` : `Certified scale record ${record.scaleTicketNumber} saved.`,
      'success'
    );
  };

  const handleIssueCSD = (consignmentId: string, csd: CargoSecurityDoc) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== consignmentId) return c;
        return {
          ...c,
          cargoSecurityDoc: csd,
          lastUpdatedAt: new Date().toLocaleTimeString(),
        };
      })
    );

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      occurredAt: new Date().toLocaleTimeString(),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'ISSUE_CSD',
      entityType: 'CONSIGNMENT',
      entityId: consignmentId,
      description: `Dokumen CSD (Cargo Security Declaration) resmi diterbitkan: ${csd.declarationNumber}. Security Status: ${csd.securityStatus}.`,
      criticalControlMet: true,
      correlationId: `TX-CSD-${Date.now().toString().slice(-4)}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    showToast(
      lang === 'id' ? `CSD resmi [${csd.declarationNumber}] berhasil diterbitkan.` : `Official CSD [${csd.declarationNumber}] issued.`,
      'success'
    );
  };

  const handleIssueSTK = (consignmentId: string, stkDocNumber: string) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== consignmentId) return c;
        return {
          ...c,
          stkDocNumber,
          lastUpdatedAt: new Date().toLocaleTimeString(),
        };
      })
    );

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      occurredAt: new Date().toLocaleTimeString(),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'ISSUE_STK',
      entityType: 'CONSIGNMENT',
      entityId: consignmentId,
      description: `Surat Tugas Kargo (STK) resmi diterbitkan: ${stkDocNumber} oleh ${currentUser.name}.`,
      criticalControlMet: true,
      correlationId: `TX-STK-${Date.now().toString().slice(-4)}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    showToast(
      lang === 'id' ? `Surat Tugas Kargo (STK) [${stkDocNumber}] diterbitkan.` : `Cargo Task Letter (STK) [${stkDocNumber}] issued.`,
      'success'
    );
  };

  // PRD v1.3: Loading, Seal, Line 1 Dispatch, and BTB Handlers
  const handleRecordLoadingAndSeal = (consignmentId: string, record: LoadingSealRecord) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== consignmentId) return c;
        return {
          ...c,
          loadingSealRecord: record,
          lastUpdatedAt: new Date().toLocaleTimeString(),
        };
      })
    );

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      occurredAt: new Date().toLocaleTimeString(),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'RECORD_LOADING_SEAL',
      entityType: 'HANDOVER',
      entityId: consignmentId,
      description: `Pemuatan truk & pemasangan segel dicatat oleh ${currentUser.name}: Segel ${record.primarySealNumber}. Truk ${record.vehiclePlateNo}.`,
      criticalControlMet: true,
      correlationId: `TX-SEAL-${Date.now().toString().slice(-4)}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    showToast(
      lang === 'id' ? `Pemuatan truk ${record.vehiclePlateNo} & segel ${record.primarySealNumber} tersimpan.` : `Truck loading & security seal ${record.primarySealNumber} logged.`,
      'success'
    );
  };

  const handleConfirmDispatchLine1 = (consignmentId: string, driverNotes: string) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== consignmentId) return c;
        const updatedDeliveryOrder = c.deliveryOrder
          ? { ...c.deliveryOrder, status: 'DISPATCHED' as const }
          : undefined;
        return {
          ...c,
          status: 'DISPATCHED_LINE_1',
          deliveryOrder: updatedDeliveryOrder,
          lastUpdatedAt: new Date().toLocaleTimeString(),
        };
      })
    );

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      occurredAt: new Date().toLocaleTimeString(),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'DISPATCH_LINE_1',
      entityType: 'HANDOVER',
      entityId: consignmentId,
      description: `Kargo diberangkatkan menuju Line 1 Bandara oleh Driver ${currentUser.name}. Catatan: ${driverNotes || 'N/A'}.`,
      criticalControlMet: true,
      correlationId: `TX-DISP-${Date.now().toString().slice(-4)}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    showToast(
      lang === 'id' ? `Kargo diberangkatkan ke Line 1 (Airside Warehouse). Driver: ${currentUser.name}.` : `Consignment dispatched to Line 1 by Driver ${currentUser.name}.`,
      'success'
    );
  };

  const handleRecordBTBReceipt = (consignmentId: string, btb: GoodsReceiptBTB) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== consignmentId) return c;
        return {
          ...c,
          status: 'DELIVERED',
          btbReceipt: btb,
          lastUpdatedAt: new Date().toLocaleTimeString(),
        };
      })
    );

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      occurredAt: new Date().toLocaleTimeString(),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'RECORD_BTB_RECEIPT',
      entityType: 'HANDOVER',
      entityId: consignmentId,
      description: `BTB (Bukti Timbang Barang) Maskapai diterima: ${btb.btbNumber}. Diterima oleh: ${btb.receivedByAirlineOfficer} (${btb.airlineWarehouseName}). Koli: ${btb.acceptedPieces}/${btb.dispatchedPieces}, Berat: ${btb.acceptedWeightKg} kg.`,
      criticalControlMet: true,
      correlationId: `TX-BTB-${Date.now().toString().slice(-4)}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    showToast(
      lang === 'id' ? `BTB Maskapai [${btb.btbNumber}] tercatat! Kargo telah diterima resmi di Gudang Lini 1.` : `Airline BTB [${btb.btbNumber}] registered! Consignment officially accepted at Line 1 warehouse.`,
      'success'
    );
  };

  // PRD v1.3: Invoicing and Payment Handlers
  const handleCreateInvoice = (consignmentId: string, invoice: BasicInvoice) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== consignmentId) return c;
        return {
          ...c,
          invoice,
          lastUpdatedAt: new Date().toLocaleTimeString(),
        };
      })
    );

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      occurredAt: new Date().toLocaleTimeString(),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'CREATE_INVOICE',
      entityType: 'INVOICE',
      entityId: consignmentId,
      description: `Invoice operasional dibuat: ${invoice.invoiceNumber}. Total: Rp ${invoice.totalAmount.toLocaleString('id-ID')}. Tipe: ${invoice.paymentType}.`,
      criticalControlMet: true,
      correlationId: `TX-INV-${Date.now().toString().slice(-4)}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    showToast(
      lang === 'id' ? `Invoice ${invoice.invoiceNumber} (Rp ${invoice.totalAmount.toLocaleString('id-ID')}) berhasil dibuat.` : `Invoice ${invoice.invoiceNumber} created.`,
      'success'
    );
  };

  const handleRecordPayment = (consignmentId: string, payment: PaymentRecord) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== consignmentId) return c;
        if (!c.invoice) return c;

        const updatedHistory = [...c.invoice.paymentHistory, payment];
        const newPaidAmount = c.invoice.paidAmount + payment.amount;
        const newBalance = Math.max(0, c.invoice.totalAmount - newPaidAmount);
        const newStatus = newBalance === 0 ? 'PAID' as const : 'PARTIAL' as const;

        const updatedInvoice: BasicInvoice = {
          ...c.invoice,
          status: newStatus,
          paidAmount: newPaidAmount,
          balanceDue: newBalance,
          paymentHistory: updatedHistory,
        };

        return {
          ...c,
          invoice: updatedInvoice,
          lastUpdatedAt: new Date().toLocaleTimeString(),
        };
      })
    );

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      occurredAt: new Date().toLocaleTimeString(),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'RECORD_PAYMENT',
      entityType: 'INVOICE',
      entityId: consignmentId,
      description: `Pembayaran invoice diterima: Rp ${payment.amount.toLocaleString('id-ID')} (${payment.method}). Referensi: ${payment.referenceNumber}. Dicatat oleh: ${currentUser.name}.`,
      criticalControlMet: true,
      correlationId: `TX-PAY-${Date.now().toString().slice(-4)}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    showToast(
      lang === 'id' ? `Pembayaran Rp ${payment.amount.toLocaleString('id-ID')} berhasil dicatat.` : `Payment of Rp ${payment.amount.toLocaleString('id-ID')} recorded.`,
      'success'
    );
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold animate-in slide-in-from-top-3 duration-200 border bg-white border-slate-200">
          {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {toastMessage.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
          {toastMessage.type === 'error' && <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />}
          {toastMessage.type === 'info' && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
          <span className="text-slate-900">{toastMessage.text}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsMobileNavOpen(false);
        }}
        openExceptionsCount={openExceptionsCount}
        pendingXrayCount={consignments.filter((c) => c.status === 'AWAITING_XRAY').length}
        pendingAvsecCount={consignments.filter((c) => c.status === 'AWAITING_AVSEC' || c.status === 'XRAY_HOLD').length}
        onOpenShiftModal={() => setIsShiftModalOpen(true)}
        currentLang={lang}
        currentUser={currentUser}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header
          currentUser={currentUser}
          allUsers={allUsers}
          onSwitchUser={(user) => {
            setCurrentUser(user);
            const allowed = ROLE_ALLOWED_TABS[user.role] || ROLE_ALLOWED_TABS.ADMIN;
            if (user.role === 'MANAGERIAL') {
              setActiveTab('executive');
            } else if (!allowed.includes(activeTab)) {
              setActiveTab('dashboard');
            }
            showToast(
              lang === 'id' ? `Petugas aktif diganti: ${user.name} (${user.roleLabel})` : `Active User switched to ${user.name} (${user.roleLabel})`,
              'info'
            );
          }}
          onOpenScanner={() => setIsScannerOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          unreadAlertsCount={openExceptionsCount + (consignments.filter((c) => c.slaStatus === 'WARNING').length)}
          currentLang={lang}
          onToggleLang={(newLang) => {
            setLang(newLang);
            showToast(
              newLang === 'id' ? 'Bahasa antarmuka diubah ke Bahasa Indonesia.' : 'Interface language switched to English.',
              'info'
            );
          }}
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
          onOpenDocumentPrint={() => handleOpenPrintModal('DELIVERY_ORDER', selectedConsignment || consignments[0])}
          onOpenChat={() => setActiveTab('chat')}
        />

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-6 flex flex-col justify-between">
          <div className="flex-1">
            <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <DashboardView
                key="dashboard"
                consignments={filteredConsignments}
                teamMembers={allUsers}
                currentUser={currentUser}
                totalPieces={totalPieces}
                xrayedPieces={xrayedPieces}
                pendingAvsecPieces={pendingAvsecPieces}
                doIssuedCount={doIssuedCount}
                deliveredCount={deliveredCount}
                openExceptionsCount={openExceptionsCount}
                currentLang={lang}
                onSelectConsignment={(c) => {
                  setSelectedConsignment(c);
                  setIsPieceModalOpen(true);
                }}
                onOpenXRayModal={(c) => {
                  setSelectedConsignment(c);
                  setIsXRayModalOpen(true);
                }}
                onOpenPieceModal={(c) => {
                  setSelectedConsignment(c);
                  setIsPieceModalOpen(true);
                }}
                onOpenDOModal={(c) => {
                  setSelectedConsignment(c);
                  setIsDOModalOpen(true);
                }}
                onOpenExceptionModal={(c) => {
                  setSelectedConsignment(c);
                  setIsExceptionModalOpen(true);
                }}
                onOpenScanner={() => setIsScannerOpen(true)}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'executive' && (
              <ExecutiveDashboardView
                key="executive"
                consignments={filteredConsignments}
                currentUser={currentUser}
                currentLang={lang}
                onNavigateToTab={(tab) => setActiveTab(tab)}
                onOpenPrintModal={handleOpenPrintModal}
              />
            )}

            {activeTab === 'chat' && (
              <ChatView
                key="chat"
                currentUser={currentUser}
                allUsers={allUsers}
                consignments={filteredConsignments}
                currentLang={lang}
                onNavigateToTab={(tab) => setActiveTab(tab)}
                onSelectConsignment={(c) => setSelectedConsignment(c)}
              />
            )}

            {activeTab === 'consignments' && (
              <ConsignmentsView
                key="consignments"
                consignments={filteredConsignments}
                currentLang={lang}
                onSelectConsignment={(c) => {
                  setSelectedConsignment(c);
                  setIsPieceModalOpen(true);
                }}
                onOpenPieceModal={(c) => {
                  setSelectedConsignment(c);
                  setIsPieceModalOpen(true);
                }}
                onOpenXRayModal={(c) => {
                  setSelectedConsignment(c);
                  setIsXRayModalOpen(true);
                }}
                onOpenScanner={() => setIsScannerOpen(true)}
                onOpenPrintModal={handleOpenPrintModal}
              />
            )}

            {activeTab === 'xray' && (
              <XRayView
                key="xray"
                consignments={filteredConsignments}
                currentUser={currentUser}
                currentLang={lang}
                onSelectConsignment={(c) => {
                  setSelectedConsignment(c);
                  setIsPieceModalOpen(true);
                }}
                onOpenXRayModal={(c) => {
                  setSelectedConsignment(c);
                  setIsXRayModalOpen(true);
                }}
                onRecordResult={handleRecordXRayResult}
              />
            )}

            {activeTab === 'kanban' && (
              <KanbanView
                key="kanban"
                consignments={filteredConsignments}
                currentUser={currentUser}
                currentLang={lang}
                onSelectConsignment={(c) => {
                  setSelectedConsignment(c);
                  setIsPieceModalOpen(true);
                }}
                onOpenXRayModal={(c) => {
                  setSelectedConsignment(c);
                  setIsXRayModalOpen(true);
                }}
                onOpenPieceModal={(c) => {
                  setSelectedConsignment(c);
                  setIsPieceModalOpen(true);
                }}
                onOpenDOModal={(c) => {
                  setSelectedConsignment(c);
                  setIsDOModalOpen(true);
                }}
                onOpenExceptionModal={(c) => {
                  setSelectedConsignment(c);
                  setIsExceptionModalOpen(true);
                }}
                onOpenScanner={() => setIsScannerOpen(true)}
              />
            )}

            {activeTab === 'avsec' && (
              <AvsecView
                key="avsec"
                consignments={filteredConsignments}
                currentUser={currentUser}
                currentLang={lang}
                onSelectConsignment={(c) => {
                  setSelectedConsignment(c);
                  setIsPieceModalOpen(true);
                }}
                onOpenXRayModal={(c) => {
                  setSelectedConsignment(c);
                  setIsXRayModalOpen(true);
                }}
                onRecordAVSECDecision={handleRecordAVSECDecision}
              />
            )}

            {activeTab === 'exceptions' && (
              <ExceptionsView
                key="exceptions"
                exceptions={exceptions}
                currentUser={currentUser}
                currentLang={lang}
                onResolveException={handleResolveException}
                onCreateException={handleCreateException}
                onOpenPrintModal={handleOpenPrintModal}
              />
            )}

            {activeTab === 'handover' && (
              <HandoverView
                key="handover"
                consignments={filteredConsignments}
                currentUser={currentUser}
                currentLang={lang}
                onSelectConsignment={(c) => {
                  setSelectedConsignment(c);
                  setIsPieceModalOpen(true);
                }}
                onOpenDOModal={(c) => {
                  setSelectedConsignment(c);
                  setIsDOModalOpen(true);
                }}
                onIssueDO={handleIssueDO}
                onConfirmHandover={handleConfirmHandover}
              />
            )}

            {activeTab === 'shift' && (
              <ShiftView
                key="shift"
                shiftData={shiftData}
                currentUser={currentUser}
                currentLang={lang}
                onAcknowledgeShift={handleAcknowledgeShift}
                onOpenShiftModal={() => setIsShiftModalOpen(true)}
                onOpenPrintModal={handleOpenPrintModal}
              />
            )}

            {activeTab === 'checklist' && (
              <ChecklistView
                key="checklist"
                consignments={filteredConsignments}
                currentUser={currentUser}
                currentLang={lang}
                onUpdateChecklist={handleUpdateChecklist}
                onRecordEVD={handleRecordEVD}
                onIssueRejectLetter={handleIssueRejectLetter}
                onRequestAdditionalData={handleRequestAdditionalData}
                onOpenPrintModal={handleOpenPrintModal}
              />
            )}

            {activeTab === 'weighing' && (
              <WeighingView
                key="weighing"
                consignments={filteredConsignments}
                currentUser={currentUser}
                currentLang={lang}
                onRecordWeighing={handleRecordWeighing}
                onIssueCSD={handleIssueCSD}
                onIssueSTK={handleIssueSTK}
                onOpenPrintModal={handleOpenPrintModal}
              />
            )}

            {activeTab === 'dispatch' && (
              <DispatchView
                key="dispatch"
                consignments={filteredConsignments}
                currentUser={currentUser}
                currentLang={lang}
                onRecordLoadingAndSeal={handleRecordLoadingAndSeal}
                onConfirmDispatchLine1={handleConfirmDispatchLine1}
                onRecordBTBReceipt={handleRecordBTBReceipt}
                onOpenPrintModal={handleOpenPrintModal}
              />
            )}

            {activeTab === 'invoicing' && (
              <InvoicingView
                key="invoicing"
                consignments={filteredConsignments}
                currentUser={currentUser}
                currentLang={lang}
                onCreateInvoice={handleCreateInvoice}
                onRecordPayment={handleRecordPayment}
                onOpenPrintModal={handleOpenPrintModal}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsView
                key="reports"
                consignments={filteredConsignments}
                exceptions={exceptions}
                auditLogs={auditLogs}
                currentUser={currentUser}
                currentLang={lang}
              />
            )}

            {activeTab === 'audit' && (
              <AuditView
                key="audit"
                auditLogs={auditLogs}
                currentLang={lang}
              />
            )}

            {activeTab === 'settings' && (
              <PolicyView
                key="settings"
                currentLang={lang}
              />
            )}
          </AnimatePresence>
          </div>

          {/* Clean Professional Footer - Anchored at bottom */}
          <footer className="mt-10 pt-4 pb-2 border-t border-slate-200/90 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
              <span className="font-semibold text-slate-700">
                Sistem Manajemen Keamanan Kargo & Disposisi Bandara v1.7
              </span>
            </div>
            <div className="text-slate-600 text-xs font-medium">
              Powered by <span className="font-semibold text-slate-900">PT. Manggala Utama Indonesia - Solusi Sistem Terintegrasi 2026</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsMobileNavOpen(false);
        }}
        onOpenMobileMenu={() => setIsMobileNavOpen(true)}
        pendingXrayCount={consignments.filter((c) => c.status === 'AWAITING_XRAY').length}
        pendingAvsecCount={consignments.filter((c) => c.status === 'AWAITING_AVSEC' || c.status === 'XRAY_HOLD').length}
        currentLang={lang}
        currentUser={currentUser}
      />

      {/* Modals */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        consignments={consignments}
        onAddNewConsignment={handleAddNewConsignment}
        onLogScanEvent={(barcode, res) => {
          const audit: AuditEvent = {
            id: `AUD-${Date.now().toString().slice(-5)}`,
            occurredAt: new Date().toLocaleTimeString(),
            actor: currentUser.name,
            role: currentUser.role,
            action: 'BARCODE_SCAN_EVENT',
            entityType: 'CONSIGNMENT',
            entityId: barcode,
            description: `Physical scanner input registered for [${barcode}]. Idempotent check passed.`,
            criticalControlMet: true,
            correlationId: `TX-SCAN-${Date.now().toString().slice(-4)}`,
          };
          setAuditLogs((prev) => [audit, ...prev]);
        }}
      />

      <PieceModal
        isOpen={isPieceModalOpen}
        onClose={() => setIsPieceModalOpen(false)}
        consignment={selectedConsignment}
        onUpdatePieceHandover={handleUpdatePieceHandover}
      />

      <XRayModal
        isOpen={isXRayModalOpen}
        onClose={() => setIsXRayModalOpen(false)}
        consignment={selectedConsignment}
        currentUser={currentUser}
        onRecordXRayResult={handleRecordXRayResult}
        onRecordAVSECDecision={handleRecordAVSECDecision}
      />

      <DOModal
        isOpen={isDOModalOpen}
        onClose={() => setIsDOModalOpen(false)}
        consignment={selectedConsignment}
        currentUser={currentUser}
        onIssueDO={handleIssueDO}
        onConfirmHandover={handleConfirmHandover}
        onOpenPrintModal={handleOpenPrintModal}
      />

      <ExceptionModal
        isOpen={isExceptionModalOpen}
        onClose={() => setIsExceptionModalOpen(false)}
        exceptions={exceptions}
        selectedConsignment={selectedConsignment}
        onResolveException={handleResolveException}
        onCreateException={handleCreateException}
      />

      <ShiftModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        shiftData={shiftData}
        currentUser={currentUser}
        onAcknowledgeShift={handleAcknowledgeShift}
      />

      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        auditLogs={auditLogs}
      />

      {/* PRD v1.7: Official Aviation Document Print & PDF Export Modal */}
      <DocumentPrintModal
        isOpen={isDocumentPrintModalOpen}
        onClose={() => setIsDocumentPrintModalOpen(false)}
        documentType={printDocumentType}
        consignment={printConsignment || selectedConsignment || consignments[0]}
        shiftData={shiftData}
        currentUser={currentUser}
      />
    </div>
  );
}
