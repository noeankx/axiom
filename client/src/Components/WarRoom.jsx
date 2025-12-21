import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Terminal as TerminalIcon, Radio } from 'lucide-react';

const Cursor = ({ color, x, y, name, action }) => (
    <motion.div
        className="absolute z-50 pointer-events-none"
        animate={{ x, y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
    >
        <div className="relative">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19823L11.7829 8.63684L6.5886 12.3673H5.65376Z" fill={color} stroke="white" strokeWidth="1"/>
            </svg>
            <div className="absolute top-4 left-3 flex flex-col items-start min-w-[100px]">
                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-white border border-white/10 whitespace-nowrap shadow-xl">
                    {name}
                </span>
                {action && (
                    <motion.div 
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mt-1 px-2 py-0.5 rounded-md bg-cyan-500/20 text-[9px] font-mono text-cyan-300 border border-cyan-500/30 whitespace-nowrap"
                    >
                        {action}
                    </motion.div>
                )}
            </div>
        </div>
    </motion.div>
);

export default function WarRoom() {
  const [users, setUsers] = useState([
      { id: 1, name: 'Sarah (DevOps)', color: '#ef4444', x: 20, y: 40, action: 'Tail logs...' },
      { id: 2, name: 'Mike (SRE)', color: '#22d3ee', x: 150, y: 120, action: null },
      { id: 3, name: 'AI Sentinel', color: '#a855f7', x: 250, y: 80, action: 'Scanning...' },
  ]);

  const [terminalLines, setTerminalLines] = useState([
      { user: 'Mike', cmd: 'kubectl get pods -n prod', color: 'text-cyan-400' },
      { user: 'Sarah', cmd: 'Found latency spike in availability-zone-b', color: 'text-red-400' }
  ]);

  // Simulate cursor movement and actions
  useEffect(() => {
    const maxX = 300; // Constrain roughly to container
    const maxY = 200;

    const interval = setInterval(() => {
        setUsers(prev => prev.map(u => {
            const move = Math.random() > 0.3;
            const newX = move ? Math.max(0, Math.min(maxX, u.x + (Math.random() - 0.5) * 200)) : u.x;
            const newY = move ? Math.max(0, Math.min(maxY, u.y + (Math.random() - 0.5) * 150)) : u.y;
            
            // Random action updates
            let newAction = u.action;
            if (Math.random() > 0.8) {
                const actions = ['Querying DB...', 'Checking metrics...', 'Typing...', null, null];
                newAction = actions[Math.floor(Math.random() * actions.length)];
            }
            if (u.name.includes('AI') && Math.random() > 0.9) newAction = 'Auto-healing...';

            return { ...u, x: newX, y: newY, action: newAction };
        }));

        // Occasional chat updates
        if (Math.random() > 0.8) {
             const newLines = [
                 { user: 'AI', cmd: 'Anomaly confidence: 98.4%', color: 'text-purple-400' },
                 { user: 'Sarah', cmd: 'Rolling back v2.4...', color: 'text-red-400' },
                 { user: 'Mike', cmd: 'P99 latency stabilizing', color: 'text-green-400' },
                 { user: 'System', cmd: 'Scale-out triggered', color: 'text-white/40' }
             ];
             const nextLine = newLines[Math.floor(Math.random() * newLines.length)];
             setTerminalLines(prev => [...prev.slice(-3), nextLine]);
        }

    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative border border-dashed border-white/10 bg-[#0A0A0B]/80 h-full min-h-[300px] overflow-hidden rounded-2xl p-6 relative group">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        
        <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
             <div className="flex items-center gap-2 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-md">
                <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                <span className="text-[10px] font-mono text-red-500 uppercase tracking-wider">Live Session</span>
             </div>
             <div className="flex -space-x-2">
                 {users.map(u => (
                     <div key={u.id} className="w-6 h-6 rounded-full border border-[#0A0A0B] bg-white/10 flex items-center justify-center text-[10px] text-white font-medium" style={{backgroundColor: u.color}}>
                        {u.name.charAt(0)}
                     </div>
                 ))}
                 <div className="w-6 h-6 rounded-full border border-[#0A0A0B] bg-white/5 flex items-center justify-center text-[10px] text-white/50">+4</div>
             </div>
        </div>

        <div className="mt-8 font-mono text-xs space-y-2 relative z-10">
             {terminalLines.map((line, i) => (
                 <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className={`flex items-center gap-2 ${line.color}`}
                 >
                     <TerminalIcon className="w-3 h-3 opacity-50" />
                     <span className="opacity-50 text-[10px] uppercase w-12">{line.user}:</span>
                     <span>{line.cmd}</span>
                 </motion.div>
             ))}
             <motion.div 
                animate={{ opacity: [0, 1, 0] }} 
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-2 h-4 bg-cyan-500/50"
             />
        </div>
        
        {users.map(u => (
            <Cursor key={u.id} {...u} />
        ))}
    </div>
  );
}
