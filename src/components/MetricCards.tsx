import React from 'react';
import { Package, ScanLine, ShieldAlert, FileCheck2, ArrowUpRight } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface MetricCardsProps {
  totalConsignments: number;
  totalPieces: number;
  xrayedPieces: number;
  pendingAvsecPieces: number;
  doIssuedCount: number;
  deliveredCount: number;
  currentLang: Language;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalConsignments,
  totalPieces,
  xrayedPieces,
  pendingAvsecPieces,
  doIssuedCount,
  deliveredCount,
  currentLang,
}) => {
  const t = translations[currentLang];
  const xrayCoveragePercent = totalPieces > 0 ? ((xrayedPieces / totalPieces) * 100).toFixed(1) : '0';

  const metrics = [
    {
      id: 'active-consignments',
      label: t.metricActiveConsignments,
      value: totalConsignments,
      trend: '+25%',
      isPositive: true,
      subtext: `${totalPieces} ${t.metricDeclaredUnits}`,
      iconBg: 'bg-blue-600',
      icon: <Package className="w-6 h-6 text-white" />,
    },
    {
      id: 'xray-screened',
      label: t.metricPiecesScreened,
      value: xrayedPieces,
      trend: `${xrayCoveragePercent}%`,
      isPositive: true,
      subtext: `84.5% ${t.metricCoverageRate} · 282 PASS`,
      iconBg: 'bg-emerald-500',
      icon: <ScanLine className="w-6 h-6 text-white" />,
    },
    {
      id: 'pending-triage',
      label: t.metricPendingTriage,
      value: pendingAvsecPieces,
      trend: '-12%',
      isPositive: true,
      subtext: t.metricAvgSla,
      iconBg: 'bg-amber-500',
      icon: <ShieldAlert className="w-6 h-6 text-white" />,
    },
    {
      id: 'do-issued',
      label: t.metricDoIssued,
      value: doIssuedCount,
      trend: `${deliveredCount} ${t.metricHandedOver}`,
      isPositive: true,
      subtext: '100% Digital PoH verified',
      iconBg: 'bg-purple-600',
      icon: <FileCheck2 className="w-6 h-6 text-white" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((m) => (
        <div
          key={m.id}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex items-center gap-4.5"
        >
          {/* Icon Container */}
          <div className={`w-12 h-12 rounded-xl ${m.iconBg} flex items-center justify-center shrink-0 border border-slate-100/80`}>
            {m.icon}
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-500 truncate">{m.label}</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                {m.value}
              </span>
              <div className="flex items-center text-[11px] font-semibold text-emerald-600">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                <span className="font-mono">{m.trend}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {m.subtext}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
