import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ExternalLink, CheckCircle2, Clock, Database, Hash } from 'lucide-react';
import type { VerificationLog } from '../../hooks/useContractState';
import { NETWORK_CONFIGS, type NetworkId } from '../../utils/constants';

interface ProofsViewProps {
  logs: VerificationLog[];
  network: NetworkId;
}

export const ProofsView: React.FC<ProofsViewProps> = ({ logs, network }) => {
  const activeConfig = NETWORK_CONFIGS[network];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="p-6 rounded-2xl bg-[#152130]/90 backdrop-blur-xl border border-slate-700/60 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-700/60 gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Partio Zero-Knowledge Proof Timeline</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Public on-chain verification outcomes. Every proof verifies mathematical partition correctness without leaking recipient amounts.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 font-mono">
              Total Proofs: {logs.length}
            </span>
          </div>
        </div>

        {/* Proofs List */}
        <div className="mt-6 space-y-3">
          {logs.map((log, idx) => {
            const explorerUrl = `${activeConfig.explorerUrl}/tx/${log.nullifier}`;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.25 }}
                whileHover={{ scale: 1.008, x: 3 }}
                className="p-4 rounded-xl bg-[#1a293b]/70 border border-slate-700/60 hover:border-emerald-500/40 hover:bg-[#1a293b] transition-colors shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-200">{log.rule}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold">
                        {log.status}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Hash className="w-3 h-3 text-slate-500" />
                        Nullifier: {log.nullifier.slice(0, 10)}...{log.nullifier.slice(-8)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Database className="w-3 h-3 text-slate-500" />
                        Block #{log.blockNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:self-center">
                  <div className="text-right text-xs">
                    <div className="text-[10px] text-slate-500">Gas Spent</div>
                    <div className="font-mono font-semibold text-slate-300">{log.gasCostDust} DUST</div>
                  </div>

                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700 transition-colors"
                    title="View on Midnight Explorer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
