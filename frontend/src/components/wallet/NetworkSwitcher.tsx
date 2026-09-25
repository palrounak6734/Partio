import React, { useState, useRef, useEffect } from 'react';
import { NetworkId, NETWORK_CONFIGS } from '../../utils/constants';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface NetworkSwitcherProps {
  currentNetwork: NetworkId;
  onSwitchNetwork: (network: NetworkId) => void;
  disabled?: boolean;
}

export const NetworkSwitcher: React.FC<NetworkSwitcherProps> = ({
  currentNetwork,
  onSwitchNetwork,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const networks: NetworkId[] = ['preprod', 'preview'];
  const activeConfig = NETWORK_CONFIGS[currentNetwork];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
          currentNetwork === 'preprod'
            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
            : 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              currentNetwork === 'preprod' ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              currentNetwork === 'preprod' ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
        </span>
        <Globe className="w-3.5 h-3.5 opacity-80" />
        <span>{activeConfig.name}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0D1518]/95 backdrop-blur-xl border border-slate-700/60 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            Select Midnight Network
          </div>
          <div className="mt-1 space-y-1">
            {networks.map((net) => {
              const cfg = NETWORK_CONFIGS[net];
              const isSelected = net === currentNetwork;
              return (
                <button
                  key={net}
                  onClick={() => {
                    onSwitchNetwork(net);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                    isSelected
                      ? net === 'preprod'
                        ? 'bg-emerald-500/20 text-emerald-200 font-semibold'
                        : 'bg-amber-500/20 text-amber-200 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        net === 'preprod' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                    <div>
                      <div>{cfg.name}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                        {net === 'preprod' ? 'Standard Scaling' : 'Rapid Testing'}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
