import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Shield, Lock, Eye, Key, FileText } from 'lucide-react';

const Feature = ({ icon: Icon, title, desc }) => (
    <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:bg-white/[0.04] transition-colors">
        <Icon className="w-8 h-8 text-cyan-400 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
    </div>
);

export default function Security() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-20">
       <div className="max-w-6xl mx-auto">
          <Link to={createPageUrl('Landing')} className="text-white/40 hover:text-white transition-colors mb-12 block font-mono">
              &lt; BACK
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
              <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-6 border border-cyan-500/20">
                      <Shield className="w-3 h-3" />
                      Defense Grid Active
                  </div>
                  <h1 className="text-6xl font-light tracking-tight mb-8">
                      Security at the <br/><span className="text-cyan-400 font-bold">Molecular Level.</span>
                  </h1>
                  <p className="text-xl text-white/50 leading-relaxed">
                      We treat your data like it's our own oxygen. Our diverse defense layers ensure complete isolation, encryption, and integrity.
                  </p>
              </div>
              <div className="relative">
                  {/* Mock Hologram */}
                  <div className="absolute inset-0 bg-cyan-500/5 blur-3xl rounded-full" />
                  <div className="relative border border-cyan-500/30 rounded-2xl p-8 bg-black/50 backdrop-blur-sm">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                          <span className="text-xs font-mono text-cyan-400">STATUS</span>
                          <span className="text-xs font-mono text-green-400">SECURE</span>
                      </div>
                      <div className="space-y-3 font-mono text-sm text-cyan-200/60">
                          <div className="flex justify-between"><span>Encryption</span><span>AES-256-GCM</span></div>
                          <div className="flex justify-between"><span>TLS Version</span><span>1.3</span></div>
                          <div className="flex justify-between"><span>Compliance</span><span>SOC2 Type II</span></div>
                          <div className="flex justify-between"><span>Pen Test</span><span>Passed (Oct 2024)</span></div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
              <Feature icon={Lock} title="Zero Trust" desc="We assume breach and verify every request. No IP allowances, no implicit trust." />
              <Feature icon={Eye} title="Audit Logging" desc="Every action in the system is immutably logged and searchable for 7 years." />
              <Feature icon={Key} title="Key Management" desc="We use hardware security modules (HSM) to manage master encryption keys." />
              <Feature icon={FileText} title="Compliance" desc="Fully compliant with GDPR, CCPA, and HIPAA requirements." />
          </div>
          
          <div className="text-center border-t border-white/10 pt-12">
              <p className="text-white/40 text-sm mb-4">Want to report a vulnerability?</p>
              <a href="#" className="font-mono text-cyan-400 hover:text-cyan-300 underline">Get our PGP Key</a>
          </div>
       </div>
    </div>
  );
}
