import React, { useState } from 'react';
import {
  Consignment,
  UserProfile,
  ShiftHandover,
  BasicInvoice,
} from '../types/cargo';
import {
  Printer,
  Download,
  X,
  FileText,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  FileSpreadsheet,
  Receipt,
  Clock,
  Building2,
  QrCode,
  Barcode,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type DocumentType =
  | 'SURAT_REJECT_DG'
  | 'DELIVERY_ORDER'
  | 'POH_BTB'
  | 'CSD_STK'
  | 'INVOICE_RECEIPT'
  | 'SHIFT_HANDOVER';

interface DocumentPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: DocumentType;
  consignment?: Consignment | null;
  shiftData?: ShiftHandover | null;
  currentUser: UserProfile;
}

export const DocumentPrintModal: React.FC<DocumentPrintModalProps> = ({
  isOpen,
  onClose,
  documentType: initialDocType,
  consignment,
  shiftData,
  currentUser,
}) => {
  const [currentDocType, setCurrentDocType] = useState<DocumentType>(initialDocType);

  // Sync with prop change when opened
  React.useEffect(() => {
    setCurrentDocType(initialDocType);
  }, [initialDocType, isOpen]);

  if (!isOpen) return null;

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Download standalone HTML file
  const handleDownloadHTML = () => {
    const docElement = document.getElementById('printable-document-content');
    if (!docElement) return;

    const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${getDocumentTitle(currentDocType)} - ${consignment?.awbNumber || shiftData?.shiftCode || 'Dokumen'}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm 12mm; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 11px; line-height: 1.4; }
    .header-box { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
    .company-title { font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #1e3a8a; }
    .sub-title { font-size: 10px; color: #475569; }
    .doc-title-box { text-align: center; margin: 16px 0; border: 1px solid #cbd5e1; background: #f8fafc; padding: 10px; border-radius: 6px; }
    .doc-title { font-size: 15px; font-weight: bold; text-transform: uppercase; margin: 0; color: #0f172a; }
    .doc-no { font-family: monospace; font-size: 11px; font-weight: bold; color: #2563eb; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 10.5px; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
    th { background: #f1f5f9; font-weight: bold; color: #334155; }
    .sig-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 30px; }
    .sig-box { border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px; text-align: center; height: 105px; display: flex; flex-direction: column; justify-content: space-between; font-size: 9.5px; }
    .sig-line { border-bottom: 1px dashed #64748b; margin-top: 50px; font-weight: bold; }
    .watermark { position: fixed; top: 40%; left: 15%; font-size: 60px; color: rgba(148, 163, 184, 0.12); transform: rotate(-30deg); font-weight: bold; pointer-events: none; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="watermark">DOKUMEN RESMI BANDARA</div>
  ${docElement.innerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentDocType}_${consignment?.awbNumber || 'GATRANS'}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  function getDocumentTitle(type: DocumentType): string {
    switch (type) {
      case 'SURAT_REJECT_DG':
        return 'Surat Penolakan Resmi & Berita Acara DG (Rejection Letter)';
      case 'DELIVERY_ORDER':
        return 'Surat Muatan Udara / Delivery Order (DO) Lini 1';
      case 'POH_BTB':
        return 'Bukti Tanda Terima Barang (BTB) & Proof of Handover';
      case 'CSD_STK':
        return 'Consignment Security Declaration (CSD) & Surat Timbang';
      case 'INVOICE_RECEIPT':
        return 'Faktur Tagihan Kargo (Invoice) & Kuitansi Pembayaran';
      case 'SHIFT_HANDOVER':
        return 'Berita Acara Pergantian Shift & Roster Resmi v1.7';
    }
  }

  // Fallback consignment data if none selected
  const c = consignment || {
    id: 'CNS-001',
    awbNumber: '126-89412045',
    shipper: 'PT Astra Microelectronics Indonesia',
    consignee: 'Tokyo Electron Logistics Co.',
    airline: 'Garuda Indonesia Cargo',
    flightNo: 'GA-872',
    destination: 'NRT (Tokyo Narita)',
    origin: 'CGK (Jakarta Soekarno-Hatta)',
    natureOfGoods: 'Integrated Circuit Wafers & Sensors',
    totalDeclaredPieces: 12,
    totalReceivedPieces: 12,
    totalWeightKg: 284.5,
    specialHandling: 'FRAGILE · TEMP-CONTROLLED 20°C',
    deliveryOrder: {
      id: 'DO-8812',
      doNumber: 'DO-2026-GA-0419',
      version: 1,
      status: 'ISSUED' as const,
      issuedAt: '2026-10-24 08:35:10',
      carrier: 'Garuda Indonesia Cargo',
      flightNo: 'GA-872',
      destination: 'NRT',
      customsSealNo: 'SEAL-GAT-77401',
      totalPieces: 12,
      totalGrossWeightKg: 284.5,
    },
    pieces: [
      { id: 'P1', pieceNo: 1, barcode: '126-89412045-P01', weightKg: 23.7, dimensionsCm: '45x35x30', status: 'DO_ASSIGNED' as const },
      { id: 'P2', pieceNo: 2, barcode: '126-89412045-P02', weightKg: 23.7, dimensionsCm: '45x35x30', status: 'DO_ASSIGNED' as const },
      { id: 'P3', pieceNo: 3, barcode: '126-89412045-P03', weightKg: 23.7, dimensionsCm: '45x35x30', status: 'DO_ASSIGNED' as const },
      { id: 'P4', pieceNo: 4, barcode: '126-89412045-P04', weightKg: 23.7, dimensionsCm: '45x35x30', status: 'DO_ASSIGNED' as const },
    ],
    weighing: {
      id: 'WGH-001',
      consignmentId: 'CNS-001',
      grossWeightKg: 284.5,
      tareWeightKg: 14.5,
      netWeightKg: 270.0,
      chargeableWeightKg: 284.5,
      volumeWeightKg: 189.0,
      dimensionsSummary: '12 Koli @ 45x35x30 cm',
      scaleReference: 'DIGI-SCALE-T2-08 (Kalibrasi Metrologi 2026)',
      ticketReference: 'TKT-WGH-88129',
      weighedBy: 'Doni Kurniawan (Handler)',
      weighedAt: '2026-10-24 08:15',
    },
    csdDoc: {
      id: 'CSD-001',
      documentType: 'CSD' as const,
      documentNo: 'CSD-ID-2026-88124',
      consignmentId: 'CNS-001',
      version: 1,
      status: 'ISSUED' as const,
      securityStatus: 'SPX' as const,
      regulatedAgentName: 'PT Gatrans Cargo Angkasa Logistics (RA-0021)',
      issuedBy: 'Sarah Miller',
      issuedAt: '2026-10-24 08:20',
      screeningMethod: 'Dual-View X-Ray (Smiths HI-SCAN) + Visual Checklist',
      validUntil: '24 Jam sejak diterbitkan',
    },
    stkDoc: {
      id: 'STK-001',
      documentType: 'STK' as const,
      documentNo: 'STK-2026-0941',
      consignmentId: 'CNS-001',
      version: 1,
      status: 'ISSUED' as const,
      securityStatus: 'SPX' as const,
      regulatedAgentName: 'PT Gatrans Cargo Angkasa Logistics (RA-0021)',
      issuedBy: 'Doni Kurniawan',
      issuedAt: '2026-10-24 08:25',
      screeningMethod: 'Timbangan Digital Metrologi',
      validUntil: 'Selesai Muat',
    },
    loadingSeal: {
      id: 'LDS-001',
      consignmentId: 'CNS-001',
      truckPlateNo: 'B 9841 UXR (Truk Box Line 1)',
      truckCapacityTons: 5.0,
      driverName: 'Bambang Wijaya',
      driverId: 'USR-04',
      routeCode: 'Line 1 - Landside to Airside Warehouse',
      sealNumber: 'SEAL-GAT-77401',
      sealCondition: 'INTACT_PERFECT' as const,
      loadedPieces: 12,
      loadedBy: 'Doni Kurniawan (Handler)',
      loadedAt: '2026-10-24 08:40',
      dispatchStatus: 'LOADED_AND_SEALED' as const,
    },
    goodsReceiptBTB: {
      id: 'BTB-001',
      receiptNo: 'BTB-GA-2026-55102',
      consignmentId: 'CNS-001',
      awbNumber: '126-89412045',
      airlineWarehouse: 'Gudang Ekspor Lini 1 Garuda Cargo CGK',
      receivedByName: 'Yusuf Maulana (Staf Gudang Garuda)',
      receivedAt: '2026-10-24 09:15',
      expectedPieces: 12,
      actualPieces: 12,
      expectedWeightKg: 284.5,
      actualWeightKg: 284.5,
      condition: 'INTACT_SEAL' as const,
      status: 'MATCHED' as const,
      notes: 'Segel SEAL-GAT-77401 utuh dan sesuai manifest Line 1.',
    },
    invoice: {
      id: 'INV-001',
      invoiceNo: 'INV-2026-0492',
      consignmentId: 'CNS-001',
      awbNumber: '126-89412045',
      invoiceDate: '2026-10-24',
      dueDate: '2026-11-07',
      paymentTerms: 'NET_14' as const,
      billTo: 'PT Astra Microelectronics Indonesia',
      agentId: 'AGT-01',
      agentName: 'PT Nusantara Jaya Logistik',
      paymentType: 'CREDIT' as const,
      status: 'PAID' as const,
      version: 1,
      createdBy: 'Budi Santoso (Finance)',
      operationalStatus: 'DELIVERED (Gudang Maskapai)',
      items: [
        { id: '1', description: 'Pemeriksaan X-Ray Dual-View Radiasi (12 Koli)', quantity: 12, unitPrice: 35000, total: 420000 },
        { id: '2', description: 'Handling Kargo, Penimbangan & Terbit CSD/STK', quantity: 1, unitPrice: 250000, total: 250000 },
        { id: '3', description: 'Transportasi Truk Box Khusus Line 1 Airside', quantity: 1, unitPrice: 350000, total: 350000 },
        { id: '4', description: 'Penimbangan Digital Terkalibrasi Metrologi', quantity: 1, unitPrice: 75000, total: 75000 },
      ],
      subtotal: 1095000,
      taxPpn: 120450,
      totalAmount: 1215450,
      paidAmount: 1215450,
      remainingAmount: 0,
      payments: [
        {
          id: 'P-1',
          invoiceId: 'INV-001',
          amount: 1215450,
          method: 'BANK_TRANSFER' as const,
          paidAt: '2026-10-24 10:15',
          reference: 'TRF-BCA-994821',
          recordedBy: 'Budi Santoso (Kasir / Finance)',
          status: 'SETTLED' as const,
        },
      ],
    },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        {/* Backdrop - hide when printing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs no-print"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="bg-white rounded-2xl w-full max-w-4xl shadow-xl border border-slate-200/90 z-10 flex flex-col max-h-[96vh] overflow-hidden"
        >
          {/* Modal Header / Action Toolbar (Hidden during Print) */}
          <div className="px-5 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shrink-0 no-print">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <span>Pratinjau Cetak Dokumen Operasional</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Standar A4 Resmi
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Dokumen siap cetak ke printer fisik atau ekspor PDF dengan format resmi penerbangan.
                </p>
              </div>
            </div>

            {/* Document Switcher & Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={currentDocType}
                onChange={(e) => setCurrentDocType(e.target.value as DocumentType)}
                className="bg-slate-800 border border-slate-700 text-xs font-semibold text-white px-3 py-1.5 rounded-xl cursor-pointer focus:ring-2 focus:ring-blue-500"
              >
                <option value="SURAT_REJECT_DG">1. Surat Reject DG & Penolakan Resmi</option>
                <option value="DELIVERY_ORDER">2. Delivery Order (DO) Lini 1</option>
                <option value="POH_BTB">3. PoH & BTB Gudang Maskapai</option>
                <option value="CSD_STK">4. CSD & Surat Timbang Kargo (STK)</option>
                <option value="INVOICE_RECEIPT">5. Faktur Invoice & Kuitansi Pembayaran</option>
                <option value="SHIFT_HANDOVER">6. Berita Acara Pergantian Shift & Roster</option>
              </select>

              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
                title="Cetak langsung atau simpan sebagai PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / PDF (Ctrl+P)</span>
              </button>

              <button
                onClick={handleDownloadHTML}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Unduh salinan HTML mandiri"
              >
                <Download className="w-3.5 h-3.5 text-slate-300" />
                <span>Unduh File</span>
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body / Paper Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 flex justify-center">
            {/* Printable Document Sheet (A4 Proportion) */}
            <div
              id="printable-document-root"
              className="bg-white text-slate-900 w-full max-w-[210mm] min-h-[297mm] p-6 sm:p-10 rounded-xl sm:rounded-2xl shadow-md border border-slate-300/80 relative text-[11px] leading-relaxed flex flex-col justify-between"
            >
              <div id="printable-document-content" className="space-y-4">
                {/* Official Letterhead (KOP SURAT RESMI) */}
                <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-xl tracking-tighter shrink-0 border border-blue-950">
                      GAT
                    </div>
                    <div>
                      <div className="text-[13px] font-black uppercase tracking-wider text-blue-950 leading-tight">
                        PT. MANGGALA UTAMA INDONESIA
                      </div>
                      <div className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">
                        Divisi Operasional & Manajemen Keamanan Kargo Bandara (Gatrans)
                      </div>
                      <div className="text-[9.5px] text-slate-500 leading-normal mt-0.5">
                        Area Kargo Terpadu Lini 1, Bandara Internasional Soekarno-Hatta (CGK), Banten 19120 · Telp: (021) 550-8901 · Email: ops.cargo@manggalautama.web.id
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[9px] font-mono text-slate-400">ICAO Annex 17 / KM 211</div>
                    <div className="px-2 py-0.5 bg-slate-100 text-slate-800 font-mono font-bold text-[9px] rounded border border-slate-300 mt-1 inline-block">
                      REGULATED AGENT #RA-0021
                    </div>
                  </div>
                </div>

                {/* =========================================================================
                    DOCUMENT 1: SURAT REJECT RESMI & BERITA ACARA DG
                   ========================================================================= */}
                {currentDocType === 'SURAT_REJECT_DG' && (
                  <div className="space-y-4">
                    <div className="text-center py-2 px-3 bg-rose-50/70 border border-rose-300 rounded-lg">
                      <h2 className="text-sm font-black text-rose-950 uppercase tracking-wide">
                        BERITA ACARA & SURAT PENOLAKAN RESMI KARGO (REJECTION NOTICE)
                      </h2>
                      <div className="text-[10px] text-rose-800 font-medium">
                        Diterbitkan Berdasarkan Regulasi Keamanan Penerbangan ICAO Annex 17 & IATA Dangerous Goods Regulations
                      </div>
                      <div className="text-xs font-mono font-bold text-rose-900 mt-1">
                        Nomor Surat: {c.rejectLetter?.rejectNo || 'REJ-2026-CGK-084/DG'} · Tanggal: {c.rejectLetter?.issuedAt || '2026-10-24 08:55'}
                      </div>
                    </div>

                    {/* Metadata Kargo Grid */}
                    <div className="grid grid-cols-2 gap-3 text-[10.5px]">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="bg-slate-50 font-bold w-1/3 py-1 px-2 border border-slate-300">Nomor AWB / PTI:</td>
                            <td className="font-mono font-bold py-1 px-2 border border-slate-300">{c.awbNumber}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Pengirim (Shipper):</td>
                            <td className="py-1 px-2 border border-slate-300">{c.shipper}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Penerima (Consignee):</td>
                            <td className="py-1 px-2 border border-slate-300">{c.consignee}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Maskapai & Rute:</td>
                            <td className="py-1 px-2 border border-slate-300">{c.airline} ({c.flightNo}) · {c.origin} &rarr; {c.destination}</td>
                          </tr>
                        </tbody>
                      </table>

                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="bg-slate-50 font-bold w-1/3 py-1 px-2 border border-slate-300">Jumlah Koli Fisik:</td>
                            <td className="font-bold py-1 px-2 border border-slate-300">{c.totalReceivedPieces} Koli ({c.totalWeightKg} kg Gross)</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Deskripsi Barang:</td>
                            <td className="py-1 px-2 border border-slate-300">{c.natureOfGoods}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Status Disposisi DG:</td>
                            <td className="font-bold text-rose-700 py-1 px-2 border border-slate-300">REJECTED_PENDING_RETURN (Tolak Terbang)</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Klasifikasi Bahaya:</td>
                            <td className="py-1 px-2 border border-slate-300 font-semibold">{c.dgReview?.hazardClass || 'Class 9 - Miscellaneous / Undeclared Hazard'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Temuan & Alasan Penolakan */}
                    <div className="border border-slate-300 rounded-lg p-3 bg-slate-50/50 space-y-2">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>TEMUAN PEMERIKSAAN KEAMANAN & REGULASI DG:</span>
                        <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          KODE: {c.rejectLetter?.reasonCode || 'SEC_THREAT_ORGANIC_ALARM'}
                        </span>
                      </div>
                      <div className="text-[10.5px] text-slate-700 leading-normal">
                        {c.rejectLetter?.reasonDetail ||
                          'Pemeriksaan X-Ray Dual-View mendeteksi anomali penyerapan bahan berdensitas tinggi yang tidak dideklarasikan pada kemasan koli fisik. Pengujian lanjutan menggunakan alat pendeteksi residu (EVD Smiths IONSCAN 600) mengonfirmasi alarm partikel organik mencurigakan. Dokumen Dangerous Goods Declaration (DGD) tidak terlampir sesuai standar IATA DGR Bagian 8.'}
                      </div>
                      <div className="text-[10px] text-slate-600 bg-white p-2 rounded border border-slate-200">
                        <strong>Tindakan Wajib Operasional:</strong> Kargo berstatus HOLD permanen untuk penerbangan terjadwal. Dikeluarkan dari lini steril bandara dan diserah-terimakan kembali kepada pihak Agen / Shipper melalui Berita Acara Pengembalian Fisik Barang (Cargo Return Form).
                      </div>
                    </div>

                    {/* Form Serah Terima Pengembalian Kargo */}
                    <div className="border border-slate-300 rounded-lg p-3 bg-white space-y-2">
                      <div className="font-bold text-slate-900 text-[10.5px]">
                        REKONSILIASI PENGEMBALIAN FISIK BARANG (CARGO RETURN):
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10px]">
                        <div>Pihak Penyerah (Gatrans): <strong>Sarah Miller (Lead Checker)</strong></div>
                        <div>Pihak Penerima (Shipper): <strong>{c.shipper}</strong></div>
                        <div>Nomor KTP/Identitas: <strong>3174092108840003</strong></div>
                        <div>Jumlah Koli Kembali: <strong>{c.totalReceivedPieces} Koli Utuh</strong></div>
                        <div>Kondisi Segel: <strong>Disegel Label Karantina Merah</strong></div>
                        <div>Waktu Serah Terima: <strong>{new Date().toLocaleDateString('id-ID')} 09:30 WIB</strong></div>
                      </div>
                    </div>

                    {/* Signatures */}
                    <div className="grid grid-cols-4 gap-2 pt-2">
                      <div className="border border-slate-300 rounded p-2 text-center flex flex-col justify-between h-24">
                        <div className="text-[9px] font-bold text-slate-600 uppercase">Petugas DG Terakreditasi</div>
                        <div className="text-[8.5px] text-slate-400 italic font-mono">[Tanda Tangan & Lisensi]</div>
                        <div className="border-t border-slate-400 text-[9.5px] font-bold pt-1">Aris Setiawan (IATA Cat 6)</div>
                      </div>
                      <div className="border border-slate-300 rounded p-2 text-center flex flex-col justify-between h-24">
                        <div className="text-[9px] font-bold text-slate-600 uppercase">AVSEC Inspector (External)</div>
                        <div className="text-[8.5px] text-slate-400 italic font-mono">[Stempel & Validasi]</div>
                        <div className="border-t border-slate-400 text-[9.5px] font-bold pt-1">Mayor Bambang Suryo</div>
                      </div>
                      <div className="border border-slate-300 rounded p-2 text-center flex flex-col justify-between h-24">
                        <div className="text-[9px] font-bold text-slate-600 uppercase">Lead Checker Gatrans</div>
                        <div className="text-[8.5px] text-slate-400 italic font-mono">[Tanda Tangan Digital]</div>
                        <div className="border-t border-slate-400 text-[9.5px] font-bold pt-1">Sarah Miller (CHK-84920)</div>
                      </div>
                      <div className="border border-slate-300 rounded p-2 text-center flex flex-col justify-between h-24">
                        <div className="text-[9px] font-bold text-slate-600 uppercase">Wakil Agen / Pengirim</div>
                        <div className="text-[8.5px] text-slate-400 italic font-mono">[Tanda Tangan Penerima]</div>
                        <div className="border-t border-slate-400 text-[9.5px] font-bold pt-1">Perwakilan Shipper</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    DOCUMENT 2: DELIVERY ORDER (DO) RESMI LINI 1
                   ========================================================================= */}
                {currentDocType === 'DELIVERY_ORDER' && (
                  <div className="space-y-4">
                    <div className="text-center py-2 px-3 bg-blue-50/70 border border-blue-300 rounded-lg">
                      <h2 className="text-sm font-black text-blue-950 uppercase tracking-wide">
                        SURAT MUATAN UDARA & DELIVERY ORDER (DO) RESMI LINI 1 AIRSIDE
                      </h2>
                      <div className="text-[10px] text-blue-800 font-medium">
                        Izin Resmi Pengangkutan Kargo Steril Menuju Gudang Maskapai Lini 1 Airside
                      </div>
                      <div className="text-xs font-mono font-bold text-blue-900 mt-1">
                        Nomor DO: {c.deliveryOrder?.doNumber || 'DO-2026-GA-0419'} · Versi: v{c.deliveryOrder?.version || 1} · Status: RESMI TERBIT (ISSUED)
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10.5px]">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="bg-slate-50 font-bold w-1/3 py-1 px-2 border border-slate-300">Nomor AWB Induk:</td>
                            <td className="font-mono font-bold py-1 px-2 border border-slate-300">{c.awbNumber}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Pengirim (Shipper):</td>
                            <td className="py-1 px-2 border border-slate-300">{c.shipper}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Penerima (Consignee):</td>
                            <td className="py-1 px-2 border border-slate-300">{c.consignee}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Maskapai & Flight:</td>
                            <td className="py-1 px-2 border border-slate-300">{c.airline} · Penerbangan: {c.flightNo}</td>
                          </tr>
                        </tbody>
                      </table>

                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="bg-slate-50 font-bold w-1/3 py-1 px-2 border border-slate-300">Rute Lini 1:</td>
                            <td className="py-1 px-2 border border-slate-300">Gatrans Gateway &rarr; Gudang Lini 1 {c.airline}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Truk & Plat Nomor:</td>
                            <td className="py-1 px-2 border border-slate-300 font-bold">{c.loadingSeal?.truckPlateNo || 'B 9841 UXR (Truk Box Lini 1)'}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Nomor Segel Truk:</td>
                            <td className="font-mono font-bold text-blue-700 py-1 px-2 border border-slate-300">{c.loadingSeal?.sealNumber || 'SEAL-GAT-77401'} (UTUH)</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Pengemudi (Driver):</td>
                            <td className="py-1 px-2 border border-slate-300">{c.loadingSeal?.driverName || 'Bambang Wijaya (DRV-33102)'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Piece Manifest Table */}
                    <div>
                      <div className="font-bold text-[10.5px] text-slate-800 mb-1">
                        DAFTAR PIECE / KOLI TERVERIFIKASI DALAM MUATAN (REKONSILIASI FISIK PIECE-LEVEL):
                      </div>
                      <table className="w-full border-collapse text-[10px]">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="py-1 px-2 border border-slate-300 text-center w-10">No</th>
                            <th className="py-1 px-2 border border-slate-300">Barcode Koli</th>
                            <th className="py-1 px-2 border border-slate-300 text-center">Berat (kg)</th>
                            <th className="py-1 px-2 border border-slate-300 text-center">Dimensi (cm)</th>
                            <th className="py-1 px-2 border border-slate-300 text-center">Status X-Ray</th>
                            <th className="py-1 px-2 border border-slate-300 text-center">Segel / Kondisi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {c.pieces.slice(0, 5).map((p, idx) => (
                            <tr key={p.id}>
                              <td className="py-1 px-2 border border-slate-300 text-center font-mono">{idx + 1}</td>
                              <td className="py-1 px-2 border border-slate-300 font-mono font-bold">{p.barcode}</td>
                              <td className="py-1 px-2 border border-slate-300 text-center">{p.weightKg} kg</td>
                              <td className="py-1 px-2 border border-slate-300 text-center">{p.dimensionsCm}</td>
                              <td className="py-1 px-2 border border-slate-300 text-center text-emerald-700 font-bold">LULUS (PASS)</td>
                              <td className="py-1 px-2 border border-slate-300 text-center text-blue-700 font-semibold">SEALED & INTACT</td>
                            </tr>
                          ))}
                          <tr className="bg-slate-50 font-bold">
                            <td colSpan={2} className="py-1 px-2 border border-slate-300 text-right">TOTAL KOLI & BERAT MUATAN:</td>
                            <td className="py-1 px-2 border border-slate-300 text-center font-mono">{c.totalWeightKg} kg</td>
                            <td colSpan={3} className="py-1 px-2 border border-slate-300 text-left">{c.totalReceivedPieces} Koli Terverifikasi Siap Dispatch</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Security Declaration Stamp */}
                    <div className="p-2.5 rounded-lg border border-emerald-300 bg-emerald-50/60 text-[10px] text-emerald-950 flex items-center justify-between">
                      <div>
                        <strong>Pernyataan Keamanan Penerbangan (Security Cleared):</strong> Seluruh koli telah melalui penyaringan radiasi X-Ray Dual-View dan pemeriksaan fisik tanpa anomali. Disahkan oleh AVSEC Bandara dengan Stempel Keamanan No: <strong>AVSEC-CGK-2026-00502</strong>.
                      </div>
                      <div className="text-right font-mono font-bold text-emerald-800 shrink-0 ml-4">
                        STATUS: SPX (PASSENGER AIRCRAFT SAFE)
                      </div>
                    </div>

                    {/* Signatures */}
                    <div className="grid grid-cols-4 gap-2 pt-2">
                      <div className="border border-slate-300 rounded p-2 text-center flex flex-col justify-between h-24">
                        <div className="text-[9px] font-bold text-slate-600 uppercase">Dispatcher DO</div>
                        <div className="text-[8.5px] text-slate-400 italic font-mono">[Otorisasi Sistem]</div>
                        <div className="border-t border-slate-400 text-[9.5px] font-bold pt-1">Budi Santoso (Admin)</div>
                      </div>
                      <div className="border border-slate-300 rounded p-2 text-center flex flex-col justify-between h-24">
                        <div className="text-[9px] font-bold text-slate-600 uppercase">Petugas Loading & Segel</div>
                        <div className="text-[8.5px] text-slate-400 italic font-mono">[Verifikasi Fisik]</div>
                        <div className="border-t border-slate-400 text-[9.5px] font-bold pt-1">Doni Kurniawan (Handler)</div>
                      </div>
                      <div className="border border-slate-300 rounded p-2 text-center flex flex-col justify-between h-24">
                        <div className="text-[9px] font-bold text-slate-600 uppercase">Pengemudi Truk Line 1</div>
                        <div className="text-[8.5px] text-slate-400 italic font-mono">[Serah Terima Rute]</div>
                        <div className="border-t border-slate-400 text-[9.5px] font-bold pt-1">Bambang Wijaya (Driver)</div>
                      </div>
                      <div className="border border-slate-300 rounded p-2 text-center flex flex-col justify-between h-24">
                        <div className="text-[9px] font-bold text-slate-600 uppercase">Checker Verifikator</div>
                        <div className="text-[8.5px] text-slate-400 italic font-mono">[Pemeriksaan Akhir]</div>
                        <div className="border-t border-slate-400 text-[9.5px] font-bold pt-1">Sarah Miller (Checker)</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    DOCUMENT 3: BUKTI TANDA TERIMA BARANG (BTB) & PROOF OF HANDOVER
                   ========================================================================= */}
                {currentDocType === 'POH_BTB' && (
                  <div className="space-y-4">
                    <div className="text-center py-2 px-3 bg-cyan-50/70 border border-cyan-300 rounded-lg">
                      <h2 className="text-sm font-black text-cyan-950 uppercase tracking-wide">
                        BUKTI TANDA TERIMA BARANG (BTB) & DIGITAL PROOF OF HANDOVER (PoH)
                      </h2>
                      <div className="text-[10px] text-cyan-800 font-medium">
                        Pengesahan Serah Terima Fisik Kargo di Gudang Ekspor Lini 1 Maskapai
                      </div>
                      <div className="text-xs font-mono font-bold text-cyan-900 mt-1">
                        Nomor BTB: {c.goodsReceiptBTB?.receiptNo || 'BTB-GA-2026-55102'} · Ref DO: {c.deliveryOrder?.doNumber || 'DO-2026-GA-0419'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10.5px]">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="bg-slate-50 font-bold w-1/3 py-1 px-2 border border-slate-300">Nomor AWB:</td>
                            <td className="font-mono font-bold py-1 px-2 border border-slate-300">{c.awbNumber}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Penerima Gudang:</td>
                            <td className="font-bold py-1 px-2 border border-slate-300">{c.goodsReceiptBTB?.airlineWarehouse || 'Gudang Lini 1 Maskapai'}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Petugas Maskapai:</td>
                            <td className="py-1 px-2 border border-slate-300">{c.goodsReceiptBTB?.receivedByName || 'Yusuf Maulana (Airline Receiving Staff)'}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Waktu Kedatangan:</td>
                            <td className="py-1 px-2 border border-slate-300">{c.goodsReceiptBTB?.receivedAt || '2026-10-24 09:15 WIB'}</td>
                          </tr>
                        </tbody>
                      </table>

                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="bg-slate-50 font-bold w-1/3 py-1 px-2 border border-slate-300">Koli Rencana vs Aktual:</td>
                            <td className="font-bold py-1 px-2 border border-slate-300 font-mono">12 Koli / 12 Koli DITERIMA LENGKAP</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Berat Rencana vs Aktual:</td>
                            <td className="font-bold py-1 px-2 border border-slate-300 font-mono">284.5 kg / 284.5 kg MATCH</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Kondisi Segel Truk:</td>
                            <td className="py-1 px-2 border border-slate-300 text-emerald-700 font-bold">SEAL-GAT-77401 (UTUH & SESUAI DO)</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Status Rekonsiliasi:</td>
                            <td className="py-1 px-2 border border-slate-300 text-emerald-700 font-bold">MATCHED (NIHIL SELISIH)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="border border-slate-300 rounded-lg p-3 bg-slate-50 text-[10px] space-y-1">
                      <div className="font-bold text-slate-800">CATATAN PETUGAS PENERIMA MASKAPAI:</div>
                      <p className="text-slate-600">
                        {c.goodsReceiptBTB?.notes ||
                          'Seluruh 12 koli kargo dalam kondisi kemasan baik, barcode terbaca sempurna, dan segel pengaman box truck utuh saat dibuka bersama Driver Gatrans. Barang telah dipindahkan ke racking keberangkatan Airside Flight GA-872.'}
                      </p>
                    </div>

                    {/* Signatures */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="border border-slate-300 rounded-lg p-3 text-center flex flex-col justify-between h-28">
                        <div className="text-[10px] font-bold text-slate-700 uppercase">Petugas Penyerah (Driver Line 1 Gatrans)</div>
                        <div className="text-[9px] text-slate-400 italic font-mono">[Tanda Tangan Serah Terima]</div>
                        <div className="border-t border-slate-400 text-[10px] font-bold pt-1">Bambang Wijaya (DRV-33102)</div>
                      </div>
                      <div className="border border-slate-300 rounded-lg p-3 text-center flex flex-col justify-between h-28 bg-emerald-50/30">
                        <div className="text-[10px] font-bold text-emerald-900 uppercase">Petugas Penerima Gudang Maskapai (Airline Staff)</div>
                        <div className="text-[9px] text-emerald-600 font-mono font-bold">[TERVERIFIKASI & TANDA TANGAN DIGITAL]</div>
                        <div className="border-t border-slate-400 text-[10px] font-bold pt-1">Yusuf Maulana (Staff ID: GA-WHS-4491)</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    DOCUMENT 4: CSD & SURAT TIMBANG KARGO (STK)
                   ========================================================================= */}
                {currentDocType === 'CSD_STK' && (
                  <div className="space-y-4">
                    <div className="text-center py-2 px-3 bg-indigo-50/70 border border-indigo-300 rounded-lg">
                      <h2 className="text-sm font-black text-indigo-950 uppercase tracking-wide">
                        CONSIGNMENT SECURITY DECLARATION (CSD) & SURAT TIMBANG KARGO (STK)
                      </h2>
                      <div className="text-[10px] text-indigo-800 font-medium">
                        Deklarasi Keamanan Standar ICAO Annex 17 & Tiket Timbang Resmi Metrologi
                      </div>
                      <div className="text-xs font-mono font-bold text-indigo-900 mt-1">
                        No. CSD: {c.csdDoc?.documentNo || 'CSD-ID-2026-88124'} · No. STK: {c.stkDoc?.documentNo || 'STK-2026-0941'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10.5px]">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="bg-slate-50 font-bold w-1/3 py-1 px-2 border border-slate-300">Nomor AWB:</td>
                            <td className="font-mono font-bold py-1 px-2 border border-slate-300">{c.awbNumber}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Regulated Agent:</td>
                            <td className="font-bold py-1 px-2 border border-slate-300">PT Gatrans Cargo Angkasa Logistics (RA-0021)</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Metode Screening:</td>
                            <td className="py-1 px-2 border border-slate-300">Dual-View X-Ray (HI-SCAN 100100V-2is) + EVD</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Status Keamanan:</td>
                            <td className="font-bold text-emerald-700 py-1 px-2 border border-slate-300">SPX (Secure for Passenger Aircraft)</td>
                          </tr>
                        </tbody>
                      </table>

                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="bg-slate-50 font-bold w-1/3 py-1 px-2 border border-slate-300">Alat Timbang:</td>
                            <td className="py-1 px-2 border border-slate-300">{c.weighing?.scaleReference || 'DIGI-SCALE-T2-08 (Kalibrasi Metrologi)'}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Tiket Timbang:</td>
                            <td className="font-mono font-bold py-1 px-2 border border-slate-300">{c.weighing?.ticketReference || 'TKT-WGH-88129'}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Dimensi Rata-rata:</td>
                            <td className="py-1 px-2 border border-slate-300">{c.weighing?.dimensionsSummary || '12 Koli @ 45x35x30 cm'}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Masa Berlaku CSD:</td>
                            <td className="font-bold py-1 px-2 border border-slate-300">24 Jam Sejak Diterbitkan</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Weight Breakdown Table */}
                    <div className="border border-slate-300 rounded-lg overflow-hidden">
                      <table className="w-full border-collapse text-[10.5px]">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="py-1.5 px-3 border border-slate-300 text-center">Gross Weight</th>
                            <th className="py-1.5 px-3 border border-slate-300 text-center">Tare Weight</th>
                            <th className="py-1.5 px-3 border border-slate-300 text-center">Net Weight</th>
                            <th className="py-1.5 px-3 border border-slate-300 text-center">Volume Weight</th>
                            <th className="py-1.5 px-3 border border-slate-300 text-center bg-indigo-50 text-indigo-900">Chargeable Weight</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-center font-mono font-bold text-xs">
                            <td className="py-2 px-3 border border-slate-300">{c.weighing?.grossWeightKg || 284.5} kg</td>
                            <td className="py-2 px-3 border border-slate-300 text-slate-500">{c.weighing?.tareWeightKg || 14.5} kg</td>
                            <td className="py-2 px-3 border border-slate-300">{c.weighing?.netWeightKg || 270.0} kg</td>
                            <td className="py-2 px-3 border border-slate-300 text-slate-500">{c.weighing?.volumeWeightKg || 189.0} kg</td>
                            <td className="py-2 px-3 border border-slate-300 bg-indigo-50/50 text-indigo-900 text-sm">
                              {c.weighing?.chargeableWeightKg || 284.5} KG
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Signatures */}
                    <div className="grid grid-cols-3 gap-3 pt-4">
                      <div className="border border-slate-300 rounded p-2 text-center flex flex-col justify-between h-24">
                        <div className="text-[9px] font-bold text-slate-600 uppercase">Petugas Timbang (Scale Operator)</div>
                        <div className="text-[8.5px] text-slate-400 italic font-mono">[Tanda Tangan Timbang]</div>
                        <div className="border-t border-slate-400 text-[9.5px] font-bold pt-1">{c.weighing?.weighedBy || 'Doni Kurniawan (Handler)'}</div>
                      </div>
                      <div className="border border-slate-300 rounded p-2 text-center flex flex-col justify-between h-24">
                        <div className="text-[9px] font-bold text-slate-600 uppercase">Admin Pembuat CSD (Regulated Agent)</div>
                        <div className="text-[8.5px] text-slate-400 italic font-mono">[Otorisasi Dokumen CSD]</div>
                        <div className="border-t border-slate-400 text-[9.5px] font-bold pt-1">{c.csdDoc?.issuedBy || 'Sarah Miller (Checker)'}</div>
                      </div>
                      <div className="border border-slate-300 rounded p-2 text-center flex flex-col justify-between h-24">
                        <div className="text-[9px] font-bold text-slate-600 uppercase">AVSEC Inspector (Pengesahan)</div>
                        <div className="text-[8.5px] text-slate-400 italic font-mono">[Security Clearance Stamp]</div>
                        <div className="border-t border-slate-400 text-[9.5px] font-bold pt-1">Mayor Bambang Suryo</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    DOCUMENT 5: FAKTUR INVOICE & KUITANSI RESMI (CASH / KREDIT)
                   ========================================================================= */}
                {currentDocType === 'INVOICE_RECEIPT' && (
                  <div className="space-y-4">
                    <div className="text-center py-2 px-3 bg-emerald-50/70 border border-emerald-300 rounded-lg">
                      <h2 className="text-sm font-black text-emerald-950 uppercase tracking-wide">
                        FAKTUR INVOICE TAGIHAN JASA KARGO & KUITANSI RESMI
                      </h2>
                      <div className="text-[10px] text-emerald-800 font-medium">
                        Tagihan Operasional & Bukti Penerimaan Pembayaran Kasir / Finance Resmi
                      </div>
                      <div className="text-xs font-mono font-bold text-emerald-900 mt-1">
                        Nomor Invoice: {c.invoice?.invoiceNo || 'INV-2026-0492'} · Tipe: {c.invoice?.paymentType || 'CREDIT'} ({c.invoice?.paymentTerms || 'NET_14'}) · Status: {c.invoice?.status || 'PAID'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10.5px]">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="bg-slate-50 font-bold w-1/3 py-1 px-2 border border-slate-300">Ditagihkan Kepada:</td>
                            <td className="font-bold py-1 px-2 border border-slate-300">{c.invoice?.billTo || c.shipper}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Agen Pengirim:</td>
                            <td className="py-1 px-2 border border-slate-300">{c.invoice?.agentName || 'PT Nusantara Jaya Logistik'}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Nomor AWB:</td>
                            <td className="font-mono font-bold py-1 px-2 border border-slate-300">{c.awbNumber}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Status Operasional:</td>
                            <td className="py-1 px-2 border border-slate-300 text-blue-700 font-semibold">{c.invoice?.operationalStatus || 'DELIVERED (Selesai Serah Terima)'}</td>
                          </tr>
                        </tbody>
                      </table>

                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="bg-slate-50 font-bold w-1/3 py-1 px-2 border border-slate-300">Tanggal Faktur:</td>
                            <td className="py-1 px-2 border border-slate-300">{c.invoice?.invoiceDate || '2026-10-24'}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Jatuh Tempo:</td>
                            <td className="py-1 px-2 border border-slate-300 font-bold text-amber-700">{c.invoice?.dueDate || '2026-11-07 (Net 14 Hari)'}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Metode Tagihan:</td>
                            <td className="py-1 px-2 border border-slate-300 font-bold">{c.invoice?.paymentType === 'CASH' ? 'Jalur Kasir (Cash Langsung)' : 'Jalur Kredit Finance (Akun Agen)'}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 font-bold py-1 px-2 border border-slate-300">Dibuat Oleh:</td>
                            <td className="py-1 px-2 border border-slate-300">{c.invoice?.createdBy || 'Budi Santoso (Kasir / Finance)'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Invoice Item Breakdown */}
                    <table className="w-full border-collapse text-[10px]">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="py-1 px-2 border border-slate-300 text-center w-8">No</th>
                          <th className="py-1 px-2 border border-slate-300">Deskripsi Layanan / Item Tarif</th>
                          <th className="py-1 px-2 border border-slate-300 text-center w-16">Kuantitas</th>
                          <th className="py-1 px-2 border border-slate-300 text-right w-24">Harga Satuan</th>
                          <th className="py-1 px-2 border border-slate-300 text-right w-28">Total Biaya (IDR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(c.invoice?.items || []).map((it, idx) => (
                          <tr key={it.id || idx}>
                            <td className="py-1 px-2 border border-slate-300 text-center font-mono">{idx + 1}</td>
                            <td className="py-1 px-2 border border-slate-300">{it.description}</td>
                            <td className="py-1 px-2 border border-slate-300 text-center font-mono">{it.quantity}</td>
                            <td className="py-1 px-2 border border-slate-300 text-right font-mono">Rp {it.unitPrice.toLocaleString('id-ID')}</td>
                            <td className="py-1 px-2 border border-slate-300 text-right font-mono font-bold">Rp {it.total.toLocaleString('id-ID')}</td>
                          </tr>
                        ))}
                        <tr className="font-bold">
                          <td colSpan={4} className="py-1 px-2 border border-slate-300 text-right">SUBTOTAL:</td>
                          <td className="py-1 px-2 border border-slate-300 text-right font-mono">Rp {(c.invoice?.subtotal || 1095000).toLocaleString('id-ID')}</td>
                        </tr>
                        <tr className="font-bold">
                          <td colSpan={4} className="py-1 px-2 border border-slate-300 text-right">PPN (11%):</td>
                          <td className="py-1 px-2 border border-slate-300 text-right font-mono">Rp {(c.invoice?.taxPpn || 120450).toLocaleString('id-ID')}</td>
                        </tr>
                        <tr className="font-bold bg-slate-50 text-[11px]">
                          <td colSpan={4} className="py-1.5 px-2 border border-slate-300 text-right">TOTAL TAGIHAN:</td>
                          <td className="py-1.5 px-2 border border-slate-300 text-right font-mono text-blue-900 font-black">
                            Rp {(c.invoice?.totalAmount || 1215450).toLocaleString('id-ID')}
                          </td>
                        </tr>
                        <tr className="font-bold bg-emerald-50 text-[11px]">
                          <td colSpan={4} className="py-1.5 px-2 border border-slate-300 text-right text-emerald-900">JUMLAH TELAH DIBAYAR:</td>
                          <td className="py-1.5 px-2 border border-slate-300 text-right font-mono text-emerald-700 font-black">
                            Rp {(c.invoice?.paidAmount || 1215450).toLocaleString('id-ID')}
                          </td>
                        </tr>
                        <tr className="font-bold text-[11px]">
                          <td colSpan={4} className="py-1.5 px-2 border border-slate-300 text-right">SISA SALDO PEMBAYARAN:</td>
                          <td className="py-1.5 px-2 border border-slate-300 text-right font-mono font-bold text-slate-800">
                            Rp {(c.invoice?.remainingAmount || 0).toLocaleString('id-ID')} {c.invoice?.remainingAmount === 0 ? '(LUNAS)' : ''}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Receipt Evidence Box */}
                    <div className="p-2.5 rounded-lg border border-slate-300 bg-slate-50/80 text-[10px] space-y-1">
                      <div className="font-bold text-slate-800">BUKTI KUITANSI PEMBAYARAN (SETTLEMENT RECEIPT):</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>Metode: <strong>{c.invoice?.payments[0]?.method || 'BANK_TRANSFER (BCA)'}</strong></div>
                        <div>No. Referensi: <strong className="font-mono">{c.invoice?.payments[0]?.reference || 'TRF-BCA-994821'}</strong></div>
                        <div>Diterima Kasir: <strong>{c.invoice?.payments[0]?.recordedBy || 'Budi Santoso'}</strong></div>
                      </div>
                    </div>

                    {/* Signatures */}
                    <div className="grid grid-cols-2 gap-6 pt-2">
                      <div className="border border-slate-300 rounded p-2 text-center flex flex-col justify-between h-24">
                        <div className="text-[9.5px] font-bold text-slate-700 uppercase">Penyetor / Perwakilan Agen</div>
                        <div className="text-[8.5px] text-slate-400 italic font-mono">[Tanda Tangan Penyetor]</div>
                        <div className="border-t border-slate-400 text-[10px] font-bold pt-1">{c.invoice?.agentName || c.shipper}</div>
                      </div>
                      <div className="border border-slate-300 rounded p-2 text-center flex flex-col justify-between h-24 bg-emerald-50/20">
                        <div className="text-[9.5px] font-bold text-slate-700 uppercase">Kasir / Finance PT. Manggala Utama Indonesia</div>
                        <div className="text-[8.5px] text-emerald-600 font-mono font-bold">[LUNAS & STEMPEL KASIR]</div>
                        <div className="border-t border-slate-400 text-[10px] font-bold pt-1">Budi Santoso (ADM-11204)</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    DOCUMENT 6: BERITA ACARA PERGANTIAN SHIFT & ROSTER RESMI v1.6/v1.7
                   ========================================================================= */}
                {currentDocType === 'SHIFT_HANDOVER' && (
                  <div className="space-y-4">
                    <div className="text-center py-2 px-3 bg-purple-50/70 border border-purple-300 rounded-lg">
                      <h2 className="text-sm font-black text-purple-950 uppercase tracking-wide">
                        BERITA ACARA PERGANTIAN SHIFT & ROSTER RESMI OPERASIONAL KARGO
                      </h2>
                      <div className="text-[10px] text-purple-800 font-medium">
                        Rekonsiliasi Antar-Regu, Logbook Kasus Terbuka, & Susunan Personel Shift Resmi
                      </div>
                      <div className="text-xs font-mono font-bold text-purple-900 mt-1">
                        Nomor Laporan: {shiftData?.id || 'SHF-2026-1024-01'} · Shift: {shiftData?.shiftCode || 'SHIFT-1 (06:00 - 14:00)'} · Tanggal: {shiftData?.date || '2026-10-24'}
                      </div>
                    </div>

                    {/* Operational Summary Grid */}
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                      <div className="p-2 border border-slate-300 rounded bg-slate-50">
                        <div className="text-slate-500 font-semibold">Total Kargo Diterima</div>
                        <div className="text-sm font-bold font-mono text-slate-900">{shiftData?.summary.totalAccepted || 6} AWB</div>
                      </div>
                      <div className="p-2 border border-slate-300 rounded bg-slate-50">
                        <div className="text-slate-500 font-semibold">Telah Lolos X-Ray</div>
                        <div className="text-sm font-bold font-mono text-emerald-700">{shiftData?.summary.totalXrayed || 4} Konsinyasi</div>
                      </div>
                      <div className="p-2 border border-slate-300 rounded bg-slate-50">
                        <div className="text-slate-500 font-semibold">DO Terbit / Terkirim</div>
                        <div className="text-sm font-bold font-mono text-blue-700">{shiftData?.summary.totalDoIssued || 2} / {shiftData?.summary.totalDelivered || 1} BTB</div>
                      </div>
                      <div className="p-2 border border-rose-300 rounded bg-rose-50">
                        <div className="text-rose-700 font-semibold">Kasus Terbuka (Open)</div>
                        <div className="text-sm font-bold font-mono text-rose-800">{shiftData?.summary.openExceptionsCount || 2} Kasus</div>
                      </div>
                    </div>

                    {/* Roster Personel 5 Kategori Sesuai PRD v1.6/v1.7 AC-084 */}
                    <div>
                      <div className="font-bold text-[10.5px] text-slate-800 mb-1 flex items-center justify-between">
                        <span>SUSUNAN PERSONEL ROSTER RESMI SHIFT (5 KATEGORI WAJIB):</span>
                        <span className="text-[9.5px] text-slate-500">1 Manager, 2 Supervisor, Petugas DG, Senior AVSEC</span>
                      </div>
                      <table className="w-full border-collapse text-[10px]">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="py-1 px-2 border border-slate-300 text-center w-8">No</th>
                            <th className="py-1 px-2 border border-slate-300">Nama Personel</th>
                            <th className="py-1 px-2 border border-slate-300">Kategori Jabatan</th>
                            <th className="py-1 px-2 border border-slate-300">Penugasan Operasional</th>
                            <th className="py-1 px-2 border border-slate-300 text-center">Status Kehadiran</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-1 px-2 border border-slate-300 text-center font-mono">1</td>
                            <td className="py-1 px-2 border border-slate-300 font-bold">Capt. Hendra Wijaya, S.T.</td>
                            <td className="py-1 px-2 border border-slate-300 text-blue-900 font-semibold">Manager Shift (Outgoing)</td>
                            <td className="py-1 px-2 border border-slate-300">Komando Operasional & Otorisasi Lini 1</td>
                            <td className="py-1 px-2 border border-slate-300 text-center text-emerald-700 font-bold">HADIR & AKTIF</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border border-slate-300 text-center font-mono">2</td>
                            <td className="py-1 px-2 border border-slate-300 font-bold">Budi Santoso</td>
                            <td className="py-1 px-2 border border-slate-300">Supervisor Shift 01 (Admin)</td>
                            <td className="py-1 px-2 border border-slate-300">Penerbitan DO, Billing & Rekonsiliasi BTB</td>
                            <td className="py-1 px-2 border border-slate-300 text-center text-emerald-700 font-bold">HADIR & AKTIF</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border border-slate-300 text-center font-mono">3</td>
                            <td className="py-1 px-2 border border-slate-300 font-bold">Rahmat Hidayat</td>
                            <td className="py-1 px-2 border border-slate-300">Supervisor Shift 02 (Checker)</td>
                            <td className="py-1 px-2 border border-slate-300">Pengawasan Screening X-Ray & Penimbangan</td>
                            <td className="py-1 px-2 border border-slate-300 text-center text-emerald-700 font-bold">HADIR & AKTIF</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border border-slate-300 text-center font-mono">4</td>
                            <td className="py-1 px-2 border border-slate-300 font-bold">Aris Setiawan</td>
                            <td className="py-1 px-2 border border-slate-300 text-purple-900 font-semibold">Petugas Dangerous Goods (DG)</td>
                            <td className="py-1 px-2 border border-slate-300">Triage IATA DGR, Surat Reject DG & Hazmat</td>
                            <td className="py-1 px-2 border border-slate-300 text-center text-emerald-700 font-bold">HADIR (Cat 6 Certified)</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border border-slate-300 text-center font-mono">5</td>
                            <td className="py-1 px-2 border border-slate-300 font-bold">Mayor Bambang Suryo</td>
                            <td className="py-1 px-2 border border-slate-300 text-amber-900 font-semibold">Senior AVSEC (External Authority)</td>
                            <td className="py-1 px-2 border border-slate-300">Pengesahan Kelayakan Terbang & Stamp AVSEC</td>
                            <td className="py-1 px-2 border border-slate-300 text-center text-blue-700 font-bold">ON DUTY (Non-Login)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Open Items Handover */}
                    <div>
                      <div className="font-bold text-[10.5px] text-slate-800 mb-1">
                        DAFTAR KASUS TERBUKA / PEKERJAAN TERTUNDA (OPEN WORK ITEMS):
                      </div>
                      <table className="w-full border-collapse text-[10px]">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="py-1 px-2 border border-slate-300 text-center w-8">No</th>
                            <th className="py-1 px-2 border border-slate-300">Referensi Tiket / AWB</th>
                            <th className="py-1 px-2 border border-slate-300">Uraian Masalah Kargo</th>
                            <th className="py-1 px-2 border border-slate-300">Tindakan Wajib Shift Penerima</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(shiftData?.openItems || []).map((it, idx) => (
                            <tr key={it.refId || idx}>
                              <td className="py-1 px-2 border border-slate-300 text-center font-mono">{idx + 1}</td>
                              <td className="py-1 px-2 border border-slate-300 font-mono font-bold text-rose-700">{it.refId}</td>
                              <td className="py-1 px-2 border border-slate-300">{it.detail}</td>
                              <td className="py-1 px-2 border border-slate-300 font-semibold text-slate-800">{it.actionRequired}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Manager Handover Signatures */}
                    <div className="grid grid-cols-2 gap-4 pt-3">
                      <div className="border border-slate-300 rounded-lg p-2.5 text-center flex flex-col justify-between h-26">
                        <div className="text-[10px] font-bold text-slate-700 uppercase">Manager Shift Menyerahkan (Outgoing)</div>
                        <div className="text-[8.5px] text-slate-400 italic font-mono">[Tanda Tangan Pengesahan Serah Terima]</div>
                        <div className="border-t border-slate-400 text-[10px] font-bold pt-1">
                          {shiftData?.outgoingSupervisor || 'Capt. Hendra Wijaya, S.T.'}
                        </div>
                      </div>
                      <div className="border border-slate-300 rounded-lg p-2.5 text-center flex flex-col justify-between h-26 bg-purple-50/20">
                        <div className="text-[10px] font-bold text-purple-950 uppercase">Manager Shift Menerima (Incoming)</div>
                        <div className="text-[8.5px] text-purple-700 font-mono font-bold">[STATUS: ACKNOWLEDGED & DISAHKAN]</div>
                        <div className="border-t border-slate-400 text-[10px] font-bold pt-1">
                          {shiftData?.incomingSupervisor || 'Bambang Sutrisno, S.E.'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Official Document Footer Stamp & Validation Barcode */}
              <div className="border-t border-slate-300 pt-3 mt-4 flex items-center justify-between text-[9px] text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>Sistem Manajemen Keamanan Kargo & Disposisi Bandara v1.7 · Dokumen ini sah dan memiliki kekuatan hukum operasional.</span>
                </div>
                <div className="font-mono text-slate-600 font-semibold">
                  VERIFIKASI: GAT-SEC-{Date.now().toString().slice(-6)} · HALAMAN 1 DARI 1
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
