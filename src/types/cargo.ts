// PRD v1.3 Section 3 & AC-058: Four application roles only.
// AVSEC is NOT an application user/login. AVSEC is an external authority
// whose signature/confirmation is recorded by Admin or Checker.
export type UserRole =
  | 'SUPERADMIN'
  | 'MANAGERIAL'
  | 'ADMIN'
  | 'ADMIN_CSD'
  | 'CHECKER'
  | 'HANDLER'
  | 'DRIVER';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  badgeId: string;
  avatarColor: string;
  initials: string;
  station: string;
  dutyStatus: 'Online' | 'In Screening' | 'Reviewing' | 'On Break' | 'Active';
}

export type ConsignmentStatus =
  | 'RECEIVED'
  | 'DATA_EXCEPTION'
  | 'PIECE_RECONCILIATION'
  | 'AWAITING_XRAY'
  | 'XRAY_HOLD'
  | 'XRAY_REVIEW_REQUIRED'
  | 'XRAY_REJECTED'
  | 'AWAITING_AVSEC'
  | 'AVSEC_REJECTED_OR_HELD'
  | 'AVSEC_APPROVED'
  | 'FIT_TO_FLY_CONFIRMED'
  | 'DO_DRAFT'
  | 'DO_ISSUED'
  | 'LOADING_SEALED'
  | 'IN_TRANSIT_LINE1'
  | 'AWAITING_WAREHOUSE_HANDOVER'
  | 'HANDOVER_DISCREPANCY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PieceStatus =
  | 'REGISTERED'
  | 'RECEIVED'
  | 'AWAITING_XRAY'
  | 'XRAY_PASS'
  | 'XRAY_HOLD'
  | 'XRAY_REVIEW_REQUIRED'
  | 'XRAY_REJECTED'
  | 'AVSEC_PENDING'
  | 'FIT_TO_FLY_CONFIRMED'
  | 'DO_ASSIGNED'
  | 'LOADED_SEALED'
  | 'HANDED_OVER'
  | 'DISCREPANCY'
  | 'CANCELLED';

export type XRayResult = 'PASS' | 'HOLD' | 'REVIEW_REQUIRED' | 'REJECT';

export interface Piece {
  id: string;
  pieceNo: number;
  barcode: string;
  weightKg: number;
  dimensionsCm: string; // e.g. "40x30x25"
  status: PieceStatus;
  xrayResult?: XRayResult;
  xrayTimestamp?: string;
  xrayOperator?: string;
  scannedAtHandover?: boolean;
  notes?: string;
}

export interface XRayInspection {
  id: string;
  inspectedAt: string;
  operatorId: string;
  operatorName: string;
  stationId: string;
  scannerModel: string;
  result: XRayResult;
  notes: string;
  dataVersion: number;
  densityLevel: 'Low' | 'Medium' | 'High' | 'Suspicious';
  threatClass?: 'None' | 'Organic Mass' | 'Shielded Object' | 'Battery/Hazmat' | 'Unidentified';
  imageSimUrl?: string;
}

// PRD v1.3 §4.5 & FR-08: AVSEC Confirmation recorded by Checker/Admin
export interface AVSECReview {
  id: string;
  decidedAt: string;
  officerId: string;
  officerName: string; // External AVSEC Inspector Name
  decision: 'APPROVED' | 'REJECTED' | 'HELD_FOR_SECONDARY';
  reason: string;
  reviewedDataVersion: number;
  securityStampNo: string;
  recordedByChecker: string; // Checker/Admin who logged it
  signatureAttachmentRef?: string;
  fitToFlyStatus: 'FIT_TO_FLY' | 'HELD' | 'UNFIT';
}

// PRD v1.3 §4.9 & FR-19: Document & Physical Checklist
export interface ChecklistItem {
  id: string;
  code: string;
  label: string;
  category: 'DOCUMENT' | 'PHYSICAL_PACKAGE' | 'DANGEROUS_GOODS';
  passed: boolean;
  notes?: string;
}

export interface DocumentChecklist {
  id: string;
  consignmentId: string;
  checkerId: string;
  checkerName: string;
  checkedAt: string;
  items: ChecklistItem[];
  overallStatus: 'PASSED' | 'FAILED_BLOCKED' | 'PENDING_DATA';
  discrepancyNotes?: string;
}

// PRD v1.3 §4.10 & FR-20: Manual & EVD Inspection (Alat Pendeteksi Barang Terlarang)
export interface ManualEVDInspection {
  id: string;
  consignmentId: string;
  pieceId?: string;
  pieceBarcode?: string;
  inspectionType: 'MANUAL_PHYSICAL' | 'EVD_TRACE_DETECTOR';
  deviceReference: string; // e.g. "Smiths IONSCAN 600 EVD"
  swabLocation: 'Handles/Latches' | 'Cardboard Seam' | 'Ventilation Hole' | 'Internal Liner';
  result: 'CLEAR' | 'SUSPICIOUS_TRACE' | 'FAIL_ALARM';
  threatDetected?: string; // e.g. "None (Clean)", "Particulate Nitro-Aromatic trace"
  inspectedAt: string;
  recordedBy: string;
  notes: string;
}

// PRD v1.3 §4.10 & AC-064: Surat Reject Resmi
export interface RejectLetter {
  id: string;
  rejectNo: string; // e.g. "REJ-2026-CGK-084"
  consignmentId: string;
  awbNumber: string;
  issuedAt: string;
  issuedBy: string;
  reasonCode: string;
  reasonDetail: string;
  evidenceRef: string;
  actionRequired: string;
  status: 'ISSUED' | 'ACKNOWLEDGED_BY_SHIPPER';
}

// PRD v1.3 §4.10 & AC-065: Permintaan Data Tambahan
export interface AdditionalDataRequest {
  id: string;
  consignmentId: string;
  awbNumber: string;
  requestedFields: string[];
  requestedFrom: string; // Shipper or Regulated Agent
  requestedBy: string;
  requestedAt: string;
  status: 'PENDING_RESPONSE' | 'RESPONDED_UNDER_REVIEW' | 'VERIFIED_ACCEPTED' | 'REJECTED';
  dueAt: string;
  responseNotes?: string;
  attachmentName?: string;
}

// PRD v1.3 §4.11 & FR-21: Penimbangan Barang
export interface WeighingRecord {
  id: string;
  consignmentId: string;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  chargeableWeightKg: number;
  volumeWeightKg: number;
  dimensionsSummary: string;
  scaleReference: string; // e.g. "DIGI-SCALE-T2-08 (Kalibrasi Metrologi 2026)"
  ticketReference: string; // e.g. "TKT-WGH-88129"
  weighedBy: string;
  weighedAt: string;
  varianceNote?: string;
}

// PRD v1.3 §4.12 & FR-21: CSD (Cargo Security Declaration) & STK (Surat Tugas Kargo)
export interface CargoSecurityDoc {
  id: string;
  documentType: 'CSD' | 'STK';
  documentNo: string; // e.g. "CSD-2026-ID-88124" or "STK-2026-0941"
  consignmentId: string;
  version: number;
  status: 'DRAFT' | 'ISSUED' | 'AMENDED';
  securityStatus: 'SPX' | 'SCO' | 'SHR'; // Secure for Passenger & Cargo Aircraft
  regulatedAgentName: string;
  issuedBy: string;
  issuedAt: string;
  screeningMethod: string;
  validUntil: string;
}

// PRD v1.3 §4.13 & FR-22: Loading, Segel & Dispatch Line 1
export interface LoadingSealRecord {
  id: string;
  consignmentId: string;
  truckPlateNo: string; // e.g. "B 9841 UXR (Truk Box Line 1)"
  truckCapacityTons: number;
  driverName: string;
  driverId: string;
  routeCode: string; // "Line 1 - Landside to Airside Warehouse"
  sealNumber: string; // e.g. "SEAL-GAT-77401"
  sealCondition: 'INTACT_PERFECT' | 'TAMPER_EVIDENT_ACTIVE' | 'DAMAGED';
  loadedPieces: number;
  loadedBy: string;
  loadedAt: string;
  departedAt?: string;
  dispatchStatus: 'PENDING_LOADING' | 'LOADED_AND_SEALED' | 'IN_TRANSIT_LINE1' | 'ARRIVED_AIRSIDE';
}

// PRD v1.3 §4.13 & AC-072: Penerimaan Maskapai & BTB (Bukti Timbang Barang)
export interface GoodsReceiptBTB {
  id: string;
  receiptNo: string; // e.g. "BTB-GA-2026-55102"
  consignmentId: string;
  awbNumber: string;
  airlineWarehouse: string;
  receivedByName: string; // Airline receiving officer
  receivedAt: string;
  expectedPieces: number;
  actualPieces: number;
  expectedWeightKg: number;
  actualWeightKg: number;
  condition: 'INTACT_SEAL' | 'MINOR_TEAR' | 'DAMAGED' | 'SEAL_BROKEN';
  status: 'MATCHED' | 'DISCREPANCY';
  notes: string;
  attachedSignatureRef?: string;
}

// PRD v1.7 §8A.1, §8B & AC-109: Unloading di Gatrans & Penerimaan Awal
export interface ReceivingRecord {
  id: string;
  consignmentId: string;
  smuNumber: string; // Surat Muatan Udara
  ptiNumber: string; // Pemberitahuan Tentang Isi
  shipperAgent: string;
  receivedAt: string;
  receivedBy: string;
  koliDeclared: number;
  koliCounted: number;
  packagingCondition: 'BAIK_UTUH' | 'RUSAK_SOBEK' | 'SEGEL_TIDAK_STANDAR' | 'BASAH_REMBES';
  custodyTransferTo: string; // e.g. "Operator X-Ray Tunnel 01"
  notes: string;
  evidenceRef?: string;
}

// PRD v1.7 §8A.1, §8B & AC-110: Form Checker
export interface CheckerForm {
  id: string;
  consignmentId: string;
  checkerId: string;
  checkerName: string;
  documentStatus: 'LENGKAP' | 'TIDAK_LENGKAP' | 'EXCEPTION';
  physicalStatus: 'SESUAI' | 'SELISIH_KOLI' | 'KEMASAN_RUSAK';
  discrepancyCount: number;
  notes: string;
  createdAt: string;
  custodyPassed: boolean;
}

// PRD v1.7 §4.4, §8A.1, §8B, AC-076–083: Dangerous Goods (DG) Review & Disposisi
export type DGDisposition =
  | 'DG_FIT_TO_FLY'
  | 'DATA_REQUIRED_HOLD'
  | 'REJECTED_PENDING_RETURN';

export interface DGReview {
  id: string;
  consignmentId: string;
  officerName: string; // DG Certified Officer
  officerLicense: string; // e.g. "DG-CAT6-ID-2024-889"
  reviewedAt: string;
  unNumber?: string; // e.g. "UN 3481"
  properShippingName?: string; // e.g. "Lithium Ion Batteries Contained in Equipment"
  hazardClass?: string; // e.g. "Class 9 - Miscellaneous"
  packingGroup?: 'I' | 'II' | 'III' | 'N/A';
  disposition: DGDisposition;
  checklistPassed: boolean;
  declarationAttached: boolean;
  notes: string;
  rejectionReasonCode?: string;
  rejectionLetterRef?: string;
  returnRef?: string;
}

// PRD v1.7 §8A.5, §8B & AC-116: Pengembalian Fisik Barang Reject (Cargo Return)
export interface CargoReturnRecord {
  id: string;
  consignmentId: string;
  rejectionLetterRef: string;
  returnedAt: string;
  handedOverBy: string; // Staf Gatrans
  receivedByName: string; // Pihak Ekspedisi / Shipper
  receiverIdCard: string; // NIK / KTP
  koliReturned: number;
  condition: string;
  officialReceiptNumber: string;
  notes: string;
}

// PRD v1.3 §4.14 & FR-23 & PRD v1.7 §8A.3: Basic Invoicing & Payment (Cash vs Kredit)
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  method: 'CASH' | 'BANK_TRANSFER' | 'CREDIT_ACCOUNT' | 'GIRO';
  paidAt: string;
  reference: string;
  recordedBy: string;
  status: 'SETTLED' | 'PENDING_CLEARANCE';
}

export interface BasicInvoice {
  id: string;
  invoiceNo: string; // e.g. "INV-2026-0492"
  consignmentId: string;
  awbNumber: string;
  invoiceDate: string;
  dueDate: string; // PRD v1.7 §8A.3: Jatuh tempo untuk kredit
  paymentTerms: 'IMMEDIATE' | 'NET_14' | 'NET_30';
  billTo: string;
  agentId: string;
  agentName: string;
  paymentType: 'CASH' | 'CREDIT'; // PRD v1.7: Jalur Cash (Kasir) vs Kredit (Finance)
  status: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'VOIDED';
  version: number;
  createdBy: string;
  sentToAgentAt?: string;
  operationalStatus: string; // PRD v1.7 AC-126: Status operasional dipisah dari finansial
  items: InvoiceItem[];
  subtotal: number;
  taxPpn: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  payments: PaymentRecord[];
}

export interface DeliveryOrder {
  id: string;
  doNumber: string;
  version: number;
  status: 'DRAFT' | 'PENDING_VERIFICATION' | 'ISSUED' | 'AMENDED' | 'CANCELLED';
  issuedAt?: string;
  issuedBy?: string;
  dispatcherName?: string;
  carrier: string;
  flightNo: string;
  destination: string;
  customsSealNo: string;
  totalPieces: number;
  totalGrossWeightKg: number;
}

export interface ProofOfHandover {
  id: string;
  proofNo: string;
  handoverTime: string;
  doNumber: string;
  handedOverBy: string; // Dispatch officer
  receivedBy: string; // Warehouse receiver
  airlineWarehouse: string;
  plannedPieces: number;
  actualPieces: number;
  conditionStatus: 'INTACT_SEAL' | 'MINOR_TEAR' | 'DAMAGED_CRUSHED' | 'SEAL_BROKEN';
  digitalSignature: string;
  notes: string;
  verifiedPieceIds: string[];
}

export interface ExceptionCase {
  id: string;
  caseNo: string;
  category:
    | 'BARCODE_UNREADABLE'
    | 'CSD_MISMATCH'
    | 'XRAY_THREAT_HOLD'
    | 'EVD_ALARM'
    | 'PIECE_COUNT_MISMATCH'
    | 'PIECE_IDENTITY_CONFLICT'
    | 'AVSEC_REJECTED'
    | 'DO_VERIFICATION_FAILED'
    | 'SEAL_TAMPERED'
    | 'HANDOVER_DISCREPANCY'
    | 'SYSTEM_OFFLINE_RECON';
  title: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING_REVIEW' | 'RESOLVED' | 'CLOSED';
  consignmentId: string;
  awbNumber: string;
  pieceId?: string;
  assignedTo: string;
  createdAt: string;
  dueAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  chronology: {
    timestamp: string;
    actor: string;
    action: string;
    note: string;
  }[];
}

export interface Consignment {
  id: string;
  awbNumber: string;
  sourceReference: string; // e.g. "CSD-2026-ID-8831"
  dataVersion: number;
  shipper: string;
  consignee: string;
  origin: string; // e.g. "CGK"
  destination: string; // e.g. "NRT", "SIN", "DOH", "DXB"
  airline: string; // e.g. "Garuda Indonesia", "Singapore Airlines", "Qatar Cargo"
  flightNo: string;
  departureTime: string;
  cutoffTime: string;
  natureOfGoods: string;
  specialHandling?: string; // "PERISHABLE", "DGR-CLASS 9", "VALUABLE", "GENERAL"
  totalDeclaredPieces: number;
  totalReceivedPieces: number;
  totalWeightKg: number;
  status: ConsignmentStatus;
  slaStatus: 'NOMINAL' | 'WARNING' | 'OVERDUE';
  slaMinutesRemaining: number;
  priority: 'HIGH' | 'MEDIUM' | 'NORMAL';
  pieces: Piece[];
  xrayInspections: XRayInspection[];
  avsecReview?: AVSECReview;
  deliveryOrder?: DeliveryOrder;
  proofOfHandover?: ProofOfHandover;
  exceptionIds: string[];
  createdAt: string;
  lastUpdatedAt: string;

  // PRD v1.3 Extensions
  checklist?: DocumentChecklist;
  evdInspections?: ManualEVDInspection[];
  rejectLetter?: RejectLetter;
  dataRequests?: AdditionalDataRequest[];
  weighing?: WeighingRecord;
  csdDoc?: CargoSecurityDoc;
  stkDoc?: CargoSecurityDoc;
  loadingSeal?: LoadingSealRecord;
  goodsReceiptBTB?: GoodsReceiptBTB;
  invoice?: BasicInvoice;

  // PRD v1.7 Extensions
  receivingRecord?: ReceivingRecord;
  checkerForm?: CheckerForm;
  dgReview?: DGReview;
  cargoReturn?: CargoReturnRecord;
}

// PRD v1.6 & v1.7 §4.11, FR-11 & AC-084-085: Roster Shift Personel
export interface ShiftRosterStaff {
  id: string;
  name: string;
  roleCategory: 'MANAGER_SHIFT' | 'SUPERVISOR_SHIFT' | 'DG_OFFICER' | 'SENIOR_AVSEC' | 'OPERATIONAL_STAFF';
  jobTitle: string;
  whatsappNumber: string;
  assignment: string;
  isActive: boolean;
}

export interface ShiftHandover {
  id: string;
  shiftCode: string; // e.g. "SHIFT-1 (06:00 - 14:00)"
  date: string;
  station: string;
  outgoingSupervisor: string;
  incomingSupervisor: string;
  outgoingManager?: string; // PRD v1.6/v1.7 AC-086
  incomingManager?: string;
  status: 'PENDING_ACKNOWLEDGMENT' | 'ACKNOWLEDGED' | 'REJECTED';
  managerAckStatus?: 'PENDING_ACKNOWLEDGMENT' | 'ACKNOWLEDGED' | 'REJECTED';
  managerRejectReason?: string;
  acknowledgedAt?: string;
  roster?: ShiftRosterStaff[]; // PRD v1.6/v1.7 5 categories
  addenda?: {
    id: string;
    createdAt: string;
    createdBy: string;
    reason: string;
    note: string;
  }[];
  summary: {
    totalAccepted: number;
    totalXrayed: number;
    totalAvsecCleared: number;
    totalDoIssued: number;
    totalDelivered: number;
    openExceptionsCount: number;
    pendingXrayCount: number;
    pendingAvsecCount: number;
    undeliveredDoCount: number;
  };
  handoverNotes: string;
  openItems: {
    refType: 'AWB' | 'EXCEPTION' | 'DO';
    refId: string;
    detail: string;
    actionRequired: string;
  }[];
}

export interface AuditEvent {
  id: string;
  occurredAt: string;
  actor: string;
  role: UserRole;
  action: string;
  entityType:
    | 'CONSIGNMENT'
    | 'PIECE'
    | 'CHECKLIST'
    | 'XRAY'
    | 'EVD'
    | 'AVSEC'
    | 'WEIGHING'
    | 'CSD_STK'
    | 'LOADING_SEAL'
    | 'DISPATCH_LINE1'
    | 'BTB_RECEIPT'
    | 'DO'
    | 'HANDOVER'
    | 'INVOICE'
    | 'PAYMENT'
    | 'EXCEPTION';
  entityId: string;
  description: string;
  changes?: {
    field: string;
    before: string;
    after: string;
  }[];
  criticalControlMet: boolean;
  correlationId: string;
}

// Operational Team Chat Interfaces
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatarColor: string;
  senderInitials: string;
  recipientId?: string; // undefined if channel message
  channelId?: string;   // 'GENERAL_OPS' | 'SECURITY_XRAY' | 'LINE1_DISPATCH' | 'FINANCE_BILLING'
  content: string;
  timestamp: string;
  awbReference?: string;
  isPriorityAlert?: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  iconType: 'GENERAL' | 'SECURITY' | 'DISPATCH' | 'FINANCE';
  unreadCount?: number;
}

export type NavTab =
  | 'dashboard'
  | 'executive'
  | 'chat'
  | 'consignments'
  | 'checklist'
  | 'xray'
  | 'avsec'
  | 'weighing'
  | 'dispatch'
  | 'handover'
  | 'kanban'
  | 'exceptions'
  | 'invoicing'
  | 'reports'
  | 'shift'
  | 'audit'
  | 'settings';

export const ROLE_ALLOWED_TABS: Record<UserRole, NavTab[]> = {
  SUPERADMIN: [
    'dashboard',
    'executive',
    'chat',
    'consignments',
    'checklist',
    'xray',
    'avsec',
    'weighing',
    'dispatch',
    'handover',
    'kanban',
    'exceptions',
    'invoicing',
    'reports',
    'shift',
    'audit',
    'settings',
  ],
  MANAGERIAL: [
    'executive',
    'dashboard',
    'chat',
    'reports',
    'invoicing',
    'consignments',
    'shift',
    'audit',
    'exceptions',
  ],
  ADMIN: [
    'dashboard',
    'executive',
    'chat',
    'consignments',
    'checklist',
    'xray',
    'avsec',
    'weighing',
    'dispatch',
    'handover',
    'kanban',
    'exceptions',
    'invoicing',
    'reports',
    'shift',
    'audit',
    'settings',
  ],
  ADMIN_CSD: [
    'dashboard',
    'chat',
    'consignments',
    'weighing',
    'checklist',
    'invoicing',
    'reports',
    'shift',
  ],
  CHECKER: [
    'dashboard',
    'chat',
    'consignments',
    'checklist',
    'xray',
    'avsec',
    'kanban',
    'exceptions',
    'reports',
    'shift',
  ],
  HANDLER: [
    'dashboard',
    'chat',
    'consignments',
    'weighing',
    'dispatch',
    'handover',
    'kanban',
    'shift',
  ],
  DRIVER: [
    'dashboard',
    'chat',
    'dispatch',
    'handover',
    'shift',
  ],
};
