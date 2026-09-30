import React from 'react';
import { motion } from 'framer-motion';
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
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex justify-start mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/35 text-xs font-semibold text-emerald-300 shadow-md shadow-emerald-500/10">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            <span>Midnight Preprod Live • Compact 0.5.2</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-normal">Zero-Knowledge Settlement</span>
          </div>
        </motion.div>

        {/* 2-Column Responsive Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Value Proposition & CTAs (6 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-6"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Allocate fairly. Pay privately.{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Prove everything.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl font-normal">
              Partio lets organizations distribute compensation and shared funds according to verifiable rules without exposing everyone's private payment details. Powered by zero-knowledge circuits on Midnight.
            </p>

            {/* CTAs with Smooth Hover Elevation */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onScrollToOrganizer}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all"
              >
                <span>1. Configure Partition Pool</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onScrollToParticipant}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1a2636]/90 hover:bg-[#202f43] text-emerald-300 border border-emerald-500/40 font-semibold text-sm transition-all shadow-md"
              >
                <EyeOff className="w-4 h-4 text-emerald-400" />
                <span>2. Prove Allocation in ZK</span>
              </motion.button>
            </div>

            {/* Key Value Badges */}
            <div className="pt-4 flex flex-wrap gap-4 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Amount Leakage</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/60">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Deterministic Nullifiers</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/60">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Impact VM On-Chain Verifier</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Interactive Live Split Visualizer (6 cols) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
            className="lg:col-span-6"
          >
            <InteractiveSplitVisualizer />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

