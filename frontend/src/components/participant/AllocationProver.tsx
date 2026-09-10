import React, { useState } from 'react';
import { EyeOff, Key, Cpu, AlertTriangle, CheckCircle, RefreshCw, Lock } from 'lucide-react';
import { DISTRIBUTION_RULES } from '../../utils/constants';

interface AllocationProverProps {
  currentRuleType: number;
  totalPoolAmount: number;
  participantCount: number;
  onVerifyProof: (
    allocation: number,
    ruleType: number,
    ruleParam?: number
  ) => Promise<{ success: boolean; message: string; nullifier: string }>;
  isProving: boolean;
  provingStep: string;
}

export const AllocationProver: React.FC<AllocationProverProps> = ({
  currentRuleType,
  totalPoolAmount,
  participantCount,
  onVerifyProof,
  isProving,
  provingStep,
}) => {
  const [allocationAmount, setAllocationAmount] = useState<string>('');
  const [percentageParam, setPercentageParam] = useState<string>('');
  const [secretPassphrase, setSecretPassphrase] = useState<string>('');
  const [proofResult, setProofResult] = useState<{
    success: boolean;
    message: string;
    nullifier: string;
  } | null>(null);

  // Quick fill helper chips for easy testing without pre-populating defaults
  const handleFillValid = () => {
    if (currentRuleType === 1) {
      // 25% of pool
      const validShare = (totalPoolAmount * 25) / 100;
      setAllocationAmount(String(validShare));
      setPercentageParam('25');
    } else if (currentRuleType === 2) {
      // Equal split
      const equalShare = totalPoolAmount / participantCount;
      setAllocationAmount(String(equalShare));
    } else {
      setAllocationAmount('5000');
    }
    setSecretPassphrase('zk_contributor_salt_7792');
    setProofResult(null);
  };

  const handleFillInvalid = () => {
    // Purposefully violates constraints to test circuit assertion rejection!
    setAllocationAmount(String(totalPoolAmount + 5000));
    setPercentageParam('25');
    setSecretPassphrase('zk_invalid_contributor');
    setProofResult(null);
  };

  const handleClear = () => {
    setAllocationAmount('');
    setPercentageParam('');
    setSecretPassphrase('');
    setProofResult(null);
  };

  const handleGenerateSecret = () => {
    const rand = Array.from(crypto.getRandomValues(new Uint8Array(12)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    setSecretPassphrase(`salt_${rand}`);
  };

  const handleProve = async (e: React.FormEvent) => {
    e.preventDefault();
    setProofResult(null);

    const alloc = Number(allocationAmount);
    const param = percentageParam ? Number(percentageParam) : undefined;

    if (!alloc || alloc <= 0) {
      setProofResult({
        success: false,
        message: 'Please enter a valid allocation payout amount greater than 0.',
        nullifier: '',
      });
      return;
    }

    const res = await onVerifyProof(alloc, currentRuleType, param);
    setProofResult(res);
  };

  const activeRule = DISTRIBUTION_RULES.find((r) => r.id === currentRuleType) || DISTRIBUTION_RULES[0];

  return (
    <div id="participant-section" className="p-6 sm:p-8 rounded-2xl bg-[#0b1222]/90 border border-indigo-500/25 shadow-2xl shadow-indigo-500/5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <EyeOff className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">Step 2 — Participant Prover</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                100% Private Witness
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
              Prove Allocation Correctness in Zero-Knowledge
            </h2>
          </div>
        </div>

        {/* Quick Helper Chips */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFillValid}
            className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
          >
            ✓ Fill Valid Share
          </button>
          <button
            type="button"
            onClick={handleFillInvalid}
            className="text-xs px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
          >
            ✗ Test Circuit Rejection
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 flex items-start gap-3">
        <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-indigo-300">Private Witness Guarantee:</span> Your payout amount and secret salt are passed to the Compact circuit inside your browser's RAM. They are <span className="underline decoration-indigo-400">never transmitted over the network</span> and will never be revealed on-chain.
        </div>
      </div>

      <form onSubmit={handleProve} className="mt-6 space-y-6">
        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Private Allocation Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Your Private Payout Amount (Secret Witness)</span>
              <span className="text-[11px] font-normal text-rose-400">Never Disclosed</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={allocationAmount}
                onChange={(e) => setAllocationAmount(e.target.value)}
                placeholder="e.g. 2500"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-700/70 focus:border-indigo-400 focus:outline-none text-white font-mono text-sm placeholder:text-slate-600 placeholder:italic transition-colors"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                tNIGHT
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Your confidential compensation allocation</p>
          </div>

          {/* Rule Parameter Input if Percentage Split */}
          {currentRuleType === 1 ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Agreed Percentage Share (%)</span>
                <span className="text-[11px] font-normal text-cyan-400">Public Rule</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={percentageParam}
                  onChange={(e) => setPercentageParam(e.target.value)}
                  placeholder="e.g. 25"
                  min="1"
                  max="100"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-700/70 focus:border-indigo-400 focus:outline-none text-white font-mono text-sm placeholder:text-slate-600 placeholder:italic transition-colors"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  %
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Expected share of total pool ({totalPoolAmount.toLocaleString()} tNIGHT)</p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Active Rule Constraint
              </label>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-indigo-300 flex items-center justify-between h-[46px]">
                <span>{activeRule.name}</span>
                <span className="text-slate-500">{activeRule.badge}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Divided equally among {participantCount} contributors</p>
            </div>
          )}

          {/* Participant Secret Salt */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Participant Secret Salt (Nullifier Seed)</span>
              <button
                type="button"
                onClick={handleGenerateSecret}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Generate Random Salt</span>
              </button>
            </label>
            <div className="relative">
              <input
                type="text"
                value={secretPassphrase}
                onChange={(e) => setSecretPassphrase(e.target.value)}
                placeholder="e.g. contributor_secret_salt_hash"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-700/70 focus:border-indigo-400 focus:outline-none text-white font-mono text-sm placeholder:text-slate-600 placeholder:italic transition-colors"
              />
              <Key className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Derives a one-time cryptographic nullifier to prevent double-claiming without revealing your key</p>
          </div>
        </div>

        {/* Proof Result Feedback */}
        {proofResult && (
          <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
            proofResult.success
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {proofResult.success ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Zero-Knowledge Proof Verified On-Chain!</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Circuit Verification Failed</span>
                </>
              )}
            </div>
            <p className="text-xs">{proofResult.message}</p>
            {proofResult.nullifier && (
              <div className="mt-1 pt-2 border-t border-emerald-500/20 text-[11px] font-mono flex items-center justify-between">
                <span className="text-emerald-400/80">Committed Nullifier Hash:</span>
                <span className="text-emerald-300">{proofResult.nullifier.slice(0, 18)}...{proofResult.nullifier.slice(-10)}</span>
              </div>
            )}
          </div>
        )}

        {/* Submit Proof Button */}
        <button
          type="submit"
          disabled={isProving}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-60 text-white font-semibold text-sm shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
        >
          {isProving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{provingStep || 'Synthesizing ZK-SNARK Proof...'}</span>
            </>
          ) : (
            <>
              <Cpu className="w-4 h-4" />
              <span>Generate ZK Proof & Disclose Compliance</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
