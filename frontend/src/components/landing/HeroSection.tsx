import React from 'react';
import { EyeOff, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { InteractiveSplitVisualizer } from './InteractiveSplitVisualizer';

interface HeroSectionProps {
  onScrollToOrganizer: () => void;
  onScrollToParticipant: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToOrganizer,
  onScrollToParticipant,
}) => {
  return (
    <section className="relative pt-6 pb-16 overflow-hidden">
      <div className="app-container">
        {/* Top Tagline Pill */}
        <div className="flex justify-start mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-300 shadow-lg shadow-emerald-500/5 animate-pulse-subtle">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Midnight Preprod Live • Compact 0.5.2</span>
            <span className="w-1 h-1 rounded-full bg-emerald-400" />
            <span className="text-slate-400">Zero-Knowledge Settlement</span>
          </div>
        </div>

        {/* 2-Column Responsive Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Value Proposition & CTAs (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Prove the Split is Correct Without Publishing{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Everyone's Payout.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              SplitShield enables DAOs, distributed teams, and grant pools to verify fair allocation mathematics using zero-knowledge circuits on Midnight. Contributors prove compliance with distribution rules while individual compensation remains 100% confidential.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onScrollToOrganizer}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all transform active:scale-95"
              >
                <span>1. Configure Distribution Pool</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onScrollToParticipant}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-titanium-800/90 hover:bg-titanium-700 text-emerald-300 border border-emerald-500/30 font-semibold text-sm transition-all transform active:scale-95 shadow-md"
              >
                <EyeOff className="w-4 h-4" />
                <span>2. Prove Allocation in ZK</span>
              </button>
            </div>

            {/* Key Value Badges */}
            <div className="pt-4 flex flex-wrap gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Amount Leakage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Deterministic Nullifiers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Impact VM On-Chain Verifier</span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Live Split Visualizer (6 cols) */}
          <div className="lg:col-span-6">
            <InteractiveSplitVisualizer />
          </div>
        </div>
      </div>
    </section>
  );
};
