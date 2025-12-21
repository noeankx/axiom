import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Terminal, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette,
  Globe,
  Key,
  Mail,
  Smartphone,
  Clock,
  ChevronRight,
  Check
} from 'lucide-react';
import { Switch } from "@/Components/ui/Switch";

const settingSections = [
  {
    id: 'account',
    title: 'Account',
    icon: User,
    settings: [
      { id: 'email', label: 'Email', value: 'john@company.com', type: 'text' },
      { id: 'name', label: 'Display Name', value: 'John Doe', type: 'text' },
      { id: 'timezone', label: 'Timezone', value: 'UTC-8 (Pacific)', type: 'select' }
    ]
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    settings: [
      { id: 'email_alerts', label: 'Email Alerts', description: 'Receive critical alerts via email', value: true, type: 'toggle' },
      { id: 'slack', label: 'Slack Integration', description: 'Send notifications to Slack channel', value: true, type: 'toggle' },
      { id: 'pagerduty', label: 'PagerDuty', description: 'Route incidents to PagerDuty', value: false, type: 'toggle' },
      { id: 'digest', label: 'Daily Digest', description: 'Receive daily summary at 9:00 AM', value: true, type: 'toggle' }
    ]
  },
  {
    id: 'alerting',
    title: 'Alert Thresholds',
    icon: Clock,
    settings: [
      { id: 'error_threshold', label: 'Error Rate Threshold', value: '2%', type: 'text' },
      { id: 'latency_threshold', label: 'Latency Threshold', value: '500ms', type: 'text' },
      { id: 'memory_threshold', label: 'Memory Threshold', value: '85%', type: 'text' },
      { id: 'cpu_threshold', label: 'CPU Threshold', value: '80%', type: 'text' }
    ]
  },
  {
    id: 'data',
    title: 'Data & Storage',
    icon: Database,
    settings: [
      { id: 'retention', label: 'Log Retention', value: '30 days', type: 'select' },
      { id: 'compression', label: 'Data Compression', description: 'Compress logs older than 7 days', value: true, type: 'toggle' },
      { id: 'export', label: 'Auto Export', description: 'Export logs to S3 bucket', value: false, type: 'toggle' }
    ]
  },
  {
    id: 'security',
    title: 'Security',
    icon: Shield,
    settings: [
      { id: 'mfa', label: 'Two-Factor Authentication', description: 'Require 2FA for all team members', value: true, type: 'toggle' },
      { id: 'sso', label: 'Single Sign-On', description: 'Enable SSO with SAML 2.0', value: false, type: 'toggle' },
      { id: 'audit', label: 'Audit Logging', description: 'Track all user actions', value: true, type: 'toggle' }
    ]
  },
  {
    id: 'api',
    title: 'API',
    icon: Key,
    settings: [
      { id: 'api_key', label: 'API Key', value: 'axm_live_•••••••••••••', type: 'secret' },
      { id: 'rate_limit', label: 'Rate Limit', value: '1000 req/min', type: 'text' },
      { id: 'webhooks', label: 'Webhooks', description: 'Enable webhook notifications', value: true, type: 'toggle' }
    ]
  }
];

const SettingRow = ({ setting, onChange }) => {
  const [value, setValue] = useState(setting.value);

  const handleToggle = (checked) => {
    setValue(checked);
    onChange?.(setting.id, checked);
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-white/[0.04] last:border-0">
      <div className="flex-1">
        <span className="text-sm text-white/80 block">{setting.label}</span>
        {setting.description && (
          <span className="text-xs text-white/40 mt-0.5 block">{setting.description}</span>
        )}
      </div>
      <div className="ml-4">
        {setting.type === 'toggle' ? (
          <Switch 
            checked={value} 
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-cyan-500"
          />
        ) : setting.type === 'secret' ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-white/50">{value}</span>
            <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
              Reveal
            </button>
          </div>
        ) : setting.type === 'select' ? (
          <button className="flex items-center gap-2 text-sm text-white/60 hover:text-white/80 transition-colors">
            {value}
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-sm text-white/60">{value}</span>
        )}
      </div>
    </div>
  );
};

const SettingSection = ({ section, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-[#0D0D0F] border border-white/[0.06] rounded-xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center">
          <section.icon className="w-4 h-4 text-white/40" strokeWidth={1.5} />
        </div>
        <h3 className="text-sm font-medium text-white/80">{section.title}</h3>
      </div>
      <div className="px-6">
        {section.settings.map((setting) => (
          <SettingRow key={setting.id} setting={setting} />
        ))}
      </div>
    </motion.div>
  );
};

export default function Settings() {
  const [activeSection, setActiveSection] = useState('account');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Top bar */}
      <div className="border-b border-white/[0.06] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to={createPageUrl('Landing')} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
                <Terminal className="w-4 h-4 text-black" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-medium tracking-tight">Axiom</span>
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <nav className="flex items-center gap-6">
              <Link to={createPageUrl('CommandView')} className="text-sm text-white/40 hover:text-white/70 transition-colors">Command</Link>
              <Link to={createPageUrl('LogsExplorer')} className="text-sm text-white/40 hover:text-white/70 transition-colors">Logs</Link>
              <Link to={createPageUrl('IncidentTimeline')} className="text-sm text-white/40 hover:text-white/70 transition-colors">Incidents</Link>
              <Link to={createPageUrl('Insights')} className="text-sm text-white/40 hover:text-white/70 transition-colors">Insights</Link>
              <Link to={createPageUrl('Settings')} className="text-sm text-white">Settings</Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-white/[0.06] min-h-[calc(100vh-65px)] p-6">
          <nav className="space-y-1">
            {settingSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  activeSection === section.id
                    ? 'bg-white/[0.05] text-white'
                    : 'text-white/40 hover:text-white/60 hover:bg-white/[0.02]'
                }`}
              >
                <section.icon className="w-4 h-4" strokeWidth={1.5} />
                {section.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-light tracking-tight mb-1">Settings</h1>
              <p className="text-white/40 text-sm">Manage your workspace preferences.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 transition-colors"
            >
              <AnimatePresence mode="wait">
                {saved ? (
                  <motion.span
                    key="saved"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Saved
                  </motion.span>
                ) : (
                  <motion.span
                    key="save"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    Save Changes
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <div className="space-y-6">
            {settingSections
              .filter(section => section.id === activeSection)
              .map((section, index) => (
                <SettingSection key={section.id} section={section} index={index} />
              ))}
          </div>

          {/* Danger zone */}
          {activeSection === 'account' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12 pt-8 border-t border-white/[0.06]"
            >
              <h3 className="text-sm font-medium text-red-400/80 mb-4">Danger Zone</h3>
              <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-white/80 block">Delete Workspace</span>
                    <span className="text-xs text-white/40 mt-0.5 block">
                      Permanently delete this workspace and all associated data.
                    </span>
                  </div>
                  <button className="px-4 py-2 text-sm text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}