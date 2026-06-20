import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Leaf, Droplets, Wind } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { actionsApi } from '../services/api';
import { getEcoworldLabel, getCategoryIcon } from '../utils/carbonUtils';
import type { DailyAction } from '../types';

/* ═══════════════════════════════════════════
   SVG Scene Components
═══════════════════════════════════════════ */

/** A single swayin tree */
function Tree({
  x, y, scale = 1, color = '#22c55e', delay = 0,
}: {
  x: number; y: number; scale?: number; color?: string; delay?: number;
}) {
  return (
    <motion.g
      style={{ transformOrigin: `${x}px ${y + 50 * scale}px` }}
      animate={{ rotate: [-1.5, 1.5, -1.5] }}
      transition={{ repeat: Infinity, duration: 3 + delay * 0.4, ease: 'easeInOut', delay }}
    >
      {/* trunk */}
      <rect x={x - 4 * scale} y={y + 30 * scale} width={8 * scale} height={22 * scale} rx={3} fill="#6b3f1f" />
      {/* foliage layers */}
      <ellipse cx={x} cy={y + 28 * scale} rx={22 * scale} ry={18 * scale} fill={color} opacity={0.9} />
      <ellipse cx={x} cy={y + 14 * scale} rx={16 * scale} ry={13 * scale} fill={color} />
      <ellipse cx={x} cy={y + 2 * scale} rx={10 * scale} ry={9 * scale} fill={color === '#22c55e' ? '#4ade80' : color} />
    </motion.g>
  );
}

/** Small grass sprout */
function Sprout({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <motion.g
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1, rotate: [-2, 2, -2] }}
      transition={{
        scaleY: { duration: 0.6, delay },
        rotate: { repeat: Infinity, duration: 2, ease: 'easeInOut', delay },
      }}
      style={{ transformOrigin: `${x}px ${y + 18}px` }}
    >
      <line x1={x} y1={y + 18} x2={x} y2={y} stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx={x - 6} cy={y + 6} rx={6} ry={4} fill="#4ade80" transform={`rotate(-30 ${x - 6} ${y + 6})`} />
      <ellipse cx={x + 6} cy={y + 10} rx={6} ry={4} fill="#22c55e" transform={`rotate(30 ${x + 6} ${y + 10})`} />
    </motion.g>
  );
}

/** Flying bird */
function Bird({ startX, startY, delay = 0 }: { startX: number; startY: number; delay?: number }) {
  return (
    <motion.g
      animate={{ x: [0, 320, 320], y: [0, -20, -20], opacity: [0, 1, 0] }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.path
        d={`M${startX},${startY} q-6,-5 -10,0 M${startX},${startY} q6,-5 10,0`}
        stroke="#86efac" strokeWidth="1.5" fill="none"
        animate={{ d: [
          `M${startX},${startY} q-6,-5 -10,0 M${startX},${startY} q6,-5 10,0`,
          `M${startX},${startY} q-6,-2 -10,3 M${startX},${startY} q6,-2 10,3`,
          `M${startX},${startY} q-6,-5 -10,0 M${startX},${startY} q6,-5 10,0`,
        ]}}
        transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
      />
    </motion.g>
  );
}

/** Animated water wave */
function River({ y }: { y: number }) {
  return (
    <g>
      <defs>
        <linearGradient id="riverGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.6} />
        </linearGradient>
        <linearGradient id="waterfall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.4} />
        </linearGradient>
      </defs>
      <path d={`M0,${y} Q120,${y - 6} 240,${y} Q360,${y + 6} 480,${y} L480,${y + 22} L0,${y + 22}Z`}
        fill="url(#riverGrad)" />
      {/* animated shimmer */}
      <motion.path
        d={`M20,${y + 8} Q60,${y + 4} 100,${y + 8}`}
        stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none"
        animate={{ x: [0, 60, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      />
      <motion.path
        d={`M160,${y + 13} Q200,${y + 9} 240,${y + 13}`}
        stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none"
        animate={{ x: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
      />
    </g>
  );
}

/** Smog cloud */
function SmogCloud({ cx, cy, delay = 0 }: { cx: number; cy: number; delay?: number }) {
  return (
    <motion.g
      animate={{ x: [-10, 10, -10], opacity: [0.7, 1, 0.7] }}
      transition={{ repeat: Infinity, duration: 5 + delay, ease: 'easeInOut', delay }}
    >
      <ellipse cx={cx} cy={cy} rx={45} ry={22} fill="#4b5563" opacity={0.55} />
      <ellipse cx={cx + 30} cy={cy + 5} rx={30} ry={16} fill="#6b7280" opacity={0.45} />
      <ellipse cx={cx - 25} cy={cy + 6} rx={25} ry={14} fill="#374151" opacity={0.5} />
    </motion.g>
  );
}

/** Rainbow arc */
function Rainbow({ cx, cy }: { cx: number; cy: number }) {
  const colors = ['#ef4444', '#f97316', '#fbbf24', '#22c55e', '#38bdf8', '#818cf8', '#e879f9'];
  return (
    <g opacity={0.8}>
      {colors.map((c, i) => (
        <motion.path
          key={c}
          d={`M${cx - 140 + i * 4},${cy} A${140 - i * 4},${100 - i * 4} 0 0,1 ${cx + 140 - i * 4},${cy}`}
          stroke={c} strokeWidth="5" fill="none" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 2, delay: i * 0.12, ease: 'easeOut' }}
        />
      ))}
    </g>
  );
}

/** Cloud */
function Cloud({ x, y, scale = 1, delay = 0 }: { x: number; y: number; scale?: number; delay?: number }) {
  return (
    <motion.g
      animate={{ x: [-8, 8, -8] }}
      transition={{ repeat: Infinity, duration: 6 + delay, ease: 'easeInOut', delay }}
    >
      <ellipse cx={x} cy={y} rx={30 * scale} ry={16 * scale} fill="rgba(255,255,255,0.85)" />
      <ellipse cx={x + 20 * scale} cy={y + 5 * scale} rx={22 * scale} ry={12 * scale} fill="rgba(255,255,255,0.75)" />
      <ellipse cx={x - 20 * scale} cy={y + 5 * scale} rx={20 * scale} ry={11 * scale} fill="rgba(255,255,255,0.8)" />
    </motion.g>
  );
}

/** Waterfall */
function Waterfall({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[0, 5, 10].map((offset, i) => (
        <motion.rect
          key={i}
          x={x + offset} y={y}
          width={6} height={60}
          rx={3}
          fill="url(#waterfall)"
          animate={{ y: [y, y + 30, y] }}
          transition={{ repeat: Infinity, duration: 1.2 + i * 0.15, ease: 'linear', delay: i * 0.1 }}
          opacity={0.7}
        />
      ))}
    </g>
  );
}

/* ═══════════════════════════════════════════
   Level Scene Definitions
═══════════════════════════════════════════ */
interface SceneConfig {
  skyTop: string;
  skyBot: string;
  groundColor: string;
  groundStroke?: string;
  hasCracks?: boolean;
  trees: Array<{ x: number; y: number; scale?: number; color?: string; delay?: number }>;
  sprouts: Array<{ x: number; y: number; delay?: number }>;
  birds: Array<{ startX: number; startY: number; delay?: number }>;
  hasRiver?: boolean;
  riverY?: number;
  smog: Array<{ cx: number; cy: number; delay?: number }>;
  hasRainbow?: boolean;
  clouds: Array<{ x: number; y: number; scale?: number; delay?: number }>;
  hasWaterfall?: boolean;
  waterfallPos?: { x: number; y: number };
}

const SCENES: SceneConfig[] = [
  /* Level 0 — Barren */
  {
    skyTop: '#1c1917', skyBot: '#292524',
    groundColor: '#44403c', groundStroke: '#57534e',
    hasCracks: true,
    trees: [], sprouts: [], birds: [],
    smog: [{ cx: 80, cy: 50 }, { cx: 260, cy: 35 }, { cx: 420, cy: 60 }],
    clouds: [],
  },
  /* Level 1 — First Sprouts */
  {
    skyTop: '#1c1917', skyBot: '#3c2a1a',
    groundColor: '#44403c', groundStroke: '#78716c',
    hasCracks: true,
    trees: [],
    sprouts: [{ x: 120, y: 200 }, { x: 310, y: 210 }],
    birds: [],
    smog: [{ cx: 80, cy: 45 }, { cx: 380, cy: 38 }],
    clouds: [],
  },
  /* Level 2 — Young Forest */
  {
    skyTop: '#0c1a2e', skyBot: '#1e3a5f',
    groundColor: '#2d4a2d',
    trees: [
      { x: 60, y: 160, scale: 0.8 }, { x: 160, y: 155, scale: 0.7 },
      { x: 340, y: 158, scale: 0.75 }, { x: 430, y: 163, scale: 0.85 },
    ],
    sprouts: [{ x: 230, y: 210 }, { x: 270, y: 215 }, { x: 300, y: 208 }],
    birds: [],
    smog: [{ cx: 370, cy: 40 }],
    clouds: [{ x: 100, y: 55, scale: 0.8 }],
  },
  /* Level 3 — Lush Grove */
  {
    skyTop: '#0f2027', skyBot: '#203a43',
    groundColor: '#166534',
    trees: [
      { x: 50, y: 145, scale: 1 }, { x: 130, y: 140, scale: 0.9, delay: 0.2 },
      { x: 210, y: 150, scale: 0.85, color: '#16a34a', delay: 0.5 },
      { x: 300, y: 143, scale: 1.05, delay: 0.3 },
      { x: 390, y: 148, scale: 0.95, delay: 0.1 },
      { x: 455, y: 155, scale: 0.8, delay: 0.6 },
    ],
    sprouts: [],
    birds: [{ startX: 200, startY: 70, delay: 1 }, { startX: 80, startY: 55, delay: 3 }],
    hasRiver: true, riverY: 225,
    smog: [],
    clouds: [{ x: 130, y: 50 }, { x: 360, y: 40, scale: 0.7 }],
  },
  /* Level 4 — Thriving Ecosystem */
  {
    skyTop: '#064e3b', skyBot: '#065f46',
    groundColor: '#14532d',
    trees: [
      { x: 35, y: 130, scale: 1.1 }, { x: 100, y: 125, scale: 1, delay: 0.2 },
      { x: 170, y: 133, scale: 0.9, color: '#16a34a', delay: 0.4 },
      { x: 250, y: 128, scale: 1.15, delay: 0.1 },
      { x: 330, y: 134, scale: 1, delay: 0.35 },
      { x: 400, y: 127, scale: 1.05, color: '#15803d', delay: 0.5 },
      { x: 455, y: 138, scale: 0.85, delay: 0.25 },
    ],
    sprouts: [],
    birds: [
      { startX: 150, startY: 60, delay: 0.5 },
      { startX: 60, startY: 42, delay: 2.5 },
      { startX: 250, startY: 75, delay: 4 },
    ],
    hasRiver: true, riverY: 220,
    smog: [],
    clouds: [
      { x: 90, y: 40 }, { x: 280, y: 30, scale: 0.8 }, { x: 420, y: 48, scale: 0.65 },
    ],
  },
  /* Level 5 — Paradise */
  {
    skyTop: '#0a2e1a', skyBot: '#064e3b',
    groundColor: '#15803d',
    trees: [
      { x: 30, y: 118, scale: 1.2, color: '#22c55e' },
      { x: 95, y: 112, scale: 1.1, delay: 0.2 },
      { x: 165, y: 120, scale: 1, color: '#16a34a', delay: 0.4 },
      { x: 235, y: 115, scale: 1.25, delay: 0.15 },
      { x: 310, y: 120, scale: 1.1, color: '#4ade80', delay: 0.3 },
      { x: 380, y: 115, scale: 1.05, delay: 0.5 },
      { x: 448, y: 122, scale: 0.95, color: '#22c55e', delay: 0.6 },
    ],
    sprouts: [],
    birds: [
      { startX: 120, startY: 55, delay: 0.3 },
      { startX: 50, startY: 40, delay: 1.5 },
      { startX: 220, startY: 65, delay: 3 },
      { startX: 380, startY: 45, delay: 5 },
    ],
    hasRiver: true, riverY: 218,
    smog: [],
    hasRainbow: true,
    clouds: [
      { x: 80, y: 35 }, { x: 240, y: 28, scale: 0.9 },
      { x: 400, y: 40, scale: 0.75 },
    ],
    hasWaterfall: true, waterfallPos: { x: 440, y: 150 },
  },
];

/* ═══════════════════════════════════════════
   Landscape SVG
═══════════════════════════════════════════ */
function LandscapeScene({ level }: { level: number }) {
  const cfg = SCENES[Math.min(level, 5)];
  const W = 480, H = 270;
  const groundY = 240;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', maxWidth: 600, borderRadius: 16, display: 'block', margin: '0 auto' }}
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={cfg.skyTop} />
          <stop offset="100%" stopColor={cfg.skyBot} />
        </linearGradient>
        <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={cfg.groundColor} />
          <stop offset="100%" stopColor={cfg.groundColor} stopOpacity={0.6} />
        </linearGradient>
        <linearGradient id="waterfall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.4} />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect x={0} y={0} width={W} height={H} fill="url(#skyGrad)" />

      {/* Stars for dark levels */}
      {level <= 1 && [
        [30, 20], [80, 15], [140, 30], [200, 10], [280, 25],
        [350, 12], [410, 28], [450, 18],
      ].map(([sx, sy], i) => (
        <motion.circle key={i} cx={sx} cy={sy} r={1.2} fill="white" opacity={0.6}
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 + i * 0.3, delay: i * 0.2 }} />
      ))}

      {/* Rainbow */}
      {cfg.hasRainbow && <Rainbow cx={240} cy={210} />}

      {/* Clouds */}
      {cfg.clouds.map((c, i) => <Cloud key={i} {...c} />)}

      {/* Smog */}
      {cfg.smog.map((s, i) => <SmogCloud key={i} {...s} />)}

      {/* Ground */}
      <rect x={0} y={groundY} width={W} height={H - groundY} fill="url(#groundGrad)" />

      {/* Cracks on barren ground */}
      {cfg.hasCracks && (
        <g stroke={cfg.groundStroke ?? '#57534e'} strokeWidth="1.2" opacity={0.6}>
          <path d="M40,248 L55,256 L70,250" fill="none" />
          <path d="M150,244 L160,252 L175,246" fill="none" />
          <path d="M280,250 L295,258 L310,252 L320,262" fill="none" />
          <path d="M390,245 L402,254 L415,248" fill="none" />
        </g>
      )}

      {/* River */}
      {cfg.hasRiver && cfg.riverY && <River y={cfg.riverY} />}

      {/* Waterfall */}
      {cfg.hasWaterfall && cfg.waterfallPos && (
        <Waterfall x={cfg.waterfallPos.x} y={cfg.waterfallPos.y} />
      )}

      {/* Trees */}
      {cfg.trees.map((t, i) => <Tree key={i} {...t} />)}

      {/* Sprouts */}
      {cfg.sprouts.map((s, i) => <Sprout key={i} {...s} />)}

      {/* Birds */}
      {cfg.birds.map((b, i) => <Bird key={i} {...b} />)}

      {/* Sun or moon */}
      {level >= 3 ? (
        <motion.circle cx={430} cy={40} r={22} fill="#fbbf24" opacity={0.85}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} />
      ) : (
        <circle cx={430} cy={38} r={14} fill="#d1d5db" opacity={0.5} />
      )}
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Level-up particle burst
═══════════════════════════════════════════ */
function ParticleBurst() {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    angle: (i / 16) * 360,
    color: ['#22c55e', '#4ade80', '#86efac', '#fbbf24', '#a78bfa'][i % 5],
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 8, height: 8, borderRadius: '50%',
            background: p.color,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * 200,
            y: Math.sin((p.angle * Math.PI) / 180) * 200,
            opacity: 0, scale: 0,
          }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.02 }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main Page
═══════════════════════════════════════════ */
export default function EcoWorldPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [recentActions, setRecentActions] = useState<DailyAction[]>([]);
  const [showBurst, setShowBurst] = useState(false);
  const prevLevelRef = React.useRef<number | null>(null);

  const level = Math.min(user?.ecoworld_level ?? 0, 5);
  const ecoPoints = user?.eco_points ?? 0;
  const levelLabel = getEcoworldLabel(level);

  /* thresholds for eco-world progression */
  const levelThresholds = [0, 100, 300, 600, 1000, 1500];
  const nextThreshold = levelThresholds[Math.min(level + 1, 5)];
  const currentThreshold = levelThresholds[level];
  const progress = level >= 5
    ? 100
    : Math.min(100, Math.round(((ecoPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100));

  useEffect(() => {
    actionsApi.getHistory(10).then((res) => {
      setRecentActions(res.data.actions ?? []);
    }).catch(() => {});
  }, []);

  /* Detect level-up */
  useEffect(() => {
    if (prevLevelRef.current !== null && level > prevLevelRef.current) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 1500);
    }
    prevLevelRef.current = level;
  }, [level]);

  /* Level colour palette */
  const levelColors = [
    { accent: '#6b7280', glow: 'rgba(107,114,128,0.3)' },
    { accent: '#84cc16', glow: 'rgba(132,204,22,0.3)' },
    { accent: '#22c55e', glow: 'rgba(34,197,94,0.3)' },
    { accent: '#10b981', glow: 'rgba(16,185,129,0.35)' },
    { accent: '#06b6d4', glow: 'rgba(6,182,212,0.35)' },
    { accent: '#a78bfa', glow: 'rgba(167,139,250,0.4)' },
  ];
  const { accent, glow } = levelColors[level];

  const levelDescriptions = [
    'A barren, polluted wasteland. Start logging actions to bring it to life!',
    'A few brave sprouts push through the cracked earth. Keep going! 🌱',
    'The land is healing. Young trees stretch toward a brightening sky! 🌳',
    'A lush grove thrives! Birds sing and a river winds through green valleys. 🦋',
    'A dense, vibrant ecosystem teems with life. You\'re making a real difference! 🦁',
    'A paradise on Earth! Rainbows, waterfalls, and wildlife flourish here. 🌈✨',
  ];

  return (
    <div className="page-enter min-h-screen p-4 md:p-6" style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <motion.button
          whileHover={{ scale: 1.1, x: -3 }} whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="glass p-2 rounded-xl"
          style={{ border: '1px solid rgba(34,197,94,0.2)' }}
        >
          <ArrowLeft size={20} color="#4ade80" />
        </motion.button>
        <div>
          <h1 className="text-3xl font-black gradient-text">EcoWorld</h1>
          <p style={{ color: '#86efac', fontSize: 13 }}>Your living virtual ecosystem</p>
        </div>
        <motion.div
          className="ml-auto badge"
          style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}40`, fontSize: 13, padding: '6px 14px' }}
          animate={{ boxShadow: [`0 0 0 0 ${glow}`, `0 0 20px 4px ${glow}`, `0 0 0 0 ${glow}`] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          <Sparkles size={14} /> {levelLabel}
        </motion.div>
      </motion.div>

      {/* ── Landscape scene ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass relative overflow-hidden mb-6"
        style={{
          boxShadow: `0 0 40px ${glow}`,
          border: `1px solid ${accent}30`,
          padding: 8,
        }}
      >
        <AnimatePresence>
          {showBurst && <ParticleBurst />}
        </AnimatePresence>
        <LandscapeScene level={level} />
        {/* Overlay description */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{ background: 'linear-gradient(0deg, rgba(3,15,7,0.85) 0%, transparent 100%)' }}
        >
          <p style={{ color: '#d1fae5', fontSize: 13, textAlign: 'center' }}>
            {levelDescriptions[level]}
          </p>
        </div>
      </motion.div>

      {/* ── Stats row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'EcoWorld Level', value: `${level} / 5`, icon: '🌍', color: accent },
          { label: 'Eco Points', value: ecoPoints.toLocaleString(), icon: '🌿', color: '#4ade80' },
          { label: 'Level Progress', value: `${progress}%`, icon: '📈', color: '#fbbf24' },
          { label: 'Actions Logged', value: recentActions.length, icon: '✅', color: '#a78bfa' },
        ].map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            className="glass p-4 text-center"
            style={{ borderColor: `${s.color}30` }}
          >
            <span style={{ fontSize: 24 }}>{s.icon}</span>
            <p style={{ color: s.color, fontWeight: 800, fontSize: 20, marginTop: 4 }}>{s.value}</p>
            <p style={{ color: '#86efac', fontSize: 11 }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Progress to next level ── */}
      {level < 5 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-5 mb-5"
          style={{ borderColor: `${accent}30` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Leaf size={16} color={accent} />
              <span style={{ color: '#f0fdf4', fontWeight: 600, fontSize: 15 }}>
                Progress to {getEcoworldLabel(level + 1)}
              </span>
            </div>
            <span style={{ color: accent, fontWeight: 700, fontSize: 14 }}>
              {ecoPoints} / {nextThreshold} pts
            </span>
          </div>
          <div className="progress-bar" style={{ height: 12 }}>
            <motion.div
              className="progress-fill"
              style={{ background: `linear-gradient(90deg, ${accent}, ${accent}cc)`, height: '100%' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.4, delay: 0.4, ease: 'easeOut' }}
            />
          </div>
          <p style={{ color: '#86efac', fontSize: 12, marginTop: 6 }}>
            {Math.max(0, nextThreshold - ecoPoints)} more eco-points to unlock level {level + 1}
          </p>
        </motion.div>
      )}

      {level >= 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass p-5 mb-5 text-center"
          style={{ borderColor: '#a78bfa40', background: 'rgba(167,139,250,0.08)' }}
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            style={{ fontSize: 40, marginBottom: 8 }}
          >
            🌈
          </motion.div>
          <p className="gradient-text font-black text-xl">Maximum Level Achieved!</p>
          <p style={{ color: '#86efac', fontSize: 13, marginTop: 4 }}>
            You've created a paradise. Your planet thanks you 🙏
          </p>
        </motion.div>
      )}

      {/* ── Recent actions panel ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Wind size={16} color="#4ade80" />
          <p style={{ color: '#86efac', fontWeight: 600, fontSize: 14, letterSpacing: '0.08em' }}>
            ACTIONS THAT GREW YOUR WORLD
          </p>
        </div>
        {recentActions.length > 0 ? (
          <div className="space-y-3">
            {recentActions.map((action, i) => (
              <motion.div
                key={action._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.1)' }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{getCategoryIcon(action.category)}</span>
                <div className="flex-1 min-w-0">
                  <p style={{ color: '#f0fdf4', fontWeight: 500, fontSize: 14 }} className="truncate">
                    {action.action_name}
                  </p>
                  <p style={{ color: '#86efac', fontSize: 12 }}>
                    {new Date(action.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span style={{ color: '#4ade80', fontSize: 12, fontWeight: 600 }}>
                    🌿 -{action.carbon_saved} kg
                  </span>
                  <span style={{ color: '#fbbf24', fontSize: 11 }}>
                    +{action.xp_earned} XP
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Droplets size={32} color="#86efac" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#86efac', fontSize: 14 }}>No actions yet.</p>
            <p style={{ color: '#4ade8066', fontSize: 12, marginTop: 4 }}>
              Log green actions to nurture your ecosystem! 🌱
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="btn-primary mt-4 text-sm"
              onClick={() => navigate('/actions')}
            >
              Log an Action
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* ── Level guide ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass p-6 mt-5"
      >
        <p style={{ color: '#86efac', fontWeight: 600, fontSize: 14, letterSpacing: '0.08em', marginBottom: 16 }}>
          ECOSYSTEM EVOLUTION
        </p>
        <div className="space-y-3">
          {Array.from({ length: 6 }, (_, i) => {
            const unlocked = i <= level;
            const active = i === level;
            const thresholdLabel = i === 0 ? 'Start' : `${levelThresholds[i]} pts`;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.07 }}
                className="flex items-center gap-3"
              >
                <div
                  style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: unlocked ? (active ? `${accent}30` : 'rgba(34,197,94,0.12)') : 'rgba(255,255,255,0.04)',
                    border: `2px solid ${unlocked ? (active ? accent : '#22c55e66') : 'rgba(255,255,255,0.1)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                  }}
                >
                  {unlocked ? ['🌑', '🌱', '🌲', '🏞️', '🦋', '🌈'][i] : '🔒'}
                </div>
                <div className="flex-1">
                  <p style={{ color: unlocked ? '#f0fdf4' : '#4b5563', fontWeight: active ? 700 : 400, fontSize: 14 }}>
                    {getEcoworldLabel(i)}
                    {active && <span style={{ color: accent, fontSize: 11, marginLeft: 8 }}>← YOU ARE HERE</span>}
                  </p>
                  <p style={{ color: '#86efac66', fontSize: 11 }}>{thresholdLabel}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

    </div>
  );
}
