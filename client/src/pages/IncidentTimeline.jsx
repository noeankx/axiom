import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Terminal, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Zap,
  Activity,
  Server,
  Database,
  XCircle
} from 'lucide-react';

const incidents = [
  {
    id: 'inc-001',
    title: 'Database Connection Pool Exhaustion',
    severity: 'critical',
    status: 'resolved',
    startTime: '2024-01-15T14:23:00Z',
    endTime: '2024-01-15T15:45:00Z',
    duration: '1h 22m',
    affectedServices: ['user-service', 'auth-service', 'payment-api'],
    rootCause: 'Connection leak in user-service caused by unclosed database connections in error handling path',
    events: [
      { time: '14:23:01', type: 'detection', title: 'Anomaly detected', description: 'Connection pool usage spiked to 95%' },
      { time: '14:23:15', type: 'alert', title: 'Alert triggered', description: 'Critical alert sent to on-call team' },
      { time: '14:25:00', type: 'impact', title: 'Service degradation', description: 'user-service latency increased 5x' },
      { time: '14:30:00', type: 'escalation', title: 'Incident escalated', description: 'Secondary services affected' },
      { time: '14:45:00', type: 'investigation', title: 'Root cause identified', description: 'Connection leak found in error handler' },
      { time: '15:00:00', type: 'mitigation', title: 'Fix deployed', description: 'Hotfix released to production' },
      { time: '15:30:00', type: 'recovery', title: 'Services recovering', description: 'Connection pool normalizing' },
      { time: '15:45:00', type: 'resolved', title: 'Incident resolved', description: 'All systems operational' }
    ]
  },
  {
    id: 'inc-002',
    title: 'API Gateway Memory Leak',
    severity: 'high',
    status: 'resolved',
    startTime: '2024-01-14T09:15:00Z',
    endTime: '2024-01-14T10:30:00Z',
    duration: '1h 15m',
    affectedServices: ['api-gateway'],
    rootCause: 'Memory leak in request parsing middleware when handling malformed JSON payloads',
    events: [
      { time: '09:15:00', type: 'detection', title: 'Memory usage warning', description: 'API gateway memory at 80%' },
      { time: '09:30:00', type: 'alert', title: 'Critical threshold', description: 'Memory usage exceeded 90%' },
      { time: '09:45:00', type: 'investigation', title: 'Heap dump analysis', description: 'Memory leak identified in JSON parser' },
      { time: '10:00:00', type: 'mitigation', title: 'Rolling restart', description: 'Gateway pods restarted' },
      { time: '10:30:00', type: 'resolved', title: 'Incident resolved', description: 'Memory usage stabilized' }
    ]
  },
  {
    id: 'inc-003',
    title: 'Payment API Timeout Errors',
    severity: 'medium',
    status: 'investigating',
    startTime: '2024-01-15T16:00:00Z',
    endTime: null,
    duration: 'Ongoing',
    affectedServices: ['payment-api'],
    rootCause: null,
    events: [
      { time: '16:00:00', type: 'detection', title: 'Timeout errors detected', description: 'Payment API response times > 30s' },
      { time: '16:05:00', type: 'alert', title: 'Alert triggered', description: 'Error rate exceeded threshold' },
      { time: '16:15:00', type: 'investigation', title: 'Investigation started', description: 'Checking downstream dependencies' }
    ]
  }
];

const EventIcon = ({ type }) => {
  const icons = {
    detection: <Activity className="w-4 h-4" />,
    alert: <AlertTriangle className="w-4 h-4" />,
    impact: <Zap className="w-4 h-4" />,
    escalation: <AlertCircle className="w-4 h-4" />,
    investigation: <Server className="w-4 h-4" />,
    mitigation: <Database className="w-4 h-4" />,
    recovery: <Activity className="w-4 h-4" />,
    resolved: <CheckCircle className="w-4 h-4" />
  };
  return icons[type] || <Clock className="w-4 h-4" />;
};

const eventColors = {
  detection: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  alert: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  impact: 'bg-red-500/20 text-red-400 border-red-500/30',
  escalation: 'bg-red-500/20 text-red-400 border-red-500/30',
  investigation: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  mitigation: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  recovery: 'bg-green-500/20 text-green-400 border-green-500/30',
  resolved: 'bg-green-500/20 text-green-400 border-green-500/30'
};

const TimelineEvent = ({ event, index, isLast }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8"
    >
      {/* Vertical line */}
      {!isLast && (
        <motion.div 
          initial={{ height: 0 }}
          animate={isInView ? { height: '100%' } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
          className="absolute left-[11px] top-6 w-px bg-gradient-to-b from-white/10 to-transparent"
        />
      )}
      
      {/* Icon */}
      <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ${eventColors[event.type]} border`}>
        <EventIcon type={event.type} />
      </div>

      {/* Content */}
      <div className="pb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-xs text-white/30">{event.time}</span>
          <span className="text-sm font-medium text-white/80">{event.title}</span>
        </div>
        <p className="text-sm text-white/40">{event.description}</p>
      </div>
    </motion.div>
  );
};

const IncidentCard = ({ incident, isExpanded, onToggle }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const severityColors = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    high: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  };

  const statusColors = {
    resolved: 'bg-green-500/10 text-green-400',
    investigating: 'bg-amber-500/10 text-amber-400',
    monitoring: 'bg-blue-500/10 text-blue-400'
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-[#0D0D0F] border border-white/[0.06] rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-white/[0.01] transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${severityColors[incident.severity]}`}>
                {incident.severity.toUpperCase()}
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[incident.status]}`}>
                {incident.status === 'resolved' ? (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3" />
                    Resolved
                  </span>
                ) : incident.status === 'investigating' ? (
                  <span className="flex items-center gap-1.5">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Clock className="w-3 h-3" />
                    </motion.div>
                    Investigating
                  </span>
                ) : (
                  incident.status
                )}
              </span>
            </div>
            <h3 className="text-lg font-medium text-white/90 mb-2">{incident.title}</h3>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {incident.duration}
              </span>
              <span>{incident.affectedServices.length} services affected</span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2"
          >
            <ChevronDown className="w-5 h-5 text-white/30" />
          </motion.div>
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
          >
            <div className="border-t border-white/[0.06]">
              {/* Affected services */}
              <div className="p-6 border-b border-white/[0.04]">
                <span className="text-xs text-white/30 uppercase tracking-wider mb-3 block">Affected Services</span>
                <div className="flex flex-wrap gap-2">
                  {incident.affectedServices.map(service => (
                    <span key={service} className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white/60 font-mono">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Root cause */}
              {incident.rootCause && (
                <div className="p-6 border-b border-white/[0.04]">
                  <span className="text-xs text-white/30 uppercase tracking-wider mb-3 block">Root Cause</span>
                  <p className="text-sm text-white/60">{incident.rootCause}</p>
                </div>
              )}

              {/* Timeline */}
              <div className="p-6">
                <span className="text-xs text-white/30 uppercase tracking-wider mb-6 block">Event Timeline</span>
                <div className="mt-4">
                  {incident.events.map((event, index) => (
                    <TimelineEvent 
                      key={index} 
                      event={event} 
                      index={index}
                      isLast={index === incident.events.length - 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function IncidentTimeline() {
  const [expandedIncident, setExpandedIncident] = useState(incidents[0].id);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredIncidents = incidents.filter(inc => 
    statusFilter === 'all' || inc.status === statusFilter
  );

  const stats = {
    total: incidents.length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
    active: incidents.filter(i => i.status !== 'resolved').length,
    critical: incidents.filter(i => i.severity === 'critical').length
  };

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
              <Link to={createPageUrl('IncidentTimeline')} className="text-sm text-white">Incidents</Link>
              <Link to={createPageUrl('Insights')} className="text-sm text-white/40 hover:text-white/70 transition-colors">Insights</Link>
              <Link to={createPageUrl('Settings')} className="text-sm text-white/40 hover:text-white/70 transition-colors">Settings</Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tight mb-2">Incident Timeline</h1>
          <p className="text-white/40">Track and analyze system incidents over time.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5"
          >
            <span className="text-xs text-white/30 uppercase tracking-wider block mb-2">Total</span>
            <span className="text-2xl font-light text-white">{stats.total}</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5"
          >
            <span className="text-xs text-white/30 uppercase tracking-wider block mb-2">Active</span>
            <span className="text-2xl font-light text-amber-400">{stats.active}</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5"
          >
            <span className="text-xs text-white/30 uppercase tracking-wider block mb-2">Resolved</span>
            <span className="text-2xl font-light text-green-400">{stats.resolved}</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5"
          >
            <span className="text-xs text-white/30 uppercase tracking-wider block mb-2">Critical</span>
            <span className="text-2xl font-light text-red-400">{stats.critical}</span>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          {['all', 'investigating', 'resolved'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Incidents */}
        <div className="space-y-4">
          {filteredIncidents.map(incident => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              isExpanded={expandedIncident === incident.id}
              onToggle={() => setExpandedIncident(expandedIncident === incident.id ? null : incident.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}