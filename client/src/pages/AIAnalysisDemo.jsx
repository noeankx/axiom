import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Terminal, 
  ArrowRight, 
  Cpu, 
  Split, 
  Binary, 
  Brain, 
  AlertTriangle,
  CheckCircle,
  Play,
  RotateCcw,
  Eye,
  Info
} from 'lucide-react';

const PipelineStage = ({ icon: Icon, title, status, delay, details, showDetails }) => {
  return (
    <div className="relative group">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5 }}
        className={`w-32 h-32 rounded-2xl border flex flex-col items-center justify-center gap-2 relative z-10 transition-colors duration-500 ${
          status === 'active' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)]' :
          status === 'completed' ? 'bg-green-500/10 border-green-500 text-green-400' :
          'bg-white/5 border-white/10 text-white/20'
        }`}
      >
        <Icon className="w-8 h-8" strokeWidth={1.5} />
        <span className="text-[10px] font-mono uppercase tracking-wider">{title}</span>
        
        {status === 'active' && (
          <div className="absolute inset-0 rounded-2xl border border-cyan-500/50 animate-ping" />
        )}
      </motion.div>

       {/* Power User Tooltip */}
       <AnimatePresence>
        {showDetails && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 bg-black/90 border border-white/10 rounded-lg p-3 z-50 backdrop-blur-md"
            >
                <div className="text-[10px] font-mono text-cyan-400 mb-1">UNDER THE HOOD</div>
                <p className="text-xs text-white/60 leading-tight">{details}</p>
            </motion.div>
        )}
       </AnimatePresence>
    </div>
  );
};

const AnalysisResult = ({ stage, data, showDetails }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[#0D0D0F] border border-white/[0.06] rounded-xl p-6 font-mono text-sm w-full h-full overflow-hidden relative"
    >
      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
        <span className="text-[10px] text-white/40 uppercase tracking-widest">{stage}</span>
        {showDetails && <span className="text-[10px] text-cyan-500 uppercase flex items-center gap-1"><Binary className="w-3 h-3"/> RAW VIEW</span>}
      </div>
      
      <div className="space-y-1 font-mono text-xs md:text-sm">
        {data.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`${line.className || "text-white/60"} ${showDetails ? 'opacity-100' : 'opacity-90'}`}
          >
            {line.text}
            {showDetails && line.detail && (
                <span className="ml-4 text-white/20 text-[10px]">// {line.detail}</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default function AIAnalysisDemo() {
  const [searchParams] = useSearchParams();
  const initialLog = searchParams.get('log');
  const [inputLog, setInputLog] = useState(initialLog || 'Connection timeout to DB-01 after 3000ms');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0); 
  const [showDetails, setShowDetails] = useState(false); // Educational Mode

  useEffect(() => {
    if (initialLog) {
        runAnalysis();
    }
  }, [initialLog]);

  const runAnalysis = () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setCurrentStage(1);

    // Simulate pipeline progression
    setTimeout(() => setCurrentStage(2), 2500);
    setTimeout(() => setCurrentStage(3), 5000);
    setTimeout(() => setCurrentStage(4), 7500);
    setTimeout(() => setIsAnalyzing(false), 8500);
  };

  const getStageData = () => {
    switch (currentStage) {
      case 1: // Tokenize
        return showDetails ? [
            { text: "[", className: "text-white/40" },
            { text: '  2045,  // "Connection"', className: "text-cyan-400 pl-4", detail: "Token ID: 2045 (Noun)" },
            { text: '  9921,  // "timeout"', className: "text-cyan-400 pl-4", detail: "Token ID: 9921 (Error Keyword)" },
            { text: '  102,   // "to"', className: "text-purple-400 pl-4", detail: "Stopword" },
            { text: '  5512,  // "DB-01"', className: "text-yellow-400 pl-4", detail: "Entity: Database" },
            { text: "]", className: "text-white/40" }
        ] : [
          { text: "[", className: "text-white/40" },
          { text: '  "Connection",', className: "text-cyan-400 pl-4" },
          { text: '  "timeout",', className: "text-cyan-400 pl-4" },
          { text: '  "to",', className: "text-purple-400 pl-4" },
          { text: '  "DB-01",', className: "text-yellow-400 pl-4" },
          { text: "]", className: "text-white/40" }
        ];
      case 2: // Vectorize
        return showDetails ? [
            { text: "Tensor<Float32>[768]:", className: "text-white/40 mb-2" },
            { text: "[ 0.0211, -0.4532,  0.1124, ... ]", className: "text-green-400/80", detail: "Dimension 0-2" },
            { text: "[ 0.8812,  0.0012, -0.1123, ... ]", className: "text-green-400/80", detail: "Dimension 3-5" },
            { text: "...", className: "text-white/20" },
            { text: "Euclidean Distance to 'Database Fail': 0.12", className: "text-purple-400 mt-2" }
        ] : [
          { text: "Embedding Tensor <1x768>:", className: "text-white/40 mb-2" },
          { text: "[ 0.021, -0.453,  0.112, ... ]", className: "text-green-400/80" },
          { text: "Context: Unexpected Latency", className: "text-white/40 mt-2" },
          { text: "Entity: Database", className: "text-white/40" }
        ];
      case 3: // Model output
        return showDetails ? [
            { text: "Inference Result:", className: "text-white/40 mb-2" },
            { text: "Softmax Output:", className: "text-white/60" },
            { text: "  - Anomaly: 0.9821", className: "text-red-400 pl-4" },
            { text: "  - Warning: 0.0122", className: "text-yellow-400 pl-4" },
            { text: "  - Normal:  0.0057", className: "text-green-400 pl-4" },
            { text: "Threshold: 0.85 (PASSED)", className: "text-cyan-400 mt-2" }
        ] : [
          { text: "Analysis Complete", className: "text-white/40 mb-2" },
          { text: "Anomaly Score: 0.92 (High)", className: "text-red-400" },
          { text: "Pattern Match: TimeoutCascade", className: "text-amber-400" },
          { text: "Recommended Action: Scale Up", className: "text-cyan-400" }
        ];
      case 4: // Result
        return [
            { text: "INCIDENT CREATED #4921", className: "text-red-500 font-bold" },
            { text: "----------------------", className: "text-white/20" },
            { text: "Severity: CRITICAL", className: "text-white/80" },
            { text: "Team Notified: @backend-ops", className: "text-white/80" }
        ];
      default:
        return [{ text: "Waiting for input...", className: "text-white/20 italic" }];
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white overflow-hidden selection:bg-cyan-500/20 selection:text-cyan-200">
        {/* Nav */}
        <div className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center pointer-events-none">
            <Link to={createPageUrl('Landing')} className="pointer-events-auto flex items-center gap-2">
                 <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Terminal className="w-4 h-4 text-black" strokeWidth={2.5} />
                 </div>
                 <span className="text-lg font-medium tracking-tight">Axiom <span className="text-white/20 font-light">/ Labs</span></span>
            </Link>
            <div className="flex items-center gap-6 pointer-events-auto">
                 <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                        showDetails ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-white/40 border border-white/10 hover:text-white'
                    }`}
                >
                    <Eye className="w-3 h-3" />
                    {showDetails ? 'Educational Mode: ON' : 'Educational Mode: OFF'}
                 </button>
                 <Link to={createPageUrl('CommandView')}>
                    <button className="text-sm text-white/40 hover:text-white transition-colors">Exit Demo</button>
                 </Link>
            </div>
        </div>

      <div className="max-w-7xl mx-auto px-8 pt-32 pb-20">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-6"
          >
             <Brain className="w-3 h-3" />
             NEURAL ENGINE V2
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">See how it thinks.</h1>
          <p className="text-white/40 max-w-lg mx-auto">
            Input a log message and watch our engine deconstruct, analyze, and classify it in real-time.
            <br/>Enable <span className="text-cyan-400">Educational Mode</span> to see the math.
          </p>
        </div>

        {/* Interactive Area */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Col: Input & Explainer (4 Cols) */}
            <div className="lg:col-span-4 space-y-8">
                 <div className="bg-[#0D0D0F] border border-white/[0.06] rounded-2xl p-1 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] relative">
                        <div className="w-2 h-2 rounded-full bg-red-400/20" />
                        <div className="w-2 h-2 rounded-full bg-yellow-400/20" />
                        <div className="w-2 h-2 rounded-full bg-green-400/20" />
                        <span className="ml-2 text-xs text-white/30 font-mono">input.log</span>
                    </div>
                    <div className="p-4 relative">
                        <textarea 
                            value={inputLog}
                            onChange={(e) => setInputLog(e.target.value)}
                            disabled={isAnalyzing}
                            className="w-full bg-transparent text-white font-mono text-sm focus:outline-none resize-none h-32 placeholder-white/20 leading-relaxed"
                            placeholder="Paste a log entry here..."
                        />
                        <div className="flex justify-end mt-2">
                             <button
                                onClick={runAnalysis}
                                disabled={isAnalyzing}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg ${
                                    isAnalyzing 
                                        ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                             >
                                {isAnalyzing ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                {isAnalyzing ? 'Processing...' : 'Analyze'}
                             </button>
                        </div>
                    </div>
                 </div>

                 {/* Explanation Card */}
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStage}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 min-h-[160px]"
                    >
                        <h3 className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4 text-cyan-400" />
                            {currentStage === 0 && "Ready to Analyze"}
                            {currentStage === 1 && "Stage 1: Tokenization"}
                            {currentStage === 2 && "Stage 2: Vector Embedding"}
                            {currentStage === 3 && "Stage 3: Pattern Matching"}
                            {currentStage === 4 && "Stage 4: Reaction"}
                        </h3>
                        <p className="text-sm text-white/40 leading-relaxed">
                            {currentStage === 0 && "The neural engine is idling. Paste any log line (e.g. error traces, access logs) above to begin the inspection process."}
                            {currentStage === 1 && (
                                showDetails 
                                ? "Technical: We use a BERT-based tokenizer to split the string into integers (tokens) from our vocabulary of 30,000 common infrastructure terms."
                                : "The system reads your text and breaks it down into meaningful chunks, filtering out noise like timestamps and IP addresses."
                            )}
                            {currentStage === 2 && (
                                showDetails
                                ? "Technical: Tokens are projected into a 768-dimensional vector space. We calculate Cosine Similarity against known incident cluster centroids."
                                : "We convert the text into a mathematical representation (a vector). This allows the AI to 'understand' context—knowing that 'slow' and 'latency' are related."
                            )}
                            {currentStage === 3 && (
                                showDetails
                                ? "Technical: A dense neural network classifier (Softmax) assigns probabilities to 50+ classes (Normal, Security, Perf, etc)."
                                : "The model compares the vector against millions of historical patterns to calculate an Anomaly Score."
                            )}
                            {currentStage === 4 && "The system determines the severity based on the score and triggers downstream workflows (PagerDuty, Slack, Jira)."}
                        </p>
                    </motion.div>
                 </AnimatePresence>
            </div>

            {/* Right Col: Visual Pipeline (8 Cols) */}
            <div className="lg:col-span-8 relative">
                {/* Connecting Line */}
                <div className="absolute top-[64px] left-16 right-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10" />

                <div className="grid grid-cols-4 gap-4 mb-8">
                     <PipelineStage 
                        icon={Split} 
                        title="Tokenize" 
                        status={currentStage === 1 ? 'active' : currentStage > 1 ? 'completed' : 'idle'}
                        delay={0}
                        showDetails={showDetails}
                        details="Input string -> [Integer Arrays]. Maps words to ID from vocab."
                     />
                     <PipelineStage 
                        icon={Binary} 
                        title="Vectorize" 
                        status={currentStage === 2 ? 'active' : currentStage > 2 ? 'completed' : 'idle'}
                        delay={0.1}
                        showDetails={showDetails}
                        details="768-dim float32 vector representing semantic meaning."
                     />
                     <PipelineStage 
                        icon={Brain} 
                        title="Model" 
                        status={currentStage === 3 ? 'active' : currentStage > 3 ? 'completed' : 'idle'}
                        delay={0.2}
                        showDetails={showDetails}
                        details="Multi-layer Perceptron (MLP) classifier head."
                     />
                     <PipelineStage 
                        icon={AlertTriangle} 
                        title="Result" 
                        status={currentStage === 4 ? 'active' : currentStage > 4 ? 'completed' : 'idle'}
                        delay={0.3}
                        showDetails={showDetails}
                        details="JSON payload sent to event bus."
                     />
                </div>

                {/* Dynamic Data Window */}
                <div className="h-64 relative">
                    <AnalysisResult 
                        stage={
                            currentStage === 1 ? "TOKENIZER_OUTPUT" :
                            currentStage === 2 ? "VECTOR_PROJECTION" :
                            currentStage === 3 ? "INFERENCE_RESULT" :
                            currentStage === 4 ? "INCIDENT_DETAILS" :
                            "IDLE"
                        }
                        data={getStageData()} 
                        showDetails={showDetails}
                    />
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
