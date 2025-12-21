import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, AlertOctagon, CheckCircle, Clock } from 'lucide-react';

const ServiceNode = ({ name, status, index, total }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.2 }}
      className="relative flex flex-col items-center"
    >
      {/* Connector Line */}
      {index < total - 1 && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100px' }}
          transition={{ delay: index * 0.2 + 0.2, duration: 0.5 }}
          className="absolute top-6 left-full h-0.5 bg-white/10 z-0"
        >
             <motion.div 
               className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
               initial={{ width: 0 }}
               animate={{ width: '100%' }}
               transition={{ delay: index * 0.2 + 0.2, duration: 0.5 }}
             />
        </motion.div>
      )}

      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center z-10 bg-[#0A0A0B] ${
        status === 'error' ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 
        status === 'warning' ? 'border-amber-500' : 'border-cyan-500'
      }`}>
        {status === 'error' ? <AlertOctagon className="w-5 h-5 text-red-500" /> : <CheckCircle className="w-5 h-5 text-cyan-500" />}
      </div>
      
      <div className="mt-3 text-center w-32">
        <div className="text-sm font-medium text-white">{name}</div>
        <div className="text-xs text-white/40 mt-1 flex items-center justify-center gap-1">
             <Clock className="w-3 h-3" />
             {status === 'error' ? 'timeout' : '20ms'}
        </div>
      </div>
    </motion.div>
  );
};

export default function CausalityVisualizer({ traceId, onClose }) {
  // Mock trace data based on what the simulator generates for "DB_FAILURE"
  const [traceComponents, setTraceComponents] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    // Dynamic Simulation based on Trace ID Semantic
    let steps = [];
    let aiText = "";

    if (traceId && traceId.startsWith('DB_ERR')) {
        steps = [
            { name: 'Gateway', status: 'success' },
            { name: 'Auth', status: 'success' },
            { name: 'User Svc', status: 'error' } 
        ];
        aiText = "The failure originated in <span class='text-red-400 font-mono'>User Service</span> due to a database connection timeout. This caused a cascade failure in the Gateway. Suggest checking connection pool size.";
    } else if (traceId && traceId.startsWith('NET_LAG')) {
        steps = [
            { name: 'Gateway', status: 'warning' },
            { name: 'Feed Svc', status: 'warning' },
            { name: 'Ext API', status: 'success' }
        ];
        aiText = "High latency detected in <span class='text-amber-400 font-mono'>Feed Service</span>. Upstream External API is responding slowly (800ms+), causing backpressure.";
    } else {
        // Fallback / Generic
         steps = [
            { name: 'Service A', status: 'success' },
            { name: 'Service B', status: 'success' },
            { name: 'Service C', status: 'error' }
        ];
        aiText = "Anomaly detected in distributed trace. Service signaling undefined error state.";
    }

    setTraceComponents(steps);
    setAnalysis(aiText);
  }, [traceId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-12 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-[#111113] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
           <div>
              <h2 className="text-xl font-light text-white">Causality Trace</h2>
              <p className="text-sm text-white/40 font-mono mt-1">ID: {traceId}</p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
             <X className="w-5 h-5 text-white/60" />
           </button>
        </div>

        <div className="p-12 min-h-[400px] flex items-center justify-center bg-grid-white/[0.02]">
           <div className="flex items-start gap-24">
              {traceComponents.map((step, idx) => (
                  <ServiceNode 
                    key={idx} 
                    name={step.name} 
                    status={step.status} 
                    index={idx} 
                    total={traceComponents.length} 
                  />
              ))}
           </div>
        </div>
        
        <div className="p-6 bg-white/5 border-t border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
                <h4 className="text-sm font-medium text-white">AI Root Cause Analysis</h4>
                <p 
                    className="text-sm text-white/60 mt-1"
                    dangerouslySetInnerHTML={{ __html: analysis }} 
                />
            </div>
        </div>

      </motion.div>
    </div>
  );
}
