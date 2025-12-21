import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Terminal, Shield, Zap, Clock, ArrowRight, CheckCircle, Smartphone, Globe } from 'lucide-react';

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

export default function WhyAxiom() {
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-cyan-500/20 selection:text-cyan-200 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 backdrop-blur-sm border-b border-white/[0.02]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to={createPageUrl('Landing')} className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Terminal className="w-4 h-4 text-black" strokeWidth={2.5} />
                 </div>
                 <span className="text-lg font-medium tracking-tight">Axiom</span>
            </Link>
            <Link to={createPageUrl('CommandView')}>
              <button className="px-5 py-2 text-sm font-medium bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
                Dashboard
              </button>
            </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-8 overflow-hidden">
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium"
          >
            Why Choose Axiom?
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-light tracking-tight leading-[0.9] mb-8"
          >
            Legacy tools<br />
            <span className="text-white/20">are slowing you down.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white/40 max-w-2xl mx-auto mb-12"
          >
            Traditional logging platforms were built for static servers, not dynamic cloud infrastructure. You need speed, intelligence, and clarity.
          </motion.p>
        </div>
      </section>

      {/* The Problem Grid */}
      <section className="py-20 px-8 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
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

      {/* Impact Stats */}
      <section className="py-32 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16">
          <StatItem value="10x" label="Faster Queries" delay={0} />
          <StatItem value="40%" label="Cost Reduction" delay={0.2} />
          <StatItem value="0ms" label="Ingest Latency" delay={0.4} />
        </div>
      </section>

      {/* Comparison Table */}
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

      {/* CTA */}
      <section className="py-40 text-center px-8 relative overflow-hidden">
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
        >
            <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-8">
                Ready to upgrade?
            </h2>
            <Link to={createPageUrl('CommandView')}>
                <button className="px-12 py-5 bg-white text-black text-lg font-medium rounded-full hover:bg-cyan-50 transition-colors">
                    Get Started Now
                </button>
            </Link>
        </motion.div>
      </section>

    </div>
  );
}
