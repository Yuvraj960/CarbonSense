import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Leaf, Zap, Globe, Trophy, Users, Bot, BarChart3, Check } from 'lucide-react';

/* ─── Data ──────────────────────────────────────────────────────── */
const features = [
  {
    icon: <BarChart3 size={22} />,
    color: '#22c55e',
    title: 'Carbon Assessment',
    desc: 'Get your personalized monthly carbon footprint with human-readable context—not just raw numbers.',
  },
  {
    icon: <Bot size={22} />,
    color: '#a78bfa',
    title: 'AI Coach — EcoSage',
    desc: 'Personalized, realistic tips powered by Gemini AI. Never shaming, always encouraging.',
  },
  {
    icon: <Globe size={22} />,
    color: '#38bdf8',
    title: 'Living EcoWorld',
    desc: 'Your virtual ecosystem that blooms with every green action. Watch it transform from barren to paradise.',
  },
  {
    icon: <Zap size={22} />,
    color: '#fbbf24',
    title: 'Streak System',
    desc: 'Build sustainable habits through daily streaks. Consistency beats perfection every time.',
  },
  {
    icon: <Trophy size={22} />,
    color: '#f97316',
    title: 'Challenges',
    desc: 'Join curated eco-challenges. Ranked by effort, not by how much you spend.',
  },
  {
    icon: <Users size={22} />,
    color: '#34d399',
    title: 'Team Competition',
    desc: 'Create or join teams. Achieve shared sustainability goals and climb together.',
  },
];

const howItWorks = [
  { step: '01', title: 'Assess Your Footprint', desc: 'Complete a quick survey about transport, food, energy & shopping habits.' },
  { step: '02', title: 'Get Your Score', desc: 'See your CO₂ footprint in context — car trips, tree absorption, fan hours.' },
  { step: '03', title: 'Take Daily Actions', desc: 'Log green actions every day to earn XP, eco-points, and build streaks.' },
  { step: '04', title: 'Watch the World Grow', desc: 'Your EcoWorld evolves as you improve. From barren land to a lush paradise.' },
];

const stats = [
  { value: '6+', label: 'Challenge Types' },
  { value: '12', label: 'Daily Actions' },
  { value: 'AI', label: 'Personalised Coach' },
  { value: '5', label: 'EcoWorld Levels' },
];

/* ─── Floating particle orb ─────────────────────────────────────── */
function Orb({ style }: { style: React.CSSProperties }) {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        borderRadius: '50%',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}

/* ─── Nav ────────────────────────────────────────────────────────── */
function Nav() {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 64,
        background: 'rgba(3,15,7,0.75)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(34,197,94,0.1)',
        display: 'flex', alignItems: 'center',
        padding: '0 clamp(1rem, 4vw, 3rem)',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Leaf size={18} color="white" strokeWidth={2.5} />
        </div>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700, fontSize: 18,
          background: 'linear-gradient(130deg, #22c55e, #4ade80)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          CarbonSense
        </span>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Link to="/auth" style={{ textDecoration: 'none' }}>
          <button className="btn-secondary" style={{ padding: '7px 18px', fontSize: 13 }}>
            Sign in
          </button>
        </Link>
        <Link to="/auth" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ padding: '7px 18px', fontSize: 13 }}>
            <span>Get Started</span>
            <ArrowRight size={14} />
          </button>
        </Link>
      </div>
    </motion.nav>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: 'var(--bg)', minHeight: '100vh' }}>
      <Nav />

      {/* ── Hero ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px clamp(1rem, 4vw, 3rem) 60px',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <Orb style={{ top: '15%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 65%)' }} />
        <Orb style={{ bottom: '10%', right: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(74,222,128,0.05) 0%, transparent 65%)' }} />
        <Orb style={{ top: '55%', left: '45%', width: 220, height: 220, background: 'radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 65%)' }} />

        {/* Subtle grid */}
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: 780, position: 'relative', zIndex: 1 }}
        >
          {/* Pill tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.22)',
              borderRadius: 999,
              padding: '6px 16px',
              marginBottom: 28,
              fontSize: 13, color: '#4ade80',
              fontWeight: 500,
            }}
          >
            <span style={{ fontSize: 15 }}>🌿</span>
            Making Carbon Visible, Actionable & Habit-Forming
          </motion.div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.6rem, 6.5vw, 5rem)',
            fontWeight: 900,
            lineHeight: 1.07,
            letterSpacing: '-0.03em',
            marginBottom: 24,
            fontFamily: "'Space Grotesk', sans-serif",
            color: 'var(--text)',
          }}>
            Know Your{' '}
            <span style={{
              background: 'linear-gradient(130deg, #22c55e 0%, #4ade80 50%, #86efac 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Carbon Footprint
            </span>
            <br />& Do Something About It
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
            color: 'rgba(134,239,172,0.85)',
            lineHeight: 1.75,
            maxWidth: 580,
            margin: '0 auto 44px',
          }}>
            Not just a calculator. A gamified awareness platform with AI coaching,
            daily habit tracking, and a living virtual ecosystem.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/auth" style={{ textDecoration: 'none' }}>
              <motion.button
                className="btn-primary pulse-green"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{ padding: '13px 30px', fontSize: 15, borderRadius: 12 }}
              >
                <span>Start for free</span>
                <ArrowRight size={16} />
              </motion.button>
            </Link>
            <motion.button
              className="btn-secondary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ padding: '13px 30px', fontSize: 15, borderRadius: 12 }}
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore features
            </motion.button>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{
              display: 'flex', gap: 0, justifyContent: 'center',
              marginTop: 72,
              background: 'rgba(7,26,13,0.55)',
              border: '1px solid rgba(34,197,94,0.12)',
              borderRadius: 16,
              backdropFilter: 'blur(20px)',
              overflow: 'hidden',
            }}
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                style={{
                  flex: 1, textAlign: 'center',
                  padding: '20px 16px',
                  borderRight: i < stats.length - 1 ? '1px solid rgba(34,197,94,0.1)' : 'none',
                }}
              >
                <p style={{
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                  fontWeight: 900,
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: 'linear-gradient(130deg, #22c55e, #4ade80)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  {s.value}
                </p>
                <p style={{ color: 'rgba(134,239,172,0.7)', fontSize: 12, marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: 'clamp(60px, 10vw, 100px) clamp(1rem, 4vw, 3rem)', maxWidth: 1160, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <p style={{ color: '#22c55e', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 12 }}>
            FEATURES
          </p>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            fontFamily: "'Space Grotesk', sans-serif",
            marginBottom: 14,
            color: 'var(--text)',
          }}>
            Everything you need to{' '}
            <span style={{
              background: 'linear-gradient(130deg, #22c55e, #4ade80)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              make an impact
            </span>
          </h2>
          <p style={{ color: 'rgba(134,239,172,0.75)', fontSize: 16, maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
            Not a dashboard. Not a calculator. An awareness platform built for real behavior change.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: 20,
        }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: 'easeOut' }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass"
              style={{ padding: '28px 26px', cursor: 'default', transition: 'border-color 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `${f.color}35`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${f.color}15`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '';
                (e.currentTarget as HTMLElement).style.boxShadow = '';
              }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 12,
                background: `${f.color}14`,
                border: `1px solid ${f.color}28`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: f.color, marginBottom: 16,
              }}>
                {f.icon}
              </div>
              <h3 style={{ color: 'var(--text)', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ color: 'rgba(134,239,172,0.75)', lineHeight: 1.65, fontSize: 14 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it Works ── */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) clamp(1rem, 4vw, 3rem)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <p style={{ color: '#22c55e', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 12 }}>
              HOW IT WORKS
            </p>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: 800,
              fontFamily: "'Space Grotesk', sans-serif",
              color: 'var(--text)',
            }}>
              From zero to eco-hero in 4 steps
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, position: 'relative' }}>
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ textAlign: 'center', padding: '0 8px' }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 800, fontSize: 15, color: '#4ade80',
                }}>
                  {item.step}
                </div>
                <h3 style={{ color: 'var(--text)', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
                  {item.title}
                </h3>
                <p style={{ color: 'rgba(134,239,172,0.7)', fontSize: 13, lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) clamp(1rem, 4vw, 3rem)', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass"
          style={{
            maxWidth: 640,
            margin: '0 auto',
            padding: 'clamp(40px, 8vw, 64px) clamp(24px, 6vw, 48px)',
            borderColor: 'rgba(34,197,94,0.25)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Glow backdrop */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 52, marginBottom: 20 }}>🌍</div>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
              fontWeight: 800,
              fontFamily: "'Space Grotesk', sans-serif",
              marginBottom: 14,
              background: 'linear-gradient(130deg, #22c55e, #4ade80)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Ready to make a difference?
            </h2>
            <p style={{ color: 'rgba(134,239,172,0.8)', marginBottom: 32, lineHeight: 1.7, fontSize: 15 }}>
              Join CarbonSense and start understanding your impact.
              One green action at a time — no guilt, just growth.
            </p>

            {/* Bullets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32, textAlign: 'left', maxWidth: 320, margin: '0 auto 32px' }}>
              {['Free forever', 'No carbon guilt — just encouragement', 'AI-powered personalised advice'].map(b => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(134,239,172,0.85)', fontSize: 14 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'rgba(34,197,94,0.15)',
                    border: '1px solid rgba(34,197,94,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Check size={11} color="#22c55e" strokeWidth={3} />
                  </div>
                  {b}
                </div>
              ))}
            </div>

            <Link to="/auth" style={{ textDecoration: 'none' }}>
              <motion.button
                className="btn-primary pulse-green"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{ padding: '14px 36px', fontSize: 15, borderRadius: 12 }}
              >
                <span>Get Started Free</span>
                <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid rgba(34,197,94,0.08)',
        padding: '28px clamp(1rem, 4vw, 3rem)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Leaf size={15} color="#22c55e" />
          <span style={{ color: 'rgba(134,239,172,0.6)', fontSize: 13 }}>
            CarbonSense — Making carbon visible, actionable, and habit-forming
          </span>
        </div>
        <span style={{ color: 'rgba(134,239,172,0.35)', fontSize: 12 }}>
          Built for a greener tomorrow
        </span>
      </footer>
    </div>
  );
}
