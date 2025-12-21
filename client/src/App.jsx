import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Landing from '@/pages/Landing';
import CommandView from '@/pages/CommandView';
import LogsExplorer from '@/pages/LogsExplorer';
import IncidentTimeline from '@/pages/IncidentTimeline';
import Insights from '@/pages/Insights';
import Settings from '@/pages/Settings';
import ProductWalkthrough from '@/pages/ProductWalkThrough';
import AIAnalysisDemo from '@/pages/AIAnalysisDemo';

import WhyAxiom from '@/pages/WhyAxiom';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Status from '@/pages/Status';
import About from '@/pages/About';
import Careers from '@/pages/Careers';
import Security from '@/pages/Security';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/CommandView" element={<CommandView />} />
        <Route path="/LogsExplorer" element={<LogsExplorer />} />
        <Route path="/IncidentTimeline" element={<IncidentTimeline />} />
        <Route path="/Insights" element={<Insights />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/ProductWalkthrough" element={<ProductWalkthrough />} />
        <Route path="/AIAnalysisDemo" element={<AIAnalysisDemo />} />
        <Route path="/Privacy" element={<Privacy />} />
        <Route path="/Terms" element={<Terms />} />
        <Route path="/Status" element={<Status />} />
        {/* Content Expansion */}
        <Route path="/About" element={<About />} />
        <Route path="/Careers" element={<Careers />} />
        <Route path="/Security" element={<Security />} />
        {/* Fallback */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;
