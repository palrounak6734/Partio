import React from 'react';
import { motion } from 'framer-motion';
import { Vault, Coins, Shield, ExternalLink, Zap, Lock } from 'lucide-react';
import type { ProjectData } from '../../hooks/useContractState';
import { NETWORK_CONFIGS, type NetworkId } from '../../utils/constants';

interface TreasuryViewProps {
  projects: ProjectData[];
  network: NetworkId;
}

export const TreasuryView: React.FC<TreasuryViewProps> = ({ projects, network }) => {
  const activeConfig = NETWORK_CONFIGS[network];
  const totalPoolAll = projects.reduce((acc, p) => acc + p.totalPool, 0);
  const settledSum = projects
    .filter((p) => p.status === 'COMPLETED')
    .reduce((acc, p) => acc + p.totalPool, 0);
  const activeCommitments = totalPoolAll - settledSum;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-[#152130]/90 backdrop-blur-xl border border-slate-700/60 shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Shielded Vault</span>
            <Vault className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {totalPoolAll.toLocaleString()} <span className="text-xs text-slate-400 font-normal">tNIGHT</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-medium">
            Partitioned across {projects.length} organizational projects
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-[#152130]/90 backdrop-blur-xl border border-slate-700/60 shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Active Commitments</span>
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {activeCommitments.toLocaleString()} <span className="text-xs text-slate-400 font-normal">tNIGHT</span>
          </div>
          <div className="mt-2 text-[11px] text-cyan-400 font-medium">
            Locked pending ZK allocation proof confirmations
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.16 }}
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-[#152130]/90 backdrop-blur-xl border border-slate-700/60 shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Finalized Settlements</span>
            <Coins className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {settledSum.toLocaleString()} <span className="text-xs text-slate-400 font-normal">tNIGHT</span>
          </div>
          <div className="mt-2 text-[11px] text-teal-400 font-medium">
            100% verified on Midnight Preprod ledger
          </div>
        </motion.div>
      </div>

      {/* Contract & Telemetry info */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="p-6 rounded-2xl bg-[#152130]/90 backdrop-blur-xl border border-slate-700/60 shadow-xl"
      >
        <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Partio Smart Contract Infrastructure</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-4 rounded-xl bg-[#1a293b]/70 border border-slate-700/60"
          >
            <div className="text-slate-400 font-semibold mb-1">Active Target Contract ({activeConfig.name})</div>
            <div className="font-mono text-emerald-400 break-all select-all text-[11px]">
              {activeConfig.contractAddress}
            </div>
            <div className="mt-2">
              <a
                href={`${activeConfig.explorerUrl}/contract/${activeConfig.contractAddress}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-slate-300 hover:text-emerald-300 text-[11px] transition-colors"
              >
                <span>View Contract on Midnight Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-4 rounded-xl bg-[#1a293b]/70 border border-slate-700/60"
          >
            <div className="text-slate-400 font-semibold mb-1">Substrate RPC & Indexer Endpoints</div>
            <div className="font-mono text-slate-300 text-[11px] truncate">
              RPC: {activeConfig.rpcUrl}
            </div>
            <div className="font-mono text-slate-300 text-[11px] truncate mt-1">
              GraphQL: {activeConfig.indexerUrl}
            </div>
            <div className="mt-2">
              <a
                href={activeConfig.faucetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-slate-300 hover:text-emerald-300 text-[11px] transition-colors"
              >
                <span>Request Faucet Testnet Tokens</span>
                <Zap className="w-3 h-3 text-amber-400" />
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
