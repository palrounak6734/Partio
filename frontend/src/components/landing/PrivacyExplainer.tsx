import React from 'react';
import { Lock, Eye, ShieldCheck } from 'lucide-react';

export const PrivacyExplainer: React.FC = () => {
  const privateFields = [
    { name: 'Individual Payout Amount', why: 'Evaluated solely inside Compact circuit constraint equations in client RAM.' },
    { name: 'Participant Private Secret Key', why: 'Used to derive deterministic nullifier hash; never leaves local device memory.' },
    { name: 'Private Salt / Blinding Factor', why: 'Guarantees pre-image unpredictability without on-chain record.' },
    { name: 'Participant Identity & Peer Relationships', why: 'Other participants cannot see who received how much or when.' },
  ];

  const publicFields = [
    { name: 'Distribution Pool ID & Status', why: 'Audit-relevant identifier so participants know which pool is active.' },
    { name: 'Total Pool Capacity', why: 'Publicly committed by organizer so arithmetic ceiling is verifiable.' },
    { name: 'Configured Rule Type Identifier', why: 'Indicates whether percentage, equal, or capped circuit logic applies.' },
    { name: 'Verified Allocations Counter', why: 'Tracks how many participants have submitted verified cryptographic proofs.' },
    { name: 'Deterministic Nullifier Hash', why: 'Cryptographic hash prevents replay attacks and double-claims without leaking secrets.' },
    { name: 'Boolean Verification Outcome', why: 'Proves mathematical correctness on-chain with zero leaked data.' },
  ];

  return (
    <section className="py-12">
      <div className="app-container">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-medium text-indigo-300 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Dual-State Privacy Boundary</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            What Observers Learn vs. What Remains Secret
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            In Midnight Compact, privacy is woven into every circuit. Data only becomes public via deliberate <code className="text-cyan-300 font-mono">disclose()</code> calls.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Private / Local Enclave */}
          <div className="p-6 rounded-2xl bg-[#0b1222]/90 border border-rose-500/20 shadow-xl shadow-rose-500/5">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Private State (Local RAM Only)</h3>
                <p className="text-xs text-slate-400">Never broadcast, never stored in blocks, zero leakage</p>
              </div>
            </div>

            <div className="space-y-3">
              {privateFields.map((field, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 font-semibold text-xs text-rose-300 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>{field.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-3.5">
                    {field.why}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Public / On-Chain State */}
          <div className="p-6 rounded-2xl bg-[#0b1222]/90 border border-cyan-500/20 shadow-xl shadow-cyan-500/5">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Public State (On-Chain Settlement)</h3>
                <p className="text-xs text-slate-400">Visible to all validators, auditors, and indexers on Preprod</p>
              </div>
            </div>

            <div className="space-y-3">
              {publicFields.map((field, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 font-semibold text-xs text-cyan-300 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{field.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-3.5">
                    {field.why}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
