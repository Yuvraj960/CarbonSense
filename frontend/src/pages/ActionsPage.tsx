import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { actionsApi } from '../services/api';
import type { ActionCatalogItem, DailyAction } from '../types';
import { getCategoryIcon, getCategoryColor } from '../utils/carbonUtils';
import { CheckCircle, Zap, Leaf, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const categoryFilters = ['all', 'transport', 'food', 'energy', 'shopping', 'general'];

export default function ActionsPage() {
  const { user, fetchMe } = useAuthStore();
  const [catalog, setCatalog] = useState<ActionCatalogItem[]>([]);
  const [todayActions, setTodayActions] = useState<DailyAction[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [logging, setLogging] = useState<string | null>(null);
  const [justLogged, setJustLogged] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([actionsApi.getCatalog(), actionsApi.getToday()]).then(([cat, today]) => {
      setCatalog(cat.data.actions);
      setTodayActions(today.data.actions);
    });
  }, []);

  const todayKeys = todayActions.map(a => a.action_key);

  const filteredCatalog = catalog.filter(a =>
    activeFilter === 'all' ? true : a.category === activeFilter
  );

  const logAction = async (key: string) => {
    if (todayKeys.includes(key)) { toast('Already logged today!', { icon: '✅' }); return; }
    setLogging(key);
    try {
      const res = await actionsApi.logAction(key);
      setTodayActions(prev => [...prev, res.data.action]);
      setJustLogged(key);
      await fetchMe();
      const action = catalog.find(a => a.key === key);
      toast.success(`+${action?.xp_earned} XP earned! 🌿`, { duration: 3000 });
      setTimeout(() => setJustLogged(null), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error logging action');
    } finally {
      setLogging(null);
    }
  };

  const totalCarbonSaved = todayActions.reduce((sum, a) => sum + a.carbon_saved, 0);

  return (
    <div className="page-enter min-h-screen p-6" style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-1">Daily Green Actions</h1>
        <p style={{ color: '#86efac' }}>Log sustainable choices to earn XP and grow your EcoWorld</p>
      </motion.div>

      {/* Today's Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass p-5 mb-6 flex flex-wrap gap-6">
        <div>
          <p style={{ color: '#86efac', fontSize: 13 }}>Actions Today</p>
          <p className="text-3xl font-bold gradient-text">{todayActions.length}</p>
        </div>
        <div>
          <p style={{ color: '#86efac', fontSize: 13 }}>Carbon Saved Today</p>
          <p className="text-3xl font-bold" style={{ color: '#4ade80' }}>{totalCarbonSaved.toFixed(1)} kg</p>
        </div>
        <div>
          <p style={{ color: '#86efac', fontSize: 13 }}>Current Streak</p>
          <p className="text-3xl font-bold" style={{ color: '#fbbf24' }}>🔥 {user?.streak_current || 0} days</p>
        </div>
        <div>
          <p style={{ color: '#86efac', fontSize: 13 }}>Eco Points</p>
          <p className="text-3xl font-bold" style={{ color: '#a78bfa' }}>🌿 {user?.eco_points || 0}</p>
        </div>
      </motion.div>

      {/* Logged today */}
      {todayActions.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-6">
          <p style={{ color: '#86efac', fontSize: 13, marginBottom: 8 }}>LOGGED TODAY</p>
          <div className="flex flex-wrap gap-2">
            {todayActions.map(a => (
              <span key={a._id} className="badge badge-green">
                <CheckCircle size={12} /> {a.action_name}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categoryFilters.map(cat => (
          <button key={cat} onClick={() => setActiveFilter(cat)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: activeFilter === cat ? 'rgba(34,197,94,0.2)' : 'rgba(10,31,16,0.6)',
              border: activeFilter === cat ? '1px solid #22c55e' : '1px solid rgba(34,197,94,0.15)',
              color: activeFilter === cat ? '#4ade80' : '#86efac',
            }}>
            {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Actions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        <AnimatePresence>
          {filteredCatalog.map((action, i) => {
            const done = todayKeys.includes(action.key);
            const isLogging = logging === action.key;
            const justDone = justLogged === action.key;
            return (
              <motion.div key={action.key}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }}
                className="glass glass-hover p-5 relative overflow-hidden"
                style={{ opacity: done ? 0.75 : 1 }}>
                {done && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle size={20} color="#22c55e" />
                  </div>
                )}
                <div className="flex items-start gap-3 mb-3">
                  <span style={{ fontSize: 28 }}>{action.icon}</span>
                  <div>
                    <p className="font-semibold" style={{ color: '#f0fdf4', lineHeight: 1.3 }}>{action.name}</p>
                    <p style={{ color: '#86efac', fontSize: 12, marginTop: 2 }}>{action.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="badge" style={{ background: `${getCategoryColor(action.category)}18`, color: getCategoryColor(action.category), border: `1px solid ${getCategoryColor(action.category)}40`, fontSize: 11 }}>
                    {action.category}
                  </span>
                  <span style={{ color: '#86efac', fontSize: 12 }}>🌿 -{action.carbon_saved} kg CO₂</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <span style={{ color: '#fbbf24', fontSize: 13, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Zap size={13} />+{action.xp_earned} XP
                    </span>
                    <span style={{ color: '#4ade80', fontSize: 13, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Star size={13} />+{action.eco_points_earned} pts
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: done ? 1 : 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => logAction(action.key)}
                    disabled={done || isLogging}
                    style={{
                      background: done ? 'rgba(34,197,94,0.1)' : 'linear-gradient(135deg,#22c55e,#16a34a)',
                      color: done ? '#4ade80' : 'white',
                      border: done ? '1px solid rgba(34,197,94,0.3)' : 'none',
                      padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: done ? 'default' : 'pointer',
                    }}>
                    {justDone ? '✅ Done!' : done ? 'Logged' : isLogging ? '...' : 'Log It'}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
