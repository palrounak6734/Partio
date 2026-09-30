import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Plus, CheckCircle2, Clock, ShieldCheck, Wallet, Lock, Check } from 'lucide-react';
import type { ProjectData } from '../../hooks/useContractState';

interface ContributorsViewProps {
  projects?: ProjectData[];
  project: ProjectData;
  onSelectProject?: (projectId: string) => void;
  onRegisterContributor?: (projectId: string, role: string, address: string) => Promise<any>;
  isProving?: boolean;
}

export const ContributorsView: React.FC<ContributorsViewProps> = ({
  projects = [],
  project,
  onSelectProject,
  onRegisterContributor,
  isProving = false,
}) => {
  const [contributors, setContributors] = useState([
    {
      id: 'c-01',
      role: 'Lead Cryptographer',
      walletAddress: 'mn_addr_preprod1jvc2qagxjdprk4rt7rgxxt4pqq474w8rq5evf6lh8vmlqpnxu79q8j969a',
      pubKeyHash: '0x1a8f902b7c4d5e6f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f',
      registered: true,
      verified: true,
      claimed: false,
    },
    {
      id: 'c-02',
      role: 'ZK Circuits Engineer',
      walletAddress: 'mn_addr_preprod149jd722hjqnp47aj2ydmvdeqqn4aqj8xfkhremnp6s8ssuljaszqezda60',
      pubKeyHash: '0x2c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e',
      registered: true,
      verified: true,
      claimed: false,
    },
    {
      id: 'c-03',
      role: 'Protocol Auditor',
      walletAddress: 'mn_addr_preprod1qqq68g9r6vx9990wxxu8j0wzg5e0a02qgkh36v0y4v2sz5eqs9v0v4g',
      pubKeyHash: '0x5d9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
      registered: true,
      verified: project.verifiedCount >= 3,
      claimed: false,
    },
    {
      id: 'c-04',
      role: 'Front-End Architect',
      walletAddress: 'mn_addr_preprod1zxc987vbnmasdfghjklqwertyuiop1234567890zxcvbnm0987654321',
      pubKeyHash: '0x7e3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a',
      registered: true,
      verified: project.verifiedCount >= 4,
      claimed: false,
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [newAddr, setNewAddr] = useState('');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.trim()) return;

    const roleName = newRole.trim() || 'Contributor';
    const addr = newAddr.trim();

    if (onRegisterContributor) {
      try {
        await onRegisterContributor(project.id, roleName, addr);
        setSuccessBanner(`Contributor "${roleName}" authorized on Midnight circuit registry! Transaction recorded in Proofs timeline.`);
        setTimeout(() => setSuccessBanner(null), 6000);
      } catch {
        // Handled
      }
    }

    const newEntry = {
      id: `c-0${contributors.length + 1}`,
      role: roleName,
      walletAddress: addr,
      pubKeyHash: `0x${Array.from(crypto.getRandomValues(new Uint8Array(32))).map((b) => b.toString(16).padStart(2, '0')).join('')}`,
      registered: true,
      verified: false,
      claimed: false,
    };
    setContributors([...contributors, newEntry]);
    setIsAddModalOpen(false);
    setNewRole('');
    setNewAddr('');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="p-6 rounded-2xl bg-[#152130] border border-slate-700/60 shadow-xl space-y-6"
      >
        {/* Top: Active Project Selector Banner */}
        <div className="p-4 rounded-xl bg-[#0e1724] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Target Project Registry</div>
              <h3 className="text-base font-bold text-white">{project.name}</h3>
              <span className="text-[11px] font-mono text-slate-400">{project.id}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {projects.length > 1 && onSelectProject && (
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 font-medium">Switch Project:</label>
                <select
                  value={project.id}
                  onChange={(e) => onSelectProject(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-emerald-300 font-semibold focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.totalPool.toLocaleString()} tNIGHT)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
              {contributors.length} Registered Keys
            </div>
          </div>
        </div>

        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/60 gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Partio Contributor Key Registry (Circuit 3: addContributor)</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Authorized participant addresses. Public keys are registered in the Midnight smart contract for confidential partition proving.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs border border-emerald-500/40 transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register Contributor</span>
          </motion.button>
        </div>

        {/* Success Banner */}
        {successBanner && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-200"
          >
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successBanner}</span>
          </motion.div>
        )}

        {/* Table of Contributors */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-700/60 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Contributor / Role</th>
                <th className="pb-3 font-semibold">Wallet Address</th>
                <th className="pb-3 font-semibold">Public Key Hash</th>
                <th className="pb-3 font-semibold">ZK Proof Status</th>
                <th className="pb-3 font-semibold text-right">Claim Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {contributors.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5">
                    <div className="font-semibold text-slate-200">{c.role}</div>
                    <div className="text-[10px] text-slate-500">{c.id}</div>
                  </td>
                  <td className="py-3.5 font-mono text-slate-300 text-[11px]">
                    {c.walletAddress.slice(0, 16)}...{c.walletAddress.slice(-8)}
                  </td>
                  <td className="py-3.5 font-mono text-slate-500 text-[11px]">
                    {c.pubKeyHash.slice(0, 10)}...{c.pubKeyHash.slice(-6)}
                  </td>
                  <td className="py-3.5">
                    {c.verified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold">
                        <Clock className="w-3 h-3" />
                        Pending Proof
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right">
                    {project.status === 'COMPLETED' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-semibold text-[10px] border border-emerald-500/40">
                        <ShieldCheck className="w-3 h-3" />
                        Claimable
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500 text-[11px]">
                        <Lock className="w-3 h-3" />
                        Awaiting Finalize
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Contributor Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md p-6 rounded-2xl bg-[#152130] border border-emerald-500/40 shadow-2xl"
            >
              <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <span>Register Contributor on Midnight (Circuit 3)</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Authorize a contributor address in the Partio contract for project: <strong className="text-emerald-300">{project.name}</strong>.
              </p>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contributor Role / Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Cryptographer"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Midnight Bech32 Wallet Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="mn_addr_preprod1..."
                    value={newAddr}
                    onChange={(e) => setNewAddr(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProving}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md disabled:opacity-50"
                  >
                    {isProving ? 'Registering on Chain...' : 'Register Contributor'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
