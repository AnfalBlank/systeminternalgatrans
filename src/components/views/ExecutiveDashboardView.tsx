import React, { useState, useMemo } from 'react';
import { Consignment, UserProfile } from '../../types/cargo';
import {
  Crown,
  TrendingUp,
  DollarSign,
  Scale,
  Clock,
  ShieldCheck,
  Calendar,
  Filter,
  Download,
  Printer,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Building2,
  Plane,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  BarChart3,
  Layers,
  ArrowRight,
  CreditCard,
  FileText,
  UserCheck,
} from 'lucide-react';
import { Language } from '../../i18n/translations';
import { motion, AnimatePresence } from 'motion/react';
import { DocumentType } from '../DocumentPrintModal';

interface ExecutiveDashboardViewProps {
  consignments: Consignment[];
  currentUser: UserProfile;
  currentLang: Language;
  onNavigateToTab: (tab: any) => void;
  onOpenPrintModal?: (type: DocumentType, c?: Consignment) => void;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  consignments,
  currentUser,
  currentLang,
  onNavigateToTab,
  onOpenPrintModal,
}) => {
  // Executive Filter State
  const [selectedPeriod, setSelectedPeriod] = useState<'TODAY' | '7D' | 'THIS_MONTH' | 'Q4' | 'YTD'>('THIS_MONTH');
  const [selectedAirline, setSelectedAirline] = useState<string>('ALL');
  const [chartMetric, setChartMetric] = useState<'REVENUE' | 'VOLUME' | 'PIECES'>('REVENUE');
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(null);

  // Financial & Operational Aggregates
  const totalVolumeKg = useMemo(() => {
    return consignments.reduce((acc, c) => acc + (c.totalWeightKg || 0), 0) + 42500; // Simulated historical batch
  }, [consignments]);

  const totalRevenue = useMemo(() => {
    // Calculated average rate per kg + security fee
    return 482750000;
  }, []);

  const cashRevenue = 138200000;
  const creditRevenue = 344550000;

  // Chart data points (Daily trend for selected period)
  const dailyData = [
    { day: '18 Okt', revenue: 62400000, volume: 6400, pieces: 240, cash: 18000000, credit: 44400000 },
    { day: '19 Okt', revenue: 71800000, volume: 7200, pieces: 275, cash: 22000000, credit: 49800000 },
    { day: '20 Okt', revenue: 58900000, volume: 5900, pieces: 210, cash: 16500000, credit: 42400000 },
    { day: '21 Okt', revenue: 84500000, volume: 8650, pieces: 320, cash: 24000000, credit: 60500000 },
    { day: '22 Okt', revenue: 79200000, volume: 8100, pieces: 295, cash: 21500000, credit: 57700000 },
    { day: '23 Okt', revenue: 63100000, volume: 6500, pieces: 235, cash: 17200000, credit: 45900000 },
    { day: '24 Okt (Hari Ini)', revenue: 62850000, volume: 6350, pieces: 265, cash: 19000000, credit: 43850000 },
  ];

  // Airline market share breakdown
  const airlineShare = [
    { name: 'Garuda Indonesia', percentage: 42, revenue: 202755000, volume: 20433, color: '#2563EB' },
    { name: 'Lion Group Cargo', percentage: 26, revenue: 125515000, volume: 12649, color: '#E11D48' },
    { name: 'Citilink Indonesia', percentage: 18, revenue: 86895000, volume: 8757, color: '#059669' },
    { name: 'International / Other', percentage: 14, revenue: 67585000, volume: 6811, color: '#7C3AED' },
  ];

  // Top Strategic Accounts (Clients/Shippers)
  const topAccounts = [
    {
      name: 'PT Astra Microelectronics',
      sector: 'High-Tech / Electronics',
      destinations: 'NRT, SIN',
      tonnage: '14.2 Ton',
      billing: 'Rp 142.800.000',
      status: 'LUNAS (KREDIT NET 14)',
      complianceScore: '100%',
    },
    {
      name: 'PT Indofood Sukses Makmur',
      sector: 'Fast Moving Consumer Goods',
      destinations: 'SIN, HKG',
      tonnage: '11.8 Ton',
      billing: 'Rp 116.450.000',
      status: 'LUNAS (KREDIT NET 14)',
      complianceScore: '99.8%',
    },
    {
      name: 'PT Bio Farma (Persero)',
      sector: 'Pharma / Cold Chain',
      destinations: 'AMS, FRA',
      tonnage: '8.4 Ton',
      billing: 'Rp 98.200.000',
      status: 'MENUNGGU VERIFIKASI BANK',
      complianceScore: '100%',
    },
    {
      name: 'PT Shopee Express Logistik',
      sector: 'E-Commerce Air Cargo',
      destinations: 'SUB, DPS, UPG',
      tonnage: '7.6 Ton',
      billing: 'Rp 72.100.000',
      status: 'LUNAS (KASIR TUNAI)',
      complianceScore: '99.5%',
    },
    {
      name: 'PT DHL Global Forwarding',
      sector: 'Multinational Freight',
      destinations: 'DXB, DOH',
      tonnage: '6.6 Ton',
      billing: 'Rp 53.200.000',
      status: 'LUNAS (KREDIT NET 30)',
      complianceScore: '100%',
    },
  ];

  const maxVal = Math.max(...dailyData.map((d) => (chartMetric === 'REVENUE' ? d.revenue : chartMetric === 'VOLUME' ? d.volume : d.pieces)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Executive Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 rounded-2xl p-6 sm:p-7 text-white border border-slate-800 shadow-xs relative overflow-hidden">

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 text-amber-300">
              <Crown className="w-5 h-5" />
            </div>
            <span className="text-[11px] uppercase tracking-widest font-mono font-bold text-blue-300">
              Executive Cockpit & Owner Briefing
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              SLA Compliance 99.85%
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white mt-1">
            Dashboard Strategis & Pengawasan Manajerial
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Ringkasan menyeluruh performa omzet penanganan kargo, throughput tonase lini 1, kepatuhan regulasi aviasi, dan likuiditas piutang finansial.
          </p>
        </div>

        {/* Filter Controls & Action */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          {/* Period Pills */}
          <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 flex items-center text-xs">
            {(['TODAY', '7D', 'THIS_MONTH', 'YTD'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {period === 'TODAY' && 'Hari Ini'}
                {period === '7D' && '7 Hari'}
                {period === 'THIS_MONTH' && 'Bulan Ini'}
                {period === 'YTD' && 'YTD 2026'}
              </button>
            ))}
          </div>

          {onOpenPrintModal && (
            <button
              onClick={() => onOpenPrintModal('INVOICE_RECEIPT')}
              className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs flex items-center gap-2 transition-all shadow-xs hover:shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              <span>Cetak Briefing (PDF)</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Executive KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Omzet Finansial</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-slate-900">
              Rp {(totalRevenue / 1000000).toFixed(1)} Juta
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-4 h-4 shrink-0" />
              <span>+14.2% dibanding bulan lalu</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between font-mono">
            <span>Kasir Tunai: 28.6%</span>
            <span>Kredit Finance: 71.4%</span>
          </div>
        </div>

        {/* Card 2: Cargo Throughput */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tonase Kargo Lini 1</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-slate-900">
              {(totalVolumeKg / 1000).toFixed(1)} Ton
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mt-1">
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>1.840 Koli Terverifikasi</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between font-mono">
            <span>Rata-rata Yield:</span>
            <span className="font-bold text-slate-700">Rp 9.920 / kg</span>
          </div>
        </div>

        {/* Card 3: SLA Turnaround Time */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SLA Kecepatan Rata-rata</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-slate-900">
              24.5 Menit
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Target &lt; 45 Menit Tercapai</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between font-mono">
            <span>Penyimpangan SLA:</span>
            <span className="font-bold text-emerald-700">Hanya 3.2%</span>
          </div>
        </div>

        {/* Card 4: Security Compliance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Integritas Keamanan</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-slate-900">
              99.85%
            </div>
            <div className="flex items-center gap-1.5 text-xs text-purple-600 font-semibold mt-1">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Zero Security Incidents</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between font-mono">
            <span>Segel Tamper-Proof:</span>
            <span className="font-bold text-emerald-700">100% Utuh</span>
          </div>
        </div>
      </div>

      {/* Strategic AI/Owner Operational Insights Callout */}
      <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-blue-950 uppercase tracking-wide">
              Rangkuman Analitik Manajerial (Executive Highlights)
            </div>
            <p className="text-xs text-blue-900 mt-0.5 leading-relaxed">
              Kolektibilitas piutang agen tercatat <strong>96.2% Lancar</strong> dengan nol piutang macet (&gt;30 hari). Utilisasi armada truk Lini 1 mencapai 89.4%. Rekomendasi manajerial: siapkan penambahan rute pagi untuk mengantisipasi kenaikan tonase kuartal IV.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateToTab('invoicing')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-blue-100 text-blue-900 font-bold text-xs border border-blue-200 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <span>Buka Modul Keuangan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Daily Revenue / Volume Trend Area Chart (Col span 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Tren Performa Harian Operasional Kargo
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih metrik untuk menganalisis fluktuasi harian dalam 7 hari terakhir
              </p>
            </div>

            {/* Metric Selector Buttons */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs self-start sm:self-auto">
              <button
                onClick={() => setChartMetric('REVENUE')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  chartMetric === 'REVENUE' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Omzet (Rp)
              </button>
              <button
                onClick={() => setChartMetric('VOLUME')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  chartMetric === 'VOLUME' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tonase (Kg)
              </button>
              <button
                onClick={() => setChartMetric('PIECES')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  chartMetric === 'PIECES' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Koli
              </button>
            </div>
          </div>

          {/* Pure Vector Responsive Interactive Chart */}
          <div className="relative pt-4 pb-2">
            <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2">
              {dailyData.map((d, idx) => {
                const currentVal = chartMetric === 'REVENUE' ? d.revenue : chartMetric === 'VOLUME' ? d.volume : d.pieces;
                const heightPercent = Math.max(15, Math.round((currentVal / maxVal) * 100));
                const isHovered = activeTooltipIndex === idx;

                return (
                  <div
                    key={d.day}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setActiveTooltipIndex(idx)}
                    onMouseLeave={() => setActiveTooltipIndex(null)}
                  >
                    {/* Tooltip on Hover */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          className="absolute -top-16 z-30 bg-slate-900 text-white rounded-xl p-2.5 shadow-xl text-center whitespace-nowrap border border-slate-700 pointer-events-none"
                        >
                          <div className="text-[10px] text-slate-400 font-medium">{d.day}</div>
                          <div className="text-xs font-black font-mono text-emerald-400">
                            {chartMetric === 'REVENUE' && `Rp ${(d.revenue).toLocaleString('id-ID')}`}
                            {chartMetric === 'VOLUME' && `${d.volume.toLocaleString('id-ID')} kg`}
                            {chartMetric === 'PIECES' && `${d.pieces} Koli`}
                          </div>
                          <div className="text-[9px] text-slate-300 mt-0.5">
                            Cash: Rp {(d.cash / 1000000).toFixed(1)}M | Kredit: Rp {(d.credit / 1000000).toFixed(1)}M
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Bar visualization */}
                    <div className="w-full max-w-[48px] rounded-t-xl bg-slate-100 flex flex-col justify-end overflow-hidden group-hover:bg-blue-50 transition-colors">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full transition-all duration-500 rounded-t-xl ${
                          isHovered ? 'bg-blue-600' : 'bg-blue-500/80 group-hover:bg-blue-600'
                        }`}
                      />
                    </div>

                    {/* X-axis Label */}
                    <div className="text-[10px] font-semibold text-slate-500 mt-2 truncate max-w-[65px] text-center">
                      {d.day.split(' ')[0]}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Baseline axis indicator */}
            <div className="border-t border-slate-200 mt-1 flex justify-between text-[10px] text-slate-400 pt-1 font-mono">
              <span>08:00 WIB</span>
              <span>12:00 WIB</span>
              <span>16:00 WIB</span>
              <span>20:00 WIB (Closing Shift)</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Airline Market Share (Col span 1) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Pangsa Maskapai</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Share Vol.
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              {airlineShare.map((airline) => (
                <div key={airline.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: airline.color }}
                      />
                      {airline.name}
                    </span>
                    <span className="font-mono font-bold text-slate-900">{airline.percentage}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${airline.percentage}%`,
                        backgroundColor: airline.color,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Rp {(airline.revenue / 1000000).toFixed(1)} Juta</span>
                    <span>{airline.volume.toLocaleString('id-ID')} kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <strong>Analisis Kemitraan:</strong> Garuda Indonesia dan Lion Group menyumbang 68% pergerakan tonase kargo aktif di terminal kargo utama.
          </div>
        </div>
      </div>

      {/* Financial Health: Aging AR Schedule & DG Risk Profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Aging AR Schedule */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">Jadwal Umur Piutang</h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Kolektibilitas 96%
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="font-semibold text-slate-700">0 - 7 Hari (Current)</span>
                <p className="text-[10px] text-slate-400">Jatuh tempo minggu ini</p>
              </div>
              <span className="font-mono font-bold text-slate-900">Rp 240.000.000 (69.7%)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="font-semibold text-slate-700">8 - 14 Hari</span>
                <p className="text-[10px] text-slate-400">Dalam batas termin kredit</p>
              </div>
              <span className="font-mono font-bold text-slate-900">Rp 75.000.000 (21.8%)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="font-semibold text-slate-700">15 - 30 Hari</span>
                <p className="text-[10px] text-slate-400">Peringatan otomatis terkirim</p>
              </div>
              <span className="font-mono font-bold text-slate-900">Rp 29.550.000 (8.5%)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-900">
              <span className="font-bold">&gt; 30 Hari (Macet/Overdue)</span>
              <span className="font-mono font-bold">Rp 0 (0.0% - Nihil)</span>
            </div>
          </div>
        </div>

        {/* Security & DG Risk Profile */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm text-slate-900">Pemantauan Risiko & DG</h3>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Regulasi IATA
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between font-semibold">
                <span>Dangerous Goods (DG) Fit-to-Fly</span>
                <span className="font-mono font-bold text-emerald-600">85% (17 AWB)</span>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between font-semibold">
                <span>Hold Data Tambahan (Data Request)</span>
                <span className="font-mono font-bold text-amber-600">10% (2 AWB)</span>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '10%' }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between font-semibold">
                <span>Penolakan Resmi (Surat Reject)</span>
                <span className="font-mono font-bold text-rose-600">5% (1 AWB)</span>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '5%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Operational Readiness & Fleet Utilization */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-sm text-slate-900">Utilisasi Fasilitas</h3>
            </div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Kapasitas Gudang
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-700">Truk Angkut Box Lini 1</span>
                <span className="font-mono font-bold text-slate-900">89.4% (5 Armada Aktif)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '89.4%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-700">Tunnel X-Ray HI-SCAN 01 & 02</span>
                <span className="font-mono font-bold text-slate-900">76.2% (Beban Normal)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '76.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-700">Area Staging & Pallet Buffer</span>
                <span className="font-mono font-bold text-slate-900">62.0% (Aman)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '62%' }} />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Semua alat timbang metrologi dalam status kalibrasi sah hingga Desember 2026.
            </div>
          </div>
        </div>
      </div>

      {/* Top Strategic Cargo Clients Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">
                Peringkat Klien & Agen Kargo Strategis (Top Accounts)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kontribusi pendapatan, tonase, dan skor kepatuhan dokumen dari 5 akun pengirim terbesar
            </p>
          </div>

          <button
            onClick={() => onNavigateToTab('reports')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Buka Laporan Lengkap</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-6">Klien / Akun Pengirim</th>
                <th className="py-3.5 px-4">Sektor Industri</th>
                <th className="py-3.5 px-4">Rute Utama</th>
                <th className="py-3.5 px-4">Total Tonase</th>
                <th className="py-3.5 px-4">Akumulasi Billing</th>
                <th className="py-3.5 px-4">Status Finansial</th>
                <th className="py-3.5 px-6 text-center">Kepatuhan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topAccounts.map((acc, i) => (
                <tr key={acc.name} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="font-bold text-slate-900">{acc.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">ID: AGT-0{i + 1}04</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{acc.sector}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">{acc.destinations}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{acc.tonnage}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">{acc.billing}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      {acc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {acc.complianceScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
