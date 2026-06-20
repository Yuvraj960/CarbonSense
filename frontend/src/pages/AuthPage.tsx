import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Leaf, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

type Tab = 'login' | 'register';

/* ─── Input Field Component ──────────────────────────────────────── */
function InputField({
  icon: Icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  showToggle,
  autoComplete,
}: {
  icon: React.ElementType;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  showToggle?: boolean;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  const inputType = showToggle ? (visible ? 'text' : 'password') : type;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>
        {label}
      </label>
      <div className="input-icon-wrapper">
        <div className="icon-left">
          <Icon size={16} />
        </div>
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete || 'off'}
          className={`input-dark${showToggle ? ' has-right' : ''}`}
        />
        {showToggle && (
          <button
            type="button"
            className="icon-right"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Spinner ─────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <svg
      width={17} height={17}
      viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5}
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

/* ─── Main Auth Page ──────────────────────────────────────────────── */
export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuthStore();

  const [tab, setTab] = useState<Tab>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const switchTab = (t: Tab) => {
    setTab(t);
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.error('Please enter your email.'); return; }
    if (!password.trim()) { toast.error('Please enter your password.'); return; }
    if (tab === 'register' && !name.trim()) { toast.error('Please enter your name.'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }

    try {
      if (tab === 'login') {
        await login(email.trim(), password);
        const u = useAuthStore.getState().user;
        toast.success(`Welcome back, ${u?.name ?? ''}! 🌿`);
        navigate('/dashboard');
      } else {
        await register(name.trim(), email.trim(), password);
        const u = useAuthStore.getState().user;
        toast.success(`Welcome to CarbonSense, ${u?.name ?? ''}! 🌿`);
        navigate('/onboarding');
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; error?: string } } };
      const msg =
        e?.response?.data?.message ??
        e?.response?.data?.error ??
        'Something went wrong. Please try again.';
      toast.error(msg);
      useAuthStore.setState({ isLoading: false });
    }
  };

  const formVariants = {
    initial: (dir: number) => ({ x: dir * 28, opacity: 0 }),
    animate: { x: 0, opacity: 1, transition: { duration: 0.28, ease: 'easeOut' as const } },
    exit: (dir: number) => ({ x: -dir * 28, opacity: 0, transition: { duration: 0.18 } }),
  };
  const dir = tab === 'register' ? 1 : -1;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Left panel — branding ── */}
      <div
        className="hidden md:flex"
        style={{
          flex: '0 0 45%',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 56px',
          background: 'rgba(7,26,13,0.5)',
          borderRight: '1px solid rgba(34,197,94,0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: '10%', left: '-15%', width: 380, height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', right: '-10%', width: 280, height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56 }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
            }}>
              <Leaf size={22} color="white" strokeWidth={2.5} />
            </div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: 22,
              background: 'linear-gradient(130deg, #22c55e, #4ade80)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              CarbonSense
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 36, fontWeight: 900, lineHeight: 1.15,
              marginBottom: 18, color: 'var(--text)',
            }}>
              Track carbon.<br />
              <span style={{
                background: 'linear-gradient(130deg, #22c55e, #4ade80)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Earn rewards.
              </span><br />
              Change habits.
            </h1>
            <p style={{ color: 'rgba(134,239,172,0.7)', fontSize: 15, lineHeight: 1.7, maxWidth: 340 }}>
              A gamified sustainability platform that makes your carbon footprint visible,
              manageable, and even rewarding.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 40 }}
          >
            {['🔥 Daily Streaks', '🤖 AI Coach', '🌍 EcoWorld', '🏆 Challenges', '👥 Teams'].map(p => (
              <span
                key={p}
                className="badge badge-green"
                style={{ fontSize: 12, padding: '5px 12px' }}
              >
                {p}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(24px, 6vw, 48px) clamp(20px, 5vw, 56px)',
        minHeight: '100vh',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          {/* Mobile logo */}
          <div className="flex md:hidden" style={{ alignItems: 'center', gap: 10, marginBottom: 36 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Leaf size={18} color="white" strokeWidth={2.5} />
            </div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 18,
              background: 'linear-gradient(130deg, #22c55e, #4ade80)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              CarbonSense
            </span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 6,
            }}>
              {tab === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p style={{ color: 'rgba(134,239,172,0.65)', fontSize: 14 }}>
              {tab === 'login'
                ? 'Sign in to continue your green journey'
                : 'Join thousands making a difference every day'}
            </p>
          </div>

          {/* Tab switcher */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(7,26,13,0.8)',
              border: '1px solid rgba(34,197,94,0.12)',
              borderRadius: 10,
              padding: 4,
              marginBottom: 28,
            }}
          >
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => switchTab(t)}
                style={{
                  flex: 1, position: 'relative', padding: '9px 0',
                  fontSize: 13, fontWeight: 600,
                  borderRadius: 7, border: 'none', cursor: 'pointer',
                  background: 'none',
                  color: tab === t ? '#030f07' : 'rgba(134,239,172,0.65)',
                  transition: 'color 0.2s',
                  zIndex: 1,
                }}
              >
                {tab === t && (
                  <motion.div
                    layoutId="tab-pill"
                    style={{
                      position: 'absolute', inset: 0, borderRadius: 7,
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      zIndex: -1,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.form
              key={tab}
              custom={dir}
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
            >
              {tab === 'register' && (
                <InputField
                  icon={User}
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={setName}
                  placeholder="Alex Green"
                  autoComplete="name"
                />
              )}

              <InputField
                icon={Mail}
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="alex@example.com"
                autoComplete="email"
              />

              <InputField
                icon={Lock}
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder={tab === 'register' ? 'Minimum 6 characters' : 'Your password'}
                showToggle
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              />

              {tab === 'login' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -6 }}>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(134,239,172,0.6)', fontSize: 12, padding: 0 }}
                    onClick={() => toast('Password reset coming soon!', { icon: '🔑' })}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                style={{ width: '100%', marginTop: 6, padding: '13px 0', fontSize: 15, borderRadius: 10 }}
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    <span>{tab === 'login' ? 'Signing in…' : 'Creating account…'}</span>
                  </>
                ) : (
                  <>
                    <span>{tab === 'login' ? 'Sign In' : 'Join CarbonSense'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>

              {tab === 'register' && (
                <p style={{ color: 'rgba(134,239,172,0.45)', fontSize: 12, textAlign: 'center', marginTop: -4 }}>
                  By joining, you agree to help reduce your carbon footprint 🌍
                </p>
              )}
            </motion.form>
          </AnimatePresence>

          {/* Switch link */}
          <div className="divider" style={{ margin: '24px 0' }}>or</div>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(134,239,172,0.6)' }}>
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => switchTab(tab === 'login' ? 'register' : 'login')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#22c55e', fontWeight: 600, fontSize: 14,
                padding: 0, textDecoration: 'none',
              }}
            >
              {tab === 'login' ? 'Create one →' : 'Sign in →'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
