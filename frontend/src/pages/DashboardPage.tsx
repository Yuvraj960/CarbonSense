import React, { useEffect, useState, useRef } from 'react';
import { motion, animate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  TrendingUp, Leaf, ShoppingBag, Car,
  Lightbulb, ChevronRight, Brain, Globe, Plus,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { assessmentApi, actionsApi } from '../services/api';
import {
  getCarbonRating, getCarbonComparisons, xpToNextLevel,
  getCategoryColor, getCategoryIcon,
} from '../utils/carbonUtils';
import type { CarbonAssessment, DailyAction } from '../types';

/* ─────────────── helpers ─────────────── */
const CATEGORY_META = [
  { key: 'transport', label: 'Transport', Icon: Car },
  { key: 'food',      label: 'Food',      Icon: Leaf },
  { key: 'electricity', label: 'Electric', Icon: Lightbulb },
  { key: 'shopping', label: 'Shopping',  Icon: ShoppingBag },
];

function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);
  useEffect(() => {
    const ctrl = animate(ref.current, value, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
    });
    ref.current = value;
    return () => ctrl.stop();
  }, [value]);
  return <>{display.toFixed(decimals)}</>;
}

/* Animated SVG ring */
function CarbonRing({ score, rating }: { score: number; rating: ReturnType<typeof getCarbonRating> }) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const maxScore = 600;
  const fraction = Math.min(score / maxScore, 1);
  const dashOffset = circumference * (1 - fraction);

  return (
    <svg width="220" height="220" viewBox="0 0 220 220" className="mx-auto">
      <defs>
        <filter id="ringGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* track */}
      <circle cx="110" cy="110" r={radius} fill="none" stroke="rgba(34,197,94,0.08)" strokeWidth="18" />
      {/* animated progress arc */}
      <motion.circle
        cx="110" cy="110" r={radius}
        fill="none"
        stroke={rating.color}
        strokeWidth="18"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: dashOffset }}
        transition={{ duration: 1.6, ease: 'easeOut', delay: 0.3 }}
        transform="rotate(-90 110 110)"
        filter="url(#ringGlow)"
      />
      {/* centre text */}
      <text x="110" y="98" textAnchor="middle" fill={rating.color} fontSize="32" fontWeight="800" fontFamily="Inter">
        {score < 1000 ? score.toFixed(0) : (score / 1000).toFixed(1) + 'k'}
      </text>
      <text x="110" y="118" textAnchor="middle" fill="#86efac" fontSize="11" fontFamily="Inter">
        kg CO₂ / month
      </text>
      <text x="110" y="142" textAnchor="middle" fill={rating.color} fontSize="15" fontWeight="700" fontFamily="Inter">
        {rating.emoji} {rating.label}
      </text>
    </svg>
  );
}

/* ─────────────── component ─────────────── */
export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [latest, setLatest] = useState<CarbonAssessment | null>(null);
  const [history, setHistory] = useState<CarbonAssessment[]>([]);
  const [todayActions, setTodayActions] = useState<DailyAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      assessmentApi.getLatest(),
      assessmentApi.getHistory(),
      actionsApi.getToday(),
    ]).then(([latestRes, historyRes, todayRes]) => {
      setLatest(latestRes.data.assessment ?? null);
      setHistory((historyRes.data.assessments ?? []).slice(-6).reverse());
      setTodayActions(todayRes.data.actions ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const rating = latest ? getCarbonRating(latest.total_score) : getCarbonRating(0);
  const comparisons = latest ? getCarbonComparisons(latest.total_score) : [];

  /* donut data */
  const donutData = latest
    ? [
        { name: 'Transport',   value: latest.transport_score,   color: getCategoryColor('transport') },
        { name: 'Food',        value: latest.food_score,        color: getCategoryColor('food') },
        { name: 'Electricity', value: latest.electricity_score, color: getCategoryColor('electricity') },
        { name: 'Shopping',    value: latest.shopping_score,    color: getCategoryColor('shopping') },
      ].filter(d => d.value > 0)
    : [];

  /* trend data */
  const trendData = [...history].reverse().map((a) => ({
    score: parseFloat(a.total_score.toFixed(1)),
    date: new Date(a.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
  }));

  /* xp info */
  const xpInfo = user ? xpToNextLevel(user.level, user.xp % (user.level * 100)) : { needed: 100, current: 0, percent: 0 };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerVariants: any = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cardVariants: any = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Leaf size={36} color="#22c55e" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-enter min-h-screen p-4 md:p-6" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <motion.div variants={containerVariants} initial="hidden" animate="show">

        {/* ── Welcome Header ── */}
        <motion.div variants={cardVariants} className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p style={{ color: '#86efac', fontSize: 14 }}>Good {getTimeOfDay()} 🌱</p>
            <h1 className="text-3xl md:text-4xl font-black gradient-text leading-tight">
              {user?.name?.split(' ')[0] ?? 'Eco Warrior'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Level badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass px-4 py-2 flex items-center gap-2"
              style={{ borderColor: 'rgba(251,191,36,0.4)' }}
            >
              <span style={{ fontSize: 20 }}>⭐</span>
              <div>
                <p style={{ color: '#fbbf24', fontWeight: 700, fontSize: 15 }}>Level {user?.level ?? 1}</p>
                <p style={{ color: '#86efac', fontSize: 11 }}>{user?.xp ?? 0} XP total</p>
              </div>
            </motion.div>
            {/* Streak badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass px-4 py-2 flex items-center gap-2"
              style={{ borderColor: 'rgba(249,115,22,0.4)' }}
            >
              <span style={{ fontSize: 20 }}>🔥</span>
              <div>
                <p style={{ color: '#fb923c', fontWeight: 700, fontSize: 15 }}>{user?.streak_current ?? 0} days</p>
                <p style={{ color: '#86efac', fontSize: 11 }}>Current streak</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Main grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>

          {/* Carbon Score Card */}
          <motion.div variants={cardVariants} className="glass glow-green-sm p-6 flex flex-col items-center">
            <p className="text-sm font-semibold mb-4" style={{ color: '#86efac', letterSpacing: '0.08em' }}>
              CARBON FOOTPRINT
            </p>
            {latest ? (
              <>
                <CarbonRing score={latest.total_score} rating={rating} />
                <div className="w-full mt-5 space-y-2">
                  <p style={{ color: '#86efac', fontSize: 11, letterSpacing: '0.1em', marginBottom: 8 }}>
                    EQUIVALENT TO
                  </p>
                  {comparisons.map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.15 }}
                      className="flex items-center gap-2"
                      style={{ color: '#f0fdf4', fontSize: 13 }}
                    >
                      <span style={{ color: rating.color }}>▸</span> {c}
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p style={{ color: '#86efac', fontSize: 15 }}>No assessment yet</p>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="btn-primary mt-4 text-sm"
                  onClick={() => navigate('/assessment')}
                >
                  Take Assessment
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Category Breakdown donut */}
          {donutData.length > 0 && (
            <motion.div variants={cardVariants} className="glass p-6">
              <p className="text-sm font-semibold mb-4" style={{ color: '#86efac', letterSpacing: '0.08em' }}>
                CATEGORY BREAKDOWN
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={donutData} cx="50%" cy="50%"
                    innerRadius={52} outerRadius={80}
                    paddingAngle={3} dataKey="value"
                    animationBegin={300} animationDuration={1000}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(10,31,16,0.95)',
                      border: '1px solid rgba(34,197,94,0.2)',
                      borderRadius: 8,
                      color: '#f0fdf4',
                      fontSize: 13,
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(v: any) => `${Number(v).toFixed(1)} kg`}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Per-category bars */}
              <div className="mt-2 space-y-3">
                {CATEGORY_META.map(({ key, label, Icon }) => {
                  const val = latest ? (latest as any)[`${key}_score`] as number : 0;
                  const total = donutData.reduce((s, d) => s + d.value, 0);
                  const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5" style={{ color: '#86efac', fontSize: 12 }}>
                          <Icon size={12} color={getCategoryColor(key)} />
                          {label}
                        </span>
                        <span style={{ color: '#f0fdf4', fontSize: 12 }}>{pct}%</span>
                      </div>
                      <div className="progress-bar">
                        <motion.div
                          className="progress-fill"
                          style={{ background: getCategoryColor(key) }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Streak + XP card */}
          <motion.div variants={cardVariants} className="glass p-6 space-y-5">
            <p className="text-sm font-semibold" style={{ color: '#86efac', letterSpacing: '0.08em' }}>
              STREAK & PROGRESS
            </p>
            {/* Flame streak display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.span
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{ fontSize: 36 }}
                >
                  🔥
                </motion.span>
                <div>
                  <p style={{ color: '#fb923c', fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
                    {user?.streak_current ?? 0}
                  </p>
                  <p style={{ color: '#86efac', fontSize: 12 }}>day streak</p>
                </div>
              </div>
              <div className="text-right">
                <p style={{ color: '#86efac', fontSize: 12 }}>Best streak</p>
                <p style={{ color: '#fbbf24', fontSize: 20, fontWeight: 700 }}>
                  🏆 {user?.streak_best ?? 0}
                </p>
              </div>
            </div>
            {/* XP bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: '#86efac', fontSize: 12 }}>XP to Level {(user?.level ?? 1) + 1}</span>
                <span style={{ color: '#fbbf24', fontSize: 13, fontWeight: 600 }}>
                  {xpInfo.current} / {xpInfo.needed}
                </span>
              </div>
              <div className="progress-bar" style={{ height: 10 }}>
                <motion.div
                  className="progress-fill"
                  style={{ background: 'linear-gradient(90deg,#fbbf24,#f59e0b)', height: '100%' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${xpInfo.percent}%` }}
                  transition={{ duration: 1.2, delay: 0.4 }}
                />
              </div>
              <p style={{ color: '#86efac', fontSize: 11, marginTop: 4, textAlign: 'right' }}>
                {xpInfo.percent}% complete
              </p>
            </div>
            {/* Eco points */}
            <div
              className="glass flex items-center justify-between px-4 py-3"
              style={{ borderColor: 'rgba(167,139,250,0.3)' }}
            >
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 22 }}>🌿</span>
                <span style={{ color: '#a78bfa', fontSize: 13, fontWeight: 600 }}>Eco Points</span>
              </div>
              <span style={{ color: '#f0fdf4', fontSize: 22, fontWeight: 800 }}>
                <AnimatedNumber value={user?.eco_points ?? 0} />
              </span>
            </div>
            {/* Badges */}
            {user && user.badges.length > 0 && (
              <div>
                <p style={{ color: '#86efac', fontSize: 11, marginBottom: 8 }}>BADGES EARNED</p>
                <div className="flex flex-wrap gap-2">
                  {user.badges.slice(0, 5).map((b) => (
                    <motion.span key={b} whileHover={{ scale: 1.1 }} className="badge badge-green" style={{ fontSize: 11 }}>
                      🏅 {b.replace(/_/g, ' ')}
                    </motion.span>
                  ))}
                  {user.badges.length > 5 && (
                    <span className="badge badge-green" style={{ fontSize: 11 }}>
                      +{user.badges.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Monthly Trend ── */}
        {trendData.length > 1 && (
          <motion.div variants={cardVariants} className="glass p-6 mt-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: '#86efac', letterSpacing: '0.08em' }}>
                MONTHLY TREND
              </p>
              <span className="badge badge-green">
                <TrendingUp size={11} /> Last {trendData.length} assessments
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trendData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(34,197,94,0.06)" strokeDasharray="4 4" />
                <XAxis dataKey="date" tick={{ fill: '#86efac', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#86efac', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,31,16,0.95)',
                    border: '1px solid rgba(34,197,94,0.2)',
                    borderRadius: 8, color: '#f0fdf4', fontSize: 13,
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(v: any) => `${v} kg CO₂`}
                />
                <Area
                  type="monotone" dataKey="score"
                  stroke="#22c55e" strokeWidth={2.5}
                  fill="url(#trendGrad)"
                  dot={{ fill: '#22c55e', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#4ade80' }}
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* ── Today's Actions ── */}
        <motion.div variants={cardVariants} className="glass p-6 mt-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: '#86efac', letterSpacing: '0.08em' }}>
              TODAY'S ACTIONS
            </p>
            <span style={{ color: '#86efac', fontSize: 12 }}>{todayActions.length} logged</span>
          </div>
          {todayActions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {todayActions.map((a) => (
                <motion.span
                  key={a._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="badge badge-green flex items-center gap-1.5"
                  style={{ fontSize: 12, padding: '5px 12px' }}
                >
                  <span style={{ fontSize: 14 }}>{getCategoryIcon(a.category)}</span>
                  {a.action_name}
                  <span style={{ color: '#fbbf24', fontSize: 11 }}>+{a.xp_earned}xp</span>
                </motion.span>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p style={{ color: '#86efac', fontSize: 14 }}>No actions logged yet today.</p>
              <p style={{ color: '#4ade8066', fontSize: 12, marginTop: 4 }}>
                Log your first green action to start your streak! 🌿
              </p>
            </div>
          )}
          {todayActions.length > 0 && (
            <div
              className="flex items-center justify-between mt-4 pt-4"
              style={{ borderTop: '1px solid rgba(34,197,94,0.1)' }}
            >
              <span style={{ color: '#86efac', fontSize: 13 }}>Total CO₂ saved today</span>
              <span style={{ color: '#4ade80', fontWeight: 700, fontSize: 16 }}>
                🌿 {todayActions.reduce((s, a) => s + a.carbon_saved, 0).toFixed(2)} kg
              </span>
            </div>
          )}
        </motion.div>

        {/* ── Quick Action Buttons ── */}
        <motion.div variants={cardVariants} className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickActionBtn
            icon={<Plus size={20} />}
            label="Log Action"
            sub="Add a green action"
            color="#22c55e"
            onClick={() => navigate('/actions')}
          />
          <QuickActionBtn
            icon={<Brain size={20} />}
            label="AI Advice"
            sub="Get personalised tips"
            color="#a78bfa"
            onClick={() => navigate('/ai-coach')}
          />
          <QuickActionBtn
            icon={<Globe size={20} />}
            label="View EcoWorld"
            sub="See your ecosystem"
            color="#38bdf8"
            onClick={() => navigate('/ecoworld')}
          />
        </motion.div>

      </motion.div>
    </div>
  );
}

/* ── sub-components ── */
function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function QuickActionBtn({
  icon, label, sub, color, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="glass glass-hover w-full flex items-center gap-4 p-4 text-left"
      style={{ borderColor: `${color}30`, cursor: 'pointer', background: 'transparent', border: `1px solid ${color}30` }}
    >
      <div
        className="flex items-center justify-center rounded-xl"
        style={{ width: 44, height: 44, background: `${color}18`, color, flexShrink: 0 }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p style={{ color: '#f0fdf4', fontWeight: 600, fontSize: 15 }}>{label}</p>
        <p style={{ color: '#86efac', fontSize: 12 }}>{sub}</p>
      </div>
      <ChevronRight size={16} color={color} style={{ opacity: 0.7 }} />
    </motion.button>
  );
}
