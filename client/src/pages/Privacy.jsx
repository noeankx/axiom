import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-8 md:p-20 font-light">
       <div className="max-w-3xl mx-auto">
          <Link to={createPageUrl('Landing')} className="text-white/40 hover:text-white transition-colors mb-12 block">
              &larr; Back to Home
          </Link>
          
          <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-8">
              <Shield className="w-8 h-8 text-cyan-400" />
          </div>

          <h1 className="text-5xl mb-12 tracking-tight">Privacy Protocol <span className="text-cyan-400">v4.0</span></h1>
          
          <div className="space-y-12 text-white/60 leading-relaxed text-lg">
             <section>
                 <h2 className="text-2xl text-white mb-4">1. Data Ingestion & Encryption</h2>
                 <p>All logs transmitted to Axiom are encrypted effectively at rest and in transit using AES-256-GCM. We employ zero-knowledge architecture where applicable.</p>
             </section>
             
             <section>
                 <h2 className="text-2xl text-white mb-4">2. PII Redaction</h2>
                 <p>Our Neural Core automatically detects and redacts Personally Identifiable Information (PII) before it hits our storage layer. This includes credit card numbers, SSNs, and email addresses.</p>
             </section>

             <section>
                 <h2 className="text-2xl text-white mb-4">3. Retention Policy</h2>
                 <p>Data is retained according to your plan (7 to 365 days). Upon expiration, data is cryptographically shredded and irrecoverable.</p>
             </section>
          </div>
       </div>
    </div>
  );
}
