import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minimize2, Maximize2, Wind } from 'lucide-react';

export default function ZenMode({ onClose }) {
  const [breathing, setBreathing] = useState(true);

  // Simulate ambient sound (would use Audio API in real prod, but standard HTML Audio for now)
  useEffect(() => {
     // Placeholder for sound logic
  }, []);

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
        {/* Ambient background Pulse */}
        <motion.div
            className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-purple-900/10"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Central Orb */}
        <div className="relative z-10 flex flex-col items-center">
            <motion.div
                className="w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
                 <div className="text-center">
                     <div className="text-6xl font-thin text-white tracking-widest mb-4">SYSTEM OK</div>
                     <div className="text-sm text-white/30 font-mono tracking-[0.5em] uppercase">Zen Mode Active</div>
                 </div>
            </div>
        </div>

        {/* Minimal Stats */}
        <div className="absolute bottom-20 flex gap-20">
            <div className="text-center">
                <div className="text-3xl font-light text-cyan-400">98%</div>
                <div className="text-xs text-white/20 uppercase tracking-widest mt-2">Health</div>
            </div>
            <div className="text-center">
                <div className="text-3xl font-light text-white">45ms</div>
                <div className="text-xs text-white/20 uppercase tracking-widest mt-2">Latency</div>
            </div>
        </div>

        <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-4 text-white/20 hover:text-white transition-colors"
        >
            <Minimize2 className="w-6 h-6" />
        </button>
    </motion.div>
  );
}
