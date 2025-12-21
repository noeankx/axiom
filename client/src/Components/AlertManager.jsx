import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Trash2, X, CheckSquare, AlertTriangle } from 'lucide-react';

const AlertManager = ({ onClose, rules = [], onAddRule, onRemoveRule }) => {
  const [newRule, setNewRule] = useState({
      name: '',
      field: 'level',
      operator: '==',
      value: 'ERROR',
      severity: 'HIGH'
  });

  const handleSubmit = (e) => {
      e.preventDefault();
      if (!newRule.name) return;
      onAddRule({ ...newRule, id: Date.now() });
      setNewRule({ name: '', field: 'level', operator: '==', value: 'ERROR', severity: 'HIGH' });
  };

  return (
    <>
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        />
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-[#0A0A0B] border border-white/[0.1] rounded-2xl shadow-2xl z-[100] overflow-hidden flex flex-col max-h-[80vh]"
        >
            <div className="p-6 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <Bell className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-medium text-white">Alert Rules</h2>
                        <p className="text-sm text-white/40">Configure automatic incident triggers.</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X className="w-5 h-5 text-white/40" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Create New Rule */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                    <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-cyan-400" /> New Alert Rule
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-white/40 mb-1.5 ml-1">Rule Name</label>
                                <input 
                                    value={newRule.name}
                                    onChange={e => setNewRule({...newRule, name: e.target.value})}
                                    placeholder="e.g., Payment Gateway Failures"
                                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                                />
                            </div>
                             <div>
                                <label className="block text-xs text-white/40 mb-1.5 ml-1">Severity</label>
                                <select 
                                    value={newRule.severity}
                                    onChange={e => setNewRule({...newRule, severity: e.target.value})}
                                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                                >
                                    <option value="HIGH">High (Critical)</option>
                                    <option value="MEDIUM">Medium (Warning)</option>
                                    <option value="LOW">Low (Info)</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/5">
                            <span className="text-sm text-white/60 font-mono">IF</span>
                            <select 
                                value={newRule.field}
                                onChange={e => setNewRule({...newRule, field: e.target.value})}
                                className="bg-[#050505] border border-white/10 rounded px-2 py-1 text-xs text-white"
                            >
                                <option value="level">Log Level</option>
                                <option value="service">Service Name</option>
                                <option value="message">Message Body</option>
                            </select>
                            <span className="text-sm text-white/60 font-mono">IS</span>
                            <select 
                                value={newRule.operator}
                                onChange={e => setNewRule({...newRule, operator: e.target.value})}
                                className="bg-[#050505] border border-white/10 rounded px-2 py-1 text-xs text-white"
                            >
                                <option value="==">Equal To</option>
                                <option value="includes">Contains</option>
                                <option value="!=">Not Equal To</option>
                            </select>
                            <input 
                                value={newRule.value}
                                onChange={e => setNewRule({...newRule, value: e.target.value})}
                                placeholder="Value..."
                                className="flex-1 bg-[#050505] border border-white/10 rounded px-2 py-1 text-xs text-white"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button 
                                type="submit"
                                disabled={!newRule.name}
                                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                                Create Rule
                            </button>
                        </div>
                    </form>
                </div>

                {/* Active Rules List */}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-white/60 px-1">Active Rules ({rules.length})</h3>
                    {rules.length === 0 && (
                        <div className="text-center py-8 text-white/20 text-sm border border-dashed border-white/10 rounded-xl">
                            No active rules configured.
                        </div>
                    )}
                    {rules.map(rule => (
                        <div key={rule.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:border-white/10 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${
                                    rule.severity === 'HIGH' ? 'bg-red-500' :
                                    rule.severity === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-500'
                                }`} />
                                <div>
                                    <div className="text-sm font-medium text-white">{rule.name}</div>
                                    <div className="text-xs text-white/40 font-mono mt-0.5">
                                        IF {rule.field} {rule.operator} "{rule.value}"
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => onRemoveRule(rule.id)}
                                className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    </>
  );
};

export default AlertManager;
