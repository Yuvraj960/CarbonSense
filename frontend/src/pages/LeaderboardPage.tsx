import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { leaderboardApi } from '../services/api';
import type { LeaderboardEntry } from '../types';
import { useAuthStore } from '../store/authStore';
import { Trophy, Star, Zap, TrendingDown } from 'lucide-react';

interface TeamEntry {
  _id: string;
  name: string;
  description: string;
  member_count: number;
  avg_ranking_score: number;
}

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<'individual' | 'team'>('individual');
  const [individual, setIndividual] = useState<LeaderboardEntry[]>([]);
  const [teams, setTeams] = useState<TeamEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([leaderboardApi.individual(), leaderboardApi.team()]).then(([ind, team]) => {
      setIndividual(ind.data.leaderboard);
      setTeams(team.data.leaderboard);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const rankMedal = (i: number) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return `#${i + 1}`;
  };

  return (
    <div className="page-enter min-h-screen p-6" style={{ maxWidth: 800, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-1">Leaderboard</h1>
        <p style={{ color: '#86efac' }}>Ranked by green actions, reduction percentage, and challenge completion</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['individual', 'team'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-6 py-2.5 rounded-full font-semibold transition-all"
            style={{
              background: tab === t ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'rgba(10,31,16,0.6)',
              border: tab === t ? 'none' : '1px solid rgba(34,197,94,0.15)',
              color: tab === t ? 'white' : '#86efac', fontSize: 14,
            }}>
            {t === 'individual' ? '👤 Individual' : '👥 Teams'}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#86efac', padding: 60 }}>Loading rankings...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tab === 'individual' ? (
            individual.map((entry, i) => {
              const isMe = user?._id === entry._id;
              return (
                <motion.div key={entry._id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="glass glass-hover p-4"
                  style={{ border: isMe ? '1px solid rgba(34,197,94,0.5)' : undefined, background: isMe ? 'rgba(34,197,94,0.06)' : undefined }}>
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div style={{ minWidth: 40, textAlign: 'center', fontSize: i < 3 ? 24 : 16, fontWeight: 700, color: i < 3 ? '#fbbf24' : '#86efac' }}>
                      {rankMedal(i)}
                    </div>
                    {/* Avatar */}
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white' }}>
                      {entry.name[0].toUpperCase()}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <p className="font-semibold" style={{ color: '#f0fdf4' }}>{entry.name}</p>
                        {isMe && <span className="badge badge-green" style={{ fontSize: 11 }}>You</span>}
                      </div>
                      <p style={{ color: '#86efac', fontSize: 12 }}>Level {entry.level} • Best streak: {entry.streak_best} days</p>
                    </div>
                    {/* Stats */}
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: '#4ade80', fontWeight: 700 }}>{entry.ranking_score} pts</p>
                      <p style={{ color: '#86efac', fontSize: 12 }}>{entry.eco_points} eco pts</p>
                    </div>
                    {/* Carbon */}
                    {entry.latest_carbon && (
                      <div style={{ textAlign: 'right', minWidth: 80 }}>
                        <p style={{ color: '#fbbf24', fontSize: 13, fontWeight: 600 }}>
                          <TrendingDown size={12} style={{ display: 'inline' }} /> {entry.latest_carbon.toFixed(0)} kg
                        </p>
                        <p style={{ color: '#86efac', fontSize: 11 }}>CO₂/month</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            teams.map((team, i) => (
              <motion.div key={team._id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="glass glass-hover p-4">
                <div className="flex items-center gap-4">
                  <div style={{ minWidth: 40, textAlign: 'center', fontSize: i < 3 ? 24 : 16, fontWeight: 700, color: i < 3 ? '#fbbf24' : '#86efac' }}>
                    {rankMedal(i)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="font-semibold" style={{ color: '#f0fdf4' }}>{team.name}</p>
                    <p style={{ color: '#86efac', fontSize: 12 }}>{team.member_count} members • {team.description || 'A sustainable team'}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#4ade80', fontWeight: 700 }}>{team.avg_ranking_score} avg pts</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
          {((tab === 'individual' && individual.length === 0) || (tab === 'team' && teams.length === 0)) && (
            <div className="glass p-12 text-center">
              <p style={{ fontSize: 40, marginBottom: 12 }}>🌱</p>
              <p style={{ color: '#86efac' }}>No entries yet. Be the first!</p>
            </div>
          )}
        </div>
      )}

      {/* Scoring explanation */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="glass p-4 mt-8">
        <p style={{ color: '#86efac', fontSize: 12, textAlign: 'center' }}>
          📊 Ranking Score = (Carbon Reduction% × 0.5) + (Actions × 2) + (Challenges × 10) — Rewarding effort, not privilege
        </p>
      </motion.div>
    </div>
  );
}
