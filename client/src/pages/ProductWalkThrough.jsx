import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Terminal, 
  ArrowRight, 
  Database, 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';

const steps = [
  {
    id: 'ingest',
    number: '01',
    title: 'Ingest',
    subtitle: 'Capture everything.',
    description: 'Stream logs from any source—containers, servers, cloud services, applications. Our collectors handle millions of events per second with zero configuration.',
    icon: Database,
    visual: 'ingest'
  },
  {
    id: 'analyze',
    number: '02',
    title: 'Analyze',
    subtitle: 'Structure chaos.',
    description: 'Automatic parsing extracts fields, identifies patterns, and indexes content in real-time. No schema definitions, no regex rules.',
    icon: Brain,
    visual: 'analyze'
  },
  {
    id: 'detect',
    number: '03',
    title: 'Detect',
    subtitle: 'Spot anomalies.',
    description: 'Machine learning models establish baselines and surface deviations the moment they occur. False positives are eliminated through behavioral analysis.',
    icon: AlertTriangle,
    visual: 'detect'
  },
  {
    id: 'predict',
    number: '04',
    title: 'Predict',
    subtitle: 'See ahead.',
    description: 'Trend analysis and forecasting models identify issues hours before they impact users. Capacity planning becomes proactive, not reactive.',
    icon: TrendingUp,
    visual: 'predict'
  },
  {
    id: 'resolve',
    number: '05',
    title: 'Resolve',
    subtitle: 'Fix faster.',
    description: 'Automated root cause analysis correlates events across your entire stack. Runbooks trigger automatically. Mean time to resolution drops dramatically.',
    icon: CheckCircle,
    visual: 'resolve'
  }
];

const StepVisual = ({ type, isInView }) => {
  const visuals = {
    ingest: (
      <div className="relative h-64 flex items-center justify-center">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: -100, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: i * 0.15, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute flex items-center gap-3"
            style={{ top: `${20 + i * 12}%` }}
          >
            <div className="w-2 h-2 rounded-full bg-cyan-500/60" />
            <motion.div 
              className="h-px bg-gradient-to-r from-cyan-500/60 to-transparent"
              initial={{ width: 0 }}
              animate={isInView ? { width: 150 + i * 30 } : {}}
              transition={{ delay: i * 0.15 + 0.3, duration: 0.6 }}
            />
            <div className="font-mono text-xs text-white/30">stream_{i + 1}</div>
          </motion.div>
        ))}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute right-0 w-20 h-20 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center"
        >
          <Database className="w-8 h-8 text-cyan-400/60" strokeWidth={1} />
        </motion.div>
      </div>
    ),
    analyze: (
      <div className="relative h-64 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs space-y-2 text-white/30"
        >
          {[
            '{ "timestamp": "2024-01-15T14:23:01.234Z",',
            '  "level": "error",',
            '  "service": "api-gateway",',
            '  "trace_id": "abc123...",',
            '  "message": "Connection refused" }'
          ].map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              className={i === 1 || i === 4 ? 'text-cyan-400/60' : ''}
            >
              {line}
            </motion.div>
          ))}
        </motion.div>
      </div>
    ),
    detect: (
      <div className="relative h-64 flex items-center justify-center">
        <svg viewBox="0 0 200 100" className="w-full h-32">
          <motion.path
            d="M 0 80 Q 30 80, 50 75 T 100 70 T 150 60 T 180 20 L 200 15"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
          />
          <motion.path
            d="M 0 80 Q 30 80, 50 75 T 100 70 T 150 60 T 180 20 L 200 15"
            fill="none"
            stroke="url(#anomalyGradient)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="anomalyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,217,255,0.3)" />
              <stop offset="70%" stopColor="rgba(0,217,255,0.6)" />
              <stop offset="100%" stopColor="rgba(239,68,68,0.8)" />
            </linearGradient>
          </defs>
          <motion.circle
            cx="180"
            cy="20"
            r="6"
            fill="rgba(239,68,68,0.8)"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: [0, 1.5, 1] } : {}}
            transition={{ delay: 1.5, duration: 0.4 }}
          />
        </svg>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="absolute bottom-4 right-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg"
        >
          <span className="text-xs text-red-400/80 font-mono">ANOMALY DETECTED</span>
        </motion.div>
      </div>
    ),
    predict: (
      <div className="relative h-64 flex items-center justify-center">
        <svg viewBox="0 0 200 100" className="w-full h-32">
          <motion.path
            d="M 0 70 Q 50 65, 80 50 T 130 40"
            fill="none"
            stroke="rgba(0,217,255,0.4)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <motion.path
            d="M 130 40 Q 150 35, 170 25 T 200 10"
            fill="none"
            stroke="rgba(0,217,255,0.2)"
            strokeWidth="2"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ delay: 1, duration: 0.8, ease: "easeInOut" }}
          />
          <motion.circle
            cx="130"
            cy="40"
            r="4"
            fill="rgba(0,217,255,0.6)"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 1, duration: 0.3 }}
          />
        </svg>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-4 left-4 text-xs text-white/40"
        >
          <span className="text-cyan-400/60">Forecast:</span> Capacity threshold in 6h
        </motion.div>
      </div>
    ),
    resolve: (
      <div className="relative h-64 flex items-center justify-center">
        <div className="space-y-4">
          {[
            { status: 'done', text: 'Anomaly detected' },
            { status: 'done', text: 'Root cause identified' },
            { status: 'done', text: 'Runbook triggered' },
            { status: 'active', text: 'Resolving...' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <motion.div 
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  item.status === 'done' 
                    ? 'bg-green-500/20 border border-green-500/40' 
                    : 'bg-cyan-500/20 border border-cyan-500/40'
                }`}
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.2, duration: 0.3 }}
              >
                {item.status === 'done' ? (
                  <CheckCircle className="w-3 h-3 text-green-400" />
                ) : (
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-cyan-400"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
              <span className={`text-sm ${item.status === 'done' ? 'text-white/40' : 'text-white/70'}`}>
                {item.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    )
  };

  return visuals[type] || null;
};

const Step = ({ step, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="min-h-screen flex items-center py-32 px-8"
    >
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className={`grid md:grid-cols-2 gap-24 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
          <motion.div 
            style={{ y: index % 2 === 0 ? y : undefined }}
            className={index % 2 === 1 ? 'md:order-2' : ''}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-6xl font-extralight text-white/10">{step.number}</span>
                <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-cyan-400/60" strokeWidth={1.5} />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-3">
                {step.title}
              </h2>
              <p className="text-xl text-white/30 mb-6">{step.subtitle}</p>
              <p className="text-white/50 leading-relaxed max-w-md">
                {step.description}
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className={`relative ${index % 2 === 1 ? 'md:order-1' : ''}`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute -inset-4 bg-gradient-to-b from-white/[0.02] to-transparent rounded-3xl" />
            <div className="relative bg-[#0D0D0F] border border-white/[0.06] rounded-2xl p-8">
              <StepVisual type={step.visual} isInView={isInView} />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default function ProductWalkthrough() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Noise texture */}
      <div className="fixed inset-0 pointer-events-none opacity-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/[0.04]"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Landing')} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
              <Terminal className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-medium tracking-tight">Axiom</span>
          </Link>
          <Link to={createPageUrl('CommandView')}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-white text-black rounded-lg"
            >
              Try it now
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-8 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="text-xs tracking-[0.3em] uppercase text-cyan-400/60 mb-6 block">How it works</span>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
              From noise
              <br />
              <span className="text-white/20">to clarity.</span>
            </h1>
            <p className="text-xl text-white/40 max-w-xl mx-auto">
              Five steps to transform your infrastructure monitoring.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-20"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      {steps.map((step, index) => (
        <Step key={step.id} step={step} index={index} />
      ))}

      {/* CTA */}
      <section className="py-32 px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
              See it in action.
            </h2>
            <p className="text-white/40 mb-10 text-lg">
              Experience the command view with your own infrastructure.
            </p>
            <Link to={createPageUrl('CommandView')}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium text-sm tracking-wide"
              >
                Open Command View
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}