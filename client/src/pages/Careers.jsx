import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, Star, Hexagon } from 'lucide-react';

const JobRow = ({ title, dept, type }) => (
    <div className="group flex items-center justify-between p-6 border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors cursor-pointer">
        <div>
            <h3 className="text-xl font-medium text-white mb-1 group-hover:text-cyan-400 transition-colors">{title}</h3>
            <div className="flex items-center gap-3 text-sm text-white/40">
                <span>{dept}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span>{type}</span>
            </div>
        </div>
        <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-cyan-400 transform group-hover:translate-x-1 transition-all" />
    </div>
);

export default function Careers() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-8 md:p-20">
       <div className="max-w-4xl mx-auto">
          <Link to={createPageUrl('Landing')} className="text-white/40 hover:text-white transition-colors mb-12 block font-mono">
              &larr; HOME
          </Link>

          <div className="relative mb-24 text-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none" />
              <Hexagon className="w-16 h-16 text-cyan-500 mx-auto mb-6" />
              <h1 className="text-6xl font-bold mb-6 tracking-tight">JOIN THE FLEET</h1>
              <p className="text-xl text-white/60 max-w-xl mx-auto">
                  We are looking for pilots, architects, and visionaries to help us map the digital frontier.
              </p>
          </div>

          <div className="space-y-12">
              <div>
                  <h2 className="text-sm font-mono text-cyan-400 mb-6 uppercase tracking-wider">Engineering</h2>
                  <div className="border border-white/10 rounded-2xl bg-white/[0.01] overflow-hidden">
                      <JobRow title="Senior React Architect" dept="Frontend" type="Remote" />
                      <JobRow title="Distributed Systems Engineer" dept="Backend" type="NY / Remote" />
                      <JobRow title="WebGL Specialist" dept="Graphics" type="Remote" />
                  </div>
              </div>

              <div>
                  <h2 className="text-sm font-mono text-purple-400 mb-6 uppercase tracking-wider">Design & Ops</h2>
                  <div className="border border-white/10 rounded-2xl bg-white/[0.01] overflow-hidden">
                      <JobRow title="Product Designer (UI/UX)" dept="Design" type="Remote" />
                      <JobRow title="Developer Advocate" dept="Community" type="London" />
                  </div>
              </div>
          </div>

          <div className="mt-24 p-12 bg-gradient-to-br from-cyan-900/20 to-purple-900/20 rounded-3xl text-center border border-white/10">
              <Star className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Don't see your role?</h3>
              <p className="text-white/50 mb-8">We are always looking for exceptional talent.</p>
              <button className="px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-cyan-400 hover:scale-105 transition-all">
                  Send Open Application
              </button>
          </div>
       </div>
    </div>
  );
}
