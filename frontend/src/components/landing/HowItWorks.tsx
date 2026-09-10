import React from 'react';
import { Sliders, Cpu, CheckCircle } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Organizer Defines Rule',
      icon: Sliders,
      description: 'The project organizer initializes a distribution pool with public parameters: total pool size, participant count, and mathematical rule constraints (e.g. 40% share or 1/N equal split).',
      tag: 'Public State',
    },
    {
      num: '02',
      title: 'Participant Proves in ZK',
      icon: Cpu,
      description: 'Each participant inputs their private allocation and secret salt locally. The Compact circuit evaluates arithmetic assertions in RAM and generates a ZK-SNARK proof with a deterministic nullifier.',
      tag: 'Private Witness',
    },
    {
      num: '03',
      title: 'Verifiable Settlement',
      icon: CheckCircle,
      description: 'The Midnight Substrate verifier checks proof validity on Preprod. The transaction confirms that the split obeys all mathematical constraints while disclosing ZERO private payout amounts.',
      tag: 'Selective Disclosure',
    },
  ];

  return (
    <section className="py-12 border-y border-slate-800/80 bg-slate-950/40">
      <div className="app-container">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How Zero-Knowledge Splits Work
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Dual-state architecture separating private computation from public verification
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-extrabold font-mono text-slate-700 group-hover:text-cyan-400/80 transition-colors">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {step.tag}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-200 transition-colors">
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
