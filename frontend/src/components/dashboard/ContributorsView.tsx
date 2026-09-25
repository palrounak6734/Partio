import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Plus, CheckCircle2, Clock, ShieldCheck, Wallet, Lock } from 'lucide-react';
import type { ProjectData } from '../../hooks/useContractState';

interface ContributorsViewProps {
  project: ProjectData;
  isProving: boolean;
}

export const ContributorsView: React.FC<ContributorsViewProps> = ({ project }) => {
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

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.trim()) return;
    const newEntry = {
      id: `c-0${contributors.length + 1}`,
      role: newRole.trim() || 'Contributor',
      walletAddress: newAddr.trim(),
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
        className="p-6 rounded-2xl bg-[#152130]/90 backdrop-blur-xl border border-slate-700/60 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-700/60 gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span>Partio Contributor Registry</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Registered participants for <span className="text-slate-200 font-semibold">{project.name}</span>. Public keys are authorized on Midnight ZK circuits for private partition verification.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs border border-emerald-500/40 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Register Contributor</span>
          </motion.button>
        </div>

        {/* Table of Contributors */}
        <div className="mt-6 overflow-x-auto">
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
                <span>Register New Contributor</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Authorize a contributor address in Partio project registry to verify confidential allocations.
              </p>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contributor Role / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Researcher"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Midnight Wallet Address (mn_addr_...)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="mn_addr_preprod1..."
                    value={newAddr}
                    onChange={(e) => setNewAddr(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
                  >
                    Register On-Chain
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
