import React from 'react';
import { CheckCircle, Activity, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

const StatusRow = ({ name, status, time }) => (
    <div className="flex items-center justify-between py-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-4">
             <div className={`w-3 h-3 rounded-full ${status === 'up' ? 'bg-green-500' : 'bg-red-500'}`} />
             <span className="text-lg text-white/80">{name}</span>
        </div>
        <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-1">
                 {[...Array(30)].map((_, i) => (
                     <div key={i} className={`w-2 h-8 rounded-sm ${Math.random() > 0.98 ? 'bg-amber-500/40' : 'bg-green-500/20'}`} />
                 ))}
            </div>
            <span className="text-green-500 font-mono text-sm">99.99%</span>
        </div>
    </div>
);

export default function Status() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
       <div className="border-b border-white/[0.06] bg-white/[0.02]">
            <div className="max-w-5xl mx-auto px-8 py-6 flex items-center justify-between">
                <Link to={createPageUrl('Landing')} className="font-medium text-lg tracking-tight">Axiom Status</Link>
                <div className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium">Subscribe to Updates</div>
            </div>
       </div>

       <div className="max-w-5xl mx-auto px-8 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-green-500/10 border border-green-500/20 rounded-2xl mb-20 flex items-center gap-6"
          >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                   <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div>
                   <h1 className="text-3xl font-light text-white mb-2">All Systems Operational</h1>
                   <p className="text-white/60">Last updated: Just now</p>
              </div>
          </motion.div>

          <div className="space-y-4">
               <h2 className="text-xs uppercase tracking-widest text-white/30 mb-8 border-b border-white/10 pb-4">Current Status</h2>
               <StatusRow name="Ingestion Pipeline (US-East)" status="up" />
               <StatusRow name="Ingestion Pipeline (EU-West)" status="up" />
               <StatusRow name="Dashboard API" status="up" />
               <StatusRow name="Neural Core (AI)" status="up" />
               <StatusRow name="Authentication Services" status="up" />
          </div>

          <div className="mt-20">
               <h2 className="text-xl mb-6">Past Incidents</h2>
               <div className="space-y-6">
                    <div className="p-6 bg-white/[0.02] rounded-xl border-l-4 border-amber-500">
                        <div className="text-amber-500 font-mono text-sm mb-2">Dec 18, 2024</div>
                        <h3 className="text-lg font-medium mb-2">API Latency Spike</h3>
                        <p className="text-white/40 text-sm">Resolved - We identified a bottleneck in the load balancer configuration and patched it.</p>
                    </div>
               </div>
          </div>
       </div>
    </div>
  );
}
