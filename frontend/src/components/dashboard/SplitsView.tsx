import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sliders, ShieldAlert, CheckCircle2, Lock, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import type { ProjectData } from '../../hooks/useContractState';

interface SplitsViewProps {
  projects?: ProjectData[];
  project: ProjectData;
  onSelectProject?: (projectId: string) => void;
  onAllocateFunds: (projectId: string, allocPercentage: number) => Promise<any>;
  onVerifyAllocation?: (projectId: string, amount: number, pct: number) => Promise<any>;
  isProving: boolean;
}

export const SplitsView: React.FC<SplitsViewProps> = ({
  projects = [],
  project,
  onSelectProject,
  onAllocateFunds,
  onVerifyAllocation,
  isProving,
}) => {
  // Generate initial splits dynamically based on active project's participant count
  const generateDefaultSplits = (count: number) => {
    const roles = [
      'Lead Protocol Architect',
      'ZK Cryptography Engineer',
      'Smart Contract Auditor',
      'Infrastructure Developer',
      'Frontend / UX Specialist',
      'Community Coordinator',
    ];

    if (count === 3) {
      return [
        { name: roles[0], percentage: 40 },
        { name: roles[1], percentage: 35 },
        { name: roles[2], percentage: 25 },
      ];
    } else if (count === 4) {
      return [
        { name: roles[0], percentage: 35 },
        { name: roles[1], percentage: 25 },
        { name: roles[2], percentage: 25 },
        { name: roles[3], percentage: 15 },
      ];
    } else if (count === 5) {
      return [
        { name: roles[0], percentage: 30 },
        { name: roles[1], percentage: 25 },
        { name: roles[2], percentage: 20 },
        { name: roles[3], percentage: 15 },
        { name: roles[4], percentage: 10 },
      ];
    }

    // Default N-way split
    const base = Math.floor(100 / count);
    const remainder = 100 - base * count;
    return Array.from({ length: count }, (_, i) => ({
      name: roles[i % roles.length] || `Contributor Tier 0${i + 1}`,
      percentage: i === 0 ? base + remainder : base,
    }));
  };

  const [splits, setSplits] = useState(() => generateDefaultSplits(project.participants || 4));
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Sync when active project changes
  useEffect(() => {
    setSplits(generateDefaultSplits(project.participants || 4));
    setSuccessBanner(null);
  }, [project.id, project.participants]);

  const totalPercentage = splits.reduce((sum, s) => sum + s.percentage, 0);
  const isValid100 = totalPercentage === 100;

  const handleSliderChange = (index: number, val: number) => {
    const updated = [...splits];
    updated[index].percentage = val;
    setSplits(updated);
  };

  const handleApplyRules = async () => {
    if (!isValid100) return;
    try {
      await onAllocateFunds(project.id, splits[0].percentage);
      setSuccessBanner(`Rules locked on Midnight ledger for "${project.name}" (100% Value Conservation Proof Generated)`);
      setTimeout(() => setSuccessBanner(null), 6000);
    } catch {
      // Error handled by hook
    }
  };

  const handleRunVerify = async () => {
    if (!onVerifyAllocation) return;
    const firstShare = splits[0].percentage;
    const calcAmount = Math.round((project.totalPool * firstShare) / 100);
    try {
      await onVerifyAllocation(project.id, calcAmount, firstShare);
      setSuccessBanner(`Zero-knowledge proof synthesized and nullifier anchored on Midnight for "${splits[0].name}"!`);
      setTimeout(() => setSuccessBanner(null), 6000);
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 rounded-2xl bg-[#152130] border border-slate-700/60 shadow-2xl space-y-6"
      >
        {/* Top: Active Project Selector Banner */}
        <div className="p-4 rounded-xl bg-[#0e1724] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Active Partition Project</div>
              <h3 className="text-base font-bold text-white">{project.name}</h3>
              <span className="text-[11px] font-mono text-slate-400">{project.id}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Project Switcher Dropdown */}
            {projects.length > 1 && onSelectProject && (
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 font-medium">Switch Project:</label>
                <select
                  value={project.id}
                  onChange={(e) => onSelectProject(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-emerald-300 font-semibold focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.totalPool.toLocaleString()} tNIGHT)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
              Vault: {project.totalPool.toLocaleString()} tNIGHT
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/60 gap-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Contributor Share Partitioning (Circuit 4: allocateFunds)</span>
            </h4>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              Adjust distribution shares for {project.participants} contributors. Midnight ZK circuits prove Sum(Allocations) == 100% with zero individual salary disclosure.
            </p>
          </div>

          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono flex items-center gap-1.5 shrink-0 ${
              isValid100
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
            }`}
          >
            {isValid100 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />}
            <span>Total: {totalPercentage}% / 100%</span>
          </div>
        </div>

        {/* Success Banner */}
        {successBanner && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-200"
          >
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successBanner}</span>
          </motion.div>
        )}

        {/* Sliders list */}
        <div className="space-y-3.5">
          {splits.map((s, idx) => {
            const calculatedAmount = Math.round((project.totalPool * s.percentage) / 100);
            return (
              <motion.div 
                key={idx} 
                whileHover={{ y: -2 }}
                className="p-4 rounded-xl bg-[#192738] border border-slate-700/60 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold text-slate-200">{s.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono ml-2">(Tier 0{idx + 1})</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1 font-medium">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-200 font-bold">{calculatedAmount.toLocaleString()} tNIGHT</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold">
                      {s.percentage}%
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min="1"
                  max="100"
                  value={s.percentage}
                  onChange={(e) => handleSliderChange(idx, Number(e.target.value))}
                  className="w-full h-1.5 bg-[#101824] rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </motion.div>
            );
          })}
        </div>

        {/* Conservation Proof CTA */}
        <div className="pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-300 font-medium">
            {isValid100 ? (
              <span className="text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Value conservation constraint satisfied: Sum(allocations) == 100%
              </span>
            ) : (
              <span className="text-rose-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Sum of percentages must equal exactly 100% to generate SNARK proof.
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {onVerifyAllocation && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRunVerify}
                disabled={!isValid100 || isProving}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verify Contributor Proof</span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleApplyRules}
              disabled={!isValid100 || isProving}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>{isProving ? 'Anchoring...' : 'Anchor Rules On-Chain'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
