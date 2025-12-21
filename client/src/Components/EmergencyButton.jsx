import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Lock } from 'lucide-react';

export default function EmergencyButton() {
  const [active, setActive] = useState(false);

  // Play siren sound mock
  const toggleLockdown = () => {
      setActive(!active);
      // In real prod, play siren audio
  };

  return (
    <>
        <div className="fixed bottom-8 left-8 z-50">
            <button 
                onClick={toggleLockdown}
                className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
                    active 
                        ? 'w-16 h-16 bg-red-600 border-red-500 animate-pulse' 
                        : 'w-12 h-12 bg-black/50 border-red-900/30 hover:w-48 hover:bg-red-950/80 hover:border-red-500/50'
                }`}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    {active ? <Lock className="w-6 h-6 text-white" /> : <AlertOctagon className="w-5 h-5 text-red-700 group-hover:text-red-500" />}
                </div>
                <span className={`absolute left-10 text-xs font-bold text-red-500 uppercase tracking-widest whitespace-nowrap transition-opacity duration-300 ${active ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                    Emergency Protocol
                </span>
            </button>
        </div>

        <AnimatePresence>
            {active && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-red-950/20"
                >
                    {/* Flashing Red Vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(255,0,0,0.5)_100%)] animate-[pulse_0.5s_ease-in-out_infinite]" />
                    
                    {/* Scanlines Red */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px]" />

                    {/* Big Warning Text */}
                    <div className="relative text-center">
                        <motion.h1 
                            animate={{ scale: [1, 1.1, 1] }} 
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="text-9xl font-black text-red-600 tracking-tighter opacity-20"
                        >
                            LOCKDOWN
                        </motion.h1>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 font-mono text-2xl bg-black px-4 py-2 border border-red-500">
                            AUTHORIZED PERSONNEL ONLY
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </>
  );
}
