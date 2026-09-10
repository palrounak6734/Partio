import React from 'react';
import { Shield, Lock, EyeOff, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onScrollToOrganizer: () => void;
  onScrollToParticipant: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToOrganizer,
  onScrollToParticipant,
}) => {
  return (
    <section className="relative pt-6 pb-12 overflow-hidden">
      <div className="app-container">
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-medium text-cyan-300 shadow-lg shadow-cyan-500/5 animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero-Knowledge Proofs on Midnight Preprod</span>
            <span className="w-1 h-1 rounded-full bg-cyan-400" />
            <span className="text-slate-400">Selective Disclosure</span>
          </div>
        </div>

        {/* Main Headline & Description */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Prove the Split is Correct Without Publishing{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Everyone's Payout.
            </span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            SplitShield enables teams, DAOs, and grant programs to verify fair distribution rules using zero-knowledge circuits on Midnight. Participants prove their allocation compliance while keeping exact amounts and identities mathematically private.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            <button
              onClick={onScrollToOrganizer}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all transform active:scale-95"
            >
              <span>1. Create Distribution Pool</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onScrollToParticipant}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 font-semibold text-sm transition-all transform active:scale-95"
            >
              <EyeOff className="w-4 h-4" />
              <span>2. Prove Allocation Privately</span>
            </button>
          </div>
        </div>

        {/* Hero Visual Banner with Full-Image Coordinate Scanning Bar */}
        <div className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#0b1222] shadow-2xl shadow-cyan-500/10 group">
          {/* Laser Scanline Bar sweeping 100% container height */}
          <div className="scanline-bar" />

          {/* Image Banner */}
          <img
            src="/zk_hero_banner.jpg"
            alt="Zero-Knowledge Dual-State Payment Architecture"
            className="w-full h-auto object-cover max-h-[460px] opacity-90 transition-opacity group-hover:opacity-100"
          />

          {/* Overlay Gradient on bottom edge */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#070b14] via-[#070b14]/70 to-transparent pointer-events-none" />

          {/* Floating Key Badges over Image */}
          <div className="absolute bottom-4 inset-x-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 text-[11px] text-cyan-200">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>Client Memory Witness</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-indigo-500/30 text-[11px] text-indigo-200">
              <Shield className="w-3 h-3 text-indigo-400" />
              <span>Zero-Knowledge Proof Server / WASM</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-emerald-500/30 text-[11px] text-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Public Preprod Settlement</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
