import React from 'react';
import { X, Shield, Smartphone, ExternalLink } from 'lucide-react';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import { getMobileWalletDeepLinks } from '../../utils/deviceDetect';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConnectModal: () => void;
  isConnected: boolean;
  address: string | null;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onOpenConnectModal,
  isConnected,
  address,
}) => {
  const { os, isCoarsePointer } = useDeviceDetect();
  const mobileLinks = getMobileWalletDeepLinks();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#0b1222] border-l border-cyan-500/20 p-6 flex flex-col justify-between overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <img
                src="/splitshield_logo.jpg"
                alt="SplitShield"
                className="w-8 h-8 rounded-lg object-cover border border-cyan-400/40"
              />
              <span className="font-bold text-lg text-white">SplitShield</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Connection Status */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Network</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Preprod
              </span>
            </div>
            {!isConnected ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenConnectModal();
                }}
                className="w-full mt-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs text-center shadow-md shadow-cyan-500/20"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="text-xs font-mono text-cyan-300 break-all bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                {address}
              </div>
            )}
          </div>

          {/* Device & Hardware Info */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-1">
              <Smartphone className="w-4 h-4" />
              <span>Hardware & Viewport Mode</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Touch Interface:</span>
              <span className="text-slate-200">{isCoarsePointer ? 'Active (Coarse)' : 'Fine Pointer'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Operating System:</span>
              <span className="text-slate-200 uppercase">{os}</span>
            </div>
          </div>

          {/* Mobile Wallets */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>Mobile Wallet Apps</span>
            </div>
            <a
              href={mobileLinks.oneAim.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200"
            >
              <span>1AM Wallet App</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>
            <a
              href={mobileLinks.lace.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200"
            >
              <span>Lace Wallet App</span>
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            SplitShield • Midnight Preprod
          </p>
        </div>
      </div>
    </div>
  );
};
