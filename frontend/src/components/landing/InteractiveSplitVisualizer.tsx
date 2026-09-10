import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, Cpu } from 'lucide-react';

interface Contributor {
  id: string;
  label: string;
  percentage: number;
  color: string;
}

export const InteractiveSplitVisualizer: React.FC = () => {
  const [totalPool] = useState<number>(50000);
  const [isShieldedView, setIsShieldedView] = useState<boolean>(true);
  const [activeContributorIndex, setActiveContributorIndex] = useState<number>(0);

  const contributors: Contributor[] = [
    { id: 'c1', label: 'Lead Architect', percentage: 40, color: '#10b981' },
    { id: 'c2', label: 'Circuit Developer', percentage: 25, color: '#f59e0b' },
    { id: 'c3', label: 'Security Auditor', percentage: 20, color: '#8b5cf6' },
    { id: 'c4', label: 'UI Engineer', percentage: 15, color: '#06b6d4' },
  ];

  const active = contributors[activeContributorIndex];
  const activeAmount = (totalPool * active.percentage) / 100;

  // Compute SVG Donut segments
  let cumulativePercent = 0;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative p-6 sm:p-7 rounded-2xl bg-titanium-850/90 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
      {/* Top Bar with Live Invariant Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-100">Midnight Circuit Visualizer</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                Live Invariant
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">alloc * 100 == pool * %</p>
          </div>
        </div>

        {/* Shielded View Toggle */}
        <button
          onClick={() => setIsShieldedView(!isShieldedView)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            isShieldedView
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10'
              : 'bg-slate-800/80 border-slate-700 text-slate-300'
          }`}
        >
          {isShieldedView ? <EyeOff className="w-3.5 h-3.5 text-emerald-400" /> : <Eye className="w-3.5 h-3.5 text-amber-400" />}
          <span>{isShieldedView ? 'Shielded Mode (Private)' : 'Transparent Mode'}</span>
        </button>
      </div>

      {/* Center Grid: Donut Chart + Selected Contributor Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 items-center">
        {/* SVG Interactive Donut Chart */}
        <div className="relative flex items-center justify-center">
          <svg width="180" height="180" viewBox="0 0 180 180" className="rotate-[-90deg]">
            {contributors.map((c, i) => {
              const strokeDasharray = `${(c.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativePercent * (circumference / 100);
              cumulativePercent += c.percentage;

              const isSelected = i === activeContributorIndex;

              return (
                <circle
                  key={c.id}
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke={c.color}
                  strokeWidth={isSelected ? 18 : 13}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer hover:opacity-100"
                  style={{ opacity: isSelected ? 1 : 0.65 }}
                  onClick={() => setActiveContributorIndex(i)}
                />
              );
            })}
          </svg>

          {/* Donut Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Total Pool</span>
            <span className="text-base font-extrabold font-mono text-white">50,000</span>
            <span className="text-[10px] text-emerald-400 font-mono">tNIGHT</span>
          </div>
        </div>

        {/* Contributor Detail Shard */}
        <div className="p-4 rounded-xl bg-titanium-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">{active.label}</span>
            <span
              className="text-xs font-bold font-mono px-2 py-0.5 rounded"
              style={{ backgroundColor: `${active.color}22`, color: active.color, border: `1px solid ${active.color}44` }}
            >
              {active.percentage}% Share
            </span>
          </div>

          <div>
            <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
              <span>Allocated Payout:</span>
              <span className="text-[10px] text-slate-500 font-mono">
                {isShieldedView ? 'ZK-Enclave Protected' : 'Exposed On-Chain'}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 flex items-center justify-between">
              {isShieldedView ? (
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-sm font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>••••••••••• (Secret Witness)</span>
                </div>
              ) : (
                <span className="font-mono text-white text-sm font-bold">
                  {activeAmount.toLocaleString()} tNIGHT
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Circuit Verification:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Constraint Satisfied (0 Gas Leak)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Contributor Selector Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {contributors.map((c, i) => {
          const isSelected = i === activeContributorIndex;
          return (
            <button
              key={c.id}
              onClick={() => setActiveContributorIndex(i)}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-slate-800/90 border-emerald-400 text-white shadow-md'
                  : 'bg-titanium-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-xs font-semibold truncate">{c.label}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {c.percentage}% dividend
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
