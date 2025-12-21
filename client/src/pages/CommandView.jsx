import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Terminal, Activity, Server, Database, Cpu, HardDrive, Wifi, AlertTriangle, 
  CheckCircle, Clock, Search, Filter, ChevronRight, MoreHorizontal, Zap, 
  ArrowUpRight, Bot, X, Brain, Wind, Monitor, Bell, Shield, Lock
} from 'lucide-react';
import { socket } from '@/api/socket';
import { analyzeLogWindow, detectThreats } from '@/utils/LogAnalysisEngine';
import SystemHealthOrb from '@/Components/SystemHealthOrb';
import StressControlPanel from '@/Components/StressControlPanel';
import CausalityVisualizer from '@/Components/CausalityVisualizer';
import HolographicGlobe from '@/Components/HolographicGlobe';
import PredictiveGraph from '@/Components/PredictiveGraph';
import NeuralVoice from '@/Components/NeuralVoice';
import ThreatMap from '@/Components/ThreatMap';
import ZenMode from '@/Components/ZenMode';
import AlertManager from '@/Components/AlertManager';

const MetricCard = ({ icon: Icon, label, value, trend, status }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-[#0D0D0F] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-colors group relative overflow-hidden backdrop-blur-sm"
  >
     <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex items-start justify-between mb-4 relative z-10">
      <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center group-hover:bg-white/[0.06] transition-colors">
        <Icon className="w-5 h-5 text-white/40 group-hover:text-white/60" strokeWidth={1.5} />
      </div>
      {status && (
        <div className={`w-2 h-2 rounded-full ${
          status === 'healthy' ? 'bg-green-400' : 
          status === 'warning' ? 'bg-amber-400' : 'bg-red-400'
        }`}>
          <motion.div
            className={`w-2 h-2 rounded-full ${
              status === 'healthy' ? 'bg-green-400' : 
              status === 'warning' ? 'bg-amber-400' : 'bg-red-400'
            }`}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      )}
    </div>
    <div className="space-y-1 relative z-10">
      <span className="text-xs text-white/40 uppercase tracking-wider font-medium">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-light text-white tracking-tight">{value}</span>
        {trend && (
          <span className={`text-xs font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

const LogEntry = ({ log, index, onTraceClick }) => {
  const levelColors = {
    INFO: 'text-white/40',
    WARN: 'text-amber-400/80',
    ERROR: 'text-red-400/80',
    DEBUG: 'text-purple-400/60'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="group flex items-center gap-4 py-2 px-4 hover:bg-white/[0.02] transition-colors cursor-pointer border-b border-white/[0.03]"
    >
      <span className="font-mono text-xs text-white/20 w-24 flex-shrink-0">{log.timestamp}</span>
      <span className={`font-mono text-xs w-12 flex-shrink-0 ${levelColors[log.level]}`}>{log.level}</span>
      <span className="font-mono text-xs text-cyan-400/60 w-32 flex-shrink-0 truncate">{log.service}</span>
      <span className="font-mono text-xs text-white/50 flex-1 truncate">{log.message}</span>
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3">
        <Link to={`/AIAnalysisDemo?log=${encodeURIComponent(log.message)}`}>
            <button className="p-1.5 hover:bg-cyan-500/10 rounded text-cyan-400 hover:text-cyan-300 transition-colors" title="Analyze in AI Lab">
                <Brain className="w-3.5 h-3.5" />
            </button>
        </Link>
        {log.traceId && (
            <button 
                onClick={(e) => { e.stopPropagation(); onTraceClick(log.traceId); }}
                className="flex items-center gap-1 hover:bg-white/10 rounded px-1.5 py-0.5 transition-colors"
                title="View Causality Trace"
            >
                <span className="font-mono text-xs text-cyan-400 hover:underline">{log.traceId}</span>
                <ChevronRight className="w-3 h-3 text-cyan-400" />
            </button>
        )}
      </div>
    </motion.div>
  );
};

export default function CommandView() {
  const [logs, setLogs] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const logContainerRef = useRef(null);
  
  // Intelligence State
  const [analysis, setAnalysis] = useState(null);
  const [threats, setThreats] = useState([]);
  const [alerts, setAlerts] = useState([]); // User defined rules
  const [triggeredAlerts, setTriggeredAlerts] = useState([]); // Fired alerts

  const [metrics, setMetrics] = useState({
    requests: 12847,
    errors: 23,
    latency: 124,
    uptime: 99.97
  });

  // Feature States
  const [showStressLab, setShowStressLab] = useState(false);
  const [activeTraceId, setActiveTraceId] = useState(null);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [showAlertManager, setShowAlertManager] = useState(false);
  
  // AI Persona
  const [aiPersona, setAiPersona] = useState('system');

  // Copilot Logic
  const [copilotMessages, setCopilotMessages] = useState([
     { id: 1, type: 'bot', text: 'Axiom Neural Core online. Monitoring active streams.' }
  ]);
  const [copilotInput, setCopilotInput] = useState('');

  const generateAIResponse = (input) => {
      const lowerInput = input.toLowerCase();
      
      // Context Aware Responses
      if (lowerInput.includes('status') || lowerInput.includes('health')) {
          return analysis 
            ? `System Health Score is ${analysis.healthScore}%. Current log velocity is ${analysis.velocity} logs/sec. Operations are ${analysis.healthScore > 80 ? 'optimal' : 'degraded'}.`
            : "System metrics are initializing...";
      }
      
      if (lowerInput.includes('error') || lowerInput.includes('fail')) {
          if (metrics.errors === 0) return "No significant errors detected in the current window.";
          return `I've detected ${metrics.errors} recent errors. The most common issue appears to be related to ${analysis?.topError?.service || 'database connectivity'}.`;
      }

      if (lowerInput.includes('alert') || lowerInput.includes('rule')) {
          return `You have ${alerts.length} active alert rules configured. ${triggeredAlerts.length} alerts have triggered in the last session.`;
      }

      if (lowerInput.includes('trace') || lowerInput.includes('cause')) {
         return "Click on any log entry ID to visualize the causal chain. I can trace requests across microservices.";
      }

      if (lowerInput.includes('help') || lowerInput.includes('hi') || lowerInput.includes('hello')) {
          return "I am the Axiom Neural Core. You can ask me about 'System Status', 'Recent Errors', 'Active Alerts', or specific log patterns.";
      }

      // Fallback Persona Responses
      const responses = {
          system: [
              "I'm processing that request against the knowledge graph...",
              "Query unclear. displaying correlated metrics instead.",
              "Indexing complete. No anomalies found in that vector."
          ],
          sarcastic: [
              "Oh look, another query. How original.",
              "I'm surprised you even noticed that. Gold star.",
              "Analyzing... slowly, just to annoy you.",
              "Have you tried reading the logs yourself? Just kidding."
          ],
          panicked: [
              "OH NO! DID YOU SEE THAT?!",
              "WE'RE ALL GOING TO 404!!",
              "I CAN'T HANDLE THE PRESSURE!",
              "THEY'RE IN THE MAINFRAME!"
          ]
      };
      const personaResponses = responses[aiPersona];
      return personaResponses[Math.floor(Math.random() * personaResponses.length)];
  }

  const handleCopilotSubmit = (e) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;
    setCopilotMessages(p => [...p, { id: Date.now(), type: 'user', text: copilotInput }]);
    setCopilotInput('');
    
    // Simulate thinking delay
    setTimeout(() => {
        setCopilotMessages(p => [...p, { id: Date.now()+1, type: 'bot', text: generateAIResponse(copilotInput) }]);
    }, 600);
  };

  // Log Processing & Intelligence Loop
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleNewLog = (newLog) => {
      if (isPaused) return;
      
      setLogs(prevLogs => {
        const updated = [newLog, ...prevLogs];
        const limited = updated.slice(0, 100); // Keep buffer size manageable

        // Run Analysis every update (or throttle if needed)
        const currentAnalysis = analyzeLogWindow(limited);
        setAnalysis(currentAnalysis);
        
        const currentThreats = detectThreats(limited);
        setThreats(currentThreats);

        // Check Alerts
        alerts.forEach(rule => {
            let match = false;
            if (rule.field === 'level' && newLog.level === rule.value) match = true;
            if (rule.field === 'service' && newLog.service === rule.value) match = true;
            if (rule.field === 'message' && newLog.message.includes(rule.value)) match = true;

            if (match) {
                // Trigger Alert Visual
                setTriggeredAlerts(prev => [...prev, { ruleId: rule.id, log: newLog, time: Date.now() }].slice(-5));
            }
        });

        return limited;
      });

      if (newLog.level === 'ERROR') setMetrics(m => ({ ...m, errors: m.errors + 1 }));
      setMetrics(m => ({ ...m, requests: m.requests + 1 }));
    };

    socket.on('log_stream', handleNewLog);
    return () => socket.off('log_stream', handleNewLog);
  }, [isPaused, alerts]);

  // Alert Manager Handlers
  const addRule = (rule) => setAlerts(prev => [...prev, rule]);
  const removeRule = (id) => setAlerts(prev => prev.filter(r => r.id !== id));

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/20 selection:text-cyan-200 relative overflow-hidden">
      
      {/* Alert Overlay Flash */}
      <AnimatePresence>
        {triggeredAlerts.length > 0 && Date.now() - triggeredAlerts[triggeredAlerts.length-1].time < 2000 && (
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-red-500 pointer-events-none z-50 mix-blend-overlay"
             />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isZenMode && <ZenMode onClose={() => setIsZenMode(false)} />}
        {showAlertManager && (
            <AlertManager 
                onClose={() => setShowAlertManager(false)} 
                rules={alerts} 
                onAddRule={addRule} 
                onRemoveRule={removeRule} 
            />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
                 <Link to={createPageUrl('Landing')} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/30 transition-shadow">
                        <Terminal className="w-4 h-4 text-black" strokeWidth={2.5} />
                    </div>
                    <span className="text-lg font-medium tracking-tight">Axiom <span className="text-white/20 font-light">Command</span></span>
                 </Link>
                 <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/[0.06]">
                    <Link to={createPageUrl('CommandView')} className="px-4 py-1.5 text-sm text-white bg-white/10 rounded-full transition-all shadow-sm">
                        Overview
                    </Link>
                    <Link to={createPageUrl('LogsExplorer')} className="px-4 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all">
                        Logs
                    </Link>
                    <Link to={createPageUrl('IncidentTimeline')} className="px-4 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all">
                        Incidents
                    </Link>
                    <Link to={createPageUrl('Insights')} className="px-4 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all">
                        Intelligence
                    </Link>
                 </nav>
            </div>
            <div className="flex items-center gap-2">
                 <button 
                    onClick={() => setShowAlertManager(true)}
                    className="p-2 text-white/40 hover:text-amber-400 transition-colors relative"
                    title="Manage Alerts"
                 >
                    <Bell className="w-5 h-5" />
                    {alerts.length > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 border border-black" />
                    )}
                 </button>
                 
                 <button 
                    onClick={() => setIsZenMode(true)}
                    className="p-2 text-white/40 hover:text-cyan-400 transition-colors"
                    title="Enter Zen Mode"
                 >
                    <Wind className="w-5 h-5" />
                 </button>

                 <div className="h-4 w-px bg-white/10 mx-2" />

                 <button 
                    onClick={() => setShowStressLab(!showStressLab)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                        showStressLab ? 'bg-red-500/10 border-red-500/40 text-red-400' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                    }`}
                 >
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-medium">Stress Lab</span>
                 </button>
            </div>
        </div>
      </header>

      {/* Main Content - Bento Grid */}
      <main className="pt-24 pb-12 px-6 max-w-[1600px] mx-auto relative z-10">
         {/* Metrics Row */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <MetricCard icon={Activity} label="Throughput" value={metrics.requests.toLocaleString()} trend={12} status="healthy" />
            <MetricCard icon={AlertTriangle} label="Error Rate" value={`${(metrics.errors / metrics.requests * 100).toFixed(2)}%`} trend={-2} status="healthy" />
            <MetricCard icon={Clock} label="Latency (P95)" value={`${Math.round(metrics.latency)}ms`} status={metrics.latency > 100 ? 'warning' : 'healthy'} />
            <MetricCard icon={Cpu} label="System Health" value={analysis ? `${analysis.healthScore}%` : '...'} status={analysis && analysis.healthScore < 80 ? 'warning' : 'healthy'} />
         </div>

         <div className="grid grid-cols-12 gap-6 h-[800px]">
            {/* Left Col - Logs (Span 8) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                {/* Visualizer & Threat Map (Replaced WarRoom) */}
                <div className="grid grid-cols-2 gap-6 h-[320px]">
                    <HolographicGlobe />
                    <ThreatMap threats={threats} />
                </div>
                
                {/* Live Logs */}
                <div className="flex-1 bg-[#0D0D0F] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col backdrop-blur-sm">
                    <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                             <h3 className="font-medium text-white/80">Live Ingestion Stream</h3>
                         </div>
                         <div className="flex items-center gap-2">
                             {/* Analysis Badge */}
                             {analysis && analysis.velocity > 10 && (
                                <div className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-400 font-mono">
                                    HIGH VELOCITY: {analysis.velocity}/s
                                </div>
                             )}
                             <input type="text" placeholder="Filter stream..." className="bg-white/5 border border-white/10 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
                             <button onClick={() => setIsPaused(!isPaused)} className="text-xs font-mono text-white/40 hover:text-white px-2 uppercase">{isPaused ? 'Resume' : 'Pause'}</button>
                         </div>
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                        <AnimatePresence mode="popLayout">
                            {logs.map((log, i) => (
                                <LogEntry key={log.id || i} log={log} index={i} onTraceClick={setActiveTraceId} />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Right Col - Intelligence (Span 4) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                 <SystemHealthOrb status={analysis && analysis.healthScore < 80 ? 'warning' : 'healthy'} />
                 <PredictiveGraph />
                 <NeuralVoice />
            </div>
         </div>
      </main>

      {/* Floating Copilot */}
      <motion.button
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center z-40 hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
      >
        <Bot className="w-6 h-6 text-white" />
      </motion.button>

      {/* Copilot Sidebar */}
      <AnimatePresence>
        {isCopilotOpen && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={() => setIsCopilotOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                />
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed top-0 right-0 bottom-0 w-[450px] bg-[#0A0A0B] border-l border-white/[0.06] z-50 flex flex-col shadow-2xl"
                >
                     <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                                 <Brain className="w-5 h-5 text-cyan-400" />
                             </div>
                             <div>
                                 <h3 className="font-medium text-white">Neural Core</h3>
                                 <div className="flex items-center gap-2 mt-1">
                                    <button 
                                        onClick={() => setAiPersona('system')} 
                                        className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${aiPersona==='system' ? 'border-cyan-500 text-cyan-500' : 'border-white/10 text-white/40'}`}
                                    >Sys</button>
                                     <button 
                                        onClick={() => setAiPersona('sarcastic')} 
                                        className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${aiPersona==='sarcastic' ? 'border-purple-500 text-purple-500' : 'border-white/10 text-white/40'}`}
                                    >Sarc</button>
                                     <button 
                                        onClick={() => setAiPersona('panicked')} 
                                        className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${aiPersona==='panicked' ? 'border-red-500 text-red-500' : 'border-white/10 text-white/40'}`}
                                    >Panic</button>
                                 </div>
                             </div>
                        </div>
                        <button onClick={() => setIsCopilotOpen(false)}><X className="w-5 h-5 text-white/40" /></button>
                     </div>
                     <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {copilotMessages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                                    msg.type === 'user' ? 'bg-white/10 text-white rounded-tr-none' : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-100 rounded-tl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                     </div>
                     <div className="p-4 border-t border-white/[0.06]">
                        <form onSubmit={handleCopilotSubmit} className="relative">
                            <input value={copilotInput} onChange={e => setCopilotInput(e.target.value)} placeholder={`Ask ${aiPersona} core...`} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-5 pr-12 text-white focus:outline-none focus:border-cyan-500/50" />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-cyan-500 rounded-lg text-black"><ArrowUpRight className="w-4 h-4" /></button>
                        </form>
                     </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStressLab && <StressControlPanel onClose={() => setShowStressLab(false)} />}
        {activeTraceId && <CausalityVisualizer traceId={activeTraceId} onClose={() => setActiveTraceId(null)} />}
      </AnimatePresence>
    </div>
  );
}