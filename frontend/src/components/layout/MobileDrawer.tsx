import React from 'react';
import { X, Smartphone, Layers, Sliders, UserCheck, ShieldCheck, Vault, Search, Home } from 'lucide-react';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import type { NavTabId } from './Navbar';
import type { NetworkId } from '../../utils/constants';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConnectModal: () => void;
  isConnected: boolean;
  address: string | null;
  currentTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  network: NetworkId;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onOpenConnectModal,
  isConnected,
  address,
  currentTab,
  onSelectTab,
  network,
}) => {
  const { os, isCoarsePointer } = useDeviceDetect();

  if (!isOpen) return null;

  const navItems: { id: NavTabId; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'splits', label: 'Splits', icon: Sliders },
    { id: 'contributors', label: 'Contributors', icon: UserCheck },
    { id: 'proofs', label: 'Proofs', icon: ShieldCheck },
    { id: 'treasury', label: 'Treasury', icon: Vault },
    { id: 'verify', label: 'Verify', icon: Search },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden bg-black/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#131e2b] border-l border-slate-700/70 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <img
                src="/splitshield_logo.jpg"
                alt="Partio"
                className="w-8 h-8 rounded-lg object-cover border border-emerald-400/40 shadow-sm"
              />
              <span className="font-extrabold text-xl text-white">Partio</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/80 border border-slate-700/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Connection Status */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Target Network</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {network.toUpperCase()}
              </span>
            </div>
            {!isConnected ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenConnectModal();
                }}
                className="w-full mt-2 py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs text-center shadow-md shadow-emerald-500/20"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="text-xs font-mono text-emerald-300 break-all bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                {address}
              </div>
            )}
          </div>

          {/* Device & Hardware Info */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold mb-1">
              <Smartphone className="w-4 h-4" />
              <span>Device & Viewport Mode</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Touch Interface:</span>
              <span className="text-slate-200">{isCoarsePointer ? 'Active (Coarse)' : 'Fine Pointer'}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Operating System:</span>
              <span className="text-slate-200 uppercase">{os}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            SplitShield • Confidential Operations
          </p>
        </div>
      </div>
    </div>
  );
};
