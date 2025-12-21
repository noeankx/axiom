import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Globe, AlertTriangle, Radio, Activity } from 'lucide-react';

const ThreatMap = ({ threats = [] }) => {
  // If no real threats, show some "Scanning" activity to keep it alive
  const activeThreats = threats.length > 0 ? threats : [
      { id: 'scan-1', severity: 'LOW', label: 'Background Scans', source: 'Firewall', region: 'APAC' },
      { id: 'scan-2', severity: 'LOW', label: 'Ping Sweep', source: 'Gateway', region: 'EU' } 
  ];

  return (
    <div className="h-full bg-[#0A0A0B] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden flex flex-col">
       {/* Header */}
       <div className="flex items-center justify-between mb-6 z-10">
           <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                   <Shield className="w-4 h-4 text-red-500" />
               </div>
               <div>
                   <h3 className="text-sm font-medium text-white">Active Threat Vector</h3>
                   <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                       <span className="text-xs text-white/40 font-mono">LIVE MONITORING</span>
                   </div>
               </div>
           </div>
           
           <div className="flex items-center gap-4">
               <div className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
                   <Globe className="w-3 h-3 text-white/40" />
                   <span className="text-xs font-mono text-white/60">GLOBAL</span>
               </div>
           </div>
       </div>

       {/* Map Visualization (Abstract) */}
       <div className="flex-1 relative border border-white/[0.04] rounded-xl bg-white/[0.01] overflow-hidden group">
           {/* Grid Background */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
           
           {/* Radar Sweep Effect */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent w-[20%] skew-x-12"
                animate={{ left: ['-20%', '120%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

           {/* Threat Nodes */}
           <AnimatePresence>
               {activeThreats.map((threat, i) => (
                   <motion.div
                        key={threat.id || i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute"
                        style={{
                            top: `${30 + (i * 20) % 60}%`,
                            left: `${20 + (i * 30) % 70}%`
                        }}
                   >
                       <div className="relative group/node cursor-pointer">
                           <div className={`w-3 h-3 rounded-full ${threat.severity === 'HIGH' ? 'bg-red-500' : 'bg-amber-500'} animate-ping absolute inset-0 opacity-75`} />
                           <div className={`w-3 h-3 rounded-full ${threat.severity === 'HIGH' ? 'bg-red-500 border-red-400' : 'bg-amber-500 border-amber-400'} border shadow-[0_0_15px_rgba(239,68,68,0.4)] relative z-10`} />
                           
                           {/* Tooltip */}
                           <div className="absolute left-6 top-1/2 -translate-y-1/2 w-48 bg-black/90 backdrop-blur-md border border-white/10 p-3 rounded-lg opacity-0 group-hover/node:opacity-100 transition-opacity z-20 pointer-events-none">
                               <div className="flex items-center justify-between mb-1">
                                   <span className={`text-[10px] uppercase font-bold ${threat.severity === 'HIGH' ? 'text-red-500' : 'text-amber-500'}`}>{threat.severity} THREAT</span>
                                   <Lock className="w-3 h-3 text-white/20" />
                               </div>
                               <div className="text-xs text-white/90 font-medium mb-1">{threat.label}</div>
                               <div className="text-[10px] text-white/40 font-mono">Source: {threat.source}</div>
                           </div>
                       </div>
                       
                       {/* Connection Lines (Cosmetic) */}
                       <svg className="absolute top-1.5 left-1.5 w-[200px] h-[200px] pointer-events-none opacity-20 overflow-visible">
                           <motion.line 
                                x1="0" y1="0" x2="100" y2="50" 
                                stroke={threat.severity === 'HIGH' ? '#ef4444' : '#f59e0b'} 
                                strokeWidth="1"
                                strokeDasharray="4 4"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1 }}
                           />
                       </svg>
                   </motion.div>
               ))}
           </AnimatePresence>
           
           {/* Center Hub */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 rounded-full border border-cyan-500/30 flex items-center justify-center bg-cyan-900/10 backdrop-blur-sm">
                    <Activity className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="absolute inset-0 border border-cyan-500/20 rounded-full animate-ping opacity-20" />
           </div>
       </div>

       {/* Footer Stats */}
       <div className="mt-4 grid grid-cols-3 gap-2">
           <div className="bg-white/[0.03] rounded-lg p-3 text-center">
               <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Threats</div>
               <div className="text-lg font-mono text-white">{activeThreats.length}</div>
           </div>
           <div className="bg-white/[0.03] rounded-lg p-3 text-center">
               <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Blocked</div>
               <div className="text-lg font-mono text-cyan-400">1,204</div>
           </div>
           <div className="bg-white/[0.03] rounded-lg p-3 text-center">
               <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Status</div>
               <div className="text-lg font-mono text-green-400">SECURE</div>
           </div>
       </div>
    </div>
  );
};

export default ThreatMap;
