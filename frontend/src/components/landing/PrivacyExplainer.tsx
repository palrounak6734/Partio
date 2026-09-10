import React from 'react';
import { Lock, Eye, ShieldCheck } from 'lucide-react';

export const PrivacyExplainer: React.FC = () => {
  const privateFields = [
    { name: 'Individual Payout Amount', why: 'Evaluated exclusively inside Compact circuit constraint equations in client RAM.' },
    { name: 'Participant Secret Key', why: 'Used to derive deterministic nullifier hash; never leaves local device memory.' },
    { name: 'Private Salt / Blinding Factor', why: 'Guarantees pre-image unpredictability without on-chain storage.' },
    { name: 'Contributor Identity & Relationships', why: 'Other participants cannot inspect who received how much or when.' },
  ];

  const publicFields = [
    { name: 'Distribution Pool ID & State', why: 'Auditable identifier so contributors know which distribution is active.' },
    { name: 'Total Pool Capacity', why: 'Committed by organizer so arithmetic ceiling boundaries are verifiable.' },
    { name: 'Configured Rule Identifier', why: 'Indicates whether percentage, equal, or capped circuit logic applies.' },
    { name: 'Verified Allocations Counter', why: 'Audit counter tracking how many participants have submitted valid proofs.' },
    { name: 'Deterministic Nullifier Hash', why: 'Prevents double-claiming and replay attacks without revealing secret key.' },
    { name: 'Boolean Verification Outcome', why: 'Proves mathematical correctness on-chain with zero leaked data.' },
  ];

  return (
    <section className="py-14">
      <div className="app-container">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-300 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dual-State Privacy Boundary</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            What Observers Learn vs. What Remains Secret
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            In Midnight Compact, privacy is enforced mathematically. Data only crosses into the public domain via deliberate <code className="text-emerald-300 font-mono">disclose()</code> statements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Private / Local Enclave */}
          <div className="p-6 rounded-2xl bg-titanium-850/90 border border-amber-500/20 shadow-xl shadow-amber-500/5">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Private State (Local Client RAM Only)</h3>
                <p className="text-xs text-slate-400">Never broadcast, never stored in blocks, zero leakage</p>
              </div>
            </div>

            <div className="space-y-3">
              {privateFields.map((field, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-titanium-900/80 border border-slate-800/80">
                  <div className="flex items-center gap-2 font-semibold text-xs text-amber-300 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
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
          <div className="p-6 rounded-2xl bg-titanium-850/90 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Public State (On-Chain Settlement)</h3>
                <p className="text-xs text-slate-400">Verifiable by all validators, auditors, and indexers on Preprod</p>
              </div>
            </div>

            <div className="space-y-3">
              {publicFields.map((field, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-titanium-900/80 border border-slate-800/80">
                  <div className="flex items-center gap-2 font-semibold text-xs text-emerald-300 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
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
