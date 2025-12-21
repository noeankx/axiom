import React from 'react';
import { Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-8 md:p-20 font-light">
       <div className="max-w-3xl mx-auto">
          <Link to={createPageUrl('Landing')} className="text-white/40 hover:text-white transition-colors mb-12 block">
              &larr; Back to Home
          </Link>
          
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8">
              <Scale className="w-8 h-8 text-purple-400" />
          </div>

          <h1 className="text-5xl mb-12 tracking-tight">Terms of Service</h1>
          
          <div className="space-y-12 text-white/60 leading-relaxed text-lg">
             <section>
                 <h2 className="text-2xl text-white mb-4">1. Usage Limits</h2>
                 <p>API abuse, including denial of service attacks or excessive polling (&gt;10k req/s without enterprise plan), may result in temporary suspension of your API keys.</p>
             </section>
             
             <section>
                 <h2 className="text-2xl text-white mb-4">2. Service Level Agreement (SLA)</h2>
                 <p>We guarantee 99.99% uptime for the Ingestion API. Credits are issued for downtime exceeding 5 minutes per month.</p>
             </section>

             <section>
                 <h2 className="text-2xl text-white mb-4">3. Liability</h2>
                 <p>Axiom is not liable for data loss due to client-side misconfiguration or compromised API keys.</p>
             </section>
          </div>
       </div>
    </div>
  );
}
