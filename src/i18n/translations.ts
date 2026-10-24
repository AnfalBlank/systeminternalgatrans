export type Language = 'id' | 'en';

export const translations = {
  id: {
    // Brand & App
    appName: 'Gatrans',
    appSub: 'Management Operations System',
    operationalCore: 'Operasional Utama',
    shiftActive: 'Shift 1 Aktif',
    shiftHours: '06:00 - 14:00',
    terminalCargo: 'Gerbang Kargo Terminal 2',
    slaComplianceRate: 'Kepatuhan Target SLA: 96.4%',
    shiftLogbookBtn: 'Logbook & Serah Terima Shift',

    // Sidebar
    navDashboard: 'Dasbor',
    navConsignments: 'Konsinyasi Kargo',
    navXray: 'Pemeriksaan X-Ray',
    navKanban: 'Papan Disposisi',
    navAvsec: 'Validasi AVSEC',
    navExceptions: 'Eksepsi & Insiden',
    navHandover: 'DO & Serah Terima (PoH)',
    navShift: 'Logbook Shift',
    navAudit: 'Jejak Audit',
    navSettings: 'SOP & Kebijakan SLA',

    // Header
    searchPlaceholder: 'Cari AWB, barcode koli, nomor DO, pengirim, penerbangan...',
    scannerSimBtn: 'Simulator Scanner',
    securityAlerts: 'Peringatan Keamanan & Operasional',
    activeAlerts: 'aktif',
    switchRoleTitle: 'Ganti Peran & Petugas (RBAC)',
    switchRoleSub: 'Uji hak akses peran & otorisasi wewenang operasional',

    // Greeting & Banner
    greetingMorning: 'Selamat pagi',
    greetingSubtitle: 'Berikut ringkasan operasional keamanan kargo & serah terima udara hari ini.',
    todayFilter: 'Hari Ini · Shift 1 (06:00 - 14:00)',

    // Metric Cards
    metricActiveConsignments: 'Konsinyasi Aktif',
    metricPiecesScreened: 'Koli Diperiksa X-Ray',
    metricPendingTriage: 'Menunggu AVSEC & Triage',
    metricDoIssued: 'Delivery Order (DO) Terbit',
    metricDeclaredUnits: 'Total Koli Terdaftar',
    metricCoverageRate: 'Tingkat Cakupan',
    metricAvgSla: 'Rata-rata SLA Triage: 6.2m',
    metricHandedOver: 'Koli Telah Diserahkan',
    metricVsLastShift: 'vs shift sebelumnya',

    // Bento: Pipeline
    bentoPipelineTitle: 'Alur Keamanan Kargo',
    bentoPipelineSub: 'Progres pergerakan fisik per koli',
    bentoViewAll: 'Lihat Semua',
    stageIntake: 'Penerimaan & Validasi Barcode',
    stageXray: 'Pemeriksaan X-Ray Dual-View',
    stageAvsec: 'Persetujuan Keamanan AVSEC',
    stageDO: 'Penerbitan DO & Serah Terima',
    formulaValidated: 'Rumus: Koli Tervalidasi / Terdaftar',

    // Bento: Donut
    bentoDonutTitle: 'Ringkasan Status Keamanan',
    bentoDonutSub: 'Klasifikasi koli secara real-time',
    totalPieces: 'Total Koli',
    statusCleared: 'Lolos (Pass)',
    statusScreening: 'Pemeriksaan',
    statusReview: 'Review Lanjutan',
    statusHold: 'Tahan/Tolak',

    // Bento: Flights
    bentoFlightsTitle: 'Jadwal Penerbangan Hari Ini',
    bentoFlightsSub: 'Pemantauan batas waktu cutoff & SLA',
    terminalCargoCGK: 'Terminal Kargo CGK',
    cutoff: 'Cutoff',
    slaEnforcement: 'Penegakan Batas Waktu SLA Operasional',
    zeroBypass: 'Tanpa Bypass Keamanan',

    // Bento: Personnel
    bentoPersonnelTitle: 'Petugas Jaga Aktif',
    bentoPersonnelSub: 'Penugasan stasiun & otorisasi keamanan',
    onDutyText: 'Shift 1 · 5 Petugas Jaga',
    separationDuties: 'Pemisahan Kewenangan Ditegakkan',
    rbacActive: 'RBAC Aktif',

    // Bento: Throughput
    bentoThroughputTitle: 'Throughput Pemeriksaan Kargo',
    bentoThroughputSub: 'Koli diproses per interval (Lolos vs Review vs Diserahkan)',
    modeHourly: 'Per Jam',
    mode7Days: '7 Hari',
    clearedPass: 'Lolos (Pass)',
    secondaryReview: 'Pemeriksaan Ulang',
    baselineCapacity: 'Kapasitas Dasar',
    calibrationText: 'Kalibrasi Tunnel Dual-View: 05:45',

    // Kanban
    kanbanTitle: 'Papan Alur Operasional Disposisi',
    kanbanSub: 'State machine operasional: Penerimaan ➔ X-Ray ➔ AVSEC ➔ DO ➔ Serah Terima Gudang',
    scanInboundCargo: '+ Scan Kargo Masuk',
    colIntake: 'Penerimaan & Antrean X-Ray',
    colScreening: 'Pemeriksaan & Triage',
    colAvsecDO: 'Validasi AVSEC & Draft DO',
    colHandover: 'DO Terbit & Serah Terima',
    emptyIntake: 'Tidak ada konsinyasi menunggu penerimaan',
    emptyScreening: 'Tidak ada koli yang ditahan/sedang ditinjau',
    emptyAvsec: 'Tidak ada konsinyasi menunggu penerbitan DO',
    emptyHandover: 'Tidak ada koli dalam proses serah terima',
    btnPieces: 'Koli',
    btnThreatHold: 'Tahan Keamanan',
    btnXrayScreening: 'Screening X-Ray',
    btnDraftIssueDO: 'Draft / Terbitkan DO',
    btnViewDO: 'Lihat DO',
    btnHandoverPoH: 'Serah Terima (PoH)',
    btnPoHVerified: 'PoH Terverifikasi',
    btnAddQueue: 'Tambah / Scan ke Antrean',

    // Footer
    systemFooter: 'Sistem Manajemen Keamanan Kargo & Disposisi Bandara v1.2',
    baselineUAT: 'Siap Operasional · Standar Keamanan Regulated Agent',

    // General Actions
    close: 'Tutup',
    cancel: 'Batal',
    save: 'Simpan',
    verify: 'Verifikasi',
    resolve: 'Selesaikan Kasus',
    acknowledge: 'Acknowledge & Tanda Tangani',
    downloadProject: 'Unduh Proyek (.ZIP)',
    downloadSuccess: 'File ZIP proyek sedang diunduh.',
  },
  en: {
    // Brand & App
    appName: 'Gatrans',
    appSub: 'Management Operations System',
    operationalCore: 'Operational Core',
    shiftActive: 'Shift 1 Active',
    shiftHours: '06:00 - 14:00',
    terminalCargo: 'Terminal 2 Cargo Gate',
    slaComplianceRate: 'SLA Target Compliance: 96.4%',
    shiftLogbookBtn: 'Shift Logbook & Handover',

    // Sidebar
    navDashboard: 'Dashboard',
    navConsignments: 'Consignments',
    navXray: 'X-Ray Screening',
    navKanban: 'Dispatch Board',
    navAvsec: 'AVSEC Validation',
    navExceptions: 'Exceptions & Incidents',
    navHandover: 'DO & Handover (PoH)',
    navShift: 'Shift Handover Log',
    navAudit: 'Audit Trail',
    navSettings: 'System SOP & SLA',

    // Header
    searchPlaceholder: 'Search AWB, piece ID, DO number, consignor, flight...',
    scannerSimBtn: 'Scanner Simulator',
    securityAlerts: 'Security & Operational Alerts',
    activeAlerts: 'active',
    switchRoleTitle: 'Switch Role & User (RBAC)',
    switchRoleSub: 'Test role-specific access & operational permissions',

    // Greeting & Banner
    greetingMorning: 'Good morning',
    greetingSubtitle: "Here's what's happening with cargo security & airside dispatch today.",
    todayFilter: 'Today · Shift 1 (06:00 - 14:00)',

    // Metric Cards
    metricActiveConsignments: 'Active Consignments',
    metricPiecesScreened: 'Pieces X-Ray Screened',
    metricPendingTriage: 'Pending AVSEC & Triage',
    metricDoIssued: 'Delivery Orders Issued',
    metricDeclaredUnits: 'Total Declared Pieces',
    metricCoverageRate: 'coverage rate',
    metricAvgSla: 'Avg triage SLA: 6.2m',
    metricHandedOver: 'Delivered',
    metricVsLastShift: 'vs last shift',

    // Bento: Pipeline
    bentoPipelineTitle: 'Cargo Security Pipeline',
    bentoPipelineSub: 'Piece-level stage progression',
    bentoViewAll: 'View All',
    stageIntake: 'Intake & Barcode Verification',
    stageXray: 'Dual-View X-Ray Screening',
    stageAvsec: 'AVSEC Clearance Decision',
    stageDO: 'Delivery Order & Handover',
    formulaValidated: 'Formula: Validated / Declared Units',

    // Bento: Donut
    bentoDonutTitle: 'Security & Triage Overview',
    bentoDonutSub: 'Real-time piece classification',
    totalPieces: 'Total Pieces',
    statusCleared: 'Cleared',
    statusScreening: 'Screening',
    statusReview: 'Review',
    statusHold: 'Hold/Reject',

    // Bento: Flights
    bentoFlightsTitle: "Today's Outbound Flights",
    bentoFlightsSub: 'Airside cutoff & SLA monitoring',
    terminalCargoCGK: 'CGK Cargo Terminal',
    cutoff: 'Cutoff',
    slaEnforcement: 'Operational SLA Enforcement',
    zeroBypass: 'Zero Security Bypass',

    // Bento: Personnel
    bentoPersonnelTitle: 'Active Duty Personnel',
    bentoPersonnelSub: 'Station assignments & security authorizations',
    onDutyText: 'Shift 1 · 5 On Duty',
    separationDuties: 'Separation of Duties enforced',
    rbacActive: 'RBAC Active',

    // Bento: Throughput
    bentoThroughputTitle: 'Cargo Screening Throughput',
    bentoThroughputSub: 'Pieces processed per interval (Pass vs Review vs Dispatched)',
    modeHourly: 'Hourly',
    mode7Days: '7 Days',
    clearedPass: 'Cleared (Pass)',
    secondaryReview: 'Secondary Review',
    baselineCapacity: 'Capacity Baseline',
    calibrationText: 'Dual-View Tunnel Calibration: 05:45',

    // Kanban
    kanbanTitle: 'Cargo Dispatch Kanban Board',
    kanbanSub: 'Operational state machine: Intake ➔ X-Ray ➔ AVSEC ➔ DO ➔ Warehouse Handover',
    scanInboundCargo: '+ Scan Inbound Cargo',
    colIntake: 'Intake & X-Ray Queue',
    colScreening: 'Screening & Triage',
    colAvsecDO: 'AVSEC & DO Draft',
    colHandover: 'Issued & Airline Handover',
    emptyIntake: 'No consignments pending intake',
    emptyScreening: 'No active threat holds or reviews',
    emptyAvsec: 'No consignments awaiting DO issuance',
    emptyHandover: 'No consignments in airside dispatch',
    btnPieces: 'Pieces',
    btnThreatHold: 'Threat Hold',
    btnXrayScreening: 'X-Ray Screening',
    btnDraftIssueDO: 'Draft / Issue DO',
    btnViewDO: 'View DO',
    btnHandoverPoH: 'Handover (PoH)',
    btnPoHVerified: 'PoH Verified',
    btnAddQueue: 'Add / Scan to Queue',

    // Footer
    systemFooter: 'Gatrans Management Operations System v1.2',
    baselineUAT: 'Production Ready · Aviation Security Standard',

    // General Actions
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    verify: 'Verify',
    resolve: 'Resolve Case',
    acknowledge: 'Acknowledge & Sign',
    downloadProject: 'Download Project (.ZIP)',
    downloadSuccess: 'Project archive (.ZIP) is downloading.',
  },
};
