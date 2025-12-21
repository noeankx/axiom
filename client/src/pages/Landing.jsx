import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, Terminal, Activity, Shield, Zap, ChevronRight, Play, Brain, Clock, Smartphone, Globe, CheckCircle } from 'lucide-react';

const MagneticButton = ({ children, className }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  }

  const { x, y } = position;
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const NoiseBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50" />
    <motion.div 
      className="absolute inset-0"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,217,255,0.03) 0%, transparent 50%)'
      }}
      animate={{
        opacity: [0.3, 0.5, 0.3]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </div>
);

const WarpGrid = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      setMouse({ 
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none perspective-1000">
      <motion.div 
        className="absolute inset-[-50%] opacity-[0.15]"
        style={{
            backgroundImage: `
                linear-gradient(rgba(0, 217, 255, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 217, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: `rotateX(60deg) translateZ(-100px)`,
        }}
        animate={{
            rotateX: 60 + mouse.y * 5,
            rotateZ: mouse.x * 5,
            y: mouse.y * 50
        }}
        transition={{ type: "spring", damping: 20 }}
      />
    </div>
  );
};

const FeatureSection = ({ icon: Icon, title, description, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="group"
    >
      <div className="border-t border-white/[0.06] pt-8">
        <div className="flex items-start gap-6">
          <div className="w-10 h-10 rounded-lg bg-white/[0.03] flex items-center justify-center border border-white/[0.06] group-hover:border-cyan-500/20 group-hover:bg-cyan-500/5 transition-all duration-500">
            <Icon className="w-5 h-5 text-white/40 group-hover:text-cyan-400 transition-colors duration-500" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white/90 mb-3">{title}</h3>
            <p className="text-white/40 leading-relaxed text-[15px]">{description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PricingTier = ({ name, price, description, features, highlighted, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative p-8 ${highlighted ? 'bg-white/[0.02]' : ''}`}
    >
      {highlighted && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      )}
      <div className="mb-6">
        <span className="text-xs tracking-[0.2em] uppercase text-white/30">{name}</span>
      </div>
      <div className="mb-6">
        <span className="text-4xl font-light text-white">{price}</span>
        {price !== 'Custom' && <span className="text-white/30 ml-1">/mo</span>}
      </div>
      <p className="text-white/40 text-sm mb-8 leading-relaxed">{description}</p>
      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-white/50">
            <div className="w-1 h-1 rounded-full bg-cyan-500/60" />
            {feature}
          </li>
        ))}
      </ul>
      <MagneticButton className="w-full">
        <button
          className={`mt-8 w-full py-3 text-sm font-medium tracking-wide transition-all duration-300 rounded ${
            highlighted 
              ? 'bg-white text-black hover:bg-white/90' 
              : 'border border-white/10 text-white/70 hover:border-white/20 hover:text-white'
          }`}
        >
          Get Started
        </button>
      </MagneticButton>
    </motion.div>
  );
};

const FeatureBlock = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors"
  >
    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 text-cyan-400">
      <Icon className="w-6 h-6" strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-medium text-white mb-3">{title}</h3>
    <p className="text-white/40 leading-relaxed">{desc}</p>
  </motion.div>
);

const StatItem = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8, type: "spring" }}
    className="text-center"
  >
    <div className="text-5xl md:text-7xl font-light text-white mb-2 tracking-tighter">{value}</div>
    <div className="text-sm text-white/30 uppercase tracking-widest">{label}</div>
  </motion.div>
);

export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState(0);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-cycle features for a "live" feel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Terminal,
      title: "Intelligent Ingestion",
      description: "Stream millions of log entries per second. Our engine parses, indexes, and structures data in real-time without configuration."
    },
    {
      icon: Activity,
      title: "Anomaly Detection",
      description: "Machine learning models trained on infrastructure patterns identify issues before they cascade into incidents."
    },
    {
      icon: Shield,
      title: "Root Cause Analysis",
      description: "Automatic correlation across services, timestamps, and error patterns. Understand why, not just what."
    },
    {
      icon: Zap,
      title: "Predictive Alerts",
      description: "Forecasting models analyze trends and warn you hours before capacity issues or failures occur."
    }
  ];

  const pricing = [
    {
      name: "Starter",
      price: "$49",
      description: "For small teams getting started with log intelligence.",
      features: ["5GB daily ingestion", "7-day retention", "Basic anomaly detection", "Email alerts"]
    },
    {
      name: "Pro",
      price: "$199",
      description: "For growing teams that need deeper insights.",
      features: ["50GB daily ingestion", "30-day retention", "Advanced ML models", "Slack & PagerDuty", "API access"],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For organizations with complex infrastructure needs.",
      features: ["Unlimited ingestion", "Custom retention", "Dedicated support", "SSO & RBAC", "On-premise option"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-200">
      <NoiseBackground />
      <NoiseBackground />
      <WarpGrid />
      
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Terminal className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-medium tracking-tight">Axiom</span>
          </div>
          <div className="hidden md:flex items-center gap-12 bg-white/[0.03] px-8 py-2 rounded-full border border-white/[0.06] backdrop-blur-md">
            <Link to={createPageUrl('ProductWalkthrough')} className="text-sm text-white/50 hover:text-white transition-colors duration-300">Product</Link>
            <Link to={createPageUrl('Insights')} className="text-sm text-white/50 hover:text-white transition-colors duration-300">Insights</Link>
            <a href="#pricing" className="text-sm text-white/50 hover:text-white transition-colors duration-300">Pricing</a>
          </div>
          <Link to={createPageUrl('CommandView')}>
            <MagneticButton>
                <button
                className="px-5 py-2.5 text-sm font-medium bg-white text-black rounded-lg hover:bg-white/90 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                Open Dashboard
                </button>
            </MagneticButton>
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen flex items-center justify-center px-8 pt-20"
      >
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div 
               className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-8"
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.2, duration: 0.5 }}
            >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                v2.0 Now Available
            </motion.div>
            <motion.h1 
              className="text-[clamp(3rem,12vw,8rem)] font-light tracking-tight leading-[0.9] mb-8 mix-blend-screen relative group"
              style={{
                textShadow: '0 0 40px rgba(0,217,255,0.1)'
              }}
            >
              <span className="block group-hover:translate-x-1 transition-transform duration-100">Logs,</span>
              <span className="text-white/20 block group-hover:-translate-x-1 transition-transform duration-100 group-hover:text-cyan-400/20">understood.</span>
            </motion.h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-lg md:text-xl text-white/40 max-w-xl mx-auto mb-12 font-light"
          >
            Real-time system intelligence for modern infrastructure.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to={createPageUrl('CommandView')}>
              <MagneticButton>
                <button
                    className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-medium text-sm tracking-wide hover:bg-cyan-50 transition-colors duration-300 rounded-full"
                >
                    Start Monitoring
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </MagneticButton>
            </Link>
            
            <Link to={createPageUrl('AIAnalysisDemo')}>
                <MagneticButton>
                <button
                    className="flex items-center gap-3 px-8 py-4 bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium text-sm tracking-wide hover:bg-purple-500/20 hover:border-purple-500/40 transition-all duration-300 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                >
                    <Brain className="w-4 h-4" />
                    Try AI Lab
                </button>
              </MagneticButton>
            </Link>

            <Link to={createPageUrl('ProductWalkthrough')}>
                <MagneticButton>
                <button
                    className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white/70 font-medium text-sm tracking-wide hover:border-white/20 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-full"
                >
                    <Play className="w-3 h-3 fill-current" />
                    How it Works
                </button>
              </MagneticButton>
            </Link>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center p-1.5 backdrop-blur-sm"
          >
            <motion.div className="w-1 h-2 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Product Preview 3D Tilt */}
      <section className="relative py-32 px-8 perspective-1000">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, rotateX: 20, y: 100 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative will-change-transform transform-gpu"
            style={{
                transformStyle: 'preserve-3d'
            }}
          >
            <div className="absolute -inset-1 bg-gradient-to-b from-cyan-500/20 to-transparent rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-[#111113] rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-cyan-900/10">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.01]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <div className="text-[10px] font-mono text-white/20">LIVE STREAM</div>
              </div>
              <div className="p-6 font-mono text-sm">
                <div className="space-y-2">
                  {[
                    { time: '14:23:01.234', level: 'INFO', msg: 'Request processed successfully', color: 'text-white/40' },
                    { time: '14:23:01.456', level: 'WARN', msg: 'Memory usage at 78%', color: 'text-amber-400/70' },
                    { time: '14:23:01.789', level: 'INFO', msg: 'Connection pool: 45/100 active', color: 'text-white/40' },
                    { time: '14:23:02.012', level: 'ERROR', msg: 'Database timeout on query #4521', color: 'text-red-400/70' },
                    { time: '14:23:02.234', level: 'INFO', msg: 'Retry attempt 1/3 initiated', color: 'text-white/40' },
                    { time: '14:23:02.451', level: 'INFO', msg: 'Retry attempt 1/3 success', color: 'text-green-400/70' },
                    { time: '14:23:03.112', level: 'DEBUG', msg: 'Cache invalidated for key: users:123', color: 'text-purple-400/50' },
                  ].map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="flex items-center gap-4 hover:bg-white/[0.03] p-1 rounded transition-colors"
                    >
                      <span className="text-white/20">{log.time}</span>
                      <span className={`w-12 ${log.color}`}>{log.level}</span>
                      <span className="text-white/60">{log.msg}</span>
                    </motion.div>
                  ))}
                  <motion.div
                     initial={{ opacity: 0 }}
                     whileInView={{ opacity: 1 }}
                     transition={{ delay: 1, duration: 0.5 }}
                     className="h-4 w-2 bg-cyan-400 animate-pulse"
                  />
                </div>
              </div>
            </div>
            
            {/* Floating badges */}
            <motion.div 
                className="absolute -right-12 -top-12 bg-[#0A0A0B] border border-white/10 p-4 rounded-xl shadow-xl z-20"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                animate={{ y: [0, -10, 0] }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-mono text-white/60">ANOMALY DETECTED</span>
                </div>
                <div className="text-2xl font-light text-white">98.2%</div>
                <div className="text-xs text-red-400 mt-1">Confidence Score</div>
            </motion.div>

             <motion.div 
                className="absolute -left-8 -bottom-8 bg-[#0A0A0B] border border-white/10 p-4 rounded-xl shadow-xl z-20"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono text-white/60">INGESTION RATE</span>
                </div>
                <div className="text-2xl font-light text-white">42k/s</div>
                <div className="text-xs text-green-400 mt-1">+12% vs avg</div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-32 px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-cyan-400/60 mb-4 block">Capabilities</span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              Intelligence at
              <br />
              <span className="text-white/30">every layer.</span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <FeatureSection key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-32 px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-20 text-center"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-cyan-400/60 mb-4 block">Pricing</span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              Simple, predictable
              <br />
              <span className="text-white/30">pricing.</span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            {pricing.map((tier, index) => (
              <PricingTier key={index} {...tier} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* The Problem Grid (Merged from WhyAxiom) */}
      <section className="py-20 px-8 bg-white/[0.02] relative">
         <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B] to-transparent pointer-events-none" />
         <div className="max-w-6xl mx-auto relative z-10">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-light tracking-tight mb-4">Why the switch?</h2>
              <p className="text-white/40">Legacy tools weren't built for this era.</p>
           </div>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureBlock 
                icon={Clock}
                title="Real-time, for real"
                desc="Most tools have a 5-minute delay. Axiom processes logs in milliseconds, so you see errors the moment they happen."
                delay={0}
            />
            <FeatureBlock 
                icon={Zap}
                title="Zero Config"
                desc="Stop writing regex parsers. Our AI automatically structures your logs, identifying JSON, XML, and reckless print statements."
                delay={0.1}
            />
            <FeatureBlock 
                icon={Shield}
                title="Security First"
                desc="Automatic PII redaction. We identify credit cards, emails, and secrets before they ever hit the disk."
                delay={0.2}
            />
            <FeatureBlock 
                icon={Smartphone}
                title="Mobile Ready"
                desc="Monitor your infrastructure from anywhere. Our PWA interface is optimized for triage on the go."
                delay={0.3}
            />
            <FeatureBlock 
                icon={Globe}
                title="Global Edge"
                desc="Ingest data from 35+ regions. We automatically route your logs to the nearest node for lowest latency."
                delay={0.4}
            />
            <FeatureBlock 
                icon={Terminal}
                title="Developer Centric"
                desc="CLI tools, VS Code extensions, and a powerful API. Built by engineers, for engineers."
                delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Impact Stats (Merged from WhyAxiom) */}
      <section className="py-32 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16">
          <StatItem value="10x" label="Faster Queries" delay={0} />
          <StatItem value="40%" label="Cost Reduction" delay={0.2} />
          <StatItem value="0ms" label="Ingest Latency" delay={0.4} />
        </div>
      </section>

      {/* Comparison Table (Merged from WhyAxiom) */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto bg-[#0D0D0F] border border-white/[0.06] rounded-3xl overflow-hidden p-8 md:p-12">
            <h2 className="text-3xl font-light mb-12 text-center">The Axiom Difference</h2>
            
            <div className="space-y-6">
                {[
                    { feature: "Ingest Speed", axiom: "< 50ms", others: "2-5 mins" },
                    { feature: "Data Retention", axiom: "Unlimited", others: "Capped" },
                    { feature: "Query Language", axiom: "Natural Language (AI)", others: "Proprietary SQL" },
                    { feature: "Pricing Model", axiom: "Flat Rate", others: "Per GB / Spike" },
                ].map((row, i) => (
                    <div key={i} className="grid grid-cols-3 items-center py-4 border-b border-white/[0.04]">
                        <div className="text-white/40 font-medium">{row.feature}</div>
                        <div className="text-cyan-400 font-medium flex items-center gap-2">
                             <CheckCircle className="w-4 h-4" />
                             {row.axiom}
                        </div>
                        <div className="text-white/20">{row.others}</div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative py-32 px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-6">
              Ready to see clearly?
            </h2>
            <p className="text-white/40 mb-10">
              Start monitoring in under 5 minutes. No credit card required.
            </p>
            <Link to={createPageUrl('CommandView')}>
              <MagneticButton className="inline-block">
                <button
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium text-sm tracking-wide rounded-full"
                >
                    Get Started Free
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </MagneticButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded flex items-center justify-center">
              <Terminal className="w-3 h-3 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-medium">Axiom</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-white/30">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/60 transition-colors">Status</a>
          </div>
          <p className="text-sm text-white/20">© 2024 Axiom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}