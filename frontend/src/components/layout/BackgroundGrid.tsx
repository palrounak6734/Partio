import React from 'react';

export const BackgroundGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Bespoke SplitShield Fluid Obsidian & Cryptographic Silk Artwork */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 transform scale-100"
        style={{ backgroundImage: "url('/splitshield_theme_bg.jpg')" }}
      />
      
      {/* Dark Ambient Vignette and Studio Gradient (Completely Smooth, Zero Grids) */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 95% 85% at 50% 15%, rgba(7, 9, 14, 0.45) 0%, rgba(7, 9, 14, 0.88) 70%, #07090e 100%)'
        }}
      />

      {/* Fluid Prismatic Aurora Ambient Glows */}
      <div 
        className="absolute top-[-10%] left-[20%] w-[650px] h-[650px] rounded-full opacity-15 filter blur-[150px] animate-aurora-glow"
        style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-[5%] right-[10%] w-[550px] h-[550px] rounded-full opacity-15 filter blur-[140px] animate-aurora-glow"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
      />
      <div 
        className="absolute top-[40%] right-[30%] w-[450px] h-[450px] rounded-full opacity-10 filter blur-[130px]"
        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
      />
    </div>
  );
};
