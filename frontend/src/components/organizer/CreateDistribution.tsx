import React, { useState } from 'react';
import { Sliders, PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { DISTRIBUTION_RULES } from '../../utils/constants';

interface CreateDistributionProps {
  onInitialize: (rule: number, poolAmount: number, participants: number) => Promise<void>;
  isProving: boolean;
  provingStep: string;
  isConnected: boolean;
  onOpenConnectModal: () => void;
}

export const CreateDistribution: React.FC<CreateDistributionProps> = ({
  onInitialize,
  isProving,
  provingStep,
  isConnected,
  onOpenConnectModal,
}) => {
  const [selectedRule, setSelectedRule] = useState<number>(1);
  const [poolAmount, setPoolAmount] = useState<string>('');
  const [participantCount, setParticipantCount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleQuickFill = () => {
    setSelectedRule(1);
    setPoolAmount('10000');
    setParticipantCount('4');
    setError(null);
  };

  const handleClear = () => {
    setPoolAmount('');
    setParticipantCount('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);

    const pool = Number(poolAmount);
    const count = Number(participantCount);

    if (!pool || pool <= 0) {
      setError('Please enter a valid pool amount greater than 0.');
      return;
    }

    if (!count || count <= 0) {
      setError('Please specify at least 1 participant.');
      return;
    }

    try {
      await onInitialize(selectedRule, pool, count);
      setSuccessNotice(`Successfully initialized distribution pool with ${pool.toLocaleString()} tNIGHT on Preprod!`);
      setTimeout(() => setSuccessNotice(null), 5000);
    } catch (err: any) {
      setError(err?.message || 'Failed to initialize pool.');
    }
  };

  const currentRuleObj = DISTRIBUTION_RULES.find((r) => r.id === selectedRule) || DISTRIBUTION_RULES[0];

  return (
    <div id="organizer-section" className="p-6 sm:p-8 rounded-2xl bg-titanium-850/90 border border-emerald-500/25 shadow-2xl shadow-emerald-500/5 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">Step 1 — Organizer</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                Public Setup
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
              Create Distribution Pool & Constraints
            </h2>
          </div>
        </div>

        {/* Quick Helper Chips */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700 transition-colors"
          >
            ⚡ Fill Example
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Rule Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Select Allocation Rule Model
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DISTRIBUTION_RULES.map((rule) => {
              const isSelected = selectedRule === rule.id;
              return (
                <button
                  type="button"
                  key={rule.id}
                  onClick={() => setSelectedRule(rule.id)}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-titanium-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm text-slate-100">{rule.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      isSelected ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {rule.badge}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400">{rule.description}</p>
                </button>
              );
            })}
          </div>

          {/* Active Rule Constraint Formula Callout */}
          <div className="mt-3 p-3 rounded-xl bg-titanium-950/90 border border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">Circuit Constraint:</span>
            <span className="font-mono text-emerald-300 font-semibold">{currentRuleObj.mathFormula}</span>
          </div>
        </div>

        {/* Amount & Participant Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Total Pool Amount (tNIGHT)
            </label>
            <div className="relative">
              <input
                type="number"
                value={poolAmount}
                onChange={(e) => setPoolAmount(e.target.value)}
                placeholder="e.g. 10000"
                className="w-full px-4 py-3 rounded-xl bg-titanium-950/90 border border-slate-700/70 focus:border-emerald-400 focus:outline-none text-white font-mono text-sm placeholder:text-slate-600 placeholder:italic transition-colors"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-400">
                tNIGHT
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Total tokens allocated for this distribution</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Authorized Participants Count
            </label>
            <div className="relative">
              <input
                type="number"
                value={participantCount}
                onChange={(e) => setParticipantCount(e.target.value)}
                placeholder="e.g. 4"
                className="w-full px-4 py-3 rounded-xl bg-titanium-950/90 border border-slate-700/70 focus:border-emerald-400 focus:outline-none text-white font-mono text-sm placeholder:text-slate-600 placeholder:italic transition-colors"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                Members
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Number of expected participant proofs</p>
          </div>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-300 text-xs">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Submit / Proving Action */}
        <div>
          {!isConnected ? (
            <button
              type="button"
              onClick={onOpenConnectModal}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all"
            >
              Connect Wallet to Deploy Distribution
            </button>
          ) : (
            <button
              type="submit"
              disabled={isProving}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-60 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isProving ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>{provingStep || 'Processing on Midnight SDK...'}</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Initialize Distribution Pool on Preprod</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
