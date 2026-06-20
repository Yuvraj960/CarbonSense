import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { challengesApi } from '../services/api';
import type { Challenge } from '../types';
import { getCategoryColor } from '../utils/carbonUtils';
import { Trophy, Zap, Star, Users, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'joined' | 'completed'>('all');

  useEffect(() => {
    challengesApi.getAll().then(res => {
      setChallenges(res.data.challenges);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const join = async (id: string) => {
    setJoining(id);
    try {
      await challengesApi.join(id);
      setChallenges(prev => prev.map(c => c._id === id ? { ...c, is_joined: true } : c));
      toast.success('Challenge joined! 🌿 Good luck!', { duration: 3000 });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error joining challenge');
    } finally {
      setJoining(null);
    }
  };

  const filtered = challenges.filter(c => {
    if (filter === 'joined') return c.is_joined && !c.user_completed;
    if (filter === 'completed') return c.user_completed;
    return true;
  });

  const completedCount = challenges.filter(c => c.user_completed).length;
  const joinedCount = challenges.filter(c => c.is_joined && !c.user_completed).length;

  return (
    <div className="page-enter min-h-screen p-6" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-1">Challenges</h1>
        <p style={{ color: '#86efac' }}>Complete challenges to earn badges, XP, and climb the leaderboard</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass p-5 mb-6 flex flex-wrap gap-6">
        <div className="flex items-center gap-3">
          <Trophy size={28} color="#fbbf24" />
          <div>
            <p style={{ color: '#86efac', fontSize: 12 }}>Completed</p>
            <p className="text-2xl font-bold" style={{ color: '#fbbf24' }}>{completedCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Zap size={28} color="#4ade80" />
          <div>
            <p style={{ color: '#86efac', fontSize: 12 }}>Active</p>
            <p className="text-2xl font-bold" style={{ color: '#4ade80' }}>{joinedCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Star size={28} color="#a78bfa" />
          <div>
            <p style={{ color: '#86efac', fontSize: 12 }}>Available</p>
            <p className="text-2xl font-bold" style={{ color: '#a78bfa' }}>{challenges.length}</p>
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'joined', 'completed'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-5 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              background: filter === f ? 'rgba(34,197,94,0.2)' : 'transparent',
              border: filter === f ? '1px solid #22c55e' : '1px solid rgba(34,197,94,0.15)',
              color: filter === f ? '#4ade80' : '#86efac',
            }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#86efac', padding: 60 }}>Loading challenges...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map((challenge, i) => {
            const progressPercent = challenge.target_actions > 0
              ? Math.min(100, Math.round((challenge.user_progress / challenge.target_actions) * 100))
              : 0;
            return (
              <motion.div key={challenge._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="glass glass-hover p-5 relative overflow-hidden">
                {challenge.user_completed && (
                  <div className="absolute top-0 right-0 p-3">
                    <span style={{ fontSize: 24 }}>🏆</span>
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <span style={{ fontSize: 36 }}>{challenge.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: '#f0fdf4' }}>{challenge.title}</h3>
                    <span className="badge" style={{ background: `${getCategoryColor(challenge.category)}18`, color: getCategoryColor(challenge.category), border: `1px solid ${getCategoryColor(challenge.category)}40`, fontSize: 11 }}>
                      {challenge.category}
                    </span>
                  </div>
                </div>

                <p style={{ color: '#86efac', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{challenge.description}</p>

                {/* Rewards */}
                <div className="flex gap-4 mb-4">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fbbf24', fontSize: 13 }}>
                    <Zap size={13} />+{challenge.xp_reward} XP
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#4ade80', fontSize: 13 }}>
                    <Star size={13} />+{challenge.eco_points_reward} pts
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#86efac', fontSize: 13 }}>
                    <Clock size={13} />{challenge.duration_days} days
                  </div>
                </div>

                {/* Progress */}
                {challenge.is_joined && (
                  <div className="mb-4">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#86efac', marginBottom: 6 }}>
                      <span>Progress</span>
                      <span>{challenge.user_progress} / {challenge.target_actions} actions</span>
                    </div>
                    <div className="progress-bar">
                      <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.8 }} />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {challenge.user_completed ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#22c55e', fontWeight: 600, fontSize: 14 }}>
                    <CheckCircle size={18} /> Challenge Completed!
                  </div>
                ) : challenge.is_joined ? (
                  <div style={{ color: '#86efac', fontSize: 13 }}>✅ Joined — log actions to make progress</div>
                ) : (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => join(challenge._id)}
                    disabled={joining === challenge._id}
                    className="btn-primary w-full" style={{ fontSize: 14 }}>
                    {joining === challenge._id ? 'Joining...' : 'Join Challenge'}
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <div className="glass p-12 text-center">
          <p style={{ fontSize: 40, marginBottom: 12 }}>🎯</p>
          <p style={{ color: '#86efac' }}>No challenges in this category yet.</p>
        </div>
      )}
    </div>
  );
}
