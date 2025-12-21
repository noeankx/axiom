import React from 'react';
import { motion } from 'framer-motion';

export default function RetroOverlay({ active }) {
  if (!active) return null;

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
        style={{ mixBlendMode: 'overlay' }}
    >
        {/* CRT Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
        
        {/* Flicker */}
        <div className="absolute inset-0 bg-white/5 animate-pulse opacity-10" />

        {/* CSS Filter Injection */}
        <style>{`
            #root {
                filter: sepia(0.3) hue-rotate(180deg) contrast(1.2) saturate(1.2);
                text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
            }
        `}</style>
    </motion.div>
  );
}
