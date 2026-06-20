import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { aiApi } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Send, Bot, Sparkles, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message { role: 'user' | 'coach'; content: string; time: string; }

export default function AICoachPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<{ report: string; stats: any } | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [tab, setTab] = useState<'chat' | 'report'>('chat');

  useEffect(() => {
    // Initial greeting
    setMessages([{
      role: 'coach',
      content: `Hey ${user?.name?.split(' ')[0] || 'there'}! 🌿 I'm EcoSage, your personal sustainability coach. I can help you understand your carbon footprint and suggest realistic ways to reduce it. What would you like to know?`,
      time: new Date().toLocaleTimeString(),
    }]);
  }, [user?.name]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input, time: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await aiApi.getCoach(input);
      setMessages(prev => [...prev, { role: 'coach', content: res.data.advice, time: new Date().toLocaleTimeString() }]);
    } catch {
      toast.error('EcoSage is unavailable right now. Please try again.');
      setMessages(prev => [...prev, {
        role: 'coach',
        content: 'I\'m having trouble connecting right now. Please try again in a moment! 🌱',
        time: new Date().toLocaleTimeString(),
      }]);
    } finally { setLoading(false); }
  };

  const fetchReport = async () => {
    setLoadingReport(true);
    try {
      const res = await aiApi.getWeeklyReport();
      setReport(res.data);
    } catch { toast.error('Could not generate report'); }
    finally { setLoadingReport(false); }
  };

  const quickPrompts = [
    'What\'s my biggest carbon source?',
    'Give me a tip for this week',
    'How can I reduce food emissions?',
    'Benefits of switching to metro?',
  ];

  return (
    <div className="page-enter min-h-screen p-6" style={{ maxWidth: 800, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={22} color="white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">EcoSage</h1>
            <p style={{ color: '#22c55e', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              AI Sustainability Coach • Powered by Gemini
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['chat', 'report'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); if (t === 'report' && !report) fetchReport(); }}
            className="px-5 py-2 rounded-full font-medium transition-all text-sm"
            style={{
              background: tab === t ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'transparent',
              border: tab === t ? 'none' : '1px solid rgba(34,197,94,0.15)',
              color: tab === t ? 'white' : '#86efac',
            }}>
            {t === 'chat' ? '💬 Chat' : '📊 Weekly Report'}
          </button>
        ))}
      </div>

      {tab === 'chat' ? (
        <>
          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quickPrompts.map(p => (
              <button key={p} onClick={() => { setInput(p); }} style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80', padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(34,197,94,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(34,197,94,0.08)')}>
                {p}
              </button>
            ))}
          </div>

          {/* Chat Window */}
          <div className="glass p-4 mb-4" style={{ height: 420, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 10 }}>
                {msg.role === 'coach' && (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={16} color="white" />
                  </div>
                )}
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'rgba(15,46,23,0.8)',
                  border: msg.role === 'coach' ? '1px solid rgba(34,197,94,0.2)' : 'none',
                  color: '#f0fdf4', fontSize: 14, lineHeight: 1.6,
                }}>
                  {msg.content}
                  <p style={{ color: msg.role === 'user' ? 'rgba(255,255,255,0.6)' : '#4ade8060', fontSize: 10, marginTop: 4 }}>{msg.time}</p>
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={16} color="white" />
                </div>
                <div style={{ background: 'rgba(15,46,23,0.8)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '16px 16px 16px 4px', padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map(j => (
                      <motion.div key={j} animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, delay: j * 0.15, duration: 0.6 }}
                        style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: 10 }}>
            <input className="input-dark" placeholder="Ask EcoSage anything about sustainability..."
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()} style={{ flex: 1 }} />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={sendMessage}
              className="btn-primary" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Send size={16} />
            </motion.button>
          </div>
        </>
      ) : (
        /* Weekly Report Tab */
        <div>
          {loadingReport ? (
            <div className="glass p-12 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <RefreshCw size={36} color="#22c55e" style={{ margin: '0 auto 16px' }} />
              </motion.div>
              <p style={{ color: '#86efac' }}>Generating your weekly report with AI...</p>
            </div>
          ) : report ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="glass p-6 mb-4" style={{ borderColor: 'rgba(34,197,94,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Sparkles size={20} color="#fbbf24" />
                  <h2 className="font-bold text-lg" style={{ color: '#f0fdf4' }}>Your Weekly Summary</h2>
                </div>
                <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
                  <div className="glass p-3" style={{ minWidth: 120 }}>
                    <p style={{ color: '#86efac', fontSize: 12 }}>Actions Logged</p>
                    <p className="text-2xl font-bold gradient-text">{report.stats?.actionsCount || 0}</p>
                  </div>
                  <div className="glass p-3" style={{ minWidth: 120 }}>
                    <p style={{ color: '#86efac', fontSize: 12 }}>CO₂ Saved</p>
                    <p className="text-2xl font-bold" style={{ color: '#4ade80' }}>{report.stats?.carbonSaved?.toFixed(1) || 0} kg</p>
                  </div>
                </div>
                <div style={{ background: 'rgba(10,31,16,0.6)', borderRadius: 12, padding: 16, border: '1px solid rgba(34,197,94,0.1)' }}>
                  <p style={{ color: '#f0fdf4', lineHeight: 1.8, fontSize: 14, whiteSpace: 'pre-line' }}>{report.report}</p>
                </div>
              </div>
              <button onClick={fetchReport} className="btn-secondary w-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <RefreshCw size={14} /> Refresh Report
              </button>
            </motion.div>
          ) : (
            <div className="glass p-12 text-center">
              <p style={{ fontSize: 40, marginBottom: 12 }}>📊</p>
              <button onClick={fetchReport} className="btn-primary">Generate Weekly Report</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
