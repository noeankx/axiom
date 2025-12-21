import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Terminal, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Zap,
  Activity,
  ArrowRight,
  ChevronRight,
  BarChart3
} from 'lucide-react';

const insights = [
  {
    id: 1,
    type: 'prediction',
    priority: 'high',
    title: 'Memory pressure expected in 6 hours',
    description: 'Based on current growth patterns, user-service memory usage will exceed 90% threshold in approximately 6 hours. Historical data suggests this correlates with increased response latency.',
    metric: 'Memory Usage',
    current: '72%',
    projected: '94%',
    timeframe: '6h',
    recommendation: 'Consider scaling horizontally or investigating memory-intensive operations.',
    confidence: 87
  },
  {
    id: 2,
    type: 'anomaly',
    priority: 'medium',
    title: 'Unusual traffic pattern detected',
    description: 'Request volume from IP range 185.x.x.x has increased 340% compared to baseline. Pattern does not match typical user behavior.',
    metric: 'Request Volume',
    current: '4,521/min',
    baseline: '1,024/min',
    recommendation: 'Review access logs and consider implementing rate limiting for suspicious IP ranges.',
    confidence: 92
  },
  {
    id: 3,
    type: 'optimization',
    priority: 'low',
    title: 'Database query optimization opportunity',
    description: 'Query pattern SELECT * FROM users WHERE last_login > ? is executed 12,000 times daily with average duration of 234ms. Adding index on last_login column could reduce this to ~15ms.',
    metric: 'Query Performance',
    current: '234ms avg',
    potential: '15ms avg',
    recommendation: 'CREATE INDEX idx_users_last_login ON users(last_login);',
    confidence: 95
  },
  {
    id: 4,
    type: 'trend',
    priority: 'info',
    title: 'Error rate trending downward',
    description: 'Overall system error rate has decreased 23% over the past 7 days. This improvement correlates with the recent deployment of retry logic in api-gateway.',
    metric: 'Error Rate',
    previous: '2.3%',
    current: '1.77%',
    trend: 'positive',
    confidence: 98
  }
];

const weeklyMetrics = [
  { day: 'Mon', requests: 1240000, errors: 2.1, latency: 145 },
  { day: 'Tue', requests: 1380000, errors: 1.9, latency: 132 },
  { day: 'Wed', requests: 1520000, errors: 2.4, latency: 156 },
  { day: 'Thu', requests: 1450000, errors: 1.8, latency: 128 },
  { day: 'Fri', requests: 1680000, errors: 1.6, latency: 118 },
  { day: 'Sat', requests: 890000, errors: 1.2, latency: 98 },
  { day: 'Sun', requests: 720000, errors: 1.1, latency: 92 }
];

const InsightCard = ({ insight, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityStyles = {
    high: 'border-l-red-500/50',
    medium: 'border-l-amber-500/50',
    low: 'border-l-blue-500/50',
    info: 'border-l-green-500/50'
  };

  const typeIcons = {
    prediction: <TrendingUp className="w-4 h-4" />,
    anomaly: <AlertTriangle className="w-4 h-4" />,
    optimization: <Zap className="w-4 h-4" />,
    trend: <Activity className="w-4 h-4" />
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`bg-[#0D0D0F] border border-white/[0.06] border-l-2 ${priorityStyles[insight.priority]} rounded-xl overflow-hidden`}
    >
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-white/40">
                {typeIcons[insight.type]}
              </div>
              <div>
                <span className="text-xs text-white/30 uppercase tracking-wider">{insight.type}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-white/40">Confidence: {insight.confidence}%</span>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium text-white/90 mb-2">{insight.title}</h3>
            <p className="text-sm text-white/40 leading-relaxed">{insight.description}</p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 mt-8"
          >
            <ChevronRight className="w-5 h-5 text-white/30" />
          </motion.div>
        </div>

        {/* Metrics preview */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/[0.04]">
          <div>
            <span className="text-xs text-white/30 block mb-1">{insight.type === 'prediction' ? 'Current' : insight.type === 'anomaly' ? 'Current' : insight.type === 'optimization' ? 'Current' : 'Previous'}</span>
            <span className="text-sm font-mono text-white/70">{insight.current || insight.previous}</span>
          </div>
          {(insight.projected || insight.baseline || insight.potential) && (
            <>
              <ArrowRight className="w-4 h-4 text-white/20" />
              <div>
                <span className="text-xs text-white/30 block mb-1">{insight.type === 'prediction' ? 'Projected' : insight.type === 'anomaly' ? 'Baseline' : 'Potential'}</span>
                <span className={`text-sm font-mono ${
                  insight.type === 'optimization' || insight.trend === 'positive' ? 'text-green-400' : 
                  insight.type === 'prediction' ? 'text-red-400' : 'text-amber-400'
                }`}>
                  {insight.projected || insight.baseline || insight.potential}
                </span>
              </div>
            </>
          )}
          {insight.timeframe && (
            <div className="ml-auto flex items-center gap-2 text-white/30">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{insight.timeframe}</span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-white/[0.04]">
              <div className="bg-white/[0.02] rounded-lg p-4">
                <span className="text-xs text-white/30 uppercase tracking-wider block mb-2">Recommendation</span>
                <p className="text-sm text-white/60">{insight.recommendation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const MiniChart = ({ data, dataKey, color }) => {
  const max = Math.max(...data.map(d => d[dataKey]));
  const min = Math.min(...data.map(d => d[dataKey]));
  const range = max - min;

  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((d, i) => {
        const height = range > 0 ? ((d[dataKey] - min) / range) * 100 : 50;
        return (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${Math.max(height, 10)}%` }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            className={`flex-1 rounded-sm ${color}`}
          />
        );
      })}
    </div>
  );
};

export default function Insights() {
  const summaryRef = useRef(null);
  const summaryInView = useInView(summaryRef, { once: true });

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
              <Link to={createPageUrl('LogsExplorer')} className="text-sm text-white/40 hover:text-white/70 transition-colors">Logs</Link>
              <Link to={createPageUrl('IncidentTimeline')} className="text-sm text-white/40 hover:text-white/70 transition-colors">Incidents</Link>
              <Link to={createPageUrl('Insights')} className="text-sm text-white">Insights</Link>
              <Link to={createPageUrl('Settings')} className="text-sm text-white/40 hover:text-white/70 transition-colors">Settings</Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tight mb-2">Insights</h1>
          <p className="text-white/40">AI-powered analysis and predictions for your infrastructure.</p>
        </div>

        {/* Weekly summary */}
        <motion.div
          ref={summaryRef}
          initial={{ opacity: 0, y: 30 }}
          animate={summaryInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-[#0D0D0F] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-white/30 uppercase tracking-wider">Requests / Week</span>
              <BarChart3 className="w-4 h-4 text-white/20" />
            </div>
            <MiniChart data={weeklyMetrics} dataKey="requests" color="bg-cyan-400/60" />
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-light text-white">8.9M</span>
              <span className="text-xs text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12%
              </span>
            </div>
          </div>

          <div className="bg-[#0D0D0F] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-white/30 uppercase tracking-wider">Avg Error Rate</span>
              <AlertTriangle className="w-4 h-4 text-white/20" />
            </div>
            <MiniChart data={weeklyMetrics} dataKey="errors" color="bg-amber-400/60" />
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-light text-white">1.73%</span>
              <span className="text-xs text-green-400 flex items-center">
                <TrendingDown className="w-3 h-3 mr-1" />
                -18%
              </span>
            </div>
          </div>

          <div className="bg-[#0D0D0F] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-white/30 uppercase tracking-wider">Avg Latency</span>
              <Clock className="w-4 h-4 text-white/20" />
            </div>
            <MiniChart data={weeklyMetrics} dataKey="latency" color="bg-purple-400/60" />
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-light text-white">124ms</span>
              <span className="text-xs text-green-400 flex items-center">
                <TrendingDown className="w-3 h-3 mr-1" />
                -8%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Insights list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-white/80">Active Insights</h2>
            <span className="text-sm text-white/40">{insights.length} insights</span>
          </div>
          {insights.map((insight, index) => (
            <InsightCard key={insight.id} insight={insight} index={index} />
          ))}
        </div>

        {/* System health summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 bg-gradient-to-r from-cyan-500/5 to-transparent border border-cyan-500/10 rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white/90 mb-2">System Health Summary</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Overall infrastructure health is <span className="text-green-400">good</span>. There is 1 high-priority prediction requiring attention regarding memory pressure in user-service. Error rates have improved significantly over the past week, down 18% from baseline. Consider addressing the database optimization opportunity which could reduce query latency by 93%.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}