import React from 'react';
import { ExternalLink } from 'lucide-react';
import { MIDNIGHT_CONFIG } from '../../utils/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-16 border-t border-slate-800/80 bg-[#070b14]/90 backdrop-blur-md py-8">
      <div className="app-container flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2.5">
          <img
            src="/splitshield_logo.jpg"
            alt="SplitShield"
            className="w-6 h-6 rounded-md object-cover border border-cyan-500/30"
          />
          <span className="font-bold text-slate-200">SplitShield</span>
          <span className="text-slate-600">|</span>
          <span>Privacy-Preserving Payment Splits on Midnight Network</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://docs.midnight.network"
            target="_blank"
            rel="noreferrer"
            className="hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <span>Midnight Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={MIDNIGHT_CONFIG.faucetUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <span>Preprod Faucet</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={MIDNIGHT_CONFIG.explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};
