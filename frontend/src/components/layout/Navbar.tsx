import React from 'react';
import { Wallet, LogOut, Copy, Check, Menu, ExternalLink } from 'lucide-react';
import { truncateAddress } from '../../utils/formatters';
import { MIDNIGHT_CONFIG } from '../../utils/constants';

interface NavbarProps {
  isConnected: boolean;
  address: string | null;
  onOpenConnectModal: () => void;
  onDisconnect: () => void;
  onToggleMobileDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isConnected,
  address,
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

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#070b14]/80 border-b border-cyan-500/15">
      <div className="app-container flex items-center justify-between h-20">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-30 group-hover:opacity-60 blur-sm transition-all duration-300" />
            <img
              src="/splitshield_logo.jpg"
              alt="SplitShield Logo"
              className="relative w-10 h-10 rounded-xl object-cover border border-cyan-400/40 shadow-lg shadow-cyan-500/20"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                SplitShield
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                ZK-Splits
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">Private Rule-Based Payment Allocations</p>
          </div>
        </div>

        {/* Center: Clean Network Indicator (No noisy block height) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-slate-200">Midnight Preprod</span>
          <a
            href={MIDNIGHT_CONFIG.faucetUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-1 text-[10px] text-cyan-400 hover:text-cyan-300 underline flex items-center gap-0.5"
          >
            <span>Faucet</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        {/* Right Actions: Wallet + Mobile Menu */}
        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-cyan-200 hidden sm:inline">
                  {truncateAddress(address, 10, 6)}
                </span>
                <span className="font-mono text-cyan-200 sm:hidden">
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Disconnect</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenConnectModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all transform active:scale-95"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          )}

          {/* Mobile Drawer Toggle */}
          <button
            onClick={onToggleMobileDrawer}
            className="md:hidden p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
