import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { teamsApi } from '../services/api';
import type { Team } from '../types';
import { useAuthStore } from '../store/authStore';
import { Users, Plus, LogIn, Copy, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TeamsPage() {
  const { user, fetchMe } = useAuthStore();
  const [teams, setTeams] = useState<Team[]>([]);
  const [myTeam, setMyTeam] = useState<any>(null);
  const [mode, setMode] = useState<'browse' | 'create' | 'join'>('browse');
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    teamsApi.list().then(res => setTeams(res.data.teams));
    if (user?.team_id) {
      teamsApi.getTeam(user.team_id as string).then(res => setMyTeam(res.data));
    }
  }, [user?.team_id]);

  const createTeam = async () => {
    if (!newTeamName.trim()) { toast.error('Team name required'); return; }
    setLoading(true);
    try {
      const res = await teamsApi.create({ name: newTeamName, description: newTeamDesc });
      await fetchMe();
      setMyTeam({ team: res.data.team });
      toast.success('Team created! 🎉');
      setMode('browse');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error creating team');
    } finally { setLoading(false); }
  };

  const joinTeam = async () => {
    if (!inviteCode.trim()) { toast.error('Enter invite code'); return; }
    setLoading(true);
    try {
      const res = await teamsApi.join(inviteCode.toUpperCase());
      await fetchMe();
      setMyTeam({ team: res.data.team });
      toast.success('Joined team! Welcome aboard 🌿');
      setMode('browse');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid invite code');
    } finally { setLoading(false); }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Invite code copied!');
  };

  return (
    <div className="page-enter min-h-screen p-6" style={{ maxWidth: 900, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-1">Teams</h1>
        <p style={{ color: '#86efac' }}>Compete with friends and colleagues to reduce collective carbon footprint</p>
      </motion.div>

      {/* My Team Card */}
      {myTeam && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="glass p-6 mb-8" style={{ borderColor: 'rgba(34,197,94,0.4)' }}>
          <div className="flex items-center gap-3 mb-4">
            <Crown size={22} color="#fbbf24" />
            <h2 className="text-xl font-bold" style={{ color: '#f0fdf4' }}>Your Team: {myTeam.team?.name}</h2>
          </div>
          {myTeam.team?.description && <p style={{ color: '#86efac', marginBottom: 12 }}>{myTeam.team.description}</p>}
          <div className="flex flex-wrap gap-6 mb-4">
            <div>
              <p style={{ color: '#86efac', fontSize: 12 }}>Members</p>
              <p className="text-2xl font-bold gradient-text">{myTeam.team?.members?.length || 0}</p>
            </div>
            {myTeam.teamCarbonScore && (
              <div>
                <p style={{ color: '#86efac', fontSize: 12 }}>Avg Carbon Score</p>
                <p className="text-2xl font-bold" style={{ color: '#fbbf24' }}>{myTeam.teamCarbonScore.toFixed(1)} kg</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span style={{ color: '#86efac', fontSize: 13 }}>Invite Code:</span>
            <code style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', padding: '4px 12px', borderRadius: 6, fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>
              {myTeam.team?.invite_code}
            </code>
            <button onClick={() => copyCode(myTeam.team?.invite_code)} style={{ color: '#86efac', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Copy size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      {!user?.team_id && (
        <div className="flex gap-3 mb-8">
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => setMode('create')}
            className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Create Team
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => setMode('join')}
            className="btn-secondary flex items-center gap-2">
            <LogIn size={16} /> Join by Code
          </motion.button>
        </div>
      )}

      {/* Create / Join Forms */}
      {mode === 'create' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 mb-8">
          <h3 className="font-bold text-lg mb-4" style={{ color: '#f0fdf4' }}>Create New Team</h3>
          <input className="input-dark mb-3" placeholder="Team name" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} />
          <textarea className="input-dark mb-4" placeholder="Description (optional)" value={newTeamDesc} onChange={e => setNewTeamDesc(e.target.value)}
            style={{ resize: 'none', height: 80 }} />
          <div className="flex gap-3">
            <button className="btn-primary" onClick={createTeam} disabled={loading}>{loading ? 'Creating...' : 'Create Team'}</button>
            <button className="btn-secondary" onClick={() => setMode('browse')}>Cancel</button>
          </div>
        </motion.div>
      )}

      {mode === 'join' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 mb-8">
          <h3 className="font-bold text-lg mb-4" style={{ color: '#f0fdf4' }}>Join Team by Invite Code</h3>
          <input className="input-dark mb-4" placeholder="Enter 6-character invite code (e.g. ABC123)"
            value={inviteCode} onChange={e => setInviteCode(e.target.value.toUpperCase())} maxLength={6} />
          <div className="flex gap-3">
            <button className="btn-primary" onClick={joinTeam} disabled={loading}>{loading ? 'Joining...' : 'Join Team'}</button>
            <button className="btn-secondary" onClick={() => setMode('browse')}>Cancel</button>
          </div>
        </motion.div>
      )}

      {/* Teams List */}
      <h2 className="font-bold text-lg mb-4" style={{ color: '#f0fdf4' }}>All Teams</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {teams.map((team, i) => (
          <motion.div key={team._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass glass-hover p-4">
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                🌿
              </div>
              <div>
                <p className="font-semibold" style={{ color: '#f0fdf4' }}>{team.name}</p>
                <p style={{ color: '#86efac', fontSize: 12 }}>{(team.members as any[])?.length || 0} members</p>
              </div>
            </div>
            {team.description && <p style={{ color: '#86efac', fontSize: 13 }}>{team.description}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
