import React, { useState } from 'react';
import {
  ShieldCheck,
  ScanLine,
  FileCheck2,
  Plane,
  ArrowRight,
  Clock,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Consignment, UserProfile } from '../types/cargo';
import { Language, translations } from '../i18n/translations';

interface BentoGridProps {
  consignments: Consignment[];
  teamMembers: UserProfile[];
  onSelectConsignment: (c: Consignment) => void;
  onFilterByStatus?: (status: string) => void;
  onOpenXRayModal: (c: Consignment) => void;
  currentLang: Language;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  consignments,
  teamMembers,
  onSelectConsignment,
  onFilterByStatus,
  onOpenXRayModal,
  currentLang,
}) => {
  const [chartMode, setChartMode] = useState<'hourly' | '7days'>('hourly');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredDonut, setHoveredDonut] = useState<string | null>(null);

  const t = translations[currentLang];

  // Pipeline calculations
  const totalPieces = consignments.reduce((acc, c) => acc + c.totalDeclaredPieces, 0);
  const receivedPieces = consignments.reduce((acc, c) => acc + c.totalReceivedPieces, 0);
  const xrayedPieces = consignments.reduce(
    (acc, c) => acc + c.pieces.filter((p) => p.xrayResult !== undefined).length,
    0
  );
  const avsecPieces = consignments.reduce(
    (acc, c) => acc + (c.avsecReview?.decision === 'APPROVED' ? c.totalReceivedPieces : 0),
    0
  );
  const doPieces = consignments.reduce(
    (acc, c) => acc + (c.deliveryOrder ? c.deliveryOrder.totalPieces : 0),
    0
  );

  const pIntake = totalPieces > 0 ? Math.round((receivedPieces / totalPieces) * 100) : 0;
  const pXray = totalPieces > 0 ? Math.round((xrayedPieces / totalPieces) * 100) : 0;
  const pAvsec = totalPieces > 0 ? Math.round((avsecPieces / totalPieces) * 100) : 0;
  const pDO = totalPieces > 0 ? Math.round((doPieces / totalPieces) * 100) : 0;

  // Donut data
  const passPieces = 282;
  const inProgressPieces = 48;
  const reviewPieces = 12;
  const holdRejectPieces = 6;
  const sumDonut = passPieces + inProgressPieces + reviewPieces + holdRejectPieces;

  // SVG Donut calculations
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  const passLen = (passPieces / sumDonut) * circ;
  const inProgLen = (inProgressPieces / sumDonut) * circ;
  const reviewLen = (reviewPieces / sumDonut) * circ;
  const holdLen = (holdRejectPieces / sumDonut) * circ;

  // Hourly Bar Data for Current Shift (06:00 to 12:00)
  const hourlyData = [
    { label: '06:00', pass: 18, review: 2, delivered: 14 },
    { label: '07:00', pass: 24, review: 3, delivered: 20 },
    { label: '08:00', pass: 36, review: 5, delivered: 28 },
    { label: '09:00', pass: 42, review: 4, delivered: 32 },
    { label: '10:00', pass: 38, review: 6, delivered: 26 },
    { label: '11:00', pass: 48, review: 7, delivered: 35 },
    { label: '12:00', pass: 28, review: 3, delivered: 22 },
  ];

  const daysData = [
    { label: currentLang === 'id' ? 'Sen' : 'Mon', pass: 195, review: 18, delivered: 180 },
    { label: currentLang === 'id' ? 'Sel' : 'Tue', pass: 215, review: 24, delivered: 200 },
    { label: currentLang === 'id' ? 'Rab' : 'Wed', pass: 240, review: 20, delivered: 228 },
    { label: currentLang === 'id' ? 'Kam' : 'Thu', pass: 180, review: 15, delivered: 172 },
    { label: currentLang === 'id' ? 'Jum' : 'Fri', pass: 290, review: 32, delivered: 265 },
    { label: currentLang === 'id' ? 'Sab' : 'Sat', pass: 140, review: 12, delivered: 135 },
    { label: currentLang === 'id' ? 'Min' : 'Sun', pass: 165, review: 14, delivered: 155 },
  ];

  const currentChartData = chartMode === 'hourly' ? hourlyData : daysData;
  const maxBarValue = chartMode === 'hourly' ? 60 : 350;

  return (
    <div className="space-y-5">
      {/* Upper Bento Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card 1: Pipeline Progress (span 4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">{t.bentoPipelineTitle}</h3>
                <p className="text-xs text-slate-400">{t.bentoPipelineSub}</p>
              </div>
              <button
                onClick={() => onFilterByStatus?.('ALL')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{t.bentoViewAll}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4.5 mt-2">
              {/* Stage 1 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 font-medium text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>{t.stageIntake}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">{pIntake}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${pIntake}%` }} />
                </div>
              </div>

              {/* Stage 2 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 font-medium text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span>{t.stageXray}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">{pXray}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${pXray}%` }} />
                </div>
              </div>

              {/* Stage 3 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 font-medium text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{t.stageAvsec}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">{pAvsec}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pAvsec}%` }} />
                </div>
              </div>

              {/* Stage 4 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 font-medium text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{t.stageDO}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">{pDO}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${pDO}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-400">
            <span>{t.formulaValidated}</span>
            <span className="font-mono text-slate-600">{xrayedPieces} / {totalPieces} Units</span>
          </div>
        </div>

        {/* Card 2: Donut Chart - Security Overview (span 4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">{t.bentoDonutTitle}</h3>
              <p className="text-xs text-slate-400">{t.bentoDonutSub}</p>
            </div>
            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
              Shift 1
            </span>
          </div>

          {/* SVG Donut */}
          <div className="relative flex items-center justify-center my-3">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Ring */}
              <circle cx="50" cy="50" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="11" />
              {/* Pass segment (Blue) */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#2563EB"
                strokeWidth="11"
                strokeDasharray={`${passLen} ${circ}`}
                strokeDashoffset="0"
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                onMouseEnter={() => setHoveredDonut(t.statusCleared)}
                onMouseLeave={() => setHoveredDonut(null)}
              />
              {/* In Progress segment (Cyan) */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#06B6D4"
                strokeWidth="11"
                strokeDasharray={`${inProgLen} ${circ}`}
                strokeDashoffset={-passLen}
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                onMouseEnter={() => setHoveredDonut(t.statusScreening)}
                onMouseLeave={() => setHoveredDonut(null)}
              />
              {/* Review Required (Amber) */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="11"
                strokeDasharray={`${reviewLen} ${circ}`}
                strokeDashoffset={-(passLen + inProgLen)}
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                onMouseEnter={() => setHoveredDonut(t.statusReview)}
                onMouseLeave={() => setHoveredDonut(null)}
              />
              {/* Threat Hold / Discrepancy (Rose) */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#F43F5E"
                strokeWidth="11"
                strokeDasharray={`${holdLen} ${circ}`}
                strokeDashoffset={-(passLen + inProgLen + reviewLen)}
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                onMouseEnter={() => setHoveredDonut(t.statusHold)}
                onMouseLeave={() => setHoveredDonut(null)}
              />
            </svg>

            {/* Donut Center Counter */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                {sumDonut}
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                {hoveredDonut || t.totalPieces}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>{t.statusCleared}</span>
              </div>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">{passPieces}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span>{t.statusScreening}</span>
              </div>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">{inProgressPieces}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>{t.statusReview}</span>
              </div>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">{reviewPieces}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>{t.statusHold}</span>
              </div>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">{holdRejectPieces}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Critical Flight Departures & SLA Cutoffs (span 4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">{t.bentoFlightsTitle}</h3>
                <p className="text-xs text-slate-400">{t.bentoFlightsSub}</p>
              </div>
              <span className="text-xs font-semibold text-slate-500">{t.terminalCargoCGK}</span>
            </div>

            {/* Flight Mini Calendar/Day tracker */}
            <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl mb-3 text-center text-xs">
              {(currentLang === 'id'
                ? ['Sen 20', 'Sel 21', 'Rab 22', 'Kam 23', 'Hari Ini', 'Sab 25']
                : ['Mon 20', 'Tue 21', 'Wed 22', 'Thu 23', 'Today 24', 'Sat 25']
              ).map((d, i) => (
                <div
                  key={d}
                  className={`px-2 py-1 rounded-lg ${
                    i === 4 ? 'bg-blue-600 text-white font-bold shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  <span className="text-[10px] block font-mono">{d.split(' ')[0]}</span>
                  <span className="text-xs font-semibold">{d.split(' ')[1] || '24'}</span>
                </div>
              ))}
            </div>

            {/* Flights List */}
            <div className="space-y-2.5">
              {consignments.slice(0, 3).map((c) => {
                const isWarning = c.slaStatus === 'WARNING';
                return (
                  <div
                    key={c.id}
                    onClick={() => onSelectConsignment(c)}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                        <Plane className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-xs font-mono">{c.flightNo}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({c.origin} → {c.destination})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate max-w-[140px]">{c.airline}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Clock className={`w-3 h-3 ${isWarning ? 'text-amber-600' : 'text-slate-400'}`} />
                        <span className={`text-xs font-mono font-bold ${isWarning ? 'text-amber-600' : 'text-slate-700'}`}>
                          {c.cutoffTime}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {c.totalDeclaredPieces} pcs · {c.totalWeightKg}kg
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{t.slaEnforcement}</span>
            <span className="font-semibold text-emerald-600">{t.zeroBypass}</span>
          </div>
        </div>
      </div>

      {/* Lower Bento Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card 4: Team Members & Active Duty Stations (span 5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">{t.bentoPersonnelTitle}</h3>
                <p className="text-xs text-slate-400">{t.bentoPersonnelSub}</p>
              </div>
              <span className="text-xs font-semibold text-slate-500 font-mono">{t.onDutyText}</span>
            </div>

            <div className="divide-y divide-slate-100">
              {teamMembers.map((member) => (
                <div key={member.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold ${member.avatarColor} shadow-2xs`}
                    >
                      {member.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-900">{member.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">· {member.badgeId}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{member.station}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        member.dutyStatus === 'Online'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : member.dutyStatus === 'In Screening'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : member.dutyStatus === 'Reviewing'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {member.dutyStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{t.separationDuties}</span>
            <span className="font-semibold text-blue-600">{t.rbacActive}</span>
          </div>
        </div>

        {/* Card 5: Cargo Throughput Activity - Stacked SVG Bar Chart (span 7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">{t.bentoThroughputTitle}</h3>
                <p className="text-xs text-slate-400">{t.bentoThroughputSub}</p>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setChartMode('hourly')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    chartMode === 'hourly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.modeHourly}
                </button>
                <button
                  onClick={() => setChartMode('7days')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    chartMode === '7days' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.mode7Days}
                </button>
              </div>
            </div>

            {/* SVG Stacked Bar Chart */}
            <div className="relative pt-4 pb-2">
              <div className="h-44 w-full flex items-end justify-between gap-2 sm:gap-4 px-2">
                {currentChartData.map((d, idx) => {
                  const passHeight = Math.min(100, (d.pass / maxBarValue) * 100);
                  const reviewHeight = Math.min(100, (d.review / maxBarValue) * 100);
                  const isHovered = hoveredBar === idx;

                  return (
                    <div
                      key={d.label}
                      className="flex-1 flex flex-col items-center gap-1 group cursor-pointer relative"
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Tooltip */}
                      {isHovered && (
                        <div className="absolute -top-14 bg-slate-900 text-white text-[10px] rounded-lg p-2 shadow-xl z-20 whitespace-nowrap pointer-events-none font-mono">
                          <p className="font-bold text-slate-200">{d.label}</p>
                          <p className="text-blue-400">Pass: {d.pass} pcs</p>
                          <p className="text-amber-400">Review: {d.review} pcs</p>
                          <p className="text-emerald-400">Delivered: {d.delivered} pcs</p>
                        </div>
                      )}

                      {/* Stacked Bars */}
                      <div className="w-full max-w-[28px] h-36 bg-slate-50 rounded-lg flex flex-col justify-end overflow-hidden p-0.5 border border-slate-100">
                        {/* Review Stack */}
                        <div
                          className="w-full bg-amber-400/90 rounded-t transition-all duration-300"
                          style={{ height: `${reviewHeight}%` }}
                        />
                        {/* Pass Stack */}
                        <div
                          className="w-full bg-blue-600 rounded-b transition-all duration-300"
                          style={{ height: `${passHeight}%` }}
                        />
                      </div>

                      {/* Bar Label */}
                      <span className="text-[11px] font-mono font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded bg-blue-600" />
                <span>{t.clearedPass}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded bg-amber-400" />
                <span>{t.secondaryReview}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded bg-slate-200" />
                <span>{t.baselineCapacity}</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{t.calibrationText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
