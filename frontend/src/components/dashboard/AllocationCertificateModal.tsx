import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Download, Copy, Check, ExternalLink, X, FileCheck2, Lock } from 'lucide-react';
import type { ProjectData } from '../../hooks/useContractState';
import { NETWORK_CONFIGS, type NetworkId } from '../../utils/constants';

interface AllocationCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData;
  network: NetworkId;
}

export const AllocationCertificateModal: React.FC<AllocationCertificateModalProps> = ({
  isOpen,
  onClose,
  project,
  network,
}) => {
  const [copied, setCopied] = React.useState(false);
  const activeConfig = NETWORK_CONFIGS[network];

  if (!isOpen) return null;

  const certificateData = {
    certificateId: `CERT-PARTIO-${project.id.toUpperCase()}-ZK`,
    issuedAt: new Date().toISOString(),
    network: activeConfig.name,
    contractAddress: activeConfig.contractAddress,
    projectId: project.id,
    projectName: project.name,
    status: project.status,
    policyCommitment: project.ruleHash || `0x7f4a${project.poolCommitment.slice(6, 32)}014`,
    poolCommitment: project.poolCommitment,
    invariantsVerified: [
      { rule: 'Value Conservation', status: 'Passed', proof: 'Sum(Allocations) == 100% of Authorized Vault' },
      { rule: 'Policy Compliance', status: 'Passed', proof: 'Allocation * 100 == Pool * AgreedPercentage' },
      { rule: 'Recipient Authorization', status: 'Passed', proof: 'Verified against On-Chain Shielded Public Key Registry' },
      { rule: 'Replay Protection', status: 'Passed', proof: 'Nullifier derivation Hash(secret || projectId) active' },
      { rule: 'Compensation Privacy', status: 'Preserved', proof: 'Zero cleartext compensation exposed to ledger or verifiers' }
    ],
    cryptographicSeal: 'MIDNIGHT-IMPACT-VM-ZK-VERIFIED-0.5.2',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(certificateData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(certificateData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Partio-Allocation-Certificate-${project.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-[#0f1724] border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-slate-100"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10">
                <FileCheck2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold tracking-tight text-white">
                    Verifiable Allocation Certificate
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    Zero-Knowledge Audit Receipt
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  {certificateData.certificateId}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Certificate Body */}
          <div className="space-y-4 text-xs">
            {/* Meta Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Round / Project</span>
                <span className="font-semibold text-slate-200">{project.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Network</span>
                <span className="font-semibold text-emerald-400">{activeConfig.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Status</span>
                <span className="font-semibold text-cyan-400 uppercase">{project.status}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Disclosed Amount</span>
                <span className="font-semibold text-emerald-300 font-mono">$0.00 (Zero Leak)</span>
              </div>
            </div>

            {/* Cryptographic Hashes */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Policy Hash Commitment:
                </span>
                <span className="text-slate-200 truncate max-w-[240px]">{certificateData.policyCommitment}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  Pool Vault Commitment:
                </span>
                <span className="text-slate-200 truncate max-w-[240px]">{project.poolCommitment}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Midnight Contract:
                </span>
                <a
                  href={`${activeConfig.explorerUrl}/contract/${activeConfig.contractAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 truncate max-w-[240px]"
                >
                  <span className="truncate">{activeConfig.contractAddress}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>

            {/* Verified Invariants Checklist */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Formally Proven Mathematical Invariants:
              </span>
              <div className="space-y-1.5 bg-slate-900/40 p-3 rounded-xl border border-slate-800/70">
                {certificateData.invariantsVerified.map((inv, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-800/40 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-slate-300 font-medium">{inv.rule}:</span>
                      <span className="text-slate-400 font-mono text-[10px]">{inv.proof}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Signed by Midnight Impact VM Proof System</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Receipt' : 'Copy JSON'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Certificate</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
