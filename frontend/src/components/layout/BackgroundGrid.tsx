import React from 'react';

export const BackgroundGrid: React.FC = () => {
  return (
    <>
      {/* Background Cyber Grid */}
      <div className="bg-cyber-grid" />
      <div className="bg-cyber-dots" />

      {/* Ambient Glowing Orbs */}
      <div 
        className="fixed top-[-10%] left-[15%] w-[450px] h-[450px] rounded-full pointer-events-none z-0 opacity-20 filter blur-[120px]"
        style={{ background: 'radial-gradient(circle, #38bdf8 0%, #1e1b4b 70%)' }}
      />
      <div 
        className="fixed bottom-[10%] right-[10%] w-[550px] h-[550px] rounded-full pointer-events-none z-0 opacity-15 filter blur-[140px]"
        style={{ background: 'radial-gradient(circle, #818cf8 0%, #0c0a1e 70%)' }}
      />
      <div 
        className="fixed top-[45%] right-[25%] w-[350px] h-[350px] rounded-full pointer-events-none z-0 opacity-10 filter blur-[100px]"
        style={{ background: 'radial-gradient(circle, #2dd4bf 0%, transparent 70%)' }}
      />
    </>
  );
};
