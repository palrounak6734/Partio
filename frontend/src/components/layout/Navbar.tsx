import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, LogOut, Copy, Check, Menu, Coins } from 'lucide-react';
import { truncateAddress } from '../../utils/formatters';
import { NetworkSwitcher } from '../wallet/NetworkSwitcher';
import type { NetworkId } from '../../utils/constants';
import type { WalletBalance } from '../../hooks/useMidnightWallet';

export type NavTabId = 'overview' | 'projects' | 'splits' | 'contributors' | 'proofs' | 'treasury' | 'verify';

interface NavbarProps {
  currentTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  currentNetwork: NetworkId;
  onSwitchNetwork: (network: NetworkId) => void;
  isConnected: boolean;
  address: string | null;
  balance?: WalletBalance;
  onOpenConnectModal: () => void;
  onDisconnect: () => void;
  onToggleMobileDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentNetwork,
  onSwitchNetwork,
  isConnected,
  address,
  balance,
  onOpenConnectModal,
  onDisconnect,
  onToggleMobileDrawer,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navTabs: { id: NavTabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'splits', label: 'Splits' },
    { id: 'contributors', label: 'Contributors' },
    { id: 'proofs', label: 'Proofs' },
    { id: 'treasury', label: 'Treasury' },
    { id: 'verify', label: 'Verify' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#121c29]/90 border-b border-slate-700/60 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Brand & Logo */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => onSelectTab('overview')}
        >
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 opacity-40 group-hover:opacity-75 blur-md transition-all duration-300" />
            <img
              src="/partio_logo.svg"
              alt="Partio Logo"
              className="relative w-10 h-10 rounded-xl object-contain p-1 border border-emerald-400/40 bg-[#0a0f18]/80 shadow-lg shadow-emerald-500/20"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                Partio
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shadow-sm shadow-emerald-500/10">
                ZK-PARTITIONS
              </span>
            </div>
            <p className="text-[11px] text-slate-300 hidden xl:block font-medium">Confidential Contributor Partitioning on Midnight</p>
          </div>
        </motion.div>

        {/* Center: Desktop Navigation Tabs with Smooth Animated Pill */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-[#182332]/90 border border-slate-700/60 rounded-xl shadow-inner">
          {navTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'text-emerald-200'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/25 to-teal-500/20 border border-emerald-400/40 rounded-lg shadow-sm"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Network Switcher + Wallet */}
        <div className="flex items-center gap-2.5">
          {/* Dynamic Network Switcher */}
          <NetworkSwitcher
            currentNetwork={currentNetwork}
            onSwitchNetwork={onSwitchNetwork}
          />

          {isConnected ? (
            <div className="flex items-center gap-2">
              {/* Wallet Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs">
                {balance && (
                  <div className="hidden sm:flex items-center gap-1.5 border-r border-slate-800 pr-2 mr-1 text-slate-300 font-mono text-[11px]">
                    <Coins className="w-3 h-3 text-emerald-400" />
                    <span>{balance.tNight} tNIGHT</span>
                  </div>
                )}
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-emerald-200 text-xs">
                  {truncateAddress(address, 6, 4)}
                </span>
                <button
                  onClick={handleCopy}
                  title="Copy wallet address"
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                onClick={onDisconnect}
                title="Disconnect wallet"
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenConnectModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Connect Wallet</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={onToggleMobileDrawer}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
