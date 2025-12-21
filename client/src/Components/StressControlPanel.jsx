import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  Database, 
  Wifi, 
  Server,
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';
import { socket } from '@/api/socket';

export default function StressControlPanel({ onClose }) {
  const [trafficLevel, setTrafficLevel] = useState(1);
  const [activeChaos, setActiveChaos] = useState(null);

  const handleTrafficChange = (e) => {
    const level = parseInt(e.target.value);
    setTrafficLevel(level);
    socket.emit('stress_control', {
      type: 'UPDATE_CONFIG',
      payload: { trafficMultiplier: level }
    });
  };

  const injectChaos = (type) => {
    setActiveChaos(type);
    socket.emit('stress_control', {
      type: 'INJECT_SCENARIO',
      payload: type
    });

    // Reset visual state after 5s (backend resets after 15s)
    setTimeout(() => setActiveChaos(null), 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className="fixed bottom-24 right-8 w-80 bg-[#111113] border border-red-500/20 rounded-2xl shadow-2xl shadow-red-900/20 z-40 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-red-500/10 px-4 py-3 border-b border-red-500/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-red-400" />
          <span className="font-medium text-red-200 text-sm">System Stress Lab</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] uppercase font-bold text-red-500/60">Live Environment</span>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Traffic Control */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-white/50 font-medium uppercase tracking-wider">Traffic Load</label>
            <span className="text-xs font-mono text-cyan-400">{trafficLevel}x</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="10" 
            step="1"
            value={trafficLevel}
            onChange={handleTrafficChange}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all"
          />
          <div className="flex justify-between mt-1">
             <span className="text-[10px] text-white/20">Normal</span>
             <span className="text-[10px] text-white/20">Heavy</span>
             <span className="text-[10px] text-red-400/60">DDoS</span>
          </div>
        </div>

        {/* Chaos Injection */}
        <div>
          <label className="text-xs text-white/50 font-medium uppercase tracking-wider block mb-3">Chaos Injection</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => injectChaos('DB_FAILURE')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                activeChaos === 'DB_FAILURE' 
                  ? 'bg-red-500/20 border-red-500 text-red-200 shadow-lg shadow-red-900/30' 
                  : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/10'
              }`}
            >
              <Database className="w-5 h-5" />
              <span className="text-xs">Database Fail</span>
            </button>

            <button
               onClick={() => injectChaos('NETWORK_LAG')}
               className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                activeChaos === 'NETWORK_LAG' 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-lg shadow-amber-900/30' 
                  : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/10'
              }`}
            >
              <Wifi className="w-5 h-5" />
              <span className="text-xs">Network Lag</span>
            </button>

             <button
                onClick={() => injectChaos('AUTH_SPIKE')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                activeChaos === 'AUTH_SPIKE' 
                  ? 'bg-purple-500/20 border-purple-500 text-purple-200 shadow-lg shadow-purple-900/30' 
                  : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/10'
              }`}
            >
              <Server className="w-5 h-5" />
              <span className="text-xs">Auth Spike</span>
            </button>

             <button
                onClick={() => setTrafficLevel(1)}
                className="p-3 rounded-xl border border-white/5 bg-white/5 text-white/60 hover:bg-white/10 hover:border-white/10 flex flex-col items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="text-xs">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
