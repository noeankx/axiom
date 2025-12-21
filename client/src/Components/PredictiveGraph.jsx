import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle } from 'lucide-react';

export default function PredictiveGraph() {
  const [dataPoints, setDataPoints] = useState([]);
  const [prediction, setPrediction] = useState([]);
  
  // Generate mock data
  useEffect(() => {
    const historical = Array.from({ length: 20 }, (_, i) => ({
        x: i,
        y: 40 + Math.random() * 20
    }));
    setDataPoints(historical);

    // Predict future (dashed line) - trending upwards dangerously
    const future = Array.from({ length: 10 }, (_, i) => ({
        x: 19 + i,
        y: historical[19].y + (i * 5) + (Math.random() * 5)
    }));
    setPrediction(future);
  }, []);

  const maxX = 30;
  const maxY = 100;

  const getPoints = (data) => {
    return data.map(p => `${(p.x / maxX) * 100},${100 - (p.y / maxY) * 100}`).join(' ');
  };

  return (
    <div className="bg-[#0D0D0F] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    Load Forecast (1h)
                </h3>
                <p className="text-xs text-white/40 mt-1">Vector analysis predicts critical load at 14:45</p>
            </div>
            <div className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-300 animate-pulse">
                +14% Predicted
            </div>
        </div>

        <div className="h-32 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Historical Path */}
                <motion.polyline
                    points={getPoints(dataPoints)}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5 }}
                />
                 {/* Area fill */}
                 <motion.path
                    d={`M 0 100 ${getPoints(dataPoints)} V 100 H 0`}
                    fill="url(#gradientHistorical)"
                    stroke="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                />

                {/* Prediction Path */}
                <motion.polyline
                    points={getPoints(prediction)}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                    strokeDasharray="4,2"
                    strokeOpacity="0.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                />
                
                {/* Danger Zone */}
                <rect x="0" y="0" width="100" height="20" fill="url(#gradientDanger)" opacity="0.2" />
                <line x1="0" y1="20" x2="100" y2="20" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />

                <defs>
                    <linearGradient id="gradientHistorical" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="gradientDanger" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
            
            {/* Alert Indicator at the end */}
             <motion.div 
                className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.5 }}
             >
                 <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/50">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                 </div>
             </motion.div>
        </div>
    </div>
  );
}
