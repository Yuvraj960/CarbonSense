import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { LayoutDashboard, Leaf, Zap, Trophy, Users, Bot, Globe, User, LogOut, Menu, X } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/actions', label: 'Actions', icon: Zap },
  { path: '/challenges', label: 'Challenges', icon: Leaf },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/teams', label: 'Teams', icon: Users },
  { path: '/coach', label: 'AI Coach', icon: Bot },
  { path: '/ecoworld', label: 'EcoWorld', icon: Globe },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(3,15,7,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(34,197,94,0.12)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', height: 64 }}>
          {/* Logo */}
          <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>🌿</span>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 18 }} className="gradient-text">CarbonSense</span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', gap: 4, marginLeft: 32, flex: 1 }} className="hidden md:flex">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                  <motion.div whileHover={{ backgroundColor: 'rgba(34,197,94,0.1)' }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
                      background: active ? 'rgba(34,197,94,0.15)' : 'transparent',
                      color: active ? '#4ade80' : '#86efac', fontSize: 13, fontWeight: active ? 600 : 400,
                      border: active ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent',
                      transition: 'all 0.2s',
                    }}>
                    <Icon size={14} />
                    {item.label}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* User Area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ textAlign: 'right' }} className="hidden md:block">
                <p style={{ color: '#f0fdf4', fontSize: 13, fontWeight: 600 }}>{user?.name}</p>
                <p style={{ color: '#86efac', fontSize: 11 }}>Lv.{user?.level} • 🔥{user?.streak_current}</p>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: 14 }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#86efac', padding: 6 }}>
              <LogOut size={16} />
            </button>
            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#86efac' }}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden', borderTop: '1px solid rgba(34,197,94,0.12)', background: 'rgba(3,15,7,0.95)' }}>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {navItems.map(item => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: active ? 'rgba(34,197,94,0.15)' : 'transparent', color: active ? '#4ade80' : '#86efac', fontSize: 14 }}>
                        <Icon size={16} /> {item.label}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div style={{ height: 64 }} /> {/* Spacer */}
    </>
  );
}
