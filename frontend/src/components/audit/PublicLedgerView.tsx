import React, { useState } from 'react';
import { Terminal, Shield, ExternalLink, Activity, Clock, Copy, Check } from 'lucide-react';
import { formatTimestamp } from '../../utils/formatters';
import { MIDNIGHT_CONFIG } from '../../utils/constants';
import type { OnChainDistributionState, VerificationLog } from '../../hooks/useContractState';

interface PublicLedgerViewProps {
  contractState: OnChainDistributionState;
  logs: VerificationLog[];
  onFinalize: () => Promise<void>;
  isProving: boolean;
}

export const PublicLedgerView: React.FC<PublicLedgerViewProps> = ({
  contractState,
  logs,
  onFinalize,
  isProving,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyContract = () => {
    navigator.clipboard.writeText(contractState.contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusLabel = contractState.distributionStatus === 1
    ? 'Active'
    : contractState.distributionStatus === 2
    ? 'Finalized'
    : 'Inactive';

  // Construct JSON representation of on-chain ledger state
  const ledgerJson = {
    contractAddress: contractState.contractAddress,
    network: 'Midnight Preprod',
    ledgerState: {
      distributionStatus: `${contractState.distributionStatus} (${statusLabel})`,
      ruleType: contractState.ruleType === 1 ? '1 (Percentage Split)' : contractState.ruleType === 2 ? '2 (Equal Split)' : '3 (Capped)',
      totalPoolAmount: `${contractState.totalPoolAmount.toLocaleString()} tNIGHT`,
      participantCount: contractState.participantCount,
      verifiedAllocationsCount: contractState.verifiedAllocationsCount,
      lastVerifiedTimestamp: formatTimestamp(contractState.lastVerifiedTimestamp),
      lastVerifiedAllocationHash: contractState.lastVerifiedAllocationHash,
      verificationResult: contractState.verificationResult,
    },
    privacyAudit: {
      individualAmountsPublished: false,
      participantIdentitiesPublished: false,
      privateWitnessStoredOnChain: false,
    }
  };

  return (
    <div id="audit-section" className="p-6 sm:p-8 rounded-2xl bg-[#0b1222]/90 border border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">Step 3 — Public Audit</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                On-Chain Truth
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
              Midnight Preprod Contract & Ledger Audit
            </h2>
          </div>
        </div>

        {/* Finalize Pool Action (for Organizer) */}
        {contractState.distributionStatus === 1 && (
          <button
            onClick={onFinalize}
            disabled={isProving}
            className="text-xs px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Finalize Distribution Pool
          </button>
        )}
      </div>

      {/* Contract Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-6">
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[11px] text-slate-400 mb-1">Pool Status</div>
          <div className="text-base font-bold text-white flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              contractState.distributionStatus === 1 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
            }`} />
            <span>{statusLabel}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[11px] text-slate-400 mb-1">Verified Proofs</div>
          <div className="text-base font-bold font-mono text-cyan-300">
            {contractState.verifiedAllocationsCount} / {contractState.participantCount}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[11px] text-slate-400 mb-1">Total Pool Ceiling</div>
          <div className="text-base font-bold font-mono text-slate-100">
            {contractState.totalPoolAmount.toLocaleString()} tNIGHT
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[11px] text-slate-400 mb-1">Preprod Block Height</div>
          <div className="text-base font-bold font-mono text-emerald-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>#{contractState.blockHeight.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Contract Address & Explorer Bar */}
      <div className="mb-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400 font-medium">Deployed Contract Address:</span>
          <span className="font-mono text-cyan-200">{contractState.contractAddress}</span>
          <button
            onClick={handleCopyContract}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <a
          href={`${MIDNIGHT_CONFIG.explorerUrl}/contract/${contractState.contractAddress}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline underline-offset-2"
        >
          <span>View on Midnight Explorer</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Public Ledger JSON Terminal */}
      <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs">
          <span className="font-mono text-slate-400">public_ledger_state.json</span>
          <span className="text-[10px] text-emerald-400 font-semibold uppercase">Zero Sensitive PII Disclosed</span>
        </div>
        <pre className="p-4 text-xs font-mono text-cyan-300/90 overflow-x-auto leading-relaxed">
          {JSON.stringify(ledgerJson, null, 2)}
        </pre>
      </div>

      {/* Verification Transaction Log */}
      <div className="mt-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Verified ZK Proof Transaction Log</span>
        </h4>
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px]">
                  {log.status}
                </span>
                <span className="font-medium text-slate-200">{log.rule}</span>
                <span className="text-[11px] font-mono text-slate-500">
                  Nullifier: {log.nullifier.slice(0, 10)}...{log.nullifier.slice(-6)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span>Block #{log.blockNumber}</span>
                <span>Gas: {log.gasCostDust} DUST</span>
                <span>{formatTimestamp(log.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
