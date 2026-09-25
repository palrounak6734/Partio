import React, { useState, useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface SwipeToConfirmProps {
  onConfirm: () => void;
  label?: string;
  confirmedLabel?: string;
  disabled?: boolean;
}

export const SwipeToConfirm: React.FC<SwipeToConfirmProps> = ({
  onConfirm,
  label = 'Swipe to Confirm On-Chain',
  confirmedLabel = 'Confirmed',
  disabled = false,
}) => {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (disabled || isConfirmed || !containerRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const rect = containerRef.current.getBoundingClientRect();
    const maxDrag = rect.width - 50;
    const offset = Math.max(0, Math.min(clientX - rect.left, maxDrag));
    setSliderPosition(offset);

    if (offset >= maxDrag * 0.9) {
      setIsConfirmed(true);
      setSliderPosition(maxDrag);
      onConfirm();
    }
  };

  const handleEnd = () => {
    if (!isConfirmed) {
      setSliderPosition(0);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => e.buttons === 1 && handleTouchMove(e)}
      onMouseUp={handleEnd}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      className={`relative h-12 rounded-xl bg-slate-900 border border-slate-700/80 overflow-hidden select-none flex items-center justify-center ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {/* Background fill based on progress */}
      <div
        className="absolute left-0 top-0 bottom-0 bg-emerald-500/20 transition-all"
        style={{ width: `${sliderPosition + 40}px` }}
      />

      {/* Label */}
      <span className="text-xs font-semibold text-slate-300 pointer-events-none z-10 flex items-center gap-1.5">
        {isConfirmed ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300">{confirmedLabel}</span>
          </>
        ) : (
          label
        )}
      </span>

      {/* Draggable knob */}
      {!isConfirmed && (
        <div
          className="absolute left-1 top-1 bottom-1 w-10 rounded-lg bg-emerald-500 hover:bg-emerald-400 shadow-md flex items-center justify-center text-slate-950 transition-all z-20 cursor-grab active:cursor-grabbing"
          style={{ transform: `translateX(${sliderPosition}px)` }}
        >
          <ArrowRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
