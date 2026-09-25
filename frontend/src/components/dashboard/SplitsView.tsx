import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders, ShieldAlert, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import type { ProjectData } from '../../hooks/useContractState';

interface SplitsViewProps {
  project: ProjectData;
  onAllocateFunds: (projectId: string, allocPercentage: number) => Promise<any>;
  isProving: boolean;
}

export const SplitsView: React.FC<SplitsViewProps> = ({
  project,
  onAllocateFunds,
  isProving,
}) => {
  const [splits, setSplits] = useState([
    { name: 'Core Contributor 1', percentage: 35 },
    { name: 'Core Contributor 2', percentage: 25 },
    { name: 'Security Auditor', percentage: 25 },
    { name: 'Community Contributor', percentage: 15 },
  ]);

  const totalPercentage = splits.reduce((sum, s) => sum + s.percentage, 0);
  const isValid100 = totalPercentage === 100;

  const handleSliderChange = (index: number, val: number) => {
    const updated = [...splits];
    updated[index].percentage = val;
    setSplits(updated);
  };

  const handleApplyRules = async () => {
    if (!isValid100) return;
    await onAllocateFunds(project.id, splits[0].percentage);
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 rounded-2xl bg-[#152130]/90 backdrop-blur-xl border border-slate-700/60 shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-700/60 gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <span>Confidential Partition Allocation Rules</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              Adjust distribution shares. ZK circuit enforces that Sum(Allocations) == 100% with zero individual salary disclosure.
            </p>
          </div>

          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono flex items-center gap-1.5 ${
              isValid100
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
            }`}
          >
            {isValid100 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />}
            <span>Total: {totalPercentage}% / 100%</span>
          </div>
        </div>

        {/* Sliders list */}
        <div className="mt-6 space-y-4">
          {splits.map((s, idx) => {
            const calculatedAmount = Math.round((project.totalPool * s.percentage) / 100);
            return (
              <motion.div 
                key={idx} 
                whileHover={{ y: -2 }}
                className="p-4 rounded-xl bg-[#192738]/90 border border-slate-700/60 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold text-slate-200">{s.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono ml-2">(Tier 0{idx + 1})</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1 font-medium">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-300">~{calculatedAmount.toLocaleString()} tNIGHT</span>
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
        <div className="mt-8 pt-6 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
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

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleApplyRules}
            disabled={!isValid100 || isProving}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>{isProving ? 'Proving Conservation...' : 'Anchor Rules On-Chain'}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

