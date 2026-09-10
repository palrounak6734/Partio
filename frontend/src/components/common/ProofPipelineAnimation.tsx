import React from 'react';
import { Lock, Cpu, CheckCircle2 } from 'lucide-react';

interface ProofPipelineAnimationProps {
  isProving: boolean;
  stepMessage: string;
}

export const ProofPipelineAnimation: React.FC<ProofPipelineAnimationProps> = ({
  isProving,
  stepMessage,
}) => {
  return (
    <div className="my-8 p-6 rounded-2xl bg-gradient-to-r from-titanium-950 via-titanium-850 to-titanium-950 border border-emerald-500/25 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Active ZK Proving Pipeline (Midnight.js)
          </span>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {isProving ? (
            <span className="text-emerald-300 animate-pulse">{stepMessage}</span>
          ) : (
            'Standby — Compact circuit loaded in client memory'
          )}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* Node 1: Client Memory Vault */}
        <div className={`p-4 rounded-xl border transition-all ${
          isProving ? 'bg-amber-500/10 border-amber-400/60 shadow-lg shadow-amber-500/10' : 'bg-titanium-900/70 border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lock className="w-4 h-4" />
            </div>
            <span className="font-semibold text-xs text-white">1. Local Memory Vault</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Raw payout balance & secret salt stay strictly inside client RAM.
          </p>
        </div>

        {/* Node 2: ZK-SNARK Prover */}
        <div className={`p-4 rounded-xl border transition-all ${
          isProving ? 'bg-emerald-500/15 border-emerald-400/80 shadow-lg shadow-emerald-500/10 animate-pulse' : 'bg-titanium-900/70 border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="font-semibold text-xs text-white">2. ZK Arithmetic Circuit</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Evaluates rule polynomial constraints & synthesizes cryptographic proof.
          </p>
        </div>

        {/* Node 3: Public Ledger Settlement */}
        <div className={`p-4 rounded-xl border transition-all ${
          isProving ? 'bg-purple-500/10 border-purple-400/60 shadow-lg shadow-purple-500/10' : 'bg-titanium-900/70 border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="font-semibold text-xs text-white">3. Public Settlement</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Validators verify proof against verifier key; records nullifier hash.
          </p>
        </div>
      </div>
    </div>
  );
};
