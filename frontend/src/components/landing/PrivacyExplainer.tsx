import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, ShieldCheck } from 'lucide-react';

export const PrivacyExplainer: React.FC = () => {
  const privateFields = [
    { name: 'Individual Payout Amount', why: 'Evaluated exclusively inside Compact circuit constraint equations in client RAM.' },
    { name: 'Participant Secret Key', why: 'Used to derive deterministic nullifier hash; never leaves local device memory.' },
    { name: 'Private Salt / Blinding Factor', why: 'Guarantees pre-image unpredictability without on-chain storage.' },
    { name: 'Contributor Identity & Relationships', why: 'Other participants cannot inspect who received how much or when.' },
  ];

  const publicFields = [
    { name: 'Partition Pool ID & State', why: 'Auditable identifier so contributors know which partition is active.' },
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
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/35 text-xs font-semibold text-emerald-300 mb-3 shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dual-State Privacy Boundary</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            What Observers Learn vs. What Remains Secret
          </h2>
          <p className="text-sm text-slate-300 mt-2 font-medium">
            In Midnight Compact, privacy is enforced mathematically. Data only crosses into the public domain via deliberate <code className="text-emerald-300 font-mono font-bold">disclose()</code> statements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Private / Local Enclave */}
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl bg-[#162334]/90 border border-amber-500/30 shadow-xl shadow-amber-500/5 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700/60">
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-300">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Private State (Local Client RAM Only)</h3>
                <p className="text-xs text-slate-300">Never broadcast, never stored in blocks, zero leakage</p>
              </div>
            </div>

            <div className="space-y-3">
              {privateFields.map((field, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 3 }}
                  className="p-3.5 rounded-xl bg-[#1c2c40]/90 border border-slate-700/60 transition-all"
                >
                  <div className="flex items-center gap-2 font-semibold text-xs text-amber-300 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{field.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed pl-3.5 font-normal">
                    {field.why}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Public / On-Chain State */}
          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl bg-[#162334]/90 border border-emerald-500/30 shadow-xl shadow-emerald-500/5 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700/60">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/35 text-emerald-300">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Public State (On-Chain Settlement)</h3>
                <p className="text-xs text-slate-300">Verifiable by all validators, auditors, and indexers on Preprod</p>
              </div>
            </div>

            <div className="space-y-3">
              {publicFields.map((field, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 3 }}
                  className="p-3.5 rounded-xl bg-[#1c2c40]/90 border border-slate-700/60 transition-all"
                >
                  <div className="flex items-center gap-2 font-semibold text-xs text-emerald-300 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{field.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed pl-3.5 font-normal">
                    {field.why}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

