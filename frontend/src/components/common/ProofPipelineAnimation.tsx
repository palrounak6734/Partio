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
    <div className="my-8 p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0c162c] to-slate-950 border border-cyan-500/20 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            Active ZK Proving Pipeline
          </span>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {isProving ? (
            <span className="text-cyan-300 animate-pulse">{stepMessage}</span>
          ) : (
            'Standby — Ready for witness evaluation'
          )}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* Node 1: Client Memory Vault */}
        <div className={`p-4 rounded-xl border transition-all ${
          isProving ? 'bg-cyan-500/10 border-cyan-400/60 shadow-lg shadow-cyan-500/10' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Lock className="w-4 h-4" />
            </div>
            <span className="font-semibold text-xs text-white">1. Local Memory Vault</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Raw allocation amount & secret salt stay strictly inside client RAM.
          </p>
        </div>

        {/* Node 2: ZK-SNARK Prover */}
        <div className={`p-4 rounded-xl border transition-all ${
          isProving ? 'bg-indigo-500/15 border-indigo-400/80 shadow-lg shadow-indigo-500/10 animate-pulse' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
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
          isProving ? 'bg-emerald-500/10 border-emerald-400/60 shadow-lg shadow-emerald-500/10' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="font-semibold text-xs text-white">3. Public Ledger Settlement</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Validators verify proof against verifier key; records nullifier hash.
          </p>
        </div>
      </div>
    </div>
  );
};
