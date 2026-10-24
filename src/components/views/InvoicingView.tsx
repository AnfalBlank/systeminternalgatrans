import React, { useState, useMemo } from 'react';
import { Consignment, UserProfile, BasicInvoice, PaymentRecord } from '../../types/cargo';
import {
  CreditCard,
  Receipt,
  Printer,
  Plus,
  CheckCircle2,
  Clock,
  Building2,
  DollarSign,
  Wallet,
  ArrowRight,
  ShieldCheck,
  Check,
  Filter,
  Calendar,
  AlertTriangle,
  FileSpreadsheet,
  Search,
} from 'lucide-react';
import { Language } from '../../i18n/translations';
import { motion, AnimatePresence } from 'motion/react';
import { DocumentType } from '../DocumentPrintModal';

interface InvoicingViewProps {
  consignments: Consignment[];
  currentUser: UserProfile;
  currentLang: Language;
  onCreateInvoice: (consignmentId: string, invoiceData: Partial<BasicInvoice>) => void;
  onRecordPayment: (consignmentId: string, paymentData: Partial<PaymentRecord>) => void;
  onOpenPrintModal?: (type: DocumentType, c?: Consignment) => void;
}

export const InvoicingView: React.FC<InvoicingViewProps> = ({
  consignments,
  currentUser,
  currentLang,
  onCreateInvoice,
  onRecordPayment,
  onOpenPrintModal,
}) => {
  // PRD v1.7 §8A.3: Jalur Cash vs Kredit
  const [paymentTypeTab, setPaymentTypeTab] = useState<'ALL' | 'CASH' | 'CREDIT'>('ALL');
  const [selectedAgent, setSelectedAgent] = useState<string>('ALL');
  const [periodFilter, setPeriodFilter] = useState<'ALL' | 'TODAY' | 'THIS_MONTH'>('ALL');
  const [selectedConsignmentId, setSelectedConsignmentId] = useState<string>(consignments[0]?.id || '');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique agents from consignments
  const availableAgents = useMemo(() => {
    const set = new Set<string>();
    consignments.forEach((c) => {
      if (c.invoice?.agentName) set.add(c.invoice.agentName);
      else if (c.shipper) set.add(c.shipper);
    });
    return Array.from(set);
  }, [consignments]);

  // Filtered consignments
  const filteredConsignments = useMemo(() => {
    return consignments.filter((c) => {
      // Payment type filter
      if (paymentTypeTab !== 'ALL') {
        const invType = c.invoice?.paymentType || (c.id === 'CNS-004' || c.id === 'CNS-005' ? 'CASH' : 'CREDIT');
        if (invType !== paymentTypeTab) return false;
      }

      // Agent filter
      if (selectedAgent !== 'ALL') {
        const agName = c.invoice?.agentName || c.shipper;
        if (agName !== selectedAgent) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          c.awbNumber.toLowerCase().includes(q) ||
          c.shipper.toLowerCase().includes(q) ||
          (c.invoice?.invoiceNo && c.invoice.invoiceNo.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [consignments, paymentTypeTab, selectedAgent, searchQuery]);

  const selectedConsignment = consignments.find((c) => c.id === selectedConsignmentId) || filteredConsignments[0] || consignments[0];
  const invoice = selectedConsignment?.invoice;

  // New payment form
  const [payAmount, setPayAmount] = useState<number>(invoice?.remainingAmount || 250000);
  const [payMethod, setPayMethod] = useState<'CASH' | 'BANK_TRANSFER' | 'CREDIT_ACCOUNT' | 'GIRO'>('BANK_TRANSFER');
  const [payReference, setPayReference] = useState(`TRF-BCA-${Math.floor(1000000 + Math.random() * 9000000)}`);

  // Financial Summary Aggregates (PRD AC-105, AC-130)
  const totalInvoiced = consignments.reduce((acc, c) => acc + (c.invoice?.totalAmount || 0), 0);
  const totalSettled = consignments.reduce((acc, c) => acc + (c.invoice?.paidAmount || 0), 0);
  const totalOutstanding = consignments.reduce((acc, c) => acc + (c.invoice?.remainingAmount || 0), 0);

  const handleCreateNewInvoice = (type: 'CASH' | 'CREDIT' = 'CREDIT') => {
    if (!selectedConsignment) return;
    const invNo = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const xRayFee = selectedConsignment.totalReceivedPieces * 35000;
    const handlingFee = 250000;
    const transportFee = 350000;
    const scaleFee = 75000;
    const subtotal = xRayFee + handlingFee + transportFee + scaleFee;
    const taxPpn = Math.round(subtotal * 0.11);
    const total = subtotal + taxPpn;

    onCreateInvoice(selectedConsignment.id, {
      invoiceNo: invNo,
      consignmentId: selectedConsignment.id,
      awbNumber: selectedConsignment.awbNumber,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: type === 'CASH' ? new Date().toISOString().split('T')[0] : '2026-11-07',
      paymentTerms: type === 'CASH' ? 'IMMEDIATE' : 'NET_14',
      billTo: selectedConsignment.shipper,
      agentId: 'AGT-01',
      agentName: selectedConsignment.shipper,
      paymentType: type,
      status: 'UNPAID',
      version: 1,
      createdBy: `${currentUser.name} (${type === 'CASH' ? 'Kasir' : 'Finance'})`,
      operationalStatus: selectedConsignment.status,
      items: [
        { id: 'I-1', description: `Pemeriksaan X-Ray Radiasi (${selectedConsignment.totalReceivedPieces} Koli)`, quantity: selectedConsignment.totalReceivedPieces, unitPrice: 35000, total: xRayFee },
        { id: 'I-2', description: 'Handling Kargo & Penerbitan CSD/STK', quantity: 1, unitPrice: handlingFee, total: handlingFee },
        { id: 'I-3', description: 'Transportasi Truk Box Lini 1 Airside', quantity: 1, unitPrice: transportFee, total: transportFee },
        { id: 'I-4', description: 'Penimbangan Digital Terkalibrasi Metrologi', quantity: 1, unitPrice: scaleFee, total: scaleFee },
      ],
      subtotal,
      taxPpn,
      totalAmount: total,
      paidAmount: 0,
      remainingAmount: total,
      payments: [],
    });
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsignment || !invoice) return;
    onRecordPayment(selectedConsignment.id, {
      invoiceId: invoice.id,
      amount: payAmount,
      method: payMethod,
      paidAt: new Date().toLocaleTimeString(),
      reference: payReference,
      recordedBy: `${currentUser.name} (${currentUser.roleLabel})`,
      status: 'SETTLED',
    });
    setShowPaymentModal(false);
  };

  const triggerPrintDocument = (c: Consignment) => {
    if (onOpenPrintModal) {
      onOpenPrintModal('INVOICE_RECEIPT', c);
    } else {
      window.print();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/80 shadow-2xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Keuangan & Invoicing Kargo Bandara
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Jalur Kasir & Finance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Penagihan jasa kargo (X-Ray, CSD/STK, Lini 1) dengan pemisahan status operasional dan finansial, rekap agen, serta cetak PDF resmi.
          </p>
        </div>

        {/* Global Print Document Quick Button */}
        <div className="flex items-center gap-2">
          {selectedConsignment && (
            <button
              onClick={() => triggerPrintDocument(selectedConsignment)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Cetak Faktur & Kuitansi (A4 PDF)</span>
            </button>
          )}
        </div>
      </div>

      {/* Financial Summary KPI Cards (PRD AC-105, AC-130) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Nilai Tagihan (Invoiced)</span>
            <Receipt className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            Rp {totalInvoiced.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Akumulasi dari seluruh kargo yang telah diterbitkan invoice</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Diterima / Lunas (Settled)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-2">
            Rp {totalSettled.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Penerimaan Kasir & Transfer Bank tervalidasi</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Saldo Piutang Berjalan (Outstanding)</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-2">
            Rp {totalOutstanding.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-amber-600 mt-1">Tagihan kredit agen menunggu jatuh tempo pembayaran</div>
        </div>
      </div>

      {/* Filter Toolbar: Cash vs Kredit, Agent, Period (PRD AC-104, AC-127, AC-128, AC-130) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Tab 1: Jalur Cash vs Kredit Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/70">
          <button
            onClick={() => setPaymentTypeTab('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              paymentTypeTab === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Tagihan
          </button>
          <button
            onClick={() => setPaymentTypeTab('CASH')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              paymentTypeTab === 'CASH' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jalur Cash (Kasir)
          </button>
          <button
            onClick={() => setPaymentTypeTab('CREDIT')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              paymentTypeTab === 'CREDIT' ? 'bg-white text-blue-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jalur Kredit (Finance)
          </button>
        </div>

        {/* Filter Agent & Search */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter Agen:</span>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Semua Agen Pengirim</option>
              {availableAgents.map((ag) => (
                <option key={ag} value={ag}>
                  {ag}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari AWB / No Invoice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 w-48 focus:w-60 transition-all focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content: Left Invoice Table & Right Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Consignments & Invoices */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                Daftar Tagihan & Status Rekonsiliasi Keuangan
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {filteredConsignments.length} Kargo Terdata
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">No. AWB / Invoice</th>
                    <th className="py-2.5 px-3">Agen / Shipper</th>
                    <th className="py-2.5 px-3">Tipe</th>
                    <th className="py-2.5 px-3 text-right">Total Tagihan</th>
                    <th className="py-2.5 px-3 text-center">Status Finansial</th>
                    <th className="py-2.5 px-3 text-center">Status Operasi</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredConsignments.map((c) => {
                    const isSelected = c.id === selectedConsignment?.id;
                    const inv = c.invoice;
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedConsignmentId(c.id)}
                        className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                          isSelected ? 'bg-blue-50/60 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="font-mono font-bold text-slate-900">{c.awbNumber}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {inv ? inv.invoiceNo : 'Draft Belum Diterbitkan'}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-800 truncate max-w-[140px]">{c.shipper}</div>
                          <div className="text-[10px] text-slate-500">{c.totalReceivedPieces} Koli · {c.totalWeightKg} kg</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            (inv?.paymentType || 'CREDIT') === 'CASH'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}>
                            {inv?.paymentType || 'CREDIT'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          {inv ? `Rp ${inv.totalAmount.toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {inv ? (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                inv.status === 'PAID'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : inv.status === 'PARTIALLY_PAID'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {inv.status}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                              NOT_BILLED
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-mono font-medium bg-slate-100 text-slate-700">
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => triggerPrintDocument(c)}
                            title="Cetak Dokumen Resmi"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Invoice Detail & Actions */}
        <div className="space-y-6">
          {selectedConsignment && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-sm text-slate-900">
                    Detail Tagihan AWB: {selectedConsignment.awbNumber}
                  </span>
                </div>
                <button
                  onClick={() => triggerPrintDocument(selectedConsignment)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Cetak Faktur & Kuitansi"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>

              {invoice ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Nomor Faktur:</span>
                      <span className="font-mono font-bold text-slate-900">{invoice.invoiceNo}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Jatuh Tempo:</span>
                      <span className="font-semibold text-amber-700">{invoice.dueDate || '2026-11-07 (Net 14)'}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Total Tagihan:</span>
                      <span className="font-mono font-bold text-slate-900">Rp {invoice.totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Telah Dibayar:</span>
                      <span className="font-mono font-bold text-emerald-700">Rp {invoice.paidAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                      <span className="text-slate-800 font-bold">Sisa Saldo:</span>
                      <span className="font-mono font-bold text-rose-700">Rp {invoice.remainingAmount.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Operational Status Separation Badge (PRD AC-126) */}
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
                    <div className="font-bold flex items-center justify-between">
                      <span>Status Operasional Kargo:</span>
                      <span className="font-mono px-2 py-0.5 rounded bg-blue-600 text-white text-[10px]">
                        {selectedConsignment.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-700">
                      Status fisik/pengiriman terpisah secara independen dari status pelunasan finansial kasir/kredit.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      disabled={invoice.status === 'PAID'}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Catat Pembayaran ({invoice.status === 'PAID' ? 'Sudah Lunas' : 'Alokasi Masuk'})</span>
                    </button>

                    <button
                      onClick={() => triggerPrintDocument(selectedConsignment)}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-slate-300" />
                      <span>Pratinjau Cetak / Ekspor PDF A4</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-900">Belum Ada Invoice Terbit</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Kargo telah diverifikasi. Silakan terbitkan invoice melalui jalur Kasir atau Kredit Finance.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      onClick={() => handleCreateNewInvoice('CASH')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Terbitkan Invoice Jalur Kasir (Cash)</span>
                    </button>
                    <button
                      onClick={() => handleCreateNewInvoice('CREDIT')}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Terbitkan Invoice Jalur Kredit (Net 14)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && invoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200/90 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                Pencatatan Pembayaran Invoice: {invoice.invoiceNo}
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nominal Pembayaran (IDR):</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Sisa Saldo Belum Terbayar: Rp {invoice.remainingAmount.toLocaleString('id-ID')}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Metode Pembayaran:</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-800"
                >
                  <option value="BANK_TRANSFER">Transfer Bank (BCA / Mandiri)</option>
                  <option value="CASH">Tunai (Kasir Lini 1)</option>
                  <option value="GIRO">Bilyet Giro / Cek Perusahaan</option>
                  <option value="CREDIT_ACCOUNT">Kredit Akun Ekspedisi</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor Referensi Transaksi:</label>
                <input
                  type="text"
                  required
                  value={payReference}
                  onChange={(e) => setPayReference(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-semibold text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Pembayaran</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
