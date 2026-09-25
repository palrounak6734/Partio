import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base Lightened Slate-Titanium Backdrop (Zero Grid Lines) */}
      <div 
        className="absolute inset-0 bg-[#0f1724]"
      />

      {/* Partio Luminous Ambient Fluid Artwork Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-screen transform scale-105"
        style={{ backgroundImage: "url('/splitshield_theme_bg.jpg')" }}
      />
      
      {/* Refined Lighter Studio Radial Lighting */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 100% 85% at 50% 8%, rgba(30, 48, 71, 0.55) 0%, rgba(18, 27, 39, 0.85) 60%, #0f1724 100%)'
        }}
      />

      {/* Smooth Ambient Floating Aurora Spheres */}
      <motion.div 
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 25, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-5%] left-[15%] w-[700px] h-[700px] rounded-full opacity-25 filter blur-[140px]"
        style={{ background: 'radial-gradient(circle, #10b981 0%, rgba(16, 185, 129, 0.1) 50%, transparent 70%)' }}
      />

      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-[0%] right-[10%] w-[650px] h-[650px] rounded-full opacity-20 filter blur-[150px]"
        style={{ background: 'radial-gradient(circle, #0284c7 0%, rgba(14, 165, 233, 0.15) 50%, transparent 70%)' }}
      />

      <motion.div 
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
        className="absolute top-[35%] right-[25%] w-[500px] h-[500px] rounded-full opacity-15 filter blur-[130px]"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, rgba(99, 102, 241, 0.1) 50%, transparent 70%)' }}
      />
    </div>
  );
};

