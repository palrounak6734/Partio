import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Binary, ShieldCheck, Database, Check, Loader2 } from 'lucide-react';

interface ZKProofPipelineProps {
  isProving: boolean;
  currentStepMessage?: string;
  activeStage?: number; // 1 to 4
}

export const ZKProofPipeline: React.FC<ZKProofPipelineProps> = ({
  isProving,
  currentStepMessage = '',
  activeStage = 1,
}) => {
  const stages = [
    {
      step: 1,
      title: 'Witness Gathering',
      desc: 'Local RAM evaluation',
      icon: Cpu,
    },
    {
      step: 2,
      title: 'Circuit Evaluation',
      desc: 'Compact polynomial constraints',
      icon: Binary,
    },
    {
      step: 3,
      title: 'SNARK Synthesis',
      desc: 'Zero-knowledge proof synthesis',
      icon: ShieldCheck,
    },
    {
      step: 4,
      title: 'Public Settlement',
      desc: 'Midnight on-chain anchor',
      icon: Database,
    },
  ];

  // Determine stage from current message if not explicitly set
  let computedStage = activeStage;
  if (currentStepMessage.includes('1.') || currentStepMessage.toLowerCase().includes('witness')) computedStage = 1;
  else if (currentStepMessage.includes('2.') || currentStepMessage.toLowerCase().includes('circuit') || currentStepMessage.toLowerCase().includes('synthesizing')) computedStage = 2;
  else if (currentStepMessage.includes('3.') || currentStepMessage.toLowerCase().includes('snark') || currentStepMessage.toLowerCase().includes('proof')) computedStage = 3;
  else if (currentStepMessage.includes('4.') || currentStepMessage.toLowerCase().includes('settlement') || currentStepMessage.toLowerCase().includes('ledger')) computedStage = 4;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative p-6 rounded-2xl bg-[#152130]/90 backdrop-blur-xl border border-slate-700/60 shadow-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>4-Stage Zero-Knowledge Pipeline</span>
            {isProving && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 flex items-center gap-1 shadow-sm">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                Active Prover
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5 font-medium">
            Client-side ZK-SNARK generation ensuring zero cleartext leak to node operators
          </p>
        </div>
      </div>

      {/* 4 Stages Stepper Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isDone = isProving ? computedStage > stage.step : true;
          const isCurrent = isProving && computedStage === stage.step;

          return (
            <motion.div
              key={stage.step}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className={`p-4 rounded-xl border transition-all duration-300 relative ${
                isCurrent
                  ? 'bg-emerald-950/50 border-emerald-400/70 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                  : isDone
                  ? 'bg-[#192738]/90 border-emerald-400/40 text-slate-200'
                  : 'bg-[#131e2b]/80 border-slate-700/60 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Stage 0{stage.step}
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? 'bg-emerald-400 text-slate-950'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : isDone ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    stage.step
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isCurrent ? 'text-emerald-400' : isDone ? 'text-emerald-400' : 'text-slate-500'}`} />
                <h4 className="text-xs font-bold text-white">{stage.title}</h4>
              </div>

              <p className="text-[11px] text-slate-300 leading-snug font-normal">{stage.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Live step output message */}
      {isProving && (
        <div className="mt-4 p-3 rounded-xl bg-[#111925]/90 border border-emerald-400/40 text-xs text-emerald-300 font-mono flex items-center gap-2 shadow-inner">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400 shrink-0" />
          <span className="truncate">{currentStepMessage}</span>
        </div>
      )}
    </motion.div>
  );
};

