import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, CheckCircle2, AlertCircle, ExternalLink, FileCheck2 } from 'lucide-react';
import type { ProjectData } from '../../hooks/useContractState';
import { NETWORK_CONFIGS, type NetworkId } from '../../utils/constants';
import { AllocationCertificateModal } from './AllocationCertificateModal';

interface PublicVerifyViewProps {
  projects: ProjectData[];
  network: NetworkId;
}

export const PublicVerifyView: React.FC<PublicVerifyViewProps> = ({ projects, network }) => {
  const activeConfig = NETWORK_CONFIGS[network];
  const [queryId, setQueryId] = useState('');
  const [searchedProject, setSearchedProject] = useState<ProjectData | null>(projects[0] || null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isCertOpen, setIsCertOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const found = projects.find(
      (p) =>
        p.id.toLowerCase() === queryId.trim().toLowerCase() ||
        p.name.toLowerCase().includes(queryId.trim().toLowerCase())
    );
    setSearchedProject(found || null);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="p-6 rounded-2xl bg-[#152130]/90 backdrop-blur-xl border border-slate-700/60 shadow-xl"
      >
        <div className="max-w-2xl mx-auto text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          >
            <ShieldCheck className="w-8 h-8" />
          </motion.div>
          <h2 className="text-xl font-bold text-slate-100">
            Partio Zero-Knowledge Partition Verifier
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Verify the mathematical integrity and partition compliance of any project payment on the Midnight blockchain.
            Zero cleartext salaries or private recipient amounts are ever exposed to the public or verifiers.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Enter Project ID (e.g. proj-001-shield-treasury) or Nullifier..."
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500 shadow-inner"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shrink-0"
          >
            Verify Proof
          </motion.button>
        </form>

        {/* Verification Result Card */}
        <AnimatePresence mode="wait">
          {searchedProject ? (
            <motion.div
              key={searchedProject.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 max-w-xl mx-auto p-5 rounded-2xl bg-[#1a293b]/80 border border-emerald-500/40 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">{searchedProject.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{searchedProject.id}</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                  {searchedProject.status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Total Pool Commitment:</span>
                  <span className="font-mono font-semibold text-emerald-400">
                    {searchedProject.poolCommitment.slice(0, 16)}...{searchedProject.poolCommitment.slice(-8)}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Verified Contributor Proofs:</span>
                  <span className="font-mono text-slate-200">
                    {searchedProject.verifiedCount} of {searchedProject.participants} confirmed
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Rule Enforcement Type:</span>
                  <span className="capitalize text-slate-200">{searchedProject.ruleType} Partition</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-400">On-Chain Target Network:</span>
                  <span className="text-emerald-300 font-semibold">{activeConfig.name}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={() => setIsCertOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/15"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>View Allocation Certificate</span>
                </motion.button>

                <motion.a
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  href={`${activeConfig.explorerUrl}/contract/${activeConfig.contractAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors shadow-sm"
                >
                  <span>Audit On Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </motion.a>
              </div>
            </motion.div>
          ) : hasSearched ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 max-w-xl mx-auto p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-xs"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <div>
                <div className="font-semibold">Project Not Found</div>
                <div>No project matched "{queryId}". Please verify the project identifier and try again.</div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

      {searchedProject && (
        <AllocationCertificateModal
          isOpen={isCertOpen}
          onClose={() => setIsCertOpen(false)}
          project={searchedProject}
          network={network}
        />
      )}
    </div>
  );
};
