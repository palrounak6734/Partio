import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle2, User, Sparkles } from 'lucide-react';
import type { ProjectData } from '../../hooks/useContractState';

interface DistributionMapProps {
  project: ProjectData;
  onVerifyClick?: () => void;
}

export const DistributionMap: React.FC<DistributionMapProps> = ({ project, onVerifyClick }) => {
  const contributors = [
    { role: 'Core Protocol Lead', share: '35%', verified: true, key: '0x1a8f...39b2' },
    { role: 'ZK Circuits Engineer', share: '25%', verified: true, key: '0x2c4e...81a0' },
    { role: 'Smart Contract Auditor', share: '25%', verified: project.verifiedCount >= 3, key: '0x5d9b...44f1' },
    { role: 'Infrastructure Dev', share: '15%', verified: project.verifiedCount >= 4, key: '0x7e3a...11c6' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative p-6 rounded-2xl bg-[#152130]/90 backdrop-blur-xl border border-slate-700/60 shadow-2xl overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-700/60 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">{project.name}</h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                project.status === 'COMPLETED'
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                  : project.status === 'DISTRIBUTING'
                  ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300 animate-pulse'
                  : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
              }`}
            >
              {project.status}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Zero-Knowledge Rule Enforcement: {project.ruleDescription}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-[#101824]/90 border border-slate-700/70 text-xs shadow-inner">
            <span className="text-slate-300">Pool Commitment: </span>
            <span className="font-mono text-emerald-300 font-semibold">{project.poolCommitment.slice(0, 10)}...{project.poolCommitment.slice(-6)}</span>
          </div>
        </div>
      </div>

      {/* Distribution Graph Visualization */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 relative">
        {/* Left: Central Pool Vault Node */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex flex-col items-center text-center p-5 rounded-2xl bg-gradient-to-b from-[#1c2c3d] to-[#121d2a] border border-emerald-400/40 shadow-xl w-full md:w-64 z-10"
        >
          <div className="relative p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 mb-3 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            <Shield className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#121d2a] flex items-center justify-center">
              <Lock className="w-2 h-2 text-slate-950" />
            </span>
          </div>
          <div className="text-xs uppercase font-bold tracking-wider text-slate-300">Total Project Vault</div>
          <div className="text-xl font-extrabold text-white font-mono mt-1">
            {project.totalPool.toLocaleString()} <span className="text-xs text-emerald-300 font-normal">tNIGHT</span>
          </div>
          <div className="mt-2 text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-medium flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Shielded Invariant</span>
          </div>
        </motion.div>

        {/* Center Connecting Value Stream Animation */}
        <div className="hidden md:flex flex-col items-center justify-center w-24 relative">
          <div className="w-full h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 relative overflow-hidden">
            <div className="absolute inset-y-0 w-8 bg-white/90 blur-xs animate-[moveRight_1.5s_infinite_linear]" />
          </div>
          <div className="mt-2 text-[9px] font-bold text-slate-300 uppercase tracking-widest text-center">
            ZK Rules
          </div>
        </div>

        {/* Right: Contributor Allocation Nodes */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 z-10">
          {contributors.map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className={`p-3.5 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                c.verified
                  ? 'bg-[#192738]/90 border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.12)]'
                  : 'bg-[#131e2b]/80 border-slate-700/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${c.verified ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{c.role}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{c.key}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-emerald-300">{c.share}</div>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 justify-end">
                    <Lock className="w-2.5 h-2.5 text-slate-400" />
                    <span>●●●● tNIGHT</span>
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
                <span className="text-slate-300 font-medium">Zero-Knowledge State:</span>
                {c.verified ? (
                  <span className="text-emerald-300 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Proof Verified</span>
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>Awaiting Witness</span>
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Callout */}
      <div className="mt-6 pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Individual compensation amounts are encrypted in client witness memory and never published on-chain.</span>
        </div>
        {onVerifyClick && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onVerifyClick}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-semibold border border-emerald-400/40 transition-colors text-xs shadow-sm"
          >
            Verify My Allocation
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

