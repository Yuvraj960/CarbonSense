import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Car, Bike, Train, Bus, Plane, PersonStanding,
  Zap, ShoppingBag, Leaf, ChevronRight, ChevronLeft, Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { assessmentApi } from '../services/api';
import type { AssessmentFormData } from '../types';

/* ─── Data ───────────────────────────────────────────────────────── */
const TRANSPORT_OPTIONS = [
  { key: 'car',    label: 'Car',         icon: Car,            color: '#f87171', bg: 'rgba(239,68,68,0.1)' },
  { key: 'bike',   label: 'Motorbike',   icon: Bike,           color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
  { key: 'metro',  label: 'Metro',       icon: Train,          color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  { key: 'bus',    label: 'Bus',         icon: Bus,            color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  { key: 'train',  label: 'Train',       icon: Train,          color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  { key: 'flight', label: 'Flights',     icon: Plane,          color: '#facc15', bg: 'rgba(250,204,21,0.1)' },
  { key: 'walk',   label: 'Walk/Cycle',  icon: PersonStanding, color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
];

const FOOD_OPTIONS = [
  { key: 'vegetarian', label: 'Vegetarian',  desc: 'Plants, dairy & eggs — no meat', emoji: '🥗', color: '#4ade80' },
  { key: 'eggetarian', label: 'Eggetarian',  desc: 'Vegetarian + eggs',              emoji: '🍳', color: '#fbbf24' },
  { key: 'mixed',      label: 'Mixed Diet',  desc: 'Occasional meat & fish',         emoji: '🍽️', color: '#60a5fa' },
  { key: 'meat-heavy', label: 'Meat Heavy',  desc: 'Meat in most meals',             emoji: '🥩', color: '#f87171' },
];

const STEPS = [
  { label: 'Transport',   icon: Car,         color: '#60a5fa' },
  { label: 'Diet',        icon: Leaf,        color: '#4ade80' },
  { label: 'Electricity', icon: Zap,         color: '#facc15' },
  { label: 'Shopping',    icon: ShoppingBag, color: '#a78bfa' },
];

/* ─── Slider ─────────────────────────────────────────────────────── */
function GreenSlider({ value, min, max, onChange }: {
  value: number; min: number; max: number; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ position: 'relative' }}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          height: 6,
          borderRadius: 999,
          appearance: 'none',
          cursor: 'pointer',
          outline: 'none',
          background: `linear-gradient(to right, #22c55e ${pct}%, rgba(15,46,23,0.9) ${pct}%)`,
          accentColor: '#22c55e',
        }}
      />
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          cursor: pointer;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.2), 0 2px 8px rgba(0,0,0,0.4);
          border: 2px solid rgba(255,255,255,0.15);
        }
        input[type='range']::-webkit-slider-thumb:active {
          box-shadow: 0 0 0 6px rgba(34,197,94,0.15), 0 2px 8px rgba(0,0,0,0.4);
        }
      `}</style>
    </div>
  );
}

/* ─── Step 1: Transport ──────────────────────────────────────────── */
function StepTransport({ data, onChange }: {
  data: AssessmentFormData;
  onChange: (k: keyof AssessmentFormData, v: string | number) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
          How do you get around?
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Select your primary mode of transport
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {TRANSPORT_OPTIONS.slice(0, 4).map((opt) => {
          const Icon = opt.icon;
          const sel = data.transport_mode === opt.key;
          return (
            <OptionTile
              key={opt.key}
              selected={sel}
              color={opt.color}
              bg={opt.bg}
              onClick={() => onChange('transport_mode', opt.key)}
            >
              <Icon size={20} color={sel ? opt.color : 'rgba(134,239,172,0.5)'} />
              <span style={{ fontSize: 11, fontWeight: 600, color: sel ? opt.color : 'var(--text-muted)', marginTop: 4 }}>
                {opt.label}
              </span>
            </OptionTile>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {TRANSPORT_OPTIONS.slice(4).map((opt) => {
          const Icon = opt.icon;
          const sel = data.transport_mode === opt.key;
          return (
            <OptionTile
              key={opt.key}
              selected={sel}
              color={opt.color}
              bg={opt.bg}
              onClick={() => onChange('transport_mode', opt.key)}
            >
              <Icon size={20} color={sel ? opt.color : 'rgba(134,239,172,0.5)'} />
              <span style={{ fontSize: 11, fontWeight: 600, color: sel ? opt.color : 'var(--text-muted)', marginTop: 4 }}>
                {opt.label}
              </span>
            </OptionTile>
          );
        })}
      </div>

      <div style={{
        background: 'rgba(7,26,13,0.7)',
        border: '1px solid rgba(34,197,94,0.12)',
        borderRadius: 12,
        padding: '16px 18px',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Weekly distance</span>
          <span style={{
            background: 'rgba(34,197,94,0.12)',
            color: '#4ade80',
            fontSize: 13, fontWeight: 700,
            padding: '3px 12px', borderRadius: 999,
          }}>
            {data.transport_km_per_week} km/wk
          </span>
        </div>
        <GreenSlider value={data.transport_km_per_week} min={0} max={500}
          onChange={(v) => onChange('transport_km_per_week', v)} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
          <span>0 km</span><span>250 km</span><span>500 km</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: Food ───────────────────────────────────────────────── */
function StepFood({ data, onChange }: {
  data: AssessmentFormData;
  onChange: (k: keyof AssessmentFormData, v: string | number) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
          What's your diet like?
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Food accounts for up to 30% of your carbon footprint
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {FOOD_OPTIONS.map((opt) => {
          const sel = data.food_type === opt.key;
          return (
            <motion.button
              key={opt.key}
              type="button"
              onClick={() => onChange('food_type', opt.key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                position: 'relative',
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px',
                borderRadius: 12,
                border: `1.5px solid ${sel ? opt.color : 'rgba(34,197,94,0.12)'}`,
                background: sel ? `${opt.color}14` : 'rgba(7,26,13,0.6)',
                cursor: 'pointer', textAlign: 'left',
                transition: 'border-color 0.2s, background 0.2s',
                boxShadow: sel ? `0 0 20px ${opt.color}18` : 'none',
              }}
            >
              {sel && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute', top: -8, right: -8,
                    width: 20, height: 20, borderRadius: '50%',
                    background: opt.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Check size={11} color="white" strokeWidth={3} />
                </motion.div>
              )}
              <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{opt.emoji}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: sel ? opt.color : 'var(--text)' }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {opt.desc}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        background: 'rgba(34,197,94,0.06)',
        border: '1px solid rgba(34,197,94,0.14)',
        borderRadius: 10, padding: '12px 14px',
      }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>🌱</span>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          A plant-based diet saves up to{' '}
          <strong style={{ color: '#4ade80' }}>0.8 tonnes of CO₂</strong> per year
          compared to a meat-heavy diet.
        </p>
      </div>
    </div>
  );
}

/* ─── Step 3: Electricity ────────────────────────────────────────── */
function StepElectricity({ data, onChange }: {
  data: AssessmentFormData;
  onChange: (k: keyof AssessmentFormData, v: string | number) => void;
}) {
  const units = data.electricity_units;
  const { label: lvlLabel, color: lvlColor } =
    units < 100  ? { label: 'Low',       color: '#4ade80' } :
    units < 250  ? { label: 'Moderate',  color: '#fbbf24' } :
    units < 400  ? { label: 'High',      color: '#fb923c' } :
                   { label: 'Very High', color: '#f87171' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
          Monthly electricity usage
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Check your electricity bill for the kWh units consumed
        </p>
      </div>

      {/* Central counter */}
      <div style={{
        background: 'rgba(7,26,13,0.7)',
        border: '1px solid rgba(250,204,21,0.15)',
        borderRadius: 14, padding: '28px 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'rgba(250,204,21,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 24px rgba(250,204,21,0.15)',
        }}>
          <Zap size={30} color="#facc15" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <CounterBtn onClick={() => onChange('electricity_units', Math.max(0, units - 10))} label="−" />
          <div style={{ textAlign: 'center' }}>
            <input
              type="number"
              min={0}
              max={2000}
              value={units}
              onChange={(e) => onChange('electricity_units', Math.max(0, Math.min(2000, Number(e.target.value))))}
              style={{
                width: 110,
                background: 'rgba(7,26,13,0.8)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 10,
                color: 'var(--text)',
                textAlign: 'center',
                fontSize: 28, fontWeight: 800,
                padding: '8px 4px',
                outline: 'none',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>kWh / month</div>
          </div>
          <CounterBtn onClick={() => onChange('electricity_units', Math.min(2000, units + 10))} label="+" />
        </div>

        <span style={{
          background: `${lvlColor}18`,
          color: lvlColor,
          border: `1px solid ${lvlColor}40`,
          borderRadius: 999, fontSize: 12, fontWeight: 600,
          padding: '4px 14px',
        }}>
          {lvlLabel} Consumption
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { tip: 'Average Indian household uses ~90 kWh/month', icon: '💡' },
          { tip: 'Switch to LED bulbs to save up to 15 kWh/month', icon: '🔆' },
          { tip: 'Unplug standby devices to save 10% energy', icon: '🔌' },
        ].map(({ tip, icon }) => (
          <div key={tip} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(250,204,21,0.04)',
            border: '1px solid rgba(250,204,21,0.1)',
            borderRadius: 8, padding: '10px 14px',
          }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 4: Shopping ───────────────────────────────────────────── */
function StepShopping({ data, onChange }: {
  data: AssessmentFormData;
  onChange: (k: keyof AssessmentFormData, v: string | number) => void;
}) {
  const orders = data.shopping_orders_per_month;
  const { label, color } =
    orders === 0  ? { label: 'Zero waste 🏆', color: '#4ade80' } :
    orders <= 3   ? { label: 'Minimal',        color: '#4ade80' } :
    orders <= 8   ? { label: 'Moderate',       color: '#fbbf24' } :
    orders <= 15  ? { label: 'Heavy',          color: '#fb923c' } :
                    { label: 'Shopaholic 😅',  color: '#f87171' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
          Online shopping habits
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Packaging, shipping & returns all add to your footprint
        </p>
      </div>

      <div style={{
        background: 'rgba(7,26,13,0.7)',
        border: '1px solid rgba(167,139,250,0.15)',
        borderRadius: 14, padding: '28px 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'rgba(167,139,250,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 24px rgba(167,139,250,0.15)',
        }}>
          <ShoppingBag size={30} color="#a78bfa" />
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 56, fontWeight: 900, lineHeight: 1,
            fontFamily: "'Space Grotesk', sans-serif",
            background: 'linear-gradient(130deg, #22c55e, #4ade80)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            {orders}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>orders / month</div>
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <GreenSlider value={orders} min={0} max={30} onChange={(v) => onChange('shopping_orders_per_month', v)} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
            <span>0</span><span>15</span><span>30</span>
          </div>
        </div>

        <span style={{
          background: `${color}18`,
          color, border: `1px solid ${color}40`,
          borderRadius: 999, fontSize: 12, fontWeight: 600,
          padding: '4px 14px',
        }}>
          {label}
        </span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        background: 'rgba(167,139,250,0.05)',
        border: '1px solid rgba(167,139,250,0.14)',
        borderRadius: 10, padding: '12px 14px',
      }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>📦</span>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Consolidating orders saves CO₂. Avoid next-day delivery to{' '}
          <strong style={{ color: '#a78bfa' }}>reduce shipping emissions by up to 40%</strong>.
        </p>
      </div>
    </div>
  );
}

/* ─── Helper sub-components ──────────────────────────────────────── */
function OptionTile({ children, selected, color, bg, onClick }: {
  children: React.ReactNode;
  selected: boolean;
  color: string;
  bg: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '14px 8px', gap: 6,
        borderRadius: 12,
        border: `1.5px solid ${selected ? color : 'rgba(34,197,94,0.12)'}`,
        background: selected ? bg : 'rgba(7,26,13,0.6)',
        cursor: 'pointer',
        boxShadow: selected ? `0 0 16px ${color}25` : 'none',
        transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
      }}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'absolute', top: -7, right: -7,
            width: 18, height: 18, borderRadius: '50%',
            background: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Check size={10} color="white" strokeWidth={3} />
        </motion.div>
      )}
      {children}
    </motion.button>
  );
}

function CounterBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      style={{
        width: 40, height: 40, borderRadius: 10,
        background: 'rgba(34,197,94,0.12)',
        border: '1px solid rgba(34,197,94,0.2)',
        color: '#4ade80', fontSize: 20, fontWeight: 700,
        cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {label}
    </motion.button>
  );
}

function Spinner() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5}
      style={{ animation: 'spin 0.8s linear infinite' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AssessmentFormData>({
    transport_mode: '',
    transport_km_per_week: 50,
    food_type: '',
    electricity_units: 90,
    shopping_orders_per_month: 4,
  });

  const handleChange = (key: keyof AssessmentFormData, value: string | number) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const validateStep = () => {
    if (step === 0 && !formData.transport_mode) {
      toast.error('Please select your transport mode.'); return false;
    }
    if (step === 1 && !formData.food_type) {
      toast.error('Please select your diet type.'); return false;
    }
    return true;
  };

  const goNext = () => { if (!validateStep()) return; setDirection(1); setStep((s) => s + 1); };
  const goPrev = () => { setDirection(-1); setStep((s) => s - 1); };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await assessmentApi.submit(formData);
      toast.success('Assessment complete! 🌍');
      navigate('/assessment-result', { state: { result: res.data } });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string; message?: string } } };
      toast.error(e?.response?.data?.message ?? e?.response?.data?.error ?? 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    initial: (dir: number) => ({ x: dir * 48, opacity: 0 }),
    animate: { x: 0, opacity: 1, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
    exit:    (dir: number) => ({ x: -dir * 48, opacity: 0, transition: { duration: 0.2 } }),
  };

  const stepContent = [
    <StepTransport  key="transport"   data={formData} onChange={handleChange} />,
    <StepFood       key="food"        data={formData} onChange={handleChange} />,
    <StepElectricity key="electricity" data={formData} onChange={handleChange} />,
    <StepShopping   key="shopping"    data={formData} onChange={handleChange} />,
  ];

  const progress = ((step + 1) / STEPS.length) * 100;
  const stepMeta = STEPS[step];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
    }}>
      {/* Subtle background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 60% at 20% 10%, rgba(34,197,94,0.06) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 80% 90%, rgba(74,222,128,0.04) 0%, transparent 55%)',
      }} />
      <div className="grid-bg" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 560, position: 'relative', zIndex: 1 }}
      >
        {/* ── Top brand row ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Leaf size={16} color="white" strokeWidth={2.5} />
            </div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: 16,
              background: 'linear-gradient(130deg, #22c55e, #4ade80)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              CarbonSense
            </span>
          </div>
          <span style={{
            fontSize: 12, color: 'var(--text-muted)',
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.14)',
            borderRadius: 999, padding: '4px 12px',
          }}>
            Step {step + 1} of {STEPS.length}
          </span>
        </div>

        {/* ── Step indicators ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <React.Fragment key={s.label}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? 'linear-gradient(135deg,#22c55e,#16a34a)' : active ? `${s.color}18` : 'rgba(7,26,13,0.8)',
                  border: `1.5px solid ${done ? '#22c55e' : active ? s.color : 'rgba(34,197,94,0.14)'}`,
                  boxShadow: active ? `0 0 12px ${s.color}44` : 'none',
                  transition: 'all 0.3s',
                }}>
                  {done
                    ? <Check size={15} color="white" strokeWidth={2.5} />
                    : <Icon size={15} color={active ? s.color : 'rgba(134,239,172,0.3)'} />
                  }
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, borderRadius: 999, background: 'rgba(34,197,94,0.08)', overflow: 'hidden' }}>
                    <motion.div
                      style={{ height: '100%', background: 'linear-gradient(90deg,#22c55e,#4ade80)', borderRadius: 999 }}
                      animate={{ width: i < step ? '100%' : '0%' }}
                      transition={{ duration: 0.45, ease: 'easeInOut' }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Progress bar ── */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 18, color: stepMeta.color, fontFamily: "'Space Grotesk', sans-serif" }}>
              {stepMeta.label}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{Math.round(progress)}% complete</span>
          </div>
          <div style={{ height: 4, background: 'rgba(34,197,94,0.08)', borderRadius: 999, overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', background: `linear-gradient(90deg, ${stepMeta.color}, #4ade80)`, borderRadius: 999 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* ── Step card ── */}
        <div style={{
          background: 'rgba(7,26,13,0.6)',
          border: '1px solid rgba(34,197,94,0.12)',
          borderRadius: 18,
          padding: '28px 24px',
          marginTop: 20,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
          /* No overflow:hidden — that was clipping text at edges */
        }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {stepContent[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Navigation ── */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <motion.button
            type="button"
            onClick={goPrev}
            disabled={step === 0}
            whileHover={step > 0 ? { scale: 1.02 } : {}}
            whileTap={step > 0 ? { scale: 0.97 } : {}}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '12px 20px', borderRadius: 10,
              border: '1px solid rgba(34,197,94,0.25)',
              background: 'transparent', color: '#4ade80',
              fontSize: 14, fontWeight: 600, cursor: step === 0 ? 'not-allowed' : 'pointer',
              opacity: step === 0 ? 0.28 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            <ChevronLeft size={16} /> Back
          </motion.button>

          {step < STEPS.length - 1 ? (
            <motion.button
              type="button"
              onClick={goNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary"
              style={{ flex: 1, padding: '12px 0', fontSize: 15, borderRadius: 10 }}
            >
              <span>Continue</span>
              <ChevronRight size={16} />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.97 } : {}}
              className="btn-primary"
              style={{ flex: 1, padding: '12px 0', fontSize: 15, borderRadius: 10 }}
            >
              {isSubmitting ? (
                <><Spinner /><span>Calculating…</span></>
              ) : (
                <><Leaf size={16} /><span>Calculate My Footprint</span></>
              )}
            </motion.button>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(134,239,172,0.35)', marginTop: 16 }}>
          Your data is used only to personalise your eco tips & challenges 🔒
        </p>
      </motion.div>
    </div>
  );
}
