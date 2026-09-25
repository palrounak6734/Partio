import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { Shield, Coins, CheckCircle2, Layers } from 'lucide-react';
import type { ProjectData } from '../../hooks/useContractState';

interface TreasuryKPIProps {
  projects: ProjectData[];
  verifiedProofsCount: number;
}

export const TreasuryKPI: React.FC<TreasuryKPIProps> = ({ projects, verifiedProofsCount }) => {
  const totalPoolSum = projects.reduce((acc, p) => acc + p.totalPool, 0);
  const totalParticipants = projects.reduce((acc, p) => acc + p.participants, 0);
  const activeSplitsCount = projects.filter((p) => p.status === 'ACTIVE' || p.status === 'DISTRIBUTING').length;

  const kpis = [
    {
      title: 'Total Shielded Pools',
      value: totalPoolSum,
      suffix: ' tNIGHT',
      change: '100% Cryptographic Invariant',
      icon: Coins,
      accent: 'emerald',
      decimals: 0,
    },
    {
      title: 'Active Partition Projects',
      value: activeSplitsCount,
      suffix: ` / ${projects.length} Total`,
      change: 'Multi-Project Registry',
      icon: Layers,
      accent: 'teal',
      decimals: 0,
    },
    {
      title: 'Verified Allocations',
      value: verifiedProofsCount,
      suffix: ` of ${totalParticipants}`,
      change: 'On-Chain SNARK Verified',
      icon: CheckCircle2,
      accent: 'mint',
      decimals: 0,
    },
    {
      title: 'Privacy Score',
      value: 100,
      suffix: '% Confidential',
      change: 'Zero On-Chain Payout Leakage',
      icon: Shield,
      accent: 'cyan',
      decimals: 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08, ease: 'easeOut' }}
            whileHover={{ scale: 1.025, y: -3 }}
            className="group relative p-5 rounded-2xl bg-[#15202e]/90 backdrop-blur-xl border border-slate-700/60 hover:border-emerald-400/50 transition-all duration-300 shadow-lg shadow-black/25 hover:shadow-[0_0_24px_rgba(16,185,129,0.15)] overflow-hidden cursor-default"
          >
            {/* Top specular shimmer */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
                {kpi.title}
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 group-hover:scale-110 transition-transform">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-1">
              <AnimatedCounter value={kpi.value} decimals={kpi.decimals} />
              <span className="text-xs font-medium text-slate-300">{kpi.suffix}</span>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{kpi.change}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

