import React from 'react';
import { ExternalLink } from 'lucide-react';
import { MIDNIGHT_CONFIG } from '../../utils/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-16 border-t border-slate-700/60 bg-[#121c29]/95 backdrop-blur-xl py-8">
      <div className="app-container flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <img
            src="/splitshield_logo.jpg"
            alt="Partio"
            className="w-6 h-6 rounded-md object-cover border border-emerald-400/40 shadow-sm"
          />
          <span className="font-extrabold text-white text-sm">Partio</span>
          <span className="text-slate-500">|</span>
          <span className="font-medium text-slate-300">Privacy-Preserving Contributor Partitioning on Midnight Network</span>
        </div>

        <div className="flex items-center gap-4 font-medium">
          <a
            href="https://docs.midnight.network"
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-300 transition-colors flex items-center gap-1"
          >
            <span>Midnight Docs</span>
            <ExternalLink className="w-3 h-3 text-emerald-400" />
          </a>
          <a
            href={MIDNIGHT_CONFIG.faucetUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-300 transition-colors flex items-center gap-1"
          >
            <span>Preprod Faucet</span>
            <ExternalLink className="w-3 h-3 text-emerald-400" />
          </a>
          <a
            href={MIDNIGHT_CONFIG.explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-300 transition-colors flex items-center gap-1"
          >
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3 text-emerald-400" />
          </a>
        </div>
      </div>
    </footer>
  );
};

