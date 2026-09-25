import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Shield, Coins, Users, Search } from 'lucide-react';
import type { ProjectData } from '../../hooks/useContractState';

interface ProjectsViewProps {
  projects: ProjectData[];
  onSelectProject: (id: string) => void;
  onCreateNewProject: (name: string, totalPool: number, participants: number, ruleType: 'percentage' | 'equal' | 'capped') => Promise<any>;
  isProving: boolean;
  isConnected: boolean;
  onOpenConnectModal: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onSelectProject,
  onCreateNewProject,
  isProving,
  isConnected,
  onOpenConnectModal,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'DISTRIBUTING' | 'COMPLETED'>('ALL');
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New project form state
  const [newTitle, setNewTitle] = useState('');
  const [newPool, setNewPool] = useState('25000');
  const [newParticipants, setNewParticipants] = useState('4');
  const [newRule, setNewRule] = useState<'percentage' | 'equal' | 'capped'>('percentage');

  const filteredProjects = projects.filter((p) => {
    const matchesFilter = filter === 'ALL' || p.status === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await onCreateNewProject(newTitle.trim(), Number(newPool), Number(newParticipants), newRule);
    setIsCreateModalOpen(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#152130]/90 backdrop-blur-xl border border-slate-700/60 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects or IDs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-[#101824] border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-400 w-48 sm:w-64"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#101824] p-1 rounded-xl border border-slate-700/70 text-xs">
            {(['ALL', 'ACTIVE', 'DISTRIBUTING', 'COMPLETED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  filter === tab
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (!isConnected) {
              onOpenConnectModal();
            } else {
              setIsCreateModalOpen(true);
            }
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_16px_rgba(16,185,129,0.25)]"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Partition Project</span>
        </motion.button>
      </div>

      {/* Projects Grid with Motion */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((p, idx) => {
          const progressPct = Math.round((p.verifiedCount / p.participants) * 100);
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              whileHover={{ y: -4, scale: 1.015 }}
              onClick={() => onSelectProject(p.id)}
              className="group p-5 rounded-2xl bg-[#162334]/90 backdrop-blur-xl border border-slate-700/60 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-[0_0_24px_rgba(16,185,129,0.15)] cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                    {p.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">{p.id}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${
                    p.status === 'COMPLETED'
                      ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                      : p.status === 'DISTRIBUTING'
                      ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                      : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="my-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#111925]/90 border border-slate-700/70">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                    <Coins className="w-3 h-3 text-emerald-400" />
                    <span>Total Pool</span>
                  </div>
                  <div className="font-bold font-mono text-white mt-1">
                    {p.totalPool.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">tNIGHT</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#111925]/90 border border-slate-700/70">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                    <Users className="w-3 h-3 text-cyan-400" />
                    <span>Contributors</span>
                  </div>
                  <div className="font-bold font-mono text-white mt-1">
                    {p.verifiedCount} / {p.participants} <span className="text-[10px] text-emerald-300">Verified</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>ZK Verification Progress</span>
                  <span className="font-mono text-emerald-300 font-semibold">{progressPct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-lg p-6 rounded-2xl bg-[#141f2e] border border-emerald-500/40 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span>Create New Partio Project</span>
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Initialize a confidential payment pool on Midnight with off-chain ZK rules.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project Title / Payroll Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Security Audit & Developer Splits"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Total Pool Amount (tNIGHT)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newPool}
                    onChange={(e) => setNewPool(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Number of Participants
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={newParticipants}
                    onChange={(e) => setNewParticipants(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Distribution Rule Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'percentage', label: 'Percentage' },
                    { id: 'equal', label: '1/N Equal' },
                    { id: 'capped', label: 'Capped Tier' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setNewRule(r.id as any)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                        newRule === r.id
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProving}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md disabled:opacity-50"
                >
                  {isProving ? 'Anchoring...' : 'Deploy Split On-Chain'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
