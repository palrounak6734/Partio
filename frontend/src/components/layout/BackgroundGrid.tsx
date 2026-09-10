import React from 'react';

export const BackgroundGrid: React.FC = () => {
  return (
    <>
      {/* Titanium Ambient Gradient Mesh (Zero Blue Grids) */}
      <div className="bg-titanium-ambient" />
      <div className="bg-vault-facets" />

      {/* Floating Auroral Glow Orbs */}
      <div 
        className="fixed top-[-5%] left-[20%] w-[500px] h-[500px] rounded-full pointer-events-none z-0 opacity-20 filter blur-[140px] animate-aurora-glow"
        style={{ background: 'radial-gradient(circle, #10b981 0%, #064e3b 70%)' }}
      />
      <div 
        className="fixed bottom-[15%] right-[12%] w-[450px] h-[450px] rounded-full pointer-events-none z-0 opacity-15 filter blur-[130px] animate-aurora-glow"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, #78350f 70%)' }}
      />
      <div 
        className="fixed top-[45%] right-[30%] w-[400px] h-[400px] rounded-full pointer-events-none z-0 opacity-10 filter blur-[120px]"
        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
      />
    </>
  );
};
