import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Terminal, 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  ChevronRight,
  Clock,
  AlertTriangle,
  Info,
  AlertCircle,
  Bug,
  Copy,
  ExternalLink,
  Sparkles
} from 'lucide-react';

const generateLogs = (count) => {
  const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
  const services = ['api-gateway', 'auth-service', 'user-service', 'payment-api', 'notification-worker', 'cache-service'];
  const messages = {
    INFO: [
      'Request processed successfully',
      'Connection established to database',
      'Cache hit for user session',
      'Health check passed',
      'Metrics exported to prometheus',
      'WebSocket connection opened',
      'Background job completed'
    ],
    WARN: [
      'Memory usage above 70% threshold',
      'Slow query detected: SELECT * FROM users took 523ms',
      'Rate limit 80% reached for client_id: abc123',
      'Connection pool at 85% capacity',
      'Retry attempt 2/3 for external API call',
      'Certificate expires in 14 days',
      'Deprecated API endpoint accessed'
    ],
    ERROR: [
      'Database connection timeout after 30000ms',
      'Authentication failed: invalid token signature',
      'Service unavailable: payment-api returned 503',
      'Request timeout exceeded for /api/users/bulk',
      'Invalid payload: missing required field "email"',
      'Circuit breaker opened for external-api',
      'Out of memory error in worker process'
    ],
    DEBUG: [
      'Processing request batch of 50 items',
      'Cache invalidation triggered for key: user:123',
      'Worker thread spawned for job: send-emails',
      'Queue depth increased to 145',
      'Garbage collection completed in 23ms',
      'Connection reused from pool',
      'Retry backoff: waiting 2000ms'
    ]
  };

  return Array.from({ length: count }, (_, i) => {
    const level = levels[Math.floor(Math.random() * levels.length)];
    const service = services[Math.floor(Math.random() * services.length)];
    const message = messages[level][Math.floor(Math.random() * messages[level].length)];
    const date = new Date(Date.now() - Math.random() * 3600000);
    
    return {
      id: `log-${i}`,
      timestamp: date.toISOString(),
      displayTime: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds().toString().padStart(3, '0')}`,
      level,
      service,
      message,
      traceId: Math.random().toString(36).substring(2, 10),
      spanId: Math.random().toString(36).substring(2, 8),
      host: `node-${Math.floor(Math.random() * 5) + 1}.cluster.internal`,
      metadata: {
        requestId: `req_${Math.random().toString(36).substring(2, 12)}`,
        userId: Math.random() > 0.5 ? `user_${Math.floor(Math.random() * 10000)}` : null,
        duration: Math.floor(Math.random() * 500),
        statusCode: level === 'ERROR' ? [500, 502, 503][Math.floor(Math.random() * 3)] : 200
      }
    };
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const LevelIcon = ({ level }) => {
  const icons = {
    INFO: <Info className="w-3.5 h-3.5" />,
    WARN: <AlertTriangle className="w-3.5 h-3.5" />,
    ERROR: <AlertCircle className="w-3.5 h-3.5" />,
    DEBUG: <Bug className="w-3.5 h-3.5" />
  };
  return icons[level];
};

const FilterPill = ({ label, onRemove }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg"
  >
    <span className="text-xs text-white/60">{label}</span>
    <button onClick={onRemove} className="text-white/40 hover:text-white/60">
      <X className="w-3 h-3" />
    </button>
  </motion.div>
);

const LogDetail = ({ log, onClose }) => {
  const [aiExplanation, setAiExplanation] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const explainWithAI = () => {
    setIsExplaining(true);
    setTimeout(() => {
      const explanations = {
        ERROR: "This error indicates a connection issue with the downstream service. The service timed out after waiting for the maximum configured duration. This is likely caused by high load or network latency. Consider increasing timeout values or implementing circuit breakers.",
        WARN: "This warning suggests resource utilization is approaching critical levels. While not immediately impactful, sustained high usage may lead to degraded performance. Monitor this metric and consider scaling or optimization.",
        INFO: "Standard operational log indicating normal system behavior. No action required.",
        DEBUG: "Diagnostic information useful for troubleshooting. Shows internal system state during operation."
      };
      setAiExplanation(explanations[log.level]);
      setIsExplaining(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed right-0 top-0 bottom-0 w-[500px] bg-[#0D0D0F] border-l border-white/[0.06] z-50 overflow-y-auto"
    >
      <div className="sticky top-0 bg-[#0D0D0F] border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Log Details</h3>
        <button onClick={onClose} className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors">
          <X className="w-4 h-4 text-white/40" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Level & Timestamp */}
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
            log.level === 'ERROR' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
            log.level === 'WARN' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
            log.level === 'INFO' ? 'bg-white/[0.05] text-white/60 border border-white/[0.08]' :
            'bg-purple-500/10 text-purple-400 border border-purple-500/20'
          }`}>
            {log.level}
          </div>
          <span className="text-sm text-white/40">{log.displayTime}</span>
        </div>

        {/* Message */}
        <div>
          <span className="text-xs text-white/30 uppercase tracking-wider mb-2 block">Message</span>
          <p className="text-sm text-white/80 font-mono bg-white/[0.02] p-4 rounded-lg border border-white/[0.06]">
            {log.message}
          </p>
        </div>

        {/* AI Explanation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/30 uppercase tracking-wider">AI Analysis</span>
            {!aiExplanation && (
              <button
                onClick={explainWithAI}
                disabled={isExplaining}
                className="flex items-center gap-2 text-xs text-cyan-400/80 hover:text-cyan-400 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                {isExplaining ? 'Analyzing...' : 'Explain'}
              </button>
            )}
          </div>
          <AnimatePresence>
            {aiExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-white/50 bg-cyan-500/5 border border-cyan-500/10 p-4 rounded-lg"
              >
                {aiExplanation}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Metadata */}
        <div>
          <span className="text-xs text-white/30 uppercase tracking-wider mb-3 block">Context</span>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <span className="text-sm text-white/40">Service</span>
              <span className="text-sm text-white/70 font-mono">{log.service}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <span className="text-sm text-white/40">Host</span>
              <span className="text-sm text-white/70 font-mono">{log.host}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <span className="text-sm text-white/40">Trace ID</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-cyan-400/70 font-mono">{log.traceId}</span>
                <button className="text-white/30 hover:text-white/60">
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <span className="text-sm text-white/40">Span ID</span>
              <span className="text-sm text-white/70 font-mono">{log.spanId}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <span className="text-sm text-white/40">Request ID</span>
              <span className="text-sm text-white/70 font-mono">{log.metadata.requestId}</span>
            </div>
            {log.metadata.userId && (
              <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                <span className="text-sm text-white/40">User ID</span>
                <span className="text-sm text-white/70 font-mono">{log.metadata.userId}</span>
              </div>
            )}
            <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <span className="text-sm text-white/40">Duration</span>
              <span className="text-sm text-white/70 font-mono">{log.metadata.duration}ms</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-white/40">Status Code</span>
              <span className={`text-sm font-mono ${log.metadata.statusCode >= 400 ? 'text-red-400' : 'text-green-400'}`}>
                {log.metadata.statusCode}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button className="flex-1 py-2.5 text-sm text-white/60 bg-white/[0.03] border border-white/[0.08] rounded-lg hover:bg-white/[0.05] transition-colors">
            View Trace
          </button>
          <button className="flex-1 py-2.5 text-sm text-white/60 bg-white/[0.03] border border-white/[0.08] rounded-lg hover:bg-white/[0.05] transition-colors">
            Related Logs
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function LogsExplorer() {
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [filters, setFilters] = useState({
    levels: [],
    services: []
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLogs(generateLogs(100));
  }, []);

  const levelColors = {
    INFO: 'text-white/40 bg-white/[0.03]',
    WARN: 'text-amber-400/80 bg-amber-500/10',
    ERROR: 'text-red-400/80 bg-red-500/10',
    DEBUG: 'text-purple-400/60 bg-purple-500/10'
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchQuery || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filters.levels.length === 0 || filters.levels.includes(log.level);
    const matchesService = filters.services.length === 0 || filters.services.includes(log.service);
    return matchesSearch && matchesLevel && matchesService;
  });

  const toggleLevelFilter = (level) => {
    setFilters(prev => ({
      ...prev,
      levels: prev.levels.includes(level)
        ? prev.levels.filter(l => l !== level)
        : [...prev.levels, level]
    }));
  };

  const toggleServiceFilter = (service) => {
    setFilters(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const allServices = [...new Set(logs.map(l => l.service))];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Top bar */}
      <div className="border-b border-white/[0.06] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to={createPageUrl('Landing')} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
                <Terminal className="w-4 h-4 text-black" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-medium tracking-tight">Axiom</span>
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <nav className="flex items-center gap-6">
              <Link to={createPageUrl('CommandView')} className="text-sm text-white/40 hover:text-white/70 transition-colors">Command</Link>
              <Link to={createPageUrl('LogsExplorer')} className="text-sm text-white">Logs</Link>
              <Link to={createPageUrl('IncidentTimeline')} className="text-sm text-white/40 hover:text-white/70 transition-colors">Incidents</Link>
              <Link to={createPageUrl('Insights')} className="text-sm text-white/40 hover:text-white/70 transition-colors">Insights</Link>
              <Link to={createPageUrl('Settings')} className="text-sm text-white/40 hover:text-white/70 transition-colors">Settings</Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search and filters */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search logs by message, service, or trace ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/30 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                showFilters ? 'bg-white/[0.05] border-cyan-500/30 text-white' : 'bg-white/[0.03] border-white/[0.08] text-white/60 hover:text-white'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filters</span>
              {(filters.levels.length > 0 || filters.services.length > 0) && (
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center">
                  {filters.levels.length + filters.services.length}
                </span>
              )}
            </button>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 mb-4">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <span className="text-xs text-white/30 uppercase tracking-wider mb-3 block">Level</span>
                      <div className="flex flex-wrap gap-2">
                        {['INFO', 'WARN', 'ERROR', 'DEBUG'].map(level => (
                          <button
                            key={level}
                            onClick={() => toggleLevelFilter(level)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              filters.levels.includes(level)
                                ? levelColors[level] + ' border border-current'
                                : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/60'
                            }`}
                          >
                            <LevelIcon level={level} />
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-white/30 uppercase tracking-wider mb-3 block">Service</span>
                      <div className="flex flex-wrap gap-2">
                        {allServices.map(service => (
                          <button
                            key={service}
                            onClick={() => toggleServiceFilter(service)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              filters.services.includes(service)
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/60'
                            }`}
                          >
                            {service}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active filters */}
          <AnimatePresence>
            {(filters.levels.length > 0 || filters.services.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 flex-wrap"
              >
                <span className="text-xs text-white/30">Active filters:</span>
                {filters.levels.map(level => (
                  <FilterPill key={level} label={level} onRemove={() => toggleLevelFilter(level)} />
                ))}
                {filters.services.map(service => (
                  <FilterPill key={service} label={service} onRemove={() => toggleServiceFilter(service)} />
                ))}
                <button
                  onClick={() => setFilters({ levels: [], services: [] })}
                  className="text-xs text-white/40 hover:text-white/60 ml-2"
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logs table */}
        <div className="bg-[#0D0D0F] border border-white/[0.06] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/[0.06] text-xs text-white/30 uppercase tracking-wider">
            <div className="col-span-2">Timestamp</div>
            <div className="col-span-1">Level</div>
            <div className="col-span-2">Service</div>
            <div className="col-span-6">Message</div>
            <div className="col-span-1">Trace</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/[0.03]">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                onClick={() => setSelectedLog(log)}
                className="grid grid-cols-12 gap-4 px-6 py-3 hover:bg-white/[0.02] cursor-pointer transition-colors group"
              >
                <div className="col-span-2 font-mono text-xs text-white/30">
                  {log.displayTime}
                </div>
                <div className="col-span-1">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${levelColors[log.level]}`}>
                    <LevelIcon level={log.level} />
                    {log.level}
                  </span>
                </div>
                <div className="col-span-2 font-mono text-xs text-cyan-400/60 truncate">
                  {log.service}
                </div>
                <div className="col-span-6 font-mono text-xs text-white/50 truncate">
                  {log.message}
                </div>
                <div className="col-span-1 flex items-center justify-between">
                  <span className="font-mono text-xs text-white/20">{log.traceId}</span>
                  <ChevronRight className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-white/30">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedLog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedLog(null)}
            />
            <LogDetail log={selectedLog} onClose={() => setSelectedLog(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}