import React from 'react';
import { Sliders, Cpu, CheckCircle } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Organizer Defines Rule',
      icon: Sliders,
      description: 'The organizer commits public pool parameters to Midnight: total pool size, participant count, and mathematical rule constraints (e.g. 40% share or 1/N equal dividend).',
      tag: 'Public State',
      accent: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    },
    {
      num: '02',
      title: 'Participant Proves in ZK',
      icon: Cpu,
      description: 'The contributor inputs their private payout and secret salt locally. The Compact circuit evaluates arithmetic assertions in RAM and generates a ZK-SNARK proof with a deterministic nullifier.',
      tag: 'Private Witness',
      accent: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    },
    {
      num: '03',
      title: 'On-Chain Settlement',
      icon: CheckCircle,
      description: 'Midnight Substrate validators verify the mathematical validity of the proof against the verification key on Preprod. Payout compliance is recorded with ZERO amount disclosure.',
      tag: 'Selective Disclosure',
      accent: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    },
  ];

  return (
    <section className="py-14 border-y border-slate-800/80 bg-titanium-950/60">
      <div className="app-container">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-emerald-400">Cryptographic Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            How Zero-Knowledge Splits Work
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Dual-state execution separating off-chain private witness evaluation from on-chain public settlement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative p-6 rounded-2xl bg-titanium-850/80 border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-extrabold font-mono text-slate-700 group-hover:text-emerald-400/80 transition-colors">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                    {step.tag}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 rounded-xl border ${step.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-200 transition-colors">
                    {step.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
