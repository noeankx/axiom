import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Activity, Volume2 } from 'lucide-react';

export default function NeuralVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  
  // Audio Visualizer Mock
  const [bars, setBars] = useState(new Array(20).fill(10));

  useEffect(() => {
    if (isListening || isSpeaking) {
        const interval = setInterval(() => {
            setBars(bars.map(() => Math.random() * 40 + 10));
        }, 100);
        return () => clearInterval(interval);
    } else {
        setBars(new Array(20).fill(5));
    }
  }, [isListening, isSpeaking]);

  const toggleListening = () => {
    if (isListening) {
        setIsListening(false);
        // Simulate processing
        handleCommand("Status Report"); 
    } else {
        setIsListening(true);
        setTranscript("Listening...");
        // In a real app, SpeechRecognition would start here
        setTimeout(() => {
             setIsListening(false);
             handleCommand("Show system health");
        }, 3000);
    }
  };

  const handleCommand = (cmd) => {
    setTranscript(cmd);
    setIsSpeaking(true);
    
    // Simulate thinking/response
    setTimeout(() => {
        const text = "System operating within normal parameters. Ingestion rate at 98%. No active anomalies detected.";
        setResponse(text);
        
        // Text to Speech
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            // Try to find a "computer" voice
            const voices = window.speechSynthesis.getVoices();
            console.log(voices); // For debugging
            const sciFiVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Microsoft David')) || voices[0];
            utterance.voice = sciFiVoice;
            utterance.pitch = 0.8;
            utterance.rate = 1.1;
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        } else {
             setTimeout(() => setIsSpeaking(false), 3000);
        }
    }, 1000);
  };

  return (
    <div className="w-full bg-[#0D0D0F] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                 isSpeaking ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white/40'
             }`}>
                {isSpeaking ? <Volume2 className="w-5 h-5 animate-pulse" /> : <Activity className="w-5 h-5" />}
             </div>
             <div>
                <h3 className="text-sm font-medium text-white">Neural Core</h3>
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                    <span className="text-xs text-white/40 font-mono">{isListening ? 'LISTENING' : 'STANDBY'}</span>
                </div>
             </div>
        </div>
        <button 
            onClick={toggleListening}
            className={`p-3 rounded-full transition-all ${
                isListening 
                    ? 'bg-red-500/20 text-red-400 scale-110 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
            }`}
        >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>

      {/* Visualizer */}
      <div className="h-16 flex items-end justify-between gap-1 mb-4 px-2">
         {bars.map((height, i) => (
             <motion.div
                key={i}
                animate={{ height: `${height}%` }}
                className={`w-1 rounded-full ${isSpeaking ? 'bg-cyan-400' : 'bg-white/10'}`}
             />
         ))}
      </div>

      <div className="space-y-2 font-mono text-sm h-20">
         {transcript && (
             <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-white/60">
                {`> ${transcript}`}
             </motion.div>
         )}
         {response && (
             <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-cyan-400">
                {`>> ${response}`}
             </motion.div>
         )}
      </div>

    </div>
  );
}
