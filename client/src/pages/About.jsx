import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Users, Code, Cpu } from 'lucide-react';

const ProfileCard = ({ name, role, tags, color }) => (
    <div className={`p-6 border border-${color}-500/20 bg-${color}-500/5 rounded-2xl`}>
        <div className="w-16 h-16 rounded-full bg-white/10 mb-4 flex items-center justify-center text-2xl font-mono text-white/50">
            {name.charAt(0)}
        </div>
        <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
        <p className={`text-${color}-400 text-sm mb-4 font-mono`}>{role}</p>
        <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-1 rounded bg-white/5 text-white/40">{tag}</span>
            ))}
        </div>
    </div>
);

export default function About() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-8 md:p-20 relative overflow-hidden">
       {/* Background Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

       <div className="max-w-5xl mx-auto relative z-10">
          <Link to={createPageUrl('Landing')} className="text-white/40 hover:text-white transition-colors mb-12 block font-mono">
              &lt; RETURN_TO_BASE
          </Link>
          
          <header className="mb-20">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                  THE ARCHITECTS
              </h1>
              <p className="text-xl text-white/50 max-w-2xl leading-relaxed">
                  We are a covert collective of engineers, designers, and sentient AIs working to decode the chaotic data streams of the universe.
              </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-full mb-8">
                  <h2 className="text-xs uppercase tracking-[0.3em] text-white/30 border-b border-white/10 pb-4">Personnel Dossiers</h2>
              </div>
              
              <ProfileCard 
                  name="Alex Chen" 
                  role="Lead Engineer" 
                  color="cyan" 
                  tags={['Reactor Core', 'Neural Nets', 'Caffeine']} 
              />
              <ProfileCard 
                  name="Sarah Vance" 
                  role="Design Ops" 
                  color="purple" 
                  tags={['UI/UX', 'Holography', 'Typography']} 
              />
              <ProfileCard 
                  name="Unit 734" 
                  role="AI Sentinel" 
                  color="red" 
                  tags={['Security', 'Pattern Rec', 'Sarcasm']} 
              />
          </div>

          <div className="mt-20 p-8 border border-white/10 rounded-3xl bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-6">
                  <Cpu className="w-8 h-8 text-white/50" />
                  <h3 className="text-2xl font-light">Our Mission Protocol</h3>
              </div>
              <p className="text-lg text-white/60 leading-relaxed">
                  To build interfaces that bridge the gap between human intuition and machine intelligence. We believe that monitoring tools shouldn't just be functional; they should be an extension of the engineer's mind.
              </p>
          </div>
       </div>
    </div>
  );
}
