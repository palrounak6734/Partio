import React from 'react';
import { X, Shield, Wallet, Sparkles, ExternalLink, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import type { WalletProviderId } from '../../hooks/useMidnightWallet';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import { getMobileWalletDeepLinks } from '../../utils/deviceDetect';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (providerId: WalletProviderId) => Promise<boolean>;
  isConnecting: boolean;
  error: string | null;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
  onConnect,
  isConnecting,
  error,
}) => {
  const { isMobile, os } = useDeviceDetect();
  const mobileLinks = getMobileWalletDeepLinks();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md p-6 overflow-hidden rounded-2xl bg-titanium-900/95 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">Connect Wallet</h3>
              <p className="text-xs text-slate-400">Select your Midnight account provider</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Zero-Docker Guarantee Callout */}
        <div className="my-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-200/90 leading-relaxed">
            <span className="font-semibold text-emerald-300">⚡ Zero Docker Required for Clients:</span> Zero-knowledge proving executes client-side via in-browser WebAssembly & wallet cryptography.
          </p>
        </div>

        {/* Error notice if any */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <p>{error}</p>
          </div>
        )}

        {/* Provider List */}
        <div className="space-y-2.5">
          {/* 1AM Wallet */}
          <button
            disabled={isConnecting}
            onClick={() => onConnect('1am')}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-titanium-850/70 border border-slate-700/60 hover:border-emerald-400 hover:bg-slate-800/80 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-extrabold text-sm shadow-md">
                1AM
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors">
                  1AM Wallet
                </div>
                <div className="text-xs text-slate-400">Native Midnight Shielded Extension</div>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Recommended
            </span>
          </button>

          {/* Lace Midnight */}
          <button
            disabled={isConnecting}
            onClick={() => onConnect('lace')}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-titanium-850/70 border border-slate-700/60 hover:border-amber-400 hover:bg-slate-800/80 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-extrabold text-sm shadow-md">
                Lace
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-100 group-hover:text-amber-300 transition-colors">
                  Lace Midnight
                </div>
                <div className="text-xs text-slate-400">IOG Multi-Asset Ecosystem Wallet</div>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Preprod
            </span>
          </button>

          {/* Read-Only Explorer Mode */}
          <button
            disabled={isConnecting}
            onClick={() => onConnect('demo')}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-titanium-850/70 border border-slate-700/60 hover:border-teal-400 hover:bg-slate-800/80 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-100 group-hover:text-teal-300 transition-colors">
                  Read-Only Explorer Mode
                </div>
                <div className="text-xs text-slate-400">Query Preprod ledger & verify circuits without extension</div>
              </div>
            </div>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Mobile Device Guidance */}
        {isMobile && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-300">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mobile Device Detected ({os.toUpperCase()})</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
              If your mobile browser does not inject browser extensions, open the dApp inside your wallet's built-in web3 browser or get the app:
            </p>
            <button
              type="button"
              onClick={() => {
                const cip158Url = `web+cardano://browse/v1?uri=${encodeURIComponent(window.location.href)}`;
                window.location.href = cip158Url;
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-semibold text-emerald-300 border border-emerald-500/40 mb-2.5 transition-all shadow-sm"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Open in Mobile Wallet App (CIP-158)</span>
            </button>
            <div className="flex gap-2">
              <a
                href={mobileLinks.oneAim.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-emerald-300 border border-slate-700 transition-colors"
              >
                <span>Get 1AM App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={mobileLinks.lace.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-amber-300 border border-slate-700 transition-colors"
              >
                <span>Get Lace</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
